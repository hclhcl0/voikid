'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProfileContext, COLOR_THEMES } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { GRADE_LEVELS } from '@/lib/vocabulary';
import {ArrowLeftRight,CloudCheck,Monitor,Star,UserRound} from 'lucide-react';

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

  if (!activeProfile.id) return <Link href="/parent" className="learning-button border border-slate-200 bg-white text-sm"><UserRound aria-hidden="true" className="h-4 w-4"/>Chọn học sinh</Link>;

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
        {activeProfile.avatar==='👤'?<UserRound aria-hidden="true" className="h-4 w-4 text-violet-500"/>:<span aria-hidden="true" className="text-base leading-none">{activeProfile.avatar}</span>}
        <span className="text-xs font-bold truncate max-w-[80px]">{activeProfile.name}</span>
        {isAuthenticated ? (
          <span className="text-blue-500" title="Đã lưu Đám Mây"><CloudCheck aria-hidden="true" className="h-3 w-3"/></span>
        ) : (
          <span className="text-slate-400" title="Chế độ Khách"><Monitor aria-hidden="true" className="h-3 w-3"/></span>
        )}
        {showSwitchHint && <ArrowLeftRight aria-hidden="true" className="h-3 w-3 text-orange-500"/>}
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
          {activeProfile.avatar==='👤'?<UserRound aria-hidden="true" className="h-6 w-6"/>:<span aria-hidden="true">{activeProfile.avatar}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-gray-800 truncate">{activeProfile.name}</span>
            <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded-md">
              {grade.label}
            </span>
            {isAuthenticated ? (
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-md">
                <CloudCheck aria-hidden="true" className="mr-1 inline h-3 w-3"/>Cloud
              </span>
            ) : (
              <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded-md">
                <Monitor aria-hidden="true" className="mr-1 inline h-3 w-3"/>Khách
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600"><Star aria-hidden="true" className="h-3 w-3"/>{progress.totalStars} sao</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-500 group-hover:underline">Đổi bé<ArrowLeftRight aria-hidden="true" className="h-3 w-3"/></span>
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
      {activeProfile.avatar==='👤'?<UserRound aria-hidden="true" className="h-4 w-4 text-violet-500"/>:<span aria-hidden="true" className="text-lg leading-none">{activeProfile.avatar}</span>}
      <span className="text-xs font-bold text-gray-800">{activeProfile.name}</span>
      <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded-md">
        {grade.label}
      </span>
      {showSwitchHint && <ArrowLeftRight aria-hidden="true" className="h-3.5 w-3.5 text-orange-500"/>}
    </motion.button>
  );
}
