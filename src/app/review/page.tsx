'use client';

// =============================================
// VocaKids – Ôn Tập Cá Nhân (Spaced Repetition Review)
// Hiển thị các từ đến hạn ôn tập theo Spaced Repetition
// Nhớ rồi → tăng chu kỳ; Chưa nhớ → reset về hôm nay
// =============================================

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { useProgress } from '@/hooks/useProgress';
import { useProfileContext } from '@/context/ProfileContext';
import { useTTS } from '@/hooks/useTTS';
import { getCategoryById, CATEGORIES } from '@/lib/vocabulary';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { WordProgress, Word, Category } from '@/types';
import { ChildBadge } from '@/components/ChildBadge';
import { WordImage } from '@/components/WordImage';

interface ReviewItem {
  wordId: string;
  catId: string;
  progress: WordProgress;
  word: Word | null;
  cat: Category | null;
}

function ReviewCard({
  item,
  onRemember,
  onForgot,
  totalLeft,
  currentIdx,
}: {
  item: ReviewItem;
  onRemember: () => void;
  onForgot: () => void;
  totalLeft: number;
  currentIdx: number;
}) {
  const { speak, isSpeaking } = useTTS();
  const [revealed, setRevealed] = useState(false);
  const [speakMode, setSpeakMode] = useState<'normal' | 'slow' | null>(null);
  const word = item.word;

  useEffect(() => { setRevealed(false); }, [item.wordId]);
  useEffect(() => { if (!isSpeaking) setSpeakMode(null); }, [isSpeaking]);

  if (!word || !item.cat) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center shadow-xl border-2 border-gray-100">
        <p className="text-gray-400 font-semibold">Không tìm thấy từ này.</p>
        <button onClick={onForgot} className="mt-4 text-violet-600 font-bold text-sm underline">
          Bỏ qua
        </button>
      </div>
    );
  }

  return (
    <motion.div
      key={item.wordId}
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="space-y-4"
    >
      {/* Card */}
      <div
        className="bg-white rounded-3xl p-6 shadow-xl border-2 border-violet-100 relative overflow-hidden"
        style={{ boxShadow: '0 8px 0 rgba(139,92,246,0.10), 0 20px 40px rgba(0,0,0,0.07)' }}
      >
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-violet-100/40 pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-amber-100/40 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          {/* Progress indicator */}
          <div className="self-end text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
            {currentIdx + 1} / {totalLeft} cần ôn
          </div>

          {/* Word image / emoji */}
          <div className="flex items-center justify-center min-h-[120px] py-1">
            <WordImage word={word} size="2xl" showSkeleton />
          </div>

          {/* English word */}
          <div
            className="font-bold text-5xl md:text-6xl text-gray-800 tracking-normal"
            style={{ fontFamily: 'var(--font-andika), "Andika", sans-serif' }}
          >
            {word.en}
          </div>

          {/* IPA */}
          {word.phonetic && (
            <p className="text-sm font-mono text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
              {word.phonetic}
            </p>
          )}

          {/* Category badge */}
          <span className="text-xs font-bold bg-violet-100 text-violet-700 px-3 py-1 rounded-full">
            {item.cat.emoji} {item.cat.name_vi}
          </span>

          {/* Listen buttons */}
          <div className="flex items-center gap-3 w-full max-w-sm">
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => { setSpeakMode('normal'); speak(word.en, 'en-US', 0.85); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm shadow-sm transition-all cursor-pointer min-h-[44px] ${
                speakMode === 'normal'
                  ? 'bg-violet-600 text-white ring-2 ring-violet-300'
                  : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
              }`}
            >
              <span>🔊</span>
              <span>{speakMode === 'normal' ? 'Đang đọc...' : 'Nghe chuẩn'}</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => { setSpeakMode('slow'); speak(word.en, 'en-US', 0.38); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm shadow-sm transition-all cursor-pointer min-h-[44px] ${
                speakMode === 'slow'
                  ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              <span>🐢</span>
              <span>{speakMode === 'slow' ? 'Đang đọc...' : 'Đọc chậm'}</span>
            </motion.button>
          </div>

          {/* Vietnamese meaning (hidden until revealed) */}
          {!revealed ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setRevealed(true)}
              className="w-full mt-2 py-3.5 rounded-2xl font-black text-base bg-gradient-to-r from-violet-100 to-purple-100 text-violet-600 border-2 border-dashed border-violet-300 hover:border-violet-400 hover:bg-violet-50 transition-all cursor-pointer min-h-[52px]"
            >
              👁️ Xem nghĩa
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-2"
            >
              <div className="bg-gradient-to-r from-rose-500 to-orange-400 text-white font-black text-xl px-6 py-3 rounded-2xl shadow text-center">
                {word.vi}
              </div>
              {word.example_en && (
                <div className="mt-2 bg-violet-50 border-l-4 border-violet-400 rounded-xl p-3 text-left">
                  <p className="text-xs font-bold text-violet-500 mb-1">💬 Ví dụ:</p>
                  <p
                    className="text-gray-800 font-bold text-sm"
                    style={{ fontFamily: 'var(--font-andika), "Andika", sans-serif' }}
                  >
                    {word.example_en}
                  </p>
                  {word.example_vi && (
                    <p className="text-gray-500 text-xs mt-1">🇻🇳 {word.example_vi}</p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Spaced Repetition info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 flex items-center gap-2">
        <span className="text-xl">🗓️</span>
        <div>
          <p className="text-xs font-black text-amber-800">Đến hạn ôn hôm nay</p>
          <p className="text-[11px] text-amber-600 font-medium">
            {item.progress.mastered
              ? `✅ Từ đã thành thạo • Chu kỳ ôn: ${item.progress.intervalDays ?? 1} ngày`
              : `⏳ Chưa thành thạo • Đã học ${item.progress.consecutivePasses ?? 0}/2 lần liên tiếp`}
          </p>
        </div>
      </div>

      {/* Action buttons — shown after reveal */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onForgot}
              className="py-4 rounded-2xl font-black text-base bg-rose-100 text-rose-600 border-2 border-rose-200 hover:bg-rose-200 transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[56px]"
            >
              <span>😅</span>
              <span>Chưa nhớ</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onRemember}
              className="py-4 rounded-2xl font-black text-base bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[56px]"
            >
              <span>🌟</span>
              <span>Nhớ rồi!</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Review Page ──────────────────────────────────────────────────────────
export default function ReviewPage() {
  const router = useRouter();
  const { progress, hydrated, getDueReviewWords, activeProfile } = useProgress();
  const { recordAttempt, demoteWord } = useProfileContext();
  const { categories: customCats } = useCustomCategories();
  const [mounted, setMounted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  const [rememberCount, setRememberCount] = useState(0);
  const [forgotCount, setForgotCount] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  const allDue = useMemo(() => {
    if (!hydrated) return [];
    return getDueReviewWords();
  }, [hydrated, getDueReviewWords, progress]);

  // Enrich with word/cat data
  const reviewItems = useMemo<ReviewItem[]>(() => {
    return allDue.map(({ wordId, catId, progress: p }) => {
      // Try to find the word in built-in or custom categories
      let word: Word | null = null;
      let cat: Category | null = null;

      const allCats: Category[] = [...CATEGORIES, ...customCats];
      for (const c of allCats) {
        const found = c.words.find((w) => w.id === wordId);
        if (found) {
          word = found;
          cat = c;
          break;
        }
      }

      return { wordId, catId, progress: p, word, cat };
    }).filter((item) => item.word !== null);
  }, [allDue, customCats]);

  const currentItem = reviewItems[currentIdx];

  const handleRemember = useCallback(() => {
    if (!currentItem) return;
    // Record as 'pass' to advance spaced repetition interval
    recordAttempt(currentItem.catId, currentItem.wordId, 100, 'pass');
    setRememberCount((n) => n + 1);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 }, colors: ['#10b981', '#fbbf24'] });
    advance();
  }, [currentItem, recordAttempt]);

  const handleForgot = useCallback(() => {
    if (!currentItem) return;
    // Demote: mark as needing practice again today
    demoteWord(currentItem.catId, currentItem.wordId);
    setForgotCount((n) => n + 1);
    advance();
  }, [currentItem, demoteWord]);

  const advance = () => {
    const next = currentIdx + 1;
    if (next >= reviewItems.length) {
      setSessionDone(true);
    } else {
      setCurrentIdx(next);
    }
  };

  if (!mounted || !hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="text-6xl animate-bounce">🔄</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur sticky top-0 z-50 border-b border-violet-100 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center font-bold text-violet-600 hover:bg-violet-100 transition-colors cursor-pointer"
          >
            ←
          </button>
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-orange-100/80 text-orange-600 flex items-center justify-center font-bold transition-colors shadow-xs"
          >
            🏠
          </Link>
          <div className="flex-1">
            <h1 className="font-black text-gray-800 text-base">🔄 Ôn Tập Hôm Nay</h1>
            <p className="text-xs text-gray-500 font-semibold">
              {activeProfile.name} {activeProfile.avatar}
            </p>
          </div>
          <ChildBadge variant="compact" />
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 pt-5 pb-24">
        {/* No words due */}
        {reviewItems.length === 0 && !sessionDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 text-center shadow-xl border-2 border-emerald-100 space-y-4 mt-8"
          >
            <div className="text-6xl">🎉</div>
            <h2 className="font-black text-2xl text-gray-800">Tuyệt vời!</h2>
            <p className="text-gray-500 font-semibold">
              Bé không có từ nào cần ôn hôm nay. Hãy học thêm từ mới nhé!
            </p>
            <Link
              href="/"
              className="inline-block w-full py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
            >
              📚 Học Từ Mới
            </Link>
          </motion.div>
        )}

        {/* Session done */}
        {sessionDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="bg-white rounded-3xl p-8 text-center shadow-xl border-2 border-violet-100 space-y-5 mt-4"
          >
            <div className="text-6xl">🏆</div>
            <h2 className="font-black text-3xl text-gray-800">Ôn Xong Rồi!</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-2xl p-4">
                <div className="font-black text-3xl text-emerald-700">🌟 {rememberCount}</div>
                <div className="text-xs font-bold text-emerald-600 mt-1">Nhớ rồi</div>
              </div>
              <div className="bg-rose-50 rounded-2xl p-4">
                <div className="font-black text-3xl text-rose-600">😅 {forgotCount}</div>
                <div className="text-xs font-bold text-rose-500 mt-1">Cần ôn thêm</div>
              </div>
            </div>
            {forgotCount > 0 && (
              <p className="text-xs text-amber-600 font-semibold bg-amber-50 rounded-xl px-4 py-2">
                💡 {forgotCount} từ sẽ xuất hiện lại trong buổi ôn tiếp theo nhé!
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrentIdx(0);
                  setSessionDone(false);
                  setRememberCount(0);
                  setForgotCount(0);
                }}
                className="flex-1 py-3 rounded-2xl font-black text-sm border-2 border-violet-300 text-violet-700 bg-white hover:bg-violet-50 transition-colors cursor-pointer"
              >
                🔄 Ôn Lại
              </button>
              <Link
                href="/"
                className="flex-1 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md flex items-center justify-center"
              >
                🏠 Về Nhà
              </Link>
            </div>
          </motion.div>
        )}

        {/* Active review session */}
        {!sessionDone && reviewItems.length > 0 && currentItem && (
          <div className="space-y-4">
            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                <span>Tiến trình ôn tập</span>
                <span>{currentIdx}/{reviewItems.length} từ</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(currentIdx / reviewItems.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <ReviewCard
                key={currentItem.wordId}
                item={currentItem}
                onRemember={handleRemember}
                onForgot={handleForgot}
                totalLeft={reviewItems.length}
                currentIdx={currentIdx}
              />
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
