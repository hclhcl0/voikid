import type { Sticker, Word } from '@/types';
import { shuffle } from '@/lib/learning/engine';

const key = (text: string) => text.normalize('NFC').trim().toLocaleLowerCase().replace(/\s+/g, ' ');

/** One distinct English word and meaning per pair, so matching has one answer. */
export function treasureWords(words: Word[], seed: string): Word[] {
  const ids = new Set<string>(), english = new Set<string>(), meanings = new Set<string>();
  return shuffle(words, seed).filter(word => {
    const en = key(word.en), vi = key(word.vi);
    if (!word.id || !en || !vi || ids.has(word.id) || english.has(en) || meanings.has(vi)) return false;
    ids.add(word.id); english.add(en); meanings.add(vi);
    return true;
  }).slice(0, 5);
}

export function treasureChoices(words: Word[], target: Word, seed: string): Word[] {
  return shuffle([target, ...shuffle(words.filter(w => w.id !== target.id && key(w.vi) !== key(target.vi)), seed).slice(0, 3)], `${seed}:choices`);
}

export function treasureComplete(words: Word[], heard: string[], matched: string[], spoken: string[]): boolean {
  return words.length > 0 && words.every(w => heard.includes(w.id) && matched.includes(w.id) && spoken.includes(w.id));
}

export function treasureReward(unitId: string, gradeId: string): Omit<Sticker, 'earnedAt'> {
  const level = Number(gradeId.replace('lop', '')) || 0;
  return {
    id: `treasure_${gradeId}_${unitId}`, unitId, gradeId, setId: 'explorers',
    name: level >= 5 ? 'Vương miện kho báu' : level >= 4 ? 'Kho báu kim cương' : level >= 3 ? 'Kho báu pha lê' : 'Nhà thám hiểm nhỏ',
    emoji: level >= 5 ? '👑' : level >= 4 ? '💎' : level >= 3 ? '🔮' : '🧭',
    tier: level >= 5 ? 'legendary' : level >= 4 ? 'rare' : level >= 2 ? 'star' : 'basic',
    condition: 'Hoàn thành hành trình nghe, ghép nghĩa và luyện nói trong Unit. Quà khám phá ghi nhận nỗ lực, không chứng nhận phát âm.',
  };
}
