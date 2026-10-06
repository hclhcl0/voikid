// =============================================
// VocaKids – Standard 44 IPA Phonemes Database
// Bộ 44 âm phiên âm quốc tế chuẩn IPA
// Song ngữ Anh - Việt dành cho trẻ em & tiểu học
// =============================================

export type IpaSoundType =
  | 'short_vowel'
  | 'long_vowel'
  | 'diphthong'
  | 'unvoiced_consonant'
  | 'voiced_consonant';

export interface IpaSound {
  ipa: string;                  // Ký hiệu IPA chuẩn (e.g. "æ", "iː", "θ", "ʃ")
  display: string;              // Hiển thị đẹp e.g. "/æ/"
  name_vi: string;              // Tên gọi gần gũi cho bé: e.g. "Âm A bẹt", "Âm TH thổi gió"
  type: IpaSoundType;
  typeName_vi: string;          // "Nguyên âm ngắn", "Phụ âm vô thanh"...
  mouth_action: string;         // Hành động vắn tắt: "Mở rộng hàm, khóe miệng cười"
  mouth_detail: {
    lips: string;               // Môi: "Chu tròn", "Thả lỏng", "Mở rộng"
    teeth: string;              // Răng: "Răng trên chạm môi dưới", "Khép nhẹ"
    tongue: string;             // Lưỡi: "Đầu lưỡi thè ra giữa 2 răng", "Hạ thấp lưỡi"
    voice_box: string;          // Thanh quản: "Không rung (vô thanh)", "Rung cổ (hữu thanh)"
  };
  vietnamese_tip: string;       // So sánh tiếng Việt: "Giống âm e nhưng há miệng to như chữ a"
  sample_word: string;          // Từ mẫu tiếng Anh: "cat"
  sample_word_vi: string;       // Nghĩa từ mẫu: "Con mèo"
  sample_word_ipa: string;      // Phiên âm từ mẫu: "/kæt/"
  sample_highlight: string;     // Phần chữ cái tạo nên âm: "a"
  emoji: string;                // Emoji từ mẫu: "🐱"
  speech_cue: string;           // Cụm từ để SpeechSynthesis phát âm rõ nhất
  color: string;                // Màu chủ đạo Tailwind badge
}

export const IPA_TYPE_METAS: Record<IpaSoundType, { label: string; count: number; badgeColor: string; bgSoft: string }> = {
  short_vowel: {
    label: 'Nguyên âm ngắn',
    count: 7,
    badgeColor: 'bg-amber-500 text-white',
    bgSoft: 'bg-amber-50 border-amber-200 text-amber-800',
  },
  long_vowel: {
    label: 'Nguyên âm dài',
    count: 5,
    badgeColor: 'bg-rose-500 text-white',
    bgSoft: 'bg-rose-50 border-rose-200 text-rose-800',
  },
  diphthong: {
    label: 'Nguyên âm đôi',
    count: 8,
    badgeColor: 'bg-purple-500 text-white',
    bgSoft: 'bg-purple-50 border-purple-200 text-purple-800',
  },
  unvoiced_consonant: {
    label: 'Phụ âm vô thanh',
    count: 9,
    badgeColor: 'bg-sky-500 text-white',
    bgSoft: 'bg-sky-50 border-sky-200 text-sky-800',
  },
  voiced_consonant: {
    label: 'Phụ âm hữu thanh (Rung cổ)',
    count: 15,
    badgeColor: 'bg-emerald-500 text-white',
    bgSoft: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  },
};

