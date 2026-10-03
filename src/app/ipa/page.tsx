'use client';

// =============================================
// VocaKids – 44 Standard IPA Phonemes Page
// Bảng 44 Âm Phiên Âm Quốc Tế Chuẩn IPA Cho Bé
// =============================================

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ALL_44_IPA_SOUNDS,
  IPA_TYPE_METAS,
  IpaSound,
  IpaSoundType,
} from '@/data/ipaChart';
import { useTTS } from '@/hooks/useTTS';
import { IpaSoundDetailModal } from '@/components/IpaSoundDetailModal';

export default function IpaChartPage() {
  const router = useRouter();
  const { speak } = useTTS();
  const [filterType, setFilterType] = useState<IpaSoundType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSound, setSelectedSound] = useState<IpaSound | null>(null);

  // Lọc theo loại âm & tìm kiếm
  const filteredSounds = useMemo(() => {
    return ALL_44_IPA_SOUNDS.filter((s) => {
      // 1. Lọc theo nhóm
      if (filterType !== 'all' && s.type !== filterType) return false;

      // 2. Lọc theo từ khóa tìm kiếm
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchIpa = s.ipa.toLowerCase().includes(q);
        const matchName = s.name_vi.toLowerCase().includes(q);
        const matchWord = s.sample_word.toLowerCase().includes(q);
        const matchWordVi = s.sample_word_vi.toLowerCase().includes(q);
        return matchIpa || matchName || matchWord || matchWordVi;
      }

      return true;
    });
  }, [filterType, searchQuery]);

  // Nghe nhanh âm vị
  const handleQuickPlaySound = (sound: IpaSound, e: React.MouseEvent) => {
    e.stopPropagation();
    speak(sound.speech_cue, 'en-US', 0.5);
  };

  // Nghe từ mẫu
  const handleQuickPlayWord = (sound: IpaSound, e: React.MouseEvent) => {
    e.stopPropagation();
    speak(sound.sample_word, 'en-US', 0.65);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 pb-24">
      {/* ── TOP HEADER ── */}
      <header className="bg-white/90 backdrop-blur sticky top-0 z-40 border-b border-orange-100 px-4 py-3 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
              title="Quay lại"
            >
              ←
            </button>
            <Link
              href="/"
              className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm hover:bg-orange-600 transition-colors"
              title="Về trang chủ"
            >
              🏠
            </Link>
          </div>

          <div className="text-center flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-black text-gray-800 truncate">
              🔤 44 Âm IPA Chuẩn Quốc Tế
            </h1>
            <p className="text-[11px] text-gray-500 font-semibold truncate">
              Bí kíp phát âm chuẩn bản ngữ cho học sinh tiểu học
            </p>
          </div>

          <div className="w-10" />
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Banner giới thiệu sinh động */}
        <div className="bg-gradient-to-r from-orange-400 via-amber-500 to-rose-400 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-7xl opacity-20 pointer-events-none select-none">
            👄
          </div>
          <div className="relative z-10 max-w-lg">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-black mb-2">
              ⭐ Cẩm nang phát âm chuẩn Anh - Mỹ
            </span>
            <h2 className="text-2xl font-black leading-snug drop-shadow-sm">
              Tập Đọc 44 Âm Quốc Tế Dễ Dàng Như Tiếng Việt!
            </h2>
            <p className="text-xs text-white/90 font-medium mt-1 leading-relaxed">
              Bấm vào bất kỳ âm nào để xem <strong>hướng dẫn khẩu hình răng - môi - lưỡi</strong>, mẹo nhớ tiếng Việt và nghe giọng đọc bản ngữ chuẩn từng âm vị.
            </p>
          </div>
        </div>

        {/* ── SEARCH & FILTER TABS ── */}
        <div className="space-y-3">
          {/* Ô tìm kiếm nhanh */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm âm (vd: /æ/, /θ/, /ʃ/, cat, three, fish...)"
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border-2 border-orange-200 focus:border-orange-500 focus:outline-none text-sm font-bold text-gray-800 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 text-gray-600 font-bold text-xs flex items-center justify-center hover:bg-gray-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-2 rounded-2xl font-black text-xs shrink-0 transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50'
              }`}
            >
              Tất cả (44)
            </button>

            {(Object.keys(IPA_TYPE_METAS) as IpaSoundType[]).map((type) => {
              const meta = IPA_TYPE_METAS[type];
              const isSelected = filterType === type;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3.5 py-2 rounded-2xl font-black text-xs shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? `${meta.badgeColor} shadow-md`
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50'
                  }`}
                >
                  <span>{meta.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/30' : 'bg-gray-100'}`}>
                    {meta.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── SOUNDS GRID ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-sm text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎧</span> Danh sách âm ({filteredSounds.length} âm)
            </h3>
            <span className="text-xs text-gray-400 font-semibold">
              Nhấp thẻ để xem khẩu hình chi tiết
            </span>
          </div>

          {filteredSounds.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border-2 border-dashed border-gray-200">
              <span className="text-4xl">🔍</span>
              <p className="font-bold text-gray-600 text-sm mt-2">
                Không tìm thấy âm nào khớp với &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                onClick={() => { setSearchQuery(''); setFilterType('all'); }}
                className="mt-3 px-4 py-2 rounded-xl bg-orange-100 text-orange-700 font-bold text-xs hover:bg-orange-200 transition-colors"
              >
                Xem toàn bộ 44 âm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {filteredSounds.map((sound, idx) => {
                const meta = IPA_TYPE_METAS[sound.type];

                return (
                  <motion.div
                    key={sound.ipa}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedSound(sound)}
                    className="bg-white rounded-3xl p-3.5 border-2 border-orange-100 shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between text-left"
                    style={{ boxShadow: '0 4px 14px rgba(249,115,22,0.06)' }}
                  >
                    {/* Top Type Tag */}
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${meta.bgSoft}`}>
                        {meta.label.replace('Phụ âm ', '').replace('Nguyên âm ', '')}
                      </span>
                      <span className="text-lg drop-shadow-xs select-none">
                        {sound.emoji}
                      </span>
                    </div>

                    {/* Big IPA Symbol */}
                    <div className="my-1.5">
                      <div className="font-black text-3xl sm:text-4xl text-gray-900 tracking-wide font-sans">
                        {sound.display}
                      </div>
                      <div className="font-bold text-xs text-orange-600 line-clamp-1 mt-0.5">
                        {sound.name_vi}
                      </div>
                    </div>

                    {/* Sample Word Pill & Audio Buttons */}
                    <div className="pt-2 border-t border-gray-100 mt-1 flex items-center justify-between">
                      <div className="min-w-0 pr-1">
                        <span className="text-[10px] text-gray-400 font-bold block">Từ mẫu:</span>
                        <strong className="text-xs text-gray-800 font-black truncate block">
                          {sound.sample_word}
                        </strong>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleQuickPlaySound(sound, e)}
                          className="w-7 h-7 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                          title="Nghe âm này"
                        >
                          🔊
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleQuickPlayWord(sound, e)}
                          className="w-7 h-7 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                          title="Nghe từ mẫu"
                        >
                          🎧
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── EDUCATIONAL GUIDE SECTION ── */}
        <div className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-sm space-y-4">
          <h3 className="font-black text-base text-gray-800 flex items-center gap-2">
            <span>💡</span> 2 Bí Kíp Vàng Khi Đọc Phiên Âm IPA
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Bí kíp 1: Trọng âm */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-rose-600 bg-white px-2 py-0.5 rounded-lg border border-rose-200 shadow-2xs">
                  ˈ
                </span>
                <h4 className="font-black text-rose-900 text-sm">
                  1. Dấu Trọng Âm Chính (ˈ)
                </h4>
              </div>
              <p className="text-rose-950 font-medium leading-relaxed">
                Khi thấy dấu phẩy trên cao <strong>ˈ</strong>, âm tiết đứng <strong>ngay sau nó</strong> sẽ được đọc:
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-rose-900 font-bold">
                <li>TO hơn âm bình thường</li>
                <li>CAO giọng hơn (như có dấu sắc nhẹ)</li>
                <li>NGÂN DÀI hơn các âm còn lại</li>
              </ul>
              <p className="text-rose-800 text-[11px] italic">
                Ví dụ: <strong>/ˈsɪti/</strong> → nhấn mạnh chữ <strong>SÍT</strong>, hạ nhẹ chữ <strong>tì</strong>.
              </p>
            </div>

            {/* Bí kíp 2: Vô thanh vs Hữu thanh */}
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🖐️</span>
                <h4 className="font-black text-sky-900 text-sm">
                  2. Thí Nghiệm Đặt Tay Lên Cổ Họng
                </h4>
              </div>
              <p className="text-sky-950 font-medium leading-relaxed">
                Bé hãy đặt 2 ngón tay nhẹ lên cổ họng khi phát âm:
              </p>
              <div className="space-y-1 text-sky-900 font-bold">
                <p>
                  💨 <strong>Âm Vô Thanh</strong> (/p/, /t/, /k/, /f/, /θ/, /s/, /ʃ/, /tʃ/, /h/): Cổ họng <u>KHÔNG RUNG</u>, chỉ có luồng gió bật ra làm mát lòng bàn tay.
                </p>
                <p>
                  🫁 <strong>Âm Hữu Thanh</strong> (/b/, /d/, /ɡ/, /v/, /ð/, /z/, /m/, /n/...): Cổ họng <u>RUNG MẠNH</u> rừ rừ như tiếng động cơ xe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── MODAL CHI TIẾT ÂM ── */}
      {selectedSound && (
        <IpaSoundDetailModal
          sound={selectedSound}
          onClose={() => setSelectedSound(null)}
        />
      )}
    </div>
  );
}
