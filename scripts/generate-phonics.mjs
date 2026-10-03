// =============================================
// VocaKids – Pre-generate Kids Phonics Script
// Run: node scripts/generate-phonics.mjs
// Generates Vietnamese phonics for all built-in
// words and writes to src/data/phonics.json
// =============================================

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';

// ── Config ────────────────────────────────────────────────────────────────────
const OUTPUT_FILE = './src/data/phonics.json';
const BATCH_SIZE  = 15;   // words per Gemini call
const DELAY_MS    = 1200; // rate-limit delay between batches

// ── Read API key from env or stdin ────────────────────────────────────────────
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ Set GEMINI_API_KEY environment variable first.');
  console.error('   Windows: $env:GEMINI_API_KEY="AIza..."');
  console.error('   Linux/Mac: export GEMINI_API_KEY="AIza..."');
  process.exit(1);
}

// ── Vocabulary (copy from lib/vocabulary.ts) ──────────────────────────────────
// You can extend this list or load from JSON
const WORDS = [
  // Animals
  { en: 'Cat',       phonetic: '/kæt/' },
  { en: 'Dog',       phonetic: '/dɒɡ/' },
  { en: 'Bird',      phonetic: '/bɜːrd/' },
  { en: 'Fish',      phonetic: '/fɪʃ/' },
  { en: 'Elephant',  phonetic: '/ˈɛlɪfənt/' },
  { en: 'Lion',      phonetic: '/ˈlaɪən/' },
  { en: 'Rabbit',    phonetic: '/ˈræbɪt/' },
  { en: 'Duck',      phonetic: '/dʌk/' },
  { en: 'Monkey',    phonetic: '/ˈmʌŋki/' },
  { en: 'Tiger',     phonetic: '/ˈtaɪɡər/' },
  // Fruits
  { en: 'Apple',     phonetic: '/ˈæpəl/' },
  { en: 'Banana',    phonetic: '/bəˈnɑːnə/' },
  { en: 'Orange',    phonetic: '/ˈɒrɪndʒ/' },
  { en: 'Strawberry',phonetic: '/ˈstrɔːbəri/' },
  { en: 'Grape',     phonetic: '/ɡreɪp/' },
  { en: 'Mango',     phonetic: '/ˈmæŋɡoʊ/' },
  { en: 'Watermelon',phonetic: '/ˈwɔːtərmelən/' },
  { en: 'Pear',      phonetic: '/pɛr/' },
  { en: 'Cherry',    phonetic: '/ˈtʃɛri/' },
  { en: 'Pineapple', phonetic: '/ˈpaɪnæpəl/' },
  // Colors
  { en: 'Red',       phonetic: '/rɛd/' },
  { en: 'Blue',      phonetic: '/bluː/' },
  { en: 'Green',     phonetic: '/ɡriːn/' },
  { en: 'Yellow',    phonetic: '/ˈjɛloʊ/' },
  { en: 'Pink',      phonetic: '/pɪŋk/' },
  { en: 'Purple',    phonetic: '/ˈpɜːrpəl/' },
  { en: 'White',     phonetic: '/waɪt/' },
  { en: 'Black',     phonetic: '/blæk/' },
  { en: 'Brown',     phonetic: '/braʊn/' },
  // Food
  { en: 'Rice',      phonetic: '/raɪs/' },
  { en: 'Bread',     phonetic: '/brɛd/' },
  { en: 'Egg',       phonetic: '/ɛɡ/' },
  { en: 'Milk',      phonetic: '/mɪlk/' },
  { en: 'Pizza',     phonetic: '/ˈpiːtsə/' },
  { en: 'Cake',      phonetic: '/keɪk/' },
  { en: 'Cookie',    phonetic: '/ˈkʊki/' },
  { en: 'Noodle',    phonetic: '/ˈnuːdəl/' },
  { en: 'Soup',      phonetic: '/suːp/' },
  { en: 'Candy',     phonetic: '/ˈkændi/' },
  // Body
  { en: 'Head',      phonetic: '/hɛd/' },
  { en: 'Eye',       phonetic: '/aɪ/' },
  { en: 'Nose',      phonetic: '/noʊz/' },
  { en: 'Mouth',     phonetic: '/maʊθ/' },
  { en: 'Ear',       phonetic: '/ɪr/' },
  { en: 'Hand',      phonetic: '/hænd/' },
  { en: 'Foot',      phonetic: '/fʊt/' },
  { en: 'Hair',      phonetic: '/hɛr/' },
  { en: 'Teeth',     phonetic: '/tiːθ/' },
  { en: 'Heart',     phonetic: '/hɑːrt/' },
  // Transport
  { en: 'Car',       phonetic: '/kɑːr/' },
  { en: 'Bus',       phonetic: '/bʌs/' },
  { en: 'Bicycle',   phonetic: '/ˈbaɪsɪkəl/' },
  { en: 'Airplane',  phonetic: '/ˈɛrpleɪn/' },
  { en: 'Ship',      phonetic: '/ʃɪp/' },
  { en: 'Train',     phonetic: '/treɪn/' },
  { en: 'Motorcycle',phonetic: '/ˈmoʊtərsaɪkəl/' },
  { en: 'Helicopter',phonetic: '/ˈhɛlɪkɒptər/' },
  { en: 'Boat',      phonetic: '/boʊt/' },
  { en: 'Truck',     phonetic: '/trʌk/' },
];

