import fs from 'fs';

const text = fs.readFileSync('d:/engl/vocakids/data/tu-vung-tieng-anh-lop-3-v2.txt', 'utf8');
const lines = text.split(/\r?\n/);

let currentSection = null;
const sections = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('===') || trimmed.startsWith('---') || trimmed.startsWith('PHẦN ')) {
    continue;
  }
  
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const title = trimmed.slice(1, -1);
    currentSection = { title, words: [], sentences: [], phonics: [] };
    sections.push(currentSection);
    continue;
  }
  
  if (!currentSection) continue;

  if (trimmed.startsWith('- Phonics:')) {
    currentSection.phonics.push(trimmed.replace('- Phonics:', '').trim());
  } else if (trimmed.startsWith('* Mẫu câu:')) {
    currentSection.sentences.push(trimmed.replace('* Mẫu câu:', '').trim());
  } else if (trimmed.startsWith('-')) {
    // Word line: - hello /həˈloʊ/: xin chào
    const content = trimmed.slice(1).trim();
    const slashIdx = content.indexOf('/');
    if (slashIdx !== -1) {
      const en = content.slice(0, slashIdx).trim();
      const rest = content.slice(slashIdx);
      const colonIdx = rest.indexOf(':');
      let phonetic = '';
      let vi = '';
      if (colonIdx !== -1) {
        phonetic = rest.slice(0, colonIdx).trim();
        vi = rest.slice(colonIdx + 1).trim();
      } else {
        phonetic = rest.trim();
      }
      currentSection.words.push({ en, phonetic, vi });
    } else {
      const colonIdx = content.indexOf(':');
      if (colonIdx !== -1) {
        const en = content.slice(0, colonIdx).trim();
        const vi = content.slice(colonIdx + 1).trim();
        currentSection.words.push({ en, phonetic: '', vi });
      }
    }
  }
}

console.log(`Parsed ${sections.length} sections:`);
let total = 0;
for (const s of sections) {
  console.log(`- ${s.title}: ${s.words.length} words`);
  total += s.words.length;
}
console.log(`Total words: ${total}`);
