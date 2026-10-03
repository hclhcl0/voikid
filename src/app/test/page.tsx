'use client';

// =============================================
// VocaKids – 8 Dạng Bài Tập & Phòng Luyện Thi Hub
// Danh sách tất cả bài học & chọn dạng bài tập
// =============================================

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GRADE_LEVELS, GRADE_METAS, CATEGORIES } from '@/lib/vocabulary';
import { useProfileContext } from '@/context/ProfileContext';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { ChildBadge } from '@/components/ChildBadge';
import { EXERCISE_METAS } from '@/components/exercises';

export default function TestHubPage() {
  const { activeProfile } = useProfileContext();
  const { categories: customCats } = useCustomCategories();
  const [selectedGrade, setSelectedGrade] = useState<string>(
    activeProfile?.gradeId || 'lop1'
  );

  const allCategories = [...CATEGORIES, ...customCats];
  const unitsInGrade = allCategories.filter(
    (c: any) => (c.gradeId || c.grade) === selectedGrade
  );
  const currentMeta = GRADE_METAS[selectedGrade] || GRADE_METAS.lop1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 pb-24">
      {/* Top Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-violet-100 sticky top-0 z-30 px-4 py-3.5 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-2xl bg-white shadow-xs border border-gray-200 text-gray-600 font-bold flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
          >
            ←
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-sm text-gray-800 flex items-center gap-1.5 truncate">
              <span>🎯</span>
              <span>8 Dạng Bài Tập & Phòng Thi</span>
            </h1>
            <p className="text-[11px] text-gray-400 font-semibold truncate">
              Luyện phản xạ, phát âm & nhớ từ vựng
            </p>
          </div>
          <ChildBadge />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Banner with 8 Exercise Types Summary */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-4 text-white shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎪</span>
            <div>
              <h2 className="text-base font-black leading-tight">
                8 Dạng Bài Tập Chuẩn Sư Phạm
              </h2>
              <p className="text-xs text-violet-200 font-medium">
                Chọn một bài học dưới đây để bắt đầu luyện tập:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/20 text-xs">
            {EXERCISE_METAS.slice(0, 4).map((m) => (
              <span key={m.id} className="flex items-center gap-1 text-white/90 font-bold truncate">
                <span>{m.icon}</span> {m.num}. {m.title}
              </span>
            ))}
            {EXERCISE_METAS.slice(4, 8).map((m) => (
              <span key={m.id} className="flex items-center gap-1 text-white/90 font-bold truncate">
                <span>{m.icon}</span> {m.num}. {m.title}
              </span>
            ))}
          </div>
        </div>

        {/* Grade Selector Tabs */}
        <div>
          <p className="text-xs font-bold text-gray-600 mb-2">Chọn lớp học:</p>
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar py-1">
            {GRADE_LEVELS.map((g) => {
              const isSel = selectedGrade === g.id;
              const gMeta = GRADE_METAS[g.id] || GRADE_METAS.lop1;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGrade(g.id)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-black shrink-0 transition-all ${
                    isSel
                      ? 'bg-violet-600 text-white shadow-sm scale-102'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300'
                  }`}
                >
                  <span>{gMeta.icon}</span>
                  <span>{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Units List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold px-1">
            <span>Bài học của {currentMeta.name}:</span>
            <span>{unitsInGrade.length} bài</span>
          </div>

          <div className="grid gap-2.5">
            {unitsInGrade.map((cat) => (
              <Link
                key={cat.id}
                href={`/test/${cat.id}`}
                className="bg-white rounded-2xl p-3.5 border-2 border-gray-100 hover:border-violet-300 shadow-xs flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {cat.emoji}
                  </span>
                  <div>
                    <h3 className="font-black text-sm text-gray-800">
                      {cat.name_vi}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                      {cat.name_en} • {cat.words.length} từ
                    </p>
                  </div>
                </div>

                <span className="py-2 px-3 rounded-xl bg-violet-600 text-white text-xs font-black shadow-xs group-hover:bg-violet-700 transition-colors">
                  Vào Luyện 8 Dạng →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
