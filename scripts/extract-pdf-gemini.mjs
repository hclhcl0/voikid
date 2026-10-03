import { GoogleAIFileManager, FileState } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const apiKey = process.env.GEMINI_API_KEY || '';
const fileManager = new GoogleAIFileManager(apiKey);
const genAI = new GoogleGenerativeAI(apiKey);

const pdfPath = 'C:\\Users\\SingPC\\Downloads\\SGK Tiếng Anh 1- Global Success-mau.pdf';

async function main() {
  console.log('Uploading PDF to Gemini File API...');
  const uploadResult = await fileManager.uploadFile(pdfPath, {
    mimeType: 'application/pdf',
    displayName: 'SGK Tiếng Anh 1 Global Success',
  });

  console.log(`Uploaded as: ${uploadResult.file.name}`);
  let file = await fileManager.getFile(uploadResult.file.name);

  while (file.state === FileState.PROCESSING) {
    console.log('Waiting for file processing...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    file = await fileManager.getFile(uploadResult.file.name);
  }

  if (file.state === FileState.FAILED) {
    throw new Error('Video/File processing failed.');
  }

  console.log('File is ACTIVE and ready! Generating vocabulary with gemini-2.5-flash...');

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Đây là tài liệu/sách giáo khoa Tiếng Anh 1 - Global Success (bản mẫu / sách giáo khoa).
Hãy phân tích kỹ các trang trong sách và trích xuất TOÀN BỘ từ vựng trọng tâm theo từng Unit / Chủ đề cho học sinh Lớp 1 (Grade 1).

Yêu cầu xuất ra định dạng JSON như sau:
{
  "book": "Tiếng Anh 1 - Global Success",
  "units": [
    {
      "unit": 1,
      "title": "Tên Unit (tiếng Anh và tiếng Việt)",
      "topic": "Chủ đề (ví dụ: Chào hỏi, Gia đình, Động vật, Màu sắc...)",
      "words": [
        {
          "en": "Hello",
          "vi": "Xin chào",
          "phonetic": "/həˈləʊ/",
          "emoji": "👋",
          "example_en": "Hello, I am Ba.",
          "example_vi": "Xin chào, mình là Ba."
        }
      ]
    }
  ]
}

Chỉ trả về JSON thuần tuý, không kèm markdown, không giải thích gì thêm.`;

  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResult.file.mimeType,
        fileUri: uploadResult.file.uri,
      },
    },
    { text: prompt },
  ]);

  const rawText = result.response.text();
  console.log('Result received!');
  const cleaned = rawText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

  fs.writeFileSync('d:\\engl\\vocakids\\scripts\\extracted-grade1.json', cleaned, 'utf-8');
  console.log('Saved to d:\\engl\\vocakids\\scripts\\extracted-grade1.json');
}

main().catch(console.error);
