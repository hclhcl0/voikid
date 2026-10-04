// =============================================
// VocaKids – Vocabulary Cross-Checker
// Kiểm tra & đối chiếu từ vựng trích xuất với:
// 1. Kho 1.210 từ SGK Global Success (Mẫu giáo -> Lớp 5)
// 2. Kho từ tự thêm của người dùng (Custom Categories)
// =============================================

import { CATEGORIES, GRADE_METAS } from '@/lib/vocabulary';
import { Word } from '@/types';
import { CustomCategory } from '@/hooks/useCustomCategories';

export interface WordMatchInfo {
  isDuplicate: boolean;
  gradeId?: string;
  gradeName?: string;
  categoryName?: string;
  existingWord?: Word;
}

/**
 * Chuẩn hóa chuỗi từ để so sánh chính xác (bỏ hoa/thường, khoảng trắng thừa, dấu câu)
 */
export function normalizeWord(word: string): string {
  if (!word) return '';
  return word
    .toLowerCase()
    .trim()
    .replace(/^to\s+/i, '') // bỏ "to " nếu là động từ nguyên mẫu (to walk -> walk)
    .replace(/[^a-z0-9]/g, '');
}

// Cache mục lục 1.210 từ SGK
let _builtInIndex: Map<string, { gradeId: string; gradeName: string; categoryName: string; word: Word }> | null = null;

function getBuiltInIndex() {
  if (_builtInIndex) return _builtInIndex;
  _builtInIndex = new Map();

  for (const cat of CATEGORIES) {
    const gradeId = cat.gradeId || 'lop1';
    const gradeName = GRADE_METAS[gradeId]?.name || gradeId;
    for (const w of cat.words) {
      const key = normalizeWord(w.en);
      if (key && !_builtInIndex.has(key)) {
        _builtInIndex.set(key, {
          gradeId,
          gradeName,
          categoryName: cat.name_vi,
          word: w,
        });
      }
    }
  }
  return _builtInIndex;
}

/**
 * Kiểm tra xem từ tiếng Anh đã có trong kho SGK hoặc kho từ tự tạo hay chưa.
 */
export function checkWordInDatabase(
  wordEn: string,
  customCategories: CustomCategory[] = []
): WordMatchInfo {
  if (!wordEn?.trim()) return { isDuplicate: false };

  const key = normalizeWord(wordEn);
  if (!key) return { isDuplicate: false };

  // 1. Kiểm tra trong kho từ tự tạo của người dùng trước
  for (const cat of customCategories) {
    for (const w of cat.words) {
      if (normalizeWord(w.en) === key) {
        return {
          isDuplicate: true,
          gradeId: 'custom',
          gradeName: 'Kho từ tự tạo',
          categoryName: cat.name_vi || cat.name_en || 'Chủ đề của bạn',
          existingWord: w,
        };
      }
    }
  }

  // 2. Kiểm tra trong 1.210 từ SGK Global Success
  const index = getBuiltInIndex();
  const match = index.get(key);
  if (match) {
    return {
      isDuplicate: true,
      gradeId: match.gradeId,
      gradeName: match.gradeName,
      categoryName: match.categoryName,
      existingWord: match.word,
    };
  }

  return { isDuplicate: false };
}
