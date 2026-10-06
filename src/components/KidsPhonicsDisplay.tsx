'use client';

// =============================================
// VocaKids – KidsPhonicsDisplay Component
// Hiển thị phiên âm Việt hóa thông minh cho trẻ
// - Âm tiết trọng âm (IN HOA) → màu cam
// - Âm đuôi (t) (s) → màu xanh lá, kích thước nhỏ
// - Hiệu ứng nhấp nháy theo nhịp âm tiết
// - Nút "Mẹo miệng" mở popup
// =============================================

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { KidsPhonics } from '@/types';
import {phonicsParts,type PhonicsPart} from '@/lib/kidsPhonics';

// ── Parse a syllable string into parts ───────────────────────────────────────
// e.g. "É" → { main: "É", stressed: true, ending: null }
//      "phần-(t)" → { main: "phần", stressed: false, ending: "(t)" }
//      "PHÍT-(s*)" → { main: "PHÍT", stressed: true, ending: "(s*)" }
// ── Single syllable pill ──────────────────────────────────────────────────────
function SyllablePill({ part, index, active,showRhythm }: { part: PhonicsPart; index: number; active: boolean;showRhythm:boolean }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 400, damping: 22 }}
      className={`inline-flex min-w-11 flex-col items-center gap-2 px-2 py-2 rounded-xl transition-all duration-200 ${
        active ? 'ring-2 ring-orange-400 bg-orange-50' : part.stressed ? 'bg-orange-50' : ''
      }`}
    >
      <span className="inline-flex h-7 items-baseline gap-0.5">
      {/* Main syllable */}
      <span className={`leading-7 ${
        part.stressed
          ? 'font-black text-orange-600 text-2xl'
          : 'font-medium text-slate-600 text-lg'
      }`}>
        {part.main}
      </span>
      {/* Ending sound badge */}
      </span>
      {showRhythm && <span className={`text-[11px] leading-4 ${part.stressed ? 'font-black text-orange-700' : 'font-medium text-slate-500'}`}>{part.stressed?'MẠNH':'nhẹ'}</span>}
    </motion.span>
  );
}

// ── Mouth tip popup ───────────────────────────────────────────────────────────
function MouthTipPopup({ tip, onClose }: { tip: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <motion.div
          initial={{ y: 80, scale: 0.9, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-4 border-orange-100"
          style={{ boxShadow: '0 8px 0 rgba(249,115,22,0.15), 0 20px 40px rgba(0,0,0,0.12)' }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
              className="text-6xl mb-3 inline-block"
            >
              👄
            </motion.div>
            <h3 className="font-black text-gray-800 text-lg mb-2">Mẹo mở miệng!</h3>
            <p className="text-gray-600 font-semibold text-sm leading-relaxed">{tip}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-400 text-white font-black shadow-lg"
          >
            Hiểu rồi! 👍
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main KidsPhonicsDisplay ───────────────────────────────────────────────────
interface Props {
  phonics: KidsPhonics;
  /** If true, animates syllables one-by-one (used during TTS playback) */
  playing?: boolean;
  /** Current syllable index during playback */
  activeSyllable?: number;
  /** Show a compact single-line version (for word tables) */
  compact?: boolean;
  showMouthTip?: boolean;
}

export function KidsPhonicsDisplay({ phonics, playing = false, activeSyllable = -1, compact = false, showMouthTip = true }: Props) {
  const [showTip, setShowTip] = useState(false);
  const {parts,hasRhythm} = phonicsParts(phonics);

  if (compact) {
    return (
      <span className="inline-flex items-center gap-0.5 flex-wrap">
        {parts.map((part, i) => (
          <span key={i} className="inline-flex items-baseline gap-0.5">
            <span className={`font-black text-sm ${part.stressed ? 'text-orange-500' : 'text-violet-500'}`}>
              {part.main}
            </span>
            {part.ending && <span className="text-emerald-500 text-xs font-black">{part.ending}</span>}
            {i < parts.length - 1 && <span aria-hidden="true" className="text-gray-300 text-xs">·</span>}
          </span>
        ))}
      </span>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-semibold text-slate-500">{hasRhythm?'Đọc theo nhịp':'Nghe mẫu rồi đọc theo'}</p>

        {/* Syllable pills row */}
        <div aria-label={hasRhythm?`Nhịp đọc: ${parts.map(part=>part.stressed?'MẠNH':'nhẹ').join(' – ')}`:'Gợi ý đọc gần âm'} className="flex items-start justify-center flex-wrap gap-1">
          {parts.map((part, i) => (
            <div key={i} className="flex items-start gap-0.5">
              <SyllablePill
                part={part}
                index={i}
                active={playing && activeSyllable === i}
                showRhythm={hasRhythm}
              />
              {i < parts.length - 1 && (
                <span aria-hidden="true" className="mt-2 leading-7 text-gray-300 text-sm font-bold select-none">·</span>
              )}
            </div>
          ))}
        </div>
        <p className="max-w-xs text-center text-[11px] leading-4 text-slate-500">{hasRhythm?'Nhấn phần màu cam, lướt nhẹ các phần còn lại. ':''}Nghe mẫu rồi nối cả từ nhé!</p>

        {/* Mouth tip button */}
        {showMouthTip && phonics.mouth_tip && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowTip(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border-2 border-amber-200 text-amber-700 text-xs font-black hover:bg-amber-100 transition-colors"
          >
            <span className="text-base">👄</span>
            Mẹo phát âm
          </motion.button>
        )}
      </div>

      {showTip && (
        <MouthTipPopup tip={phonics.mouth_tip} onClose={() => setShowTip(false)} />
      )}
    </>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
export function KidsPhonicsLoading() {
  return (
    <div className="flex items-center gap-1 animate-pulse">
      {[40, 56, 40].map((w, i) => (
        <div key={i} className={`h-7 bg-orange-100 rounded-xl`} style={{ width: w }} />
      ))}
    </div>
  );
}
