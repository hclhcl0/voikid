// =============================================
// VocaKids – Vocabulary Extraction API
// POST /api/import/extract
// Nhận file (TXT, PDF, Image, URL) → Gemini → Word[]
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager, FileState } from '@google/generative-ai/server';
import { Word } from '@/types';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

function getExtractionPrompt(mode: string = 'comprehensive'): string {
  const isComprehensive = mode !== 'selective';
  return `You are an English vocabulary extraction assistant for a children's learning app (target age 4-10).

Extract English vocabulary words from the provided content and automatically categorize them into intuitive, child-friendly topics.

Rules:
- Extract words appropriate for children aged 4-10:
  * Nouns (e.g. food, drinks, animals, family, clothes, school, house, nature...)
  * Action verbs & daily activities (e.g. drink, walk, play, read, put on, eat, sleep, cook...)
  * Adjectives (e.g. happy, big, red, delicious, clean, beautiful...)
- Each word MUST have a clear, concrete meaning suitable for children
- Skip abstract functional grammar words (a, an, the, is, are, was, were, to, of, in, on, at)
${isComprehensive
  ? `- THOROUGHLY EXTRACT ALL MEANINGFUL VOCABULARY: Do not stop at just 5-6 words! Extract as many good words as possible (from 15 up to 40 words if the source content contains them). Include both nouns, verbs, and adjectives.`
  : `- Extract 5 to 15 core vocabulary words maximum.`}
- For each word, classify it into an intuitive child-friendly topic:
  * topic_vi: Vietnamese name of the topic (e.g. "Động vật", "Trái cây & Đồ ăn", "Màu sắc", "Trường học & Dụng cụ", "Gia đình", "Phương tiện giao thông", "Hành động & Thói quen", "Thiên nhiên", "Cơ thể", "Đồ chơi & Đồ vật", "Trang phục")
  * topic_en: English name of the topic (e.g. "Animals", "Fruits & Food", "Colors", "School & Supplies", "Family", "Vehicles", "Actions & Habits", "Nature", "Body Parts", "Toys & Objects", "Clothes")
  * topic_emoji: an iconic emoji for the topic (e.g. "🐾", "🍎", "🎨", "🎒", "👨‍👩‍👧", "🚗", "🏃", "🌳", "👀", "🧸", "👕")
- For each word, provide:
  + child-friendly emoji
  + IPA phonetic
  + Vietnamese Phonics Approximation (kids_phonics):
    * text: Vietnamese phonics with UPPERCASE for stressed syllable, hyphens between syllables, ending sounds in parentheses like (t), (s), (k), (ch)
    * syllables: array of syllables
    * mouth_tip: ultra-short (1 sentence), fun & memorable mouth tip in Vietnamese for the child
    * audio_slow_text: spaced syllables for slow reading

Respond ONLY with a valid JSON array (no markdown, no code fences, no extra text):
[
  {
    "en": "Cat",
    "vi": "Con mèo",
    "phonetic": "/kæt/",
    "emoji": "🐱",
    "topic_vi": "Động vật",
    "topic_en": "Animals",
    "topic_emoji": "🐾",
    "example_en": "The cat is sleeping.",
    "example_vi": "Con mèo đang ngủ.",
    "kids_phonics": {
      "text": "CÁT-(t)",
      "syllables": ["CÁT-(t)"],
      "mouth_tip": "Đọc chữ 'cát' rồi bật nhẹ đầu lưỡi kêu 't' một cái! 👅",
      "audio_slow_text": "CÁT ... t"
    }
  }
]

If no suitable vocabulary is found, return an empty array: []`;
}

