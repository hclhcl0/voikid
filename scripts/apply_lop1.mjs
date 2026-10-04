import fs from 'fs';
import { LOP1_CATEGORIES } from './generate_lop1.mjs';

const vocabPath = 'd:/engl/vocakids/src/lib/vocabulary.ts';
const content = fs.readFileSync(vocabPath, 'utf8');

console.log(`Loaded ${LOP1_CATEGORIES.length} categories for Lớp 1.`);
let totalWords = 0;
const wordIds = new Set();

for (const cat of LOP1_CATEGORIES) {
  if (!cat.id || !cat.name_vi || !cat.name_en || !cat.emoji || !cat.color || !cat.gradient || !cat.words) {
    throw new Error(`Category ${cat.id} is missing required fields!`);
  }
  for (const w of cat.words) {
    if (!w.id || !w.en || !w.vi || !w.emoji || !w.phonetic || !w.example_en || !w.example_vi) {
      throw new Error(`Word in ${cat.id} (${w.en}) is missing required fields!`);
    }
    if (wordIds.has(w.id)) {
      throw new Error(`Duplicate word ID: ${w.id}`);
    }
    wordIds.add(w.id);
    totalWords++;
  }
}
console.log(`Validated: ${LOP1_CATEGORIES.length} categories, ${totalWords} total words. Zero duplicate IDs.`);

function serializeCategory(cat) {
  const wordsStr = cat.words.map(w => {
    const idPad = `'${w.id}',`.padEnd(23);
    const enPad = `'${w.en}',`.padEnd(16);
    const viPad = `'${w.vi}',`.padEnd(28);
    const emojiPad = `'${w.emoji}',`.padEnd(6);
    const phonePad = `'${w.phonetic}',`.padEnd(18);
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

const lop1TypeScript = `  // ════════════════════════════════════════
  // LỚP 1 (SGK GLOBAL SUCCESS + MỞ RỘNG)
  // ════════════════════════════════════════

` + LOP1_CATEGORIES.map(serializeCategory).join('\n\n');

// Find start and end markers
const startMarker = `// LỚP 1 – SGK Tiếng Anh 1 Global Success`;
const lop1TextIdx = content.indexOf(startMarker);
if (lop1TextIdx === -1) {
  console.error('Marker "LỚP 1 – SGK Tiếng Anh 1 Global Success" not found');
  process.exit(1);
}

const startIdx = content.lastIndexOf('// ════════════════════════════════════════', lop1TextIdx);

const endMarker = `// LỚP 2 (SGK GLOBAL SUCCESS + MỞ RỘNG)`;
const lop2TextIdx = content.indexOf(endMarker);
if (lop2TextIdx === -1) {
  console.error('Marker "LỚP 2 (SGK GLOBAL SUCCESS + MỞ RỘNG)" not found');
  process.exit(1);
}

const endIdx = content.lastIndexOf('// ════════════════════════════════════════', lop2TextIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error(`Boundary indices error: startIdx=${startIdx}, endIdx=${endIdx}`);
  process.exit(1);
}

const updatedContent = content.substring(0, startIdx) + lop1TypeScript + '\n\n  ' + content.substring(endIdx);
fs.writeFileSync(vocabPath, updatedContent, 'utf8');

console.log('Successfully replaced Lớp 1 categories with complete 24 units in src/lib/vocabulary.ts!');
