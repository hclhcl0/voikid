'use client';
import {motion} from 'framer-motion';
import {useId,useState,type ReactNode} from 'react';
import {useKidsPhonics} from '@/hooks/useKidsPhonics';
import type {useTTS} from '@/hooks/useTTS';
import {AiWordReadingGuide} from './AiWordReadingGuide';
import {IpaWordDecoderModal} from '@/components/IpaWordDecoderModal';
import {WordImage} from '@/components/WordImage';
import {AudioSourceBadge} from '@/components/AudioSourceBadge';
import type {Word} from '@/types';
import {Minus,Plus,Star,Turtle,UsersRound,Volume2} from 'lucide-react';

// ── Shared: Score star display ─────────────────────────────────────────────
function StarRow({ stars }: { stars: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((s) => (
        <Star key={s} aria-hidden="true" className={`h-4 w-4 ${s <= stars ? 'fill-amber-300 text-amber-500' : 'text-slate-200'}`}/>
      ))}
    </div>
  );
}

// ── FlashCard component ────────────────────────────────────────────────────
export function WordStudyCard({
  word,
  onListenNormal,
  onListenSlow,
  speakingMode,
  audioSource,
  prevStars,
  playbackControls,
}: {
  word: Word;
  onListenNormal: () => void;
  onListenSlow?: () => void;
  speakingMode: 'normal' | 'slow' | 'superslow' | null;
  audioSource: ReturnType<typeof useTTS>['audioSource'];
  prevStars: number;
  playbackControls?: ReactNode;
}) {
  const {phonics,loading:phonicsLoading,error:phonicsError,refresh:refreshPhonics}=useKidsPhonics(word.en,word.phonetic,word.kids_phonics);
  const [showIpaDecoder, setShowIpaDecoder] = useState(false);
  const [help,setHelp]=useState<'reading'|'parent'|null>(null);
  const helpId=useId();
  const primarySpeaking = speakingMode !== null && (!onListenSlow || speakingMode === 'normal');

  return (
    <>
      <motion.div
        key={word.id}
        initial={{ opacity: 0, x: 60, scale: 0.9 }}
        animate={{ opacity: 1, x: 0,  scale: 1 }}
        exit={{ opacity: 0, x: -60, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="bg-white rounded-2xl px-5 pb-4 pt-9 sm:px-10 sm:pb-5 shadow-sm border border-slate-200 relative overflow-hidden"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-orange-100/40" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-amber-100/40" />

        <div className="absolute right-4 top-3 z-10" aria-label={`${prevStars} trên 3 sao`}>
          <StarRow stars={prevStars} />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-2 text-center">
          <div className="grid w-full grid-cols-[80px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-5">
          {/* Emoji / Illustration */}
          <motion.div
            key={word.id || word.en}
            initial={{ scale: 0.5, rotate: -15 }}
            animate={{ scale: 1,   rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex items-center justify-center"
          >
            <WordImage word={word} size="study" showSkeleton />
          </motion.div>

          <div className="min-w-0 space-y-2">
          {/* English word - font Andika chuẩn chữ a đơn tầng giống tập viết tiếng Việt */}
          <h1
            className="max-w-full break-words font-bold text-2xl leading-tight min-[360px]:text-3xl sm:text-4xl md:text-5xl text-gray-800 tracking-normal"
            style={{ fontFamily: 'var(--font-andika), "Andika", sans-serif' }}
          >
            {word.en}
          </h1>

          {/* Vietnamese meaning */}
          <div className="inline-block rounded-xl bg-orange-50 px-3 py-1 text-base font-bold leading-snug text-orange-700 sm:text-lg">
            {word.vi ? (
              word.vi
            ) : (
              <span className="text-sm font-semibold opacity-95 flex items-center justify-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang dịch...
              </span>
            )}
          </div>
          </div>
          </div>

          <AudioSourceBadge source={audioSource} text={word.en} />
          {/* Listen buttons: Normal & Slow */}
          <div className="flex items-center gap-2 w-full pt-2">
            {/* Normal Listen */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={onListenNormal}
              className={`min-w-0 flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer min-h-11 ${
                primarySpeaking
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white ring-2 ring-violet-300 animate-pulse-ring'
                  : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-violet-200 hover:shadow-lg'
              }`}
            >
              <Volume2 aria-hidden="true" className="h-5 w-5"/>
              <span className="whitespace-nowrap text-xs min-[360px]:text-sm">{primarySpeaking ? 'Đang đọc...' : 'Nghe mẫu'}</span>
            </motion.button>
            {playbackControls}

            {/* Slow Listen */}
            {onListenSlow && <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={onListenSlow}
              className={`min-w-0 flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer min-h-11 ${
                speakingMode === 'slow' || speakingMode === 'superslow'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white ring-2 ring-amber-300 animate-pulse-ring'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:shadow-amber-200 hover:shadow-lg'
              }`}
            >
              <Turtle aria-hidden="true" className="h-5 w-5"/>
              <span>{speakingMode === 'slow' || speakingMode === 'superslow' ? 'Đang đọc chậm...' : 'Đọc chậm'}</span>
            </motion.button>}
          </div>
          <p className="text-xs font-medium text-slate-500">Nghe mẫu rồi đọc theo nhé!</p>

          <div className="grid w-full grid-cols-2 gap-2">
            <button type="button" aria-expanded={help==='reading'} aria-controls={helpId} onClick={()=>setHelp(help==='reading'?null:'reading')} className={`flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-2 text-xs font-bold ${help==='reading'?'border-orange-300 bg-orange-100 text-orange-800':'border-orange-100 bg-orange-50/50 text-orange-800 hover:bg-orange-100'}`}>Giúp bé đọc {help==='reading'?<Minus aria-hidden="true" className="h-3.5 w-3.5"/>:<Plus aria-hidden="true" className="h-3.5 w-3.5"/>}</button>
            <button type="button" aria-expanded={help==='parent'} aria-controls={helpId} onClick={()=>setHelp(help==='parent'?null:'parent')} className={`flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-2 text-xs font-semibold ${help==='parent'?'border-slate-300 bg-slate-100 text-slate-700':'border-slate-100 text-slate-500 hover:bg-slate-50'}`}><UsersRound aria-hidden="true" className="h-4 w-4"/>Phụ huynh</button>
          </div>
          <div id={helpId} hidden={!help} className="w-full rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            {help==='reading'?<AiWordReadingGuide phonics={phonics} loading={phonicsLoading} error={phonicsError} onRefresh={refreshPhonics}/>:help==='parent'?<div className="space-y-3 text-left text-sm leading-relaxed text-slate-600">
              <p>Cho bé nghe mẫu, đọc theo từng phần rồi nối cả từ. Luyện phụ âm cuối bằng cách nghe và bắt chước, không thêm âm “ờ”.</p>
              {word.phonetic && <button type="button" onClick={() => setShowIpaDecoder(true)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700">{word.phonetic} · Xem IPA và khẩu hình</button>}
              {phonics?.mouth_tip && <p>{phonics.mouth_tip}</p>}
            </div>:null}
          </div>
        </div>
      </motion.div>

      {/* Modal giải mã IPA chi tiết của từ */}
      {showIpaDecoder && (
        <IpaWordDecoderModal
          word={word}
          onClose={() => setShowIpaDecoder(false)}
        />
      )}
    </>
  );
}
