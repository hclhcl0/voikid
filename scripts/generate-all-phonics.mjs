import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ── Read API Key from .env.local ─────────────────────────────────────────────
let apiKey = process.env.GEMINI_API_KEY;
if (!apiKey && existsSync('.env.local')) {
  const envContent = readFileSync('.env.local', 'utf8');
  const match = envContent.match(/GEMINI_API_KEY\s*=\s*(AQ\.[A-Za-z0-9_-]+|AIza[A-Za-z0-9_-]+)/);
  if (match) apiKey = match[1];
}

if (!apiKey) {
  apiKey = process.env.GEMINI_API_KEY || '';
}

const OUTPUT_FILE = './src/data/phonics.json';
const BATCH_SIZE = 15;
const DELAY_MS = 1000;

// ── Extract words from vocabulary.ts ─────────────────────────────────────────
function getVocabularyWords() {
  const content = readFileSync('src/lib/vocabulary.ts', 'utf8');
  const wordRegex = /en:\s*'([^']+)',\s*vi:\s*'([^']+)',.*?phonetic:\s*'([^']+)'/gs;
  const words = [];
  const seen = new Set();
  let m;
  while ((m = wordRegex.exec(content)) !== null) {
    const en = m[1].trim();
    const vi = m[2].trim();
    const phonetic = m[3].trim();
    const lower = en.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      words.push({ en, vi, phonetic });
    }
  }
  return words;
}

const PHONICS_PROMPT = `Bạn là chuyên gia ngữ âm tiếng Anh kiêm giáo viên mầm non và tiểu học Việt Nam.
Nhiệm vụ: Chuyển đổi danh sách từ tiếng Anh sang hệ thống phiên âm mô phỏng tiếng Việt thông minh (Vietnamese Phonics Approximation) cho trẻ em Việt Nam (4–8 tuổi).

QUY TẮC BẮT BUỘC:
1. VIẾT HOA toàn bộ âm tiết mang trọng âm chính để bé biết nhấn giọng cao và mạnh hơn (ví dụ: bờ-NEN-nờ, ÁP-pờl, É-li-phần-(t)).
2. Dùng dấu gạch nối "-" phân tách các âm tiết rõ ràng.
3. Các âm đuôi sống còn (/s/, /t/, /k/, /d/, /p/, /ks/, /ʃ/, /tʃ/) BẮT BUỘC ghi trong ngoặc đơn ở cuối âm tiết:
   - /t/ -> (t) ví dụ: Cát-(t)
   - /k/ -> (k) ví dụ: Búc-(k)
   - /s/ -> (s) ví dụ: Bót-(ks) hoặc Phít-(s)
   - /ʃ/ -> (s*) ví dụ: Phít-(s*)
   - /tʃ/ -> (ch) ví dụ: Ó-rìn-(ch)
4. mouth_tip: Mẹo khẩu hình miệng cực ngắn (1 câu), vui nhộn, hài hước, dễ nhớ cho bé (ví dụ: "Đọc chữ 'cát' rồi bật nhẹ đầu lưỡi kêu 't' một cái! 👅").
5. audio_slow_text: Chuỗi đọc chậm có dấu "..." giữa các âm tiết để bé tập đánh vần.

Hãy trả về duy nhất một JSON array (không bọc trong markdown, không có bất kỳ văn bản nào khác):
[
  {
    "en": "Cat",
    "text": "CÁT-(t)",
    "syllables": ["CÁT-(t)"],
    "mouth_tip": "Đọc chữ 'cát' rồi bật nhẹ đầu lưỡi kêu 't' một cái! 👅",
    "audio_slow_text": "CÁT ... t"
  }
]`;

async function generateBatch(genAI, words, maxRetries = 4) {
  const prompt = `${PHONICS_PROMPT}

Danh sách ${words.length} từ cần phiên âm:
${words.map((w, i) => `${i + 1}. "${w.en}" (IPA: ${w.phonetic}, Nghĩa: ${w.vi})`).join('\n')}`;

  const modelsToTry = ['gemini-3.8-flash', 'gemini-2.5-flash'];

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const modelName = modelsToTry[(attempt - 1) % modelsToTry.length];
    const model = genAI.getGenerativeModel({ model: modelName });

    try {
      const result = await model.generateContent(prompt);
      const raw = result.response.text().trim()
        .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
      return JSON.parse(raw);
    } catch (err) {
      if (attempt < maxRetries && (err.message.includes('503') || err.message.includes('429') || err.message.includes('overloaded'))) {
        process.stdout.write(`[thử lại ${attempt}] `);
        await sleep(2500 * attempt);
        continue;
      }
      throw err;
    }
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('🚀 Bắt đầu tạo toàn bộ phiên âm Việt hóa (Kids Phonics) bằng Gemini 3.8 Flash...');
  
  if (!existsSync('./src/data')) {
    mkdirSync('./src/data', { recursive: true });
  }

  const allWords = getVocabularyWords();
  console.log(`📚 Tìm thấy tổng cộng ${allWords.length} từ vựng trong ứng dụng.`);

  let output = {};
  if (existsSync(OUTPUT_FILE)) {
    try {
      output = JSON.parse(readFileSync(OUTPUT_FILE, 'utf8'));
      console.log(`📂 Đã có sẵn ${Object.keys(output).length} từ trong ${OUTPUT_FILE} (sẽ bỏ qua để tiết kiệm).`);
    } catch {
      output = {};
    }
  }

  const pending = allWords.filter((w) => !output[w.en.toLowerCase()]);
  console.log(`⏳ Còn ${pending.length} từ cần tạo phiên âm.\n`);

  if (pending.length === 0) {
    console.log('✅ Tất cả từ vựng đã có đầy đủ phiên âm!');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = pending.slice(i, i + BATCH_SIZE);
    const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(pending.length / BATCH_SIZE);

    process.stdout.write(`Batch ${batchIndex}/${totalBatches} (${batch.length} từ: ${batch.map(b => b.en).slice(0, 4).join(', ')}...): `);

    try {
      const items = await generateBatch(genAI, batch);
      let count = 0;
      for (const item of items) {
        if (item.en && (item.text || item.vietnamese_phonics)) {
          const key = item.en.toLowerCase().trim();
          output[key] = {
            text: item.text || item.vietnamese_phonics,
            syllables: Array.isArray(item.syllables) ? item.syllables : [item.text || item.vietnamese_phonics],
            mouth_tip: item.mouth_tip || 'Bé mở to miệng và phát âm rõ nhé! 😊',
            audio_slow_text: item.audio_slow_text || (item.text || item.vietnamese_phonics),
          };
          count++;
          successCount++;
        }
      }
      console.log(`✅ Thành công ${count} từ.`);
      writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
    } catch (err) {
      console.log(`❌ Lỗi: ${err.message}`);
      failCount += batch.length;
    }

    if (i + BATCH_SIZE < pending.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n🎉 Hoàn thành!`);
  console.log(`✅ Đã tạo thành công: ${successCount} từ`);
  if (failCount > 0) console.log(`⚠️ Thất bại: ${failCount} từ`);
  console.log(`💾 Đã lưu vào tệp: ${OUTPUT_FILE}`);
}

main().catch(console.error);
