// =============================================
// VocaKids – Word Enrichment API
// POST /api/word/enrich
// Nhận từ tiếng Anh → Gemini → Bổ sung toàn bộ:
// nghĩa tiếng Việt, emoji, phiên âm, câu ví dụ EN & VI, kids_phonics
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Word } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { word: string; apiKey?: string };
    const { word, apiKey: bodyKey } = body;

    if (!word?.trim()) {
      return NextResponse.json({ error: 'MISSING_WORD' }, { status: 400 });
    }

    const apiKey = bodyKey || process.env.GEMINI_API_KEY;

    // Fast local fallback dictionary for common words
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
      },
      day: {
        vi: 'Ngày',
        phonetic: '/deɪ/',
        emoji: '☀️',
        example_en: 'Have a wonderful day!',
        example_vi: 'Chúc bé một ngày tuyệt vời!',
      },
      time: {
        vi: 'Thời gian',
        phonetic: '/taɪm/',
        emoji: '⏰',
        example_en: 'What time is it now?',
        example_vi: 'Bây giờ là mấy giờ rồi?',
      },
    };

    const cleanWord = word.trim().toLowerCase();
    const fallback = FALLBACK_WORDS[cleanWord];

    if (!apiKey) {
      if (fallback) {
        return NextResponse.json({
          success: true,
          word: {
            en: word.trim(),
            vi: fallback.vi || '',
            phonetic: fallback.phonetic || '',
            emoji: fallback.emoji || '📝',
            example_en: fallback.example_en || '',
            example_vi: fallback.example_vi || '',
            kids_phonics: fallback.kids_phonics || undefined,
          },
        });
      }
      return NextResponse.json({ error: 'NO_API_KEY' }, { status: 401 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];

    const prompt = `You are an English teacher for Vietnamese children aged 4-10.
Given the English word "${word.trim()}", generate child-friendly details.

Respond ONLY with a valid JSON object (no markdown, no code fences):
{
  "en": "${word.trim()}",
  "vi": "Nghĩa tiếng Việt ngắn gọn, chuẩn xác cho trẻ em",
  "phonetic": "/IPA phonetic/",
  "emoji": "Single iconic emoji",
  "example_en": "A simple, child-friendly English example sentence (max 8 words)",
  "example_vi": "Dịch câu ví dụ sang tiếng Việt",
  "kids_phonics": {
    "text": "Vietnamese phonics approximation with UPPERCASE for stressed syllable, hyphen between syllables, ending sound like (t), (s), (k)",
    "syllables": ["syllable1", "syllable2"],
    "mouth_tip": "Ultra-short, fun mouth-shape tip in Vietnamese for the child",
    "audio_slow_text": "Spaced text for slow speech"
  }
}`;

    let result = null;
    let lastErr = null;
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        result = await model.generateContent(prompt);
        break;
      } catch (e) {
        lastErr = e;
      }
    }

    if (!result) {
      if (fallback) {
        return NextResponse.json({
          success: true,
          word: {
            en: word.trim(),
            vi: fallback.vi || '',
            phonetic: fallback.phonetic || '',
            emoji: fallback.emoji || '📝',
            example_en: fallback.example_en || '',
            example_vi: fallback.example_vi || '',
            kids_phonics: fallback.kids_phonics || undefined,
          },
        });
      }
      throw lastErr || new Error('All models failed');
    }

    const text = result.response.text().trim();
    const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    const data = JSON.parse(clean) as Partial<Word>;

    return NextResponse.json({
      success: true,
      word: {
        en: data.en || word.trim(),
        vi: data.vi || fallback?.vi || '',
        phonetic: data.phonetic || fallback?.phonetic || '',
        emoji: data.emoji || fallback?.emoji || '📝',
        example_en: data.example_en || fallback?.example_en || '',
        example_vi: data.example_vi || fallback?.example_vi || '',
        kids_phonics: data.kids_phonics || fallback?.kids_phonics || undefined,
      }
    });

  } catch (err) {
    console.error('[/api/word/enrich]', err);
    return NextResponse.json({ error: 'ENRICH_FAILED', details: String(err) }, { status: 500 });
  }
}
