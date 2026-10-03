// =============================================
// VocaKids – useEnrichedWord Hook
// Tự động bổ sung nghĩa tiếng Việt, câu ví dụ,
// emoji, phiên âm bằng Gemini AI khi từ bị thiếu.
// =============================================

'use client';

import { useEffect, useState, useRef } from 'react';
import { Word } from '@/types';
import { useSettings } from './useSettings';

const ENRICH_CACHE_KEY = 'vocakids_enriched_words_v1';

// Fast offline fallback dictionary for common words
const FALLBACK_WORDS: Record<string, Partial<Word>> = {
  month: {
    vi: 'Tháng',
    phonetic: '/mʌnθ/',
    emoji: '📅',
    example_en: 'There are twelve months in a year.',
    example_vi: 'Một năm có mười hai tháng.',
    kids_phonics: {
      text: 'MĂN- (th)',
      syllables: ['măn'],
      mouth_tip: 'Đặt đầu lưỡi giữa hai hàm răng và thổi nhẹ hơi /th/ ở cuối từ.',
      audio_slow_text: 'm-on-th',
    },
  },
  year: {
    vi: 'Năm',
    phonetic: '/jɪər/',
    emoji: '🗓️',
    example_en: 'Happy New Year!',
    example_vi: 'Chúc mừng năm mới!',
    kids_phonics: {
      text: 'DIA-',
      syllables: ['dia'],
      mouth_tip: 'Đọc nối âm d-ia thật mềm mại.',
      audio_slow_text: 'y-ear',
    },
  },
  week: {
    vi: 'Tuần',
    phonetic: '/wiːk/',
    emoji: '📆',
    example_en: 'There are seven days in a week.',
    example_vi: 'Một tuần có bảy ngày.',
    kids_phonics: {
      text: 'UÝK (k)',
      syllables: ['uýk'],
      mouth_tip: 'Bật nhẹ âm /k/ nhỏ ở cuống họng.',
      audio_slow_text: 'w-eek',
    },
  },
  day: {
    vi: 'Ngày',
    phonetic: '/deɪ/',
    emoji: '☀️',
    example_en: 'Have a wonderful day!',
    example_vi: 'Chúc bé một ngày tuyệt vời!',
    kids_phonics: {
      text: 'ĐÂY',
      syllables: ['đây'],
      mouth_tip: 'Đọc âm /đ/ dứt khoát như tiếng Việt.',
      audio_slow_text: 'd-ay',
    },
  },
  calendar: {
    vi: 'Lịch',
    phonetic: '/ˈkælɪndər/',
    emoji: '🗓️',
    example_en: 'Look at the calendar on the wall.',
    example_vi: 'Hãy nhìn cuốn lịch trên tường nhé.',
    kids_phonics: {
      text: 'KÁ- lin- đơ',
      syllables: ['ká', 'lin', 'đơ'],
      mouth_tip: 'Nhấn mạnh vào âm KÁ đầu tiên.',
      audio_slow_text: 'ca-len-dar',
    },
  },
  season: {
    vi: 'Mùa',
    phonetic: '/ˈsiːzən/',
    emoji: '🍂',
    example_en: 'Spring is a beautiful season.',
    example_vi: 'Mùa xuân là một mùa tuyệt đẹp.',
    kids_phonics: {
      text: 'XÍ- zừn',
      syllables: ['xí', 'zừn'],
      mouth_tip: 'Nhấn mạnh XÍ, rung nhẹ âm z.',
      audio_slow_text: 'sea-son',
    },
  },
  hour: {
    vi: 'Giờ',
    phonetic: '/ˈaʊər/',
    emoji: '⏳',
    example_en: 'One hour has sixty minutes.',
    example_vi: 'Một giờ có sáu mươi phút.',
    kids_phonics: {
      text: 'AO- ờ',
      syllables: ['ao', 'ờ'],
      mouth_tip: 'Chữ h câm, đọc thẳng từ AO.',
      audio_slow_text: 'h-our',
    },
  },
  minute: {
    vi: 'Phút',
    phonetic: '/ˈmɪnɪt/',
    emoji: '⏱️',
    example_en: 'Wait a minute, please.',
    example_vi: 'Xin hãy đợi một phút nhé.',
    kids_phonics: {
      text: 'MÍ- nịt (t)',
      syllables: ['mí', 'nịt'],
      mouth_tip: 'Chặn nhẹ đầu lưỡi ở vòm trên cho âm (t).',
      audio_slow_text: 'min-ute',
    },
  },
  second: {
    vi: 'Giây',
    phonetic: '/ˈsɛkənd/',
    emoji: '⏲️',
    example_en: 'Just sixty seconds in a minute.',
    example_vi: 'Chỉ sáu mươi giây trong một phút.',
    kids_phonics: {
      text: 'XÉ- kừnd',
      syllables: ['xé', 'kừnd'],
      mouth_tip: 'Nhấn mạnh XÉ đầu tiên.',
      audio_slow_text: 'sec-ond',
    },
  },
  today: {
    vi: 'Hôm nay',
    phonetic: '/təˈdeɪ/',
    emoji: '✨',
    example_en: 'Today is a sunny day.',
    example_vi: 'Hôm nay là một ngày trời nắng.',
    kids_phonics: {
      text: 'tờ- ĐÂY',
      syllables: ['tờ', 'đây'],
      mouth_tip: 'Nhấn mạnh vào âm ĐÂY.',
      audio_slow_text: 'to-day',
    },
  },
};

