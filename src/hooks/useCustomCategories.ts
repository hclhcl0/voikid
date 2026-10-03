// =============================================
// VocaKids – useCustomCategories Hook
// Quản lý danh mục từ vựng tùy chỉnh
// Lưu vào localStorage
// =============================================

'use client';

import { useCallback, useEffect, useState } from 'react';
import { Category, Word } from '@/types';

const STORAGE_KEY = 'vocakids_custom_categories_v1';

export interface CustomCategory extends Category {
  createdAt: string;
  sourceType: 'txt' | 'pdf' | 'image' | 'url' | 'manual';
  sourceLabel?: string; // filename or URL
}

const GRADIENTS = [
  { color: 'from-violet-400 to-purple-500',   gradient: 'bg-gradient-to-br from-violet-100 to-purple-100'   },
  { color: 'from-rose-400 to-pink-500',       gradient: 'bg-gradient-to-br from-rose-100 to-pink-100'       },
  { color: 'from-teal-400 to-cyan-500',       gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100'       },
  { color: 'from-amber-400 to-yellow-500',    gradient: 'bg-gradient-to-br from-amber-100 to-yellow-100'    },
  { color: 'from-indigo-400 to-blue-500',     gradient: 'bg-gradient-to-br from-indigo-100 to-blue-100'     },
  { color: 'from-emerald-400 to-green-500',   gradient: 'bg-gradient-to-br from-emerald-100 to-green-100'   },
  { color: 'from-fuchsia-400 to-purple-500',  gradient: 'bg-gradient-to-br from-fuchsia-100 to-purple-100'  },
  { color: 'from-orange-400 to-red-500',      gradient: 'bg-gradient-to-br from-orange-100 to-red-100'      },
];

function pickGradient(index: number) {
  return GRADIENTS[index % GRADIENTS.length];
}

const COMMON_FALLBACK: Record<string, Partial<Word>> = {
  month: {
    en: 'month',
    vi: 'Tháng',
    phonetic: '/mʌnθ/',
    emoji: '📅',
    example_en: 'There are twelve months in a year.',
    example_vi: 'Một năm có mười hai tháng.',
  },
  year: {
    en: 'year',
    vi: 'Năm',
    phonetic: '/jɪər/',
    emoji: '🗓️',
    example_en: 'Happy New Year!',
    example_vi: 'Chúc mừng năm mới!',
  },
  week: {
    en: 'week',
    vi: 'Tuần',
    phonetic: '/wiːk/',
    emoji: '📆',
    example_en: 'There are seven days in a week.',
    example_vi: 'Một tuần có bảy ngày.',
  },
  day: {
    en: 'day',
    vi: 'Ngày',
    phonetic: '/deɪ/',
    emoji: '☀️',
    example_en: 'Have a wonderful day!',
    example_vi: 'Chúc bé một ngày tuyệt vời!',
  },
};

function loadCategoriesFromStorage(): CustomCategory[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CustomCategory[];
      let changed = false;

      const healedCats = parsed.map((c) => {
        let catChanged = false;
        let name_vi = c.name_vi?.trim() || '';
        if (!name_vi) {
          name_vi = 'Từ vựng của bé';
          catChanged = true;
        }

        const healedWords = (c.words || []).map((w) => {
          let wordChanged = false;
          let en = w.en?.trim() || '';
          let phonetic = w.phonetic?.trim() || '';
          if (!en && phonetic.includes('mʌnθ')) {
            en = 'month';
            wordChanged = true;
          }

          const key = en.toLowerCase().trim();
          const fb = COMMON_FALLBACK[key];
          let vi = w.vi?.trim() || '';
          let example_en = w.example_en?.trim() || '';
          let example_vi = w.example_vi?.trim() || '';
          let emoji = w.emoji || '📝';

          if (fb) {
            if (!en) { en = fb.en || 'word'; wordChanged = true; }
            if (!vi) { vi = fb.vi || ''; wordChanged = true; }
            if (!example_en) { example_en = fb.example_en || ''; wordChanged = true; }
            if (!example_vi) { example_vi = fb.example_vi || ''; wordChanged = true; }
            if (!phonetic) { phonetic = fb.phonetic || ''; wordChanged = true; }
            if (emoji === '📝' && fb.emoji) { emoji = fb.emoji; wordChanged = true; }
          }

          if (wordChanged) {
            catChanged = true;
            return {
              ...w,
              en: en || 'word',
              vi,
              phonetic,
              emoji,
              example_en,
              example_vi,
            };
          }
          return w;
        });

        if (catChanged) {
          changed = true;
          return {
            ...c,
            name_vi,
            name_en: c.name_en?.trim() || name_vi,
            emoji: c.emoji || '📚',
            words: healedWords,
          };
        }
        return c;
      });

      if (changed) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(healedCats));
        } catch {
          /* ignore */
        }
      }

      return healedCats;
    }
  } catch {
    /* ignore */
  }
  return [];
}

