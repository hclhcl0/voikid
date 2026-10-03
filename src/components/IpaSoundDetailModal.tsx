'use client';

// =============================================
// VocaKids – IpaSoundDetailModal Component
// Hiển thị hướng dẫn chi tiết cách phát âm 1 âm IPA
// Khẩu hình: Môi, Răng, Lưỡi, Rung cổ họng
// Kèm nút nghe âm chuẩn & từ ví dụ
// =============================================

import { motion, AnimatePresence } from 'framer-motion';
import { IpaSound, IPA_TYPE_METAS } from '@/data/ipaChart';
import { useTTS } from '@/hooks/useTTS';

interface Props {
  sound: IpaSound | null;
  onClose: () => void;
}

export function IpaSoundDetailModal({ sound, onClose }: Props) {
  const { speak } = useTTS();

  if (!sound) return null;

  const typeMeta = IPA_TYPE_METAS[sound.type];

  // Phát âm từ ví dụ với tốc độ chậm rõ
  const handlePlayWord = () => {
    speak(sound.sample_word, 'en-US', 0.65);
  };

  // Phát âm thử cụm âm vị
  const handlePlaySound = () => {
    speak(sound.speech_cue, 'en-US', 0.45);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-4 border-orange-100 flex flex-col max-h-[90vh]"
          style={{ boxShadow: '0 12px 36px rgba(249,115,22,0.2)' }}
        >
          {/* Header với ký hiệu IPA to nổi bật */}
          <div className={`p-5 bg-gradient-to-r ${sound.color} text-white relative text-center`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white font-bold text-lg transition-colors cursor-pointer"
              title="Đóng"
            >
              ✕
            </button>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-white/25 backdrop-blur mb-2">
              {typeMeta?.label || sound.typeName_vi}
            </span>

            <div className="font-extrabold text-6xl tracking-wider my-1 drop-shadow-md select-all">
              {sound.display}
            </div>

            <h3 className="font-black text-xl text-white/95 mt-1">
              {sound.name_vi}
            </h3>

            {/* Quick Play Sound Button */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                type="button"
                onClick={handlePlaySound}
                className="px-4 py-2 rounded-2xl bg-white text-gray-800 font-black text-sm shadow hover:bg-orange-50 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🔊</span> Nghe âm vị
              </button>
              <button
                type="button"
                onClick={handlePlayWord}
                className="px-4 py-2 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-black text-sm shadow backdrop-blur active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🎧</span> Nghe từ: <strong className="underline underline-offset-2">{sound.sample_word}</strong> {sound.emoji}
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-5 overflow-y-auto space-y-4 text-left">
            {/* Hành động chính */}
            <div className="p-3.5 rounded-2xl bg-orange-50 border-2 border-orange-200 flex items-start gap-3">
              <span className="text-3xl shrink-0">👄</span>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-orange-800">
                  Hành động miệng
                </h4>
                <p className="text-sm font-bold text-gray-800 mt-0.5 leading-snug">
                  {sound.mouth_action}
                </p>
              </div>
            </div>

            {/* Khẩu hình chi tiết: Môi - Răng - Lưỡi - Thanh quản */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <span>📋</span> Khẩu hình chuẩn (Răng - Môi - Lưỡi)
              </h4>

              <div className="grid grid-cols-1 gap-2 text-xs">
                {/* Môi */}
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="font-black text-rose-500 shrink-0 w-16">💋 Môi:</span>
                  <span className="text-gray-700 font-semibold">{sound.mouth_detail.lips}</span>
                </div>

                {/* Răng */}
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="font-black text-sky-500 shrink-0 w-16">🦷 Răng:</span>
                  <span className="text-gray-700 font-semibold">{sound.mouth_detail.teeth}</span>
                </div>

                {/* Lưỡi */}
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="font-black text-amber-500 shrink-0 w-16">👅 Lưỡi:</span>
                  <span className="text-gray-700 font-semibold">{sound.mouth_detail.tongue}</span>
                </div>

                {/* Dây thanh */}
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="font-black text-purple-500 shrink-0 w-16">🫁 Cổ họng:</span>
                  <span className="text-gray-700 font-bold">{sound.mouth_detail.voice_box}</span>
                </div>
              </div>
            </div>

            {/* Mẹo so sánh với tiếng Việt */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
              <h4 className="text-xs font-black text-amber-800 flex items-center gap-1.5 mb-1">
                <span>💡</span> Mẹo nhớ cho bé (So sánh tiếng Việt)
              </h4>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                {sound.vietnamese_tip}
              </p>
            </div>

            {/* Từ mẫu thực hành */}
            <div className="p-3.5 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-violet-500">
                  Từ ví dụ chuẩn
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-black text-gray-800">
                    {sound.sample_word}
                  </span>
                  <span className="text-sm font-bold text-violet-600">
                    {sound.sample_word_ipa}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  🇻🇳 {sound.sample_word_vi}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-4xl drop-shadow">{sound.emoji}</span>
                <button
                  type="button"
                  onClick={handlePlayWord}
                  className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-bold text-lg shadow-md hover:bg-violet-700 active:scale-95 transition-all cursor-pointer"
                  title="Nghe từ mẫu"
                >
                  🔊
                </button>
              </div>
            </div>
          </div>

          {/* Footer Close */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer"
            >
              Bé đã hiểu rồi! 👍
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
