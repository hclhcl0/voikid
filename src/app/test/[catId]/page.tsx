'use client';

// =============================================
// VocaKids – Hệ Thống Luyện Tập & Bài Thi 8 Dạng
// 1. Nghe và chọn hình (Nghe hiểu)
// 2. Nhìn hình và chọn từ (Nhận diện mặt chữ)
// 3. Ghép từ với hình (Ghi nhớ nghĩa)
// 4. Nghe và chọn chữ cái (Nhận biết chữ & âm)
// 5. Điền chữ còn thiếu (Tập viết từ)
// 6. Lật thẻ tìm cặp (Trò chơi trí nhớ)
// 7. Nghe, nói và nghe lại giọng mình (Luyện nói)
// 8. Nghe và sắp xếp tranh (Nghe chuỗi từ)
// =============================================

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
import {
  ExerciseListenPickPicture,
  ExerciseLookPickWord,
  ExerciseMatchWordPicture,
  ExerciseListenPickLetter,
  ExerciseFillMissingLetter,
  ExerciseMemoryMatch,
  ExerciseListenRecordReview,
  ExerciseListenOrderSequence,
  EXERCISE_METAS,
  ExerciseType,
  ExerciseMeta,
} from '@/components/exercises';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function randomOthers(words: Word[], exclude: Word, count = 2): Word[] {
  const pool = shuffle(words.filter((w) => w.id !== exclude.id));
  if (pool.length >= count) return pool.slice(0, count);
  const extra = shuffle(
    CATEGORIES.flatMap((c) => c.words).filter(
      (w) => w.id !== exclude.id && !pool.some((p) => p.id === w.id)
    )
  ).slice(0, count - pool.length);
  return [...pool, ...extra];
}

function celebrate(big = false) {
  confetti({
    particleCount: big ? 160 : 80,
    spread: big ? 120 : 70,
    origin: { y: 0.55 },
    colors: ['#6c63ff', '#ffd93d', '#ff6b6b', '#6bcb77', '#f093fb', '#4dd0e1'],
  });
}

interface TestQuestion {
  type: ExerciseType;
  word: Word;
  options: Word[]; // 2-3 words for choices
  wordsSubset: Word[]; // 3 words for matching / memory / sequence
}

function buildTestQuestions(words: Word[]): TestQuestion[] {
  const selectedWords = shuffle(words).slice(0, Math.min(10, words.length));
  const typesSequence: ExerciseType[] = [
    'listen_pick_pic',    // 1
    'look_pick_word',     // 2
    'match_word_pic',     // 3
    'listen_pick_letter', // 4
    'fill_missing_letter',// 5
    'memory_match',       // 6
    'listen_pick_pic',    // 1 repeat with diff word
    'look_pick_word',     // 2 repeat with diff word
    'fill_missing_letter',// 5 repeat with diff word
    'order_sequence',     // 8
  ];

  return selectedWords.map((word, i) => {
    const qType = typesSequence[i % typesSequence.length];
    const opts = shuffle([word, ...randomOthers(words, word, 2)]);
    const subset = shuffle([word, ...randomOthers(words, word, 2)]).slice(0, 3);

    return {
      type: qType,
      word,
      options: opts,
      wordsSubset: subset,
    };
  });
}

// ─── Sticker award config ─────────────────────────────────────────────────────
const STICKER_MAP: Record<string, { emoji: string; name: string; tier: 'basic' | 'star' | 'rare' }> = {
  excellent: { emoji: '🌟', name: 'Ngôi Sao Xuất Sắc', tier: 'rare' },
  good:      { emoji: '⭐', name: 'Sao Học Giỏi',      tier: 'star' },
  pass:      { emoji: '🎉', name: 'Chiến Thắng!',      tier: 'basic' },
};