export function useCustomCategories() {
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [hydrated, setHydrated]     = useState(false);

  // Sync from localStorage on mount (hydration-safe)
  useEffect(() => {
    const initial = loadCategoriesFromStorage();
    if (initial.length > 0) {
      setCategories(initial);
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((updater: CustomCategory[] | ((prev: CustomCategory[]) => CustomCategory[])) => {
    setCategories((prev) => {
      let current = prev;
      if (current.length === 0 && typeof window !== 'undefined') {
        current = loadCategoriesFromStorage();
      }
      const next = typeof updater === 'function' ? updater(current) : updater;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  /** Add a brand-new custom category */
  const addCategory = useCallback((
    name: string,
    emoji: string,
    words: Word[],
    sourceType: CustomCategory['sourceType'],
    sourceLabel?: string,
  ): CustomCategory => {
    const id       = `custom_${Date.now()}`;
    const gIdx     = categories.length;
    const { color, gradient } = pickGradient(gIdx);
    const cat: CustomCategory = {
      id, name_vi: name, name_en: name, emoji,
      color, gradient, words,
      createdAt:   new Date().toISOString(),
      sourceType, sourceLabel,
    };
    persist((prev) => [...prev, cat]);
    return cat;
  }, [categories.length, persist]);

  /** Add multiple custom categories in batch (for auto-categorized topics) */
  const addMultipleCategories = useCallback((
    catsToCreate: {
      name: string;
      emoji: string;
      words: Word[];
      sourceType: CustomCategory['sourceType'];
      sourceLabel?: string;
    }[]
  ): CustomCategory[] => {
    const created: CustomCategory[] = [];
    const timestamp = Date.now();
    persist((prev) => {
      let current = [...prev];
      catsToCreate.forEach((item, i) => {
        const existingIdx = current.findIndex((c) => c.name_vi.toLowerCase().trim() === item.name.toLowerCase().trim());
        if (existingIdx >= 0) {
          const existingCat = current[existingIdx];
          const existingWords = new Set(existingCat.words.map((w) => w.en.toLowerCase().trim()));
          const toAdd = item.words.filter((w) => !existingWords.has(w.en.toLowerCase().trim()));
          current[existingIdx] = {
            ...existingCat,
            words: [...existingCat.words, ...toAdd]
          };
          created.push(current[existingIdx]);
        } else {
          const id = `custom_${timestamp}_${i}`;
          const gIdx = current.length;
          const { color, gradient } = pickGradient(gIdx);
          const cat: CustomCategory = {
            id,
            name_vi: item.name,
            name_en: item.name,
            emoji: item.emoji || '📚',
            color,
            gradient,
            words: item.words,
            createdAt: new Date().toISOString(),
            sourceType: item.sourceType,
            sourceLabel: item.sourceLabel,
          };
          current.push(cat);
          created.push(cat);
        }
      });
      return current;
    });
    return created;
  }, [persist]);

  /** Replace words in an existing category */
  const updateCategory = useCallback((id: string, patch: Partial<Pick<CustomCategory, 'name_vi' | 'name_en' | 'emoji' | 'words'>>) => {
    persist((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c));
  }, [persist]);

  /** Delete a category */
  const deleteCategory = useCallback((id: string) => {
    persist((prev) => prev.filter((c) => c.id !== id));
  }, [persist]);

  /** Add words to existing category */
  const appendWords = useCallback((catId: string, newWords: Word[]) => {
    persist((prev) => prev.map((c) => {
      if (c.id !== catId) return c;
      const existing = new Set(c.words.map((w) => w.en.toLowerCase()));
      const toAdd    = newWords.filter((w) => !existing.has(w.en.toLowerCase()));
      return { ...c, words: [...c.words, ...toAdd] };
    }));
  }, [persist]);

  /** Update a single word inside a category */
  const updateWord = useCallback((catId: string, wordId: string, updated: Word) => {
    persist((prev) => prev.map((c) => {
      if (c.id !== catId) return c;
      return {
        ...c,
        words: c.words.map((w) => w.id === wordId ? updated : w),
      };
    }));
  }, [persist]);

  /** Delete a single word from a category */
  const deleteWord = useCallback((catId: string, wordId: string) => {
    persist((prev) => prev.map((c) => {
      if (c.id !== catId) return c;
      return {
        ...c,
        words: c.words.filter((w) => w.id !== wordId),
      };
    }));
  }, [persist]);

  /** Add a single word to a category */
  const addWord = useCallback((catId: string, word: Word) => {
    persist((prev) => prev.map((c) => {
      if (c.id !== catId) return c;
      return {
        ...c,
        words: [word, ...c.words],
      };
    }));
  }, [persist]);

  /** Export all custom categories as JSON */
  const exportJSON = useCallback((): string => {
    return JSON.stringify(categories, null, 2);
  }, [categories]);

  /** Import from JSON string (merge) */
  const importJSON = useCallback((json: string) => {
    try {
      const imported = JSON.parse(json) as CustomCategory[];
      if (!Array.isArray(imported)) return 0;
      const existingIds = new Set(categories.map((c) => c.id));
      const toAdd = imported.filter((c) => !existingIds.has(c.id));
      persist([...categories, ...toAdd]);
      return toAdd.length;
    } catch { return 0; }
  }, [categories, persist]);

  /** Convert to Category[] for use with existing learn/quiz/speak pages */
  const asCategories = useCallback((): Category[] =>
    categories.map((c) => ({
      id:        c.id,
      name_vi:   c.name_vi,
      name_en:   c.name_en,
      emoji:     c.emoji,
      color:     c.color,
      gradient:  c.gradient,
      words:     c.words,
    })),
  [categories]);

  return {
    categories,
    hydrated,
    addCategory,
    addMultipleCategories,
    updateCategory,
    deleteCategory,
    appendWords,
    updateWord,
    deleteWord,
    addWord,
    exportJSON,
    importJSON,
    asCategories,
  };
}

