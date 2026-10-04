'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState, useEffect, useMemo } from 'react';
import { CATEGORIES, GRADE_LEVELS, GradeLevel, GradeMeta, GRADE_METAS } from '@/lib/vocabulary';
import { useProgress } from '@/hooks/useProgress';
import { useCustomCategories, NEW_WORDS_CAT_ID } from '@/hooks/useCustomCategories';
import { useAdminContext } from '@/context/AdminContext';
import { ChildBadge } from '@/components/ChildBadge';
import { Category } from '@/types';

// ── Unit Category Card ────────────────────────────────────────────────────────
function UnitCard({
  cat,
  stars,
  isCustom,
  gradeMeta,
}: {
  cat: Category;
  stars: number;
  isCustom?: boolean;
  gradeMeta: GradeMeta;
}) {
  const isNewWords = cat.id === NEW_WORDS_CAT_ID;
  const maxStars = cat.words.length * 3;
  const pct = maxStars > 0 ? Math.round((stars / maxStars) * 100) : 0;
  const canTest = pct >= 50;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-3xl p-4 transition-all relative overflow-hidden flex flex-col justify-between ${
        isNewWords
          ? 'bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-amber-300 ring-2 ring-amber-200/70 shadow-lg hover:shadow-2xl'
          : 'bg-white border-2 border-orange-100 shadow-md hover:shadow-xl'
      }`}
      style={{
        boxShadow: isNewWords
          ? '0 8px 24px rgba(245,158,11,0.18)'
          : '0 6px 0 rgba(249,115,22,0.06), 0 12px 24px rgba(0,0,0,0.04)',
      }}
    >
      {/* Background soft bubble */}
      <div
        className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${
          isNewWords ? 'bg-amber-400 opacity-20' : `bg-gradient-to-br ${gradeMeta.gradient} opacity-15`
        } pointer-events-none`}
      />

      <div>
        {/* Top bar with emoji & badge */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-4xl drop-shadow select-none">{cat.emoji}</span>
          <div className="flex items-center gap-1">
            {isNewWords ? (
              <span className="text-[10px] bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full px-2 py-0.5 font-black shadow-xs">
                🌟 TỪ MỚI
              </span>
            ) : isCustom ? (
              <span className="text-[10px] bg-violet-100 text-violet-700 rounded-full px-2 py-0.5 font-black">
                ✨ Mới
              </span>
            ) : null}
            <span className="text-[11px] font-bold text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
              {cat.words.length} từ
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-black text-gray-800 text-base leading-snug line-clamp-1">
          {cat.name_vi}
        </h4>
        <p className="text-gray-400 text-xs font-semibold truncate mt-0.5">
          {cat.name_en}
        </p>

        {/* Star progress bar */}
        <div className="mt-3 mb-4">
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 mb-1">
            <span>Tiến độ</span>
            <span className={pct > 0 ? 'text-amber-500 font-black' : 'text-gray-400'}>
              ⭐ {stars}/{maxStars}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-gray-100">
        <Link
          href={`/learn/${cat.id}`}
          className={`min-h-[42px] py-2 px-2.5 rounded-2xl font-black text-xs text-center text-white shadow-xs hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            isNewWords ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-md' : `bg-gradient-to-r ${gradeMeta.gradient}`
          }`}
        >
          <span>▶</span>
          <span>Học từ</span>
        </Link>
        <Link
          href={`/test/${cat.id}`}
          className="min-h-[42px] py-2 px-2 rounded-2xl font-black text-xs text-center transition-all flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs hover:opacity-95 active:scale-95 cursor-pointer"
          title="Luyện tập 8 dạng bài & làm bài thi nhận Sticker"
        >
          <span>🎯</span>
          <span>8 Dạng Bài</span>
        </Link>
      </div>
    </motion.div>
  );
}

