import type { Category, Word, WordProgress } from '@/types';
import { shopThemes } from '@/lib/shop';
import type { DailyWordSource } from '@/lib/backend/types';

export interface DailyWordItem {
  word: Word;
  category: Category;
  isLearned: boolean;
  isSpoken: boolean;
  isCompleted: boolean;
  progress?: WordProgress;
}

export function getTodayDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Tạo số hash nhất quán từ chuỗi ngày và hồ sơ để mỗi ngày chọn từ cố định
 */
function hashDateString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Lựa chọn N từ mới cho ngày hôm nay theo khối lớp của bé và nguồn từ vựng
 */
export function selectDailyWords(params: {
  categories: Category[];
  gradeId?: string;
  dateStr?: string;
  count?: number;
  source?: DailyWordSource;
  wordProgress?: Record<string, WordProgress>;
}): DailyWordItem[] {
  const {
    categories,
    gradeId = 'lop1',
    dateStr = getTodayDateString(),
    count = 1,
    source = 'curriculum',
    wordProgress = {},
  } = params;

  const targetCount = Math.max(1, Math.min(20, Math.floor(count)));

  // Chuẩn bị danh mục từ kho Game Cửa Hàng (Shop items)
  const shopCategories: Category[] = shopThemes.map(theme => ({
    id: `shop_${theme.id}`,
    name_vi: `Cửa hàng: ${theme.name}`,
    name_en: theme.name,
    emoji: theme.emoji,
    color: 'bg-amber-100',
    gradient: 'from-amber-400 to-orange-500',
    words: theme.words,
  }));

  // Lọc các chủ đề bài học SGK thuộc khối lớp
  const gradeCategories = categories.filter(c => {
    const g = (c as { gradeId?: string }).gradeId;
    return !g || g === gradeId;
  });

  const baseCurriculum = gradeCategories.length > 0 ? gradeCategories : categories;

  let availableCategories: Category[];
  if (source === 'shop') {
    availableCategories = shopCategories;
  } else if (source === 'all') {
    availableCategories = [...baseCurriculum, ...shopCategories];
  } else {
    availableCategories = baseCurriculum;
  }

  // Tập hợp danh sách tất cả các từ kèm chủ đề
  const allEntries: { word: Word; category: Category }[] = [];
  const seenWordIds = new Set<string>();

  for (const cat of availableCategories) {
    if (!Array.isArray(cat.words)) continue;
    for (const w of cat.words) {
      if (!w || !w.id || !w.en || seenWordIds.has(w.id)) continue;
      seenWordIds.add(w.id);
      allEntries.push({ word: w, category: cat });
    }
  }

  if (allEntries.length === 0) return [];

  // Phân nhóm từ: Chưa học -> Đang học -> Đã hoàn thành
  const unstudied: { word: Word; category: Category }[] = [];
  const inProgress: { word: Word; category: Category }[] = [];
  const mastered: { word: Word; category: Category }[] = [];

  for (const entry of allEntries) {
    const key = `${entry.category.id}:${entry.word.id}`;
    const p = wordProgress[key];
    if (!p || (p.stars === 0 && !p.attempts)) {
      unstudied.push(entry);
    } else if (p.stars < 3 && !p.mastered) {
      inProgress.push(entry);
    } else {
      mastered.push(entry);
    }
  }

  // Kết hợp theo độ ưu tiên sư phạm: Ưu tiên từ chưa học -> đang học -> đã học
  const pool = unstudied.length >= targetCount
    ? unstudied
    : [...unstudied, ...inProgress, ...mastered];

  const seed = hashDateString(`${dateStr}:${gradeId}:${source}`);
  const startIndex = seed % pool.length;

  const selectedEntries: { word: Word; category: Category }[] = [];
  for (let i = 0; i < targetCount && i < pool.length; i++) {
    const index = (startIndex + i) % pool.length;
    selectedEntries.push(pool[index]);
  }

  return selectedEntries.map(entry => {
    const key = `${entry.category.id}:${entry.word.id}`;
    const p = wordProgress[key];
    const isLearned = (p?.stars ?? 0) > 0;
    const isSpoken = (p?.attempts ?? 0) > 0 || !!p?.lastPronunciationAttemptId || (p?.bestScore ?? 0) > 0;
    const isCompleted = isLearned && isSpoken;

    return {
      word: entry.word,
      category: entry.category,
      isLearned,
      isSpoken,
      isCompleted,
      progress: p,
    };
  });
}
