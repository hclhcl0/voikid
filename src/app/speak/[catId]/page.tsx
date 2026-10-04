'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { getCategoryById } from '@/lib/vocabulary';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useTTS } from '@/hooks/useTTS';
import { useProgress } from '@/hooks/useProgress';
import { useSettings } from '@/hooks/useSettings';
import { useKidsPhonics } from '@/hooks/useKidsPhonics';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { useEnrichedWord } from '@/hooks/useEnrichedWord';
import { KidsPhonicsDisplay, KidsPhonicsLoading } from '@/components/KidsPhonicsDisplay';
import { ChildBadge } from '@/components/ChildBadge';
import { WordImage } from '@/components/WordImage';
import { PronunciationResult, Word } from '@/types';

// ── Mic button with wave animation ────────────────────────────────────────
function MicButton({ status, onClick }: { status: string; onClick: () => void }) {
  const isRecording = status === 'recording';
  const isProcessing = status === 'processing';

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        disabled={isProcessing}
        className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center gap-1 text-white shadow-2xl transition-all font-bold ${
          isRecording
            ? 'bg-gradient-to-br from-rose-500 to-red-600 animate-record-pulse'
            : isProcessing
            ? 'bg-gradient-to-br from-amber-400 to-orange-500'
            : 'bg-gradient-to-br from-rose-400 to-pink-500 hover:shadow-rose-300 hover:shadow-xl'
        }`}
      >
        <span className="text-4xl">
          {isProcessing ? '⏳' : isRecording ? '⏹️' : '🎙️'}
        </span>
        <span className="text-xs">
          {isProcessing ? 'Đang chấm...' : isRecording ? 'Dừng lại' : 'Nhấn để nói'}
        </span>
      </motion.button>

      {/* Sound wave animation */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1 h-10"
        >
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ── Score display ──────────────────────────────────────────────────────────
function ScoreCard({ result, word, recordedBlob, consecutivePasses = 0, onNext, onRetry }: {
  result: PronunciationResult;
  word: Word;
  recordedBlob: Blob | null;
  consecutivePasses?: number;
  onNext: () => void;
  onRetry: () => void;
}) {
  const isPassed = result.status === 'pass' || result.passed === true;
  const scoreNum = result.score ?? 0;
  const stars = scoreNum >= 85 ? 3 : scoreNum >= 70 ? 2 : scoreNum >= 50 ? 1 : 0;

  const { speak, isSpeaking: isModelSpeaking } = useTTS();
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayUserAudio = () => {
    if (!recordedBlob) return;
    if (isPlayingUserAudio && userAudioRef.current) {
      userAudioRef.current.pause();
      userAudioRef.current = null;
      setIsPlayingUserAudio(false);
      return;
    }
    window.speechSynthesis?.cancel();
    const url = URL.createObjectURL(recordedBlob);
    const audio = new Audio(url);
    userAudioRef.current = audio;
    setIsPlayingUserAudio(true);

    audio.onended = () => {
      setIsPlayingUserAudio(false);
      userAudioRef.current = null;
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      setIsPlayingUserAudio(false);
      userAudioRef.current = null;
      URL.revokeObjectURL(url);
    };
    audio.play().catch((e) => {
      console.warn('[Audio Play Error]', e);
      setIsPlayingUserAudio(false);
      userAudioRef.current = null;
    });
  };

  const handlePlayModelAudio = () => {
    if (userAudioRef.current) {
      userAudioRef.current.pause();
      userAudioRef.current = null;
      setIsPlayingUserAudio(false);
    }
    speak(word.en, 'en-US', 0.85);
  };

  useEffect(() => {
    return () => {
      if (userAudioRef.current) {
        userAudioRef.current.pause();
        userAudioRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`rounded-3xl p-5 border-2 shadow-xl ${
        isPassed
          ? 'bg-emerald-50 border-emerald-300'
          : 'bg-amber-50 border-amber-300'
      }`}
    >
      {/* 2-Streak Mastery Bar */}
      <div className="bg-white/90 backdrop-blur rounded-2xl px-3.5 py-2 mb-3.5 border border-amber-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🎯</span>
          <span className="text-xs font-bold text-gray-700">Mục tiêu tốt nghiệp:</span>
        </div>
        <div>
          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
            consecutivePasses >= 2
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : consecutivePasses === 1
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {consecutivePasses >= 2
              ? '⭐⭐ Đạt 2/2 lần (Tốt nghiệp 🎉)'
              : consecutivePasses === 1
              ? '⭐ Đúng 1/2 (Đọc chuẩn thêm 1 lần)'
              : '⚪ 0/2 lần đúng'}
          </span>
        </div>
      </div>

      {/* Score ring */}
      <div className="flex items-center gap-4 mb-3">
        {result.score !== null ? (
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black shadow-inner ${
            isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {result.score}
          </div>
        ) : (
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black shadow-inner ${
            isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {isPassed ? '⭐' : '💪'}
          </div>
        )}
        <div className="flex-1">
          {result.score !== null && (
            <div className="flex gap-1 mb-1">
              {[1,2,3].map((s) => (
                <motion.span key={s} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: s * 0.1, type: 'spring' }}
                  className={`text-2xl ${s <= stars ? 'opacity-100' : 'opacity-20'}`}>⭐</motion.span>
              ))}
            </div>
          )}
          <p className="font-bold text-sm text-gray-600">
            {isPassed
              ? '✅ Tuyệt lắm!'
              : result.status === 'service_error'
              ? '🔌 Lỗi kết nối!'
              : result.status === 'retry'
              ? '👂 Chưa rõ tiếng!'
              : '💪 Cố lên, đọc lại nhé!'}
          </p>
        </div>
      </div>

      {/* Feedback */}
      <div className={`rounded-2xl p-3 mb-3 ${isPassed ? 'bg-emerald-100' : 'bg-amber-100'}`}>
        <p className="font-bold text-sm text-gray-700">{result.feedbackVi}</p>
      </div>

      {/* ── Compare audio box: Giọng của bé & Giọng mẫu ── */}
      <div className="bg-white/90 backdrop-blur rounded-2xl p-3.5 mb-4 border border-rose-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-black text-gray-700 flex items-center gap-1.5">
            <span>🎧</span>
            <span>Nghe lại &amp; So sánh:</span>
          </p>
          {recordedBlob && (
            <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
              Bản thu của bé
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Nút nghe lại giọng bé */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handlePlayUserAudio}
            disabled={!recordedBlob}
            className={`py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              isPlayingUserAudio
                ? 'bg-rose-500 text-white ring-2 ring-rose-300 animate-pulse'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-rose-200 hover:shadow-md'
            }`}
          >
            <span className="text-base">{isPlayingUserAudio ? '⏹️' : '👧'}</span>
            <span>{isPlayingUserAudio ? 'Đang phát...' : 'Nghe giọng bé'}</span>
          </motion.button>

          {/* Nút nghe giọng mẫu chuẩn */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handlePlayModelAudio}
            className={`py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              isModelSpeaking
                ? 'bg-violet-600 text-white ring-2 ring-violet-300 animate-pulse'
                : 'bg-white text-violet-700 border-2 border-violet-200 hover:bg-violet-50'
            }`}
          >
            <span className="text-base">{isModelSpeaking ? '⏹️' : '🔊'}</span>
            <span>{isModelSpeaking ? 'Đang đọc...' : 'Nghe mẫu'}</span>
          </motion.button>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onRetry} className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-white border-2 border-gray-200 text-gray-600 hover:border-violet-300 transition-colors">
          🔄 Thử lại
        </button>
        {isPassed && (
          <button onClick={onNext} className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg">
            Tiếp ▶
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ── Word card with KidsPhonics & mouth tip ─────────────────────────────────
function SpeakWordCard({
  word,
  isSpeaking,
  onSpeak,
  onSpeakSlow,
}: {
  word: Word;
  isSpeaking: boolean;
  onSpeak: () => void;
  onSpeakSlow: () => void;
}) {
  const { phonics, loading: phonicsLoading } = useKidsPhonics(word.en, word.phonetic, word.kids_phonics);

  return (
    <motion.div
      key={word.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-rose-100 text-center"
    >
      <p className="text-xs md:text-sm font-bold text-rose-400 mb-2">
        🎤 Hãy đọc to từ này bằng tiếng Anh!
      </p>
      <div className="flex items-center justify-center min-h-[110px] md:min-h-[140px] mb-2">
        <WordImage word={word} size="2xl" showSkeleton />
      </div>
      <p
        className="font-bold text-4xl md:text-5xl text-rose-600 tracking-normal"
        style={{ fontFamily: 'var(--font-andika), "Andika", sans-serif' }}
      >
        {word.en}
      </p>

      {/* ── Kids Phonics & Mouth tip ── */}
      <div className="my-2 min-h-[48px] flex items-center justify-center">
        {phonicsLoading ? (
          <KidsPhonicsLoading />
        ) : phonics ? (
          <KidsPhonicsDisplay phonics={phonics} />
        ) : (
          <p className="text-gray-400 italic text-base">{word.phonetic}</p>
        )}
      </div>

      <p className="text-gray-600 font-bold text-sm mt-1">{word.vi}</p>

      {/* Listen model pronunciation: Normal & Slow */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          onClick={onSpeak}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black transition-all bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 shadow-xs"
        >
          <span>🔊</span> Nghe chuẩn
        </button>
        <button
          onClick={onSpeakSlow}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black transition-all bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 shadow-xs"
        >
          <span>🐢</span> Đọc chậm (0.35x)
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Speak Page ────────────────────────────────────────────────────────
export default function SpeakPage() {
  const params   = useParams<{ catId: string }>();
  const router   = useRouter();
  const [mounted, setMounted] = useState(false);
  const { categories: customCats, updateWord, graduateWord } = useCustomCategories();

  const cat = useMemo(() => {
    if (params.catId?.startsWith('custom_')) {
      return customCats.find((c) => c.id === params.catId) || getCategoryById(params.catId);
    }
    return getCategoryById(params.catId);
  }, [params.catId, customCats, mounted]);

  const { speak, isSpeaking } = useTTS();
  const recorder = useAudioRecorder();
  const { recordAttempt, getWordProgress, findWordProgress } = useProgress();
  const { apiKey, hasKey, hydrated: settingsHydrated } = useSettings();

  const [index,  setIndex]  = useState(0);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlayingInMicArea, setIsPlayingInMicArea] = useState(false);
  const [graduated, setGraduated] = useState(false);
  const [consecutiveCount, setConsecutiveCount] = useState<number>(0);
  const micAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (recorder.audioBlob) {
      setRecordedBlob(recorder.audioBlob);
    }
  }, [recorder.audioBlob]);

  const handlePlayUserAudioInMicArea = () => {
    const blobToPlay = recordedBlob || recorder.audioBlob;
    if (!blobToPlay) return;

    if (isPlayingInMicArea && micAudioRef.current) {
      micAudioRef.current.pause();
      micAudioRef.current = null;
      setIsPlayingInMicArea(false);
      return;
    }

    window.speechSynthesis?.cancel();
    const url = URL.createObjectURL(blobToPlay);
    const audio = new Audio(url);
    micAudioRef.current = audio;
    setIsPlayingInMicArea(true);

    audio.onended = () => {
      setIsPlayingInMicArea(false);
      micAudioRef.current = null;
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      setIsPlayingInMicArea(false);
      micAudioRef.current = null;
      URL.revokeObjectURL(url);
    };
    audio.play().catch(() => {
      setIsPlayingInMicArea(false);
      micAudioRef.current = null;
    });
  };

  const rawWord = cat?.words?.[index];
  const { word: enrichedWord } = useEnrichedWord(cat?.id || '', rawWord, updateWord);
  const word = enrichedWord || rawWord;
  const total = cat?.words?.length || 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync current word's consecutive passes
  useEffect(() => {
    if (word?.id) {
      const p = getWordProgress(cat?.id || '', word.id) || findWordProgress(word.id);
      setConsecutiveCount(p?.consecutivePasses ?? 0);
    }
  }, [word?.id, cat?.id, getWordProgress, findWordProgress]);

  useEffect(() => {
    if (mounted && !cat) {
      router.replace('/');
    }
  }, [mounted, cat, router]);

  const evaluatePronunciation = async () => {
    if (!recorder.audioBase64 || !word || !cat) return;
    setLoading(true);
    setApiError(null);

    try {
      const mimeType = recorder.audioBlob?.type || 'audio/webm';
      const res = await fetch('/api/pronunciation', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: recorder.audioBase64,
          mimeType,
          targetWord: word.en,
          targetVi:   word.vi,
          phonetic:   word.phonetic,
          apiKey:     apiKey || undefined,   // ← send client key
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string; message?: string };
        if (err.error === 'NO_API_KEY') {
          setApiError('⚙️ Chưa cài API Key! Nhấn vào đây để cài đặt →');
          return;
        }
        if (err.message) {
          setApiError(err.message);
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json() as PronunciationResult;
      setResult(data);

      const prevProg = (word?.id ? (getWordProgress(cat.id, word.id) || findWordProgress(word.id)) : null);
      const prevPasses = prevProg?.consecutivePasses ?? 0;

      recordAttempt(cat.id, word.id, data.score, data.status);

      if (data.passed) {
        const nextPasses = prevPasses + 1;
        setConsecutiveCount(nextPasses);

        if (nextPasses >= 2) {
          // 🎉 Tốt nghiệp: Đọc đúng 2 lần liên tiếp!
          confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } });
          const isInNewWords = customCats.some(
            (c) => c.id === 'custom_new_words' && c.words.some((w) => w.id === word.id)
          );
          if (cat.id === 'custom_new_words' || isInNewWords) {
            setGraduated(true);
            setTimeout(() => graduateWord(word.id), 1200);
          }
        } else {
          // Đúng lần 1 (1/2) -> Bắn pháo hoa nhỏ động viên, chưa tốt nghiệp
          confetti({ particleCount: 50, spread: 55, origin: { y: 0.6 } });
        }
      } else {
        // Đọc sai -> Chuỗi đúng liên tiếp reset về 0 (tránh học vẹt/ăn may)
        setConsecutiveCount(0);
      }
    } catch (err) {
      console.error(err);
      setApiError('Không thể chấm điểm. Kiểm tra kết nối mạng hoặc API Key.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-evaluate when recording stops and we have audio
  useEffect(() => {
    if (recorder.audioBase64 && recorder.audioBlob && !loading && word) {
      evaluatePronunciation();
    }
  }, [recorder.audioBase64]);

  if (!mounted || !cat || !word) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
        <div className="text-4xl animate-bounce-slow">🦉</div>
      </div>
    );
  }

  const handleMicClick = () => {
    if (recorder.status === 'recording') {
      recorder.stopRecording();
    } else {
      recorder.resetRecorder();
      setResult(null);
      setRecordedBlob(null);
      recorder.startRecording();
    }
  };

  const goNext = () => {
    if (index < total - 1) {
      setIndex((i) => i + 1);
      setResult(null);
      setRecordedBlob(null);
      setGraduated(false);
      recorder.resetRecorder();
      setTimeout(() => speak(cat.words[index + 1].en), 200);
    }
  };

  const goRetry = () => {
    setResult(null);
    setRecordedBlob(null);
    setGraduated(false);
    recorder.resetRecorder();
  };

  // Keyboard navigation and spacebar mic control for PC users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleMicClick();
      } else if (e.key === 'ArrowLeft') {
        if (recorder.status !== 'recording' && index > 0) {
          e.preventDefault();
          setIndex((i) => Math.max(0, i - 1));
          setResult(null);
          setRecordedBlob(null);
          setGraduated(false);
          recorder.resetRecorder();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (recorder.status !== 'recording') {
          e.preventDefault();
          goNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recorder.status, index, total, result]);

  const pct = ((index + 1) / total) * 100;
  const micStatus = loading ? 'processing' : recorder.status;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50">

      {/* Top bar */}
      <header className="bg-white/80 backdrop-blur sticky top-0 z-50 border-b border-rose-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center font-bold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
            title="Quay lại"
            aria-label="Quay lại"
          >←</button>

          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-orange-100/80 text-orange-600 hover:bg-orange-200/80 flex items-center justify-center font-bold text-base transition-colors shadow-xs"
            title="Về trang chủ"
            aria-label="Về trang chủ"
          >🏠</Link>

          <div className="flex-1 min-w-0">
            <div className="h-3 bg-rose-100 rounded-full overflow-hidden">
              <motion.div animate={{ width: `${pct}%` }} className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500" />
            </div>
            <p className="text-xs text-gray-400 font-bold mt-1 text-right">{index + 1} / {total}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ChildBadge variant="compact" />
            <div className="text-2xl">{cat.emoji}</div>
          </div>
        </div>
      </header>

      {/* Mode tabs */}
      <div className="px-4 pt-4 flex gap-2 max-w-xl md:max-w-2xl lg:max-w-5xl mx-auto">
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
          { label: '🧩 Đố vui', href: `/quiz/${cat.id}`,   active: false },
          { label: '🎤 Nói',   href: `/speak/${cat.id}`,  active: true  },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => !tab.active && router.push(tab.href)}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              tab.active
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                : 'bg-white text-gray-500 hover:bg-rose-50 border border-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 pb-24 max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Word display */}
          <div className="lg:col-span-6 space-y-4">
            <AnimatePresence mode="wait">
              <SpeakWordCard
                key={word.id}
                word={word}
                isSpeaking={isSpeaking}
                onSpeak={() => speak(word.en, 'en-US', 0.85)}
                onSpeakSlow={() => speak(word.en, 'en-US', 0.35)}
              />
            </AnimatePresence>

            {/* Desktop keyboard helper */}
            <div className="hidden lg:flex items-center justify-center gap-3 text-xs font-semibold text-gray-400 bg-white/70 backdrop-blur py-2.5 px-4 rounded-2xl border border-rose-100 shadow-2xs">
              <span>⌨️ Phím tắt:</span>
              <span><kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono text-[11px] text-gray-700 shadow-2xs">Space</kbd> Thu âm</span>
              <span><kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono text-[11px] text-gray-700 shadow-2xs">←</kbd> / <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono text-[11px] text-gray-700 shadow-2xs">→</kbd> Đổi từ</span>
            </div>
          </div>

          {/* Right Column: Mic, feedback & controls */}
          <div className="lg:col-span-6 space-y-4">

            {/* Mic area */}
            {!result && (
              <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-rose-100 flex flex-col items-center gap-4">
                <MicButton status={micStatus} onClick={handleMicClick} />

                {/* Quick listen button if child just recorded & mic is idle */}
                {(recordedBlob || recorder.audioBlob) && !loading && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handlePlayUserAudioInMicArea}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all shadow-xs cursor-pointer ${
                      isPlayingInMicArea
                        ? 'bg-rose-500 text-white ring-2 ring-rose-300 animate-pulse'
                        : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    <span>{isPlayingInMicArea ? '⏹️' : '👧'}</span>
                    <span>{isPlayingInMicArea ? 'Đang phát giọng bé...' : '🎧 Nghe lại giọng bé vừa thu'}</span>
                  </motion.button>
                )}

                {recorder.error && (
                  <p className="text-sm text-rose-500 font-bold text-center">{recorder.error}</p>
                )}
                {apiError && (
                  apiError.includes('Chưa cài') ? (
                    <button
                      onClick={() => router.push('/settings')}
                      className="w-full bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-sm font-bold text-amber-700 text-center hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      ⚙️ Chưa có API Key — Nhấn để cài đặt ngay →
                    </button>
                  ) : (
                    <p className="text-sm text-rose-500 font-bold text-center">{apiError}</p>
                  )
                )}

                {/* No key warning banner */}
                {settingsHydrated && !hasKey && !apiError && (
                  <button
                    onClick={() => router.push('/settings')}
                    className="w-full bg-violet-50 border border-violet-200 rounded-2xl p-3 text-xs font-bold text-violet-600 text-center hover:bg-violet-100 transition-colors cursor-pointer"
                  >
                    ⚙️ Cài Gemini API Key để bật chấm điểm phát âm →
                  </button>
                )}

                <p className="text-xs text-gray-400 font-semibold text-center">
                  💡 Nói to rõ ràng · Máy sẽ tự dừng khi bé ngưng nói
                </p>
              </div>
            )}

            {/* 🌟 Tốt nghiệp banner – khi bé đọc đúng 2 lần liên tiếp */}
            <AnimatePresence>
              {graduated && (
                <motion.div
                  key="graduated"
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 border-2 border-amber-300 rounded-3xl p-5 text-center shadow-lg"
                >
                  <div className="text-4xl mb-2 animate-bounce">🌟</div>
                  <p className="text-amber-800 font-black text-lg leading-tight">Đọc chuẩn 2 lần liên tiếp! 🎉</p>
                  <p className="text-amber-600 text-sm font-semibold mt-1">
                    Từ <span className="font-black text-amber-800">&ldquo;{word.en}&rdquo;</span> đã{' '}
                    <span className="text-green-700 font-black">chính thức tốt nghiệp</span> khỏi danh sách Từ mới!
                  </p>
                  <p className="text-amber-500 text-xs mt-2">✨ Đã chuyển vào lịch ôn tập ngắt quãng của bé!</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Score card */}
            <AnimatePresence>
              {result && (
                <ScoreCard
                  key="score"
                  result={result}
                  word={word}
                  recordedBlob={recordedBlob || recorder.audioBlob}
                  consecutivePasses={consecutiveCount}
                  onNext={goNext}
                  onRetry={goRetry}
                />
              )}
            </AnimatePresence>

            {/* Navigation */}
            {!result && (
              <div className="flex gap-3">
                <button
                  onClick={() => { setIndex(Math.max(0, index-1)); setResult(null); recorder.resetRecorder(); }}
                  disabled={index === 0}
                  className="flex-1 py-3.5 rounded-2xl font-bold border-2 border-gray-200 text-gray-500 disabled:opacity-30 bg-white hover:border-rose-300 transition-colors cursor-pointer min-h-[46px]"
                >
                  ◀ Trước
                </button>
                <button
                  onClick={goNext}
                  disabled={index === total - 1}
                  className="flex-1 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg disabled:opacity-40 transition-all cursor-pointer min-h-[46px]"
                >
                  Bỏ qua ▶
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
