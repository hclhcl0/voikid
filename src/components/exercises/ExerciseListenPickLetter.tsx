'use client';

// =============================================
// Dạng 4: Nghe và chọn chữ cái (Listen & Pick Letter)
// Nghe tên chữ hoặc âm đang luyện, chọn chữ đúng; tách rõ hai chế độ.
// Mục tiêu: Nhận biết chữ và âm
// =============================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Word } from '@/types';
import { useTTS } from '@/hooks/useTTS';
import { WordImage } from '@/components/WordImage';

type LetterMode = 'name' | 'sound';

interface Props {
  targetWord: Word;
  onAnswer: (correct: boolean, isFast: boolean) => void;
  defaultMode?: LetterMode;
}

// Letter phonics map for clear auditory cues
const PHONICS_MAP: Record<string, { sound: string; ipa: string; example: string }> = {
  A: { sound: 'æ, a', ipa: '/æ/', example: 'Apple' },
  B: { sound: 'buh, b', ipa: '/b/', example: 'Ball' },
  C: { sound: 'kuh, c', ipa: '/k/', example: 'Cat' },
  D: { sound: 'duh, d', ipa: '/d/', example: 'Dog' },
  E: { sound: 'eh, e', ipa: '/e/', example: 'Elephant' },
  F: { sound: 'fuh, f', ipa: '/f/', example: 'Fish' },
  G: { sound: 'guh, g', ipa: '/g/', example: 'Girl' },
  H: { sound: 'huh, h', ipa: '/h/', example: 'Hat' },
  I: { sound: 'ih, i', ipa: '/ɪ/', example: 'Igloo' },
  J: { sound: 'juh, j', ipa: '/dʒ/', example: 'Juice' },
  K: { sound: 'kuh, k', ipa: '/k/', example: 'Kite' },
  L: { sound: 'luh, l', ipa: '/l/', example: 'Lion' },
  M: { sound: 'muh, m', ipa: '/m/', example: 'Monkey' },
  N: { sound: 'nuh, n', ipa: '/n/', example: 'Nest' },
  O: { sound: 'ah, o', ipa: '/ɒ/', example: 'Orange' },
  P: { sound: 'puh, p', ipa: '/p/', example: 'Pig' },
  Q: { sound: 'kwuh, q', ipa: '/kw/', example: 'Queen' },
  R: { sound: 'ruh, r', ipa: '/r/', example: 'Rabbit' },
  S: { sound: 'sss, s', ipa: '/s/', example: 'Sun' },
  T: { sound: 'tuh, t', ipa: '/t/', example: 'Tiger' },
  U: { sound: 'uh, u', ipa: '/ʌ/', example: 'Umbrella' },
  V: { sound: 'vuh, v', ipa: '/v/', example: 'Van' },
  W: { sound: 'wuh, w', ipa: '/w/', example: 'Water' },
  X: { sound: 'ks, x', ipa: '/ks/', example: 'Box' },
  Y: { sound: 'yuh, y', ipa: '/j/', example: 'Yellow' },
  Z: { sound: 'zzz, z', ipa: '/z/', example: 'Zebra' },
};

