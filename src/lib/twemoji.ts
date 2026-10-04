// =============================================
// VocaKids – Twemoji Utility
// Converts emoji characters to consistent, beautiful SVG/PNG images
// from Twemoji CDN (Twitter's open-source emoji set)
// =============================================

/**
 * Convert an emoji character to its Unicode codepoint string for Twemoji CDN.
 * Handles multi-codepoint emoji (e.g. flags, ZWJ sequences, variation selectors).
 */
export function emojiToTwemojiCode(emoji: string): string | null {
  if (!emoji) return null;

  try {
    // Convert emoji to array of codepoints (handles surrogate pairs / multi-char)
    const codePoints: string[] = [];
    let i = 0;
    while (i < emoji.length) {
      const code = emoji.codePointAt(i);
      if (code === undefined) break;

      // Skip variation selectors (U+FE0E, U+FE0F) and ZWJ (U+200D)
      // Twemoji includes ZWJ sequences but we need to keep them
      if (code !== 0xfe0e && code !== 0xfe0f) {
        codePoints.push(code.toString(16));
      }

      // Advance by 2 chars if surrogate pair (code > U+FFFF)
      i += code > 0xffff ? 2 : 1;
    }

    if (codePoints.length === 0) return null;
    return codePoints.join('-');
  } catch {
    return null;
  }
}

/**
 * Get Twemoji PNG URL for an emoji (72x72px, very reliable CDN)
 * Returns null if emoji can't be converted
 */
export function getTwemojiPngUrl(emoji: string): string | null {
  const code = emojiToTwemojiCode(emoji);
  if (!code) return null;
  return `https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/72x72/${code}.png`;
}

/**
 * Get Twemoji SVG URL for an emoji (vector, sharp at any size)
 * Returns null if emoji can't be converted
 */
export function getTwemojiSvgUrl(emoji: string): string | null {
  const code = emojiToTwemojiCode(emoji);
  if (!code) return null;
  return `https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/svg/${code}.svg`;
}

/**
 * Check if an emoji is likely supported by Twemoji
 * Returns true if the emoji has at least one valid codepoint > 127 (non-ASCII)
 */
export function isTwemojiSupported(emoji: string): boolean {
  if (!emoji) return false;
  const code = emoji.codePointAt(0);
  return code !== undefined && code > 127;
}
