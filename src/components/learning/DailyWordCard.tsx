'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Volume2, Mic, BookOpen, CheckCircle, ArrowRight, Award } from 'lucide-react';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';
import { useProgress } from '@/hooks/useProgress';
import { useCustomCategories, NEW_WORDS_CAT_ID } from '@/hooks/useCustomCategories';
import { useTTS } from '@/hooks/useTTS';
import { selectDailyWords, getTodayDateString } from '@/lib/dailyWords';
import { EmojiImage } from '@/components/WordImage';

export function DailyWordCard() {
  const { categories: serverCategories, settings } = useVocabularyCatalog();
  const { categories: customCategories, hydrated: customHydrated } = useCustomCategories();
  const { progress, hydrated, activeProfile } = useProgress();
  const { speak, isSpeaking } = useTTS();
  const [currentIndex, setCurrentIndex] = useState(0);

  const selectedGrade = activeProfile?.gradeId ?? 'lop1';

  // Tổng hợp categories của khối lớp
  const categories = useMemo(() => {
    return [
      ...(customHydrated ? customCategories.filter(c => c.id === NEW_WORDS_CAT_ID ? c.words.length > 0 : !c.gradeId || c.gradeId === selectedGrade) : []),
      ...serverCategories.filter(c => (c as { gradeId?: string }).gradeId === selectedGrade || !(c as { gradeId?: string }).gradeId),
    ];
  }, [customCategories, customHydrated, serverCategories, selectedGrade]);

  const dailyCount = settings.dailyNewWordsCount ?? 1;

  // Lấy danh sách từ của ngày
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

  if (!hydrated || dailyWords.length === 0) return null;

  const currentItem = dailyWords[currentIndex] || dailyWords[0];
  const { word, category, isLearned, isSpoken, isCompleted } = currentItem;

  const totalWords = dailyWords.length;
  const completedWords = dailyWords.filter(w => w.isCompleted).length;
  const allFinished = completedWords === totalWords && totalWords > 0;

  const todayStr = getTodayDateString();
  const dateFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
  });

  return (
    <section
      aria-label="Từ mới hôm nay"
      className="relative overflow-hidden rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/90 via-orange-50/80 to-rose-50/70 p-5 shadow-sm sm:p-6"
    >
      {/* Background visual accents */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-amber-200/40 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-orange-200/40 blur-2xl" />

      {/* Header bar */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                Từ Mới Hôm Nay
              </h2>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                {totalWords} từ/ngày
              </span>
            </div>
            <p className="text-xs text-slate-500 capitalize">{dateFormatted}</p>
          </div>
        </div>

        {/* Progress status badge */}
        <div className="flex items-center gap-2">
          {totalWords > 1 && (
            <div className="flex gap-1">
              {dailyWords.map((item, idx) => (
                <button
                  key={item.word.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-6 bg-orange-600'
                      : item.isCompleted
                      ? 'w-2.5 bg-emerald-500'
                      : 'w-2.5 bg-amber-200 hover:bg-amber-300'
                  }`}
                  title={`Từ ${idx + 1}: ${item.word.en}`}
                />
              ))}
            </div>
          )}
          <span
            className={`rounded-xl px-2.5 py-1 text-xs font-bold ${
              allFinished
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100/90 text-amber-900'
            }`}
          >
            {allFinished ? '✓ Đã xong hôm nay!' : `Đã hoàn thành ${completedWords}/${totalWords}`}
          </span>
        </div>
      </div>

      {/* Main Word Display Card */}
      <div className="relative mt-4 flex flex-col md:flex-row items-stretch gap-5">
        {/* Left: Word Visual & Pronunciation */}
        <div className="flex flex-1 flex-col justify-between rounded-2xl border border-amber-200/80 bg-white/90 p-5 shadow-xs backdrop-blur-xs">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <EmojiImage emoji={word.emoji} alt={word.en} size="lg" />
                <div>
                  <span className="text-xs font-medium text-slate-400">
                    Chủ đề: {category.name_vi}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-2xl font-black text-slate-900 sm:text-3xl">
                      {word.en}
                    </h3>
                    <button
                      type="button"
                      disabled={isSpeaking}
                      onClick={() => speak(word.en, 'en-US', 0.85)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
                      title="Nghe phát âm chuẩn"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                  {word.phonetic && (
                    <p className="text-sm font-medium text-orange-600 font-mono">
                      {word.phonetic}
                    </p>
                  )}
                </div>
              </div>

              {/* Status pills */}
              <div className="flex flex-col items-end gap-1">
                {isCompleted ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                    <CheckCircle className="h-3 w-3" /> Hoàn thành
                  </span>
                ) : (
                  <div className="flex items-center gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isLearned
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isLearned ? '✓ Đã học' : 'Chưa học'}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isSpoken
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isSpoken ? '✓ Đã nói' : 'Chưa nói'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Meaning & Kids Phonics */}
            <div className="mt-3.5 space-y-1.5">
              <p className="text-base font-bold text-slate-800">
                {word.vi}
              </p>
              {word.kids_phonics?.text && (
                <p className="text-xs text-slate-600">
                  Phát âm kiểu bé: <strong className="text-orange-700">{word.kids_phonics.text}</strong>
                  {word.kids_phonics.mouth_tip && (
                    <span className="text-slate-500 italic"> ({word.kids_phonics.mouth_tip})</span>
                  )}
                </p>
              )}
            </div>

            {/* Example sentence */}
            {word.example_en && (
              <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs">
                <p className="font-medium text-slate-800">“{word.example_en}”</p>
                {word.example_vi && (
                  <p className="text-slate-500 mt-0.5">{word.example_vi}</p>
                )}
              </div>
            )}
          </div>

          {/* Pagination if multiple */}
          {totalWords > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
              <span>Từ {currentIndex + 1} / {totalWords}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                  className="rounded-lg border px-2 py-1 disabled:opacity-30 hover:bg-slate-50"
                >
                  ← Trước
                </button>
                <button
                  type="button"
                  disabled={currentIndex === totalWords - 1}
                  onClick={() => setCurrentIndex(i => Math.min(totalWords - 1, i + 1))}
                  className="rounded-lg border px-2 py-1 disabled:opacity-30 hover:bg-slate-50"
                >
                  Sau →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-col justify-center gap-3 sm:w-64">
          <Link
            href={`/daily?wordId=${encodeURIComponent(word.id)}&tab=learn`}
            className="flex items-center justify-between rounded-2xl bg-orange-600 px-4 py-3.5 font-bold text-white shadow-sm transition-all hover:bg-orange-700 active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
                <BookOpen className="h-4 w-4" />
              </span>
              <div className="text-left">
                <div className="text-xs text-orange-100 font-normal">Chế độ 1</div>
                <div className="text-sm font-extrabold">Học Từ Vựng</div>
              </div>
            </div>
            {isLearned ? (
              <CheckCircle className="h-5 w-5 text-emerald-300" />
            ) : (
              <ArrowRight className="h-5 w-5 text-orange-200" />
            )}
          </Link>

          <Link
            href={`/daily?wordId=${encodeURIComponent(word.id)}&tab=speak`}
            className="flex items-center justify-between rounded-2xl border-2 border-rose-300 bg-white px-4 py-3.5 font-bold text-rose-700 shadow-sm transition-all hover:bg-rose-50 active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <Mic className="h-4 w-4" />
              </span>
              <div className="text-left">
                <div className="text-xs text-slate-500 font-normal">Chế độ 2</div>
                <div className="text-sm font-extrabold text-slate-900">Luyện Nói AI</div>
              </div>
            </div>
            {isSpoken ? (
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            ) : (
              <ArrowRight className="h-5 w-5 text-rose-400" />
            )}
          </Link>

          <Link
            href="/daily"
            className="text-center text-xs font-bold text-orange-800 hover:text-orange-950 underline decoration-orange-300 underline-offset-4 py-1"
          >
            Mở phòng học từ mới đầy đủ →
          </Link>
        </div>
      </div>
    </section>
  );
}