const PHONICS_PROMPT = `Bạn là chuyên gia ngữ âm tiếng Anh kiêm giáo viên mầm non Việt Nam.
Nhiệm vụ: Chuyển đổi danh sách từ tiếng Anh sang hệ thống phiên âm mô phỏng tiếng Việt thông minh cho trẻ em Việt Nam (4–8 tuổi).

QUY TẮC PHIÊN ÂM:
1. VIẾT HOA âm tiết mang trọng âm chính
2. Dùng dấu gạch nối "-" phân tách âm tiết
3. Âm đuôi /t/→(t), /k/→(k), /s/→(s), /ks/→(ks), /ʃ/→(s*), /tʃ/→(ch) trong ngoặc đơn
4. mouth_tip: 1–2 câu ngắn, hài hước, gần gũi trẻ em
5. audio_slow_text: phiên âm có dấu "..." giữa các âm tiết`;

async function generateBatch(words) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `${PHONICS_PROMPT}

Danh sách từ:
${words.map((w, i) => `${i + 1}. "${w.en}" (IPA: ${w.phonetic})`).join('\n')}

Trả về JSON array (không markdown, không code block):
[{"en":"word","text":"...","syllables":[...],"mouth_tip":"...","audio_slow_text":"..."}, ...]`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim()
    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');

  return JSON.parse(raw);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\n🦉 VocaKids – Vietnamese Phonics Generator`);
  console.log(`📚 ${WORDS.length} words to process in batches of ${BATCH_SIZE}\n`);

  // Load existing output (resume support)
  let output = {};
  if (existsSync(OUTPUT_FILE)) {
    output = JSON.parse(readFileSync(OUTPUT_FILE, 'utf8'));
    console.log(`📂 Loaded ${Object.keys(output).length} existing entries (will skip)\n`);
  }

  const pending = WORDS.filter((w) => !output[w.en.toLowerCase()]);
  console.log(`⏳ ${pending.length} words need generation\n`);

  let success = 0, failed = 0;

  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = pending.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(pending.length / BATCH_SIZE);

    process.stdout.write(`Batch ${batchNum}/${totalBatches}: ${batch.map(w => w.en).join(', ')}... `);

    try {
      const items = await generateBatch(batch);
      for (const item of items) {
        if (item.en && item.text) {
          const { en, ...phonics } = item;
          output[en.toLowerCase()] = phonics;
          success++;
        }
      }
      console.log(`✅ (${items.length} done)`);

      // Save after each batch
      writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
      failed += batch.length;
    }

    if (i + BATCH_SIZE < pending.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n✨ Done! ${success} generated, ${failed} failed`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
  console.log(`\nNext step: Import this file into your app via injectPhonicsCache() on startup.`);
})();
