'use client';

import { AppPageHeader } from '@/components/ui/AppPageHeader';
import { Suspense, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { BookOpen, Mic, Volume2, CheckCircle, Swords, House, Turtle, MessageCircle } from 'lucide-react';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';
import { useProgress } from '@/hooks/useProgress';
import { useCustomCategories, NEW_WORDS_CAT_ID } from '@/hooks/useCustomCategories';
import { useTTS } from '@/hooks/useTTS';
import { selectDailyWords, getTodayDateString } from '@/lib/dailyWords';
import { EmojiImage } from '@/components/WordImage';
import { WordSpeakingPractice } from '@/components/learning/WordSpeakingPractice';
import { dailyWordStatus } from '@/lib/dailyWordProgress';
import type { Category } from '@/types';
import type { SiteSettings } from '@/lib/backend/types';

function DailyLearningContent(){
  const searchParams=useSearchParams();
  const {categories:server,settings}=useVocabularyCatalog();
  const {categories:custom,hydrated:customHydrated}=useCustomCategories();
  const {hydrated,activeProfile}=useProgress();
  if(!hydrated||!customHydrated)return <p role="status" className="p-8 text-center">Đang chuẩn bị từ mới hôm nay…</p>;
  const grade=activeProfile.gradeId;
  const categories=[...custom.filter(c=>c.id===NEW_WORDS_CAT_ID?c.words.length>0:!c.gradeId||c.gradeId===grade),...server.filter(c=>!c.gradeId||c.gradeId===grade)].filter((category,index,all)=>all.findIndex(item=>item.id===category.id)===index);
  return <DailyLearningSession key={`${activeProfile.id}:${grade}:${getTodayDateString()}:${settings.dailyNewWordsCount}:${settings.dailyNewWordsSource}:${searchParams.get('wordId')}:${searchParams.get('tab')}`} categories={categories} settings={settings}/>;
}

function DailyLearningSession({categories,settings}:{categories:Category[];settings:SiteSettings}) {
  const searchParams = useSearchParams();
  const initialWordId = searchParams.get('wordId');
  const initialTab = searchParams.get('tab') === 'speak' ? 'speak' : 'learn';

  const { progress, hydrated, activeProfile, markDailyWordLearned } = useProgress();
  const { speak, isSpeaking } = useTTS();

  const [activeTab, setActiveTab] = useState<'learn' | 'speak'>(initialTab);

  const selectedGrade = activeProfile?.gradeId ?? 'lop1';

  const [plan]=useState(()=>selectDailyWords({categories,gradeId:selectedGrade,count:settings.dailyNewWordsCount??1,source:settings.dailyNewWordsSource,wordProgress:progress.wordProgress}));
  const [selectedWordIndex,setSelectedWordIndex]=useState(()=>Math.max(0,plan.findIndex(item=>item.word.id===initialWordId)));
  const dailyWords=useMemo(()=>plan.map(item=>{
    const current=progress.wordProgress[`${item.category.id}:${item.word.id}`];
    return {...item,progress:current,...dailyWordStatus(current)};
  }),[plan,progress.wordProgress]);

  const currentItem = dailyWords[selectedWordIndex] || dailyWords[0];
  const totalWords = dailyWords.length;
  const completedWords = dailyWords.filter(w => w.isCompleted).length;
  const allFinished = completedWords === totalWords && totalWords > 0;

  // Hành động ghi nhận đã học từ (Flashcard)
  const handleMarkLearned = useCallback(() => {
    if (!currentItem) return;
    const { category, word } = currentItem;
    markDailyWordLearned(category.id, word.id);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    // Tự động gợi ý chuyển sang Luyện nói
    setActiveTab('speak');
  }, [currentItem, markDailyWordLearned]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Đang chuẩn bị từ mới hôm nay…</p>
      </div>
    );
  }

  if (dailyWords.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-xl font-bold">Chưa có bài học cho lớp này</h1>
        <Link href="/" className="learning-button mt-4 bg-orange-600 text-white">
          Về trang chủ
        </Link>
      </main>
    );
  }

  const { word, category, isLearned, isSpoken } = currentItem;
  const dateFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header */}
      <AppPageHeader title="Từ mới hôm nay" description="Học từ, nghe mẫu và luyện nói trong một lượt học ngắn." inset actions={<span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900">{completedWords}/{totalWords} từ · {progress.totalStars} sao</span>}/>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Banner tiêu đề */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mt-1 text-xs text-slate-500 capitalize sm:text-sm">
              {dateFormatted} · Khối lớp: {selectedGrade.toUpperCase()}
            </p>
          </div>

          {/* Chọn từ nếu có nhiều hơn 1 từ */}
          {totalWords > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-white p-1.5 border border-slate-200">
              {dailyWords.map((item, idx) => (
                <button
                  key={item.word.id}
                  onClick={() => {
                    setSelectedWordIndex(idx);
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    idx === selectedWordIndex
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.word.en}</span>
                  {item.isCompleted && <CheckCircle className="h-3.5 w-3.5 text-emerald-300" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Thanh chuyển chế độ: Học từ vs Luyện nói */}
        <div className="ui-tabs grid grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveTab('learn')} aria-pressed={activeTab==='learn'}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
              activeTab === 'learn'
                ? 'bg-violet-50 text-violet-800 ring-1 ring-violet-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            1. Học Từ Vựng
            {isLearned && <CheckCircle className="h-4 w-4 text-emerald-600" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('speak')} aria-pressed={activeTab==='speak'}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
              activeTab === 'speak'
                ? 'bg-violet-50 text-violet-800 ring-1 ring-violet-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="h-4 w-4" />
            2. Luyện Nói AI
            {isSpoken && <CheckCircle className="h-4 w-4 text-emerald-600" />}
          </button>
        </div>

        {/* ── NỘI DUNG CHÍNH: TAB 1 - HỌC TỪ (FLASHCARD) ────────────────────── */}
        {activeTab === 'learn' && (
          <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <EmojiImage emoji={word.emoji} alt={word.en} size="xl" />
              </div>

              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Chủ đề: {category.name_vi}
              </span>

              <h2 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">
                {word.en}
              </h2>

              {word.phonetic && (
                <p className="mt-1 text-base font-medium font-mono text-orange-600">
                  {word.phonetic}
                </p>
              )}

              <p className="mt-3 text-xl font-extrabold text-slate-800">
                {word.vi}
              </p>

              {/* Nút phát âm thanh */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={isSpeaking}
                  onClick={() => speak(word.en, 'en-US', 0.85)}
                  className="flex items-center gap-2 rounded-2xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-orange-700 transition-colors"
                >
                  <Volume2 className="h-4 w-4" /> Nghe giọng chuẩn
                </button>

                <button
                  type="button"
                  disabled={isSpeaking}
                  onClick={() => speak(word.en, 'en-US', 0.7)}
                  className="flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-800 hover:bg-orange-100 transition-colors"
                >
                  <Turtle className="h-4 w-4" /> Đọc chậm
                </button>
              </div>
            </div>

            {/* Kids Phonics Mẹo phát âm */}
            {word.kids_phonics && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-center">
                <div className="text-xs font-bold uppercase text-amber-800">
                  Mẹo phát âm dễ nhớ cho bé
                </div>
                <div className="mt-1 text-lg font-black text-amber-950">
                  {word.kids_phonics.text}
                </div>
                {word.kids_phonics.mouth_tip && (
                  <p className="mt-1 text-xs text-amber-900">
                    💡 {word.kids_phonics.mouth_tip}
                  </p>
                )}
              </div>
            )}

            {/* Câu ví dụ */}
            {word.example_en && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-violet-700">
                    <MessageCircle className="h-3.5 w-3.5" /> Ví dụ minh họa
                  </span>
                  <button
                    type="button"
                    disabled={isSpeaking}
                    onClick={() => speak(word.example_en, 'en-US', 0.85)}
                    className="text-xs font-bold text-violet-700 hover:underline flex items-center gap-1"
                  >
                    <Volume2 className="h-3 w-3" /> Nghe câu
                  </button>
                </div>
                <p className="text-sm font-semibold text-slate-800">“{word.example_en}”</p>
                {word.example_vi && (
                  <p className="text-xs text-slate-500 mt-1">{word.example_vi}</p>
                )}
              </div>
            )}

            {/* Nút hoàn thành học từ */}
            <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {isLearned ? '✓ Đã ghi nhận học từ này' : 'Bấm nút bên phải sau khi bé đã nhớ từ'}
              </span>

              <button
                type="button"
                onClick={handleMarkLearned}
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-extrabold text-white shadow-sm hover:bg-emerald-700 transition-all"
              >
                <CheckCircle className="h-5 w-5" />
                {isLearned ? 'Đã thuộc từ này · Chuyển sang Luyện nói →' : 'Đã nhớ từ → Luyện nói'}
              </button>
            </div>
          </section>
        )}

        {/* ── NỘI DUNG CHÍNH: TAB 2 - LUYỆN NÓI AI (SPEAK) ─────────────────── */}
        {activeTab === 'speak' && (
          <WordSpeakingPractice
            key={`${activeProfile.id}:${category.id}:${word.id}`}
            categoryId={category.id} word={word}
            onPrevious={selectedWordIndex>0?()=>setSelectedWordIndex(i=>i-1):undefined}
            onNext={selectedWordIndex<totalWords-1?()=>setSelectedWordIndex(i=>i+1):undefined}
          />
        )}

        {/* ── BANNER CHÚC MỪNG KHI HOÀN THÀNH TẤT CẢ TỪ ───────────────────── */}
        {allFinished && (
          <div className="rounded-3xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 text-center shadow-xs">
            <span className="text-4xl">🎉</span>
            <h3 className="mt-2 text-xl font-extrabold text-emerald-950">
              Hoan hô! Bé đã hoàn thành mục tiêu từ mới hôm nay!
            </h3>
            <p className="mt-1 text-xs text-emerald-800">
              Bé đã học và được AI xác nhận đọc đúng toàn bộ {totalWords} từ mới. Hẹn gặp lại bé vào ngày mai nhé!
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/arena"
                className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700"
              >
                <Swords className="h-4 w-4" /> Đấu trường từ vựng
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <House className="h-4 w-4" /> Về trang chủ
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DailyLearningPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Đang tải phòng học từ mới…</div>}>
      <DailyLearningContent />
    </Suspense>
  );
}
