import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const raw = fs.readFileSync('d:/engl/vocakids/scratch/extracted_sgk4_words.json', 'utf-8');
const words = JSON.parse(raw);

console.log(`Loaded ${words.length} extracted words from PDF Wordlist.`);

const prompt = `You are an expert Vietnamese English textbook editor for primary school (Tiếng Anh 4 Global Success - Tập 1).
Here is the complete list of 89 words extracted from the official SGK Tiếng Anh 4 Tập 1 Wordlist:
${JSON.stringify(words, null, 2)}

Your task is to organize ALL of these words (without omitting ANY word) into the official Grade 4 categories matching the textbook Units:

Category list:
1. id: "lop4_u1_friends", name_vi: "Unit 1: Bạn Bè & Quốc Gia", name_en: "Unit 1: My Friends", emoji: "🌍", color: "from-cyan-400 to-blue-500", gradient: "bg-gradient-to-br from-cyan-100 to-blue-100"
2. id: "lop4_u2_time", name_vi: "Unit 2: Thời Gian & Thói Quen", name_en: "Unit 2: Time & Daily Routines", emoji: "⏰", color: "from-amber-400 to-orange-500", gradient: "bg-gradient-to-br from-amber-100 to-orange-100"
3. id: "lop4_u3_week", name_vi: "Unit 3: Các Ngày Trong Tuần", name_en: "Unit 3: My Week", emoji: "📅", color: "from-emerald-400 to-teal-500", gradient: "bg-gradient-to-br from-emerald-100 to-teal-100"
4. id: "lop4_u4_birthday", name_vi: "Unit 4: Sinh Nhật & 12 Tháng", name_en: "Unit 4: My Birthday", emoji: "🎂", color: "from-pink-400 to-rose-500", gradient: "bg-gradient-to-br from-pink-100 to-rose-100"
5. id: "lop4_u5_skills", name_vi: "Unit 5: Việc Em Có Thể Làm", name_en: "Unit 5: Things We Can Do", emoji: "🤸", color: "from-violet-400 to-purple-500", gradient: "bg-gradient-to-br from-violet-100 to-purple-100"
6. id: "lop4_u6_school", name_vi: "Unit 6: Trường Học Của Em", name_en: "Unit 6: Our School", emoji: "🏫", color: "from-blue-400 to-indigo-500", gradient: "bg-gradient-to-br from-blue-100 to-indigo-100"
7. id: "lop4_u7_8_subjects", name_vi: "Unit 7-8: Các Môn Học", name_en: "Unit 7-8: School Subjects", emoji: "📚", color: "from-lime-400 to-green-500", gradient: "bg-gradient-to-br from-lime-100 to-green-100"
8. id: "lop4_u9_sports", name_vi: "Unit 9: Hội Thao & Vui Chơi", name_en: "Unit 9: Our Sports Day", emoji: "🏆", color: "from-yellow-400 to-amber-500", gradient: "bg-gradient-to-br from-yellow-100 to-amber-100"
9. id: "lop4_u10_camp", name_vi: "Unit 10: Trại Hè & Quê Hương", name_en: "Unit 10: Our Summer Camp", emoji: "🏕️", color: "from-orange-400 to-red-500", gradient: "bg-gradient-to-br from-orange-100 to-red-100"

For EVERY single word:
- id: a clean lowercase string (e.g. "l4_vietnam", "l4_monday", "l4_get_up", etc.)
- en: exact English word (e.g. "Viet Nam", "get up", "Monday")
- vi: exact Vietnamese meaning from the textbook
- phonetic: exact IPA pronunciation from the textbook
- emoji: an appropriate fun emoji (e.g. 🇻🇳, ⏰, 📅, 🎂, etc.)
- example_en: a simple, natural example sentence suitable for 4th graders (e.g. "I am from Viet Nam.")
- example_vi: accurate Vietnamese translation of example_en (e.g. "Tôi đến từ Việt Nam.")

Make sure EVERY ONE of the 89 words is assigned to one of the categories. Words like chips, grape, jam, lemonade, hat can go to Unit 4 (Party food) or Unit 9/10 (Camp snacks).
Return ONLY a valid JSON array of categories. No markdown, no backticks.
Each category object has:
{
  "id": "...",
  "gradeId": "lop4",
  "name_vi": "...",
  "name_en": "...",
  "emoji": "...",
  "color": "...",
  "gradient": "...",
  "words": [ ... ]
}
`;

console.log('Sending prompt to Gemini...');
const result = await model.generateContent([{ text: prompt }]);
const text = result.response.text().trim();
const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

try {
  const cats = JSON.parse(clean);
  console.log(`Generated ${cats.length} categories!`);
  let totalW = 0;
  for (const c of cats) {
    console.log(`- ${c.name_vi} (${c.id}): ${c.words.length} words`);
    totalW += c.words.length;
  }
  console.log(`Total words in categories: ${totalW}`);
  fs.writeFileSync('d:/engl/vocakids/scratch/lop4_generated_categories.json', JSON.stringify(cats, null, 2), 'utf-8');
  console.log('Saved to d:/engl/vocakids/scratch/lop4_generated_categories.json');
} catch (e) {
  console.error('JSON parse error:', e.message);
  fs.writeFileSync('d:/engl/vocakids/scratch/gemini_raw_lop4.txt', text, 'utf-8');
}
