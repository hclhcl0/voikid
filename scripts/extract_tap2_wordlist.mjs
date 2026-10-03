import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const dir = 'd:/engl/vocakids/scratch/glossary_tap2';
const pages = ['page_76_img_0.jpg', 'page_77_img_0.jpg', 'page_78_img_0.jpg', 'page_79_img_0.jpg'];

const models = ['gemini-3-flash-preview', 'gemini-3.5-flash', 'gemini-2.5-flash-lite'];

async function callWithRetry(base64Data, prompt) {
  for (const modelName of models) {
    console.log(`Trying model ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
        { text: prompt }
      ]);
      return result.response.text();
    } catch (e) {
      console.log(`Model ${modelName} error: ${e.message.slice(0, 120)}`);
      // wait 3 seconds before next model
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  throw new Error('All models failed');
}

const allWords = [];

for (const pageFile of pages) {
  const filePath = path.join(dir, pageFile);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping non-existent ${pageFile}`);
    continue;
  }
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');

  console.log(`\n========================================`);
  console.log(`Processing ${pageFile}...`);
  console.log(`========================================`);

  const prompt = `This image is a Wordlist / Glossary page from the Grade 4 English textbook (Tiếng Anh 4 Tập 2 - Kết nối tri thức / Global Success).
Carefully transcribe EVERY SINGLE word / vocabulary entry on this page into a JSON array.
If this page is not a wordlist (e.g. copyright/publishing info or back cover), return [] (empty array).

For each entry, extract:
- "en": the exact English word or phrase (e.g. "floor", "building", "doctor", "slim", "cloudy", etc.)
- "phonetic": the phonetic transcription (IPA, e.g. "/flɔː(r)/", "/ˈbɪldɪŋ/", etc.)
- "word_class": (e.g. "n.", "v.", "adj.", "prep.", if available)
- "vi": the Vietnamese meaning exactly as printed (e.g. "tầng (nhà)", "toà nhà", etc.)
- "unit": the Unit number or lesson where this word appears (e.g. 11, 12, 13, ..., 20)

Return ONLY valid JSON array of objects (no markdown blocks, no backticks, no comments).
Example format:
[
  { "en": "living room", "phonetic": "/ˈlɪvɪŋ ruːm/", "word_class": "n.", "vi": "phòng khách", "unit": 11 },
  ...
]`;

  try {
    const raw = await callWithRetry(base64, prompt);
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(clean);
    console.log(`Page ${pageFile}: extracted ${parsed.length} words!`);
    allWords.push(...parsed);
  } catch (e) {
    console.error(`Error processing ${pageFile}:`, e);
  }

  // Delay 15 seconds to avoid per-minute rate limits
  console.log('Waiting 15 seconds before next page...');
  await new Promise(r => setTimeout(r, 15000));
}

console.log(`\nTotal words extracted for Tập 2: ${allWords.length}`);
fs.writeFileSync('d:/engl/vocakids/scratch/extracted_sgk4_tap2_words.json', JSON.stringify(allWords, null, 2), 'utf-8');
console.log('Saved to d:/engl/vocakids/scratch/extracted_sgk4_tap2_words.json');