export const ALL_44_IPA_SOUNDS: IpaSound[] = [
  // ── 1. NGUYÊN ÂM NGẮN (7 âm) ────────────────────────────────────────────────
  {
    ipa: 'ɪ',
    display: '/ɪ/',
    name_vi: 'Âm I ngắn (Dứt khoát)',
    type: 'short_vowel',
    typeName_vi: 'Nguyên âm ngắn',
    mouth_action: 'Môi hơi hé, lưỡi thả lỏng, nghe mẫu rồi đọc ngắn gọn',
    mouth_detail: {
      lips: 'Môi hơi hé mở tự nhiên, không căng môi.',
      teeth: 'Hai hàm răng cách nhau một khoảng nhỏ.',
      tongue: 'Nâng phần trước lưỡi lên gần vòm miệng.',
      voice_box: 'Dây thanh quản rung, phát âm dứt khoát.',
    },
    vietnamese_tip: 'Lai giữa chữ "i" và "ê" trong tiếng Việt. Đọc nhanh và dứt khoát hơn chữ "i" tiếng Việt.',
    sample_word: 'fish',
    sample_word_vi: 'Con cá',
    sample_word_ipa: '/fɪʃ/',
    sample_highlight: 'i',
    emoji: '🐟',
    speech_cue: 'fish',
    color: 'from-amber-400 to-orange-500',
  },
  {
    ipa: 'e',
    display: '/e/',
    name_vi: 'Âm E ngắn',
    type: 'short_vowel',
    typeName_vi: 'Nguyên âm ngắn',
    mouth_action: 'Miệng mở vừa phải, lưỡi hạ thấp',
    mouth_detail: {
      lips: 'Khóe môi mở rộng hơn âm /ɪ/ một chút.',
      teeth: 'Hai hàm răng mở rộng vừa phải.',
      tongue: 'Đầu lưỡi chạm nhẹ vào chân răng cửa dưới.',
      voice_box: 'Thanh quản rung, dứt khoát.',
    },
    vietnamese_tip: 'Giống chữ "e" tiếng Việt trong từ "mẹ", nhưng đọc dứt khoát và ngắn gọn.',
    sample_word: 'pen',
    sample_word_vi: 'Cái bút mực',
    sample_word_ipa: '/pen/',
    sample_highlight: 'e',
    emoji: '🖊️',
    speech_cue: 'pen',
    color: 'from-amber-400 to-orange-500',
  },
  {
    ipa: 'æ',
    display: '/æ/',
    name_vi: 'Âm A bẹt (Cực kỳ quan trọng)',
    type: 'short_vowel',
    typeName_vi: 'Nguyên âm ngắn',
    mouth_action: 'Mở hàm thoải mái, khóe môi hơi kéo sang hai bên',
    mouth_detail: {
      lips: 'Môi mở tự nhiên, không chu tròn, không cần kéo căng.',
      teeth: 'Răng mở rộng thoải mái.',
      tongue: 'Lưỡi hạ thấp xuống đáy khoang miệng, đầu lưỡi chạm răng dưới.',
      voice_box: 'Thanh quản rung, âm vang to rõ.',
    },
    vietnamese_tip: 'Bé mở to miệng như chuẩn bị nói chữ "A", nhưng phát ra luồng hơi nghe như lai giữa "A" và "E".',
    sample_word: 'cat',
    sample_word_vi: 'Con mèo',
    sample_word_ipa: '/kæt/',
    sample_highlight: 'a',
    emoji: '🐱',
    speech_cue: 'cat',
    color: 'from-amber-400 to-orange-500',
  },
  {
    ipa: 'ʌ',
    display: '/ʌ/',
    name_vi: 'Âm Á ngắn',
    type: 'short_vowel',
    typeName_vi: 'Nguyên âm ngắn',
    mouth_action: 'Miệng hé nửa, thả lỏng toàn bộ cơ mặt',
    mouth_detail: {
      lips: 'Môi hơi hé, hoàn toàn thư giãn.',
      teeth: 'Răng mở nhẹ.',
      tongue: 'Lưỡi nâng nhẹ ở phần giữa, hạ thấp đầu lưỡi.',
      voice_box: 'Thanh quản rung, âm bật lên ngắn gọn.',
    },
    vietnamese_tip: 'Gần giống chữ "Ă" hoặc "Â" trong tiếng Việt nhưng bật ra nhanh và dứt khoát.',
    sample_word: 'cup',
    sample_word_vi: 'Cái cốc / tách',
    sample_word_ipa: '/kʌp/',
    sample_highlight: 'u',
    emoji: '☕',
    speech_cue: 'cup',
    color: 'from-amber-400 to-orange-500',
  },
  {
    ipa: 'ɒ',
    display: '/ɒ/',
    name_vi: 'Âm O ngắn',
    type: 'short_vowel',
    typeName_vi: 'Nguyên âm ngắn',
    mouth_action: 'Môi hơi tròn, hàm dưới hạ xuống',
    mouth_detail: {
      lips: 'Môi hơi tròn nhẹ, không chu ra phía trước.',
      teeth: 'Khoảng cách giữa hai hàm răng mở rộng.',
      tongue: 'Lưỡi hạ thấp xuống đáy miệng, hơi rụt về phía sau.',
      voice_box: 'Thanh quản rung, âm dứt khoát.',
    },
    vietnamese_tip: 'Giống chữ "O" tiếng Việt nhưng phát âm nhanh và dứt khoát, không kéo dài.',
    sample_word: 'dog',
    sample_word_vi: 'Con chó',
    sample_word_ipa: '/dɒɡ/',
    sample_highlight: 'o',
    emoji: '🐶',
    speech_cue: 'dog',
    color: 'from-amber-400 to-orange-500',
  },
  {
    ipa: 'ʊ',
    display: '/ʊ/',
    name_vi: 'Âm U ngắn',
    type: 'short_vowel',
    typeName_vi: 'Nguyên âm ngắn',
    mouth_action: 'Môi tròn nhẹ, dứt khoát',
    mouth_detail: {
      lips: 'Môi hơi tròn và đưa nhẹ về phía trước.',
      teeth: 'Hai hàm răng cách nhau một khoảng nhỏ.',
      tongue: 'Phần sau lưỡi nâng lên gần ngạc mềm.',
      voice_box: 'Thanh quản rung, đọc dứt khoát.',
    },
    vietnamese_tip: 'Lai giữa chữ "U" và "Ư" tiếng Việt. Không chu môi quá mức như âm "u dài".',
    sample_word: 'book',
    sample_word_vi: 'Quyển sách',
    sample_word_ipa: '/bʊk/',
    sample_highlight: 'oo',
    emoji: '📖',
    speech_cue: 'book',
    color: 'from-amber-400 to-orange-500',
  },
  {
    ipa: 'ə',
    display: '/ə/',
    name_vi: 'Âm Ơ nhẹ (Schwa - Phổ biến nhất)',
    type: 'short_vowel',
    typeName_vi: 'Nguyên âm ngắn',
    mouth_action: 'Thả lỏng toàn bộ miệng, phát âm thật nhẹ',
    mouth_detail: {
      lips: 'Môi hé mở tự nhiên, không gồng cơ.',
      teeth: 'Hàm răng thả lỏng hoàn toàn.',
      tongue: 'Lưỡi nằm thư giãn ở giữa miệng.',
      voice_box: 'Thanh quản rung nhẹ, âm lướt nhanh.',
    },
    vietnamese_tip: 'Giống chữ "Ơ" tiếng Việt nhưng đọc rất nhẹ và lướt qua, thường gặp ở âm không có trọng âm.',
    sample_word: 'banana',
    sample_word_vi: 'Quả chuối',
    sample_word_ipa: '/bəˈnɑːnə/',
    sample_highlight: 'a',
    emoji: '🍌',
    speech_cue: 'banana',
    color: 'from-amber-400 to-orange-500',
  },

  // ── 2. NGUYÊN ÂM DÀI (5 âm - có dấu :) ───────────────────────────────────────
  {
    ipa: 'iː',
    display: '/iː/',
    name_vi: 'Âm I dài (Cười mỉm)',
    type: 'long_vowel',
    typeName_vi: 'Nguyên âm dài',
    mouth_action: 'Môi hơi kéo sang hai bên, nghe mẫu rồi ngân âm nhẹ',
    mouth_detail: {
      lips: 'Khóe môi kéo căng sang hai bên như bé đang cười tươi chụp ảnh.',
      teeth: 'Hai hàm răng gần như khép lại.',
      tongue: 'Mặt lưỡi nâng cao áp sát vòm miệng trên.',
      voice_box: 'Thanh quản rung, ngân dài đều hơi: "i...".',
    },
    vietnamese_tip: 'Kéo dài khóe miệng như bé đang cười tươi "say cheese!" và ngân dài âm "i...".',
    sample_word: 'sheep',
    sample_word_vi: 'Con cừu',
    sample_word_ipa: '/ʃiːp/',
    sample_highlight: 'ee',
    emoji: '🐑',
    speech_cue: 'sheep',
    color: 'from-rose-500 to-pink-600',
  },
  {
    ipa: 'uː',
    display: '/uː/',
    name_vi: 'Âm U dài (Chu mỏ tròn)',
    type: 'long_vowel',
    typeName_vi: 'Nguyên âm dài',
    mouth_action: 'Chu tròn môi như huýt sáo, ngân dài',
    mouth_detail: {
      lips: 'Môi chu tròn nhỏ tối đa về phía trước như đang huýt sáo.',
      teeth: 'Hai hàm răng cách nhau một khoảng nhỏ.',
      tongue: 'Phần cuống lưỡi nâng cao về phía sau họng.',
      voice_box: 'Thanh quản rung, kéo dài hơi: "u...".',
    },
    vietnamese_tip: 'Bé chu môi tròn như đang thổi nến sinh nhật và ngân dài chữ "U...".',
    sample_word: 'moon',
    sample_word_vi: 'Mặt trăng',
    sample_word_ipa: '/muːn/',
    sample_highlight: 'oo',
    emoji: '🌕',
    speech_cue: 'moon',
    color: 'from-rose-500 to-pink-600',
  },
  {
    ipa: 'ɑː',
    display: '/ɑː/',
    name_vi: 'Âm A dài (Trầm sâu)',
    type: 'long_vowel',
    typeName_vi: 'Nguyên âm dài',
    mouth_action: 'Hạ hàm thoải mái, lưỡi thấp, phát âm nhẹ và rõ',
    mouth_detail: {
      lips: 'Mở rộng theo chiều dọc, thả lỏng sang ngang.',
      teeth: 'Hai hàm răng cách xa nhau.',
      tongue: 'Lưỡi đè thấp sát đáy miệng.',
      voice_box: 'Thanh quản rung sâu, ngân dài âm "a...".',
    },
    vietnamese_tip: 'Như khi bác sĩ bảo bé "Há miệng ra và nói Aaa...", âm phát ra trầm sâu và ngân dài.',
    sample_word: 'car',
    sample_word_vi: 'Xe ô tô',
    sample_word_ipa: '/kɑːr/',
    sample_highlight: 'ar',
    emoji: '🚗',
    speech_cue: 'car',
    color: 'from-rose-500 to-pink-600',
  },
  {
    ipa: 'ɔː',
    display: '/ɔː/',
    name_vi: 'Âm O dài (Tròn sâu)',
    type: 'long_vowel',
    typeName_vi: 'Nguyên âm dài',
    mouth_action: 'Miệng tròn sâu, ngân dài chữ O',
    mouth_detail: {
      lips: 'Môi tròn đều và hơi đưa ra trước.',
      teeth: 'Hàm dưới hạ thấp vừa phải.',
      tongue: 'Gốc lưỡi kéo về phía sau.',
      voice_box: 'Thanh quản rung, ngân dài âm "o...".',
    },
    vietnamese_tip: 'Giống chữ "O" tiếng Việt nhưng môi tròn sâu hơn và ngân dài hơi hơn.',
    sample_word: 'door',
    sample_word_vi: 'Cửa ra vào',
    sample_word_ipa: '/dɔːr/',
    sample_highlight: 'oor',
    emoji: '🚪',
    speech_cue: 'door',
    color: 'from-rose-500 to-pink-600',
  },
  {
    ipa: 'ɜː',
    display: '/ɜː/',
    name_vi: 'Âm Ơ dài (Cong lưỡi)',
    type: 'long_vowel',
    typeName_vi: 'Nguyên âm dài',
    mouth_action: 'Môi hơi hé, cong nhẹ đầu lưỡi ngân dài',
    mouth_detail: {
      lips: 'Môi mở tự nhiên, hơi dẹt.',
      teeth: 'Hai hàm hé nhẹ.',
      tongue: 'Đầu lưỡi hơi cong lên về phía vòm họng.',
      voice_box: 'Thanh quản rung, âm ngân dài sâu từ cổ họng.',
    },
    vietnamese_tip: 'Giống chữ "Ơ" tiếng Việt nhưng kéo dài hơn, nếu đọc giọng Mỹ có thể uốn nhẹ đầu lưỡi.',
    sample_word: 'bird',
    sample_word_vi: 'Con chim',
    sample_word_ipa: '/bɜːrd/',
    sample_highlight: 'ir',
    emoji: '🐦',
    speech_cue: 'bird',
    color: 'from-rose-500 to-pink-600',
  },

  // ── 3. NGUYÊN ÂM ĐÔI (8 âm - lướt từ âm trước sang âm sau) ─────────────────
  {
    ipa: 'eɪ',
    display: '/eɪ/',
    name_vi: 'Âm ÉI (Lướt e sang i)',
    type: 'diphthong',
    typeName_vi: 'Nguyên âm đôi',
    mouth_action: 'Mở miệng chữ E rồi khép dần mỉm cười sang chữ I',
    mouth_detail: {
      lips: 'Bắt đầu từ âm /e/ mở vừa, sau đó trượt sang /ɪ/ mỉm cười.',
      teeth: 'Khép dần hàm lại.',
      tongue: 'Lưỡi trượt nâng lên cao dần.',
      voice_box: 'Thanh quản rung liên tục trong suốt quá trình lướt.',
    },
    vietnamese_tip: 'Gần giống vần "ÂY" hoặc "Ê-I" tiếng Việt nhưng phát âm mượt mà hơn.',
    sample_word: 'cake',
    sample_word_vi: 'Bánh ngọt',
    sample_word_ipa: '/keɪk/',
    sample_highlight: 'a_e',
    emoji: '🍰',
    speech_cue: 'cake',
    color: 'from-purple-500 to-violet-600',
  },
  {
    ipa: 'aɪ',
    display: '/aɪ/',
    name_vi: 'Âm AI (Lướt a sang i)',
    type: 'diphthong',
    typeName_vi: 'Nguyên âm đôi',
    mouth_action: 'Mở rộng chữ A rồi trượt mỉm cười sang chữ I',
    mouth_detail: {
      lips: 'Mở rộng như /a/, sau đó khép lại thành nụ cười như /ɪ/.',
      teeth: 'Răng mở rộng rồi khép dần.',
      tongue: 'Lưỡi hạ thấp rồi nâng cao dần.',
      voice_box: 'Thanh quản rung liên tục.',
    },
    vietnamese_tip: 'Giống vần "AI" tiếng Việt nhưng âm "a" ban đầu mở rộng miệng hơn.',
    sample_word: 'kite',
    sample_word_vi: 'Cái diều',
    sample_word_ipa: '/kaɪt/',
    sample_highlight: 'i_e',
    emoji: '🪁',
    speech_cue: 'kite',
    color: 'from-purple-500 to-violet-600',
  },
  {
    ipa: 'ɔɪ',
    display: '/ɔɪ/',
    name_vi: 'Âm OI (Lướt o sang i)',
    type: 'diphthong',
    typeName_vi: 'Nguyên âm đôi',
    mouth_action: 'Môi tròn chữ O rồi mỉm cười sang chữ I',
    mouth_detail: {
      lips: 'Môi tròn như /ɔː/, sau đó nhếch môi sang hai bên sang /ɪ/.',
      teeth: 'Hàm dưới nâng lên dần.',
      tongue: 'Gốc lưỡi thấp rồi đẩy trượt lên phía trước.',
      voice_box: 'Thanh quản rung đều.',
    },
    vietnamese_tip: 'Giống vần "OI" tiếng Việt trong từ "cái còi", "chơi vơi".',
    sample_word: 'toy',
    sample_word_vi: 'Đồ chơi',
    sample_word_ipa: '/tɔɪ/',
    sample_highlight: 'oy',
    emoji: '🧸',
    speech_cue: 'toy',
    color: 'from-purple-500 to-violet-600',
  },
  {
    ipa: 'aʊ',
    display: '/aʊ/',
    name_vi: 'Âm AO (Lướt a sang u)',
    type: 'diphthong',
    typeName_vi: 'Nguyên âm đôi',
    mouth_action: 'Mở rộng chữ A rồi chu môi lại thành chữ U',
    mouth_detail: {
      lips: 'Bắt đầu mở rộng hết cỡ như /a/, sau đó thu tròn môi lại thành /ʊ/.',
      teeth: 'Hàm mở rộng rồi khép lại.',
      tongue: 'Lưỡi hạ thấp rồi nâng lên về phía sau.',
      voice_box: 'Thanh quản rung đều.',
    },
    vietnamese_tip: 'Giống vần "AO" tiếng Việt trong từ "ngôi sao", "chào bạn".',
    sample_word: 'cow',
    sample_word_vi: 'Con bò sữa',
    sample_word_ipa: '/kaʊ/',
    sample_highlight: 'ow',
    emoji: '🐄',
    speech_cue: 'cow',
    color: 'from-purple-500 to-violet-600',
  },
  {
    ipa: 'əʊ',
    display: '/əʊ/',
    name_vi: 'Âm ÔU (Lướt ơ sang u)',
    type: 'diphthong',
    typeName_vi: 'Nguyên âm đôi',
    mouth_action: 'Môi mở tự nhiên chữ Ơ rồi chu tròn lại sang chữ U',
    mouth_detail: {
      lips: 'Bắt đầu từ âm /ə/ thả lỏng, sau đó chu tròn môi sang /ʊ/.',
      teeth: 'Khép nhẹ hai hàm.',
      tongue: 'Lưỡi hơi rụt về phía sau.',
      voice_box: 'Thanh quản rung đều.',
    },
    vietnamese_tip: 'Gần giống vần "ÂU" hoặc "Ô" trong tiếng Việt nhưng có độ trượt mượt mà.',
    sample_word: 'boat',
    sample_word_vi: 'Chiếc thuyền',
    sample_word_ipa: '/bəʊt/',
    sample_highlight: 'oa',
    emoji: '⛵',
    speech_cue: 'boat',
    color: 'from-purple-500 to-violet-600',
  },
  {
    ipa: 'ɪə',
    display: '/ɪə/',
    name_vi: 'Âm I-Ơ (Lướt i sang ơ)',
    type: 'diphthong',
    typeName_vi: 'Nguyên âm đôi',
    mouth_action: 'Mỉm cười chữ I rồi thả lỏng sang chữ Ơ',
    mouth_detail: {
      lips: 'Môi hơi dẹt sang hai bên, sau đó thả lỏng dần.',
      teeth: 'Răng mở rộng dần ra.',
      tongue: 'Lưỡi hạ thấp dần về giữa khoang miệng.',
      voice_box: 'Thanh quản rung.',
    },
    vietnamese_tip: 'Gần giống vần "IA" tiếng Việt trong từ "cái thìa", "bông mía".',
    sample_word: 'ear',
    sample_word_vi: 'Cái tai',
    sample_word_ipa: '/ɪər/',
    sample_highlight: 'ear',
    emoji: '👂',
    speech_cue: 'ear',
    color: 'from-purple-500 to-violet-600',
  },
  {
    ipa: 'eə',
    display: '/eə/',
    name_vi: 'Âm E-Ơ (Lướt e sang ơ)',
    type: 'diphthong',
    typeName_vi: 'Nguyên âm đôi',
    mouth_action: 'Mở chữ E rồi lướt nhẹ sang chữ Ơ',
    mouth_detail: {
      lips: 'Môi mở vừa phải rồi hơi khép thả lỏng.',
      teeth: 'Hàm răng mở tự nhiên.',
      tongue: 'Lưỡi từ vị trí /e/ lùi nhẹ về vị trí /ə/.',
      voice_box: 'Thanh quản rung.',
    },
    vietnamese_tip: 'Giống như bé nói "E-Ơ" nối liền nhau thật nhanh.',
    sample_word: 'bear',
    sample_word_vi: 'Con gấu',
    sample_word_ipa: '/beər/',
    sample_highlight: 'ear',
    emoji: '🐻',
    speech_cue: 'bear',
    color: 'from-purple-500 to-violet-600',
  },
  {
    ipa: 'ʊə',
    display: '/ʊə/',
    name_vi: 'Âm U-Ơ (Lướt u sang ơ)',
    type: 'diphthong',
    typeName_vi: 'Nguyên âm đôi',
    mouth_action: 'Môi chu chữ U rồi thả lỏng sang chữ Ơ',
    mouth_detail: {
      lips: 'Môi hơi tròn như /ʊ/ rồi mở thả lỏng dần sang /ə/.',
      teeth: 'Khoảng cách giữa hai hàm răng mở rộng dần.',
      tongue: 'Lưỡi từ sau tiến dần về phía trước.',
      voice_box: 'Thanh quản rung.',
    },
    vietnamese_tip: 'Giống vần "UA" tiếng Việt trong từ "con rùa", "mùa hè".',
    sample_word: 'tour',
    sample_word_vi: 'Chuyến du lịch',
    sample_word_ipa: '/tʊər/',
    sample_highlight: 'our',
    emoji: '🚌',
    speech_cue: 'tour',
    color: 'from-purple-500 to-violet-600',
  },

  // ── 4. PHỤ ÂM VÔ THANH (9 âm - bật hơi, cổ họng KHÔNG rung) ────────────────
  {
    ipa: 'p',
    display: '/p/',
    name_vi: 'Âm P (Bật hơi đôi môi)',
    type: 'unvoiced_consonant',
    typeName_vi: 'Phụ âm vô thanh',
    mouth_action: 'Khép hai môi, rồi mở môi để luồng hơi bật ra nhẹ',
    mouth_detail: {
      lips: 'Mím chặt hai môi lại để chặn luồng hơi.',
      teeth: 'Răng mở tự nhiên sau môi.',
      tongue: 'Lưỡi nằm thả lỏng dưới đáy miệng.',
      voice_box: 'KHÔNG RUNG. Đặt tay lên cổ họng sẽ không thấy rung, chỉ thấy gió phì ra.',
    },
    vietnamese_tip: 'Bé mím môi rồi bật hơi thật mạnh như tiếng bong bóng nổ "póc!". Cổ họng không rung.',
    sample_word: 'pig',
    sample_word_vi: 'Con heo / lợn',
    sample_word_ipa: '/pɪɡ/',
    sample_highlight: 'p',
    emoji: '🐷',
    speech_cue: 'pig',
    color: 'from-sky-400 to-blue-500',
  },
  {
    ipa: 't',
    display: '/t/',
    name_vi: 'Âm T (Đầu lưỡi bật hơi)',
    type: 'unvoiced_consonant',
    typeName_vi: 'Phụ âm vô thanh',
    mouth_action: 'Đầu lưỡi chạm nướu sau răng trên, rồi thả ra theo mẫu',
    mouth_detail: {
      lips: 'Môi hơi mở tự nhiên.',
      teeth: 'Hai hàm răng hơi hé.',
      tongue: 'Đầu lưỡi ấn chặt vào chân răng trên rồi giật nhanh xuống bật hơi.',
      voice_box: 'KHÔNG RUNG. Chỉ nghe thấy tiếng gió bật "t!".',
    },
    vietnamese_tip: 'Khác với chữ "T" tiếng Việt, âm /t/ tiếng Anh có luồng gió bật ra rất mạnh và dứt khoát.',
    sample_word: 'tiger',
    sample_word_vi: 'Con hổ',
    sample_word_ipa: '/ˈtaɪɡər/',
    sample_highlight: 't',
    emoji: '🐯',
    speech_cue: 'tiger',
    color: 'from-sky-400 to-blue-500',
  },
  {
    ipa: 'k',
    display: '/k/',
    name_vi: 'Âm K (Cuống họng bật hơi)',
    type: 'unvoiced_consonant',
    typeName_vi: 'Phụ âm vô thanh',
    mouth_action: 'Cuống lưỡi nâng chặn vòm họng rồi bật hơi ra',
    mouth_detail: {
      lips: 'Môi mở tự nhiên.',
      teeth: 'Hai hàm răng hơi cách xa nhau.',
      tongue: 'Phần cuống lưỡi nâng cao chạm vòm ngạc mềm rồi hạ nhanh bật hơi.',
      voice_box: 'KHÔNG RUNG. Chỉ có luồng hơi khạc nhẹ bật ra.',
    },
    vietnamese_tip: 'Giống âm khạc nhẹ của chữ "C/K" nhưng chỉ bật hơi gió ra, không rung dây thanh quản.',
    sample_word: 'cat',
    sample_word_vi: 'Con mèo',
    sample_word_ipa: '/kæt/',
    sample_highlight: 'c',
    emoji: '🐱',
    speech_cue: 'cat',
    color: 'from-sky-400 to-blue-500',
  },
  {
    ipa: 'f',
    display: '/f/',
    name_vi: 'Âm F (Răng trên chạm môi dưới)',
    type: 'unvoiced_consonant',
    typeName_vi: 'Phụ âm vô thanh',
    mouth_action: 'Răng cửa trên chạm nhẹ môi dưới, thổi luồng gió ra',
    mouth_detail: {
      lips: 'Môi dưới hơi cong chạm nhẹ vào cạnh răng cửa trên.',
      teeth: 'Răng cửa trên lộ ra chạm mép môi dưới.',
      tongue: 'Lưỡi thả lỏng tự nhiên.',
      voice_box: 'KHÔNG RUNG. Thổi luồng hơi gió nhẹ qua kẽ răng.',
    },
    vietnamese_tip: 'Giống chữ "Ph" tiếng Việt trong "phở bò", nhưng răng trên chạm rõ vào môi dưới khi thổi hơi.',
    sample_word: 'fish',
    sample_word_vi: 'Con cá',
    sample_word_ipa: '/fɪʃ/',
    sample_highlight: 'f',
    emoji: '🐟',
    speech_cue: 'fish',
    color: 'from-sky-400 to-blue-500',
  },
  {
    ipa: 'θ',
    display: '/θ/',
    name_vi: 'Âm TH thổi gió (Vô thanh - Cực hay)',
    type: 'unvoiced_consonant',
    typeName_vi: 'Phụ âm vô thanh',
    mouth_action: 'Đặt đầu lưỡi giữa 2 hàm răng, thổi nhẹ hơi gió',
    mouth_detail: {
      lips: 'Môi mở tự nhiên để lộ đầu lưỡi.',
      teeth: 'Hai hàm răng khép nhẹ kẹp nhẹ đầu lưỡi ở giữa (không cắn đau nhé).',
      tongue: 'Đưa đầu lưỡi thò nhẹ ra ngoài giữa 2 hàm răng khoảng 2mm.',
      voice_box: 'KHÔNG RUNG CỔ HỌNG. Chỉ đẩy luồng hơi gió thoát ra qua kẽ răng và lưỡi.',
    },
    vietnamese_tip: 'Bé thè nhẹ đầu lưỡi ra giữa 2 hàm răng rồi thổi gió nhẹ ra như xì xì hơi. Rất dễ nếu làm đúng khẩu hình!',
    sample_word: 'three',
    sample_word_vi: 'Số 3',
    sample_word_ipa: '/θriː/',
    sample_highlight: 'th',
    emoji: '3️⃣',
    speech_cue: 'three',
    color: 'from-sky-400 to-blue-500',
  },
  {
    ipa: 's',
    display: '/s/',
    name_vi: 'Âm S (Xì hơi như rắn kêu)',
    type: 'unvoiced_consonant',
    typeName_vi: 'Phụ âm vô thanh',
    mouth_action: 'Hai hàm răng khép hờ, để hơi đi ra đều như tiếng rắn',
    mouth_detail: {
      lips: 'Khóe môi mở nhẹ sang hai bên.',
      teeth: 'Hai hàm răng khép sát nhau nhưng không cắn chặt.',
      tongue: 'Đầu lưỡi đặt gần chân răng cửa trên, tạo một rãnh nhỏ ở giữa.',
      voice_box: 'KHÔNG RUNG. Thổi luồng hơi gió xì dài: "sss...".',
    },
    vietnamese_tip: 'Bé bắt chước tiếng con rắn xì hơi "xì xì xì...", cổ họng hoàn toàn không rung.',
    sample_word: 'sun',
    sample_word_vi: 'Mặt trời',
    sample_word_ipa: '/sʌn/',
    sample_highlight: 's',
    emoji: '☀️',
    speech_cue: 'sun',
    color: 'from-sky-400 to-blue-500',
  },
  {
    ipa: 'ʃ',
    display: '/ʃ/',
    name_vi: 'Âm SH chu môi (Ra hiệu suỵt)',
    type: 'unvoiced_consonant',
    typeName_vi: 'Phụ âm vô thanh',
    mouth_action: 'Môi hơi chu về trước, để hơi đi ra đều như khi nói suỵt',
    mouth_detail: {
      lips: 'Hai môi chu tròn và nhô rõ ra phía trước.',
      teeth: 'Hai hàm răng khép hờ.',
      tongue: 'Đầu lưỡi nâng cong nhẹ lên gần vòm họng.',
      voice_box: 'KHÔNG RUNG. Thổi luồng hơi gió dày và mạnh: "shhh...".',
    },
    vietnamese_tip: 'Như khi bé đặt ngón tay lên môi và ra hiệu "Suỵt! Trật tự nào!", chu môi ra và thổi gió mạnh.',
    sample_word: 'shoe',
    sample_word_vi: 'Chiếc giày',
    sample_word_ipa: '/ʃuː/',
    sample_highlight: 'sh',
    emoji: '👟',
    speech_cue: 'shoe',
    color: 'from-sky-400 to-blue-500',
  },
  {
    ipa: 'tʃ',
    display: '/tʃ/',
    name_vi: 'Âm CH (Bật mạnh dứt khoát)',
    type: 'unvoiced_consonant',
    typeName_vi: 'Phụ âm vô thanh',
    mouth_action: 'Chu môi, đầu lưỡi bật mạnh luồng hơi',
    mouth_detail: {
      lips: 'Môi hơi chu tròn ra phía trước.',
      teeth: 'Hai hàm răng gần chạm nhau.',
      tongue: 'Đầu lưỡi chạm nướu trên chặn hơi như /t/, rồi giật lùi bật ra âm /ʃ/.',
      voice_box: 'KHÔNG RUNG. Âm bật nổ mạnh và dứt khoát "ch!".',
    },
    vietnamese_tip: 'Khác chữ "Ch" tiếng Việt, âm /tʃ/ tiếng Anh phải chu môi và bật hơi thật mạnh như tiếng "hắt xì".',
    sample_word: 'chair',
    sample_word_vi: 'Cái ghế',
    sample_word_ipa: '/tʃeər/',
    sample_highlight: 'ch',
    emoji: '🪑',
    speech_cue: 'chair',
    color: 'from-sky-400 to-blue-500',
  },
  {
    ipa: 'h',
    display: '/h/',
    name_vi: 'Âm H (Thở nhẹ nhàng)',
    type: 'unvoiced_consonant',
    typeName_vi: 'Phụ âm vô thanh',
    mouth_action: 'Mở miệng tự nhiên, thở hơi nhẹ từ cổ họng',
    mouth_detail: {
      lips: 'Môi mở theo nguyên âm đứng sau nó.',
      teeth: 'Răng mở tự nhiên.',
      tongue: 'Lưỡi thả lỏng.',
      voice_box: 'KHÔNG RUNG. Chỉ có luồng hơi ấm từ sâu cổ họng thở ra.',
    },
    vietnamese_tip: 'Như khi bé hà hơi ấm vào gương vào một ngày mùa đông lạnh giá.',
    sample_word: 'hat',
    sample_word_vi: 'Cái mũ / nón',
    sample_word_ipa: '/hæt/',
    sample_highlight: 'h',
    emoji: '🧢',
    speech_cue: 'hat',
    color: 'from-sky-400 to-blue-500',
  },

  // ── 5. PHỤ ÂM HỮU THANH (15 âm - cổ họng RUNG RÕ) ───────────────────────────
  {
    ipa: 'b',
    display: '/b/',
    name_vi: 'Âm B (Rung môi hữu thanh)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Mím môi rồi bật ra kèm rung cổ họng',
    mouth_detail: {
      lips: 'Khẩu hình y hệt âm /p/ (mím chặt 2 môi).',
      teeth: 'Răng mở sau môi.',
      tongue: 'Lưỡi thả lỏng.',
      voice_box: 'CỔ HỌNG RUNG MẠNH. Đặt tay lên cổ họng sẽ cảm nhận độ rung rõ rệt.',
    },
    vietnamese_tip: 'Khẩu hình giống âm /p/ nhưng bé phát ra tiếng rung cổ như chữ "Bờ" trong tiếng Việt.',
    sample_word: 'bear',
    sample_word_vi: 'Con gấu',
    sample_word_ipa: '/beər/',
    sample_highlight: 'b',
    emoji: '🐻',
    speech_cue: 'bear',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    ipa: 'd',
    display: '/d/',
    name_vi: 'Âm D (Rung lưỡi hữu thanh)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Đầu lưỡi chạm nướu trên bật ra kèm rung cổ',
    mouth_detail: {
      lips: 'Môi mở nhẹ tự nhiên.',
      teeth: 'Hàm răng hơi hé.',
      tongue: 'Khẩu hình y hệt âm /t/ (đầu lưỡi chạm chân răng trên).',
      voice_box: 'CỔ HỌNG RUNG MẠNH. Phát ra âm có tiếng "đờ".',
    },
    vietnamese_tip: 'Khẩu hình giống âm /t/ nhưng dây thanh quản rung mạnh tạo thành âm "đờ".',
    sample_word: 'duck',
    sample_word_vi: 'Con vịt',
    sample_word_ipa: '/dʌk/',
    sample_highlight: 'd',
    emoji: '🦆',
    speech_cue: 'duck',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    ipa: 'ɡ',
    display: '/ɡ/',
    name_vi: 'Âm G (Rung cuống họng)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Cuống lưỡi nâng chạm vòm họng kèm rung cổ',
    mouth_detail: {
      lips: 'Môi mở tự nhiên.',
      teeth: 'Hàm răng hé vừa phải.',
      tongue: 'Khẩu hình y hệt âm /k/ (cuống lưỡi chặn ngạc mềm).',
      voice_box: 'CỔ HỌNG RUNG MẠNH. Bật ra âm "gờ".',
    },
    vietnamese_tip: 'Khẩu hình giống âm /k/ nhưng cổ họng rung mạnh, giống chữ "G" trong "gà gô".',
    sample_word: 'goat',
    sample_word_vi: 'Con dê',
    sample_word_ipa: '/ɡoʊt/',
    sample_highlight: 'g',
    emoji: '🐐',
    speech_cue: 'goat',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    ipa: 'v',
    display: '/v/',
    name_vi: 'Âm V (Răng chạm môi rung cổ)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Răng trên chạm nhẹ môi dưới, để hơi ra và cảm nhận cổ họng rung',
    mouth_detail: {
      lips: 'Khẩu hình y hệt âm /f/ (răng cửa trên chạm nhẹ môi dưới).',
      teeth: 'Răng trên lộ chạm mép môi.',
      tongue: 'Lưỡi thả lỏng.',
      voice_box: 'CỔ HỌNG RUNG RẤT MẠNH. Cảm nhận môi dưới hơi tê tê rung rinh.',
    },
    vietnamese_tip: 'Bé để răng trên chạm môi dưới rồi rung cổ họng như tiếng xe ô tô đang nổ máy "vừn vừn".',
    sample_word: 'van',
    sample_word_vi: 'Xe tải nhỏ',
    sample_word_ipa: '/væn/',
    sample_highlight: 'v',
    emoji: '🚐',
    speech_cue: 'van',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    ipa: 'ð',
    display: '/ð/',
    name_vi: 'Âm TH rung cổ (Hữu thanh)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Đầu lưỡi đặt nhẹ giữa hai răng, để hơi ra và cảm nhận cổ họng rung',
    mouth_detail: {
      lips: 'Môi hé mở tự nhiên.',
      teeth: 'Hai hàm răng khép nhẹ kẹp đầu lưỡi ở giữa.',
      tongue: 'Khẩu hình y hệt âm /θ/ (thè đầu lưỡi ra giữa 2 răng khoảng 2mm).',
      voice_box: 'CỔ HỌNG RUNG MẠNH. Lưỡi sẽ cảm thấy hơi tê tê vì rung.',
    },
    vietnamese_tip: 'Khẩu hình giống hệt âm /θ/ thè lưỡi nhưng khác ở chỗ: bé RUNG CỔ HỌNG thật mạnh phát ra âm gần như chữ "D/Đ".',
    sample_word: 'this',
    sample_word_vi: 'Cái này / đây',
    sample_word_ipa: '/ðɪs/',
    sample_highlight: 'th',
    emoji: '👉',
    speech_cue: 'this',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    ipa: 'z',
    display: '/z/',
    name_vi: 'Âm Z (Rung như tiếng ong kêu)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Răng khép hờ, để hơi ra đều và cảm nhận cổ họng rung',
    mouth_detail: {
      lips: 'Môi mở nhẹ sang hai bên.',
      teeth: 'Khẩu hình y hệt âm /s/ (hai hàm răng khép sát nhau).',
      tongue: 'Đầu lưỡi gần chân răng trên.',
      voice_box: 'CỔ HỌNG RUNG MẠNH. Âm phát ra kêu vo ve "zzz...".',
    },
    vietnamese_tip: 'Bé bắt chước tiếng chú ong vàng chăm chỉ bay vo ve kêu "dzz dzz dzz...".',
    sample_word: 'zebra',
    sample_word_vi: 'Con ngựa vằn',
    sample_word_ipa: '/ˈzebrə/',
    sample_highlight: 'z',
    emoji: '🦓',
    speech_cue: 'zebra',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    ipa: 'ʒ',
    display: '/ʒ/',
    name_vi: 'Âm ZH chu môi (Rung hữu thanh)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Môi hơi chu như khi nói suỵt, thêm tiếng rung nhẹ ở cổ họng',
    mouth_detail: {
      lips: 'Khẩu hình y hệt âm /ʃ/ (hai môi chu tròn nhô ra phía trước).',
      teeth: 'Hai hàm răng khép hờ.',
      tongue: 'Đầu lưỡi nâng cong nhẹ lên gần vòm miệng.',
      voice_box: 'CỔ HỌNG RUNG MẠNH. Phát ra tiếng rung "dzy...".',
    },
    vietnamese_tip: 'Chu môi như âm "suỵt" nhưng rung cổ họng phát ra âm giống như "dzy" trong từ television.',
    sample_word: 'television',
    sample_word_vi: 'Ti vi',
    sample_word_ipa: '/ˈtelɪvɪʒn/',
    sample_highlight: 's',
    emoji: '📺',
    speech_cue: 'television',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    ipa: 'dʒ',
    display: '/dʒ/',
    name_vi: 'Âm J/G (Bật mạnh rung cổ)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Chu môi, bật mạnh âm kèm RUNG CỔ HỌNG',
    mouth_detail: {
      lips: 'Môi chu tròn ra phía trước.',
      teeth: 'Hai hàm răng khép gần nhau.',
      tongue: 'Khẩu hình y hệt âm /tʃ/ nhưng dây thanh quản RUNG.',
      voice_box: 'CỔ HỌNG RUNG MẠNH. Bật nổ mạnh và dứt khoát "gi!".',
    },
    vietnamese_tip: 'Giống âm bật mạnh của chữ "Gi/Tr" nhưng có chu môi và rung cổ họng rất rõ ràng.',
    sample_word: 'juice',
    sample_word_vi: 'Nước ép hoa quả',
    sample_word_ipa: '/dʒuːs/',
    sample_highlight: 'j',
    emoji: '🧃',
    speech_cue: 'juice',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    ipa: 'm',
    display: '/m/',
    name_vi: 'Âm M (Âm mũi ngậm môi)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Mím nhẹ hai môi, để âm vang và hơi thoát qua mũi',
    mouth_detail: {
      lips: 'Mím nhẹ hai môi lại với nhau.',
      teeth: 'Hai hàm răng hơi cách nhau.',
      tongue: 'Lưỡi thả lỏng dưới đáy miệng.',
      voice_box: 'CỔ HỌNG RUNG. Luồng hơi đi lên khoang mũi tạo âm ngân "m...".',
    },
    vietnamese_tip: 'Giống như khi bé ngửi thấy món ăn thơm ngon và kêu "Mmm ngon quá!", mím môi và rung giọng mũi.',
    sample_word: 'monkey',
    sample_word_vi: 'Con khỉ',
    sample_word_ipa: '/ˈmʌŋki/',
    sample_highlight: 'm',
    emoji: '🐒',
    speech_cue: 'monkey',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    ipa: 'n',
    display: '/n/',
    name_vi: 'Âm N (Âm mũi đầu lưỡi)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Đầu lưỡi chạm nướu trên, hơi thoát qua mũi',
    mouth_detail: {
      lips: 'Môi mở tự nhiên.',
      teeth: 'Răng hơi hé.',
      tongue: 'Đầu lưỡi áp chặt vào nướu răng trên chặn luồng hơi.',
      voice_box: 'CỔ HỌNG RUNG. Âm thanh thoát qua đường mũi "n...".',
    },
    vietnamese_tip: 'Giống chữ "N" tiếng Việt trong từ "nụ cười", nhưng giữ đầu lưỡi ở nướu trên lâu hơn một chút.',
    sample_word: 'nose',
    sample_word_vi: 'Cái mũi',
    sample_word_ipa: '/noʊz/',
    sample_highlight: 'n',
    emoji: '👃',
    speech_cue: 'nose',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    ipa: 'ŋ',
    display: '/ŋ/',
    name_vi: 'Âm NG (Âm mũi cuống lưỡi)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Cuống lưỡi nâng chặn ngạc mềm, hơi ra mũi',
    mouth_detail: {
      lips: 'Môi mở tự nhiên.',
      teeth: 'Hai hàm răng mở vừa phải.',
      tongue: 'Phần sau của lưỡi nâng cao chạm vòm ngạc mềm.',
      voice_box: 'CỔ HỌNG RUNG. Âm thanh ngân vang qua khoang mũi "ng...".',
    },
    vietnamese_tip: 'Giống âm đuôi "NG" tiếng Việt trong từ "vầng trăng", "tiếng hót".',
    sample_word: 'ring',
    sample_word_vi: 'Chiếc nhẫn',
    sample_word_ipa: '/rɪŋ/',
    sample_highlight: 'ng',
    emoji: '💍',
    speech_cue: 'ring',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    ipa: 'l',
    display: '/l/',
    name_vi: 'Âm L (Uốn đầu lưỡi)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Đầu lưỡi uốn chạm chân răng cửa trên',
    mouth_detail: {
      lips: 'Môi mở tự nhiên thả lỏng.',
      teeth: 'Hai hàm răng hơi hé.',
      tongue: 'Đầu lưỡi chạm chắc vào chân răng trên, hơi đi ra 2 bên mép lưỡi.',
      voice_box: 'CỔ HỌNG RUNG. Phát ra âm "lờ".',
    },
    vietnamese_tip: 'Giống chữ "L" tiếng Việt. Khi đứng cuối từ (như ball), đầu lưỡi vẫn giữ nguyên chạm nướu trên tạo âm "ồ".',
    sample_word: 'lion',
    sample_word_vi: 'Con sư tử',
    sample_word_ipa: '/ˈlaɪən/',
    sample_highlight: 'l',
    emoji: '🦁',
    speech_cue: 'lion',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    ipa: 'r',
    display: '/r/',
    name_vi: 'Âm R (Cong lưỡi không chạm vòm)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Môi hơi chu, lưỡi nâng nhẹ nhưng không chạm vòm miệng',
    mouth_detail: {
      lips: 'Hai môi hơi chu tròn nhẹ.',
      teeth: 'Hàm răng hơi hé.',
      tongue: 'Cong đầu lưỡi vào sâu trong họng nhưng TUYỆT ĐỐI KHÔNG CHẠM vòm miệng.',
      voice_box: 'CỔ HỌNG RUNG MẠNH.',
    },
    vietnamese_tip: 'Khác với chữ R tiếng Việt (không rung đánh lưỡi), âm R tiếng Anh chỉ cong lưỡi vào trong và giữ yên.',
    sample_word: 'rabbit',
    sample_word_vi: 'Con thỏ',
    sample_word_ipa: '/ˈræbɪt/',
    sample_highlight: 'r',
    emoji: '🐰',
    speech_cue: 'rabbit',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    ipa: 'w',
    display: '/w/',
    name_vi: 'Âm W (Chu môi mở nhanh)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Môi chu tròn nhỏ rồi bung mở nhanh',
    mouth_detail: {
      lips: 'Chu tròn nhỏ như /uː/, sau đó mở bung ra ngay lập tức.',
      teeth: 'Răng mở theo cử động môi.',
      tongue: 'Gốc lưỡi nâng cao rồi hạ xuống.',
      voice_box: 'CỔ HỌNG RUNG.',
    },
    vietnamese_tip: 'Giống như bé nói chữ "quờ" hoặc "u-ơ" lướt thật nhanh.',
    sample_word: 'water',
    sample_word_vi: 'Nước uống',
    sample_word_ipa: '/ˈwɔːtər/',
    sample_highlight: 'w',
    emoji: '💧',
    speech_cue: 'water',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    ipa: 'j',
    display: '/j/',
    name_vi: 'Âm Y/J (Thân lưỡi nâng cao)',
    type: 'voiced_consonant',
    typeName_vi: 'Phụ âm hữu thanh',
    mouth_action: 'Thân lưỡi nâng cao gần vòm miệng, lướt nhanh',
    mouth_detail: {
      lips: 'Khóe môi mở rộng nhẹ sang 2 bên.',
      teeth: 'Hàm răng hơi khép.',
      tongue: 'Thân trước của lưỡi nâng sát vòm họng trên rồi lướt sang âm kế tiếp.',
      voice_box: 'CỔ HỌNG RUNG.',
    },
    vietnamese_tip: 'Giống chữ "D/Gi" trong giọng miền Nam (như "dạ thưa", "da dẻ") lướt nhẹ nhàng.',
    sample_word: 'yellow',
    sample_word_vi: 'Màu vàng',
    sample_word_ipa: '/ˈjeloʊ/',
    sample_highlight: 'y',
    emoji: '🟡',
    speech_cue: 'yellow',
    color: 'from-emerald-400 to-teal-500',
  },
];

