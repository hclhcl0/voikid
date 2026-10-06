'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useProfileContext, COLOR_THEMES } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { GRADE_LEVELS } from '@/lib/vocabulary';

interface ChildBadgeProps {
  variant?: 'compact' | 'hero' | 'pill';
  showSwitchHint?: boolean;
}

export function ChildBadge({ variant = 'pill', showSwitchHint = true }: ChildBadgeProps) {
  const { activeProfile, openProfileModal, progress, hydrated } = useProfileContext();
  const { isAuthenticated, account } = useAuth();

  if (!hydrated) {
    return (
      <div className="h-9 w-24 rounded-full bg-white/30 animate-pulse" />
    );
  }

  const theme = COLOR_THEMES[activeProfile.color] || COLOR_THEMES.orange;
  const grade = GRADE_LEVELS.find((g) => g.id === activeProfile.gradeId) || GRADE_LEVELS[1];

  if (variant === 'compact') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openProfileModal}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur shadow-xs border border-slate-200 text-gray-800 cursor-pointer hover:bg-orange-50 transition-colors"
        title={isAuthenticated ? `Tài khoản: ${account?.displayName || account?.email} (Đã kết nối đám mây)` : 'Chế độ Khách (Lưu trên máy). Nhấn để đổi bé hoặc đăng nhập'}
      >
        <span className="text-base leading-none">{activeProfile.avatar}</span>
        <span className="text-xs font-bold truncate max-w-[80px]">{activeProfile.name}</span>
        {isAuthenticated ? (
          <span className="text-[10px] text-blue-500 font-bold" title="Đã lưu Đám Mây">☁️</span>
        ) : (
          <span className="text-[10px] text-slate-500 font-bold" title="Chế độ Khách">👤</span>
        )}
        {showSwitchHint && <span className="text-[10px] text-orange-500 font-bold">⇄</span>}
      </motion.button>
    );
  }

  if (variant === 'hero') {
    return (
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={openProfileModal}
        className="flex items-center gap-3 p-2 pr-4 rounded-2xl bg-white/90 backdrop-blur shadow-sm border-2 border-white/80 cursor-pointer hover:bg-white transition-all text-left group"
        title="Nhấn để đổi bé hoặc quản lý tài khoản"
      >
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${theme.bg} flex items-center justify-center text-2xl shadow-sm shrink-0 group-hover:scale-105 transition-transform`}
        >
          {activeProfile.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-gray-800 truncate">{activeProfile.name}</span>
            <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded-md">
              {grade.label}
            </span>
            {isAuthenticated ? (
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-md">
                ☁️ Cloud
              </span>
            ) : (
              <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded-md">
                👤 Khách
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] font-bold text-amber-600">⭐ {progress.totalStars} sao</span>
            <span className="text-[10px] font-bold text-orange-500 group-hover:underline">Đổi bé ⇄</span>
          </div>
        </div>
      </motion.button>
    );
  }

  // Default 'pill'
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={openProfileModal}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur shadow-xs border border-slate-200 text-gray-800 cursor-pointer hover:bg-white transition-all"
      title="Nhấn để đổi tài khoản bé"
    >
      <span className="text-lg leading-none">{activeProfile.avatar}</span>
      <span className="text-xs font-bold text-gray-800">{activeProfile.name}</span>
      <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded-md">
        {grade.label}
      </span>
      {showSwitchHint && <span className="text-xs text-orange-500 font-bold">⇄</span>}
    </motion.button>
  );
}
