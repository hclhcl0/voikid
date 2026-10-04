import fs from 'fs';

function parseVocabFile(filepath) {
  const text = fs.readFileSync(filepath, 'utf8');
  const lines = text.split(/\r?\n/);
  const sections = [];
  let currentSec = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('===') || trimmed.startsWith('---') || trimmed.startsWith('PHẦN ')) {
      continue;
    }
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      currentSec = { title: trimmed.slice(1, -1), words: [] };
      sections.push(currentSec);
      continue;
    }
    // Also handle numbered subtopics like "1. Nghề nghiệp & Nơi làm việc hiện đại (Mở rộng từ Unit 5):"
    if (/^\d+\.\s+/.test(trimmed) && trimmed.endsWith(':')) {
      currentSec = { title: trimmed, words: [] };
      sections.push(currentSec);
      continue;
    }

    if (!currentSec) continue;

    // Word line starting with * or -
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
  return sections;
}

const sec4 = parseVocabFile('d:/engl/vocakids/data/tu-vung-tieng-anh-lop-4-v2.txt');
console.log('Lớp 4 sections:', sec4.length, 'total words:', sec4.reduce((s, c) => s + c.words.length, 0));
sec4.forEach((s, i) => console.log(`  ${i+1}. [${s.title}] (${s.words.length} words)`));

const sec5 = parseVocabFile('d:/engl/vocakids/data/tu-vung-tieng-anh-lop-5-v2.txt');
console.log('\nLớp 5 sections:', sec5.length, 'total words:', sec5.reduce((s, c) => s + c.words.length, 0));
sec5.forEach((s, i) => console.log(`  ${i+1}. [${s.title}] (${s.words.length} words)`));
