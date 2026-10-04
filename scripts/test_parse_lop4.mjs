import fs from 'fs';

const rawText = fs.readFileSync('d:/engl/vocakids/data/tu-vung-tieng-anh-lop-4-v2.txt', 'utf8');
const lines = rawText.split(/\r?\n/);

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
  if (!currentSec) continue;

  if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
    if (trimmed.startsWith('* Mẫu câu:') || trimmed.startsWith('- Phonics:') || trimmed.startsWith('- Stress:') || trimmed.startsWith('- Intonation:') || trimmed.startsWith('- Key Structures:') || trimmed.startsWith('- Vocabulary:')) {
      continue;
    }
    const raw = trimmed.replace(/^[\*\-]\s*/, '').trim();

    // Check if it's "phrase (translation)" without colon
    const parenMatch = raw.match(/^([^(]+)\s*\(([^)]+)\)$/);
    if (parenMatch && !raw.includes('/') && !raw.includes(':')) {
      currentSec.words.push({
        en: parenMatch[1].trim(),
        phonetic: '',
        vi: parenMatch[2].trim()
      });
      continue;
    }

    // Check if it's country -> nationality: Vietnam /ˌvjet ˈnæm/ -> Vietnamese /ˌvjetnəˈmiːz/: Nước Việt Nam -> Người / Tiếng Việt
    if (raw.includes('->')) {
      const parts = raw.split(':');
      const left = parts[0];
      const right = parts[1] || '';
      const leftParts = left.split('->');
      const rightParts = right.split('->');
      
      leftParts.forEach((lp, idx) => {
        const slashIdx = lp.indexOf('/');
        let en = lp.trim();
        let phonetic = '';
        if (slashIdx !== -1) {
          en = lp.slice(0, slashIdx).trim();
          phonetic = lp.slice(slashIdx).replace(/\//g, '').trim();
          phonetic = `/${phonetic}/`;
        }
        const vi = (rightParts[idx] || rightParts[0] || '').trim();
        currentSec.words.push({ en, phonetic, vi });
      });
      continue;
    }

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

console.log(`Lớp 4: Parsed ${sections.length} sections, total ${sections.reduce((s, c) => s + c.words.length, 0)} words.`);
sections.forEach((s, i) => console.log(`Section ${i+1}: ${s.title} -> ${s.words.length} words`));
