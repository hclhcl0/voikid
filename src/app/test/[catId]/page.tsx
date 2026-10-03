'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { getCategoryById, CATEGORIES } from '@/lib/vocabulary';
import { useProfileContext } from '@/context/ProfileContext';
import { useTTS } from '@/hooks/useTTS';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { ChildBadge } from '@/components/ChildBadge';
import { Word, UnitTestGrade } from '@/types';

// ─── helpers ──────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function randomOthers(words: Word[], exclude: Word, count = 3): Word[] {
  const pool = shuffle(words.filter(w => w.id !== exclude.id));
  if (pool.length >= count) return pool.slice(0, count);
  const extra = shuffle(
    CATEGORIES.flatMap(c => c.words).filter(w => w.id !== exclude.id && !pool.some(p => p.id === w.id))
  ).slice(0, count - pool.length);
  return [...pool, ...extra];
}

function celebrate(big = false) {
  confetti({ particleCount: big ? 200 : 100, spread: big ? 120 : 70, origin: { y: 0.55 },
    colors: ['#6c63ff','#ffd93d','#ff6b6b','#6bcb77','#f093fb','#4dd0e1'] });
}

type QType = 'picture' | 'word_match' | 'fill_in' | 'fast_recall';
interface Question { type: QType; word: Word; options: Word[]; }

function buildQuestions(words: Word[]): Question[] {
  const selected = shuffle(words).slice(0, Math.min(10, words.length));
  const types: QType[] = ['picture','picture','picture','word_match','word_match','fill_in','fill_in','fill_in','fast_recall','fast_recall'];
  return shuffle(selected).map((word, i) => ({
    type: types[i % types.length],
    word,
    options: shuffle([word, ...randomOthers(words, word)]),
  }));
}

// ─── Timer Bar ────────────────────────────────────────────────────────────────
function TimerBar({ running, onExpire, durationSec = 8 }: { running: boolean; onExpire: () => void; durationSec?: number }) {
  const [pct, setPct] = useState(100);
  const ref = useRef<NodeJS.Timeout | null>(null);
  const startRef = useRef<number>(Date.now());
  useEffect(() => {
    if (!running) { if (ref.current) clearInterval(ref.current); return; }
    startRef.current = Date.now();
    setPct(100);
    ref.current = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const remaining = Math.max(0, 100 - (elapsed / durationSec) * 100);
      setPct(remaining);
      if (remaining <= 0) { clearInterval(ref.current!); onExpire(); }
    }, 80);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running, durationSec, onExpire]);
  const color = pct > 50 ? '#22c55e' : pct > 25 ? '#f59e0b' : '#ef4444';
  return (
    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
      <motion.div animate={{ width: `${pct}%` }} transition={{ ease: 'linear', duration: 0.08 }}
        className="h-full rounded-full" style={{ backgroundColor: color }} />
    </div>
  );
}

