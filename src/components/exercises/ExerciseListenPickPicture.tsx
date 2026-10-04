'use client';

// =============================================
// Dạng 1: Nghe và chọn hình (Listen & Pick Picture)
// Bấm loa nghe từ, chọn đúng trong 2–3 hình.
// Mục tiêu: Nghe hiểu từ vựng
// =============================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Word } from '@/types';
import { useTTS } from '@/hooks/useTTS';
import { WordImage } from '@/components/WordImage';

interface Props {
  targetWord: Word;
  options: Word[]; // 2-3 words
  onAnswer: (correct: boolean, isFast: boolean) => void;
  onNext?: () => void;
  showNextButton?: boolean;
}

export function ExerciseListenPickPicture({
  targetWord,
  options,
  onAnswer,
  onNext,
  showNextButton = false,
}: Props) {
  const { speak, isSpeaking } = useTTS();
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  // Auto-play pronunciation when question appears
  useEffect(() => {
    setChosenId(null);
    setHasAnswered(false);
    startTimeRef.current = Date.now();
    const timer = setTimeout(() => {
      speak(targetWord.en, 'en-US', 0.85);
    }, 250);
    return () => clearTimeout(timer);
  }, [targetWord.id, speak]);

  const handlePlayAudio = () => {
    speak(targetWord.en, 'en-US', 0.85);
  };

  const handleChoose = (opt: Word) => {
    if (hasAnswered) return;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const isCorrect = opt.id === targetWord.id;
    setChosenId(opt.id);
    setHasAnswered(true);

    // Speak again for reinforcement
    speak(targetWord.en, 'en-US', 0.85);

    if (!showNextButton) {
      setTimeout(() => {
        onAnswer(isCorrect, elapsed < 3.5);
      }, 1000);
    } else {
      onAnswer(isCorrect, elapsed < 3.5);
    }
  };

  return (
    <div className="space-y-5 max-w-md mx-auto">
      {/* Header prompt */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-black mb-2">
          <span>🎧</span> Dạng 1: Nghe và chọn hình
        </span>
        <h3 className="text-base font-black text-gray-800">
          Bé bấm loa nghe từ, rồi chọn đúng hình nhé!
        </h3>
      </div>

      {/* Speaker Big Button */}
      <div className="flex flex-col items-center justify-center py-3">
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={handlePlayAudio}
          className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg transition-all ${
            isSpeaking
              ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 ring-4 ring-amber-300 scale-105'
              : 'bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-violet-200'
          }`}
          title="Bấm để nghe lại"
        >
          <span className="text-4xl animate-bounce">🔊</span>
          <span className="text-[11px] font-black text-white/90 mt-0.5">Nghe lại</span>
        </motion.button>
      </div>

      {/* Options grid (2 or 3 picture cards) */}
      <div className={`grid gap-3.5 ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {options.map((opt) => {
          const isSelected = chosenId === opt.id;
          const isTarget = opt.id === targetWord.id;

          let cardStyle = 'bg-white border-2 border-gray-200 shadow-sm hover:border-violet-300';
          if (hasAnswered) {
            if (isTarget) {
              cardStyle = 'bg-emerald-50 border-3 border-emerald-500 shadow-md ring-2 ring-emerald-200';
            } else if (isSelected && !isTarget) {
              cardStyle = 'bg-rose-50 border-3 border-rose-400 opacity-60';
            } else {
              cardStyle = 'bg-white border-gray-200 opacity-40';
            }
          }

          return (
            <motion.button
              key={opt.id}
              whileTap={!hasAnswered ? { scale: 0.95 } : {}}
              onClick={() => handleChoose(opt)}
              disabled={hasAnswered}
              className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all min-h-[130px] ${cardStyle}`}
            >
              <div className="mb-2 flex items-center justify-center min-h-[72px]">
                <WordImage word={opt} size="md" />
              </div>

              {/* Show text hint after answering */}
              <AnimatePresence>
                {hasAnswered && isTarget && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-1"
                  >
                    <span className="text-xs font-black text-emerald-700 block">
                      {opt.en}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 block">
                      {opt.vi}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {hasAnswered && isTarget && (
                <span className="text-xs mt-1 bg-emerald-500 text-white rounded-full px-2 py-0.5 font-bold shadow-xs">
                  ✓ Đúng rồi!
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Optional Manual Next Button */}
      {showNextButton && hasAnswered && onNext && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
          <button
            onClick={onNext}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm shadow-md hover:opacity-95"
          >
            Tiếp tục câu sau →
          </button>
        </motion.div>
      )}
    </div>
  );
}
