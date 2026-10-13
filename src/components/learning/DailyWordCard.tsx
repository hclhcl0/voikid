'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Volume2, ChevronLeft, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';
import { useProgress } from '@/hooks/useProgress';
import { useCustomCategories, NEW_WORDS_CAT_ID } from '@/hooks/useCustomCategories';
import { useTTS } from '@/hooks/useTTS';
import { triggerHaptic } from '@/lib/haptics';
import { selectDailyWords } from '@/lib/dailyWords';
import { EmojiImage } from '@/components/WordImage';

export function DailyWordCard() {
  const { categories: serverCategories, settings } = useVocabularyCatalog();
  const { categories: customCategories, hydrated: customHydrated } = useCustomCategories();
  const { progress, hydrated, activeProfile } = useProgress();
  const { speak, isSpeaking } = useTTS();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const selectedGrade = activeProfile?.gradeId ?? 'lop1';

  // Tổng hợp categories của khối lớp
  const categories = useMemo(() => {
    return [
      ...(customHydrated ? customCategories.filter(c => c.id === NEW_WORDS_CAT_ID ? c.words.length > 0 : !c.gradeId || c.gradeId === selectedGrade) : []),
      ...serverCategories.filter(c => (c as { gradeId?: string }).gradeId === selectedGrade || !(c as { gradeId?: string }).gradeId),
    ];
  }, [customCategories, customHydrated, serverCategories, selectedGrade]);

  // Cấu hình số từ mỗi ngày (mặc định 5 từ để slider chạy sinh động)
  const dailyCount = settings.dailyNewWordsCount && settings.dailyNewWordsCount > 1
    ? settings.dailyNewWordsCount
    : 5;

  // Lấy danh sách từ mới của ngày
  const dailyWords = useMemo(() => {
    if (!hydrated || categories.length === 0) return [];
    return selectDailyWords({
      categories,
      gradeId: selectedGrade,
      count: dailyCount,
      source: settings.dailyNewWordsSource,
      wordProgress: progress.wordProgress,
    });
  }, [categories, selectedGrade, dailyCount, settings.dailyNewWordsSource, progress.wordProgress, hydrated]);

  const totalWords = dailyWords.length;
  const safeIndex = totalWords > 0 ? Math.min(currentIndex, totalWords - 1) : 0;
  const currentItem = dailyWords[safeIndex] || dailyWords[0];

  const handleNext = () => {
    if (totalWords <= 1) return;
    triggerHaptic('light');
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalWords);
  };

  const handlePrev = () => {
    if (totalWords <= 1) return;
    triggerHaptic('light');
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalWords) % totalWords);
  };

  const handleGoTo = (index: number) => {
    if (index === safeIndex) return;
    triggerHaptic('light');
    setDirection(index > safeIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Tự động trượt từ mới mỗi 4.5 giây khi không di chuột hoặc chạm
  useEffect(() => {
    if (totalWords <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % totalWords);
    }, 4500);
    return () => clearInterval(interval);
  }, [totalWords, isPaused]);

  if (!hydrated || dailyWords.length === 0 || !currentItem) return null;

  const dateFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
  });

  return (
    <section
      aria-label="Từ mới hôm nay"
      className="relative overflow-hidden rounded-3xl border-2 border-amber-200/90 bg-gradient-to-br from-amber-50/90 via-orange-50/80 to-rose-50/70 p-4 sm:p-5 shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.targetTouches[0].clientX;
        setIsPaused(true);
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current !== null) {
          const touchEndX = e.changedTouches[0].clientX;
          const diff = touchStartX.current - touchEndX;
          if (diff > 40) handleNext();
          else if (diff < -40) handlePrev();
        }
        touchStartX.current = null;
        setIsPaused(false);
      }}
    >
      {/* Background visual accents */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-200/40 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-orange-200/40 blur-2xl" />

      {/* Header bar */}
      <div className="relative flex items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xs">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                Từ Mới Hôm Nay
              </h2>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                {totalWords} từ
              </span>
            </div>
            <p className="text-[11px] text-slate-500 capitalize">{dateFormatted}</p>
          </div>
        </div>

        {/* Slider Controls */}
        {totalWords > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-200/90 bg-white/90 text-slate-600 hover:bg-white hover:text-orange-600 active:scale-95 transition-all shadow-xs"
              aria-label="Từ trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[40px] text-center text-xs font-black text-slate-600 select-none">
              {safeIndex + 1}/{totalWords}
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-200/90 bg-white/90 text-slate-600 hover:bg-white hover:text-orange-600 active:scale-95 transition-all shadow-xs"
              aria-label="Từ kế tiếp"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Slider Viewport */}
      <div className="relative mt-3.5 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentItem.word.id}
            initial={{ opacity: 0, x: direction * 35 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 35 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            {/* Clickable Card -> Mở phòng học từ mới chi tiết */}
            <Link
              href={`/daily?wordId=${encodeURIComponent(currentItem.word.id)}`}
              onClick={() => triggerHaptic('light')}
              className="group block relative rounded-2xl border-2 border-amber-200/90 bg-white/95 p-4 sm:p-5 shadow-[0_4px_0_0_#fde68a] hover:shadow-[0_6px_0_0_#fcd34d] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              title={`Nhấn để vào học chi tiết từ ${currentItem.word.en}`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Thông tin từ mới: Ảnh, từ tiếng Anh, phiên âm, nghĩa tiếng Việt */}
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full sm:w-auto">
                  <div className="relative flex-shrink-0 group-hover:scale-105 transition-transform">
                    <EmojiImage emoji={currentItem.word.emoji} alt={currentItem.word.en} size="xl" />
                  </div>

                  <div className="space-y-1 w-full sm:w-auto">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                      <span className="rounded-lg bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-orange-700">
                        {currentItem.category.name_vi}
                      </span>
                      {currentItem.isCompleted ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                          <CheckCircle className="h-3 w-3" /> Đã thuộc
                        </span>
                      ) : currentItem.isLearned ? (
                        <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                          ✓ Đã học
                        </span>
                      ) : (
                        <span className="rounded-lg bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                          🌟 Từ mới
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-2.5">
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-orange-600 transition-colors tracking-tight">
                        {currentItem.word.en}
                      </h3>
                      {/* Nút nghe thử phát âm */}
                      <button
                        type="button"
                        disabled={isSpeaking}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          speak(currentItem.word.en, 'en-US', 0.85);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 active:scale-90 transition-all shadow-xs"
                        title="Nghe phát âm chuẩn"
                        aria-label={`Nghe phát âm ${currentItem.word.en}`}
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>

                    {currentItem.word.phonetic && (
                      <p className="text-xs sm:text-sm font-semibold font-mono text-orange-600">
                        {currentItem.word.phonetic}
                      </p>
                    )}

                    <p className="text-base sm:text-lg font-bold text-slate-700">
                      {currentItem.word.vi}
                    </p>
                  </div>
                </div>

                {/* Nút hành động kêu gọi vào trang chi tiết */}
                <div className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-xs sm:text-sm font-black text-white shadow-md group-hover:from-orange-600 group-hover:to-amber-600 transition-all">
                  <span>Học chi tiết &amp; Luyện nói AI</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      {totalWords > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {dailyWords.map((item, idx) => (
            <button
              key={item.word.id}
              onClick={() => handleGoTo(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === safeIndex
                  ? 'w-6 bg-orange-600 shadow-xs'
                  : item.isCompleted
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-amber-200 hover:bg-amber-300'
              }`}
              title={`Từ ${idx + 1}: ${item.word.en}`}
              aria-label={`Chuyển đến từ ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