function getLocalCache(): Record<string, Partial<Word>> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(ENRICH_CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveLocalCache(en: string, data: Partial<Word>) {
  if (typeof window === 'undefined') return;
  try {
    const cache = getLocalCache();
    cache[en.toLowerCase().trim()] = data;
    localStorage.setItem(ENRICH_CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore */
  }
}

export function useEnrichedWord(
  catId: string,
  rawWord: Word | undefined,
  onWordUpdated?: (catId: string, wordId: string, updated: Word) => void
) {
  const { apiKey } = useSettings();
  const [enriched, setEnriched] = useState<Word | undefined>(undefined);
  const [isEnriching, setIsEnriching] = useState(false);
  const enrichingRef = useRef<string | null>(null);
  const onWordUpdatedRef = useRef(onWordUpdated);
  onWordUpdatedRef.current = onWordUpdated;

  useEffect(() => {
    if (!rawWord) {
      setEnriched(undefined);
      return;
    }

    let targetEn = rawWord.en?.trim() || '';
    if (!targetEn && rawWord.phonetic?.includes('mʌnθ')) {
      targetEn = 'month';
    }

    if (!targetEn) {
      setEnriched(rawWord);
      return;
    }

    const key = targetEn.toLowerCase().trim();
    const needsVi = !rawWord.vi || rawWord.vi.trim() === '';
    const needsExample = !rawWord.example_en || rawWord.example_en.trim() === '';

    // If word already has both meaning and example and valid en, sync and return
    if (!needsVi && !needsExample && rawWord.en?.trim()) {
      setEnriched(rawWord);
      return;
    }

    // 1. Check local cache or fast fallback dictionary
    const cache = getLocalCache();
    const cached = cache[key] || FALLBACK_WORDS[key];

    if (cached && (cached.vi || cached.example_en)) {
      const merged: Word = {
        ...rawWord,
        en: targetEn,
        vi: rawWord.vi || cached.vi || '',
        example_en: rawWord.example_en || cached.example_en || '',
        example_vi: rawWord.example_vi || cached.example_vi || '',
        phonetic: (rawWord.phonetic && rawWord.phonetic.trim()) ? rawWord.phonetic : (cached.phonetic || ''),
        emoji: (rawWord.emoji && rawWord.emoji !== '📝') ? rawWord.emoji : (cached.emoji || '📝'),
        kids_phonics: rawWord.kids_phonics || cached.kids_phonics,
      };
      setEnriched(merged);
      if (onWordUpdatedRef.current) {
        onWordUpdatedRef.current(catId, rawWord.id, merged);
      }
      return;
    }

    // 2. Fetch from /api/word/enrich
    if (enrichingRef.current === rawWord.id) return;
    enrichingRef.current = rawWord.id;

    let cancelled = false;
    setIsEnriching(true);

    fetch('/api/word/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        word: targetEn,
        apiKey: apiKey || undefined,
      }),
    })
      .then((r) => r.json())
      .then((res: { success?: boolean; word?: Partial<Word>; error?: string }) => {
        if (cancelled) return;
        if (res.success && res.word) {
          const w = res.word;
          const merged: Word = {
            ...rawWord,
            en: targetEn,
            vi: rawWord.vi || w.vi || '',
            example_en: rawWord.example_en || w.example_en || '',
            example_vi: rawWord.example_vi || w.example_vi || '',
            phonetic: (rawWord.phonetic && rawWord.phonetic.trim()) ? rawWord.phonetic : (w.phonetic || ''),
            emoji: (rawWord.emoji && rawWord.emoji !== '📝') ? rawWord.emoji : (w.emoji || '📝'),
            kids_phonics: rawWord.kids_phonics || w.kids_phonics,
          };
          saveLocalCache(key, merged);
          setEnriched(merged);
          if (onWordUpdatedRef.current) {
            onWordUpdatedRef.current(catId, rawWord.id, merged);
          }
        }
      })
      .catch((err) => {
        console.error('[useEnrichedWord] enrich failed:', err);
      })
      .finally(() => {
        enrichingRef.current = null;
        if (!cancelled) setIsEnriching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [rawWord?.id, rawWord?.en, rawWord?.vi, rawWord?.example_en, rawWord?.phonetic, catId, apiKey]);

  const activeWord = (enriched && enriched.id === rawWord?.id) ? enriched : rawWord;

  return {
    word: activeWord,
    isEnriching,
  };
}
