import fs from 'fs';
import { LOP2_CATEGORIES } from './generate_lop2.mjs';

const vocabPath = 'd:/engl/vocakids/src/lib/vocabulary.ts';
const content = fs.readFileSync(vocabPath, 'utf8');

// Validate data
console.log(`Loaded ${LOP2_CATEGORIES.length} categories for Lớp 2.`);
let totalWords = 0;
const wordIds = new Set();

for (const cat of LOP2_CATEGORIES) {
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
console.log(`Validated: ${LOP2_CATEGORIES.length} categories, ${totalWords} total words. Zero duplicate IDs.`);

// Generate the TypeScript code block for Lớp 2
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

const lop2TypeScript = `  // ════════════════════════════════════════
  // LỚP 2 (SGK GLOBAL SUCCESS + MỞ RỘNG)
  // ════════════════════════════════════════

` + LOP2_CATEGORIES.map(serializeCategory).join('\n\n');

// Find insertion boundaries
const startMarker = `// ── TRANSPORT ────────────────────────────`;
const endMarker = `// LỚP 3`;

const startIdx = content.indexOf(startMarker);
const lop3Idx = content.indexOf(endMarker);

if (startIdx === -1 || lop3Idx === -1) {
  console.error(`Markers not found in vocabulary.ts: startIdx=${startIdx}, lop3Idx=${lop3Idx}`);
  process.exit(1);
}

// Find the section divider comment above Lớp 3
const endIdx = content.lastIndexOf('// ════════════════════════════════════════', lop3Idx);
if (endIdx === -1) {
  console.error(`Divider marker before Lớp 3 not found`);
  process.exit(1);
}

const updatedContent = content.substring(0, startIdx) + lop2TypeScript + '\n\n' + content.substring(endIdx);
fs.writeFileSync(vocabPath, updatedContent, 'utf8');

console.log('Successfully replaced legacy transport category with 25 Grade 2 categories in src/lib/vocabulary.ts!');
