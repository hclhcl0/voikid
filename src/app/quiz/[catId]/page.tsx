'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { getCategoryById, CATEGORIES } from '@/lib/vocabulary';
import { useProgress } from '@/hooks/useProgress';
import { useTTS } from '@/hooks/useTTS';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { ChildBadge } from '@/components/ChildBadge';
import { Word } from '@/types';

type AnswerState = 'idle' | 'correct' | 'wrong';

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildOptions(words: Word[], current: Word): Word[] {
  if (!current) return [];
  const others = words.filter((w) => w.id !== current.id);
  let picked = shuffleArray(others).slice(0, 3);
  if (picked.length < 3) {
    const allWords = CATEGORIES.flatMap((c) => c.words).filter(
      (w) => w.id !== current.id && !picked.some((p) => p.en.toLowerCase() === w.en.toLowerCase())
    );
    const extra = shuffleArray(allWords).slice(0, 3 - picked.length);
    picked = [...picked, ...extra];
  }
  return shuffleArray([current, ...picked]);
}

function celebrate() {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 }, colors: ['#6c63ff','#ffd93d','#ff6b6b','#6bcb77','#f093fb'] });
}

// ── Quiz card ──────────────────────────────────────────────────────────────
interface QuizCardProps {
  word: Word;
  options: Word[];
  onAnswer: (correct: boolean, word: Word) => void;
  answered: AnswerState;
  selectedId: string | null;
}