// ─── Question Types ───────────────────────────────────────────────────────────
function PictureMatchQ({ q, onAnswer }: { q: Question; onAnswer: (c: boolean, f: boolean) => void }) {
  const { speak } = useTTS();
  const [chosen, setChosen] = useState<string | null>(null);
  const t0 = useRef(Date.now());
  useEffect(() => { t0.current = Date.now(); setTimeout(() => speak(q.word.en), 150); }, [q.word.id]);
  const pick = (opt: Word) => {
    if (chosen) return;
    const el = (Date.now() - t0.current) / 1000;
    setChosen(opt.id);
    setTimeout(() => onAnswer(opt.id === q.word.id, el < 3), 700);
  };
  return (
    <div className="space-y-4">
      <p className="text-center text-xs font-bold text-violet-400">🖼️ Ghép từ với ảnh đúng!</p>
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-violet-100 text-center">
        <div className="text-8xl mb-2">{q.word.emoji}</div>
        <p className="font-black text-3xl text-violet-700">{q.word.en}</p>
        <p className="text-gray-400 text-sm italic">{q.word.phonetic}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.options.map(opt => {
          const sel = chosen === opt.id; const isRight = opt.id === q.word.id; const rev = !!chosen;
          let cls = 'bg-white border-gray-200 text-5xl';
          if (rev && isRight) cls = 'bg-emerald-50 border-emerald-400'; else if (rev && sel) cls = 'bg-rose-50 border-rose-400';
          return (
            <motion.button key={opt.id} whileTap={!chosen ? { scale: 0.93 } : {}} onClick={() => pick(opt)}
              disabled={!!chosen} className={`py-5 rounded-2xl border-2 transition-all ${cls}`}>
              {opt.emoji}
              {rev && isRight && <span className="block text-xs font-bold text-emerald-600 mt-1">{opt.vi}</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function WordMatchQ({ q, onAnswer }: { q: Question; onAnswer: (c: boolean, f: boolean) => void }) {
  const { speak } = useTTS();
  const [chosen, setChosen] = useState<string | null>(null);
  const t0 = useRef(Date.now());
  useEffect(() => { t0.current = Date.now(); setTimeout(() => speak(q.word.en), 150); }, [q.word.id]);
  const pick = (opt: Word) => {
    if (chosen) return;
    const el = (Date.now() - t0.current) / 1000;
    setChosen(opt.id);
    setTimeout(() => onAnswer(opt.id === q.word.id, el < 3), 700);
  };
  return (
    <div className="space-y-4">
      <p className="text-center text-xs font-bold text-pink-400">🔤 Từ này có nghĩa là gì?</p>
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-pink-100 text-center">
        <div className="text-6xl mb-2">{q.word.emoji}</div>
        <p className="font-black text-4xl text-pink-700">{q.word.en}</p>
        <p className="text-gray-400 text-sm italic mt-1">{q.word.phonetic}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.options.map(opt => {
          const sel = chosen === opt.id; const isRight = opt.id === q.word.id; const rev = !!chosen;
          let cls = 'bg-white border-gray-200 text-gray-700';
          if (rev && isRight) cls = 'bg-emerald-50 border-emerald-400 text-emerald-700';
          else if (rev && sel) cls = 'bg-rose-50 border-rose-400 text-rose-700';
          return (
            <motion.button key={opt.id} whileTap={!chosen ? { scale: 0.93 } : {}} onClick={() => pick(opt)}
              disabled={!!chosen} className={`py-4 px-3 rounded-2xl border-2 font-bold text-sm transition-all ${cls}`}>
              {rev && isRight && '✅ '}{rev && sel && !isRight && '❌ '}{opt.vi}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function FillInQ({ q, onAnswer }: { q: Question; onAnswer: (c: boolean, f: boolean) => void }) {
  const [chosen, setChosen] = useState<string | null>(null);
  const t0 = useRef(Date.now());
  const masked = q.word.example_en.replace(new RegExp(`\\b${q.word.en}\\b`, 'gi'), '___');
  useEffect(() => { t0.current = Date.now(); }, [q.word.id]);
  const pick = (opt: Word) => {
    if (chosen) return;
    const el = (Date.now() - t0.current) / 1000;
    setChosen(opt.id);
    setTimeout(() => onAnswer(opt.id === q.word.id, el < 3), 700);
  };
  return (
    <div className="space-y-4">
      <p className="text-center text-xs font-bold text-blue-400">✍️ Điền từ đúng vào chỗ trống!</p>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-blue-100 text-center">
        <p className="text-xs text-gray-400 mb-2">Hoàn thành câu tiếng Anh:</p>
        <p className="font-bold text-lg text-blue-800 leading-relaxed">{masked}</p>
        <p className="text-gray-400 text-xs mt-2">🇻🇳 {q.word.example_vi}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.options.map(opt => {
          const sel = chosen === opt.id; const isRight = opt.id === q.word.id; const rev = !!chosen;
          let cls = 'bg-white border-gray-200 text-gray-700';
          if (rev && isRight) cls = 'bg-emerald-50 border-emerald-400 text-emerald-700';
          else if (rev && sel) cls = 'bg-rose-50 border-rose-400 text-rose-700';
          return (
            <motion.button key={opt.id} whileTap={!chosen ? { scale: 0.93 } : {}} onClick={() => pick(opt)}
              disabled={!!chosen} className={`py-4 px-3 rounded-2xl border-2 font-bold text-base transition-all font-andika ${cls}`}>
              {rev && isRight && '✅ '}{rev && sel && !isRight && '❌ '}{opt.en}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function FastRecallQ({ q, onAnswer }: { q: Question; onAnswer: (c: boolean, f: boolean) => void }) {
  const { speak } = useTTS();
  const [chosen, setChosen] = useState<string | null>(null);
  const t0 = useRef(Date.now());
  useEffect(() => { t0.current = Date.now(); setTimeout(() => speak(q.word.en), 150); }, [q.word.id]);
  const pick = (opt: Word) => {
    if (chosen) return;
    const el = (Date.now() - t0.current) / 1000;
    setChosen(opt.id);
    setTimeout(() => onAnswer(opt.id === q.word.id, el < 3), 700);
  };
  return (
    <div className="space-y-4">
      <p className="text-center text-xs font-bold text-amber-500">⚡ Emoji này là từ gì?</p>
      <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-amber-100 text-center">
        <div className="text-9xl">{q.word.emoji}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.options.map(opt => {
          const sel = chosen === opt.id; const isRight = opt.id === q.word.id; const rev = !!chosen;
          let cls = 'bg-white border-gray-200 text-gray-700';
          if (rev && isRight) cls = 'bg-emerald-50 border-emerald-400 text-emerald-700';
          else if (rev && sel) cls = 'bg-rose-50 border-rose-400 text-rose-700';
          return (
            <motion.button key={opt.id} whileTap={!chosen ? { scale: 0.93 } : {}} onClick={() => pick(opt)}
              disabled={!!chosen} className={`py-4 px-3 rounded-2xl border-2 font-bold text-base transition-all font-andika ${cls}`}>
              {rev && isRight && '✅ '}{rev && sel && !isRight && '❌ '}{opt.en}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sticker award config ─────────────────────────────────────────────────────
const STICKER_MAP: Record<string, { emoji: string; name: string; tier: 'basic' | 'star' | 'rare' }> = {
  excellent: { emoji: '🌟', name: 'Ngôi Sao Xuất Sắc', tier: 'rare' },
  good:      { emoji: '⭐', name: 'Sao Học Giỏi',      tier: 'star' },
  pass:      { emoji: '🎉', name: 'Chiến Thắng!',      tier: 'basic' },
};

// ─── Result Screen ─────────────────────────────────────────────────────────────
function ResultScreen({ score, correct, total, fastCount, streakMax, unitName, onRetry, grade }:
  { score: number; correct: number; total: number; fastCount: number; streakMax: number;
    unitName: string; onRetry: () => void; grade: UnitTestGrade }) {
  const sticker = grade !== 'fail' ? STICKER_MAP[grade] : null;
  useEffect(() => {
    if (grade === 'excellent') celebrate(true);
    else if (grade !== 'fail') celebrate(false);
  }, []);
  const gc = {
    excellent: { emoji: '🏆', label: 'Xuất Sắc!',  color: 'from-yellow-400 to-orange-500' },
    good:      { emoji: '🎉', label: 'Giỏi Lắm!',  color: 'from-emerald-400 to-teal-500' },
    pass:      { emoji: '😊', label: 'Đạt rồi!',    color: 'from-blue-400 to-cyan-500' },
    fail:      { emoji: '💪', label: 'Cố lên nào!', color: 'from-gray-400 to-slate-500' },
  }[grade];
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }} className="space-y-4">
      <div className={`rounded-3xl p-6 bg-gradient-to-br ${gc.color} text-white text-center shadow-2xl`}>
        <div className="text-6xl mb-2">{gc.emoji}</div>
        <h2 className="font-black text-3xl">{gc.label}</h2>
        <p className="text-white/80 text-sm mt-1">{unitName}</p>
        <div className="mt-4 bg-white/20 rounded-2xl p-3 inline-block">
          <span className="font-black text-4xl">{score}</span>
          <span className="text-white/80 text-sm ml-1">/ 130 điểm</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '✅ Đúng',   val: `${correct}/${total}`, color: 'bg-emerald-50 text-emerald-700' },
          { label: '⚡ Nhanh',  val: fastCount,              color: 'bg-amber-50 text-amber-700' },
          { label: '🔥 Streak', val: `×${streakMax}`,        color: 'bg-rose-50 text-rose-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-3 text-center ${s.color}`}>
            <div className="font-black text-xl">{s.val}</div>
            <div className="text-xs font-bold opacity-70">{s.label}</div>
          </div>
        ))}
      </div>
      {sticker && (
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 400 }}
          className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 rounded-3xl p-4 text-center">
          <p className="text-xs font-bold text-violet-500 mb-2">🎁 Sticker mới được trao!</p>
          <div className="text-5xl mb-1">{sticker.emoji}</div>
          <p className="font-black text-violet-700">{sticker.name}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold mt-1 inline-block ${
            sticker.tier === 'rare' ? 'bg-yellow-100 text-yellow-700' :
            sticker.tier === 'star' ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-600'
          }`}>{sticker.tier === 'rare' ? '💎 Hiếm' : sticker.tier === 'star' ? '⭐ Thường' : '🌱 Cơ bản'}</span>
        </motion.div>
      )}
      {grade === 'fail' ? (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-center">
          <p className="text-amber-700 font-bold text-sm">💡 Ôn thêm rồi thử lại nhé! Cần ≥ 50 điểm để vượt qua.</p>
        </div>
      ) : (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 text-center">
          <p className="text-emerald-700 font-bold text-sm">🔓 Bài học tiếp theo đã được mở khoá!</p>
        </div>
      )}
      <div className="flex gap-3 pb-4">
        <button onClick={onRetry}
          className="flex-1 py-3 rounded-2xl font-bold border-2 border-violet-300 text-violet-600 hover:bg-violet-50 transition-colors">
          🔄 Làm lại
        </button>
        <Link href="/"
          className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg text-center">
          🏠 Về nhà
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function UnitTestPage() {
  const params = useParams<{ catId: string }>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { categories: customCats } = useCustomCategories();
  const { recordUnitTest, awardSticker } = useProfileContext();

  useEffect(() => setMounted(true), []);

  const cat = useMemo(() => {
    if (!mounted) return null;
    if (params.catId?.startsWith('custom_')) return customCats.find(c => c.id === params.catId) || null;
    return getCategoryById(params.catId) || null;
  }, [params.catId, customCats, mounted]);

  const [questions, setQuestions]       = useState<Question[]>([]);
  const [index, setIndex]               = useState(0);
  const [timerKey, setTimerKey]         = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [score, setScore]               = useState(0);
  const [correct, setCorrect]           = useState(0);
  const [fastCount, setFastCount]       = useState(0);
  const [streak, setStreak]             = useState(0);
  const [streakMax, setStreakMax]       = useState(0);
  const [done, setDone]                 = useState(false);
  const [grade, setGrade]               = useState<UnitTestGrade>('fail');
  const [finalVals, setFinalVals]       = useState({ score: 0, correct: 0, fast: 0, streak: 0 });

  // Refs to avoid stale closures
  const scoreRef   = useRef(0);
  const correctRef = useRef(0);
  const fastRef    = useRef(0);
  const streakRef  = useRef(0);
  const smaxRef    = useRef(0);
  const indexRef   = useRef(0);
  const questRef   = useRef<Question[]>([]);

  useEffect(() => { scoreRef.current = score; },    [score]);
  useEffect(() => { correctRef.current = correct; }, [correct]);
  useEffect(() => { fastRef.current = fastCount; }, [fastCount]);
  useEffect(() => { streakRef.current = streak; },  [streak]);
  useEffect(() => { smaxRef.current = streakMax; }, [streakMax]);
  useEffect(() => { indexRef.current = index; },    [index]);
  useEffect(() => { questRef.current = questions; }, [questions]);

  function initQuiz() {
    if (!cat) return;
    setQuestions(buildQuestions(cat.words));
    setIndex(0); setScore(0); setCorrect(0); setFastCount(0);
    setStreak(0); setStreakMax(0); setDone(false);
    scoreRef.current = 0; correctRef.current = 0; fastRef.current = 0;
    streakRef.current = 0; smaxRef.current = 0; indexRef.current = 0;
    setTimerKey(k => k + 1); setTimerRunning(true);
  }

  useEffect(() => { if (cat) initQuiz(); }, [cat]);

  const finishTest = useCallback((fs: number, fc: number, ff: number, fsm: number) => {
    const g: UnitTestGrade = fs >= 90 ? 'excellent' : fs >= 70 ? 'good' : fs >= 50 ? 'pass' : 'fail';
    setGrade(g); setDone(true);
    setFinalVals({ score: fs, correct: fc, fast: ff, streak: fsm });
    if (!cat) return;
    recordUnitTest({ unitId: cat.id, score: fs, grade: g, attempts: 1, fastAnswers: ff, streak: fsm });
    if (g !== 'fail') {
      const s = STICKER_MAP[g];
      awardSticker({ id: `${cat.id}_test_${g}`, name: s.name, emoji: s.emoji, tier: s.tier,
        setId: 'unit_test', unitId: cat.id, condition: `Đạt bài kiểm tra ${cat.name_vi} hạng ${g}` });
    }
  }, [cat, recordUnitTest, awardSticker]);

  const handleAnswer = useCallback((isCorrect: boolean, isFast: boolean) => {
    setTimerRunning(false);
    let pts = 0;
    let ns = streakRef.current;
    let nsm = smaxRef.current;
    let nc = correctRef.current;
    let nf = fastRef.current;

    if (isCorrect) {
      pts += 10;
      nc++; setCorrect(nc); correctRef.current = nc;
      if (isFast) { pts += 3; nf++; setFastCount(nf); fastRef.current = nf; }
      ns++; nsm = Math.max(nsm, ns);
      if (ns >= 3) pts += 5;
    } else { ns = 0; }
    setStreak(ns); streakRef.current = ns;
    setStreakMax(nsm); smaxRef.current = nsm;
    const newScore = scoreRef.current + pts;
    setScore(newScore); scoreRef.current = newScore;

    const next = indexRef.current + 1;
    if (next >= questRef.current.length) {
      setTimeout(() => finishTest(newScore, nc, nf, nsm), 800);
    } else {
      setTimeout(() => {
        setIndex(next); indexRef.current = next;
        setTimerKey(k => k + 1); setTimerRunning(true);
      }, 900);
    }
  }, [finishTest]);

  const handleTimeout = useCallback(() => handleAnswer(false, false), [handleAnswer]);

  if (!mounted || !cat) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="text-center">
        <div className="text-6xl animate-bounce mb-3">📋</div>
        <p className="text-violet-500 font-bold">Đang tải bài kiểm tra…</p>
      </div>
    </div>
  );

  const current  = questions[index];
  const progress = questions.length > 0 ? (index / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      <div className="max-w-md mx-auto px-4 py-6 pb-24 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-xl bg-white/80 shadow flex items-center justify-center text-violet-600 font-bold hover:bg-white transition-colors shrink-0">
            ←
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-gray-800 text-base truncate">📋 Kiểm Tra: {cat.name_vi}</h1>
            <p className="text-xs text-gray-400">{cat.words.length} từ • {cat.name_en}</p>
          </div>
          <ChildBadge />
        </div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ResultScreen score={finalVals.score} correct={finalVals.correct} total={questions.length}
                fastCount={finalVals.fast} streakMax={finalVals.streak}
                unitName={cat.name_vi} grade={grade} onRetry={initQuiz} />
            </motion.div>
          ) : current ? (
            <motion.div key={`q-${index}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="space-y-4">

              {/* Progress + score */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-3 shadow-sm flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                    <span>Câu {index + 1} / {questions.length}</span>
                    <span className="text-violet-600">{score} điểm</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
                      className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full" />
                  </div>
                </div>
                {streak >= 2 && <div className="text-sm font-black text-orange-500 shrink-0">🔥×{streak}</div>}
              </div>

              {/* Timer */}
              <TimerBar key={timerKey} running={timerRunning} onExpire={handleTimeout} durationSec={8} />

              {/* Question */}
              {current.type === 'picture'     && <PictureMatchQ q={current} onAnswer={handleAnswer} />}
              {current.type === 'word_match'  && <WordMatchQ    q={current} onAnswer={handleAnswer} />}
              {current.type === 'fill_in'     && <FillInQ       q={current} onAnswer={handleAnswer} />}
              {current.type === 'fast_recall' && <FastRecallQ   q={current} onAnswer={handleAnswer} />}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
