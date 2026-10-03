// =============================================
// VocaKids – Supabase Sync Service
// Dịch vụ đồng bộ dữ liệu hai chiều: Cloud & Local
// Hoạt động ngầm, không làm chậm giao diện của bé
// =============================================

import { getSupabase, isSupabaseConfigured } from './supabase';
import { UserProfile, WordProgress, DailyStats, Category } from '@/types';

// ── PROFILES SYNC ─────────────────────────────────────────────────────────────

export async function fetchProfilesFromCloud(): Promise<UserProfile[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      avatar: row.avatar,
      gradeId: row.grade_id,
      color: row.color,
      code: row.code,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.warn('[Supabase Sync] fetchProfiles error:', err);
    return null;
  }
}

export async function upsertProfileToCloud(profile: UserProfile): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('user_profiles').upsert(
      {
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar,
        grade_id: profile.gradeId,
        color: profile.color,
        code: profile.code,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    return !error;
  } catch (err) {
    console.warn('[Supabase Sync] upsertProfile error:', err);
    return false;
  }
}

export async function deleteProfileFromCloud(profileId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    await supabase.from('user_profiles').delete().eq('id', profileId);
    await supabase.from('user_progress').delete().eq('profile_id', profileId);
    await supabase.from('user_stickers').delete().eq('profile_id', profileId);
    await supabase.from('user_daily_stats').delete().eq('profile_id', profileId);
    return true;
  } catch (err) {
    console.warn('[Supabase Sync] deleteProfile error:', err);
    return false;
  }
}

// ── PROGRESS SYNC ─────────────────────────────────────────────────────────────

export async function fetchProgressFromCloud(profileId: string): Promise<Record<string, WordProgress> | null> {
  const supabase = getSupabase();
  if (!supabase || !profileId) return null;

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('profile_id', profileId);

    if (error || !data) return null;

    const result: Record<string, WordProgress> = {};
    for (const row of data) {
      result[row.word_id] = {
        wordId: row.word_id,
        catId: row.cat_id,
        stars: row.stars,
        attempts: row.attempts,
        bestScore: row.best_score,
        lastPracticed: row.last_practiced,
      };
    }
    return result;
  } catch (err) {
    console.warn('[Supabase Sync] fetchProgress error:', err);
    return null;
  }
}

export async function upsertWordProgressToCloud(profileId: string, progress: WordProgress): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || !profileId) return false;

  try {
    const id = `${profileId}:${progress.wordId}`;
    const { error } = await supabase.from('user_progress').upsert(
      {
        id,
        profile_id: profileId,
        cat_id: progress.catId,
        word_id: progress.wordId,
        stars: progress.stars,
        attempts: progress.attempts,
        best_score: progress.bestScore,
        last_practiced: progress.lastPracticed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    return !error;
  } catch (err) {
    console.warn('[Supabase Sync] upsertWordProgress error:', err);
    return false;
  }
}

// ── STICKERS SYNC ─────────────────────────────────────────────────────────────

export async function fetchStickersFromCloud(profileId: string): Promise<string[] | null> {
  const supabase = getSupabase();
  if (!supabase || !profileId) return null;

  try {
    const { data, error } = await supabase
      .from('user_stickers')
      .select('sticker_id')
      .eq('profile_id', profileId);

    if (error || !data) return null;
    return data.map((r: any) => r.sticker_id);
  } catch (err) {
    console.warn('[Supabase Sync] fetchStickers error:', err);
    return null;
  }
}

export async function unlockStickerInCloud(profileId: string, stickerId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || !profileId) return false;

  try {
    const id = `${profileId}:${stickerId}`;
    const { error } = await supabase.from('user_stickers').upsert(
      {
        id,
        profile_id: profileId,
        sticker_id: stickerId,
        unlocked_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
    return !error;
  } catch (err) {
    console.warn('[Supabase Sync] unlockSticker error:', err);
    return false;
  }
}

// ── DAILY STATS SYNC ──────────────────────────────────────────────────────────

export async function fetchDailyStatsFromCloud(profileId: string, date: string): Promise<DailyStats | null> {
  const supabase = getSupabase();
  if (!supabase || !profileId) return null;

  try {
    const id = `${profileId}:${date}`;
    const { data, error } = await supabase
      .from('user_daily_stats')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;

    return {
      date: data.date,
      wordsStudied: data.words_studied,
      totalStars: data.total_stars,
      streak: data.streak,
    };
  } catch (err) {
    console.warn('[Supabase Sync] fetchDailyStats error:', err);
    return null;
  }
}

export async function upsertDailyStatsToCloud(profileId: string, stats: DailyStats): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || !profileId) return false;

  try {
    const id = `${profileId}:${stats.date}`;
    const { error } = await supabase.from('user_daily_stats').upsert(
      {
        id,
        profile_id: profileId,
        date: stats.date,
        words_studied: stats.wordsStudied,
        total_stars: stats.totalStars,
        streak: stats.streak,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
    return !error;
  } catch (err) {
    console.warn('[Supabase Sync] upsertDailyStats error:', err);
    return false;
  }
}

// ── CUSTOM CATEGORIES SYNC ────────────────────────────────────────────────────

export async function fetchCustomCategoriesFromCloud(): Promise<Category[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('custom_categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((r: any) => ({
      id: r.id,
      name_vi: r.name_vi,
      name_en: r.name_en,
      emoji: r.emoji,
      color: 'from-violet-400 to-purple-500',
      gradient: 'bg-gradient-to-br from-violet-100 to-purple-100',
      words: Array.isArray(r.words) ? r.words : [],
    }));
  } catch (err) {
    console.warn('[Supabase Sync] fetchCustomCategories error:', err);
    return null;
  }
}