function QuizCard({ word, options, onAnswer, answered, selectedId }: QuizCardProps) {
  const { speak } = useTTS();
  useEffect(() => { setTimeout(() => speak(word.en), 200); }, [word.id]);

  return (
    <motion.div
      key={word.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="space-y-5"
    >
      {/* Question card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-violet-100 text-center relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-violet-50" />
        <p className="text-xs font-bold text-violet-400 mb-3">🤔 Từ này có nghĩa là gì?</p>
        <div className="text-8xl mb-3 drop-shadow">{word.emoji}</div>
        <p
          className="font-bold text-4xl text-violet-700"
          style={{ fontFamily: 'var(--font-andika), "Andika", sans-serif' }}
        >
          {word.en}
        </p>
        <p className="text-gray-400 italic text-sm mt-1">{word.phonetic}</p>
        <button
          onClick={() => speak(word.en)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-violet-500 bg-violet-50 px-3 py-1.5 rounded-full hover:bg-violet-100 transition-colors"
        >🔊 Nghe lại</button>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isCorrect  = opt.id === word.id;
          const reveal     = answered !== 'idle';

          let bg = 'bg-white border-gray-200 hover:border-violet-300';
          if (reveal && isCorrect)               bg = 'bg-emerald-50 border-emerald-400 shadow-emerald-100 shadow-lg';
          else if (reveal && isSelected && !isCorrect) bg = 'bg-rose-50 border-rose-400';

          return (
            <motion.button
              key={opt.id}
              whileTap={!reveal ? { scale: 0.93 } : {}}
              onClick={() => !reveal && onAnswer(isCorrect, opt)}
              disabled={reveal}
              className={`py-4 px-3 rounded-2xl border-2 font-bold text-gray-700 text-sm transition-all ${bg}`}
            >
              {reveal && isCorrect && <span className="mr-1">✅</span>}
              {reveal && isSelected && !isCorrect && <span className="mr-1">❌</span>}
              {opt.vi}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Result popup ───────────────────────────────────────────────────────────
function ResultPopup({ correct, wrong, onRetry, onHome }: {
  correct: number; wrong: number; onRetry: () => void; onHome: () => void;
}) {
  const total = correct + wrong;
  const pct   = total > 0 ? Math.round((correct / total) * 100) : 100;
  const stars = pct >= 80 ? 3 : pct >= 60 ? 2 : 1;

  useEffect(() => { if (stars === 3) celebrate(); }, []);

  const messages = ['Cố lên nào! 💪', 'Giỏi lắm! 😊', 'Xuất sắc! 🏆'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-violet-100 text-center mx-4"
    >
      <div className="text-6xl mb-3">{stars === 3 ? '🎉' : stars === 2 ? '😊' : '💪'}</div>
      <h2 className="font-black text-2xl text-violet-700 mb-1">{messages[stars - 1]}</h2>

      <div className="flex justify-center gap-1 mb-5">
        {[1,2,3].map((s) => (
          <motion.span
            key={s}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: s * 0.12, type: 'spring', stiffness: 400 }}
            className={`text-3xl ${s <= stars ? 'opacity-100' : 'opacity-20'}`}
          >⭐</motion.span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Đúng ✓', val: correct, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Sai ✗',  val: wrong,   color: 'text-rose-600 bg-rose-50' },
          { label: 'Chính xác', val: `${pct}%`, color: 'text-violet-600 bg-violet-50' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-3 ${s.color}`}>
            <div className="font-black text-2xl">{s.val}</div>
            <div className="text-xs font-bold opacity-75">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onRetry} className="flex-1 py-3 rounded-2xl font-bold border-2 border-violet-300 text-violet-600 hover:bg-violet-50 transition-colors">
          🔄 Làm lại
        </button>
        <button onClick={onHome} className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg">
          🏠 Về trang chủ
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Quiz Page ─────────────────────────────────────────────────────────
export default function QuizPage() {
  const params = useParams<{ catId: string }>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { categories: customCats } = useCustomCategories();

  const cat = useMemo(() => {
    if (params.catId?.startsWith('custom_')) {
      return customCats.find((c) => c.id === params.catId) || getCategoryById(params.catId);
    }
    return getCategoryById(params.catId);
  }, [params.catId, customCats, mounted]);

  const { recordAttempt } = useProgress();

  const [index,      setIndex]      = useState(0);
  const [options,    setOptions]    = useState<Word[]>([]);
  const [answered,   setAnswered]   = useState<AnswerState>('idle');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [correct,    setCorrect]    = useState(0);
  const [wrong,      setWrong]      = useState(0);
  const [finished,   setFinished]   = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !cat) {
      router.replace('/');
    }
  }, [mounted, cat, router]);

  useEffect(() => {
    if (cat?.words?.[index]) {
      setOptions(buildOptions(cat.words, cat.words[index]));
    }
  }, [index, cat?.id]);

  if (!mounted || !cat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
        <div className="text-4xl animate-bounce-slow">🦉</div>
      </div>
    );
  }
  const word  = cat.words[index];
  const total = cat.words.length;

  const handleAnswer = (isCorrect: boolean, selected: Word) => {
    setSelectedId(selected.id);
    setAnswered(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setCorrect((c) => c + 1);
      recordAttempt(cat.id, word.id, 90, 'pass');
      celebrate();
    } else {
      setWrong((w) => w + 1);
      recordAttempt(cat.id, word.id, 30, 'practice');
    }

    setTimeout(() => {
      if (index < total - 1) {
        setIndex((i) => i + 1);
        setAnswered('idle');
        setSelectedId(null);
      } else {
        setFinished(true);
      }
    }, 1400);
  };

  const handleRetry = () => {
    setIndex(0); setCorrect(0); setWrong(0); setAnswered('idle');
    setSelectedId(null); setFinished(false);
  };

  const pct = ((index + 1) / total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* Top bar */}
      <header className="bg-white/80 backdrop-blur sticky top-0 z-50 border-b border-orange-100 px-4 py-3 flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center font-bold text-orange-600 hover:bg-orange-100 transition-colors"
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
          <div className="h-2.5 bg-orange-100 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${pct}%` }} className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
          </div>
          <p className="text-xs text-gray-400 font-bold mt-1 text-right">{index + 1} / {total}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ChildBadge variant="compact" />
          <div className="flex gap-1.5 text-xs font-bold">
            <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">✓{correct}</span>
            <span className="text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-md">✗{wrong}</span>
          </div>
        </div>
      </header>

      {/* Mode tabs */}
      <div className="px-4 pt-4 flex gap-2 max-w-lg mx-auto">
        <Link
          href="/"
          className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-gray-500 hover:text-orange-600 hover:bg-orange-50 border border-gray-100 transition-all flex items-center justify-center gap-1 shrink-0 shadow-xs"
          title="Về trang chủ"
        >
          <span>🏠</span>
          <span>Home</span>
        </Link>
        {[
          { label: '📖 Học',    href: `/learn/${cat.id}`,  active: false },
          { label: '🧩 Đố vui', href: `/quiz/${cat.id}`,   active: true  },
          { label: '🎤 Nói',   href: `/speak/${cat.id}`,  active: false },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => !tab.active && router.push(tab.href)}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              tab.active
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                : 'bg-white text-gray-500 hover:bg-amber-50 border border-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-5 pb-24 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {finished ? (
            <ResultPopup key="result" correct={correct} wrong={wrong} onRetry={handleRetry} onHome={() => router.push('/')} />
          ) : (
            <QuizCard key={word.id} word={word} options={options} onAnswer={handleAnswer} answered={answered} selectedId={selectedId} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
