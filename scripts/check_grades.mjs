import fs from 'fs';

const content = fs.readFileSync('src/lib/vocabulary.ts', 'utf8');
const grades = ['maugiao', 'lop1', 'lop2', 'lop3', 'lop4', 'lop5'];
for (const g of grades) {
  const count = content.split("gradeId: '" + g + "'").length - 1;
  console.log(`${g}: ${count} categories`);
}
