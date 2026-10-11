import type { Word } from '@/types';
import { EmojiImage } from '@/components/WordImage';
import { wordIllustrationEmoji, wordNumber } from '@/lib/wordIllustration';

// Only a curated illustration supports an exercise; generic emojis do not define meaning.
export function ExerciseIllustration({word}: {word: Word}) {
  const emoji = wordIllustrationEmoji(word.en);
  const number = wordNumber(word.en);
  if (number !== null) return <span className="text-3xl font-bold text-violet-600" aria-hidden="true">{number}</span>;
  return emoji ? <span aria-hidden="true"><EmojiImage emoji={emoji} size="sm" /></span> : null;
}