export function ExerciseListenPickLetter({
  targetWord,
  onAnswer,
  defaultMode = 'name',
}: Props) {
  const { speak, isSpeaking } = useTTS();
  const [mode, setMode] = useState<LetterMode>(defaultMode);
  const [chosenLetter, setChosenLetter] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  // Target letter is initial letter of word
  const targetLetter = (targetWord.en.charAt(0) || 'A').toUpperCase();

  // Generate 4 letter choices
  const [letterOptions, setLetterOptions] = useState<string[]>([]);

  useEffect(() => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter((l) => l !== targetLetter);
    const shuffled = alphabet.sort(() => Math.random() - 0.5).slice(0, 3);
    const all = [targetLetter, ...shuffled].sort(() => Math.random() - 0.5);
    setLetterOptions(all);
    setChosenLetter(null);
    setHasAnswered(false);
    startTimeRef.current = Date.now();

    // Auto-speak target
    const timer = setTimeout(() => {
      playAudio(mode);
    }, 300);
    return () => clearTimeout(timer);
  }, [targetWord.id, mode, targetLetter]);

  const playAudio = (currMode: LetterMode) => {
    if (currMode === 'name') {
      // Speak letter name clearly: "Letter B"
      speak(`Letter ${targetLetter}`, 'en-US', 0.8);
    } else {
      // Speak phonics sound
      const info = PHONICS_MAP[targetLetter];
      const cue = info ? info.sound : targetLetter;
      speak(cue, 'en-US', 0.6);
    }
  };

  const handleChoose = (letter: string) => {
    if (hasAnswered) return;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const isCorrect = letter === targetLetter;
    setChosenLetter(letter);
    setHasAnswered(true);

    if (isCorrect) {
      speak(`${targetLetter}, as in ${targetWord.en}`, 'en-US', 0.85);
    } else {
      speak(`Letter ${targetLetter}`, 'en-US', 0.85);
    }

    setTimeout(() => {
      onAnswer(isCorrect, elapsed < 3.5);
    }, 1400);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Header prompt */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-black mb-2">
          <span>🔤</span> Dạng 4: Nghe và chọn chữ cái
        </span>
        <h3 className="text-base font-black text-gray-800">
          Nghe phát âm và bấm chọn chữ cái đúng!
        </h3>
      </div>

      {/* Mode Switcher: Tên chữ vs Âm Phonics */}
      <div className="flex bg-gray-100 p-1 rounded-2xl max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => setMode('name')}
          className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all ${
            mode === 'name'
              ? 'bg-white text-cyan-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          🅰️ Tên chữ cái
        </button>
        <button
          type="button"
          onClick={() => setMode('sound')}
          className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all ${
            mode === 'sound'
              ? 'bg-white text-cyan-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          🗣️ Âm đang luyện (Phonics)
        </button>
      </div>

      {/* Speaker and Visual Hint */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-cyan-100 flex flex-col items-center justify-center">
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => playAudio(mode)}
          className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-md transition-all ${
            isSpeaking
              ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-200'
              : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white'
          }`}
          title="Bấm để nghe lại"
        >
          <span className="text-3xl">🔊</span>
          <span className="text-[10px] font-black text-white/90">Nghe lại</span>
        </motion.button>

        <p className="text-xs text-gray-500 font-bold mt-2">
          {mode === 'name' ? 'Đang phát: Tên chữ cái' : 'Đang phát: Âm phát âm (Phonics)'}
        </p>

        {/* Word illustration hint */}
        <div className="mt-2 flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <WordImage word={targetWord} size="xs" />
          <span className="text-xs font-semibold text-gray-600">
            Từ gợi ý: <span className="font-bold text-gray-800">{targetWord.en}</span> ({targetWord.vi})
          </span>
        </div>
      </div>

      {/* 4 Big Letter Bubbles */}
      <div className="grid grid-cols-4 gap-2.5 pt-1">
        {letterOptions.map((letter) => {
          const isSelected = chosenLetter === letter;
          const isTarget = letter === targetLetter;

          let btnClass = 'bg-white border-2 border-gray-200 text-gray-800 hover:border-cyan-300 shadow-sm';
          if (hasAnswered) {
            if (isTarget) {
              btnClass = 'bg-emerald-500 border-emerald-600 text-white shadow-md ring-4 ring-emerald-200 scale-105';
            } else if (isSelected && !isTarget) {
              btnClass = 'bg-rose-100 border-rose-400 text-rose-700 opacity-60';
            } else {
              btnClass = 'bg-white border-gray-200 text-gray-300 opacity-40';
            }
          }

          return (
            <motion.button
              key={letter}
              whileTap={!hasAnswered ? { scale: 0.9 } : {}}
              onClick={() => handleChoose(letter)}
              disabled={hasAnswered}
              className={`h-20 rounded-2xl font-black text-3xl font-andika flex flex-col items-center justify-center transition-all ${btnClass}`}
            >
              <span>{letter}</span>
              <span className="text-[10px] font-bold opacity-60 font-nunito -mt-1">
                {letter.toLowerCase()}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