export async function upsertCustomCategoryToCloud(cat: Category): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('custom_categories').upsert(
      {
        id: cat.id,
        name_vi: cat.name_vi,
        name_en: cat.name_en,
        emoji: cat.emoji,
        words: cat.words,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
    return !error;
  } catch (err) {
    console.warn('[Supabase Sync] upsertCustomCategory error:', err);
    return false;
  }
}

export async function deleteCustomCategoryFromCloud(catId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('custom_categories').delete().eq('id', catId);
    return !error;
  } catch (err) {
    console.warn('[Supabase Sync] deleteCustomCategory error:', err);
    return false;
  }
}

// ── ONE-CLICK FULL SYNC ───────────────────────────────────────────────────────

/**
 * Đẩy toàn bộ dữ liệu đang có trong localStorage lên Supabase Cloud
 */
export async function syncAllLocalToCloud(): Promise<{ success: boolean; message: string; count: number }> {
  if (!isSupabaseConfigured()) {
    return { success: false, message: 'Supabase chưa được kết nối', count: 0 };
  }

  let totalItemsSynced = 0;

  try {
    // 1. Đồng bộ Profiles
    const rawProfiles = localStorage.getItem('vocakids_user_profiles_v1');
    if (rawProfiles) {
      const profiles = JSON.parse(rawProfiles) as UserProfile[];
      for (const p of profiles) {
        const ok = await upsertProfileToCloud(p);
        if (ok) totalItemsSynced++;
      }
    }

    // 2. Đồng bộ Custom Categories
    const rawCustom = localStorage.getItem('vocakids_custom_categories_v1');
    if (rawCustom) {
      const customCats = JSON.parse(rawCustom) as Category[];
      for (const c of customCats) {
        const ok = await upsertCustomCategoryToCloud(c);
        if (ok) totalItemsSynced++;
      }
    }

    // 3. Đồng bộ Tiến trình & Sticker theo từng profile
    const rawProfilesList = rawProfiles ? (JSON.parse(rawProfiles) as UserProfile[]) : [];
    const profileIds = rawProfilesList.map((p) => p.id);
    if (!profileIds.includes('child_be_bong')) profileIds.push('child_be_bong');

    for (const pid of profileIds) {
      // Progress
      const rawProg = localStorage.getItem(`vocakids_progress_v1_${pid}`) || localStorage.getItem('vocakids_progress_v1');
      if (rawProg) {
        const progMap = JSON.parse(rawProg) as Record<string, WordProgress>;
        for (const wp of Object.values(progMap)) {
          const ok = await upsertWordProgressToCloud(pid, wp);
          if (ok) totalItemsSynced++;
        }
      }

      // Stickers
      const rawStickers = localStorage.getItem(`vocakids_stickers_v1_${pid}`) || localStorage.getItem('vocakids_stickers_v1');
      if (rawStickers) {
        const stickers = JSON.parse(rawStickers) as string[];
        for (const sid of stickers) {
          const ok = await unlockStickerInCloud(pid, sid);
          if (ok) totalItemsSynced++;
        }
      }
    }

    return {
      success: true,
      message: `Đồng bộ thành công ${totalItemsSynced} mục lên Supabase Cloud! 🎉`,
      count: totalItemsSynced,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Lỗi đồng bộ: ${err.message || String(err)}`,
      count: totalItemsSynced,
    };
  }
}
