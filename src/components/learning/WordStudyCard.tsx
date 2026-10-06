'use client';
import {motion} from 'framer-motion';
import {useState} from 'react';
import {useKidsPhonics} from '@/hooks/useKidsPhonics';
import type {useTTS} from '@/hooks/useTTS';
import {KidsPhonicsDisplay,KidsPhonicsLoading} from '@/components/KidsPhonicsDisplay';
import {IpaWordDecoderModal} from '@/components/IpaWordDecoderModal';
import {WordImage} from '@/components/WordImage';
import {AudioSourceBadge} from '@/components/AudioSourceBadge';
import type {Word} from '@/types';

// ── Shared: Score star display ─────────────────────────────────────────────
function StarRow({ stars }: { stars: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((s) => (
        <span key={s} className={`text-xl ${s <= stars ? 'opacity-100' : 'opacity-20'}`}>⭐</span>
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
}: {
  word: Word;
  onListenNormal: () => void;
  onListenSlow?: () => void;
  speakingMode: 'normal' | 'slow' | 'superslow' | null;
  audioSource: ReturnType<typeof useTTS>['audioSource'];
  prevStars: number;
}) {
  const { phonics, loading: phonicsLoading } = useKidsPhonics(word.en, word.phonetic, word.kids_phonics);
  const [showIpaDecoder, setShowIpaDecoder] = useState(false);
  const primarySpeaking = speakingMode !== null && (!onListenSlow || speakingMode === 'normal');

  return (
    <>
      <motion.div
        key={word.id}
        initial={{ opacity: 0, x: 60, scale: 0.9 }}
        animate={{ opacity: 1, x: 0,  scale: 1 }}
        exit={{ opacity: 0, x: -60, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="bg-white rounded-2xl px-10 py-6 md:px-12 md:py-8 shadow-sm border border-slate-200 relative overflow-hidden"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-orange-100/40" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-amber-100/40" />

        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          {/* Stars */}
          <div className="self-end">
            <StarRow stars={prevStars} />
          </div>

          {/* Emoji / Illustration */}
          <motion.div
            key={word.id || word.en}
            initial={{ scale: 0.5, rotate: -15 }}
            animate={{ scale: 1,   rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex items-center justify-center min-h-[120px] md:min-h-[150px] py-1"
          >
            <WordImage word={word} size="2xl" showSkeleton />
          </motion.div>

          {/* English word - font Andika chuẩn chữ a đơn tầng giống tập viết tiếng Việt */}
          <div
            className="max-w-full break-words font-bold text-4xl sm:text-5xl md:text-6xl text-gray-800 tracking-normal"
            style={{ fontFamily: 'var(--font-andika), "Andika", sans-serif' }}
          >
            {word.en}
          </div>

          {/* ── Hàng phiên âm quốc tế chuẩn IPA & nút giải mã ── */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setShowIpaDecoder(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50/90 hover:bg-orange-100 border border-orange-200 text-orange-950 font-bold text-sm shadow-2xs hover:shadow-xs transition-all cursor-pointer group active:scale-95"
              title="Bấm để xem hướng dẫn đọc từng ký hiệu IPA của từ này"
            >
              <span className="font-mono text-gray-800 font-black text-sm group-hover:text-orange-600 transition-colors tracking-wide">
                {word.phonetic ? `[ ${word.phonetic} ]` : '[ IPA ]'}
              </span>
              <span className="text-[11px] font-black text-orange-600 bg-white px-2 py-0.5 rounded-full border border-orange-200 flex items-center gap-1">
                <span>🔍</span> Giải mã IPA
              </span>
            </button>
          </div>

          {/* ── Kids Phonics (Việt hóa) ── */}
          <div className="min-h-[52px] flex items-center justify-center">
            {phonicsLoading ? (
              <KidsPhonicsLoading />
            ) : phonics ? (
              <KidsPhonicsDisplay phonics={phonics} />
            ) : (
              /* Fallback to IPA */
              <span className="text-gray-400 font-semibold text-sm italic">{word.phonetic}</span>
            )}
          </div>

          {/* Vietnamese meaning */}
          <div className="bg-gradient-to-r from-rose-500 to-orange-400 text-white font-black text-lg md:text-xl px-6 py-2.5 rounded-full shadow min-w-[140px]">
            {word.vi ? (
              word.vi
            ) : (
              <span className="text-sm font-semibold opacity-95 flex items-center justify-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang dịch...
              </span>
            )}
          </div>

          <div className="min-h-8"><AudioSourceBadge source={audioSource} text={word.en} /></div>
          {/* Listen buttons: Normal & Slow */}
          <div className="flex items-center gap-3 w-full pt-2 max-w-lg">
            {/* Normal Listen */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={onListenNormal}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-black text-sm md:text-base shadow-md transition-all cursor-pointer min-h-[48px] ${
                primarySpeaking
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white ring-2 ring-violet-300 animate-pulse-ring'
                  : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-violet-200 hover:shadow-lg'
              }`}
            >
              <span className="text-xl">{primarySpeaking ? '🔊' : '🔈'}</span>
              <span>{primarySpeaking ? 'Đang đọc...' : onListenSlow ? 'Nghe chuẩn' : 'Nghe'}</span>
            </motion.button>

            {/* Slow Listen */}
            {onListenSlow && <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={onListenSlow}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-black text-sm md:text-base shadow-md transition-all cursor-pointer min-h-[48px] ${
                speakingMode === 'slow' || speakingMode === 'superslow'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white ring-2 ring-amber-300 animate-pulse-ring'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:shadow-amber-200 hover:shadow-lg'
              }`}
            >
              <span className="text-xl">🐢</span>
              <span>{speakingMode === 'slow' || speakingMode === 'superslow' ? 'Đang đọc chậm...' : 'Đọc chậm'}</span>
            </motion.button>}
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
