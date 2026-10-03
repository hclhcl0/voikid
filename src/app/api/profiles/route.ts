import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { UserProfile, AppProgress } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
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
    if (!fs.existsSync(DATA_DIR)) {
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
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving profiles_store.json:', e);
  }
}

/** Generate a friendly, memorable code for a child like BONG88, AN26, KID12 */
function generateCode(name: string, existingCodes: Set<string>): string {
  // Remove Vietnamese diacritics and non-alphanumeric
  const clean = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();

  const prefix = clean.replace(/^BE/, '').slice(0, 5) || 'KID';
  
  for (let i = 0; i < 50; i++) {
    const num = Math.floor(10 + Math.random() * 90); // 2-digit number (10-99)
    const candidate = `${prefix}${num}`;
    if (!existingCodes.has(candidate)) {
      return candidate;
    }
  }

  return `${prefix}${Date.now().toString().slice(-4)}`;
}

// ── GET /api/profiles ────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim().toLowerCase() || '';

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

  // Attach totalStars to each profile summary
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
  });
}

// ── POST /api/profiles ───────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const store = ensureStore();
    const existingCodes = new Set(store.profiles.map((p) => (p.code || '').toUpperCase()));

    // ── Action: LOGIN (by name or account code) ──
    if (action === 'login') {
      const query = (body.query || '').trim();
      if (!query) {
        return NextResponse.json(
          { success: false, message: 'Vui lòng nhập tên bé hoặc mã tài khoản!' },
          { status: 400 }
        );
      }

      const qNorm = query.toLowerCase();
      const qCode = query.toUpperCase();

      // Find by exact code match first, then by name match
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
      };

      return NextResponse.json({
        success: true,
        profile: matched,
        progress,
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

      const newProfile: UserProfile = {
        id,
        name: pData.name.trim(),
        avatar: pData.avatar || '🐰',
        gradeId: pData.gradeId || 'lop1',
        color: pData.color || 'orange',
        createdAt: pData.createdAt || new Date().toISOString().split('T')[0],
        code,
      };

      store.profiles.push(newProfile);

      const initialProg: AppProgress = body.progress || {
        totalStars: 0,
        streak: 0,
        lastActiveDate: '',
        wordProgress: {},
        dailyStats: [],
      };
      store.progresses[id] = initialProg;

      saveStore(store);

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

      // If profile does not exist in store, but incoming has profile info, register it
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

      const current = store.progresses[profileId] || {
        totalStars: 0,
        streak: 0,
        lastActiveDate: '',
        wordProgress: {},
        dailyStats: [],
      };

      // Smart merge: take higher stars, latest active date, merged wordProgress
      const mergedWordProgress = { ...current.wordProgress };
      for (const [key, wp] of Object.entries(incomingProg.wordProgress || {})) {
        if (!mergedWordProgress[key] || wp.stars > mergedWordProgress[key].stars) {
          mergedWordProgress[key] = wp;
        }
      }

      const mergedProgress: AppProgress = {
        totalStars: Math.max(current.totalStars, incomingProg.totalStars || 0),
        streak: Math.max(current.streak, incomingProg.streak || 0),
        lastActiveDate: incomingProg.lastActiveDate || current.lastActiveDate,
        wordProgress: mergedWordProgress,
        dailyStats: incomingProg.dailyStats?.length ? incomingProg.dailyStats : current.dailyStats,
        stickers: incomingProg.stickers ?? current.stickers ?? [],
        badges: incomingProg.badges ?? current.badges ?? [],
        unitTestResults: { ...(current.unitTestResults ?? {}), ...(incomingProg.unitTestResults ?? {}) },
        unlockedUnits: [...new Set([...(current.unlockedUnits ?? []), ...(incomingProg.unlockedUnits ?? [])])],
        totalPoints: Math.max(current.totalPoints ?? 0, incomingProg.totalPoints ?? 0),
      };

      store.progresses[profileId] = mergedProgress;
      saveStore(store);

      return NextResponse.json({
        success: true,
        progress: mergedProgress,
      });
    }

    // ── Action: UPDATE (update child profile) ──
    if (action === 'update') {
      const profileId = body.profileId;
      const idx = store.profiles.findIndex((p) => p.id === profileId);
      if (idx === -1) {
        return NextResponse.json({ success: false, message: 'Không tìm thấy bé' }, { status: 404 });
      }

      const updateData = body.data || {};
      store.profiles[idx] = {
        ...store.profiles[idx],
        ...updateData,
        code: updateData.code ? updateData.code.toUpperCase() : store.profiles[idx].code,
      };

      saveStore(store);
      return NextResponse.json({ success: true, profile: store.profiles[idx] });
    }

    // ── Action: DELETE ──
    if (action === 'delete') {
      const profileId = body.profileId;
      store.profiles = store.profiles.filter((p) => p.id !== profileId);
      delete store.progresses[profileId];
      saveStore(store);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (e: any) {
    console.error('Error in /api/profiles:', e);
    return NextResponse.json({ success: false, message: e.message || 'Lỗi server' }, { status: 500 });
  }
}
