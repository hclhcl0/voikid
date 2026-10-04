'use client';

// =============================================
// Dạng 5: Điền chữ còn thiếu (Fill in Missing Letter)
// Có hình và từ khuyết một chữ; trẻ kéo/chạm chữ vào ô trống.
// Mục tiêu: Làm quen cách viết từ
// =============================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Word } from '@/types';
import { useTTS } from '@/hooks/useTTS';
import { WordImage } from '@/components/WordImage';

interface Props {
  targetWord: Word;
  onAnswer: (correct: boolean, isFast: boolean) => void;
}

export function ExerciseFillMissingLetter({ targetWord, onAnswer }: Props) {
  const { speak } = useTTS();
  const wordClean = targetWord.en.trim().toLowerCase();
  
  // Pick which index to mask (prefer a vowel or 1st/2nd letter)
  const [missingIndex, setMissingIndex] = useState<number>(0);
  const [targetChar, setTargetChar] = useState<string>('');
  const [letterChoices, setLetterChoices] = useState<string[]>([]);
  const [filledChar, setFilledChar] = useState<string | null>(null);
  const [isCorrectState, setIsCorrectState] = useState<boolean | null>(null);
  const [wrongChar, setWrongChar] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Determine missing letter: prefer vowels or letter at index 1 or 0
    let chosenIdx = 0;
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const vowelIndices: number[] = [];
    for (let i = 0; i < wordClean.length; i++) {
      if (vowels.includes(wordClean[i])) vowelIndices.push(i);
    }

    if (vowelIndices.length > 0) {
      chosenIdx = vowelIndices[Math.floor(Math.random() * vowelIndices.length)];
    } else {
      chosenIdx = Math.floor(Math.random() * Math.min(3, wordClean.length));
    }

    const missing = wordClean[chosenIdx] || 'a';
    setMissingIndex(chosenIdx);
    setTargetChar(missing);

    // Pick 3 distractor letters
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('').filter((c) => c !== missing);
    const distractors = alphabet.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [missing, ...distractors].sort(() => Math.random() - 0.5);

    setLetterChoices(options);
    setFilledChar(null);
    setIsCorrectState(null);
    setWrongChar(null);
    startTimeRef.current = Date.now();
  }, [targetWord.id, wordClean]);

  const handlePickLetter = (char: string) => {
    if (isCorrectState) return;

    if (char === targetChar) {
      // Correct!
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setFilledChar(char);
      setIsCorrectState(true);
      setWrongChar(null);

      // Pronounce full word
      speak(targetWord.en, 'en-US', 0.85);

      setTimeout(() => {
        onAnswer(true, elapsed < 4);
      }, 1400);
    } else {
      // Wrong letter
      setWrongChar(char);
      setTimeout(() => {
        setWrongChar(null);
      }, 600);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Header prompt */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black mb-2">
          <span>✍️</span> Dạng 5: Điền chữ còn thiếu
        </span>
        <h3 className="text-base font-black text-gray-800">
          Chạm chữ cái đúng để hoàn thành từ!
        </h3>
      </div>

      {/* Word and missing letter box */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-amber-100 text-center flex flex-col items-center">
        <div className="mb-2 flex items-center justify-center">
          <WordImage word={targetWord} size="lg" />
        </div>
        <p className="text-xs text-gray-400 font-bold mb-4">
          🇻🇳 Nghĩa: <span className="text-amber-600 font-extrabold">{targetWord.vi}</span>
        </p>

        {/* Word with masked letter slot */}
        <div className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-amber-50/70 rounded-2xl border border-amber-200">
          {wordClean.split('').map((ch, idx) => {
            if (idx === missingIndex) {
              return (
                <motion.div
                  key={idx}
                  animate={
                    isCorrectState
                      ? { scale: [1, 1.25, 1], backgroundColor: '#10b981' }
                      : {}
                  }
                  className={`w-11 h-13 rounded-xl border-2 flex items-center justify-center font-andika font-black text-2xl transition-all ${
                    isCorrectState
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                      : 'border-dashed border-amber-400 bg-white text-amber-600'
                  }`}
                >
                  {filledChar ? filledChar.toUpperCase() : '?'}
                </motion.div>
              );
            }

            return (
              <div
                key={idx}
                className="w-9 h-12 flex items-center justify-center font-andika font-bold text-2xl text-gray-800"
              >
                {ch.toUpperCase()}
              </div>
            );
          })}
        </div>

        {isCorrectState && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-black text-emerald-600 mt-3"
          >
            ✓ Chính xác! "{targetWord.en}"
          </motion.p>
        )}
      </div>

      {/* Choice Letters */}
      <div>
        <p className="text-xs text-gray-400 font-bold text-center mb-2">
          Chọn 1 chữ cái bên dưới:
        </p>
        <div className="grid grid-cols-4 gap-2.5">
          {letterChoices.map((char) => {
            const isWrong = wrongChar === char;
            const isDone = isCorrectState && char === targetChar;

            return (
              <motion.button
                key={char}
                whileTap={!isCorrectState ? { scale: 0.9 } : {}}
                onClick={() => handlePickLetter(char)}
                disabled={Boolean(isCorrectState)}
                className={`h-16 rounded-2xl font-black text-2xl font-andika flex flex-col items-center justify-center transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-md'
                    : isWrong
                    ? 'bg-rose-100 text-rose-700 border-2 border-rose-400 animate-bounce'
                    : 'bg-white border-2 border-gray-200 text-gray-800 hover:border-amber-400 hover:bg-amber-50 shadow-sm'
                }`}
              >
                <span>{char.toUpperCase()}</span>
                <span className="text-[10px] text-gray-400 font-nunito -mt-1 font-bold">
                  {char}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
