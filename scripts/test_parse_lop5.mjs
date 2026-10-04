import fs from 'fs';

const rawText = fs.readFileSync('d:/engl/vocakids/data/tu-vung-tieng-anh-lop-5-v2.txt', 'utf8');
const lines = rawText.split(/\r?\n/);

const sections = [];
let currentSec = null;

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('===') || trimmed.startsWith('---') || trimmed.startsWith('PHẦN ')) {
    continue;
  }
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    // If it's a super header like [MỜI RỘNG CHỦ ĐIỂM 1: ME AND MY FRIENDS], skip making it a word category
    if (trimmed.includes('MỜI RỘNG CHỦ ĐIỂM') || trimmed.includes('MỞ RỘNG CHỦ ĐIỂM')) {
      continue;
    }
    currentSec = { title: trimmed.slice(1, -1), words: [] };
    sections.push(currentSec);
    continue;
  }
  if (/^\d+\.\s+/.test(trimmed) && trimmed.endsWith(':')) {
    currentSec = { title: trimmed.slice(0, -1), words: [] };
    sections.push(currentSec);
    continue;
  }

  if (!currentSec) continue;

  if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
    if (trimmed.startsWith('* Mẫu câu:') || trimmed.startsWith('- Phonics:') || trimmed.startsWith('- Stress:') || trimmed.startsWith('- Intonation:') || trimmed.startsWith('- Key Structures:') || trimmed.startsWith('- Vocabulary:')) {
      continue;
    }
    const raw = trimmed.replace(/^[\*\-]\s*/, '').trim();

    const slashIdx = raw.indexOf('/');
    if (slashIdx !== -1) {
      const en = raw.slice(0, slashIdx).trim();
      const rest = raw.slice(slashIdx);
      const colonIdx = rest.indexOf(':');
      let phonetic = '';
      let vi = '';
      if (colonIdx !== -1) {
        phonetic = rest.slice(0, colonIdx).trim();
        vi = rest.slice(colonIdx + 1).trim();
      } else {
        phonetic = rest.trim();
      }
      currentSec.words.push({ en, phonetic, vi });
    } else {
      const colonIdx = raw.indexOf(':');
      if (colonIdx !== -1) {
        const en = raw.slice(0, colonIdx).trim();
        const vi = raw.slice(colonIdx + 1).trim();
        currentSec.words.push({ en, phonetic: '', vi });
      }
    }
  }
}

console.log(`Lớp 5: Parsed ${sections.length} sections, total ${sections.reduce((s, c) => s + c.words.length, 0)} words.`);
sections.forEach((s, i) => console.log(`Section ${i+1}: ${s.title} -> ${s.words.length} words`));
