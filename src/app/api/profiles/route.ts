import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { UserProfile, AppProgress } from '@/types';
import { getSupabase, testSupabaseConnection } from '@/lib/supabase';
import { getAccountFromRequest } from '@/lib/auth';
import { familyProfileRequest } from '@/lib/backend/family-profiles';
import { mergeSessions } from '@/lib/learning/progress';
import {mergeStoryLibrary} from '@/lib/stories/library';
import {mergeStickers,mergeStickerStudyDays,progressResetTime} from '@/lib/stickers';
import {mergeIpaPractice} from '@/lib/ipa/practice';
import {
  isPostgresConfigured,
  testPostgresConnection,
  pgGetProfiles,
  pgGetProfilesByOwner,
  pgLoginProfile,
  pgCreateProfile,
  pgSyncProgress,
  pgUpdateProfile,
  pgDeleteProfile,
} from '@/lib/postgres';

export const runtime = 'nodejs';

const DATA_DIR = process.env.VOCAKIDS_DATA_DIR || path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'profiles_store.json');

interface StoreData {
  profiles: UserProfile[];
  progresses: Record<string, AppProgress>;
}

const DEFAULT_STORE: StoreData = {
  profiles: [
    {
      id: 'default',
      name: 'Bé Yêu',
      avatar: '🦁',
      gradeId: 'lop1',
      color: 'orange',
      createdAt: '2026-10-02',
      code: 'BEYEU01',
    },
  ],
  progresses: {
    default: {
      totalStars: 0,
      streak: 0,
      lastActiveDate: '',
      wordProgress: {},
      dailyStats: [],
      stickers: [],
      badges: [],
      unitTestResults: {},
      unlockedUnits: [],
      totalPoints: 0,
    },
  },
};

