import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const dir = 'd:/engl/vocakids/scratch/glossary';
const pages = ['page_80_image.jpg', 'page_81_image.jpg', 'page_82_image.jpg'];

const allWords = [];

for (const pageFile of pages) {
  const filePath = path.join(dir, pageFile);
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');

  console.log(`\nExtracting all words from ${pageFile}...`);

  const prompt = `This image is a Wordlist / Glossary page from the Grade 4 English textbook (Tiếng Anh 4 Tập 1 - Kết nối tri thức).
Transcribe EVERY SINGLE word/entry on this page into a JSON array.
For each entry, extract:
- "en": the exact English word or phrase (e.g. "activity", "America", "art", "April", etc.)
- "phonetic": the phonetic transcription (IPA, e.g. "/ækˈtɪvəti/")
- "word_class": (e.g. "n.", "v.", "adj.", if available)
- "vi": the Vietnamese meaning exactly as printed (e.g. "hoạt động", "nước Mỹ")
- "unit": the Unit number or lesson where this word appears (e.g. 1, 2, 3... or "Starter", if shown in the table)

Return ONLY valid JSON array of objects (no markdown, no backticks, no comments).
Example format:
[
  { "en": "activity", "phonetic": "/ækˈtɪvəti/", "word_class": "n.", "vi": "hoạt động", "unit": 5 },
  ...
]`;

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64,
          mimeType: 'image/jpeg',
        },
      },
      { text: prompt },
    ]);

    const raw = result.response.text().trim();
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(clean);
    console.log(`Successfully extracted ${parsed.length} words from ${pageFile}!`);
    allWords.push(...parsed);
  } catch (e) {
    console.error(`Error on ${pageFile}:`, e.message);
  }
}

console.log(`\nTotal words extracted: ${allWords.length}`);
fs.writeFileSync('d:/engl/vocakids/scratch/extracted_sgk4_words.json', JSON.stringify(allWords, null, 2), 'utf-8');
console.log('Saved to d:/engl/vocakids/scratch/extracted_sgk4_words.json');
