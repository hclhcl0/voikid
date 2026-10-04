'use client';

// =============================================
// Dạng 3: Ghép từ với hình (Match Word to Picture)
// Kéo từ vào hình tương ứng hoặc chạm lần lượt để ghép.
// Mục tiêu: Ghi nhớ nghĩa của từ
// =============================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Word } from '@/types';
import { useTTS } from '@/hooks/useTTS';
import confetti from 'canvas-confetti';
import { WordImage } from '@/components/WordImage';

interface Props {
  words: Word[]; // exactly 3 words to match
  onAnswer: (correct: boolean, isFast: boolean) => void;
}

export function ExerciseMatchWordPicture({ words, onAnswer }: Props) {
  const { speak } = useTTS();
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [selectedPicId, setSelectedPicId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<{ wordId: string; picId: string } | null>(null);
  const [shuffledPics, setShuffledPics] = useState<Word[]>([]);
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    // Shuffle picture items so they don't align with words directly
    const pics = [...words].sort(() => Math.random() - 0.5);
    setShuffledPics(pics);
    setSelectedWordId(null);
    setSelectedPicId(null);
    setMatchedIds(new Set());
    setWrongPair(null);
  }, [words]);

  const handleSelectWord = (wordId: string) => {
    if (matchedIds.has(wordId)) return;
    if (selectedPicId) {
      // Check match with previously selected picture
      checkMatch(wordId, selectedPicId);
    } else {
      setSelectedWordId(wordId);
    }
  };

  const handleSelectPic = (picId: string) => {
    if (matchedIds.has(picId)) return;
    if (selectedWordId) {
      // Check match with previously selected word
      checkMatch(selectedWordId, picId);
    } else {
      setSelectedPicId(picId);
    }
  };

  const checkMatch = (wordId: string, picId: string) => {
    if (wordId === picId) {
      // Correct match!
      const targetWord = words.find((w) => w.id === wordId);
      if (targetWord) {
        speak(targetWord.en, 'en-US', 0.85);
      }

      const nextMatched = new Set(matchedIds);
      nextMatched.add(wordId);
      setMatchedIds(nextMatched);
      setSelectedWordId(null);
      setSelectedPicId(null);

      // Check if all pairs are solved
      if (nextMatched.size === words.length) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#6366f1', '#f59e0b', '#ec4899'],
        });
        const elapsed = (Date.now() - startTime) / 1000;
        setTimeout(() => {
          onAnswer(true, elapsed < 8);
        }, 1200);
      }
    } else {
      // Mismatch
      setWrongPair({ wordId, picId });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedWordId(null);
        setSelectedPicId(null);
      }, 700);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Header prompt */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black mb-2">
          <span>🧩</span> Dạng 3: Ghép từ với hình
        </span>
        <h3 className="text-base font-black text-gray-800">
          Chạm vào Từ, rồi chạm Hình tương ứng để ghép đôi!
        </h3>
        <p className="text-xs text-gray-500 font-semibold mt-0.5">
          Đã ghép đúng: {matchedIds.size} / {words.length} cặp
        </p>
      </div>

      {/* Two columns: Words on left, Pictures on right */}
      <div className="grid grid-cols-2 gap-3.5 pt-1">
        {/* Left Column: Words */}
        <div className="space-y-2.5">
          <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 text-center">
            🔤 Cột Từ Vựng
          </p>
          {words.map((w) => {
            const isMatched = matchedIds.has(w.id);
            const isSelected = selectedWordId === w.id;
            const isWrong = wrongPair?.wordId === w.id;

            let cardCls = 'bg-white border-2 border-gray-200 text-gray-700 shadow-sm hover:border-violet-300';
            if (isMatched) {
              cardCls = 'bg-emerald-50 border-2 border-emerald-400 text-emerald-700 opacity-90 shadow-none';
            } else if (isWrong) {
              cardCls = 'bg-rose-50 border-2 border-rose-400 text-rose-700 animate-pulse';
            } else if (isSelected) {
              cardCls = 'bg-violet-50 border-3 border-violet-500 text-violet-700 shadow-md ring-2 ring-violet-200 scale-102';
            }

            return (
              <motion.button
                key={w.id}
                whileTap={!isMatched ? { scale: 0.95 } : {}}
                onClick={() => handleSelectWord(w.id)}
                disabled={isMatched}
                className={`w-full py-4 px-3 rounded-2xl font-andika font-bold text-base flex items-center justify-between transition-all ${cardCls}`}
              >
                <span>{w.en}</span>
                {isMatched && <span className="text-emerald-500 text-xs font-black">✓ Xong</span>}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column: Pictures */}
        <div className="space-y-2.5">
          <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 text-center">
            🖼️ Cột Hình Ảnh
          </p>
          {shuffledPics.map((p) => {
            const isMatched = matchedIds.has(p.id);
            const isSelected = selectedPicId === p.id;
            const isWrong = wrongPair?.picId === p.id;

            let cardCls = 'bg-white border-2 border-gray-200 shadow-sm hover:border-violet-300';
            if (isMatched) {
              cardCls = 'bg-emerald-50 border-2 border-emerald-400 opacity-90 shadow-none';
            } else if (isWrong) {
              cardCls = 'bg-rose-50 border-2 border-rose-400 animate-pulse';
            } else if (isSelected) {
              cardCls = 'bg-violet-50 border-3 border-violet-500 shadow-md ring-2 ring-violet-200 scale-102';
            }

            return (
              <motion.button
                key={p.id}
                whileTap={!isMatched ? { scale: 0.95 } : {}}
                onClick={() => handleSelectPic(p.id)}
                disabled={isMatched}
                className={`w-full py-2.5 px-3 rounded-2xl flex items-center justify-center transition-all ${cardCls}`}
              >
                <div className="flex items-center justify-center min-h-[44px]">
                  <WordImage word={p} size="sm" />
                </div>
                {isMatched && (
                  <span className="ml-2 text-xs font-bold text-emerald-600">✓</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