// ─── Result Screen ────────────────────────────────────────────────────────────
function ResultScreen({
  score,
  correct,
  total,
  fastCount,
  streakMax,
  unitName,
  onRetry,
  onSwitchToStations,
  grade,
}: {
  score: number;
  correct: number;
  total: number;
  fastCount: number;
  streakMax: number;
  unitName: string;
  onRetry: () => void;
  onSwitchToStations: () => void;
  grade: UnitTestGrade;
}) {
  const sticker = grade !== 'fail' ? STICKER_MAP[grade] : null;
  useEffect(() => {
    if (grade === 'excellent') celebrate(true);
    else if (grade !== 'fail') celebrate(false);
  }, [grade]);

  const gc = {
    excellent: { emoji: '🏆', label: 'Xuất Sắc!', color: 'from-amber-400 to-yellow-500' },
    good:      { emoji: '🎉', label: 'Giỏi Lắm!', color: 'from-emerald-400 to-teal-500' },
    pass:      { emoji: '😊', label: 'Đạt rồi!',   color: 'from-blue-400 to-cyan-500' },
    fail:      { emoji: '💪', label: 'Cố lên nào!', color: 'from-gray-400 to-slate-500' },
  }[grade];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="space-y-4"
    >
      <div className={`rounded-3xl p-6 bg-gradient-to-br ${gc.color} text-white text-center shadow-xl`}>
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
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-3 text-center ${s.color}`}>
            <div className="font-black text-xl">{s.val}</div>
            <div className="text-xs font-bold opacity-70">{s.label}</div>
          </div>
        ))}
      </div>

      {sticker && (
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 350 }}
          className="bg-white border-2 border-amber-200 rounded-3xl p-4 text-center shadow-sm"
        >
          <p className="text-xs font-bold text-amber-600 mb-1">🎁 Nhận thêm Sticker mới!</p>
          <div className="text-5xl mb-1">{sticker.emoji}</div>
          <p className="font-black text-gray-800">{sticker.name}</p>
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold mt-1 inline-block ${
            sticker.tier === 'rare' ? 'bg-amber-100 text-amber-800' :
            sticker.tier === 'star' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-700'
          }`}>
            {sticker.tier === 'rare' ? '💎 Hiếm' : sticker.tier === 'star' ? '⭐ Thường' : '🌱 Cơ bản'}
          </span>
        </motion.div>
      )}

      <div className="flex flex-col gap-2 pt-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="flex-1 py-3.5 rounded-2xl font-black text-sm border-2 border-violet-300 text-violet-700 bg-white hover:bg-violet-50 transition-colors"
          >
            🔄 Thi lại
          </button>
          <button
            type="button"
            onClick={onSwitchToStations}
            className="flex-1 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:opacity-95"
          >
            🎯 Luyện theo dạng
          </button>
        </div>
        <Link
          href="/"
          className="w-full py-3 rounded-2xl font-bold text-xs text-gray-500 bg-white/70 hover:bg-white text-center border border-gray-200"
        >
          🏠 Về trang chủ
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main UnitTest & Exercises Page ───────────────────────────────────────────
export default function UnitTestPage() {
  const params = useParams<{ catId: string }>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { categories: customCats } = useCustomCategories();
  const { recordUnitTest, awardSticker } = useProfileContext();

  useEffect(() => setMounted(true), []);

  const cat = useMemo(() => {
    if (!mounted) return null;
    if (params.catId?.startsWith('custom_')) return customCats.find((c) => c.id === params.catId) || null;
    return getCategoryById(params.catId) || null;
  }, [params.catId, customCats, mounted]);

  // View Mode: 'test' (10-question challenge) vs 'stations' (practice by type)
  const [mode, setMode] = useState<'test' | 'stations'>('test');
  const [activeStation, setActiveStation] = useState<ExerciseType | null>(null);

  // ── Test Challenge States ──
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [fastCount, setFastCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [streakMax, setStreakMax] = useState(0);
  const [done, setDone] = useState(false);
  const [grade, setGrade] = useState<UnitTestGrade>('fail');
  const [finalVals, setFinalVals] = useState({ score: 0, correct: 0, fast: 0, streak: 0 });

  // ── Station Practice States ──
  const [stationWordIndex, setStationWordIndex] = useState(0);
  const [stationStars, setStationStars] = useState(0);

  // Initialize Quiz
  const initQuiz = useCallback(() => {
    if (!cat || cat.words.length === 0) return;
    setQuestions(buildTestQuestions(cat.words));
    setIndex(0);
    setScore(0);
    setCorrect(0);
    setFastCount(0);
    setStreak(0);
    setStreakMax(0);
    setDone(false);
  }, [cat]);

  useEffect(() => {
    if (cat) {
      initQuiz();
    }
  }, [cat, initQuiz]);

  const finishTest = useCallback(
    (fs: number, fc: number, ff: number, fsm: number) => {
      const g: UnitTestGrade = fs >= 90 ? 'excellent' : fs >= 70 ? 'good' : fs >= 50 ? 'pass' : 'fail';
      setGrade(g);
      setDone(true);
      setFinalVals({ score: fs, correct: fc, fast: ff, streak: fsm });

      if (!cat) return;
      recordUnitTest({ unitId: cat.id, score: fs, grade: g, attempts: 1, fastAnswers: ff, streak: fsm });

      if (g !== 'fail') {
        const s = STICKER_MAP[g];
        awardSticker({
          id: `${cat.id}_test_${g}`,
          name: s.name,
          emoji: s.emoji,
          tier: s.tier,
          setId: 'unit_test',
          unitId: cat.id,
          condition: `Đạt bài kiểm tra ${cat.name_vi} hạng ${g}`,
        });
      }
    },
    [cat, recordUnitTest, awardSticker]
  );

  const handleTestAnswer = useCallback(
    (isCorrect: boolean, isFast: boolean) => {
      let pts = 0;
      let ns = streak;
      let nsm = streakMax;
      let nc = correct;
      let nf = fastCount;

      if (isCorrect) {
        pts += 10;
        nc++;
        setCorrect(nc);
        if (isFast) {
          pts += 3;
          nf++;
          setFastCount(nf);
        }
        ns++;
        nsm = Math.max(nsm, ns);
        if (ns >= 3) pts += 5;
      } else {
        ns = 0;
      }

      setStreak(ns);
      setStreakMax(nsm);
      const newScore = score + pts;
      setScore(newScore);

      const next = index + 1;
      if (next >= questions.length) {
        setTimeout(() => finishTest(newScore, nc, nf, nsm), 700);
      } else {
        setTimeout(() => {
          setIndex(next);
        }, 800);
      }
    },
    [streak, streakMax, correct, fastCount, score, index, questions.length, finishTest]
  );

  // Station practice answer
  const handleStationAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      celebrate(false);
      setStationStars((s) => s + 1);
    }
  }, []);

  const handleNextStationWord = () => {
    if (!cat) return;
    setStationWordIndex((prev) => (prev + 1) % cat.words.length);
  };

  const handlePrevStationWord = () => {
    if (!cat) return;
    setStationWordIndex((prev) => (prev - 1 + cat.words.length) % cat.words.length);
  };

  if (!mounted || !cat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-3">📋</div>
          <p className="text-violet-600 font-bold">Đang tải bài tập & bài thi…</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[index];
  const testProgress = questions.length > 0 ? (index / questions.length) * 100 : 0;
  const currentStationWord = cat.words[stationWordIndex] || cat.words[0];
  const currentStationOptions = shuffle([
    currentStationWord,
    ...randomOthers(cat.words, currentStationWord, 2),
  ]);
  const currentStationSubset = shuffle([
    currentStationWord,
    ...randomOthers(cat.words, currentStationWord, 2),
  ]).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      <div className="max-w-md mx-auto px-4 py-5 pb-24 space-y-4">
        {/* Header bar */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-xl bg-white/90 shadow-sm flex items-center justify-center text-violet-600 font-bold hover:bg-white transition-colors shrink-0"
          >
            ←
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-gray-800 text-sm truncate flex items-center gap-1.5">
              <span>{cat.emoji}</span>
              <span>{cat.name_vi}</span>
            </h1>
            <p className="text-[11px] text-gray-400 truncate">
              {cat.words.length} từ • {cat.name_en}
            </p>
          </div>
          <ChildBadge />
        </div>

        {/* Mode Switcher: Bài thi 10 câu vs 8 Dạng bài tập */}
        <div className="flex bg-white/80 p-1.5 rounded-2xl shadow-sm border border-violet-100">
          <button
            type="button"
            onClick={() => {
              setMode('test');
              setActiveStation(null);
            }}
            className={`flex-1 py-2 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
              mode === 'test'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>🏆</span>
            <span>Bài Thi (10 câu)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('stations')}
            className={`flex-1 py-2 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
              mode === 'stations'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>🎯</span>
            <span>8 Dạng Bài Tập</span>
          </button>
        </div>

        {/* ── MODE 1: BÀI THI TỔNG HỢP 10 CÂU ── */}
        {mode === 'test' && (
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ResultScreen
                  score={finalVals.score}
                  correct={finalVals.correct}
                  total={questions.length}
                  fastCount={finalVals.fast}
                  streakMax={finalVals.streak}
                  unitName={cat.name_vi}
                  grade={grade}
                  onRetry={initQuiz}
                  onSwitchToStations={() => {
                    setMode('stations');
                    setActiveStation(null);
                  }}
                />
              </motion.div>
            ) : currentQ ? (
              <motion.div
                key={`q-${index}`}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="space-y-4"
              >
                {/* Progress bar and Score */}
                <div className="bg-white/90 backdrop-blur rounded-2xl p-3 shadow-sm flex items-center gap-3 border border-violet-100">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                      <span>Câu {index + 1} / {questions.length}</span>
                      <span className="text-violet-600 font-black">{score} điểm</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${testProgress}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
                      />
                    </div>
                  </div>
                  {streak >= 2 && (
                    <div className="text-xs font-black text-orange-500 shrink-0 bg-orange-50 px-2 py-1 rounded-xl">
                      🔥×{streak}
                    </div>
                  )}
                </div>

                {/* Render Dynamic Exercise based on currentQ.type */}
                <div className="bg-white/95 rounded-3xl p-5 shadow-sm border border-violet-100">
                  {currentQ.type === 'listen_pick_pic' && (
                    <ExerciseListenPickPicture
                      targetWord={currentQ.word}
                      options={currentQ.options}
                      onAnswer={handleTestAnswer}
                    />
                  )}
                  {currentQ.type === 'look_pick_word' && (
                    <ExerciseLookPickWord
                      targetWord={currentQ.word}
                      options={currentQ.options}
                      onAnswer={handleTestAnswer}
                    />
                  )}
                  {currentQ.type === 'match_word_pic' && (
                    <ExerciseMatchWordPicture
                      words={currentQ.wordsSubset}
                      onAnswer={handleTestAnswer}
                    />
                  )}
                  {currentQ.type === 'listen_pick_letter' && (
                    <ExerciseListenPickLetter
                      targetWord={currentQ.word}
                      onAnswer={handleTestAnswer}
                    />
                  )}
                  {currentQ.type === 'fill_missing_letter' && (
                    <ExerciseFillMissingLetter
                      targetWord={currentQ.word}
                      onAnswer={handleTestAnswer}
                    />
                  )}
                  {currentQ.type === 'memory_match' && (
                    <ExerciseMemoryMatch
                      words={currentQ.wordsSubset}
                      onAnswer={handleTestAnswer}
                    />
                  )}
                  {currentQ.type === 'record_review' && (
                    <ExerciseListenRecordReview
                      targetWord={currentQ.word}
                      onAnswer={handleTestAnswer}
                    />
                  )}
                  {currentQ.type === 'order_sequence' && (
                    <ExerciseListenOrderSequence
                      words={currentQ.wordsSubset}
                      onAnswer={handleTestAnswer}
                    />
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        )}

        {/* ── MODE 2: LUYỆN TẬP 8 DẠNG BÀI TẬP (STATIONS) ── */}
        {mode === 'stations' && (
          <div className="space-y-4">
            {!activeStation ? (
              // 8 Stations Grid Selection
              <div className="space-y-3">
                <div className="bg-white/80 rounded-2xl p-3 border border-violet-100">
                  <h3 className="font-black text-gray-800 text-sm">
                    🎯 Chọn Dạng Bài Tập Cho Bé:
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Chọn một kỹ năng bên dưới để bé luyện tập sâu từng dạng:
                  </p>
                </div>

                <div className="grid gap-2.5">
                  {EXERCISE_METAS.map((meta) => (
                    <motion.button
                      key={meta.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveStation(meta.id);
                        setStationWordIndex(0);
                      }}
                      className="w-full text-left bg-white rounded-2xl p-3.5 border-2 border-gray-100 hover:border-violet-300 shadow-xs flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shadow-xs">
                          {meta.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-gray-800">
                              {meta.num}. {meta.title}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${meta.badgeColor}`}>
                              {meta.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">
                            {meta.tagline}
                          </p>
                          <span className="text-[10px] text-violet-600 font-bold block mt-0.5">
                            Mục tiêu: {meta.goal}
                          </span>
                        </div>
                      </div>
                      <span className="text-violet-500 font-bold text-sm ml-2">
                        Vào →
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              // Active Single Station Room
              <div className="space-y-3">
                {/* Station Nav Header */}
                <div className="bg-white rounded-2xl p-3 border border-violet-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveStation(null)}
                    className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1"
                  >
                    <span>← Đổi dạng khác</span>
                  </button>
                  <span className="text-xs font-black text-amber-600 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full">
                    <span>⭐</span> {stationStars} sao thưởng
                  </span>
                </div>

                {/* Word Navigation for single-word exercises */}
                {['listen_pick_pic', 'look_pick_word', 'listen_pick_letter', 'fill_missing_letter', 'record_review'].includes(activeStation) && (
                  <div className="flex items-center justify-between bg-white/70 px-3 py-1.5 rounded-2xl text-xs font-bold text-gray-600">
                    <button
                      type="button"
                      onClick={handlePrevStationWord}
                      className="px-2 py-1 rounded-xl bg-gray-100 hover:bg-gray-200"
                    >
                      ← Từ trước
                    </button>
                    <span>
                      Từ {stationWordIndex + 1} / {cat.words.length}: <strong className="text-violet-700">{currentStationWord.en}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleNextStationWord}
                      className="px-2 py-1 rounded-xl bg-gray-100 hover:bg-gray-200"
                    >
                      Từ sau →
                    </button>
                  </div>
                )}

                {/* Render Selected Exercise */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-violet-100">
                  {activeStation === 'listen_pick_pic' && (
                    <ExerciseListenPickPicture
                      targetWord={currentStationWord}
                      options={currentStationOptions}
                      onAnswer={handleStationAnswer}
                      showNextButton={true}
                      onNext={handleNextStationWord}
                    />
                  )}
                  {activeStation === 'look_pick_word' && (
                    <ExerciseLookPickWord
                      targetWord={currentStationWord}
                      options={currentStationOptions}
                      onAnswer={handleStationAnswer}
                      showNextButton={true}
                      onNext={handleNextStationWord}
                    />
                  )}
                  {activeStation === 'match_word_pic' && (
                    <ExerciseMatchWordPicture
                      words={currentStationSubset}
                      onAnswer={handleStationAnswer}
                    />
                  )}
                  {activeStation === 'listen_pick_letter' && (
                    <ExerciseListenPickLetter
                      targetWord={currentStationWord}
                      onAnswer={handleStationAnswer}
                    />
                  )}
                  {activeStation === 'fill_missing_letter' && (
                    <ExerciseFillMissingLetter
                      targetWord={currentStationWord}
                      onAnswer={handleStationAnswer}
                    />
                  )}
                  {activeStation === 'memory_match' && (
                    <ExerciseMemoryMatch
                      words={currentStationSubset}
                      onAnswer={handleStationAnswer}
                    />
                  )}
                  {activeStation === 'record_review' && (
                    <ExerciseListenRecordReview
                      targetWord={currentStationWord}
                      onAnswer={handleStationAnswer}
                    />
                  )}
                  {activeStation === 'order_sequence' && (
                    <ExerciseListenOrderSequence
                      words={currentStationSubset}
                      onAnswer={handleStationAnswer}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
