export interface PronunciationSettings {
  enabled: boolean;
  model: string;
  timeoutMs: number;
  wordDurationMs: number;
  sentenceDurationMs: number;
  waitForSpeechMs: number;
  silenceDurationMs: number;
  minSpeechMs: number;
  adaptiveVad: boolean;
  allowArticles: boolean;
  allowRepetitions: boolean;
}
export const defaultPronunciationSettings: PronunciationSettings = {
  enabled: true, model: 'gemini-3.5-flash-lite', timeoutMs: 20000,
  wordDurationMs: 10000, sentenceDurationMs: 25000, waitForSpeechMs: 5000,
  silenceDurationMs: 1800, minSpeechMs: 150, adaptiveVad: true,
  allowArticles: true, allowRepetitions: true,
};
export function validatePronunciationSettings(value: unknown): asserts value is PronunciationSettings {
  const s = value as PronunciationSettings;
  if (!s || typeof s !== 'object' || typeof s.model !== 'string' || !/^gemini-[a-z0-9.-]{1,100}$/.test(s.model)) throw new Error('Tên model Gemini không hợp lệ.');
  for (const key of ['enabled','adaptiveVad','allowArticles','allowRepetitions'] as const) if (typeof s[key] !== 'boolean') throw new Error('Tùy chọn phát âm không hợp lệ.');
  for (const [key,min,max] of [['timeoutMs',5000,60000],['wordDurationMs',5000,20000],['sentenceDurationMs',10000,60000],['waitForSpeechMs',2000,10000],['silenceDurationMs',800,4000],['minSpeechMs',80,1000]] as const) {
    if (!Number.isInteger(s[key]) || s[key] < min || s[key] > max) throw new Error(`Cài đặt ${key} ngoài khoảng cho phép.`);
  }
  if (s.waitForSpeechMs + s.minSpeechMs >= s.wordDurationMs || s.waitForSpeechMs + s.minSpeechMs >= s.sentenceDurationMs) throw new Error('Thời gian thu phải dài hơn thời gian chờ bé nói.');
}
