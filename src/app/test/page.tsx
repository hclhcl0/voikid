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
import { useCustomCategories, NEW_WORDS_CAT_ID } from '@/hooks/useCustomCategories';
import { ChildBadge } from '@/components/ChildBadge';
import { EXERCISE_METAS } from '@/components/exercises';

export default function TestHubPage() {
  const { activeProfile } = useProfileContext();
  const { categories: customCats } = useCustomCategories();
  const [selectedGrade, setSelectedGrade] = useState<string>(
    activeProfile?.gradeId || 'lop1'
  );
  const [filterStation, setFilterStation] = useState<string>('all');

  const newWordsCat = customCats.find((c) => c.id === NEW_WORDS_CAT_ID && c.words.length > 0);
  const builtinInGrade = CATEGORIES.filter((c: any) => (c.gradeId || c.grade) === selectedGrade);
  const customForGrade = customCats.filter(
    (c: any) => c.id !== NEW_WORDS_CAT_ID && (!c.gradeId || c.gradeId === selectedGrade)
  );
  const unitsInGrade = [
    ...(newWordsCat ? [newWordsCat] : []),
    ...customForGrade,
    ...builtinInGrade,
  ];
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
                Chọn một dạng bài hoặc chọn bài học bên dưới để luyện tập:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/20 text-xs">
            {EXERCISE_METAS.map((m) => {
              const isFiltered = filterStation === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setFilterStation(isFiltered ? 'all' : m.id)}
                  className={`flex items-center gap-1 font-bold truncate p-1 rounded-xl transition-all text-left ${
                    isFiltered
                      ? 'bg-amber-400 text-amber-950 font-black ring-2 ring-white/50'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <span>{m.icon}</span>
                  <span className="truncate">{m.num}. {m.title}</span>
                </button>
              );
            })}
          </div>

          {filterStation !== 'all' && (
            <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-xs">
              <span className="text-amber-200 font-medium">
                Đang lọc: <strong>{EXERCISE_METAS.find(m => m.id === filterStation)?.title}</strong>
              </span>
              <button
                type="button"
                onClick={() => setFilterStation('all')}
                className="text-white underline font-bold"
              >
                Hiện tất cả ✕
              </button>
            </div>
          )}
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
            {unitsInGrade.map((cat) => {
              const targetUrl = filterStation !== 'all'
                ? `/test/${cat.id}?station=${filterStation}`
                : `/test/${cat.id}`;

              const isNewWords = cat.id === NEW_WORDS_CAT_ID;

              return (
                <div
                  key={cat.id}
                  className={`rounded-3xl p-4 border-2 shadow-xs flex flex-col gap-3 transition-all ${
                    isNewWords
                      ? 'bg-gradient-to-r from-amber-50/50 via-white to-orange-50/50 border-amber-300 ring-2 ring-amber-200/50 shadow-md'
                      : 'bg-white border-gray-100 hover:border-violet-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${
                          isNewWords ? 'bg-amber-100 border border-amber-200' : 'bg-violet-50'
                        }`}
                      >
                        {cat.emoji}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-sm text-gray-800 truncate">
                            {cat.name_vi}
                          </h3>
                          {isNewWords && (
                            <span className="text-[9px] bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black px-2 py-0.5 rounded-full shrink-0 shadow-xs">
                              🌟 TỪ MỚI
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-medium truncate">
                          {cat.name_en} • {cat.words.length} từ vựng
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                    <Link
                      href={targetUrl}
                      className={`py-2.5 px-3 rounded-2xl text-white font-black text-xs text-center shadow-xs hover:opacity-95 flex items-center justify-center gap-1.5 ${
                        isNewWords
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-md'
                          : 'bg-gradient-to-r from-violet-600 to-indigo-600'
                      }`}
                    >
                      <span>🎯</span>
                      <span>{filterStation !== 'all' ? 'Luyện dạng này' : '8 Dạng bài tập'}</span>
                    </Link>
                    <Link
                      href={`/test/${cat.id}#challenge`}
                      onClick={() => {
                        // Switch mode in target page
                        sessionStorage.setItem('vocakids_open_mode', 'test');
                      }}
                      className="py-2.5 px-3 rounded-2xl bg-violet-50 text-violet-700 hover:bg-violet-100 font-black text-xs text-center border border-violet-200 flex items-center justify-center gap-1.5"
                    >
                      <span>🏆</span>
                      <span>Làm bài thi (10 câu)</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
