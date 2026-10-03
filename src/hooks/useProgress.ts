// =============================================
// VocaKids – useProgress Hook
// Lưu/đọc tiến trình học từ LocalStorage theo từng hồ sơ bé (Multi-profile)
// =============================================

'use client';

import { useProfileContext } from '@/context/ProfileContext';

export function useProgress() {
  const ctx = useProfileContext();

  return {
    progress: ctx.progress,
    hydrated: ctx.hydrated,
    recordAttempt: ctx.recordAttempt,
    getWordProgress: ctx.getWordProgress,
    resetAll: ctx.resetAll,
    todayStats: ctx.todayStats,
    activeProfile: ctx.activeProfile,
    profiles: ctx.profiles,
    switchProfile: ctx.setActiveProfileId,
  };
}
