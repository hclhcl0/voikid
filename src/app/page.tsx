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

// ── Unit Category Card (Claymorphic, tactile, kid-friendly) ───────────────────
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
  const isCompleted = pct === 100;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className={`rounded-3xl p-4.5 transition-all relative overflow-hidden flex flex-col justify-between ${
        isNewWords
          ? 'bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-amber-300 ring-2 ring-amber-200/70 shadow-md hover:shadow-xl'
          : isCompleted
          ? 'bg-white border-2 border-emerald-200 shadow-sm hover:shadow-md'
          : 'bg-white border-2 border-orange-100 shadow-sm hover:shadow-lg'
      }`}
      style={{
        boxShadow: isNewWords
          ? '0 6px 0 rgba(245,158,11,0.18), 0 12px 24px rgba(0,0,0,0.04)'
          : isCompleted
          ? '0 6px 0 rgba(16,185,129,0.1), 0 10px 20px rgba(0,0,0,0.03)'
          : '0 6px 0 rgba(249,115,22,0.06), 0 10px 20px rgba(0,0,0,0.03)',
      }}
    >
      {/* Background soft bubble */}
      <div
        className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${
          isNewWords
            ? 'bg-amber-400 opacity-20'
            : isCompleted
            ? 'bg-emerald-400 opacity-15'
            : `bg-gradient-to-br ${gradeMeta.gradient} opacity-15`
        } pointer-events-none`}
      />

      <div>
        {/* Top bar with emoji & badge */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-4xl drop-shadow select-none">{cat.emoji}</span>
          <div className="flex items-center gap-1">
            {isNewWords ? (
              <span className="text-[10px] bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full px-2.5 py-0.5 font-black shadow-xs">
                🌟 TỪ MỚI
              </span>
            ) : isCompleted ? (
              <span className="text-[10px] bg-emerald-100 text-emerald-700 rounded-full px-2.5 py-0.5 font-black flex items-center gap-0.5">
                ✓ Hoàn thành
              </span>
            ) : isCustom ? (
              <span className="text-[10px] bg-violet-100 text-violet-700 rounded-full px-2 py-0.5 font-black">
                ✨ Tự thêm
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
        <div className="mt-3 mb-3.5">
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 mb-1">
            <span>Tiến độ bài</span>
            <span className={pct > 0 ? (isCompleted ? 'text-emerald-600 font-black' : 'text-amber-500 font-black') : 'text-gray-400'}>
              ⭐ {stars}/{maxStars} ({pct}%)
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: 0.05 }}
              className={`h-full rounded-full ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                  : 'bg-gradient-to-r from-amber-400 to-orange-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Action buttons (min touch target >= 44px) */}
      <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-gray-100">
        <Link
          href={`/learn/${cat.id}`}
          className={`min-h-[44px] py-2 px-2.5 rounded-2xl font-black text-xs text-center text-white shadow-xs hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            isNewWords
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-md'
              : `bg-gradient-to-r ${gradeMeta.gradient}`
          }`}
        >
          <span>▶</span>
          <span>Học từ</span>
        </Link>
        <Link
          href={`/test/${cat.id}`}
          className="min-h-[44px] py-2 px-2 rounded-2xl font-black text-xs text-center transition-all flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs hover:opacity-95 active:scale-95 cursor-pointer"
          title="Luyện tập 8 dạng bài & làm bài thi nhận Sticker"
        >
          <span>🎯</span>
          <span>Luyện tập</span>
        </Link>
      </div>
    </motion.div>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function HomePage() {
  const { progress, hydrated, activeProfile, getDueReviewWords } = useProgress();
  const { categories: customCats, hydrated: customHydrated } = useCustomCategories();
  const { isAdmin, logoutAdmin } = useAdminContext();

  // Active selected grade in the selector bar (defaults to child's grade or Grade 1)
  const [selectedGrade, setSelectedGrade] = useState<string>(GRADE_LEVELS[0].id);

  // Sync active grade from child's profile on initial mount
  useEffect(() => {
    if (activeProfile?.gradeId && GRADE_METAS[activeProfile.gradeId]) {
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

  // Grade categories helper
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

    // Pin "🌟 Từ mới của bé" at the top of the child's own grade or when viewing custom words!
    if (newWordsCategory && (selectedGrade === activeProfile?.gradeId || selectedGrade === 'mamnon')) {
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
  }, [selectedGrade, customHydrated, customCats, newWordsCategory, activeProfile?.gradeId]);

  const currentGradeWordCount = currentGradeUnits.reduce((sum, c) => sum + c.words.length, 0);
  const currentGradeStarsEarned = currentGradeUnits.reduce((sum, c) => sum + getCategoryStars(c.id), 0);
  const currentGradeMaxStars = currentGradeWordCount * 3;
  const currentGradePct =
    currentGradeMaxStars > 0 ? Math.round((currentGradeStarsEarned / currentGradeMaxStars) * 100) : 0;

  // Intelligent "Continue Learning / Next Lesson" Recommendation
  const recommendedUnit = useMemo(() => {
    if (!currentGradeUnits || currentGradeUnits.length === 0) return null;

    // 1. Check if there's a unit in progress (started, but not full stars)
    const inProgress = currentGradeUnits.find((cat) => {
      const stars = getCategoryStars(cat.id);
      const max = cat.words.length * 3;
      return stars > 0 && stars < max;
    });
    if (inProgress) return inProgress;

    // 2. Check for the first unstarted unit
    const unstarted = currentGradeUnits.find((cat) => {
      const stars = getCategoryStars(cat.id);
      return stars === 0;
    });
    if (unstarted) return unstarted;

    // 3. Fallback to first unit
    return currentGradeUnits[0];
  }, [currentGradeUnits, hydrated, progress.wordProgress]);

  const recommendedStars = recommendedUnit ? getCategoryStars(recommendedUnit.id) : 0;
  const recommendedMaxStars = recommendedUnit ? recommendedUnit.words.length * 3 : 0;
  const recommendedPct = recommendedMaxStars > 0 ? Math.round((recommendedStars / recommendedMaxStars) * 100) : 0;

  const bubbles = ['🍎', '🐱', '🌈', '🐶', '🌟', '🦋'];

  return (
    <div className="relative min-h-screen bg-[#FFF7ED] overflow-x-hidden text-gray-800">
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

      {/* ── TOP CLAYMORPHIC HEADER ── */}
      <header
        className="relative bg-gradient-to-b from-orange-400 via-amber-400 to-[#FFF7ED] pb-6 pt-5 px-4 z-10"
        style={{ borderRadius: '0 0 36px 36px' }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Top Bar: Logo, Child Profile, Admin / Settings */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl drop-shadow select-none group-hover:scale-110 transition-transform">🦉</span>
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-black text-white drop-shadow-md tracking-tight leading-none"
                  style={{ fontFamily: 'var(--font-baloo), sans-serif' }}
                >
                  VocaKids
                </h1>
                <p className="text-[10px] sm:text-xs text-white/95 font-bold hidden sm:block">
                  Tiếng Anh Tiểu Học Cho Bé
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-2.5">
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

          {/* Daily Motivation Stats Bar */}
          {hydrated && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto"
            >
              {[
                { icon: '⭐', val: progress.totalStars, label: 'Ngôi sao', color: 'text-amber-500' },
                { icon: '🔥', val: progress.streak, label: 'Ngày học', color: 'text-orange-500' },
                { icon: '🎨', val: (progress.stickers ?? []).length, label: 'Sticker', color: 'text-violet-600' },
              ].map(({ icon, val, label, color }) => (
                <div
                  key={label}
                  className="bg-white/90 backdrop-blur rounded-2xl py-2 px-2 text-center shadow-xs border border-white/80 hover:scale-[1.02] transition-transform"
                >
                  <div className="text-base sm:text-lg leading-none mb-0.5">{icon}</div>
                  <p className={`font-black text-base sm:text-lg leading-tight ${color}`}>{val}</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs font-bold">{label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-5xl mx-auto px-4 pt-5 pb-28 relative z-10 space-y-5">
        {/* ── 1. PRIMARY HERO CARD: TIẾP TỤC BÀI HỌC CỦA BÉ ── */}
        {recommendedUnit && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-white via-orange-50/40 to-amber-50/60 border-2 border-orange-200/90 shadow-md relative overflow-hidden"
            style={{
              boxShadow: '0 8px 0 rgba(249,115,22,0.08), 0 16px 28px rgba(0,0,0,0.04)',
            }}
          >
            {/* Background decorative bubble */}
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-orange-400/10 pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-400 text-white flex items-center justify-center text-4xl shadow-md shrink-0">
                  {recommendedUnit.emoji}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] sm:text-xs font-black bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ✨ Bài học tiếp theo
                    </span>
                    <span className="text-[11px] font-bold text-gray-500">
                      {recommendedUnit.words.length} từ
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black text-gray-800 leading-tight truncate">
                    {recommendedUnit.name_vi}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold truncate mt-0.5">
                    {recommendedUnit.name_en}
                  </p>

                  {/* Progress indicator */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-28 sm:w-36 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
                        style={{ width: `${recommendedPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-black text-amber-600">
                      ⭐ {recommendedStars}/{recommendedMaxStars} ({recommendedPct}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Big tactile CTA buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                <Link
                  href={`/learn/${recommendedUnit.id}`}
                  className="flex-1 sm:flex-initial min-h-[48px] px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm text-center shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  style={{ boxShadow: '0 4px 0 #c2410c, 0 8px 16px rgba(249,115,22,0.25)' }}
                >
                  <span className="text-base leading-none">▶</span>
                  <span>Vào học ngay</span>
                </Link>
                <Link
                  href={`/test/${recommendedUnit.id}`}
                  className="flex-1 sm:flex-initial min-h-[48px] px-4 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm text-center shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ boxShadow: '0 4px 0 #4c1d95, 0 8px 16px rgba(109,40,217,0.25)' }}
                  title="Luyện tập 8 dạng bài"
                >
                  <span className="text-base leading-none">🎯</span>
                  <span>Luyện tập</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 2. SPACED REPETITION REVIEW STRIP (If words are due) ── */}
        {dueReviewWords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 text-white rounded-2xl p-3 sm:p-3.5 shadow-md flex items-center justify-between gap-3 border border-indigo-300/40"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-2xl drop-shadow select-none animate-pulse">🔔</span>
              <div className="min-w-0">
                <p className="font-black text-xs sm:text-sm leading-tight truncate">
                  Bé có <span className="text-yellow-300 font-extrabold">{dueReviewWords.length} từ</span> đến lịch ôn tập hôm nay!
                </p>
                <p className="text-[10px] sm:text-xs text-white/85 font-medium truncate">
                  Ôn lại định kỳ để khắc sâu vào trí nhớ dài hạn
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {dueReviewWords[0]?.catId && (
                <Link
                  href={`/speak/${dueReviewWords[0].catId}`}
                  className="bg-white text-indigo-700 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs hover:bg-yellow-300 hover:text-indigo-950 transition-colors cursor-pointer"
                >
                  Ôn ngay →
                </Link>
              )}
            </div>
          </motion.div>
        )}

        {/* ── 3. FEATURE SHORTCUTS: 2 COMPACT CARDS SIDE-BY-SIDE ── */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* IPA Card */}
          <Link
            href="/ipa"
            className="group bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-3.5 sm:p-4.5 text-white shadow-md hover:shadow-lg hover:scale-[1.015] active:scale-[0.985] transition-all relative overflow-hidden flex flex-col justify-between"
            style={{ boxShadow: '0 6px 0 rgba(249,115,22,0.14), 0 10px 20px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl sm:text-3xl drop-shadow">🔤</span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                Chuẩn IPA
              </span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black leading-tight drop-shadow-xs">
                Bảng 44 Âm IPA
              </h3>
              <p className="text-[11px] sm:text-xs text-white/90 font-medium mt-0.5 line-clamp-1">
                Khẩu hình & mẹo phát âm
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-[11px] font-bold">
              <span>Luyện âm chuẩn</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* 8 Dạng Bài Tập Card */}
          <Link
            href="/test"
            className="group bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-3.5 sm:p-4.5 text-white shadow-md hover:shadow-lg hover:scale-[1.015] active:scale-[0.985] transition-all relative overflow-hidden flex flex-col justify-between"
            style={{ boxShadow: '0 6px 0 rgba(109,40,217,0.14), 0 10px 20px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl sm:text-3xl drop-shadow">🎯</span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                8 Dạng Bài
              </span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black leading-tight drop-shadow-xs">
                Phòng Luyện Bài & Thi
              </h3>
              <p className="text-[11px] sm:text-xs text-white/90 font-medium mt-0.5 line-clamp-1">
                Nghe, ghép, viết & Sticker
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-[11px] font-bold">
              <span>Vào luyện ngay</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>

        {/* ── 4. GRADE SELECTOR PILL TABS ── */}
        <section className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎒</span>
              <h2 className="text-base sm:text-lg font-black text-gray-800 tracking-tight">
                Chủ Đề Theo Lớp
              </h2>
            </div>
            <span className="text-xs font-bold text-gray-500">
              {currentGradeUnits.length} bài • {currentGradeWordCount} từ
            </span>
          </div>

          {/* Smooth horizontal scrollable pill bar */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1 px-0.5">
            {GRADE_LEVELS.map((g) => {
              const isSel = selectedGrade === g.id;
              const gMeta = GRADE_METAS[g.id] || GRADE_METAS.lop1;
              const isChildGrade = activeProfile?.gradeId === g.id;

              return (
                <motion.button
                  key={g.id}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedGrade(g.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer relative ${
                    isSel
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md ring-2 ring-orange-300'
                      : 'bg-white text-gray-700 border-2 border-orange-100 hover:border-orange-200 shadow-xs'
                  }`}
                  style={{
                    boxShadow: isSel
                      ? '0 4px 12px rgba(249,115,22,0.25)'
                      : '0 2px 4px rgba(0,0,0,0.03)',
                  }}
                >
                  <span className="text-base">{gMeta.icon}</span>
                  <span className="text-xs sm:text-sm font-black whitespace-nowrap">{g.label}</span>
                  {isChildGrade && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                        isSel ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      Lớp của bé ⭐
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Active Grade Compact Summary Card */}
          <div
            className={`rounded-3xl p-4 sm:p-5 text-white shadow-md bg-gradient-to-r ${currentGradeMeta.gradient} relative overflow-hidden`}
            style={{ boxShadow: '0 6px 0 rgba(0,0,0,0.04), 0 10px 20px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl shadow-inner shrink-0">
                  {currentGradeMeta.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-black text-white uppercase tracking-wider">
                      {currentGradeMeta.badge} • {currentGradeMeta.age}
                    </span>
                    {selectedGrade === activeProfile?.gradeId && (
                      <span className="text-[10px] bg-amber-400 text-gray-900 px-2 py-0.5 rounded-full font-black shadow-xs">
                        Lớp của bé ⭐
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black leading-tight mt-1 drop-shadow-sm">
                    Tiếng Anh {currentGradeMeta.name}
                  </h3>
                  <p className="text-white/90 text-xs font-medium line-clamp-1 mt-0.5">
                    {currentGradeMeta.summary}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-2xl font-black leading-none">⭐ {currentGradeStarsEarned}</p>
                <p className="text-[10px] text-white/80 font-bold mt-1">sao đã đạt ({currentGradePct}%)</p>
              </div>
            </div>

            {/* Progress bar inside banner */}
            <div className="mt-3 pt-2.5 border-t border-white/20">
              <div className="flex justify-between text-[11px] font-black text-white/90 mb-1">
                <span>Tiến độ chương trình ({currentGradeUnits.length} bài • {currentGradeWordCount} từ)</span>
                <span className="sm:hidden font-black">⭐ {currentGradeStarsEarned} sao ({currentGradePct}%)</span>
              </div>
              <div className="h-2.5 bg-black/15 rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentGradePct}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-white rounded-full shadow-xs"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. UNITS GRID: TACTILE, CLEAN, DIRECT ACCESS ── */}
        <section className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
            {currentGradeUnits.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
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
        </section>
      </main>

      {/* ── FIXED BOTTOM NAVIGATION DOCK ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom pointer-events-none">
        <div className="bg-white/95 backdrop-blur border-t-2 md:border-2 border-orange-200/80 max-w-lg md:max-w-xl mx-auto shadow-2xl md:rounded-3xl md:mb-4 pointer-events-auto">
          <div className="flex items-center justify-around px-2 py-2">
            {[
              {
                id: 'home',
                icon: '🎒',
                label: 'Lớp học',
                active: true,
                action: () => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                },
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
