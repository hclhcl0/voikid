import fs from 'fs';
import { LOP3_CATEGORIES } from './generate_lop3.mjs';

const vocabPath = 'd:/engl/vocakids/src/lib/vocabulary.ts';
const content = fs.readFileSync(vocabPath, 'utf8');

console.log(`Loaded ${LOP3_CATEGORIES.length} categories for Lớp 3.`);

function serializeCategory(cat) {
  const wordsStr = cat.words.map(w => {
    const idPad = `'${w.id}',`.padEnd(28);
    const enPad = `${JSON.stringify(w.en)},`.padEnd(20);
    const viPad = `${JSON.stringify(w.vi)},`.padEnd(36);
    const emojiPad = `${JSON.stringify(w.emoji)},`.padEnd(8);
    const phonePad = `${JSON.stringify(w.phonetic)},`.padEnd(22);
    const exEn = JSON.stringify(w.example_en);
    const exVi = JSON.stringify(w.example_vi);
    return `      { id: ${idPad} en: ${enPad} vi: ${viPad} emoji: ${emojiPad} phonetic: ${phonePad} example_en: ${exEn}, example_vi: ${exVi} },`;
  }).join('\n');

  return `  // ── ${cat.name_en.toUpperCase()} ──
  {
    id: '${cat.id}',
    gradeId: '${cat.gradeId}',
    name_vi: '${cat.name_vi}',
    name_en: '${cat.name_en}',
    emoji: '${cat.emoji}',
    color: '${cat.color}',
    gradient: '${cat.gradient}',
    words: [
${wordsStr}
    ],
  },`;
}

const lop3TypeScript = `  // ════════════════════════════════════════
  // LỚP 3 (SGK GLOBAL SUCCESS + CAMBRIDGE MỞ RỘNG - 31 UNITS)
  // ════════════════════════════════════════

` + LOP3_CATEGORIES.map(serializeCategory).join('\n\n');

// Find start and end markers
const startMarker = `// LỚP 3`;
const lop3TextIdx = content.indexOf(startMarker);
if (lop3TextIdx === -1) {
  console.error('Marker "LỚP 3" not found');
  process.exit(1);
}

const startIdx = content.lastIndexOf('// ════════════════════════════════════════', lop3TextIdx);

const endMarker = `// LỚP 4 – SGK Tiếng Anh 4 Tập 1`;
const lop4TextIdx = content.indexOf(endMarker);
if (lop4TextIdx === -1) {
  console.error('Marker "LỚP 4 – SGK Tiếng Anh 4 Tập 1" not found');
  process.exit(1);
}

const endIdx = content.lastIndexOf('// ════════════════════════════════════════', lop4TextIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error(`Boundary indices error: startIdx=${startIdx}, endIdx=${endIdx}`);
  process.exit(1);
}

const updatedContent = content.substring(0, startIdx) + lop3TypeScript + '\n\n  ' + content.substring(endIdx);
fs.writeFileSync(vocabPath, updatedContent, 'utf8');

console.log('Successfully replaced Lớp 3 categories with complete 31 units in src/lib/vocabulary.ts!');
