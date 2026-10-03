'use client';

// =============================================
// Dạng 8: Nghe và sắp xếp tranh (Listen & Order Sequence)
// Nghe lần lượt 3 từ rồi kéo/chạm tranh vào đúng thứ tự.
// Mục tiêu: Luyện nghe và ghi nhớ
// =============================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Word } from '@/types';
import { useTTS } from '@/hooks/useTTS';
import confetti from 'canvas-confetti';

interface Props {
  words: Word[]; // 3 words in sequence
  onAnswer: (correct: boolean, isFast: boolean) => void;
}

export function ExerciseListenOrderSequence({ words, onAnswer }: Props) {
  const { speak } = useTTS();
  const sequence = words.slice(0, 3); // correct sequence [0, 1, 2]

  const [slots, setSlots] = useState<(Word | null)[]>([null, null, null]);
  const [availablePics, setAvailablePics] = useState<Word[]>([]);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [checkedState, setCheckedState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Shuffle available pictures
    const shuffled = [...sequence].sort(() => Math.random() - 0.5);
    setAvailablePics(shuffled);
    setSlots([null, null, null]);
    setCheckedState('idle');
    startTimeRef.current = Date.now();

    // Auto-play the 3 words with audio prompt
    const t = setTimeout(() => {
      handlePlayAllSequence();
    }, 400);
    return () => clearTimeout(t);
  }, [words]);

  const handlePlayAllSequence = () => {
    if (isPlayingAll) return;
    setIsPlayingAll(true);

    // Speak sequence: "1. word1 ... 2. word2 ... 3. word3"
    speak(`One: ${sequence[0].en}`, 'en-US', 0.8);

    setTimeout(() => {
      speak(`Two: ${sequence[1].en}`, 'en-US', 0.8);
    }, 1800);

    setTimeout(() => {
      speak(`Three: ${sequence[2].en}`, 'en-US', 0.8);
    }, 3600);

    setTimeout(() => {
      setIsPlayingAll(false);
    }, 5000);
  };

  const handlePlaySingle = (index: number) => {
    const labels = ['One', 'Two', 'Three'];
    speak(`${labels[index]}: ${sequence[index].en}`, 'en-US', 0.8);
  };

  const handleSelectPicture = (word: Word) => {
    // Find first empty slot
    const firstEmptyIndex = slots.findIndex((s) => s === null);
    if (firstEmptyIndex === -1) return; // All slots full

    const nextSlots = [...slots];
    nextSlots[firstEmptyIndex] = word;
    setSlots(nextSlots);

    setAvailablePics((prev) => prev.filter((p) => p.id !== word.id));
    setCheckedState('idle');
  };

  const handleRemoveSlot = (index: number) => {
    const wordToRemove = slots[index];
    if (!wordToRemove) return;

    const nextSlots = [...slots];
    nextSlots[index] = null;
    setSlots(nextSlots);

    setAvailablePics((prev) => [...prev, wordToRemove]);
    setCheckedState('idle');
  };

  const handleCheckOrder = () => {
    const isComplete = slots.every((s) => s !== null);
    if (!isComplete) return;

    const isAllCorrect = slots.every(
      (slotWord, idx) => slotWord?.id === sequence[idx].id
    );

    if (isAllCorrect) {
      setCheckedState('correct');
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
      });
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setTimeout(() => {
        onAnswer(true, elapsed < 12);
      }, 1400);
    } else {
      setCheckedState('wrong');
      speak('Hãy nghe lại thứ tự nhé!', 'vi-VN', 0.9);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Header prompt */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black mb-2">
          <span>🔢</span> Dạng 8: Nghe và sắp xếp tranh
        </span>
        <h3 className="text-base font-black text-gray-800">
          Nghe lần lượt 3 từ và xếp tranh vào ô 1 - 2 - 3!
        </h3>
      </div>

      {/* Audio Sequence Player */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-blue-100 flex flex-col items-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayAllSequence}
          disabled={isPlayingAll}
          className={`py-3 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
            isPlayingAll
              ? 'bg-amber-400 text-amber-950 scale-102 ring-4 ring-amber-200'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95'
          }`}
        >
          <span className="text-xl">{isPlayingAll ? '⏳' : '🔊'}</span>
          <span>{isPlayingAll ? 'Đang đọc lần lượt 1, 2, 3...' : 'Nghe cả 3 từ (1 - 2 - 3)'}</span>
        </motion.button>

        {/* Small helpers to re-listen to single items */}
        <div className="flex gap-2 mt-3">
          {sequence.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePlaySingle(idx)}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-200"
            >
              Từ {idx + 1} 🔊
            </button>
          ))}
        </div>
      </div>

      {/* Target Slots: 1, 2, 3 */}
      <div className="grid grid-cols-3 gap-3">
        {slots.map((slotWord, idx) => {
          const isSlotCorrect = checkedState === 'correct';
          const isSlotWrong =
            checkedState === 'wrong' && slotWord?.id !== sequence[idx].id;

          let slotBorder = 'border-dashed border-2 border-gray-300 bg-gray-50';
          if (slotWord) {
            slotBorder = 'border-solid border-2 border-blue-400 bg-white shadow-sm';
          }
          if (isSlotCorrect) {
            slotBorder = 'border-solid border-3 border-emerald-500 bg-emerald-50';
          } else if (isSlotWrong) {
            slotBorder = 'border-solid border-3 border-rose-400 bg-rose-50';
          }

          return (
            <motion.div
              key={idx}
              whileTap={slotWord ? { scale: 0.95 } : {}}
              onClick={() => handleRemoveSlot(idx)}
              className={`h-32 rounded-3xl p-2 flex flex-col items-center justify-center cursor-pointer transition-all relative ${slotBorder}`}
            >
              <span className="absolute top-2 left-2.5 w-5 h-5 rounded-full bg-blue-500 text-white text-[11px] font-black flex items-center justify-center">
                {idx + 1}
              </span>

              {slotWord ? (
                <>
                  <span className="text-5xl select-none">{slotWord.emoji}</span>
                  <span className="text-[11px] font-bold text-gray-700 mt-1 truncate max-w-full">
                    {slotWord.en}
                  </span>
                  <span className="text-[9px] text-gray-400 font-semibold -mt-0.5">
                    (Chạm để gỡ)
                  </span>
                </>
              ) : (
                <div className="text-center text-gray-300">
                  <span className="text-3xl block">📥</span>
                  <span className="text-[10px] font-bold">Ô số {idx + 1}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Available Pictures Pool */}
      <div>
        <p className="text-xs text-gray-500 font-bold text-center mb-2">
          {availablePics.length > 0
            ? 'Chạm tranh bên dưới để xếp vào ô:'
            : 'Đã xếp đủ 3 tranh! Hãy bấm Kiểm tra:'}
        </p>

        <div className="grid grid-cols-3 gap-3 min-h-[90px]">
          {availablePics.map((pic) => (
            <motion.button
              key={pic.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleSelectPicture(pic)}
              className="py-3 px-2 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 shadow-sm flex flex-col items-center justify-center transition-all"
            >
              <span className="text-4xl select-none">{pic.emoji}</span>
              <span className="text-[11px] font-bold text-gray-700 mt-1">
                {pic.en}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Check Order Button */}
      {slots.every((s) => s !== null) && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
          <button
            type="button"
            onClick={handleCheckOrder}
            className={`w-full py-3.5 rounded-2xl font-black text-sm shadow-md transition-all ${
              checkedState === 'correct'
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95'
            }`}
          >
            {checkedState === 'correct'
              ? '✓ Chính xác hoàn toàn!'
              : checkedState === 'wrong'
              ? '❌ Chưa đúng, thử đổi vị trí nhé!'
              : '✅ Kiểm tra thứ tự'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
