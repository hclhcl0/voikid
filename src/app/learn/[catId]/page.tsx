'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCategoryById } from '@/lib/vocabulary';
import { useTTS } from '@/hooks/useTTS';
import { useProgress } from '@/hooks/useProgress';
import { useKidsPhonics } from '@/hooks/useKidsPhonics';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { useEnrichedWord } from '@/hooks/useEnrichedWord';
import { KidsPhonicsDisplay, KidsPhonicsLoading } from '@/components/KidsPhonicsDisplay';
import { IpaWordDecoderModal } from '@/components/IpaWordDecoderModal';
import { ChildBadge } from '@/components/ChildBadge';
import { Word } from '@/types';

// ── Shared: Score star display ─────────────────────────────────────────────
function StarRow({ stars }: { stars: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((s) => (
        <span key={s} className={`text-xl ${s <= stars ? 'opacity-100' : 'opacity-20'}`}>⭐</span>
      ))}
    </div>
  );
}

// ── FlashCard component ────────────────────────────────────────────────────
function FlashCard({
  word,
  onListenNormal,
  onListenSlow,
  speakingMode,
  prevStars,
}: {
  word: Word;
  onListenNormal: () => void;
  onListenSlow: () => void;
  speakingMode: 'normal' | 'slow' | 'superslow' | null;
  prevStars: number;
}) {
  const { phonics, loading: phonicsLoading } = useKidsPhonics(word.en, word.phonetic, word.kids_phonics);
  const [showIpaDecoder, setShowIpaDecoder] = useState(false);

  return (
    <>
      <motion.div
        key={word.id}
        initial={{ opacity: 0, x: 60, scale: 0.9 }}
        animate={{ opacity: 1, x: 0,  scale: 1 }}
        exit={{ opacity: 0, x: -60, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="bg-white rounded-3xl p-6 shadow-2xl border-[3px] border-orange-100 relative overflow-hidden"
        style={{ boxShadow: '0 8px 0 rgba(249,115,22,0.10), 0 20px 40px rgba(0,0,0,0.08)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-orange-100/40" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-amber-100/40" />

        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          {/* Stars */}
          <div className="self-end">
            <StarRow stars={prevStars} />
          </div>

          {/* Emoji */}
          <motion.div
            key={word.emoji}
            initial={{ scale: 0.5, rotate: -15 }}
            animate={{ scale: 1,   rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-8xl leading-none drop-shadow-lg"
          >
            {word.emoji}
          </motion.div>

          {/* English word - font Andika chuẩn chữ a đơn tầng giống tập viết tiếng Việt */}
          <div
            className="font-bold text-5xl text-gray-800 tracking-normal"
            style={{ fontFamily: 'var(--font-andika), "Andika", sans-serif' }}
          >
            {word.en}
          </div>

          {/* ── Hàng phiên âm quốc tế chuẩn IPA & nút giải mã ── */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setShowIpaDecoder(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50/90 hover:bg-orange-100 border border-orange-200 text-orange-950 font-bold text-sm shadow-2xs hover:shadow-xs transition-all cursor-pointer group active:scale-95"
              title="Bấm để xem hướng dẫn đọc từng ký hiệu IPA của từ này"
            >
              <span className="font-mono text-gray-800 font-black text-sm group-hover:text-orange-600 transition-colors tracking-wide">
                {word.phonetic ? `[ ${word.phonetic} ]` : '[ IPA ]'}
              </span>
              <span className="text-[11px] font-black text-orange-600 bg-white px-2 py-0.5 rounded-full border border-orange-200 flex items-center gap-1">
                <span>🔍</span> Giải mã IPA
              </span>
            </button>
          </div>

          {/* ── Kids Phonics (Việt hóa) ── */}
          <div className="min-h-[52px] flex items-center justify-center">
            {phonicsLoading ? (
              <KidsPhonicsLoading />
            ) : phonics ? (
              <KidsPhonicsDisplay phonics={phonics} />
            ) : (
              /* Fallback to IPA */
              <span className="text-gray-400 font-semibold text-sm italic">{word.phonetic}</span>
            )}
          </div>

          {/* Vietnamese meaning */}
          <div className="bg-gradient-to-r from-rose-500 to-orange-400 text-white font-black text-lg px-5 py-2 rounded-full shadow min-w-[130px]">
            {word.vi ? (
              word.vi
            ) : (
              <span className="text-sm font-semibold opacity-95 flex items-center justify-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang dịch...
              </span>
            )}
          </div>

          {/* Listen buttons: Normal & Slow */}
          <div className="flex items-center gap-3 w-full pt-1">
            {/* Normal Listen */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={onListenNormal}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-black text-sm shadow-md transition-all ${
                speakingMode === 'normal'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white ring-2 ring-violet-300 animate-pulse-ring'
                  : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-violet-200 hover:shadow-lg'
              }`}
            >
              <span className="text-xl">{speakingMode === 'normal' ? '🔊' : '🔈'}</span>
              <span>{speakingMode === 'normal' ? 'Đang đọc...' : 'Nghe chuẩn'}</span>
            </motion.button>

            {/* Slow Listen */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={onListenSlow}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-black text-sm shadow-md transition-all ${
                speakingMode === 'slow' || speakingMode === 'superslow'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white ring-2 ring-amber-300 animate-pulse-ring'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:shadow-amber-200 hover:shadow-lg'
              }`}
            >
              <span className="text-xl">🐢</span>
              <span>{speakingMode === 'slow' || speakingMode === 'superslow' ? 'Đang đọc chậm...' : 'Đọc chậm (0.35x)'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modal giải mã IPA chi tiết của từ */}
      {showIpaDecoder && (
        <IpaWordDecoderModal
          word={word}
          onClose={() => setShowIpaDecoder(false)}
        />
      )}
    </>
  );
}

// ── Example sentence ───────────────────────────────────────────────────────
function ExampleBox({ word }: { word: Word }) {
  const { speak, isSpeaking } = useTTS();
  const [exSpeaking, setExSpeaking] = useState<'normal' | 'slow' | null>(null);

  useEffect(() => {
    if (!isSpeaking) setExSpeaking(null);
  }, [isSpeaking]);

  if (!word.example_en) {
    return (
      <div className="bg-violet-50/70 border-2 border-dashed border-violet-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-center">
        <span className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
        <span className="text-xs font-bold text-violet-700">
          🤖 Gemini đang tạo câu ví dụ cho &ldquo;{word.en}&rdquo;...
        </span>
      </div>
    );
  }

  return (
    <motion.div
      key={word.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-violet-50 border-l-4 border-violet-400 rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs font-bold text-violet-600 flex items-center gap-1">
          <span>💬</span> Ví dụ
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setExSpeaking('normal');
              speak(word.example_en, 'en-US', 0.85);
            }}
            title="Nghe câu ví dụ tốc độ chuẩn"
            className={`text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all ${
              exSpeaking === 'normal'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-white text-violet-700 border border-violet-200 hover:bg-violet-100'
            }`}
          >
            <span>🔊</span> Chuẩn
          </button>
          <button
            type="button"
            onClick={() => {
              setExSpeaking('slow');
              speak(word.example_en, 'en-US', 0.48);
            }}
            title="Nghe câu ví dụ đọc chậm từng từ"
            className={`text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all ${
              exSpeaking === 'slow'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-100/70 text-amber-800 border border-amber-300 hover:bg-amber-200/70'
            }`}
          >
            <span>🐢</span> Đọc chậm (0.48x)
          </button>
        </div>
      </div>

      <div
        className="text-gray-800 font-bold text-base text-left flex items-start gap-1.5 mt-1"
        style={{ fontFamily: 'var(--font-andika), "Andika", sans-serif' }}
      >
        <span className="shrink-0 text-base">🇬🇧</span>
        <span className="leading-snug">{word.example_en}</span>
      </div>
      {word.example_vi && (
        <p className="text-gray-500 text-xs mt-1.5 pl-6">🇻🇳 {word.example_vi}</p>
      )}
    </motion.div>
  );
}

// ── Main Learn Page ────────────────────────────────────────────────────────
export default function LearnPage() {
  const params          = useParams<{ catId: string }>();
  const router          = useRouter();
  const [mounted, setMounted] = useState(false);
  const { categories: customCats, updateWord } = useCustomCategories();

  const cat = useMemo(() => {
    if (params.catId?.startsWith('custom_')) {
      return customCats.find((c) => c.id === params.catId) || getCategoryById(params.catId);
    }
    return getCategoryById(params.catId);
  }, [params.catId, customCats, mounted]);

  const { speak, isSpeaking } = useTTS();
  const { getWordProgress } = useProgress();

  const [index, setIndex]   = useState(0);
  const [dir, setDir]       = useState(1);
  const touchX = useRef<number | null>(null);

  const [speakingMode, setSpeakingMode] = useState<'normal' | 'slow' | 'superslow' | null>(null);
  const [autoSpeed, setAutoSpeed]       = useState<'normal' | 'slow' | 'superslow'>('normal');

  const rawWord = cat?.words?.[index];
  const { word: enrichedWord } = useEnrichedWord(cat?.id || '', rawWord, updateWord);
  const word = enrichedWord || rawWord;

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('vocakids_learn_speed');
      if (stored === 'slow' || stored === 'normal' || stored === 'superslow') {
        setAutoSpeed(stored as 'normal' | 'slow' | 'superslow');
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!isSpeaking) setSpeakingMode(null);
  }, [isSpeaking]);

  useEffect(() => {
    if (mounted && !cat) {
      router.replace('/');
    }
  }, [mounted, cat, router]);

  if (!mounted || !cat || !word) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
        <div className="text-4xl animate-bounce-slow">🦉</div>
      </div>
    );
  }

  const total   = cat.words.length;
  const pct     = ((index + 1) / total) * 100;
  const prevProg = getWordProgress(cat.id, word.id);

  const handleListenNormal = () => {
    setSpeakingMode('normal');
    speak(word.en, 'en-US', 0.85);
  };

  const handleListenSlow = () => {
    // 0.30 for superslow, 0.35 for standard slow (deliberate, elongated phonemes for kids)
    const rate = autoSpeed === 'superslow' ? 0.30 : 0.35;
    setSpeakingMode(autoSpeed === 'superslow' ? 'superslow' : 'slow');
    speak(word.en, 'en-US', rate);
  };

  const handleToggleAutoSpeed = (speed: 'normal' | 'slow' | 'superslow') => {
    setAutoSpeed(speed);
    try {
      localStorage.setItem('vocakids_learn_speed', speed);
    } catch { /* ignore */ }
  };

  const go = (delta: number) => {
    const next = index + delta;
    if (next < 0 || next >= total) return;
    setDir(delta);
    setIndex(next);
    // Auto-speak on advance with preferred speed
    const nextWord = cat.words[next];
    if (nextWord?.en) {
      setTimeout(() => {
        const rate = autoSpeed === 'superslow' ? 0.30 : autoSpeed === 'slow' ? 0.45 : 0.85;
        setSpeakingMode(autoSpeed);
        speak(nextWord.en, 'en-US', rate);
      }, 150);
    }
  };

  // Swipe detection
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">

      {/* Top bar */}
      <header className="bg-white/80 backdrop-blur sticky top-0 z-50 border-b border-violet-100 px-4 py-3 flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center font-bold text-violet-600 hover:bg-violet-100 transition-colors"
          title="Quay lại"
          aria-label="Quay lại"
        >←</button>

        <Link
          href="/"
          className="w-9 h-9 rounded-xl bg-orange-100/80 text-orange-600 hover:bg-orange-200/80 flex items-center justify-center font-bold text-base transition-colors shadow-xs"
          title="Về trang chủ"
          aria-label="Về trang chủ"
        >🏠</Link>

        <div className="flex-1 min-w-0">
          <div className="h-2.5 bg-violet-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400"
            />
          </div>
          <p className="text-xs text-gray-400 font-bold mt-1 text-right">
            {index + 1} / {total}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <ChildBadge variant="compact" />
          <div className="text-2xl">{cat.emoji}</div>
        </div>
      </header>

      {/* Mode tabs */}
      <div className="px-4 pt-4 flex gap-1.5 sm:gap-2 max-w-lg mx-auto">
        <Link
          href="/"
          className="px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-gray-500 hover:text-orange-600 hover:bg-orange-50 border border-gray-100 transition-all flex items-center justify-center gap-1 shrink-0 shadow-xs"
          title="Về trang chủ"
        >
          <span>🏠</span>
          <span className="hidden xs:inline">Home</span>
        </Link>
        {[
          { label: '📖 Học',    href: `/learn/${cat.id}`,  active: true  },
          { label: '🧩 Đố vui', href: `/quiz/${cat.id}`,   active: false },
          { label: '🎤 Nói',   href: `/speak/${cat.id}`,  active: false },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => !tab.active && router.push(tab.href)}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              tab.active
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                : 'bg-white text-gray-500 hover:bg-violet-50 border border-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <Link
          href="/ipa"
          className="px-2.5 py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 hover:brightness-95 border border-orange-200 transition-all flex items-center justify-center gap-1 shrink-0 shadow-xs"
          title="Mở Bảng 44 Âm IPA Chuẩn Quốc Tế"
        >
          <span>🔤</span>
          <span className="hidden xs:inline">44 IPA</span>
        </Link>
      </div>

      {/* Content */}
      <div
        className="px-4 pt-4 pb-24 max-w-lg mx-auto"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Speed preference selector */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur rounded-2xl px-3.5 py-2 border border-violet-100 shadow-xs mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 shrink-0">
            <span>⚡</span>
            <span>Tốc độ:</span>
          </div>
          <div className="flex items-center bg-gray-100/90 p-0.5 rounded-xl text-xs font-bold gap-0.5">
            <button
              onClick={() => handleToggleAutoSpeed('normal')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                autoSpeed === 'normal'
                  ? 'bg-white text-violet-700 shadow-xs font-black'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>🐰</span> 1x Chuẩn
            </button>
            <button
              onClick={() => handleToggleAutoSpeed('slow')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                autoSpeed === 'slow'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-xs font-black'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>🐢</span> 0.5x Chậm
            </button>
            <button
              onClick={() => handleToggleAutoSpeed('superslow')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                autoSpeed === 'superslow'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs font-black'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>🐌</span> 0.3x Rất chậm
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <FlashCard
            key={word.id}
            word={word}
            onListenNormal={handleListenNormal}
            onListenSlow={handleListenSlow}
            speakingMode={speakingMode}
            prevStars={prevProg?.stars ?? 0}
          />
        </AnimatePresence>

        <div className="mt-4">
          <ExampleBox word={word} />
        </div>

        {/* Tip */}
        <p className="text-center text-xs text-gray-400 mt-3 font-semibold">
          👆 Vuốt trái/phải để chuyển từ
        </p>

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => go(-1)}
            disabled={index === 0}
            className="flex-1 py-4 rounded-2xl font-black text-lg bg-white border-2 border-gray-200 text-gray-500 disabled:opacity-30 hover:border-violet-300 transition-colors"
          >
            ◀ Trước
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => go(1)}
            disabled={index === total - 1}
            className="flex-1 py-4 rounded-2xl font-black text-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200 disabled:opacity-40"
          >
            {index === total - 1 ? '🎉 Xong!' : 'Tiếp ▶'}
          </motion.button>
        </div>

        {/* Quick jump to quiz/speak */}
        {index === total - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 grid grid-cols-2 gap-3"
          >
            <button
              onClick={() => router.push(`/quiz/${cat.id}`)}
              className="py-3 rounded-2xl font-bold text-sm bg-amber-400 text-white shadow"
            >🧩 Làm bài đố vui</button>
            <button
              onClick={() => router.push(`/speak/${cat.id}`)}
              className="py-3 rounded-2xl font-bold text-sm bg-rose-400 text-white shadow"
            >🎤 Luyện nói</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
