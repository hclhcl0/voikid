'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';
import { useTTS } from '@/hooks/useTTS';
import { useProgress } from '@/hooks/useProgress';
import { useProfileContext } from '@/context/ProfileContext';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { useEnrichedWord } from '@/hooks/useEnrichedWord';
import { WordLearningNavigation } from '@/components/learning/WordLearningNavigation';
import { WordStudyCard } from '@/components/learning/WordStudyCard';
import { WordCardSlider } from '@/components/learning/WordCardSlider';
import { AudioSourceBadge } from '@/components/AudioSourceBadge';
import { Word } from '@/types';


// ── Example sentence ───────────────────────────────────────────────────────
function ExampleBox({ word, onBeforeListen }: { word: Word; onBeforeListen: () => void }) {
  const { speak, isSpeaking, audioSource } = useTTS();
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
      <AudioSourceBadge source={audioSource} text={word.example_en} />
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs font-bold text-violet-600 flex items-center gap-1">
          <span>💬</span> Ví dụ
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              onBeforeListen();
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
              onBeforeListen();
              setExSpeaking('slow');
              speak(word.example_en, 'en-US', 0.7);
            }}
            title="Nghe câu ví dụ đọc chậm từng từ"
            className={`text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all ${
              exSpeaking === 'slow'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-100/70 text-amber-800 border border-amber-300 hover:bg-amber-200/70'
            }`}
          >
            <span>🐢</span> Đọc chậm
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
  const { categories: serverCategories } = useVocabularyCatalog();
  const params          = useParams<{ catId: string }>();
  const router          = useRouter();
  const [mounted, setMounted] = useState(false);
  const { categories: customCats, updateWord } = useCustomCategories();

  const cat = useMemo(() => {
    if (params.catId?.startsWith('custom_')) {
      return customCats.find((c) => c.id === params.catId) || serverCategories.find(c => c.id === params.catId);
    }
    return serverCategories.find(c => c.id === params.catId);
  }, [params.catId, customCats, mounted, serverCategories]);

  const { speak, isSpeaking, audioSource, cancel } = useTTS();
  const { getWordProgress } = useProgress();
  const { recordAttempt, demoteWord } = useProfileContext();
  const [rememberedIds, setRememberedIds] = useState<Set<string>>(new Set());
  const [forgotIds, setForgotIds] = useState<Set<string>>(new Set());

  const [index, setIndex]   = useState(0);
  const [dir, setDir]       = useState(1);
  const touchX = useRef<number | null>(null);
  const autoSpeakTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearAutoSpeak = useCallback(() => {
    if (autoSpeakTimer.current !== null) {
      clearTimeout(autoSpeakTimer.current);
      autoSpeakTimer.current = null;
    }
  }, []);

  useEffect(() => () => {
    clearAutoSpeak();
    cancel();
  }, [params.catId, clearAutoSpeak, cancel]);

  const [speakingMode, setSpeakingMode] = useState<'normal' | 'slow' | 'superslow' | null>(null);
  const [autoSpeed, setAutoSpeed]       = useState<'normal' | 'slow'>('normal');

  const rawWord = cat?.words?.[index];
  const { word: enrichedWord } = useEnrichedWord(cat?.id || '', rawWord, updateWord);
  const word = enrichedWord || rawWord;

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('vocakids_learn_speed');
      if (stored === 'slow' || stored === 'normal' || stored === 'superslow') {
        setAutoSpeed(stored === 'normal' ? 'normal' : 'slow');
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!isSpeaking) setSpeakingMode(null);
  }, [isSpeaking]);

  const total = cat?.words?.length || 0;

  const handleListenNormal = useCallback(() => {
    if (!word) return;
    clearAutoSpeak();
    const rate = autoSpeed === 'slow' ? 0.7 : 0.85;
    setSpeakingMode(autoSpeed);
    speak(word.en, 'en-US', rate);
  }, [word, autoSpeed, speak, clearAutoSpeak]);

  const handleToggleAutoSpeed = (speed: 'normal' | 'slow') => {
    setAutoSpeed(speed);
    try {
      localStorage.setItem('vocakids_learn_speed', speed);
    } catch { /* ignore */ }
  };

  const go = useCallback((delta: number) => {
    if (!cat) return;
    const next = index + delta;
    if (next < 0 || next >= cat.words.length) return;
    clearAutoSpeak();
    cancel();
    setSpeakingMode(null);
    setDir(delta);
    setIndex(next);
    const nextWord = cat.words[next];
    if (nextWord?.en) {
      autoSpeakTimer.current = setTimeout(() => {
        autoSpeakTimer.current = null;
        const rate = autoSpeed === 'slow' ? 0.7 : 0.85;
        setSpeakingMode(autoSpeed);
        speak(nextWord.en, 'en-US', rate);
      }, 800);
    }
  }, [cat, index, autoSpeed, speak, cancel, clearAutoSpeak]);

  // Keyboard navigation for desktop users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!cat || !word) return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        go(1);
      } else if (e.key === ' ') {
        e.preventDefault();
        handleListenNormal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cat, word, go, handleListenNormal]);

  // Swipe detection
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

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

  const prevProg = getWordProgress(cat.id, word.id);

  return (
    <div className="min-h-screen bg-slate-50">

      <WordLearningNavigation categoryId={cat.id} emoji={cat.emoji} index={index} total={total} mode="learn" />

      {/* Content */}
      <div
        className="px-4 pt-4 pb-24 max-w-2xl mx-auto"
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
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                autoSpeed === 'normal'
                  ? 'bg-white text-violet-700 shadow-xs font-black'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>🐰</span> Chuẩn
            </button>
            <button
              onClick={() => handleToggleAutoSpeed('slow')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                autoSpeed === 'slow'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-xs font-black'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>🐢</span> Chậm
            </button>
          </div>
        </div>

        <WordCardSlider onPrevious={()=>go(-1)} onNext={()=>go(1)} previousDisabled={index===0} nextDisabled={index===total-1}>
        <AnimatePresence mode="wait">
          <WordStudyCard
            key={word.id}
            word={word}
            onListenNormal={handleListenNormal}
            speakingMode={speakingMode}
            audioSource={audioSource}
            prevStars={prevProg?.stars ?? 0}
          />
        </AnimatePresence>
        </WordCardSlider>

        <div className="mt-4">
          <ExampleBox word={word} onBeforeListen={clearAutoSpeak} />
        </div>

        {/* ── Nhớ rồi / Chưa nhớ (Spaced Repetition self-assessment) ── */}
        <div className="mt-4 space-y-2">
          <p className="text-center text-xs font-bold text-gray-400">💭 Bé tự đánh giá:</p>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!cat || !word) return;
                demoteWord(cat.id, word.id);
                setForgotIds((prev) => new Set([...prev, word.id]));
                setRememberedIds((prev) => { const s = new Set(prev); s.delete(word.id); return s; });
              }}
              className={`py-3.5 rounded-2xl font-black text-sm border-2 flex items-center justify-center gap-2 cursor-pointer min-h-[52px] transition-all ${
                forgotIds.has(word.id)
                  ? 'bg-rose-100 border-rose-400 text-rose-700 ring-2 ring-rose-200'
                  : 'bg-white border-rose-200 text-rose-500 hover:bg-rose-50 hover:border-rose-400'
              }`}
            >
              <span className="text-lg">😅</span>
              <span>Chưa nhớ</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!cat || !word) return;
                recordAttempt(cat.id, word.id, 100, 'pass');
                setRememberedIds((prev) => new Set([...prev, word.id]));
                setForgotIds((prev) => { const s = new Set(prev); s.delete(word.id); return s; });
                confetti({ particleCount: 50, spread: 50, origin: { y: 0.75 }, colors: ['#10b981', '#fbbf24', '#6c63ff'] });
              }}
              className={`py-3.5 rounded-2xl font-black text-sm border-2 flex items-center justify-center gap-2 cursor-pointer min-h-[52px] transition-all ${
                rememberedIds.has(word.id)
                  ? 'bg-emerald-500 border-emerald-500 text-white ring-2 ring-emerald-200 shadow-md'
                  : 'bg-white border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400'
              }`}
            >
              <span className="text-lg">🌟</span>
              <span>Nhớ rồi!</span>
            </motion.button>
          </div>
          {(rememberedIds.size > 0 || forgotIds.size > 0) && (
            <p className="text-center text-[11px] text-gray-400 font-medium">
              ✅ {rememberedIds.size} nhớ · ⏳ {forgotIds.size} cần ôn · sẽ nhắc theo lịch Spaced Repetition
            </p>
          )}
        </div>

        {/* Tip & Keyboard helper */}
        <p className="text-center text-xs text-gray-400 mt-3 font-semibold md:hidden">
          👆 Vuốt trái/phải để chuyển từ
        </p>
        <div className="hidden md:flex items-center justify-center gap-3 text-xs font-semibold text-gray-400 mt-4 bg-white/70 backdrop-blur py-2 px-4 rounded-2xl border border-violet-100 shadow-2xs">
          <span>⌨️ Phím tắt:</span>
          <span><kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono text-[11px] text-gray-700 shadow-2xs">←</kbd> / <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono text-[11px] text-gray-700 shadow-2xs">→</kbd> chuyển từ</span>
          <span><kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono text-[11px] text-gray-700 shadow-2xs">Space</kbd> nghe</span>
        </div>


        {/* Quick jump to quiz/speak/wordsearch */}
        {index === total - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 grid grid-cols-2 gap-3"
          >
            <button
              onClick={() => router.push(`/test/${cat.id}`)}
              className="py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >🎯 8 Dạng Bài Tập & Thi</button>
            <button
              onClick={() => router.push(`/wordsearch/${cat.id}`)}
              className="py-3 rounded-2xl font-bold text-sm bg-emerald-500 text-white shadow cursor-pointer flex items-center justify-center gap-1.5"
            >🔍 Trò Chơi Tìm Từ</button>
            <button
              onClick={() => router.push(`/speak/${cat.id}`)}
              className="py-3 rounded-2xl font-bold text-sm bg-rose-400 text-white shadow cursor-pointer col-span-2 flex items-center justify-center gap-1.5"
            >🎤 Luyện Nói</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
