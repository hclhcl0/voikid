import { defaultPronunciationSettings, validatePronunciationSettings, type PronunciationSettings } from '@/lib/pronunciation/settings';
import type { Category } from '@/types';
export interface ManagedCategory extends Category { gradeId: string; archived?: boolean }
export interface SiteSettings { appName: string; welcomeText: string; dailyGoal: number; showGames: boolean; pronunciation?: PronunciationSettings }
export interface ContentStore { revision: number; categories: ManagedCategory[]; settings: SiteSettings; updatedAt: string }
export const defaultSettings: SiteSettings = { appName: 'VocaKids', welcomeText: 'Học một chút, tiến bộ mỗi ngày', dailyGoal: 5, showGames: true, pronunciation: { ...defaultPronunciationSettings } };
export function validateContent(value: unknown): asserts value is ContentStore {
  if (!value || typeof value !== 'object') throw new Error('Dữ liệu không hợp lệ.');
  const data = value as ContentStore;
  if (!Number.isSafeInteger(data.revision) || data.revision < 0 || !Array.isArray(data.categories) || data.categories.length > 500) throw new Error('Danh sách chủ đề không hợp lệ.');
  const ids = new Set<string>();
  const text = (v: unknown, max: number, required = false) => typeof v === 'string' && v.length <= max && (!required || !!v.trim());
  for (const cat of data.categories) {
    if (!cat || !/^[a-zA-Z0-9_-]{1,120}$/.test(cat.id) || ids.has(cat.id)) throw new Error('Mã chủ đề trùng hoặc không hợp lệ.');
    ids.add(cat.id);
    if (!text(cat.name_vi, 200, true) || !text(cat.name_en, 200) || !text(cat.emoji, 32) || !text(cat.color, 150) || !text(cat.gradient, 200) || !['maugiao','lop1','lop2','lop3','lop4','lop5'].includes(cat.gradeId) || (cat.archived !== undefined && typeof cat.archived !== 'boolean') || !Array.isArray(cat.words) || cat.words.length > 1000) throw new Error('Thông tin chủ đề không hợp lệ.');
    const wordIds = new Set<string>();
    for (const word of cat.words) {
      if (!word || !/^[a-zA-Z0-9_-]{1,120}$/.test(word.id) || wordIds.has(word.id)) throw new Error('Mã từ trùng hoặc không hợp lệ.');
      wordIds.add(word.id);
      if (!text(word.en, 200) || !text(word.vi, 500) || !text(word.phonetic, 200) || !text(word.emoji, 32) || !text(word.example_en, 2000) || !text(word.example_vi, 2000)) throw new Error('Từ vựng cần có tiếng Anh và nghĩa tiếng Việt, các trường phải là văn bản.');
      for (const url of [word.image_url, word.audio_url]) if (url !== undefined && (!text(url, 2000) || (url && !/^https?:\/\//.test(url)))) throw new Error('Đường dẫn ảnh/âm thanh phải dùng HTTP hoặc HTTPS.');
    }
  }
  const s = data.settings;
  if (s?.pronunciation !== undefined) validatePronunciationSettings(s.pronunciation);
  if (!s || !text(s.appName, 80, true) || !text(s.welcomeText, 300, true) || !Number.isInteger(s.dailyGoal) || s.dailyGoal < 1 || s.dailyGoal > 50 || typeof s.showGames !== 'boolean') throw new Error('Cài đặt không hợp lệ. Mục tiêu mỗi ngày từ 1 đến 50 từ.');
}
