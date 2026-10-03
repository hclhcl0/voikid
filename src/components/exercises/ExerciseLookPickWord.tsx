'use client';

// =============================================
// Dạng 2: Nhìn hình và chọn từ (Look at Picture & Pick Word)
// Hiện một hình, chọn một trong 2–3 từ. Có nút nghe lại sau khi trả lời.
// Mục tiêu: Nhận diện mặt chữ
// =============================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Word } from '@/types';
import { useTTS } from '@/hooks/useTTS';

interface Props {
  targetWord: Word;
  options: Word[]; // 2-3 words
  onAnswer: (correct: boolean, isFast: boolean) => void;
  onNext?: () => void;
  showNextButton?: boolean;
}

export function ExerciseLookPickWord({
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

  useEffect(() => {
    setChosenId(null);
    setHasAnswered(false);
    startTimeRef.current = Date.now();
  }, [targetWord.id]);

  const handleChoose = (opt: Word) => {
    if (hasAnswered) return;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const isCorrect = opt.id === targetWord.id;
    setChosenId(opt.id);
    setHasAnswered(true);

    // Phát âm ngay khi trả lời để bé nhận diện âm thanh kèm mặt chữ
    speak(targetWord.en, 'en-US', 0.85);

    if (!showNextButton) {
      setTimeout(() => {
        onAnswer(isCorrect, elapsed < 3.5);
      }, 1500);
    } else {
      onAnswer(isCorrect, elapsed < 3.5);
    }
  };

  const handleReplayAudio = () => {
    speak(targetWord.en, 'en-US', 0.85);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Header prompt */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-black mb-2">
          <span>👀</span> Dạng 2: Nhìn hình và chọn từ
        </span>
        <h3 className="text-base font-black text-gray-800">
          Nhìn hình và chọn từ tiếng Anh đúng!
        </h3>
      </div>

      {/* Main Picture Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 shadow-md border-2 border-pink-100 text-center relative overflow-hidden"
      >
        <span className="text-8xl select-none block transform hover:scale-105 transition-transform duration-300">
          {targetWord.emoji}
        </span>
        <p className="text-xs font-bold text-gray-400 mt-2">
          🇻🇳 Nghĩa: <span className="text-pink-600 font-extrabold">{targetWord.vi}</span>
        </p>

        {/* Audio Replay Button after answering */}
        <AnimatePresence>
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 flex items-center justify-center gap-2"
            >
              <button
                type="button"
                onClick={handleReplayAudio}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black shadow-sm transition-all ${
                  isSpeaking
                    ? 'bg-amber-400 text-amber-950 scale-105'
                    : 'bg-violet-600 hover:bg-violet-700 text-white'
                }`}
              >
                <span>🔊</span>
                <span>Nghe lại phát âm: "{targetWord.en}"</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Word Options */}
      <div className="space-y-2.5">
        {options.map((opt) => {
          const isSelected = chosenId === opt.id;
          const isTarget = opt.id === targetWord.id;

          let btnClass = 'bg-white border-2 border-gray-200 text-gray-800 hover:border-pink-300 shadow-sm';
          if (hasAnswered) {
            if (isTarget) {
              btnClass = 'bg-emerald-50 border-3 border-emerald-500 text-emerald-800 shadow-md ring-2 ring-emerald-200';
            } else if (isSelected && !isTarget) {
              btnClass = 'bg-rose-50 border-3 border-rose-400 text-rose-800 opacity-60';
            } else {
              btnClass = 'bg-white border-gray-200 text-gray-400 opacity-40';
            }
          }

          return (
            <motion.button
              key={opt.id}
              whileTap={!hasAnswered ? { scale: 0.97 } : {}}
              onClick={() => handleChoose(opt)}
              disabled={hasAnswered}
              className={`w-full py-3.5 px-4 rounded-2xl font-andika font-bold text-lg flex items-center justify-between transition-all ${btnClass}`}
            >
              <span className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-nunito font-bold">
                  {opt.en.charAt(0).toUpperCase()}
                </span>
                <span>{opt.en}</span>
              </span>

              {hasAnswered && isTarget && (
                <span className="text-xs font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-full shadow-xs">
                  ✓ Chính xác!
                </span>
              )}
              {hasAnswered && isSelected && !isTarget && (
                <span className="text-xs font-bold bg-rose-500 text-white px-2.5 py-1 rounded-full shadow-xs">
                  ✕ Chưa đúng
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Optional Next Button */}
      {showNextButton && hasAnswered && onNext && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
          <button
            onClick={onNext}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-sm shadow-md hover:opacity-95"
          >
            Tiếp tục câu sau →
          </button>
        </motion.div>
      )}
    </div>
  );
}
