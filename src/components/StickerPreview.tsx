import { StickerArtwork } from '@/components/StickerArtwork';

// Every preview uses the same closed gift, including its image fallback.
export function StickerPreview({emoji,revealed,size = 112,className = ''}:{emoji:string;revealed:boolean;size?:number;className?:string}) {
  return <span className={`relative inline-flex items-center justify-center ${className}`}>
    <StickerArtwork emoji={revealed ? emoji : '🎁'} size={size} className="h-full w-full drop-shadow-sm" />
    {!revealed && <span aria-hidden="true" className="absolute right-0 top-0 flex h-[32%] w-[32%] items-center justify-center rounded-full border-2 border-white bg-violet-600 font-extrabold leading-none text-white shadow-sm" style={{fontSize:size * .22}}>?</span>}
  </span>;
}
