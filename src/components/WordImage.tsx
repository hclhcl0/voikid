'use client';

// =============================================
// VocaKids – WordImage Component
// 3-layer image fallback system:
//   1. word.image_url (AI-generated cartoon)
//   2. Local Fluent Emoji SVG, then Twemoji CDN for missing assets
//   3. emoji text (original fallback)
// =============================================

import { useEffect, useState } from 'react';
import { Word } from '@/types';
import { getTwemojiPngUrl, isTwemojiSupported } from '@/lib/twemoji';
import { getFluentEmojiUrl } from '@/lib/fluentEmoji';
import { displayWordEmoji, wordNumber } from '@/lib/wordIllustration';

type ImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'study';

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
  study: { img: 'w-20 h-20 sm:w-28 sm:h-28', emoji: 'text-6xl sm:text-7xl' },
};

export function WordImage(props: WordImageProps) {
  return <WordImageContent key={JSON.stringify([props.word.id, props.word.en, props.word.emoji, props.word.image_url])} {...props} />;
}

function WordImageContent({
  word,
  size = 'md',
  className = '',
  showSkeleton = false,
  preferPhoto = false,
}: WordImageProps) {
  const [imgError, setImgError] = useState(false);
  const [twemojiError, setTwemojiError] = useState(false);
  const [fluentError, setFluentError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [automatic,setAutomatic]=useState<{key:string;emoji:string}|null>(null);
  const illustrationIdentity=JSON.stringify([word.id,word.en,word.vi,word.emoji]);
  useEffect(()=>{
    if(word.image_url)return;
    const controller=new AbortController();
    const options={method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:word.id,en:word.en,vi:word.vi}),signal:controller.signal};
    void fetch('/api/word/illustration',options).then(async r=>{const value=await r.json();if(!value.emoji&&r.ok){const admin=await fetch('/api/admin/word/illustration',options);return admin.ok?admin.json():value;}return value;}).then(value=>{if(!controller.signal.aborted&&typeof value.emoji==='string')setAutomatic({key:illustrationIdentity,emoji:value.emoji});}).catch(()=>{});
    return ()=>controller.abort();
  },[illustrationIdentity,word.id,word.en,word.vi,word.image_url]);

  const { img: imgClass, emoji: emojiClass } = SIZE_MAP[size];
  const emoji=automatic?.key===illustrationIdentity?automatic.emoji:displayWordEmoji(word.en,word.emoji);
  const number=wordNumber(word.en);

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

  if(number!==null&&!preferPhoto){return <span role="img" aria-label={`${word.en}: ${number}`} className={`inline-flex items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 font-bold text-violet-600 ${imgClass} ${emojiClass} ${className}`}>{number}</span>;}

  // === LAYER 2: Local Fluent SVG, with CDN fallback ===
  if (!preferPhoto && !twemojiError && isTwemojiSupported(emoji)) {
    const localUrl = fluentError ? null : getFluentEmojiUrl(emoji);
    const twUrl = localUrl || getTwemojiPngUrl(emoji);
    if (twUrl) {
      return (
        <div className={`relative flex items-center justify-center ${imgClass} ${className}`}>
          {showSkeleton && loading && (
            <div className={`absolute inset-0 rounded-xl bg-gray-100 animate-pulse`} />
          )}
          <img
            src={twUrl}
            alt={word.en}
            className={`${imgClass} object-contain ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200 select-none`}
            onLoad={() => setLoading(false)}
            onError={() => { if (localUrl) setFluentError(true); else setTwemojiError(true); setLoading(false); }}
            draggable={false}
          />
        </div>
      );
    }
  }

  // === LAYER 3: Original emoji text fallback ===
  return (
    <span
      className={`inline-flex items-center justify-center ${imgClass} ${emojiClass} select-none leading-none ${className}`}
      role="img"
      aria-label={word.en}
    >
      {emoji}
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

export function EmojiImage(props: EmojiImageProps) {
  return <EmojiImageContent key={props.emoji} {...props} />;
}

function EmojiImageContent({ emoji, alt = '', size = 'md', className = '' }: EmojiImageProps) {
  const [error, setError] = useState(false);
  const [fluentError, setFluentError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { img: imgClass, emoji: emojiClass } = SIZE_MAP[size];

  if (!error && isTwemojiSupported(emoji)) {
    const localUrl = fluentError ? null : getFluentEmojiUrl(emoji);
    const url = localUrl || getTwemojiPngUrl(emoji);
    if (url) {
      return (
        <img
          src={url}
          alt={alt || emoji}
          className={`${imgClass} object-contain ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200 select-none ${className}`}
          onLoad={() => setLoading(false)}
          onError={() => { if (localUrl) setFluentError(true); else setError(true); }}
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