function ensureStore(): StoreData {
  try {
    // Runtime store is provisioned by Docker/volume, not a bundled build asset.
    if (!fs.existsSync(/* turbopackIgnore: true */ DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
      return DEFAULT_STORE;
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.profiles || !Array.isArray(parsed.profiles)) {
      parsed.profiles = DEFAULT_STORE.profiles;
    }
    if (!parsed.progresses || typeof parsed.progresses !== 'object') {
      parsed.progresses = DEFAULT_STORE.progresses;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading profiles_store.json:', e);
    return DEFAULT_STORE;
  }
}

function saveStore(data: StoreData) {
  if (!fs.existsSync(/* turbopackIgnore: true */ DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const temporary = `${STORE_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(temporary, STORE_FILE);
}

/** Generate a friendly, memorable code for a child like BONG88, AN26, KID12 */
function generateCode(name: string, existingCodes: Set<string>): string {
  const clean = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();

  const prefix = clean.replace(/^BE/, '').slice(0, 5) || 'KID';

  for (let i = 0; i < 50; i++) {
    const num = Math.floor(10 + Math.random() * 90);
    const candidate = `${prefix}${num}`;
    if (!existingCodes.has(candidate)) {
      return candidate;
    }
  }

  return `${prefix}${Date.now().toString().slice(-4)}`;
}

// ── GET /api/profiles ────────────────────────
export async function GET(req: NextRequest) {
  const familyResponse = familyProfileRequest(req);
  if (familyResponse) return familyResponse;
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim().toLowerCase() || '';

  // 0. Nếu người dùng đã đăng nhập tài khoản cá nhân, ưu tiên trả về hồ sơ của tài khoản đó
  const authAccount = getAccountFromRequest(req);
  if (authAccount && isPostgresConfigured() && !query) {
    try {
      const ownerProfiles = await pgGetProfilesByOwner(authAccount.accountId);
      return NextResponse.json({
        success: true,
        profiles: ownerProfiles,
        totalCount: ownerProfiles.length,
        source: 'postgresql_personal_account',
        account: {
          id: authAccount.accountId,
          email: authAccount.email,
          displayName: authAccount.displayName,
        },
      });
    } catch (ownerErr) {
      console.warn('[PostgreSQL owner profiles fetch error]:', ownerErr);
    }
  }

  // 1. Thử truy vấn từ PostgreSQL trước nếu đã cấu hình (DATABASE_URL / POSTGRES_URL)
  if (isPostgresConfigured()) {
    try {
      const pgProfiles = await pgGetProfiles(query || undefined);
      if (Array.isArray(pgProfiles) && pgProfiles.length > 0) {
        return NextResponse.json({
          success: true,
          profiles: pgProfiles,
          totalCount: pgProfiles.length,
          source: 'postgresql',
        });
      }
    } catch (pgErr) {
      console.warn('[PostgreSQL GET failed, falling back to Supabase/local]:', pgErr);
    }
  }

  // 2. Thử truy vấn từ Supabase Cloud nếu đã cấu hình
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        // Lấy tổng số sao từ bảng user_progress
        const { data: progRows } = await supabase
          .from('user_progress')
          .select('profile_id, stars');

        const starsMap: Record<string, number> = {};
        if (progRows) {
          for (const row of progRows) {
            starsMap[row.profile_id] = (starsMap[row.profile_id] || 0) + (row.stars || 0);
          }
        }

        let cloudProfiles: UserProfile[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          avatar: row.avatar || '🐰',
          gradeId: row.grade_id || 'lop1',
          color: row.color || 'from-orange-400 to-amber-500',
          code: row.code,
          createdAt: row.created_at ? row.created_at.split('T')[0] : '2026-10-02',
        }));

        if (query) {
          cloudProfiles = cloudProfiles.filter((p) => {
            const matchName = p.name.toLowerCase().includes(query);
            const matchCode = (p.code || '').toLowerCase().includes(query);
            const matchId = p.id.toLowerCase() === query;
            return matchName || matchCode || matchId;
          });
        }

        const profilesWithStars = cloudProfiles.map((p) => ({
          ...p,
          totalStars: starsMap[p.id] || 0,
          streak: 1,
        }));

        return NextResponse.json({
          success: true,
          profiles: profilesWithStars,
          totalCount: cloudProfiles.length,
          source: 'supabase_cloud',
        });
      }
    } catch (err) {
      console.warn('Supabase GET profiles failed, fallback to local store:', err);
    }
  }

  // 3. Fallback sang local store (JSON file)
  const store = ensureStore();
  let list = store.profiles;
  if (query) {
    list = list.filter((p) => {
      const matchName = p.name.toLowerCase().includes(query);
      const matchCode = (p.code || '').toLowerCase().includes(query);
      const matchId = p.id.toLowerCase() === query;
      return matchName || matchCode || matchId;
    });
  }

  const profilesWithStars = list.map((p) => {
    const prog = store.progresses[p.id];
    return {
      ...p,
      totalStars: prog?.totalStars ?? 0,
      streak: prog?.streak ?? 0,
    };
  });

  return NextResponse.json({
    success: true,
    profiles: profilesWithStars,
    totalCount: store.profiles.length,
    source: 'local_file',
  });
}

// ── POST /api/profiles ───────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const familyResponse = familyProfileRequest(req, body);
    if (familyResponse) return familyResponse;
    const { action } = body;
    const store = ensureStore();
    const existingCodes = new Set(store.profiles.map((p) => (p.code || '').toUpperCase()));
    const supabase = getSupabase();

    // ── Action: TEST_POSTGRES ──
    if (action === 'test_postgres') {
      const result = await testPostgresConnection();
      return NextResponse.json(result);
    }

    // ── Action: TEST_SUPABASE ──
    if (action === 'test_supabase') {
      const result = await testSupabaseConnection(body.url, body.anonKey);
      return NextResponse.json(result);
    }

    // ── Action: LOGIN (by name, account code or id) ──
    if (action === 'login') {
      const query = (body.query || '').trim();
      if (!query) {
        return NextResponse.json(
          { success: false, message: 'Vui lòng nhập tên bé hoặc mã tài khoản!' },
          { status: 400 }
        );
      }

      // 1. Thử đăng nhập từ PostgreSQL trước
      if (isPostgresConfigured()) {
        try {
          const pgLogin = await pgLoginProfile(query);
          if (pgLogin) {
            return NextResponse.json({
              success: true,
              profile: pgLogin.profile,
              progress: pgLogin.progress,
              source: 'postgresql',
              message: `Chào mừng ${pgLogin.profile.name} đã đăng nhập từ PostgreSQL! 🎉`,
            });
          }
        } catch (pgErr) {
          console.warn('[PostgreSQL login failed, trying fallback]:', pgErr);
        }
      }

      const qNorm = query.toLowerCase();
      const qCode = query.toUpperCase();

      // 2. Kiểm tra Supabase Cloud nếu có
      if (supabase) {
        try {
          const { data: cloudMatches } = await supabase
            .from('user_profiles')
            .select('*')
            .or(`code.eq.${qCode},name.ilike.%${query}%`);

          if (cloudMatches && cloudMatches.length > 0) {
            const matchedRow = cloudMatches[0];
            const p: UserProfile = {
              id: matchedRow.id,
              name: matchedRow.name,
              avatar: matchedRow.avatar || '🐰',
              gradeId: matchedRow.grade_id || 'lop1',
              color: matchedRow.color || 'orange',
              code: matchedRow.code,
              createdAt: matchedRow.created_at ? matchedRow.created_at.split('T')[0] : '2026-10-02',
            };

            // Lấy progress từ user_progress
            const { data: progData } = await supabase
              .from('user_progress')
              .select('*')
              .eq('profile_id', p.id);

            const wpMap: Record<string, any> = {};
            let totalStars = 0;
            if (progData) {
              for (const row of progData) {
                wpMap[row.word_id] = {
                  wordId: row.word_id,
                  catId: row.cat_id,
                  stars: row.stars,
                  attempts: row.attempts,
                  bestScore: row.best_score,
                  lastPracticed: row.last_practiced,
                };
                totalStars += row.stars || 0;
              }
            }

            // Lấy stickers từ user_stickers
            const { data: stickerRows } = await supabase
              .from('user_stickers')
              .select('sticker_id')
              .eq('profile_id', p.id);

            const stickers = stickerRows ? stickerRows.map((r: any) => r.sticker_id) : [];

            const progress: AppProgress = {
              totalStars,
              streak: 1,
              lastActiveDate: new Date().toISOString().split('T')[0],
              wordProgress: wpMap,
              dailyStats: [],
              stickers,
              badges: [],
              unitTestResults: {},
              unlockedUnits: [],
              totalPoints: totalStars * 10,
            };

            return NextResponse.json({
              success: true,
              profile: p,
              progress,
              source: 'supabase_cloud',
              message: `Chào mừng ${p.name} đã đăng nhập từ Supabase Cloud! 🎉`,
            });
          }
        } catch (err) {
          console.warn('Supabase login check error:', err);
        }
      }

      // 3. Local fallback
      let matched = store.profiles.find((p) => (p.code || '').toUpperCase() === qCode);
      if (!matched) {
        matched = store.profiles.find((p) => p.name.toLowerCase() === qNorm);
      }
      if (!matched) {
        matched = store.profiles.find((p) => p.name.toLowerCase().includes(qNorm));
      }

      if (!matched) {
        return NextResponse.json({
          success: false,
          message: `Không tìm thấy bé với tên hoặc mã "${query}". Bạn hãy kiểm tra lại mã hoặc tạo tài khoản mới cho bé nhé!`,
        });
      }

      const progress = store.progresses[matched.id] || {
        totalStars: 0,
        streak: 0,
        lastActiveDate: '',
        wordProgress: {},
        dailyStats: [],
        stickers: [],
        badges: [],
        unitTestResults: {},
        unlockedUnits: [],
        totalPoints: 0,
      };

      return NextResponse.json({
        success: true,
        profile: matched,
        progress,
        source: 'local_file',
        message: `Chào mừng ${matched.name} đã đăng nhập! 🎉`,
      });
    }

    // ── Action: CREATE (new child profile) ──
    if (action === 'create') {
      const pData: Partial<UserProfile> = body.profile || {};
      if (!pData.name?.trim()) {
        return NextResponse.json(
          { success: false, message: 'Tên của bé không được để trống!' },
          { status: 400 }
        );
      }

      const id = pData.id || `child_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const code = (pData.code?.trim().toUpperCase()) || generateCode(pData.name, existingCodes);

      const authAccount = getAccountFromRequest(req);
      const newProfile: UserProfile & { ownerId?: string } = {
        id,
        name: pData.name.trim(),
        avatar: pData.avatar || '🐰',
        gradeId: pData.gradeId || 'lop1',
        color: pData.color || 'from-orange-400 to-amber-500',
        createdAt: pData.createdAt || new Date().toISOString().split('T')[0],
        code,
        ownerId: authAccount ? authAccount.accountId : undefined,
      };

      const initialProg: AppProgress = body.progress || {
        totalStars: 0,
        streak: 0,
        lastActiveDate: '',
        wordProgress: {},
        dailyStats: [],
        stickers: [],
        badges: [],
        unitTestResults: {},
        unlockedUnits: [],
        totalPoints: 0,
      };

      // 1. Lưu vào PostgreSQL nếu cấu hình
      if (isPostgresConfigured()) {
        try {
          await pgCreateProfile(newProfile, initialProg);
        } catch (pgErr) {
          console.warn('[PostgreSQL Create Profile failed]:', pgErr);
        }
      }

      // 2. Lưu vào local JSON store
      store.profiles.push(newProfile);
      store.progresses[id] = initialProg;
      saveStore(store);

      // 3. Đồng bộ lên Supabase nếu có
      if (supabase) {
        try {
          await supabase.from('user_profiles').upsert({
            id: newProfile.id,
            name: newProfile.name,
            avatar: newProfile.avatar,
            grade_id: newProfile.gradeId,
            color: newProfile.color,
            code: newProfile.code,
            updated_at: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Supabase upsert on create failed:', e);
        }
      }

      return NextResponse.json({
        success: true,
        profile: newProfile,
        progress: initialProg,
        message: `Đã tạo tài khoản cho ${newProfile.name} với Mã: ${newProfile.code}! 🎉`,
      });
    }

    // ── Action: SYNC (merge & persist progress) ──
    if (action === 'sync') {
      const profileId = body.profileId;
      if (!profileId) {
        return NextResponse.json({ success: false, message: 'Thiếu profileId' }, { status: 400 });
      }

      const incomingProg: AppProgress = body.progress;
      if (!incomingProg) {
        return NextResponse.json({ success: false, message: 'Thiếu dữ liệu progress' }, { status: 400 });
      }

      // Đảm bảo profile tồn tại trong store
      if (!store.profiles.some((p) => p.id === profileId) && body.profile) {
        const p = body.profile;
        const code = p.code?.toUpperCase() || generateCode(p.name, existingCodes);
        store.profiles.push({
          id: profileId,
          name: p.name || 'Bé Yêu',
          avatar: p.avatar || '🦁',
          gradeId: p.gradeId || 'lop1',
          color: p.color || 'orange',
          createdAt: p.createdAt || new Date().toISOString().split('T')[0],
          code,
        });
      }

      const saved = store.progresses[profileId];
      if (saved && progressResetTime(incomingProg) < progressResetTime(saved)) return NextResponse.json({success:true,message:'Tiến độ đã được đặt lại trên thiết bị khác. Tải lại hồ sơ.'});
      const current = (saved && progressResetTime(incomingProg) <= progressResetTime(saved) ? saved : null) || {
        totalStars: 0,
        streak: 0,
        lastActiveDate: '',
        wordProgress: {},
        dailyStats: [],
        stickers: [],
        badges: [],
        unitTestResults: {},
        unlockedUnits: [],
        totalPoints: 0,
      };

      const mergedWordProgress = { ...current.wordProgress };
      for (const [key, wp] of Object.entries(incomingProg.wordProgress || {})) {
        const previous = mergedWordProgress[key];
        if (!previous || wp.attempts >= previous.attempts) {
          mergedWordProgress[key] = { ...wp, stars: Math.max(previous?.stars ?? 0, wp.stars), bestScore: Math.max(previous?.bestScore ?? 0, wp.bestScore) };
        }
      }

      const mergedProgress: AppProgress = {
        progressResetAt: incomingProg.progressResetAt ?? current.progressResetAt,
        ...mergeStoryLibrary(current,incomingProg,profileId),
        ipaPractice: mergeIpaPractice(current.ipaPractice,incomingProg.ipaPractice,profileId),
        learningSessions: mergeSessions(current.learningSessions, incomingProg.learningSessions),
        learningRewardKeys: [...new Set([...(current.learningRewardKeys ?? []), ...(incomingProg.learningRewardKeys ?? [])])],
        totalStars: Math.max(current.totalStars, incomingProg.totalStars || 0),
        streak: Math.max(current.streak, incomingProg.streak || 0),
        lastActiveDate: incomingProg.lastActiveDate || current.lastActiveDate,
        wordProgress: mergedWordProgress,
        dailyStats: incomingProg.dailyStats?.length ? incomingProg.dailyStats : current.dailyStats,
        stickers: mergeStickers(current.stickers,incomingProg.stickers),
        stickerStudyDays: mergeStickerStudyDays(current.stickerStudyDays,incomingProg.stickerStudyDays),
        badges: incomingProg.badges ?? current.badges ?? [],
        unitTestResults: { ...(current.unitTestResults ?? {}), ...(incomingProg.unitTestResults ?? {}) },
        unlockedUnits: [...new Set([...(current.unlockedUnits ?? []), ...(incomingProg.unlockedUnits ?? [])])],
        totalPoints: Math.max(current.totalPoints ?? 0, incomingProg.totalPoints ?? 0),
      };

      // 1. Lưu vào PostgreSQL
      if (isPostgresConfigured()) {
        try {
          await pgSyncProgress(profileId, mergedProgress, body.profile);
        } catch (pgErr) {
          console.warn('[PostgreSQL Sync Progress failed]:', pgErr);
        }
      }

      // 2. Lưu vào local JSON store
      store.progresses[profileId] = mergedProgress;
      saveStore(store);

      // 3. Đẩy lên Supabase Cloud
      if (supabase) {
        try {
          if (body.profile) {
            await supabase.from('user_profiles').upsert({
              id: profileId,
              name: body.profile.name,
              avatar: body.profile.avatar,
              grade_id: body.profile.gradeId,
              color: body.profile.color,
              code: body.profile.code,
              updated_at: new Date().toISOString(),
            });
          }

          const progressRows = Object.values(mergedWordProgress).map((wp) => ({
            id: `${profileId}:${wp.wordId}`,
            profile_id: profileId,
            cat_id: wp.catId,
            word_id: wp.wordId,
            stars: wp.stars,
            attempts: wp.attempts,
            best_score: wp.bestScore,
            last_practiced: wp.lastPracticed,
            updated_at: new Date().toISOString(),
          }));

          if (progressRows.length > 0) {
            await supabase.from('user_progress').upsert(progressRows, { onConflict: 'id' });
          }

          if (mergedProgress.stickers && mergedProgress.stickers.length > 0) {
            const stickerRows = mergedProgress.stickers.map((sid: any) => ({
              id: `${profileId}:${typeof sid === 'string' ? sid : sid.id}`,
              profile_id: profileId,
              sticker_id: typeof sid === 'string' ? sid : sid.id,
              unlocked_at: new Date().toISOString(),
            }));
            await supabase.from('user_stickers').upsert(stickerRows, { onConflict: 'id' });
          }
        } catch (e) {
          console.warn('Supabase background sync failed:', e);
        }
      }

      return NextResponse.json({
        success: true,
        progress: mergedProgress,
      });
    }

    // ── Action: UPDATE (update child profile) ──
    if (action === 'update') {
      const profileId = body.profileId;
      const idx = store.profiles.findIndex((p) => p.id === profileId);
      if (idx === -1 && !isPostgresConfigured()) {
        return NextResponse.json({ success: false, message: 'Không tìm thấy bé' }, { status: 404 });
      }

      const updateData = body.data || {};

      // 1. Update PostgreSQL
      if (isPostgresConfigured()) {
        try {
          await pgUpdateProfile(profileId, updateData);
        } catch (pgErr) {
          console.warn('[PostgreSQL Update Profile failed]:', pgErr);
        }
      }

      // 2. Update local JSON store
      if (idx !== -1) {
        store.profiles[idx] = {
          ...store.profiles[idx],
          ...updateData,
          code: updateData.code ? updateData.code.toUpperCase() : store.profiles[idx].code,
        };
        saveStore(store);
      }

      // 3. Update Supabase
      if (supabase) {
        try {
          const profileToUpdate = idx !== -1 ? store.profiles[idx] : updateData;
          await supabase.from('user_profiles').update({
            name: profileToUpdate.name,
            avatar: profileToUpdate.avatar,
            grade_id: profileToUpdate.gradeId,
            color: profileToUpdate.color,
            code: profileToUpdate.code,
            updated_at: new Date().toISOString(),
          }).eq('id', profileId);
        } catch (e) {
          console.warn('Supabase update profile failed:', e);
        }
      }

      return NextResponse.json({
        success: true,
        profile: idx !== -1 ? store.profiles[idx] : { id: profileId, ...updateData },
      });
    }

    // ── Action: DELETE ──
    if (action === 'delete') {
      const profileId = body.profileId;

      // 1. Delete from PostgreSQL
      if (isPostgresConfigured()) {
        try {
          await pgDeleteProfile(profileId);
        } catch (pgErr) {
          console.warn('[PostgreSQL Delete Profile failed]:', pgErr);
        }
      }

      // 2. Delete from local JSON store
      store.profiles = store.profiles.filter((p) => p.id !== profileId);
      delete store.progresses[profileId];
      saveStore(store);

      // 3. Delete from Supabase
      if (supabase) {
        try {
          await supabase.from('user_profiles').delete().eq('id', profileId);
          await supabase.from('user_progress').delete().eq('profile_id', profileId);
          await supabase.from('user_stickers').delete().eq('profile_id', profileId);
          await supabase.from('user_daily_stats').delete().eq('profile_id', profileId);
        } catch (e) {
          console.warn('Supabase delete profile failed:', e);
        }
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (e: any) {
    console.error('Error in /api/profiles:', e);
    return NextResponse.json({ success: false, message: e.message || 'Lỗi server' }, { status: 500 });
  }
}
