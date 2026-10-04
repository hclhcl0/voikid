'use client';

import React, { createContext, useContext, useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { AppProgress, UserProfile, WordProgress, DailyStats, UnitTestResult, Sticker } from '@/types';

export const PROFILES_STORAGE_KEY = 'vocakids_profiles_v1';
export const ACTIVE_PROFILE_STORAGE_KEY = 'vocakids_active_profile_id';
export const LEGACY_PROGRESS_STORAGE_KEY = 'vocakids_progress_v1';

export const DEFAULT_PROFILE: UserProfile = {
  id: 'default',
  name: 'Bé Yêu',
  avatar: '🦁',
  gradeId: 'lop1',
  color: 'orange',
  createdAt: '2026-10-02',
  code: 'BEYEU01',
};

export const AVATAR_LIST = [
  { emoji: '🦁', name: 'Sư tử' },
  { emoji: '🐰', name: 'Thỏ con' },
  { emoji: '🐼', name: 'Gấu trúc' },
  { emoji: '🦊', name: 'Cáo nhỏ' },
  { emoji: '🐱', name: 'Mèo con' },
  { emoji: '🐶', name: 'Cún con' },
  { emoji: '🦄', name: 'Kỳ lân' },
  { emoji: '🦖', name: 'Khủng long' },
  { emoji: '🐻', name: 'Gấu nâu' },
  { emoji: '🐨', name: 'Koala' },
  { emoji: '🐯', name: 'Hổ con' },
  { emoji: '🐥', name: 'Gà con' },
];

export const COLOR_THEMES: Record<string, { bg: string; badge: string; border: string; text: string }> = {
  orange: { bg: 'from-orange-400 to-amber-400', badge: 'bg-orange-100 text-orange-700', border: 'border-orange-300', text: 'text-orange-600' },
  pink:   { bg: 'from-pink-400 to-rose-400',   badge: 'bg-pink-100 text-pink-700',   border: 'border-pink-300',   text: 'text-pink-600' },
  blue:   { bg: 'from-blue-400 to-cyan-400',   badge: 'bg-blue-100 text-blue-700',   border: 'border-blue-300',   text: 'text-blue-600' },
  green:  { bg: 'from-emerald-400 to-teal-400',badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-300', text: 'text-emerald-600' },
  purple: { bg: 'from-purple-400 to-violet-400', badge: 'bg-purple-100 text-purple-700', border: 'border-purple-300', text: 'text-purple-600' },
  yellow: { bg: 'from-amber-400 to-yellow-400', badge: 'bg-amber-100 text-amber-700', border: 'border-yellow-300', text: 'text-amber-600' },
};

export function getProfileProgressKey(profileId: string): string {
  if (profileId === 'default') {
    return LEGACY_PROGRESS_STORAGE_KEY;
  }
  return `vocakids_progress_v1_${profileId}`;
}

export const defaultProgress = (): AppProgress => ({
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
});

function generateCleanCode(name: string): string {
  const clean = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();
  const prefix = clean.replace(/^BE/, '').slice(0, 5) || 'KID';
  const num = Math.floor(10 + Math.random() * 90);
  return `${prefix}${num}`;
}

interface ProfileContextType {
  profiles: UserProfile[];
  activeProfile: UserProfile;
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;
  createProfile: (data: Omit<UserProfile, 'id' | 'createdAt'>) => Promise<UserProfile>;
  updateProfile: (id: string, data: Partial<UserProfile>) => void;
  deleteProfile: (id: string) => boolean;
  getProfileStars: (id: string) => number;
  resetProfileProgress: (id: string) => void;
  
  // Login / Sync across devices
  loginWithCodeOrName: (query: string) => Promise<{ success: boolean; message?: string; profile?: UserProfile }>;
  syncWithServer: () => Promise<void>;

  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;

  // Active profile progress (directly backward-compatible with useProgress)
  progress: AppProgress;
  hydrated: boolean;
  recordAttempt: (
    catId: string,
    wordId: string,
    score: number | null,
    status: 'pass' | 'practice' | 'retry' | 'service_error'
  ) => void;
  getWordProgress: (catId: string, wordId: string) => WordProgress | null;
  findWordProgress: (wordId: string) => WordProgress | null;
  demoteWord: (catId: string, wordId: string) => void;
  getDueReviewWords: () => { wordId: string; catId: string; progress: WordProgress }[];
  resetAll: () => void;
  todayStats: DailyStats | null;

  // Reward / Gamification
  recordUnitTest: (result: Omit<UnitTestResult, 'completedAt'>) => void;
  awardSticker: (sticker: Omit<Sticker, 'earnedAt'>) => void;
  adminUnlockUnit: (unitId: string) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<UserProfile[]>([DEFAULT_PROFILE]);
  const [activeProfileId, setActiveProfileIdState] = useState<string>('default');
  const [progress, setProgress] = useState<AppProgress>(defaultProgress());
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Sync debounce timer ref
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to send progress to server
  const syncToServer = useCallback((pId: string, prog: AppProgress, pProfile?: UserProfile) => {
    if (typeof window === 'undefined') return;
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch('/api/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'sync',
            profileId: pId,
            progress: prog,
            profile: pProfile,
          }),
        });
      } catch (e) {
        console.warn('Background sync error (offline or unreachable):', e);
      }
    }, 1200);
  }, []);

  // Load profiles & active profile & initial progress on mount + sync from server
  useEffect(() => {
    let activeId = 'default';
    try {
      let loadedProfiles: UserProfile[] = [DEFAULT_PROFILE];
      const rawProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (rawProfiles) {
        const parsed = JSON.parse(rawProfiles);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure each profile has a code
          loadedProfiles = parsed.map((p) => ({
            ...p,
            code: p.code || generateCleanCode(p.name),
          }));
        }
      } else {
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify([DEFAULT_PROFILE]));
      }
      setProfiles(loadedProfiles);

      const storedActiveId = localStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY);
      if (storedActiveId && loadedProfiles.some((p) => p.id === storedActiveId)) {
        activeId = storedActiveId;
      } else {
        activeId = loadedProfiles[0].id;
        localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, activeId);
      }
      setActiveProfileIdState(activeId);

      // Load progress for this active child
      const progKey = getProfileProgressKey(activeId);
      const rawProg = localStorage.getItem(progKey);
      if (rawProg) {
        setProgress(JSON.parse(rawProg) as AppProgress);
      } else {
        setProgress(defaultProgress());
      }
    } catch (e) {
      console.error('Error hydrating profiles/progress:', e);
    }
    setHydrated(true);

    // Initial server fetch to sync profiles and progress across devices
    (async () => {
      try {
        const res = await fetch('/api/profiles');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.profiles) && data.profiles.length > 0) {
            setProfiles((prev) => {
              // Merge server profiles with local profiles
              const map = new Map<string, UserProfile>();
              for (const p of data.profiles) {
                map.set(p.id, p);
              }
              for (const p of prev) {
                if (!map.has(p.id)) {
                  map.set(p.id, p);
                }
              }
              const merged = Array.from(map.values());
              try {
                localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(merged));
              } catch {}
              return merged;
            });
          }
        }
      } catch (err) {
        // Offline / unreachable is normal in some environments
      }
    })();
  }, []);

  // Active Profile object
  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILE;
  }, [profiles, activeProfileId]);

  // Save progress for active profile
  const saveProgress = useCallback((next: AppProgress, targetProfileId?: string) => {
    const pId = targetProfileId || activeProfileId;
    setProgress(next);
    try {
      const progKey = getProfileProgressKey(pId);
      localStorage.setItem(progKey, JSON.stringify(next));
    } catch (e) {
      console.error('Error saving progress:', e);
    }
    syncToServer(pId, next, activeProfile);
  }, [activeProfileId, activeProfile, syncToServer]);

  // Switch active profile
  const setActiveProfileId = useCallback((id: string) => {
    if (!profiles.some((p) => p.id === id)) return;
    setActiveProfileIdState(id);
    try {
      localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, id);
      const progKey = getProfileProgressKey(id);
      const rawProg = localStorage.getItem(progKey);
      if (rawProg) {
        setProgress(JSON.parse(rawProg) as AppProgress);
      } else {
        const empty = defaultProgress();
        setProgress(empty);
        localStorage.setItem(progKey, JSON.stringify(empty));
      }
    } catch (e) {
      console.error('Error switching active profile:', e);
    }
  }, [profiles]);

  // Login with Name or Account Code (sync across devices)
  const loginWithCodeOrName = useCallback(async (query: string): Promise<{ success: boolean; message?: string; profile?: UserProfile }> => {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return { success: false, message: 'Vui lòng nhập tên bé hoặc mã tài khoản!' };
    }

    // Try server login first to fetch latest progress from other devices
    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', query: cleanQuery }),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        const p: UserProfile = data.profile;
        const prog: AppProgress = data.progress || defaultProgress();

        // Update local profiles list
        setProfiles((prev) => {
          const exists = prev.some((item) => item.id === p.id);
          const next = exists ? prev.map((item) => (item.id === p.id ? p : item)) : [...prev, p];
          try {
            localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(next));
          } catch {}
          return next;
        });

        // Set as active
        setActiveProfileIdState(p.id);
        setProgress(prog);
        try {
          localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, p.id);
          localStorage.setItem(getProfileProgressKey(p.id), JSON.stringify(prog));
        } catch {}

        return { success: true, profile: p, message: data.message };
      }
    } catch (err) {
      console.warn('Server login error, falling back to local search:', err);
    }

    // Local fallback: search in current profiles
    const qNorm = cleanQuery.toLowerCase();
    const qCode = cleanQuery.toUpperCase();
    const matched = profiles.find(
      (p) => (p.code || '').toUpperCase() === qCode || p.name.toLowerCase() === qNorm || p.name.toLowerCase().includes(qNorm)
    );

    if (matched) {
      setActiveProfileId(matched.id);
      return { success: true, profile: matched, message: `Chào mừng ${matched.name} quay lại học! 🎉` };
    }

    return {
      success: false,
      message: `Không tìm thấy bé với tên hoặc mã "${cleanQuery}". Bạn hãy kiểm tra lại hoặc tạo tài khoản mới nhé!`,
    };
  }, [profiles, setActiveProfileId]);

  // Create new profile
  const createProfile = useCallback(async (data: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const newId = `profile_${Date.now()}`;
    const code = data.code || generateCleanCode(data.name);
    const newProfile: UserProfile = {
      ...data,
      id: newId,
      code,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const nextProfiles = [...profiles, newProfile];
    setProfiles(nextProfiles);

    const empty = defaultProgress();
    setProgress(empty);
    setActiveProfileIdState(newId);

    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(nextProfiles));
      localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, newId);
      localStorage.setItem(getProfileProgressKey(newId), JSON.stringify(empty));
    } catch (e) {
      console.error('Error creating profile locally:', e);
    }

    // Sync to server in background
    try {
      fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', profile: newProfile, progress: empty }),
      }).catch(() => {});
    } catch {}

    return newProfile;
  }, [profiles]);

  // Update existing profile
  const updateProfile = useCallback((id: string, data: Partial<UserProfile>) => {
    setProfiles((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...data } : p));
      try {
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Error updating profile:', e);
      }
      return next;
    });

    // Sync to server in background
    try {
      fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', profileId: id, data }),
      }).catch(() => {});
    } catch {}
  }, []);

  // Delete profile
  const deleteProfile = useCallback((id: string): boolean => {
    if (profiles.length <= 1) {
      return false; // Cannot delete the only profile
    }
    const nextProfiles = profiles.filter((p) => p.id !== id);
    setProfiles(nextProfiles);
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(nextProfiles));
      localStorage.removeItem(getProfileProgressKey(id));
    } catch (e) {
      console.error('Error deleting profile:', e);
    }

    if (activeProfileId === id) {
      const newActive = nextProfiles[0].id;
      setActiveProfileIdState(newActive);
      try {
        localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, newActive);
        const rawProg = localStorage.getItem(getProfileProgressKey(newActive));
        setProgress(rawProg ? JSON.parse(rawProg) : defaultProgress());
      } catch {}
    }

    // Sync deletion to server
    try {
      fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', profileId: id }),
      }).catch(() => {});
    } catch {}

    return true;
  }, [profiles, activeProfileId]);

  // Read total stars for a profile
  const getProfileStars = useCallback((id: string): number => {
    if (id === activeProfileId) {
      return progress.totalStars;
    }
    try {
      const raw = localStorage.getItem(getProfileProgressKey(id));
      if (raw) {
        const parsed = JSON.parse(raw) as AppProgress;
        return parsed.totalStars ?? 0;
      }
    } catch {}
    return 0;
  }, [activeProfileId, progress.totalStars]);

  // Reset progress for a specific profile
  const resetProfileProgress = useCallback((id: string) => {
    const empty = defaultProgress();
    try {
      localStorage.setItem(getProfileProgressKey(id), JSON.stringify(empty));
    } catch {}
    if (id === activeProfileId) {
      setProgress(empty);
    }
    syncToServer(id, empty, activeProfile);
  }, [activeProfileId, activeProfile, syncToServer]);

  // Manual trigger to pull latest server data
  const syncWithServer = useCallback(async () => {
    try {
      const res = await fetch('/api/profiles');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.profiles)) {
          setProfiles(data.profiles);
          localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(data.profiles));
        }
      }
    } catch {}
  }, []);

  // Update streak based on today's date
  const updateStreak = useCallback((current: AppProgress): AppProgress => {
    const today     = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const last      = current.lastActiveDate;
    return {
      ...current,
      streak: last === yesterday ? current.streak + 1 : last === today ? current.streak : 1,
      lastActiveDate: today,
    };
  }, []);

  // Helper for spaced repetition scheduling
  const addDays = (dateStr: string, days: number): string => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const getNextReviewInterval = (currentInterval: number = 1): number => {
    const intervals = [1, 3, 7, 14, 30];
    const idx = intervals.indexOf(currentInterval);
    if (idx === -1) {
      const next = intervals.find((i) => i > currentInterval);
      return next ?? 30;
    }
    return intervals[Math.min(idx + 1, intervals.length - 1)];
  };

  // Record a word attempt with Consecutive Pass & Spaced Repetition logic
  const recordAttempt = useCallback(
    (catId: string, wordId: string, score: number | null, status: 'pass' | 'practice' | 'retry' | 'service_error') => {
      if (status === 'retry' || status === 'service_error') {
        return;
      }

      setProgress((prev) => {
        const key      = `${catId}:${wordId}`;
        const today    = new Date().toISOString().slice(0, 10);
        const scoreNum = score ?? 0;
        const stars    = status === 'pass' ? 3 : scoreNum >= 70 ? 2 : scoreNum >= 50 ? 1 : 0;
        const existing: WordProgress = prev.wordProgress[key] ?? {
          wordId,
          catId,
          stars: 0,
          attempts: 0,
          bestScore: 0,
          lastPracticed: '',
          consecutivePasses: 0,
          mastered: false,
        };

        const prevPasses = existing.consecutivePasses ?? 0;
        let consecutivePasses = prevPasses;
        let mastered = existing.mastered ?? false;
        let masteredAt = existing.masteredAt;
        let intervalDays = existing.intervalDays ?? 1;
        let reviewDueDate = existing.reviewDueDate;

        if (status === 'pass') {
          consecutivePasses = prevPasses + 1;
          // Cơ chế tốt nghiệp: Đọc đúng 2 lần liên tiếp
          if (consecutivePasses >= 2) {
            if (!mastered) {
              mastered = true;
              masteredAt = today;
              intervalDays = 1;
              reviewDueDate = addDays(today, 1); // Hẹn ôn lại vào ngày mai (Chu kỳ 1)
            } else {
              // Ôn tập thành công định kỳ: tăng chu kỳ (1 -> 3 -> 7 -> 14 -> 30 ngày)
              intervalDays = getNextReviewInterval(intervalDays);
              reviewDueDate = addDays(today, intervalDays);
            }
          }
        } else if (status === 'practice') {
          // Bé đọc chưa đạt / phát âm sai:
          consecutivePasses = 0; // Reset chuỗi liên tiếp (tránh ăn may)
          if (mastered) {
            // Cơ chế rớt hạng (Demotion): Đã từng tốt nghiệp nhưng đọc sai -> cần ôn lại ngay hôm nay
            mastered = false;
            intervalDays = 1;
            reviewDueDate = today;
          }
        }

        const updated: WordProgress = {
          ...existing,
          stars:          Math.max(existing.stars, stars),
          attempts:       existing.attempts + 1,
          bestScore:      Math.max(existing.bestScore, scoreNum),
          lastPracticed:  today,
          consecutivePasses,
          mastered,
          masteredAt,
          reviewDueDate,
          intervalDays,
        };

        // Update daily stats
        const dailyIdx   = prev.dailyStats.findIndex((d) => d.date === today);
        const dailyStats = [...prev.dailyStats];
        if (dailyIdx >= 0) {
          dailyStats[dailyIdx] = {
            ...dailyStats[dailyIdx],
            wordsStudied: dailyStats[dailyIdx].wordsStudied + 1,
            totalStars:   dailyStats[dailyIdx].totalStars + stars,
          };
        } else {
          dailyStats.push({ date: today, wordsStudied: 1, totalStars: stars, streak: prev.streak });
        }

        const next: AppProgress = updateStreak({
          ...prev,
          totalStars:   prev.totalStars + (stars - existing.stars),
          wordProgress: { ...prev.wordProgress, [key]: updated },
          dailyStats,
        });

        try {
          const progKey = getProfileProgressKey(activeProfileId);
          localStorage.setItem(progKey, JSON.stringify(next));
        } catch (e) {
          console.error('Error saving progress attempt:', e);
        }

        // Auto sync to server in background
        syncToServer(activeProfileId, next, activeProfile);

        return next;
      });
    },
    [activeProfileId, updateStreak, syncToServer, activeProfile]
  );

  const getWordProgress = useCallback(
    (catId: string, wordId: string): WordProgress | null =>
      progress.wordProgress[`${catId}:${wordId}`] ?? null,
    [progress]
  );

  const findWordProgress = useCallback(
    (wordId: string): WordProgress | null => {
      for (const key in progress.wordProgress) {
        if (key.endsWith(`:${wordId}`) || progress.wordProgress[key]?.wordId === wordId) {
          return progress.wordProgress[key];
        }
      }
      return null;
    },
    [progress.wordProgress]
  );

  const demoteWord = useCallback((catId: string, wordId: string) => {
    setProgress((prev) => {
      const key = `${catId}:${wordId}`;
      const existing = prev.wordProgress[key] || Object.values(prev.wordProgress).find((p) => p.wordId === wordId);
      if (!existing) return prev;
      const actualKey = `${existing.catId}:${existing.wordId}`;
      const today = new Date().toISOString().slice(0, 10);
      const updated: WordProgress = {
        ...existing,
        consecutivePasses: 0,
        mastered: false,
        intervalDays: 1,
        reviewDueDate: today,
        lastPracticed: today,
      };
      const next: AppProgress = {
        ...prev,
        wordProgress: { ...prev.wordProgress, [actualKey]: updated },
      };
      try {
        const progKey = getProfileProgressKey(activeProfileId);
        localStorage.setItem(progKey, JSON.stringify(next));
      } catch (e) {
        console.error('Error demoting word:', e);
      }
      syncToServer(activeProfileId, next, activeProfile);
      return next;
    });
  }, [activeProfileId, syncToServer, activeProfile]);

  const getDueReviewWords = useCallback((): { wordId: string; catId: string; progress: WordProgress }[] => {
    const today = new Date().toISOString().slice(0, 10);
    const results: { wordId: string; catId: string; progress: WordProgress }[] = [];
    for (const key in progress.wordProgress) {
      const p = progress.wordProgress[key];
      if (p && p.attempts > 0) {
        if (p.reviewDueDate && p.reviewDueDate <= today) {
          results.push({ wordId: p.wordId, catId: p.catId, progress: p });
        } else if (!p.reviewDueDate && p.lastPracticed && p.lastPracticed < today && (p.consecutivePasses ?? 0) >= 1) {
          results.push({ wordId: p.wordId, catId: p.catId, progress: p });
        }
      }
    }
    return results;
  }, [progress.wordProgress]);

  const resetAll = useCallback(() => {
    const next = defaultProgress();
    saveProgress(next);
  }, [saveProgress]);

  // Today's words studied count
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return progress.dailyStats.find((d) => d.date === today) ?? null;
  }, [progress.dailyStats]);

  const openProfileModal = useCallback(() => setIsProfileModalOpen(true), []);
  const closeProfileModal = useCallback(() => setIsProfileModalOpen(false), []);

  // Record a Unit Test result + auto-award sticker
  const recordUnitTest = useCallback((result: Omit<UnitTestResult, 'completedAt'>) => {
    setProgress((prev) => {
      const completedAt = new Date().toISOString();
      const existing = prev.unitTestResults?.[result.unitId];
      const attempts = (existing?.attempts ?? 0) + 1;
      const saved: UnitTestResult = { ...result, completedAt, attempts };

      // Award points based on grade
      const pointsMap: Record<string, number> = { excellent: 50, good: 20, pass: 10, fail: 0 };
      const bonusPoints = pointsMap[result.grade] ?? 0;

      const next: AppProgress = {
        ...prev,
        unitTestResults: { ...(prev.unitTestResults ?? {}), [result.unitId]: saved },
        totalPoints: (prev.totalPoints ?? 0) + bonusPoints,
        // Auto-award sticker on pass/good/excellent (handled by caller)
      };

      const progKey = getProfileProgressKey(activeProfileId);
      try { localStorage.setItem(progKey, JSON.stringify(next)); } catch {}
      syncToServer(activeProfileId, next, activeProfile);
      return next;
    });
  }, [activeProfileId, activeProfile, syncToServer]);

  // Award a sticker (deduplication by id)
  const awardSticker = useCallback((stickerData: Omit<Sticker, 'earnedAt'>) => {
    setProgress((prev) => {
      const existing = (prev.stickers ?? []);
      if (existing.some((s) => s.id === stickerData.id)) return prev; // already earned
      const sticker: Sticker = { ...stickerData, earnedAt: new Date().toISOString() };
      const next: AppProgress = { ...prev, stickers: [...existing, sticker] };
      const progKey = getProfileProgressKey(activeProfileId);
      try { localStorage.setItem(progKey, JSON.stringify(next)); } catch {}
      syncToServer(activeProfileId, next, activeProfile);
      return next;
    });
  }, [activeProfileId, activeProfile, syncToServer]);

  // Admin manually unlock a unit
  const adminUnlockUnit = useCallback((unitId: string) => {
    setProgress((prev) => {
      const current = prev.unlockedUnits ?? [];
      if (current.includes(unitId)) return prev;
      const next: AppProgress = { ...prev, unlockedUnits: [...current, unitId] };
      const progKey = getProfileProgressKey(activeProfileId);
      try { localStorage.setItem(progKey, JSON.stringify(next)); } catch {}
      syncToServer(activeProfileId, next, activeProfile);
      return next;
    });
  }, [activeProfileId, activeProfile, syncToServer]);

  const value = useMemo(
    () => ({
      profiles,
      activeProfile,
      activeProfileId,
      setActiveProfileId,
      createProfile,
      updateProfile,
      deleteProfile,
      getProfileStars,
      resetProfileProgress,
      loginWithCodeOrName,
      syncWithServer,
      isProfileModalOpen,
      openProfileModal,
      closeProfileModal,
      progress,
      hydrated,
      recordAttempt,
      getWordProgress,
      findWordProgress,
      demoteWord,
      getDueReviewWords,
      resetAll,
      todayStats,
      recordUnitTest,
      awardSticker,
      adminUnlockUnit,
    }),
    [
      profiles,
      activeProfile,
      activeProfileId,
      setActiveProfileId,
      createProfile,
      updateProfile,
      deleteProfile,
      getProfileStars,
      resetProfileProgress,
      loginWithCodeOrName,
      syncWithServer,
      isProfileModalOpen,
      openProfileModal,
      closeProfileModal,
      progress,
      hydrated,
      recordAttempt,
      getWordProgress,
      findWordProgress,
      demoteWord,
      getDueReviewWords,
      resetAll,
      todayStats,
      recordUnitTest,
      awardSticker,
      adminUnlockUnit,
    ]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    return {
      profiles: [DEFAULT_PROFILE],
      activeProfile: DEFAULT_PROFILE,
      activeProfileId: 'default',
      setActiveProfileId: () => {},
      createProfile: async () => DEFAULT_PROFILE,
      updateProfile: () => {},
      deleteProfile: () => false,
      getProfileStars: () => 0,
      resetProfileProgress: () => {},
      loginWithCodeOrName: async () => ({ success: false }),
      syncWithServer: async () => {},
      isProfileModalOpen: false,
      openProfileModal: () => {},
      closeProfileModal: () => {},
      progress: defaultProgress(),
      hydrated: false,
      recordAttempt: () => {},
      getWordProgress: () => null,
      findWordProgress: () => null,
      demoteWord: () => {},
      getDueReviewWords: () => [],
      resetAll: () => {},
      todayStats: null,
      recordUnitTest: () => {},
      awardSticker: () => {},
      adminUnlockUnit: () => {},
    };
  }
  return ctx;
}
