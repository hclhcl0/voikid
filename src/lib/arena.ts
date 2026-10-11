import type { Word } from '@/types';
import { normalizeAnswer, shuffle } from '@/lib/learning/engine';

export type ArenaKind = 'meaning' | 'word' | 'spelling' | 'listening' | 'missing' | 'scramble' | 'listen-choice';
export const arenaDifficulties = [
  { name: 'Dễ', timeMs: 20000, wrongDamage: 10, correctDamage: 3 },
  { name: 'Vừa', timeMs: 15000, wrongDamage: 14, correctDamage: 5 },
  { name: 'Khó', timeMs: 10000, wrongDamage: 20, correctDamage: 7 },
] as const;
export interface ArenaQuestion {
  word: Word;
  kind: ArenaKind;
  options: { id: string; text: string }[];
  rivalHits: boolean;
  prompt?: string;
  missingLetters?: string;
  letters?: string[];
}
export interface ArenaAnswer {
  word: Word;
  correct: boolean;
  hinted: boolean;
  damage: number;
  rivalDamage: number;
  speedTier?: number;
  speedBonus?: number;
  elapsedMs?: number;
  timedOut?: boolean;
}
export interface ArenaState {
  index: number;
  health: number;
  rivalHealth: number;
  energy: number;
  combo: number;
  bestCombo: number;
  answers: ArenaAnswer[];
  finished: boolean;
}
export const initialArena = (): ArenaState => ({ index: 0, health: 100, rivalHealth: 100, energy: 0, combo: 0, bestCombo: 0, answers: [], finished: false });

// Remove duplicate English entries and ambiguous meanings from multiple-choice questions.
export function arenaWords(words: Word[]): Word[] {
  const seen = new Set<string>();
  return words.filter(word => {
    const key = normalizeAnswer(word.en);
    if (!key || !word.vi.trim() || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function createArenaQuestions(words: Word[], seed: string): ArenaQuestion[] {
  const pool = arenaWords(words);
  return shuffle(pool, seed).slice(0, 10).map((word, index) => {
    let kind: ArenaKind = (['meaning', 'missing', 'listen-choice', 'scramble', 'listening', 'word', 'spelling'] as const)[index % 7];
    if (kind === 'scramble' && !/^[a-z]{2,16}$/i.test(word.en)) kind = 'spelling';
    let missingLetters = '';
    const prompt = [...word.en].map((letter, i) => {
      if (/[a-z]/i.test(letter) && i % 2 === 1) { missingLetters += letter; return '_'; }
      return letter;
    }).join('');
    if (kind === 'missing' && !missingLetters) kind = 'spelling';
    const used = new Set([normalizeAnswer(word.vi)]);
    const choices = [word];
    for (const candidate of shuffle(pool, `${seed}:${index}`)) {
      const meaning = normalizeAnswer(candidate.vi);
      if (candidate.id === word.id || used.has(meaning)) continue;
      used.add(meaning);
      choices.push(candidate);
      if (choices.length === 4) break;
    }
    if (choices.length < 2 && (kind === 'meaning' || kind === 'word' || kind === 'listen-choice')) kind = 'spelling';
    return {
      word, kind, prompt, missingLetters, letters: shuffle([...word.en], `${seed}:letters:${index}`),
      options: ['spelling', 'listening', 'missing', 'scramble'].includes(kind) ? [] : shuffle(choices.map(w => ({ id: w.id, text: kind === 'meaning' ? w.vi : w.en })), `${seed}:options:${index}`),
      rivalHits: shuffle([true, true, true, false, false], `${seed}:rival:${index}`)[0],
    };
  });
}

export function arenaSpeedTier(elapsedMs: number, kind: ArenaKind): number {
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) return 0;
  const seconds = elapsedMs / (['spelling', 'listening', 'missing', 'scramble'].includes(kind) ? 2000 : 1000);
  return seconds <= 3 ? 3 : seconds <= 6 ? 2 : seconds <= 10 ? 1 : 0;
}

export function answerArena(state: ArenaState, questions: ArenaQuestion[], response: string, hinted: boolean, special: boolean, elapsedMs = Infinity, timedOut = false, difficulty: number = 1): ArenaState {
  const question = questions[state.index];
  if (state.finished || !question) return state;
  const correct = !timedOut && (question.kind === 'missing'
    ? normalizeAnswer(response) === normalizeAnswer(question.missingLetters ?? '')
    : ['spelling', 'listening', 'scramble'].includes(question.kind)
    ? normalizeAnswer(response) === normalizeAnswer(question.word.en)
    : response === question.word.id);
  const useSpecial = special && state.energy >= 3;
  const combo = correct && !hinted ? state.combo + 1 : 0;
  const speedTier = correct && !hinted ? arenaSpeedTier(elapsedMs, question.kind) : 0;
  const speedBonus = speedTier * (useSpecial ? 8 : 4);
  const damage = correct ? (hinted ? 8 : 15 + Math.min(combo - 1, 3) * 3) + (useSpecial ? 15 : 0) + speedBonus : 0;
  const rules = arenaDifficulties[difficulty] ?? arenaDifficulties[1];
  const rivalDamage = !correct ? rules.wrongDamage : question.rivalHits ? rules.correctDamage : 0;
  const health = Math.max(0, state.health - rivalDamage);
  const rivalHealth = Math.max(0, state.rivalHealth - damage);
  const index = state.index + 1;
  return {
    index, health, rivalHealth,
    energy: Math.min(3, state.energy - (useSpecial ? 3 : 0) + (correct && !hinted ? 1 : 0)),
    combo, bestCombo: Math.max(state.bestCombo, combo),
    answers: [...state.answers, { word: question.word, correct, hinted, damage, rivalDamage, speedTier, speedBonus, elapsedMs: Number.isFinite(elapsedMs) ? elapsedMs : undefined, timedOut }],
    finished: health === 0 || rivalHealth === 0 || index >= questions.length,
  };
}

export function arenaResult(state: ArenaState) {
  return state.health === state.rivalHealth ? 'draw' : state.health > state.rivalHealth ? 'win' : 'practice';
}

export function arenaReward(state: ArenaState, difficulty = 1) {
  if (!state.finished) return { stars: 0, points: 0, base: 0, speed: 0, combo: 0, difficultyBonus: 0 };
  const base = arenaResult(state) === 'win' ? 3 : arenaResult(state) === 'draw' ? 2 : 1;
  const speed = Math.min(3, state.answers.filter(a => a.correct && !a.hinted && (a.speedTier ?? 0) >= 2).length);
  const combo = state.bestCombo >= 5 ? 2 : state.bestCombo >= 3 ? 1 : 0;
  const difficultyBonus = arenaResult(state) === 'win' ? Math.max(0, Math.min(2, difficulty)) : 0;
  const stars = base + speed + combo + difficultyBonus;
  return { stars, points: stars * 10, base, speed, combo, difficultyBonus };
}
