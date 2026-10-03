import fs from 'fs';

const vocabContent = fs.readFileSync('d:/engl/vocakids/src/lib/vocabulary.ts', 'utf-8');
const lop5Code = fs.readFileSync('d:/engl/vocakids/scratch/lop5_code.ts', 'utf-8');

const startIdx = vocabContent.indexOf('// LỚP 5');
if (startIdx === -1) {
  console.error('Cannot find // LỚP 5');
  process.exit(1);
}

const actualStart = vocabContent.lastIndexOf('// ════════════════════════════════════════', startIdx);
const endMarker = 'let _cachedRaw: string | null = null;';
const endIdx = vocabContent.indexOf(endMarker);

if (actualStart === -1 || endIdx === -1) {
  console.error('Markers not found');
  process.exit(1);
}

const closeBracketIdx = vocabContent.lastIndexOf('];', endIdx);
if (closeBracketIdx === -1) {
  console.error('closeBracketIdx not found');
  process.exit(1);
}

const newVocab = vocabContent.substring(0, actualStart) + lop5Code + '\n];\n\n' + vocabContent.substring(endIdx);
fs.writeFileSync('d:/engl/vocakids/src/lib/vocabulary.ts', newVocab, 'utf-8');
console.log('Successfully updated src/lib/vocabulary.ts with 20 Units of Lớp 5!');