// ── Grade Card in Hub ────────────────────────────────────────────────────────
function GradeCard({
  grade,
  meta,
  unitCount,
  wordCount,
  starsEarned,
  isChildGrade,
  onClick,
}: {
  grade: GradeLevel;
  meta: GradeMeta;
  unitCount: number;
  wordCount: number;
  starsEarned: number;
  isChildGrade: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl p-5 text-left transition-all cursor-pointer bg-white border-2 shadow-sm hover:shadow-xl ${
        isChildGrade ? 'border-orange-300 ring-2 ring-orange-200' : 'border-orange-100 hover:border-orange-200'
      }`}
      style={{ boxShadow: '0 6px 0 rgba(249,115,22,0.06), 0 12px 20px rgba(0,0,0,0.04)' }}
    >
      {/* Top tag: "Lớp của bé" */}
      {isChildGrade && (
        <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
          ⭐ LỚP CỦA BÉ
        </span>
      )}

      {/* Big mascot & badge */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-3xl shadow-sm text-white shrink-0`}
        >
          {meta.icon}
        </div>
        <div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${meta.accent}`}>
            {meta.badge}
          </span>
          <h3 className="font-black text-gray-800 text-xl leading-tight mt-0.5">
            {meta.name}
          </h3>
          <p className="text-gray-400 text-xs font-semibold">{meta.age}</p>
        </div>
      </div>

      {/* Description / Summary */}
      <p className="text-gray-600 text-xs font-medium line-clamp-1 mb-3">
        {meta.sub}
      </p>

      {/* Footer Info */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="font-bold text-gray-500">
          {unitCount} chủ đề • {wordCount} từ
        </span>
        {starsEarned > 0 ? (
          <span className="font-black text-amber-500 flex items-center gap-0.5">
            ⭐ {starsEarned} sao
          </span>
        ) : (
          <span className="font-black text-orange-500 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
            Vào học →
          </span>
        )}
      </div>
    </motion.button>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function HomePage() {
  const { progress, hydrated, activeProfile, getDueReviewWords } = useProgress();
  const { categories: customCats, hydrated: customHydrated } = useCustomCategories();
  const { isAdmin, openAdminModal, logoutAdmin } = useAdminContext();

  // View state: 'grades' (Choose grade screen) or 'units' (List of lessons in selected grade)
  const [viewMode, setViewMode] = useState<'grades' | 'units'>('grades');
  const [selectedGrade, setSelectedGrade] = useState<string>(GRADE_LEVELS[0].id);

  // Sync active grade from child's profile on initial mount
  useEffect(() => {
    if (activeProfile?.gradeId) {
      setSelectedGrade(activeProfile.gradeId);
    }
  }, [activeProfile?.gradeId]);

  // Read URL query parameter if present on load (e.g. /?grade=lop4)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const g = params.get('grade');
      if (g && GRADE_METAS[g]) {
        setSelectedGrade(g);
        setViewMode('units');
      }
    }
  }, []);

  // Compute due review words for Spaced Repetition
  const dueReviewWords = useMemo(() => {
    if (!hydrated || !getDueReviewWords) return [];
    return getDueReviewWords();
  }, [hydrated, getDueReviewWords]);

  // Compute stars for each category
  const getCategoryStars = (catId: string) => {
    if (!hydrated) return 0;
    return Object.entries(progress.wordProgress)
      .filter(([k]) => k.startsWith(`${catId}:`))
      .reduce((sum, [, v]) => sum + v.stars, 0);
  };

  // Grade categories
  const gradeCats = (gradeId: string) =>
    CATEGORIES.filter((c) => (c as any).gradeId === gradeId);

  // Dedicated "🌟 Từ mới của bé" category
  const newWordsCategory = useMemo(() => {
    if (!customHydrated) return null;
    const cat = customCats.find((c) => c.id === NEW_WORDS_CAT_ID);
    return cat && cat.words.length > 0 ? cat : null;
  }, [customCats, customHydrated]);

  // Grade stats calculations
  const gradeStats = useMemo(() => {
    const stats: Record<string, { unitCount: number; wordCount: number; starsEarned: number }> = {};
    GRADE_LEVELS.forEach((g) => {
      const builtin = gradeCats(g.id);
      const customForGrade = customHydrated
        ? customCats.filter((c) => c.id !== NEW_WORDS_CAT_ID && (!c.gradeId || c.gradeId === g.id))
        : [];
      const all = [...builtin, ...customForGrade];
      const unitCount = all.length;
      const wordCount = all.reduce((sum, c) => sum + c.words.length, 0);
      const starsEarned = all.reduce((sum, c) => sum + getCategoryStars(c.id), 0);
      stats[g.id] = { unitCount, wordCount, starsEarned };
    });
    return stats;
  }, [hydrated, customHydrated, customCats, progress.wordProgress]);

  const currentGradeMeta = GRADE_METAS[selectedGrade] || GRADE_METAS.lop1;

  // Grade units including custom new words and custom topics
  const currentGradeUnits = useMemo(() => {
    const builtin = gradeCats(selectedGrade);
    const customForGrade = customHydrated
      ? customCats
          .filter((c) => c.id !== NEW_WORDS_CAT_ID && (!c.gradeId || c.gradeId === selectedGrade))
          .map((c) => ({
            ...c,
            isCustom: true,
          }))
      : [];

    const result: (Category & { isCustom?: boolean })[] = [];

    // Pin "🌟 Từ mới của bé" at the top if words exist!
    if (newWordsCategory) {
      result.push({
        ...newWordsCategory,
        isCustom: true,
      });
    }

    // Add other custom topics created for this grade
    customForGrade.forEach((c) => result.push(c));

    // Add standard SGK units
    builtin.forEach((c) => result.push(c));

    return result;
  }, [selectedGrade, customHydrated, customCats, newWordsCategory]);

  const currentGradeWordCount = currentGradeUnits.reduce((sum, c) => sum + c.words.length, 0);
  const currentGradeStarsEarned = currentGradeUnits.reduce((sum, c) => sum + getCategoryStars(c.id), 0);
  const currentGradeMaxStars = currentGradeWordCount * 3;
  const currentGradePct =
    currentGradeMaxStars > 0 ? Math.round((currentGradeStarsEarned / currentGradeMaxStars) * 100) : 0;

  const bubbles = ['🍎', '🐱', '🌈', '🐶', '🌟', '🦋'];

  return (
    <div className="relative min-h-screen bg-[#FFF7ED] overflow-x-hidden">
      {/* Floating background bubbles */}
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="fixed text-3xl pointer-events-none select-none opacity-40 z-0"
          style={{
            left: `${5 + i * 17}%`,
            bottom: '-3rem',
            animation: `float-up ${7 + i}s linear ${i * 0.8}s infinite`,
          }}
        >
          {b}
        </div>
      ))}

      {/* ── TOP HERO HEADER ── */}
      <header
        className="relative bg-gradient-to-b from-orange-400 via-amber-400 to-[#FFF7ED] pb-6 pt-7 px-4 z-10"
        style={{ borderRadius: '0 0 36px 36px' }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Top Row: App title, Child badge, Admin/Settings buttons */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/" onClick={() => setViewMode('grades')} className="flex items-center gap-2 group">
              <span className="text-3xl drop-shadow select-none group-hover:scale-110 transition-transform">🦉</span>
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-black text-white drop-shadow-md tracking-tight leading-none"
                  style={{ fontFamily: 'var(--font-baloo), sans-serif' }}
                >
                  VocaKids
                </h1>
                <p className="text-[10px] sm:text-xs text-white/90 font-bold hidden sm:block">
                  Tiếng Anh Tiểu Học Cho Bé
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop quick links */}
              <div className="hidden md:flex items-center gap-2 mr-1">
                <Link
                  href="/ipa"
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>🔤</span>
                  <span>Bảng 44 IPA</span>
                </Link>
                <Link
                  href="/test"
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>🎯</span>
                  <span>8 Dạng Bài Tập</span>
                </Link>
              </div>

              {/* Child Profile Badge */}
              <ChildBadge variant="compact" />

              {/* Admin toggle if logged in */}
              {isAdmin && (
                <button
                  onClick={() => logoutAdmin()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white font-black text-xs shadow-xs border border-amber-300 hover:bg-amber-600 transition-colors"
                  title="Quyền Admin đang bật. Nhấn để khóa lại"
                >
                  <span>👑</span>
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}

              {/* Settings button */}
              <Link
                href="/settings"
                className="w-9 h-9 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-white text-base hover:bg-white/40 transition-colors shadow-xs"
                aria-label="Cài đặt"
                title="Cài đặt & Bố Mẹ"
              >
                ⚙️
              </Link>
            </div>
          </div>

          {/* Quick Stats Banner */}
          {hydrated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-2.5 max-w-md md:max-w-xl mx-auto"
            >
              {[
                { icon: '⭐', val: progress.totalStars, label: 'Ngôi sao' },
                { icon: '🔥', val: progress.streak, label: 'Ngày học' },
                { icon: '🎨', val: (progress.stickers ?? []).length, label: 'Sticker' },
              ].map(({ icon, val, label }) => (
                <div
                  key={label}
                  className="flex-1 bg-white/85 backdrop-blur rounded-2xl py-2 px-2 text-center shadow-xs border border-white/60 hover:scale-[1.02] transition-transform"
                >
                  <div className="text-base sm:text-lg leading-none mb-1">{icon}</div>
                  <p className="font-black text-gray-800 text-base sm:text-lg leading-none">{val}</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs font-bold mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-6xl mx-auto px-4 pt-6 pb-28 relative z-10">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* VIEW 1: GRADES HUB (Màn hình chọn lớp khi vừa vào ứng dụng)                */}
          {/* ========================================================================= */}
          {viewMode === 'grades' ? (
            <motion.div
              key="grades-hub"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* ── BENTO HERO BANNERS: 2 Columns on Desktop, 1 Column on Mobile ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Featured banner for child's registered class */}
                {activeProfile?.gradeId && GRADE_METAS[activeProfile.gradeId] && (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`rounded-3xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col justify-between ${
                      GRADE_METAS[activeProfile.gradeId].heroBg
                    }`}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex-1 pr-2">
                        <span className="inline-block bg-white/20 backdrop-blur text-white text-[10px] font-black px-2.5 py-0.5 rounded-full mb-1.5">
                          ✨ Lớp học của {activeProfile.name.toLowerCase().startsWith('bé') ? activeProfile.name : `Bé ${activeProfile.name}`}
                        </span>
                        <h2 className="text-xl font-black leading-tight drop-shadow-sm">
                          {GRADE_METAS[activeProfile.gradeId].name}
                        </h2>
                        <p className="text-white/85 text-xs mt-1 font-medium line-clamp-2">
                          {GRADE_METAS[activeProfile.gradeId].summary}
                        </p>
                      </div>

                      <div className="text-5xl sm:text-6xl drop-shadow select-none shrink-0">
                        {GRADE_METAS[activeProfile.gradeId].icon}
                      </div>
                    </div>

                    <div className="pt-3 relative z-10">
                      <button
                        onClick={() => {
                          setSelectedGrade(activeProfile.gradeId);
                          setViewMode('units');
                        }}
                        className="bg-white text-gray-900 font-black text-xs px-4 py-2.5 rounded-2xl shadow-md hover:bg-amber-300 hover:text-amber-950 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>▶</span>
                        <span>Vào học lớp của bé</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Featured Banner: 🌟 Từ mới của bé (Tổng hợp từ vựng mới thêm) */}
                {newWordsCategory && newWordsCategory.words.length > 0 && (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="rounded-3xl p-5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-white shadow-lg relative overflow-hidden flex flex-col justify-between"
                    style={{ boxShadow: '0 8px 24px rgba(245,158,11,0.25)' }}
                  >
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/20 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl drop-shadow select-none">🌟</span>
                          <span className="bg-white/25 backdrop-blur text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Mục Từ Mới Của Bé
                          </span>
                        </div>
                        <span className="bg-white text-orange-600 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                          {newWordsCategory.words.length} từ vựng
                        </span>
                      </div>

                      <h3 className="text-xl font-black mt-2 leading-tight drop-shadow-sm">
                        Bộ Sưu Tập Từ Mới Vừa Thêm
                      </h3>
                      <p className="text-white/90 text-xs font-medium mt-1 line-clamp-2">
                        Tổng hợp toàn bộ từ mới vừa thêm vào các chủ đề. Bé có thể ôn tập trung và luyện ngay tại đây!
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4 relative z-10">
                      <Link
                        href={`/learn/${newWordsCategory.id}`}
                        className="py-2.5 px-2 bg-white text-orange-600 rounded-2xl font-black text-xs text-center shadow-md hover:bg-orange-50 active:scale-95 transition-all flex items-center justify-center gap-1"
                      >
                        <span>▶</span>
                        <span>Học từ</span>
                      </Link>
                      <Link
                        href={`/test/${newWordsCategory.id}`}
                        className="py-2.5 px-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-black text-xs text-center shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1"
                      >
                        <span>🎯</span>
                        <span>8 Dạng bài</span>
                      </Link>
                      <Link
                        href={`/speak/${newWordsCategory.id}`}
                        className="py-2.5 px-2 bg-white/25 hover:bg-white/35 backdrop-blur text-white rounded-2xl font-black text-xs text-center shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1 border border-white/30"
                      >
                        <span>🗣️</span>
                        <span>Luyện nói</span>
                      </Link>
                    </div>
                  </motion.div>
                )}

                {/* Featured Banner: 🔔 Ôn tập hôm nay (Spaced Repetition Review) */}
                {dueReviewWords.length > 0 && (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="rounded-3xl p-5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 text-white shadow-lg relative overflow-hidden flex flex-col justify-between"
                    style={{ boxShadow: '0 8px 24px rgba(79,70,229,0.25)' }}
                  >
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/20 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl drop-shadow select-none">🔔</span>
                          <span className="bg-white/25 backdrop-blur text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Ôn Tập Định Kỳ (Spaced Repetition)
                          </span>
                        </div>
                        <span className="bg-white text-indigo-700 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                          {dueReviewWords.length} từ đến hạn
                        </span>
                      </div>

                      <h3 className="text-xl font-black mt-2 leading-tight drop-shadow-sm">
                        Đến Hạn Ôn Tập Hôm Nay!
                      </h3>
                      <p className="text-white/90 text-xs font-medium mt-1 line-clamp-2">
                        Các từ đã học đến lịch nhắc lại (1 - 3 - 7 ngày) theo đường cong trí nhớ. Bé ôn ngay để nhớ lâu nhé!
                      </p>
                    </div>

                    <div className="flex gap-2 mt-4 relative z-10">
                      {dueReviewWords[0]?.catId && (
                        <>
                          <Link
                            href={`/speak/${dueReviewWords[0].catId}`}
                            className="flex-1 py-2.5 px-3 bg-white text-indigo-700 rounded-2xl font-black text-xs text-center shadow-md hover:bg-indigo-50 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>🗣️</span>
                            <span>Luyện nói ôn tập</span>
                          </Link>
                          <Link
                            href={`/test/${dueReviewWords[0].catId}`}
                            className="flex-1 py-2.5 px-3 bg-white/25 hover:bg-white/35 backdrop-blur text-white rounded-2xl font-black text-xs text-center shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-white/30"
                          >
                            <span>🎯</span>
                            <span>8 Dạng bài tập</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ── SECOND ROW BANNERS: IPA & 8 STATIONS (2 columns on PC) ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* IPA Feature Card Banner */}
                <Link
                  href="/ipa"
                  className="block bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-4 text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl shadow-inner shrink-0">
                        🔤
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                            Mới • Chuẩn Quốc Tế
                          </span>
                        </div>
                        <h3 className="text-base font-black leading-tight mt-0.5">
                          Bảng 44 Âm IPA & Hướng Dẫn Phát Âm
                        </h3>
                        <p className="text-xs text-white/90 font-medium line-clamp-1">
                          Khẩu hình răng - môi - lưỡi, mẹo nhớ tiếng Việt
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black bg-white text-orange-600 px-3 py-1.5 rounded-xl shadow-xs shrink-0 ml-2">
                      Xem →
                    </span>
                  </div>
                </Link>

                {/* 8 Exercise Stations Banner */}
                <Link
                  href="/test"
                  className="block bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-4 text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl shadow-inner shrink-0">
                        🎯
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                            Mới • 8 Dạng Bài Tập Chuẩn Sư Phạm
                          </span>
                        </div>
                        <h3 className="text-base font-black leading-tight mt-0.5">
                          Phòng Luyện 8 Dạng Bài & Thi
                        </h3>
                        <p className="text-xs text-white/90 font-medium line-clamp-1">
                          Nghe chọn hình, ghép cặp, điền chữ, lật thẻ, luyện nói...
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black bg-white text-violet-700 px-3 py-1.5 rounded-xl shadow-xs shrink-0 ml-2">
                      Luyện ngay →
                    </span>
                  </div>
                </Link>
              </div>

              {/* Section Header */}
              <div className="flex items-baseline justify-between pt-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-gray-800 tracking-tight">
                    🎒 Các Lớp Học
                  </h2>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">
                    Chọn một lớp để bắt đầu khám phá bài học nhé!
                  </p>
                </div>
              </div>

              {/* Grid of 6 Grade Cards: 2 on Mobile, 3 on Tablet, 6 on PC */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-4.5">
                {GRADE_LEVELS.map((g) => {
                  const meta = GRADE_METAS[g.id] || GRADE_METAS.lop1;
                  const stats = gradeStats[g.id] || { unitCount: 0, wordCount: 0, starsEarned: 0 };
                  const isChildGrade = activeProfile?.gradeId === g.id;

                  return (
                    <GradeCard
                      key={g.id}
                      grade={g}
                      meta={meta}
                      unitCount={stats.unitCount}
                      wordCount={stats.wordCount}
                      starsEarned={stats.starsEarned}
                      isChildGrade={isChildGrade}
                      onClick={() => {
                        setSelectedGrade(g.id);
                        setViewMode('units');
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* ========================================================================= */
            /* VIEW 2: GRADE UNITS (Danh sách các chủ đề bài học của lớp đã chọn)         */
            /* ========================================================================= */
            <motion.div
              key="units-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Back to Grade Hub Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setViewMode('grades')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white shadow-xs border border-orange-200 text-orange-600 font-black text-xs hover:bg-orange-50 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="text-sm leading-none">←</span>
                  <span>Chọn lớp khác</span>
                </button>

                <span className="text-xs font-bold text-gray-500">
                  {currentGradeUnits.length} bài học • {currentGradeWordCount} từ
                </span>
              </div>

              {/* Grade Header Banner */}
              <div
                className={`rounded-3xl p-4 text-white shadow-md bg-gradient-to-r ${currentGradeMeta.gradient}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-4xl select-none">{currentGradeMeta.icon}</div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-black text-white uppercase tracking-wider">
                      {currentGradeMeta.badge} • {currentGradeMeta.age}
                    </span>
                    <h2 className="text-xl font-black leading-tight mt-0.5 drop-shadow-sm">
                      Tiếng Anh {currentGradeMeta.name}
                    </h2>
                    <p className="text-white/90 text-xs font-medium truncate mt-0.5">
                      {currentGradeMeta.summary}
                    </p>
                  </div>
                </div>

                {/* Progress bar inside banner */}
                <div className="mt-3 pt-2.5 border-t border-white/20">
                  <div className="flex justify-between text-[11px] font-black text-white/90 mb-1">
                    <span>Tiến độ cả lớp</span>
                    <span>
                      ⭐ {currentGradeStarsEarned} sao ({currentGradePct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentGradePct}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Grade Switcher Pills (Horizontal scroll) */}
              <div className="flex gap-1.5 overflow-x-auto hide-scrollbar py-1">
                {GRADE_LEVELS.map((g) => {
                  const isSel = selectedGrade === g.id;
                  const gMeta = GRADE_METAS[g.id] || GRADE_METAS.lop1;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGrade(g.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                        isSel
                          ? 'bg-orange-500 text-white shadow-xs scale-105'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <span>{gMeta.icon}</span>
                      <span>{g.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Grid of Unit Cards: 1 Col on Mobile for spacious buttons, 2 on Tablet, 3-4 on PC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-1">
                {currentGradeUnits.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <UnitCard
                      cat={cat}
                      stars={getCategoryStars(cat.id)}
                      isCustom={(cat as any).isCustom}
                      gradeMeta={currentGradeMeta}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Empty state for grade with 0 units */}
              {currentGradeUnits.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200 p-6">
                  <div className="text-5xl mb-3">📭</div>
                  <p className="font-black text-gray-700 text-base">Chưa có bài học nào</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Các bài học cho lớp này đang được cập nhật.
                  </p>
                  <button
                    onClick={() => setViewMode('grades')}
                    className="mt-4 px-4 py-2 rounded-2xl bg-orange-500 text-white text-xs font-black"
                  >
                    ← Khám phá lớp khác
                  </button>
                </div>
              )}

              {/* Admin CTA only if logged in */}
              {isAdmin && (
                <div className="pt-2">
                  <Link
                    href={`/import?targetGrade=${selectedGrade}`}
                    className="flex items-center gap-3 p-4 rounded-3xl border-2 border-dashed border-orange-300 bg-orange-50/70 hover:bg-orange-100/70 transition-colors group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-lg shadow-sm">
                      ✏️
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-sm">Thêm bài học mới (Admin)</p>
                      <p className="text-gray-500 text-xs font-medium">
                        Nhập từ vựng bằng PDF, TXT hoặc ảnh vào {currentGradeMeta.name}
                      </p>
                    </div>
                    <span className="ml-auto text-orange-500 font-black text-lg">→</span>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── FIXED BOTTOM NAVIGATION: Sticky on Mobile, Floating Modern Dock on Desktop ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom pointer-events-none">
        <div className="bg-white/95 backdrop-blur border-t-2 md:border-2 border-orange-200/80 max-w-lg md:max-w-xl mx-auto shadow-2xl md:rounded-3xl md:mb-4 pointer-events-auto">
          <div className="flex items-center justify-around px-2 py-2">
            {[
              {
                id: 'home',
                icon: '🎒',
                label: 'Lớp học',
                active: viewMode === 'grades',
                action: () => setViewMode('grades'),
              },
              {
                id: 'ipa',
                href: '/ipa',
                icon: '🔤',
                label: 'Âm IPA',
                active: false,
              },
              {
                id: 'stickers',
                href: '/stickers',
                icon: '🎨',
                label: 'Sticker',
                active: false,
              },
              {
                id: 'parent',
                href: '/parent',
                icon: '📊',
                label: 'Tiến trình',
                active: false,
                adminOnly: true,
              },
              {
                id: 'settings',
                href: '/settings',
                icon: '⚙️',
                label: 'Cài đặt',
                active: false,
                adminOnly: false,
              },
            ].map((item) => {
              if (item.action) {
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all min-w-[56px] cursor-pointer ${
                      item.active
                        ? 'bg-orange-100 text-orange-600 font-black'
                        : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
                    }`}
                  >
                    <span className="text-xl leading-none">{item.icon}</span>
                    <span className="text-[10px] font-black leading-none">{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href!}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all min-w-[56px] relative ${
                    item.active
                      ? 'bg-orange-100 text-orange-600 font-black'
                      : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
                  }`}
                >
                  <span className="text-xl leading-none relative">
                    {item.icon}
                    {item.adminOnly && !isAdmin && (
                      <span className="absolute -top-1 -right-1 text-[9px] drop-shadow">🔒</span>
                    )}
                  </span>
                  <span className="text-[10px] font-black leading-none">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
