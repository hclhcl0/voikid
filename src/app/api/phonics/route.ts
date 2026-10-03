// =============================================
// VocaKids – Vietnamese Kids Phonics API
// POST /api/phonics
// English word → Gemini → KidsPhonics (Việt hóa ngữ âm)
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { KidsPhonics } from '@/types';

const PHONICS_PROMPT = `Bạn là chuyên gia ngữ âm tiếng Anh kiêm giáo viên mầm non Việt Nam.
Nhiệm vụ: Chuyển đổi từ tiếng Anh sang hệ thống phiên âm mô phỏng tiếng Việt thông minh, trực quan và dễ đọc nhất cho trẻ em Việt Nam (4–8 tuổi).

QUY TẮC PHIÊN ÂM (PHẢI TUÂN THỦ):
1. VIẾT HOA toàn bộ âm tiết mang trọng âm chính (ví dụ: ÁP-pờl, bờ-NEN-nờ, É-li-phần)
2. Dùng dấu gạch nối "-" phân tách các âm tiết
3. Các âm đuôi quan trọng /t/, /k/, /s/, /d/, /p/, /ks/, /ʃ/ PHẢI ghi trong ngoặc đơn cuối âm tiết:
   - /t/ → (t)   ví dụ: "cát-(t)"
   - /k/ → (k)   ví dụ: "búc-(k)"
   - /s/ → (s)   ví dụ: "dóc-(s)"
   - /ks/ → (ks) ví dụ: "bóc-(ks)"
   - /ʃ/ → (s*)  ví dụ: "phít-(s*)"
   - /tʃ/ → (ch) ví dụ: "ô-rin-(ch)"
4. Xử lý âm đặc thù không có trong tiếng Việt:
   - /θ/ (think): ghi "thờ" kèm ghi chú kẹp lưỡi trong mouth_tip
   - /ð/ (the): ghi "đờ" kèm ghi chú lưỡi ở răng
   - /r/: ghi "r" (cuộn lưỡi nhẹ)
   - /æ/: ghi "e" (miệng mở rộng)
   - /ə/: ghi "ờ" (ngắn, nhẹ)
5. mouth_tip: Ngắn gọn (1–2 câu), hài hước, dùng hình ảnh gần gũi với trẻ em
6. audio_slow_text: Viết lại phiên âm có khoảng cách giữa từng âm tiết để đọc chậm

ĐỊNH DẠNG TRẢ VỀ (JSON object, không markdown):
{
  "text": "chuỗi phiên âm đầy đủ",
  "syllables": ["mảng", "từng", "âm-tiết"],
  "mouth_tip": "mẹo miệng ngắn gọn",
  "audio_slow_text": "chuỗi đọc chậm"
}

VÍ DỤ MẪU:
- "Cat" → {"text":"CÁT-(t)","syllables":["CÁT-(t)"],"mouth_tip":"Đọc chữ 'cát' rồi bật nhẹ đầu lưỡi kêu 't' một cái! 👅","audio_slow_text":"CÁT ... t"}
- "Elephant" → {"text":"É-li-phần-(t)","syllables":["É","li","phần-(t)"],"mouth_tip":"Nhấn giọng to ở chữ 'É', chữ 'phần' nhớ bật nhẹ âm 't' như đá bong bóng! 🎈","audio_slow_text":"É ... li ... phần ... t"}
- "Banana" → {"text":"bờ-NEN-nờ","syllables":["bờ","NEN","nờ"],"mouth_tip":"Đọc lướt chữ 'bờ', hét to chữ 'NEN' rồi hạ giọng chữ 'nờ' nhé bé! 🍌","audio_slow_text":"bờ ... NEN ... nờ"}
- "Fish" → {"text":"PHÍT-(s*)","syllables":["PHÍT-(s*)"],"mouth_tip":"Chu môi thổi gió xì mạnh như đang ra hiệu im lặng 'ssshh'! 🤫","audio_slow_text":"PHÍT ... sh"}
- "Orange" → {"text":"Ó-rìn-(ch)","syllables":["Ó","rìn-(ch)"],"mouth_tip":"Đọc chữ 'Ó' to như ngạc nhiên, cuối từ bật mạnh âm 'ch' như tiếng kẹo vỡ! 🍊","audio_slow_text":"Ó ... rìn ... ch"}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { word: string; phonetic?: string; apiKey?: string };
    const { word, phonetic, apiKey: bodyKey } = body;

    if (!word?.trim()) {
      return NextResponse.json({ error: 'MISSING_WORD' }, { status: 400 });
    }

    const apiKey = bodyKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'NO_API_KEY' }, { status: 401 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];

    const prompt = `${PHONICS_PROMPT}

Từ cần phiên âm: "${word.trim()}"${phonetic ? `\nIPA gốc: ${phonetic}` : ''}

Trả về JSON object (không markdown, không code block):`;

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
    if (!result) throw lastErr;
    const raw = result.response.text().trim()
      .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');

    let phonics: KidsPhonics;
    try {
      phonics = JSON.parse(raw) as KidsPhonics;
      // Validate required fields
      if (!phonics.text || !Array.isArray(phonics.syllables) || !phonics.mouth_tip || !phonics.audio_slow_text) {
        throw new Error('Invalid phonics structure');
      }
    } catch {
      // Fallback: use word as-is with simple approximation
      phonics = {
        text: word.toUpperCase(),
        syllables: [word.toUpperCase()],
        mouth_tip: `Đọc to "${word}" nhé bé! 😊`,
        audio_slow_text: word,
      };
    }

    return NextResponse.json({ phonics });
  } catch (err) {
    console.error('[/api/phonics]', err);
    return NextResponse.json({ error: 'SERVER_ERROR', message: String(err) }, { status: 500 });
  }
}

// ── Batch endpoint: POST /api/phonics/batch ─────────────────────────────────
// Used by the pre-generation script
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json() as { words: { en: string; phonetic?: string }[]; apiKey?: string };
    const { words, apiKey: bodyKey } = body;

    if (!words?.length) return NextResponse.json({ error: 'MISSING_WORDS' }, { status: 400 });
    const apiKey = bodyKey || process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'NO_API_KEY' }, { status: 401 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];

    // Batch prompt for up to 20 words at once
    const batchPrompt = `${PHONICS_PROMPT}

Danh sách từ cần phiên âm (trả về JSON array, mỗi phần tử có thêm trường "en" là từ gốc):
${words.map((w, i) => `${i + 1}. "${w.en}"${w.phonetic ? ` (IPA: ${w.phonetic})` : ''}`).join('\n')}

Trả về JSON array (không markdown):
[{"en":"word","text":"...","syllables":[...],"mouth_tip":"...","audio_slow_text":"..."}, ...]`;

    let result = null;
    let lastErr = null;
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        result = await model.generateContent(batchPrompt);
        break;
      } catch (e) {
        lastErr = e;
      }
    }
    if (!result) throw lastErr;
    const raw = result.response.text().trim()
      .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');

    let items: (KidsPhonics & { en: string })[] = [];
    try {
      items = JSON.parse(raw);
    } catch {
      items = [];
    }

    // Map back by en field
    const result_map: Record<string, KidsPhonics> = {};
    for (const item of items) {
      if (item.en && item.text) {
        const { en, ...phonics } = item;
        result_map[en.toLowerCase()] = phonics as KidsPhonics;
      }
    }

    return NextResponse.json({ results: result_map });
  } catch (err) {
    console.error('[/api/phonics PUT]', err);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
