import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const dir = 'd:/engl/vocakids/scratch/glossary';
const files = ['page_2_image.jpg', 'page_3_image.jpg', 'page_4_image.jpg'];

for (const file of files) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;
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
        text: 'Transcribe the complete Table of Contents or list of all Units, Topics, and Vocabulary listed on this page. Output in clear markdown format.',
      },
    ]);
    console.log(result.response.text());
  } catch (e) {
    console.error(`Error analyzing ${file}:`, e.message);
  }
}
