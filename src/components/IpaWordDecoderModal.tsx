'use client';

// =============================================
// VocaKids – IpaWordDecoderModal Component
// Modal giải mã phiên âm IPA chi tiết của từ vựng
// Giúp bé hiểu từng ký hiệu IPA cấu thành nên từ
// =============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Word } from '@/types';
import { decodeWordIpa, DecodedIpaToken, IpaSound, IPA_TYPE_METAS } from '@/data/ipaChart';
import { useTTS } from '@/hooks/useTTS';
import { IpaSoundDetailModal } from './IpaSoundDetailModal';

interface Props {
  word: Word;
  onClose: () => void;
}

export function IpaWordDecoderModal({ word, onClose }: Props) {
  const { speak } = useTTS();
  const [selectedSound, setSelectedSound] = useState<IpaSound | null>(null);
  const [activeTokenId, setActiveTokenId] = useState<string | null>(null);

  const tokens = decodeWordIpa(word.phonetic);

  const handleListenWord = (rate: number = 0.85) => {
    speak(word.en, 'en-US', rate);
  };

  const handleSelectToken = (token: DecodedIpaToken) => {
    setActiveTokenId(token.id);
    if (token.sound) {
      // Phát âm âm thanh của phoneme
      speak(token.sound.sample_word, 'en-US', 0.7);
    }
  };

  const activeToken = tokens.find((t) => t.id === activeTokenId) || tokens.find((t) => t.sound);

  return (
    <>
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
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-orange-100 flex flex-col max-h-[92vh]"
            style={{ boxShadow: '0 12px 36px rgba(249,115,22,0.2)' }}
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white font-bold text-lg transition-colors cursor-pointer"
                title="Đóng"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-2xl">{word.emoji}</span>
                <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  🔍 Giải Mã Phiên Âm Quốc Tế IPA
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <h3
                  className="text-3xl font-black tracking-wide"
                  style={{ fontFamily: 'var(--font-andika), "Andika", sans-serif' }}
                >
                  {word.en}
                </h3>
                <span className="text-white/80 font-bold text-sm">
                  ({word.vi})
                </span>
              </div>

              {/* Audio Listen Word */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => handleListenWord(0.85)}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-gray-800 font-bold text-xs shadow hover:bg-orange-50 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🔊</span> Nghe chuẩn
                </button>
                <button
                  type="button"
                  onClick={() => handleListenWord(0.4)}
                  className="px-3.5 py-1.5 rounded-xl bg-black/20 hover:bg-black/30 text-white font-bold text-xs shadow backdrop-blur active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🐢</span> Đọc chậm (0.4x)
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* IPA interactive breakdown row */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                    Bấm vào từng âm để nghe & xem hướng dẫn:
                  </span>
                  <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                    {tokens.filter((t) => t.sound).length} âm vị
                  </span>
                </div>

                {/* Tokens pill container */}
                {tokens.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center text-xs text-amber-800 font-semibold">
                    Từ vựng này chưa có phiên âm IPA. Hãy cập nhật phiên âm (vd: /kæt/) hoặc dùng nút &ldquo;Tự động điền AI&rdquo; để giải mã nhé!
                  </div>
                ) : (
                  <div className="flex items-center justify-center flex-wrap gap-1.5 p-3 rounded-2xl bg-amber-50/60 border-2 border-amber-200">
                    <span className="text-gray-400 font-bold text-xl select-none">/</span>
                    {tokens.map((token) => {
                      const isSelected = activeToken?.id === token.id;

                      if (token.isStress) {
                        return (
                          <button
                            key={token.id}
                            type="button"
                            onClick={() => handleSelectToken(token)}
                            className={`px-2 py-1 rounded-xl font-black text-xl transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-rose-500 text-white shadow-md scale-110 ring-2 ring-rose-300'
                                : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                            }`}
                            title={token.description}
                          >
                            {token.char}
                          </button>
                        );
                      }

                      if (token.char === ' ') {
                        return (
                          <span key={token.id} className="w-2" />
                        );
                      }

                      const sound = token.sound;
                      const typeMeta = sound ? IPA_TYPE_METAS[sound.type] : null;

                      return (
                        <button
                          key={token.id}
                          type="button"
                          onClick={() => handleSelectToken(token)}
                          className={`px-2.5 py-1 rounded-xl font-black text-lg transition-all cursor-pointer flex flex-col items-center min-w-[32px] ${
                            isSelected
                              ? 'bg-orange-500 text-white shadow-lg scale-110 ring-2 ring-orange-300'
                              : sound
                              ? 'bg-white text-gray-800 border border-orange-200 hover:border-orange-400 hover:bg-orange-50'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <span>{token.char}</span>
                          {sound && (
                            <span
                              className={`text-[9px] font-extrabold px-1 rounded-sm leading-none mt-0.5 ${
                                isSelected ? 'bg-white/30 text-white' : typeMeta?.badgeColor || 'bg-gray-200'
                              }`}
                            >
                              {sound.type.startsWith('short') ? 'ngắn' : sound.type.startsWith('long') ? 'dài' : sound.type === 'diphthong' ? 'đôi' : 'phụ âm'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                    <span className="text-gray-400 font-bold text-xl select-none">/</span>
                  </div>
                )}
              </div>

              {/* Detail of selected Token */}
              {activeToken && (
                <motion.div
                  key={activeToken.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-white border-2 border-orange-200 shadow-sm space-y-2.5"
                >
                  {activeToken.isStress ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                          {activeToken.char}
                        </span>
                        <div>
                          <h4 className="font-black text-sm text-gray-800">
                            {activeToken.stressType === 'primary' ? 'Dấu Trọng Âm Chính' : 'Dấu Trọng Âm Phụ'}
                          </h4>
                          <span className="text-xs text-rose-600 font-bold">
                            Quy tắc vàng phát âm tiếng Anh
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 font-medium mt-2 leading-relaxed bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                        {activeToken.description}
                        <br />
                        <span className="text-rose-700 font-bold">👉 Mẹo:</span> Hãy nhấn giọng cao hơn, to hơn vào nguyên âm ngay sau dấu này, các âm còn lại hạ giọng nhẹ nhàng.
                      </p>
                    </div>
                  ) : activeToken.sound ? (
                    <div>
                      {/* Sound Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-xl border border-orange-200">
                            {activeToken.sound.display}
                          </span>
                          <div>
                            <h4 className="font-black text-sm text-gray-800">
                              {activeToken.sound.name_vi}
                            </h4>
                            <span className="text-[11px] font-bold text-gray-400">
                              {activeToken.sound.typeName_vi}
                            </span>
                          </div>
                        </div>

                        {/* Button play audio sound */}
                        <button
                          type="button"
                          onClick={() => speak(activeToken.sound!.sample_word, 'en-US', 0.7)}
                          className="px-3 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>🔊</span> Nghe âm trong từ
                        </button>
                      </div>

                      {/* Mouth action */}
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 mt-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 block mb-0.5">
                          👄 Khẩu hình miệng:
                        </span>
                        <p className="text-xs font-semibold text-gray-700 leading-snug">
                          {activeToken.sound.mouth_action}
                        </p>
                      </div>

                      {/* Vietnamese Tip */}
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 mt-2 text-xs text-amber-900 font-medium">
                        <span className="font-bold text-amber-800">💡 Mẹo tiếng Việt: </span>
                        {activeToken.sound.vietnamese_tip}
                      </div>

                      {/* Button open full detail modal */}
                      <button
                        type="button"
                        onClick={() => setSelectedSound(activeToken.sound!)}
                        className="w-full mt-2 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-black text-xs border border-orange-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>🔍</span> Xem chi tiết răng, môi, lưỡi & từ mẫu ({activeToken.sound.sample_word} {activeToken.sound.emoji})
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      Ký hiệu phiên âm: <strong className="text-gray-800">{activeToken.char}</strong>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Link to full 44 IPA Chart */}
              <div className="pt-1">
                <Link
                  href="/ipa"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  onClick={onClose}
                >
                  <span>📖</span> Mở bài luyện âm và bảng IPA
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Sub modal: IpaSoundDetailModal */}
      {selectedSound && (
        <IpaSoundDetailModal
          sound={selectedSound}
          onClose={() => setSelectedSound(null)}
        />
      )}
    </>
  );
}
