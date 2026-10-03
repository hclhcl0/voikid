'use client';

// =============================================
// Dạng 6: Lật thẻ tìm cặp (Memory Match Game)
// Lật tìm cặp tranh–tranh ở mức dễ, tranh–từ ở mức sau;
// ghép đúng thì phát âm từ.
// Mục tiêu: Ôn tập qua trò chơi
// =============================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Word } from '@/types';
import { useTTS } from '@/hooks/useTTS';
import confetti from 'canvas-confetti';

type MatchLevel = 'pic_pic' | 'pic_word';

interface MemoryCard {
  uid: string; // unique card id
  wordId: string;
  type: 'pic' | 'word';
  label: string; // emoji or text
  word: Word;
}

interface Props {
  words: Word[]; // 3 words for a 6-card game
  onAnswer: (correct: boolean, isFast: boolean) => void;
  defaultLevel?: MatchLevel;
}

export function ExerciseMemoryMatch({
  words,
  onAnswer,
  defaultLevel = 'pic_word',
}: Props) {
  const { speak } = useTTS();
  const [level, setLevel] = useState<MatchLevel>(defaultLevel);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [matchedWordIds, setMatchedWordIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [startTime] = useState<number>(Date.now());

  // Build deck whenever words or level change
  useEffect(() => {
    const subset = words.slice(0, 3);
    const deck: MemoryCard[] = [];

    subset.forEach((w, index) => {
      // Card A: always picture
      deck.push({
        uid: `${w.id}_pic_${index}`,
        wordId: w.id,
        type: 'pic',
        label: w.emoji,
        word: w,
      });

      // Card B: picture (easy) or word text (advanced)
      deck.push({
        uid: `${w.id}_match_${index}`,
        wordId: w.id,
        type: level === 'pic_pic' ? 'pic' : 'word',
        label: level === 'pic_pic' ? w.emoji : w.en,
        word: w,
      });
    });

    // Shuffle deck
    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedUids([]);
    setMatchedWordIds(new Set());
    setIsProcessing(false);
  }, [words, level]);

  const handleCardClick = (card: MemoryCard) => {
    if (isProcessing) return;
    if (flippedUids.includes(card.uid)) return;
    if (matchedWordIds.has(card.wordId)) return;

    if (flippedUids.length === 0) {
      setFlippedUids([card.uid]);
      if (card.type === 'word') {
        speak(card.word.en, 'en-US', 0.85);
      }
    } else if (flippedUids.length === 1) {
      const firstUid = flippedUids[0];
      const firstCard = cards.find((c) => c.uid === firstUid);
      if (!firstCard) return;

      const nextFlipped = [firstUid, card.uid];
      setFlippedUids(nextFlipped);

      // Check match
      if (firstCard.wordId === card.wordId) {
        // Matched!
        speak(card.word.en, 'en-US', 0.85);
        const nextMatched = new Set(matchedWordIds);
        nextMatched.add(card.wordId);
        setMatchedWordIds(nextMatched);
        setFlippedUids([]);

        // Check if all pairs are solved
        if (nextMatched.size === Math.min(3, words.length)) {
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.55 },
            colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
          });
          const elapsed = (Date.now() - startTime) / 1000;
          setTimeout(() => {
            onAnswer(true, elapsed < 15);
          }, 1200);
        }
      } else {
        // Not a match
        setIsProcessing(true);
        setTimeout(() => {
          setFlippedUids([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Header prompt */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-black mb-2">
          <span>🃏</span> Dạng 6: Lật thẻ tìm cặp
        </span>
        <h3 className="text-base font-black text-gray-800">
          Lật các thẻ bài úp để tìm cặp tương ứng!
        </h3>
      </div>

      {/* Level selector: Tranh - Tranh vs Tranh - Từ */}
      <div className="flex bg-gray-100 p-1 rounded-2xl max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => setLevel('pic_pic')}
          className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all ${
            level === 'pic_pic'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          🖼️ Tranh – Tranh (Dễ)
        </button>
        <button
          type="button"
          onClick={() => setLevel('pic_word')}
          className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all ${
            level === 'pic_word'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          🔤 Tranh – Từ (Chuẩn)
        </button>
      </div>

      {/* Progress pill */}
      <p className="text-center text-xs font-bold text-gray-500">
        Tìm được: <span className="text-purple-600 font-extrabold">{matchedWordIds.size}</span> / {Math.min(3, words.length)} cặp
      </p>

      {/* 2x3 Grid of 6 Cards */}
      <div className="grid grid-cols-3 gap-3">
        {cards.map((card) => {
          const isFlipped = flippedUids.includes(card.uid) || matchedWordIds.has(card.wordId);
          const isMatched = matchedWordIds.has(card.wordId);

          return (
            <motion.button
              key={card.uid}
              whileTap={!isFlipped ? { scale: 0.93 } : {}}
              onClick={() => handleCardClick(card)}
              disabled={isFlipped || isProcessing}
              className={`h-32 rounded-3xl border-2 flex flex-col items-center justify-center p-2 transition-all relative overflow-hidden ${
                isMatched
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm ring-2 ring-emerald-200'
                  : isFlipped
                  ? 'bg-white border-purple-400 text-purple-900 shadow-md ring-2 ring-purple-200'
                  : 'bg-gradient-to-br from-violet-500 to-purple-600 border-purple-300 text-white shadow-sm hover:opacity-95'
              }`}
            >
              {isFlipped ? (
                card.type === 'pic' ? (
                  <span className="text-5xl select-none">{card.label}</span>
                ) : (
                  <div className="text-center">
                    <span className="font-andika font-black text-sm text-purple-800 block">
                      {card.label}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                      {card.word.vi}
                    </span>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-3xl select-none opacity-80">❓</span>
                  <span className="text-[10px] font-black text-white/70 mt-1 uppercase tracking-wider">
                    VocaKids
                  </span>
                </div>
              )}

              {isMatched && (
                <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  ✓
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
