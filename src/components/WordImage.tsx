'use client';

// =============================================
// VocaKids – WordImage Component
// 3-layer image fallback system:
//   1. word.image_url (AI-generated cartoon)
//   2. Twemoji SVG/PNG (beautiful, consistent emoji)
//   3. emoji text (original fallback)
// =============================================

import { useState } from 'react';
import { Word } from '@/types';
import { getTwemojiPngUrl, isTwemojiSupported } from '@/lib/twemoji';

type ImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface WordImageProps {
  word: Word;
  size?: ImageSize;
  className?: string;
  /** If true, shows a pulsing placeholder skeleton while loading */
  showSkeleton?: boolean;
  /** If true, uses the AI-generated image_url only (no fallback to emoji) */
  preferPhoto?: boolean;
}

const SIZE_MAP: Record<ImageSize, { img: string; emoji: string }> = {
  xs:  { img: 'w-8 h-8',     emoji: 'text-2xl' },
  sm:  { img: 'w-12 h-12',   emoji: 'text-4xl' },
  md:  { img: 'w-20 h-20',   emoji: 'text-5xl' },
  lg:  { img: 'w-28 h-28',   emoji: 'text-7xl' },
  xl:  { img: 'w-36 h-36',   emoji: 'text-8xl' },
  '2xl': { img: 'w-44 h-44', emoji: 'text-9xl' },
};

export function WordImage({
  word,
  size = 'md',
  className = '',
  showSkeleton = false,
  preferPhoto = false,
}: WordImageProps) {
  const [imgError, setImgError] = useState(false);
  const [twemojiError, setTwemojiError] = useState(false);
  const [loading, setLoading] = useState(true);

  const { img: imgClass, emoji: emojiClass } = SIZE_MAP[size];

  // === LAYER 1: AI-generated image URL ===
  if (word.image_url && !imgError) {
    return (
      <div className={`relative ${imgClass} ${className}`}>
        {showSkeleton && loading && (
          <div className={`absolute inset-0 rounded-2xl bg-gray-200 animate-pulse`} />
        )}
        <img
          src={word.image_url}
          alt={word.en}
          className={`${imgClass} object-cover rounded-2xl ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => setLoading(false)}
          onError={() => { setImgError(true); setLoading(false); }}
          draggable={false}
        />
      </div>
    );
  }

  // === LAYER 2: Twemoji PNG (if not preferPhoto-only) ===
  if (!preferPhoto && !twemojiError && isTwemojiSupported(word.emoji)) {
    const twUrl = getTwemojiPngUrl(word.emoji);
    if (twUrl) {
      return (
        <div className={`relative flex items-center justify-center ${imgClass} ${className}`}>
          {showSkeleton && loading && (
            <div className={`absolute inset-0 rounded-xl bg-gray-100 animate-pulse`} />
          )}
          <img
            src={twUrl}
            alt={word.emoji}
            className={`${imgClass} object-contain ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200 select-none`}
            onLoad={() => setLoading(false)}
            onError={() => { setTwemojiError(true); setLoading(false); }}
            draggable={false}
          />
        </div>
      );
    }
  }

  // === LAYER 3: Original emoji text fallback ===
  return (
    <span
      className={`inline-flex items-center justify-center ${emojiClass} select-none leading-none ${className}`}
      role="img"
      aria-label={word.en}
    >
      {word.emoji}
    </span>
  );
}

// ── Simpler emoji-only variant (no Word type needed) ──────────────────────────

interface EmojiImageProps {
  emoji: string;
  alt?: string;
  size?: ImageSize;
  className?: string;
}

export function EmojiImage({ emoji, alt = '', size = 'md', className = '' }: EmojiImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { img: imgClass, emoji: emojiClass } = SIZE_MAP[size];

  if (!error && isTwemojiSupported(emoji)) {
    const url = getTwemojiPngUrl(emoji);
    if (url) {
      return (
        <img
          src={url}
          alt={alt || emoji}
          className={`${imgClass} object-contain ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200 select-none ${className}`}
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
          draggable={false}
        />
      );
    }
  }

  return (
    <span className={`inline-flex items-center justify-center ${emojiClass} select-none leading-none ${className}`} role="img" aria-label={alt}>
      {emoji}
    </span>
  );
}