// Map tra cứu nhanh theo ký hiệu IPA
export const IPA_MAP: Record<string, IpaSound> = ALL_44_IPA_SOUNDS.reduce(
  (acc, sound) => {
    acc[sound.ipa] = sound;
    return acc;
  },
  {} as Record<string, IpaSound>
);

// Bổ sung các biến thể tương đương thường gặp trong từ điển SGK
IPA_MAP['g'] = IPA_MAP['ɡ'];
IPA_MAP['oʊ'] = IPA_MAP['əʊ'];
IPA_MAP['i'] = IPA_MAP['iː']; // Unstressed i mapped to iː family
IPA_MAP['u'] = IPA_MAP['uː'];

// ── BỘ GIẢI MÃ PHIÊN ÂM IPA CỦA TỪ (WORD IPA DECODER) ───────────────────────
export interface DecodedIpaToken {
  id: string;
  char: string;
  isStress: boolean;
  stressType?: 'primary' | 'secondary';
  sound?: IpaSound;
  description?: string;
}

/**
 * Tách và giải mã chuỗi phiên âm IPA của một từ vựng
 * Ví dụ: "/ˈsɪti/" -> [dấu trọng âm chính 'ˈ', âm 's', âm 'ɪ', âm 't', âm 'i']
 */
export function decodeWordIpa(phoneticStr: string): DecodedIpaToken[] {
  if (!phoneticStr) return [];

  // Làm sạch dấu ngoặc chéo và khoảng trắng thừa
  const clean = phoneticStr.replace(/^\/+|\/+$/g, '').trim();
  const tokens: DecodedIpaToken[] = [];

  // Danh sách các âm vị đa ký tự cần ưu tiên nhận diện trước
  const multiCharPhonemes = [
    'tʃ', 'dʒ', 'iː', 'uː', 'ɔː', 'ɑː', 'ɜː',
    'eɪ', 'aɪ', 'ɔɪ', 'əʊ', 'oʊ', 'aʊ', 'ɪə', 'eə', 'ʊə',
  ];

  let i = 0;

  while (i < clean.length) {
    const char = clean[i];

    // 1. Dấu trọng âm chính ˈ
    if (char === 'ˈ' || char === "'") {
      tokens.push({
        id: `stress_pri_${i}`,
        char: 'ˈ',
        isStress: true,
        stressType: 'primary',
        description: 'Dấu trọng âm chính: Âm tiết đứng ngay sau đọc TO hơn, CAO hơn và NGÂN DÀI hơn!',
      });
      i++;
      continue;
    }

    // 2. Dấu trọng âm phụ ˌ
    if (char === 'ˌ' || char === ',') {
      tokens.push({
        id: `stress_sec_${i}`,
        char: 'ˌ',
        isStress: true,
        stressType: 'secondary',
        description: 'Dấu trọng âm phụ: Nhấn nhẹ hơn trọng âm chính nhưng rõ hơn các âm khác.',
      });
      i++;
      continue;
    }

    // 3. Khoảng trắng giữa các từ (trong cụm từ)
    if (char === ' ') {
      tokens.push({
        id: `space_${i}`,
        char: ' ',
        isStress: false,
        description: 'Khoảng cách giữa các từ',
      });
      i++;
      continue;
    }

    // 4. Dấu gạch nối hoặc ký tự nối
    if (char === '-' || char === '.') {
      i++;
      continue;
    }

    // 5. Kiểm tra âm vị đa ký tự (2-3 ký tự)
    let matchedMulti: string | null = null;
    for (const multi of multiCharPhonemes) {
      if (clean.startsWith(multi, i)) {
        matchedMulti = multi;
        break;
      }
    }

    if (matchedMulti) {
      const sound = IPA_MAP[matchedMulti];
      tokens.push({
        id: `sound_${matchedMulti}_${i}`,
        char: matchedMulti,
        isStress: false,
        sound,
        description: sound?.name_vi,
      });
      i += matchedMulti.length;
      continue;
    }

    // 6. Kiểm tra âm vị đơn ký tự
    const sound = IPA_MAP[char];
    tokens.push({
      id: `sound_${char}_${i}`,
      char,
      isStress: false,
      sound,
      description: sound?.name_vi || `Ký hiệu /${char}/`,
    });
    i++;
  }

  return tokens;
}
