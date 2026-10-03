import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const dir = 'd:/engl/vocakids/scratch/glossary';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();

console.log('Files to OCR:', files);

for (const file of files) {
  const filePath = path.join(dir, file);
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');

  console.log(`\n=== Analyzing ${file} ===`);
  try {
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64,
          mimeType: 'image/jpeg',
        },
      },
      {
        text: 'Describe what this page is in 2 sentences. If this is a Glossary (Bảng tra từ) or Table of Contents (Mục lục), list the first 5 words or units you see.',
      },
    ]);
    console.log(result.response.text());
  } catch (e) {
    console.error(`Error analyzing ${file}:`, e.message);
  }
}
