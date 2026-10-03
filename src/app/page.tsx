'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState, useEffect, useMemo } from 'react';
import { CATEGORIES, GRADE_LEVELS, GradeLevel } from '@/lib/vocabulary';
import { useProgress } from '@/hooks/useProgress';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { useAdminContext } from '@/context/AdminContext';
import { ChildBadge } from '@/components/ChildBadge';
import { Category } from '@/types';

// ── Grade Hub & Theme Metadata ───────────────────────────────────────────────
export interface GradeMeta {
  name: string;
  badge: string;
  sub: string;
  age: string;
  gradient: string;
  heroBg: string;
  accent: string;
  border: string;
  icon: string;
  summary: string;
}

const GRADE_METAS: Record<string, GradeMeta> = {
  maugiao: {
    name: 'Mẫu Giáo',
    badge: 'Mầm non',
    sub: 'Động vật, Trái cây, Màu sắc...',
    age: '3 – 5 tuổi',
    gradient: 'from-pink-400 via-rose-400 to-pink-500',
    heroBg: 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600',
    accent: 'bg-pink-100 text-pink-700',
    border: 'border-pink-200',
    icon: '🌸',
    summary: 'Làm quen từ vựng đầu đời qua hình ảnh & âm thanh vui nhộn',
  },
  lop1: {
    name: 'Lớp 1',
    badge: 'Khởi động',
    sub: 'Trường lớp, Đồ chơi, Món ăn...',
    age: '6 – 7 tuổi',
    gradient: 'from-amber-400 via-orange-400 to-amber-500',
    heroBg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600',
    accent: 'bg-amber-100 text-amber-800',
    border: 'border-amber-200',
    icon: '🌻',
    summary: 'Chuẩn bị hành trang vào lớp 1 tự tin, phát âm chuẩn',
  },
  lop2: {
    name: 'Lớp 2',
    badge: 'Tăng tốc',
    sub: 'Số đếm, Quần áo, Thời tiết, Nhà cửa...',
    age: '7 – 8 tuổi',
    gradient: 'from-lime-400 via-emerald-400 to-teal-500',
    heroBg: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600',
    accent: 'bg-emerald-100 text-emerald-800',
    border: 'border-emerald-200',
    icon: '🌟',
    summary: 'Phát triển phản xạ nghe - đọc câu ngắn tiếng Anh',
  },
  lop3: {
    name: 'Lớp 3',
    badge: 'Mở rộng',
    sub: 'Thể thao, Giao thông, Nghề nghiệp...',
    age: '8 – 9 tuổi',
    gradient: 'from-teal-400 via-cyan-400 to-blue-500',
    heroBg: 'bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600',
    accent: 'bg-teal-100 text-teal-800',
    border: 'border-teal-200',
    icon: '🌿',
    summary: 'Bám sát khung chương trình mới Bộ Giáo Dục & Đào Tạo',
  },
  lop4: {
    name: 'Lớp 4',
    badge: 'SGK Tập 1 & 2',
    sub: '20 Unit đầy đủ Tập 1 & Tập 2',
    age: '9 – 10 tuổi',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    heroBg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600',
    accent: 'bg-blue-100 text-blue-800',
    border: 'border-blue-200',
    icon: '🌊',
    summary: 'Toàn bộ 20 bài học chuẩn SGK Tiếng Anh 4 Global Success',
  },
  lop5: {
    name: 'Lớp 5',
    badge: 'SGK Tập 1 & 2',
    sub: '20 Unit đầy đủ Tập 1 & Tập 2',
    age: '10 – 11 tuổi',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
    heroBg: 'bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600',
    accent: 'bg-violet-100 text-violet-800',
    border: 'border-violet-200',
    icon: '🔮',
    summary: 'Toàn bộ 20 bài học chuẩn SGK Tiếng Anh 5 Global Success',
  },
};

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
  const maxStars = cat.words.length * 3;
  const pct = maxStars > 0 ? Math.round((stars / maxStars) * 100) : 0;
  const canTest = pct >= 50;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-3xl p-4 bg-white border-2 border-orange-100 shadow-md hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between"
      style={{ boxShadow: '0 6px 0 rgba(249,115,22,0.06), 0 12px 24px rgba(0,0,0,0.04)' }}
    >
      {/* Background soft bubble */}
      <div
        className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${gradeMeta.gradient} opacity-15 pointer-events-none`}
      />

      <div>
        {/* Top bar with emoji & badge */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-4xl drop-shadow select-none">{cat.emoji}</span>
          <div className="flex items-center gap-1">
            {isCustom && (
              <span className="text-[10px] bg-violet-100 text-violet-700 rounded-full px-2 py-0.5 font-black">
                ✨ Mới
              </span>
            )}
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
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
        <Link
          href={`/learn/${cat.id}`}
          className={`py-2 px-2.5 rounded-2xl font-black text-xs text-center text-white bg-gradient-to-r ${gradeMeta.gradient} shadow-xs hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1`}
        >
          <span>▶</span>
          <span>Học</span>
        </Link>
        <Link
          href={`/test/${cat.id}`}
          className={`py-2 px-2 rounded-2xl font-black text-xs text-center transition-all flex items-center justify-center gap-1 ${
            canTest
              ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
              : 'bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100'
          }`}
          title="Làm bài kiểm tra 10 câu để nhận Sticker"
        >
          <span>📋</span>
          <span>Thi {canTest ? '⭐' : ''}</span>
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
  const { progress, hydrated, activeProfile } = useProgress();
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

  const gradeCustomCats = (gradeId: string): Category[] =>
    customHydrated && selectedGrade === gradeId
      ? customCats.map((c) => ({
          id: c.id,
          name_vi: c.name_vi,
          name_en: c.name_en,
          emoji: c.emoji,
          color: c.color,
          gradient: c.gradient,
          words: c.words,
        }))
      : [];

  // Grade stats calculations
  const gradeStats = useMemo(() => {
    const stats: Record<string, { unitCount: number; wordCount: number; starsEarned: number }> = {};
    GRADE_LEVELS.forEach((g) => {
      const builtin = gradeCats(g.id);
      const custom = customHydrated && selectedGrade === g.id ? customCats : [];
      const all = [...builtin, ...custom];
      const unitCount = all.length;
      const wordCount = all.reduce((sum, c) => sum + c.words.length, 0);
      const starsEarned = all.reduce((sum, c) => sum + getCategoryStars(c.id), 0);
      stats[g.id] = { unitCount, wordCount, starsEarned };
    });
    return stats;
  }, [hydrated, customHydrated, customCats, progress.wordProgress, selectedGrade]);

  const currentGradeMeta = GRADE_METAS[selectedGrade] || GRADE_METAS.lop1;
  const currentGradeUnits = [...gradeCats(selectedGrade), ...gradeCustomCats(selectedGrade)];
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
        <div className="max-w-lg mx-auto">
          {/* Top Row: App title, Child badge, Admin/Settings buttons */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/" onClick={() => setViewMode('grades')} className="flex items-center gap-1.5 group">
              <h1
                className="text-2xl font-black text-white drop-shadow-md tracking-tight group-hover:scale-105 transition-transform"
                style={{ fontFamily: 'var(--font-baloo), sans-serif' }}
              >
                VocaKids 🦉
              </h1>
            </Link>

            <div className="flex items-center gap-2">
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
                className="w-8 h-8 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-white text-sm hover:bg-white/40 transition-colors shadow-xs"
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
              className="flex gap-2.5"
            >
              {[
                { icon: '⭐', val: progress.totalStars, label: 'Ngôi sao' },
                { icon: '🔥', val: progress.streak, label: 'Ngày học' },
                { icon: '🎨', val: (progress.stickers ?? []).length, label: 'Sticker' },
              ].map(({ icon, val, label }) => (
                <div
                  key={label}
                  className="flex-1 bg-white/80 backdrop-blur rounded-2xl py-2 px-1 text-center shadow-xs border border-white/60"
                >
                  <div className="text-base leading-none mb-1">{icon}</div>
                  <p className="font-black text-gray-800 text-base leading-none">{val}</p>
                  <p className="text-gray-500 text-[10px] font-bold mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-lg mx-auto px-4 pt-4 pb-28 relative z-10">
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
              {/* Featured banner for child's registered class */}
              {activeProfile?.gradeId && GRADE_METAS[activeProfile.gradeId] && (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`rounded-3xl p-5 text-white shadow-lg relative overflow-hidden ${
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
                      <p className="text-white/85 text-xs mt-1 font-medium line-clamp-1">
                        {GRADE_METAS[activeProfile.gradeId].summary}
                      </p>

                      <button
                        onClick={() => {
                          setSelectedGrade(activeProfile.gradeId);
                          setViewMode('units');
                        }}
                        className="mt-3.5 bg-white text-gray-900 font-black text-xs px-4 py-2.5 rounded-2xl shadow-md hover:bg-amber-300 hover:text-amber-950 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>▶</span>
                        <span>Vào học lớp của bé</span>
                      </button>
                    </div>

                    <div className="text-6xl drop-shadow select-none shrink-0">
                      {GRADE_METAS[activeProfile.gradeId].icon}
                    </div>
                  </div>
                </motion.div>
              )}

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
                      <p className="text-xs text-white/90 font-medium">
                        Khẩu hình răng - môi - lưỡi, mẹo tiếng Việt & giải mã từ
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-black bg-white text-orange-600 px-3 py-1.5 rounded-xl shadow-xs shrink-0 ml-2">
                    Xem →
                  </span>
                </div>
              </Link>

              {/* Section Header */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <h2 className="text-lg font-black text-gray-800 tracking-tight">
                    🎒 Các Lớp Học
                  </h2>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">
                    Chọn một lớp để bắt đầu khám phá bài học nhé!
                  </p>
                </div>
              </div>

              {/* Grid of 6 Grade Cards */}
              <div className="grid grid-cols-2 gap-3.5">
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

              {/* Grid of Unit Cards */}
              <div className="grid grid-cols-2 gap-3 pt-1">
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

      {/* ── FIXED BOTTOM NAVIGATION ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
        <div className="bg-white/95 backdrop-blur border-t-2 border-orange-100 max-w-lg mx-auto shadow-lg">
          <div className="flex items-center justify-around px-1.5 py-2">
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