function makeWordId(en: string): string {
  return en.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30) + '_' + Date.now();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const apiKey = (formData.get('apiKey') as string | null)?.trim();
    const sourceType = formData.get('sourceType') as string;
    const mode = (formData.get('mode') as string | null) || 'comprehensive';
    const file = formData.get('file') as File | null;
    const url = formData.get('url') as string | null;
    const textInput = formData.get('text') as string | null;

    const resolvedKey = apiKey || process.env.GEMINI_API_KEY;
    if (!resolvedKey) {
      return NextResponse.json({ error: 'NO_API_KEY', message: 'Chưa có Gemini API Key.' }, { status: 401 });
    }

    const extractionPrompt = getExtractionPrompt(mode);

    const genAI = new GoogleGenerativeAI(resolvedKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

    let result;

    // ── TXT / plain text ────────────────────────────────────────────────────
    if (sourceType === 'txt' || (textInput && !file)) {
      const text = textInput || (file ? await file.text() : '');
      if (!text.trim()) return NextResponse.json({ error: 'Empty text' }, { status: 400 });

      result = await model.generateContent([
        { text: `Content to extract vocabulary from:\n\n${text.slice(0, 50000)}\n\n${extractionPrompt}` },
      ]);
    }

    // ── PDF ────────────────────────────────────────────────────────────────
    else if (sourceType === 'pdf' && file) {
      const bytes = await file.arrayBuffer();

      // Nếu file lớn (>10MB), upload qua GoogleAIFileManager
      if (bytes.byteLength > 10 * 1024 * 1024) {
        const fileManager = new GoogleAIFileManager(resolvedKey);
        const tempPath = path.join(os.tmpdir(), `vocakids_upload_${Date.now()}.pdf`);
        await fs.writeFile(tempPath, Buffer.from(bytes));

        try {
          const uploadResult = await fileManager.uploadFile(tempPath, {
            mimeType: 'application/pdf',
            displayName: file.name || 'uploaded_book.pdf',
          });

          let uploaded = await fileManager.getFile(uploadResult.file.name);
          while (uploaded.state === FileState.PROCESSING) {
            await new Promise((r) => setTimeout(r, 2000));
            uploaded = await fileManager.getFile(uploadResult.file.name);
          }

          result = await model.generateContent([
            {
              fileData: {
                mimeType: uploadResult.file.mimeType,
                fileUri: uploadResult.file.uri,
              },
            },
            { text: extractionPrompt },
          ]);
        } finally {
          await fs.unlink(tempPath).catch(() => {});
        }
      } else {
        const base64 = Buffer.from(bytes).toString('base64');
        result = await model.generateContent([
          { inlineData: { data: base64, mimeType: 'application/pdf' } },
          { text: extractionPrompt },
        ]);
      }
    }

    // ── Image ──────────────────────────────────────────────────────────────
    else if (sourceType === 'image' && file) {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      const mimeType = file.type as 'image/jpeg' | 'image/png' | 'image/webp';

      result = await model.generateContent([
        { inlineData: { data: base64, mimeType } },
        { text: `Look at this image carefully.\n\n${extractionPrompt}\n\nIf the image contains text (like a vocabulary list, textbook page, or flashcard), extract those English words.\nIf the image shows objects/animals/scenes with no text, identify what you see and create vocabulary entries for the main objects visible.` },
      ]);
    }

    // ── URL ────────────────────────────────────────────────────────────────
    else if (sourceType === 'url' && url) {
      // Fetch the page content server-side with browser-like headers
      const pageRes = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'vi,en;q=0.9',
        },
        signal: AbortSignal.timeout(12000),
      });

      if (!pageRes.ok) {
        return NextResponse.json({ error: `Không thể tải trang web: Mã lỗi HTTP ${pageRes.status}` }, { status: 400 });
      }

      const html = await pageRes.text();
      // Extract clean text without scripts and styles
      const text = html
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<svg[\s\S]*?<\/svg>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<script(?![^>]*id=["']__NEXT_DATA__["'])[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 60000);

      result = await model.generateContent([
        { text: `Content from URL "${url}":\n\n${text}\n\n${extractionPrompt}` },
      ]);
    }

    else {
      return NextResponse.json({ error: 'Invalid sourceType or missing file/url' }, { status: 400 });
    }

    // ── Parse Gemini response ────────────────────────────────────────────
    const raw = result!.response.text().trim();
    const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

    let words: Omit<Word, 'id'>[] = [];
    try {
      words = JSON.parse(cleaned);
      if (!Array.isArray(words)) words = [];
    } catch {
      return NextResponse.json({ error: 'Gemini returned invalid JSON', raw: cleaned }, { status: 500 });
    }

    // Assign IDs and standardize topic info
    const withIds: Word[] = words.map((w) => ({
      ...w,
      id: makeWordId(w.en),
      en: w.en.trim(),
      vi: w.vi.trim(),
      phonetic: w.phonetic || '',
      emoji: w.emoji || '📝',
      topic_vi: w.topic_vi ? w.topic_vi.trim() : 'Từ vựng chung',
      topic_en: w.topic_en ? w.topic_en.trim() : 'General',
      topic_emoji: w.topic_emoji ? w.topic_emoji.trim() : '📚',
      example_en: w.example_en || '',
      example_vi: w.example_vi || '',
      kids_phonics: w.kids_phonics ? {
        text: w.kids_phonics.text || '',
        syllables: Array.isArray(w.kids_phonics.syllables) ? w.kids_phonics.syllables : [w.kids_phonics.text || ''],
        mouth_tip: w.kids_phonics.mouth_tip || 'Bé mở to miệng và phát âm rõ nhé! 😊',
        audio_slow_text: w.kids_phonics.audio_slow_text || w.kids_phonics.text || '',
      } : undefined,
    }));

    // Group words into structured topics (Semantic Clusters)
    const topicMap = new Map<string, { topic_vi: string; topic_en: string; emoji: string; words: Word[] }>();
    withIds.forEach((w) => {
      const key = w.topic_vi || 'Từ vựng chung';
      if (!topicMap.has(key)) {
        topicMap.set(key, {
          topic_vi: key,
          topic_en: w.topic_en || key,
          emoji: w.topic_emoji || '📚',
          words: [],
        });
      }
      topicMap.get(key)!.words.push(w);
    });

    const topics = Array.from(topicMap.values());

    return NextResponse.json({
      words: withIds,
      topics,
      count: withIds.length,
    });

  } catch (err) {
    console.error('[/api/import/extract]', err);
    return NextResponse.json({ error: 'Extraction failed', details: String(err) }, { status: 500 });
  }
}
