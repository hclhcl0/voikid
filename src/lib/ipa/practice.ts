import { ALL_44_IPA_SOUNDS } from '@/data/ipaChart';

export interface IpaPracticeRecord {
  profileId: string;
  sound: string;
  updatedAt: string;
  reviewDueAt: string;
  firstTry: boolean[];
  practicedSpeaking: boolean;
}

// Start with sounds that can be explored through familiar short words.
const order = ['m','s','f','p','b','t','d','n','k','ɡ','æ','e','ɪ','iː','ʌ','ʊ','uː','h','l','r','v','z','ʃ','tʃ','θ','ð','ŋ','w','j','dʒ','ʒ','ə','eɪ','aɪ','ɔɪ','aʊ','əʊ','ɑː','ɔː','ɜː','ɒ','ɪə','eə','ʊə'];
export const PRACTICE_SOUNDS = order.map(ipa => ALL_44_IPA_SOUNDS.find(sound => sound.ipa === ipa)!).filter(Boolean);

export const CONTRAST_WORDS: Record<string, { en: string; vi: string; emoji: string }> = {
  'ɪ': { en: 'sheep', vi: 'con cừu', emoji: '🐑' },
  'iː': { en: 'ship', vi: 'con tàu', emoji: '🚢' },
  'æ': { en: 'cut', vi: 'cắt', emoji: '✂️' },
  'ʌ': { en: 'cap', vi: 'mũ lưỡi trai', emoji: '🧢' },
  'e': { en: 'pin', vi: 'ghim', emoji: '📌' },
  'ʊ': { en: 'boot', vi: 'ủng', emoji: '🥾' },
  'uː': { en: 'man', vi: 'người đàn ông', emoji: '👨' },
  'p': { en: 'big', vi: 'to', emoji: '🐘' },
  'b': { en: 'pear', vi: 'quả lê', emoji: '🍐' },
  'f': { en: 'van', vi: 'xe tải nhỏ', emoji: '🚐' },
  'v': { en: 'fan', vi: 'quạt', emoji: '🪭' },
  'θ': { en: 'tree', vi: 'cây', emoji: '🌳' },
  'ð': { en: 'dish', vi: 'đĩa', emoji: '🍽️' },
  'l': { en: 'rabbit', vi: 'con thỏ', emoji: '🐰' },
  'r': { en: 'lion', vi: 'sư tử', emoji: '🦁' },
  'ʃ': { en: 'sun', vi: 'mặt trời', emoji: '☀️' },
  's': { en: 'shoe', vi: 'giày', emoji: '👟' },
};

export function practiceWords(ipa: string) {
  const sound = ALL_44_IPA_SOUNDS.find(s => s.ipa === ipa)!;
  const target = { en: sound.sample_word, vi: sound.sample_word_vi, emoji: sound.emoji };
  const alternative = ALL_44_IPA_SOUNDS.find(s => s.sample_word !== target.en && !s.sample_word_ipa.includes(ipa))!;
  return [target, CONTRAST_WORDS[ipa] ?? { en: alternative.sample_word, vi: alternative.sample_word_vi, emoji: alternative.emoji }];
}

// Match whole phonemes: /t/ is not the affricate /tʃ/, /ə/ is not /əʊ/.
const phonemes=ALL_44_IPA_SOUNDS.map(sound=>sound.ipa).sort((a,b)=>b.length-a.length);
export function phoneticTokens(phonetic:string|undefined) {
  const text=(phonetic||'').replaceAll('g','ɡ');
  const tokens:string[]=[];
  let index=0;
  while(index<text.length) {
    const token=phonemes.find(phoneme=>text.startsWith(phoneme,index));
    tokens.push(token||text[index]);
    index+=token?.length||1;
  }
  return tokens;
}
export function containsSound(phonetic:string|undefined,ipa:string) {
  return phoneticTokens(phonetic).includes(ipa);
}

export function validIpaRecord(value: unknown, profileId: string): value is IpaPracticeRecord {
  if (!value || typeof value !== 'object') return false;
  const row = value as IpaPracticeRecord;
  return row.profileId === profileId && PRACTICE_SOUNDS.some(s => s.ipa === row.sound)
    && typeof row.updatedAt === 'string' && Number.isFinite(Date.parse(row.updatedAt))
    && typeof row.reviewDueAt === 'string' && Number.isFinite(Date.parse(row.reviewDueAt))
    && Array.isArray(row.firstTry) && row.firstTry.length === 2 && row.firstTry.every(v => typeof v === 'boolean')
    && row.practicedSpeaking === true;
}

export function mergeIpaPractice(current: unknown, incoming: unknown, profileId: string) {
  const merged: Record<string, IpaPracticeRecord> = {};
  for (const rows of [current, incoming]) {
    if (!rows || typeof rows !== 'object' || Array.isArray(rows)) continue;
    for (const value of Object.values(rows)) {
      if (!validIpaRecord(value, profileId)) continue;
      if (!merged[value.sound] || merged[value.sound].updatedAt < value.updatedAt) merged[value.sound] = value;
    }
  }
  return merged;
}

export function recommendSound(records: Record<string, IpaPracticeRecord>, now = Date.now()) {
  const due = PRACTICE_SOUNDS.filter(sound => records[sound.ipa] && Date.parse(records[sound.ipa].reviewDueAt) <= now)
    .sort((a,b) => records[a.ipa].reviewDueAt.localeCompare(records[b.ipa].reviewDueAt));
  return due[0] ?? PRACTICE_SOUNDS.find(sound => !records[sound.ipa]) ?? PRACTICE_SOUNDS[0];
}

export function practiceRecord(profileId: string, sound: string, firstTry: boolean[], now = new Date()): IpaPracticeRecord {
  const days = firstTry.every(Boolean) ? 3 : 1;
  return { profileId, sound, firstTry, practicedSpeaking: true, updatedAt: now.toISOString(), reviewDueAt: new Date(now.getTime() + days * 86400000).toISOString() };
}
