import fs from 'fs';

// Color palettes
const LOP4_COLORS = [
  { color: 'from-cyan-400 to-blue-500', gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100' },
  { color: 'from-blue-400 to-indigo-500', gradient: 'bg-gradient-to-br from-blue-100 to-indigo-100' },
  { color: 'from-indigo-400 to-purple-500', gradient: 'bg-gradient-to-br from-indigo-100 to-purple-100' },
  { color: 'from-teal-400 to-emerald-500', gradient: 'bg-gradient-to-br from-teal-100 to-emerald-100' },
  { color: 'from-emerald-400 to-green-500', gradient: 'bg-gradient-to-br from-emerald-100 to-green-100' },
  { color: 'from-sky-400 to-blue-500', gradient: 'bg-gradient-to-br from-sky-100 to-blue-100' },
  { color: 'from-amber-400 to-orange-500', gradient: 'bg-gradient-to-br from-amber-100 to-orange-100' },
  { color: 'from-rose-400 to-pink-500', gradient: 'bg-gradient-to-br from-rose-100 to-pink-100' },
];

const LOP5_COLORS = [
  { color: 'from-violet-400 to-purple-500', gradient: 'bg-gradient-to-br from-violet-100 to-purple-100' },
  { color: 'from-purple-400 to-fuchsia-500', gradient: 'bg-gradient-to-br from-purple-100 to-fuchsia-100' },
  { color: 'from-fuchsia-400 to-pink-500', gradient: 'bg-gradient-to-br from-fuchsia-100 to-pink-100' },
  { color: 'from-indigo-400 to-violet-500', gradient: 'bg-gradient-to-br from-indigo-100 to-violet-100' },
  { color: 'from-pink-400 to-rose-500', gradient: 'bg-gradient-to-br from-pink-100 to-rose-100' },
  { color: 'from-rose-400 to-orange-500', gradient: 'bg-gradient-to-br from-rose-100 to-orange-100' },
  { color: 'from-teal-400 to-cyan-500', gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100' },
  { color: 'from-emerald-400 to-teal-500', gradient: 'bg-gradient-to-br from-emerald-100 to-teal-100' },
];

function cleanTitle(raw) {
  return raw.replace(/\[|\]/g, '').trim();
}

function makeSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

function parseFile(filepath) {
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

      const parenMatch = raw.match(/^([^(]+)\s*\(([^)]+)\)$/);
      if (parenMatch && !raw.includes('/') && !raw.includes(':')) {
        currentSec.words.push({
          en: parenMatch[1].trim(),
          phonetic: '',
          vi: parenMatch[2].trim()
        });
        continue;
      }

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
  return sections;
}

// Emoji resolver
const EMOJI_MAP = {
  'america': '🇺🇸', 'australia': '🇦🇺', 'britain': '🇬🇧', 'japan': '🇯🇵', 'malaysia': '🇲🇾', 'singapore': '🇸🇬', 'thailand': '🇹🇭', 'viet nam': '🇻🇳', 'vietnam': '🇻🇳',
  'vietnamese': '🇻🇳', 'english': '🇬🇧', 'american': '🇺🇸', 'japanese': '🇯🇵', 'chinese': '🇨🇳', 'china': '🇨🇳', 'korea': '🇰🇷', 'korean': '🇰🇷', 'france': '🇫🇷', 'french': '🇫🇷',
  'monday': '📅', 'tuesday': '📅', 'wednesday': '📅', 'thursday': '📅', 'friday': '📅', 'saturday': '📅', 'sunday': '📅',
  'january': '🗓️', 'february': '🗓️', 'march': '🗓️', 'april': '🗓️', 'may': '🗓️', 'june': '🗓️', 'july': '🗓️', 'august': '🗓️', 'september': '🗓️', 'october': '🗓️', 'november': '🗓️', 'december': '🗓️',
  'cook': '👨‍🍳', 'draw': '🎨', 'swim': '🏊', 'guitar': '🎸', 'piano': '🎹', 'bike': '🚲', 'horse': '🐎', 'roller skate': '🛼',
  'city': '🏙️', 'mountains': '⛰️', 'village': '🏡', 'town': '🏘️', 'building': '🏢', 'flat': '🏬', 'tower': '🗼', 'house': '🏠',
  'dolphin': '🐬', 'whale': '🐋', 'shark': '🦈', 'kangaroo': '🦘', 'panda': '🐼', 'tiger': '🐯', 'lion': '🦁', 'crocodile': '🐊', 'giraffe': '🦒', 'hippo': '🦛', 'peacock': '🦚',
  'coat': '🧥', 'jacket': '🧥', 'sweater': '🧶', 'boots': '👢', 'scarf': '🧣', 'gloves': '🧤', 'belt': '🥋', 'raincoat': '🧥', 'cap': '🧢', 'glasses': '👓', 'skirt': '🩰', 't-shirt': '👕',
  'fever': '🤒', 'cough': '😷', 'cold': '🤧', 'headache': '🤕', 'toothache': '🦷', 'stomach ache': '🤢', 'medicine': '💊', 'hospital': '🏥', 'ambulance': '🚑',
  'pho': '🍜', 'banh mi': '🥖', 'banh chung': '🍱', 'spring roll': '🥟', 'sticky rice': '🍚', 'iced coffee': '☕', 'milk tea': '🧋',
  'tet holiday': '🧧', 'lantern': '🏮', 'dragon dance': '🐉', 'lucky money': '🧧', 'peach blossom': '🌸', 'apricot blossom': '🌼',
  'firefighter': '🧑‍🚒', 'gardener': '🧑‍🌾', 'reporter': '🎤', 'writer': '✍️', 'dentist': '🧑‍⚕️', 'pilot': '👨‍✈️', 'scientist': '🧑‍🔬', 'engineer': '👷', 'astronaut': '👨‍🚀',
  'smartphone': '📱', 'laptop': '💻', 'website': '🌐', 'video game': '🎮', 'social media': '📲',
  'volcano': '🌋', 'waterfall': '🌊', 'rainforest': '🌴', 'desert': '🏜️', 'fairy tale': '🧚', 'dragon': '🐲', 'king': '👑', 'queen': '👸', 'prince': '🤴', 'princess': '👸',
  'underground': '🚇', 'helicopter': '🚁', 'cruise ship': '🛳️', 'passport': '🛂', 'airport': '🛫',
  'ha long bay': '🏞️', 'hoan kiem lake': '🐢', 'one pillar pagoda': '🛕', 'hoi an ancient town': '🏮', 'phu quoc island': '🏝️', 'ba na hills': '🌁',
};

function getEmoji(en, fallback) {
  const low = en.toLowerCase().trim();
  for (const [k, v] of Object.entries(EMOJI_MAP)) {
    if (low.includes(k)) return v;
  }
  return fallback || '📘';
}

function makeSentence(en, vi) {
  const low = en.toLowerCase().trim();
  const cleanEn = en.trim();
  const cleanVi = vi ? vi.trim() : '';

  if (low.includes('good morning')) return { en: 'Good morning! Have a nice day.', vi: 'Chào buổi sáng! Chúc bạn một ngày tốt lành.' };
  if (low.includes('excuse me')) return { en: 'Excuse me! Can you help me?', vi: 'Xin lỗi cho mình hỏi! Bạn có thể giúp mình không?' };
  if (low.includes('how much')) return { en: 'How much is this red T-shirt?', vi: 'Chiếc áo thun đỏ này giá bao nhiêu?' };
  if (low.includes('what time')) return { en: 'What time does the lesson start?', vi: 'Mấy giờ thì tiết học bắt đầu?' };
  if (low.includes('looking for')) return { en: "I am looking for the city library.", vi: 'Tôi đang tìm kiếm thư viện thành phố.' };
  if (low.includes('would you like')) return { en: 'Would you like some fresh orange juice?', vi: 'Bạn có muốn dùng một ít nước cam tươi không?' };
  if (low.includes('nice to see you')) return { en: 'Nice to see you again at school!', vi: 'Rất vui được gặp lại bạn ở trường!' };

  if (low.startsWith('play the ')) return { en: `He practices to ${low} every evening.`, vi: `Cậu ấy tập ${cleanVi.toLowerCase()} vào mỗi buổi tối.` };
  if (low.startsWith('play ')) return { en: `We like to ${low} after school.`, vi: `Chúng mình thích ${cleanVi.toLowerCase()} sau giờ học.` };
  if (low.startsWith('go to ')) return { en: `Students ${low} on weekdays.`, vi: `Các bạn học sinh ${cleanVi.toLowerCase()} vào các ngày trong tuần.` };
  if (low.startsWith('surf the internet')) return { en: 'I surf the Internet to find information.', vi: 'Tôi lướt mạng Internet để tìm kiếm thông tin.' };
  if (low.startsWith('water the flowers')) return { en: 'She helps grandma water the flowers.', vi: 'Cô bé giúp bà tưới hoa trong vườn.' };

  return {
    en: `We learn about ${cleanEn.toLowerCase()} in English class.`,
    vi: `Chúng mình học về ${cleanVi.toLowerCase()} trong giờ tiếng Anh.`
  };
}

function serializeCategories(categories) {
  return categories.map(cat => {
    const wordsStr = cat.words.map(w => {
      const idPad = `'${w.id}',`.padEnd(28);
      const enPad = `${JSON.stringify(w.en)},`.padEnd(22);
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
    name_vi: ${JSON.stringify(cat.name_vi)},
    name_en: ${JSON.stringify(cat.name_en)},
    emoji: '${cat.emoji}',
    color: '${cat.color}',
    gradient: '${cat.gradient}',
    words: [
${wordsStr}
    ],
  },`;
  }).join('\n\n');
}

// 1. Process Lớp 4
const sec4 = parseFile('d:/engl/vocakids/data/tu-vung-tieng-anh-lop-4-v2.txt');
const lop4Categories = sec4.map((s, idx) => {
  const colorObj = LOP4_COLORS[idx % LOP4_COLORS.length];
  const catId = `lop4_c${idx + 1}_${makeSlug(s.title).slice(0, 20)}`;
  const title = s.title.replace(/^UNIT \d+:\s*/i, '');
  const emoji = getEmoji(s.title, '🌊');

  const words = s.words.map((w, wIdx) => {
    const cleanEn = w.en.trim();
    const capEn = cleanEn.charAt(0).toUpperCase() + cleanEn.slice(1);
    const id = `l4_s${idx + 1}_${wIdx + 1}_${makeSlug(cleanEn).slice(0, 18)}`;
    const sent = makeSentence(cleanEn, w.vi);
    const wordEmoji = getEmoji(cleanEn, emoji);
    return {
      id,
      en: capEn,
      vi: w.vi,
      emoji: wordEmoji,
      phonetic: w.phonetic,
      example_en: sent.en,
      example_vi: sent.vi
    };
  });

  return {
    id: catId,
    gradeId: 'lop4',
    name_vi: s.title,
    name_en: s.title,
    emoji,
    color: colorObj.color,
    gradient: colorObj.gradient,
    words
  };
});

// 2. Process Lớp 5
const sec5 = parseFile('d:/engl/vocakids/data/tu-vung-tieng-anh-lop-5-v2.txt');
const lop5Categories = sec5.map((s, idx) => {
  const colorObj = LOP5_COLORS[idx % LOP5_COLORS.length];
  const catId = `lop5_c${idx + 1}_${makeSlug(s.title).slice(0, 20)}`;
  const emoji = getEmoji(s.title, '🔮');

  const words = s.words.map((w, wIdx) => {
    const cleanEn = w.en.trim();
    const capEn = cleanEn.charAt(0).toUpperCase() + cleanEn.slice(1);
    const id = `l5_s${idx + 1}_${wIdx + 1}_${makeSlug(cleanEn).slice(0, 18)}`;
    const sent = makeSentence(cleanEn, w.vi);
    const wordEmoji = getEmoji(cleanEn, emoji);
    return {
      id,
      en: capEn,
      vi: w.vi,
      emoji: wordEmoji,
      phonetic: w.phonetic,
      example_en: sent.en,
      example_vi: sent.vi
    };
  });

  return {
    id: catId,
    gradeId: 'lop5',
    name_vi: s.title,
    name_en: s.title,
    emoji,
    color: colorObj.color,
    gradient: colorObj.gradient,
    words
  };
});

console.log(`Lớp 4: ${lop4Categories.length} categories, ${lop4Categories.reduce((s, c) => s + c.words.length, 0)} words.`);
console.log(`Lớp 5: ${lop5Categories.length} categories, ${lop5Categories.reduce((s, c) => s + c.words.length, 0)} words.`);

// 3. Splice into src/lib/vocabulary.ts
const vocabPath = 'd:/engl/vocakids/src/lib/vocabulary.ts';
const content = fs.readFileSync(vocabPath, 'utf8');

const lop4Marker = '// LỚP 4 – SGK Tiếng Anh 4 Tập 1';
const lop4Idx = content.indexOf(lop4Marker);
if (lop4Idx === -1) {
  console.error('lop4Marker not found');
  process.exit(1);
}
const startLop4 = content.lastIndexOf('// ════════════════════════════════════════', lop4Idx);

const endMarker = 'let _cachedRaw: string | null = null;';
const endIdx = content.indexOf(endMarker);
if (endIdx === -1) {
  console.error('endMarker not found');
  process.exit(1);
}
const closeBracketIdx = content.lastIndexOf('];', endIdx);
if (closeBracketIdx === -1) {
  console.error('closeBracketIdx not found');
  process.exit(1);
}

const lop4TypeScript = `  // ════════════════════════════════════════
  // LỚP 4 (SGK GLOBAL SUCCESS + MOVERS MỞ RỘNG + CHỦ ĐỀ VIỆT NAM - 36 CHỦ ĐỀ)
  // ════════════════════════════════════════

` + serializeCategories(lop4Categories);

const lop5TypeScript = `  // ════════════════════════════════════════
  // LỚP 5 (SGK GLOBAL SUCCESS + 4 CHỦ ĐIỂM MỞ RỘNG - 30 CHỦ ĐỀ)
  // ════════════════════════════════════════

` + serializeCategories(lop5Categories);

const updatedContent = content.substring(0, startLop4) +
  lop4TypeScript + '\n\n' +
  lop5TypeScript + '\n];\n\n' +
  content.substring(endIdx);

fs.writeFileSync(vocabPath, updatedContent, 'utf8');
console.log('Successfully updated vocabulary.ts with complete Lớp 4 (36 categories) and Lớp 5 (30 categories)!');
