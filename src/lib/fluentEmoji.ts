import manifest from './fluent-emoji-manifest.json';
import { emojiToTwemojiCode } from './twemoji';

/** Local Microsoft Fluent Emoji Flat assets, downloaded with their MIT license. */
export function getFluentEmojiUrl(emoji: string): string | null {
  const code = emojiToTwemojiCode(emoji);
  const filename = code ? (manifest as Record<string, string>)[code] : undefined;
  return filename ? `/media/fluent-emoji/${filename}` : null;
}
