'use client';
import Image from 'next/image';
import { useState } from 'react';
import manifest from '@/lib/sticker-assets.json';
import { emojiToTwemojiCode } from '@/lib/twemoji';
import { getFluentEmojiUrl } from '@/lib/fluentEmoji';

export function StickerArtwork({emoji,className = '',size = 112}:{emoji:string;className?:string;size?:number}) {
  return <Artwork key={emoji} emoji={emoji} className={className} size={size} />;
}
function Artwork({emoji,className,size}:{emoji:string;className:string;size:number}) {
  const [failed,setFailed] = useState(0);
  const code = emojiToTwemojiCode(emoji);
  const filename = code ? (manifest as Record<string,string>)[code] : null;
  const src = failed === 0 && filename ? `/media/stickers/fluent-3d/${filename}` : failed < 2 ? getFluentEmojiUrl(emoji) : null;
  if (!src) return <span className={className} aria-hidden="true" style={{fontSize:size * .7}}>{emoji}</span>;
  return <Image src={src} alt="" width={size} height={size} unoptimized draggable={false} className={`object-contain ${className}`} onError={() => setFailed(count => count + 1)} />;
}
