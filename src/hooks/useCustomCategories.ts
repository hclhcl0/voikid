// =============================================
// VocaKids – useCustomCategories Hook
// Quản lý danh mục từ vựng tùy chỉnh
// Lưu vào localStorage
// =============================================

'use client';

import { useBackendSession } from '@/hooks/useBackendSession';
import { useAuth } from '@/context/AuthContext';
import { useCallback, useEffect, useState, useRef } from 'react';
import { Category, Word } from '@/types';
import type {StoryLesson} from '@/lib/stories/types';
import {wordsFromStory,appendUniqueStoryWords} from '@/lib/stories/vocabulary';
import type {ContentStore} from '@/lib/backend/types';

const STORAGE_KEY = 'vocakids_custom_categories_v1';

export const NEW_WORDS_CAT_ID = 'custom_new_words';

export interface CustomCategory extends Category {
  createdAt: string;
  sourceType: 'txt' | 'pdf' | 'image' | 'url' | 'manual';
  sourceLabel?: string; // filename or URL
  gradeId?: string;
}

export function createNewWordsCategory(words: Word[] = []): CustomCategory {
  return {
    id: NEW_WORDS_CAT_ID,
    name_vi: '🌟 Từ mới của bé',
    name_en: 'New Words',
    emoji: '🌟',
    color: 'from-amber-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words,
    createdAt: new Date().toISOString(),
    sourceType: 'manual',
    sourceLabel: 'Tổng hợp từ mới tự động',
  };
}

/**
 * Tự động đồng bộ từ mới vào danh mục "🌟 Từ mới của bé"
 * Đảm bảo từ vừa có trong chủ đề riêng (Động vật, Trái cây...)
 * vừa luôn có mặt trong mục Từ mới để bé luyện tập ngay.
 */
function syncWordsToNewWordsCategory(
  categoriesList: CustomCategory[],
  wordsToSync: Word[]
): CustomCategory[] {
  if (!wordsToSync || wordsToSync.length === 0) return categoriesList;

  let current = [...categoriesList];
  let newWordsCatIdx = current.findIndex((c) => c.id === NEW_WORDS_CAT_ID);

  if (newWordsCatIdx === -1) {
    const newWordsCat = createNewWordsCategory([]);
    current = [newWordsCat, ...current];
    newWordsCatIdx = 0;
  }

  const newWordsCat = current[newWordsCatIdx];
  const existingWordsMap = new Map<string, Word>();
  newWordsCat.words.forEach((w) => {
    existingWordsMap.set(w.en.toLowerCase().trim(), w);
  });

  const updatedList: Word[] = [];
  const addedKeys = new Set<string>();

  // Thêm các từ mới vào đầu danh sách (mới nhất lên trước)
  wordsToSync.forEach((w) => {
    const key = w.en.toLowerCase().trim();
    if (!key || addedKeys.has(key)) return;
    addedKeys.add(key);
    const existing = existingWordsMap.get(key);
    updatedList.push({
      ...(existing || {}),
      ...w,
      id: w.id || existing?.id || `w_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    });
  });

  // Giữ lại các từ cũ trước đó trong "Từ mới"
  newWordsCat.words.forEach((w) => {
    const key = w.en.toLowerCase().trim();
    if (key && !addedKeys.has(key)) {
      addedKeys.add(key);
      updatedList.push(w);
    }
  });

  current[newWordsCatIdx] = {
    ...newWordsCat,
    words: updatedList,
  };

  // Đưa "Từ mới" lên đầu danh sách
  if (newWordsCatIdx > 0) {
    const [cat] = current.splice(newWordsCatIdx, 1);
    current.unshift(cat);
  }

  return current;
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

      let healedCats = parsed.map((c) => {
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

      // Đảm bảo danh mục "🌟 Từ mới của bé" luôn tồn tại nếu đã có từ vựng và đồng bộ đủ từ
      const totalWords = healedCats.reduce((sum, c) => sum + c.words.length, 0);
      const hasNewWordsCat = healedCats.some((c) => c.id === NEW_WORDS_CAT_ID);

      if (totalWords > 0) {
        const otherCatsWords = healedCats
          .filter((c) => c.id !== NEW_WORDS_CAT_ID)
          .flatMap((c) => c.words);
        if (otherCatsWords.length > 0) {
          healedCats = syncWordsToNewWordsCategory(healedCats, otherCatsWords);
          changed = true;
        } else if (!hasNewWordsCat) {
          const newCat = createNewWordsCategory([]);
          healedCats.unshift(newCat);
          changed = true;
        }
      } else if (hasNewWordsCat) {
        const idx = healedCats.findIndex((c) => c.id === NEW_WORDS_CAT_ID);
        if (idx > 0) {
          const [cat] = healedCats.splice(idx, 1);
          healedCats.unshift(cat);
          changed = true;
        }
      }

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
  const { account: familyAccount } = useAuth();
  const adminSession = useBackendSession();
  const account = adminSession.authenticated ? { id: 'backend_admin', role: 'admin' as const } : familyAccount;
  const endpoint = adminSession.authenticated ? '/api/admin/family' : '/api/family';
  const revision = useRef(0);
  const queue = useRef(Promise.resolve());
  const [syncError, setSyncError] = useState('');
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [hydrated, setHydrated]     = useState(false);
  const importStoryWords=useCallback(async(lesson:StoryLesson,ids:string[])=>{
    if(adminSession.loading) throw new Error('Đang kiểm tra quyền quản lý.');
    if(account?.role==='student') throw new Error('Phụ huynh hoặc admin mới được thêm từ vào kho.');
    const words=wordsFromStory(lesson,ids,()=>`word_${crypto.randomUUID()}`);
    if(!words.length) throw new Error('Chọn ít nhất một từ có nghĩa tiếng Việt.');
    if(adminSession.authenticated) {
      const response=await fetch('/api/admin/content',{cache:'no-store'});const store=await response.json() as ContentStore&{message?:string};
      if(!response.ok) throw new Error(store.message||'Chưa mở được kho từ admin.');
      const merged=appendUniqueStoryWords(store.categories,lesson.unitId,words);
      if(!merged.added) return {added:0,categoryId:lesson.unitId};
      const saved=await fetch('/api/admin/content',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...store,categories:merged.categories})});
      const result=await saved.json();if(!saved.ok) throw new Error(result.message||'Chưa lưu được từ vựng.');
      return {added:merged.added,categoryId:lesson.unitId};
    }
    let current:CustomCategory[],serverRevision=0;
    if(account?.role==='parent') {
      const response=await fetch(endpoint,{cache:'no-store'});const result=await response.json();
      if(!response.ok||!result.success) throw new Error(result.message||'Chưa mở được kho từ gia đình.');
      current=result.categories;serverRevision=result.revision;
    } else current=loadCategoriesFromStorage();
    const categoryId=`custom_story_${lesson.unitId}`;
    if(!current.some(cat=>cat.id===categoryId)) current=[...current,{id:categoryId,name_vi:lesson.topic,name_en:lesson.topic,emoji:'📖',color:'from-orange-400 to-amber-500',gradient:'bg-orange-50',words:[],gradeId:`lop${lesson.grade}`,createdAt:new Date().toISOString(),sourceType:'manual',sourceLabel:'Từ vựng trong đoạn văn'}];
    const merged=appendUniqueStoryWords(current,categoryId,words);
    if(!merged.added) return {added:0,categoryId};
    if(account?.role==='parent') {
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'save_categories',categories:merged.categories,revision:serverRevision})});const result=await response.json();
      if(!response.ok||!result.success) throw new Error(result.message||'Chưa lưu được kho từ gia đình.');
      revision.current=result.revision;setCategories(result.categories);
    } else {localStorage.setItem(STORAGE_KEY,JSON.stringify(merged.categories));setCategories(merged.categories);}
    setSyncError('');return {added:merged.added,categoryId};
  },[account?.role,adminSession.authenticated,adminSession.loading,endpoint]);

  useEffect(() => {
    if (!account?.role) { Promise.resolve().then(() => setCategories(loadCategoriesFromStorage())); return; }
    const controller = new AbortController();
    fetch(endpoint, { signal: controller.signal, cache: 'no-store' }).then(r => r.json()).then(data => {
      if (data.success) { setCategories(data.categories); revision.current = data.revision; }
    }).catch(() => {});
    return () => controller.abort();
  }, [account?.id, account?.role, endpoint]);
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
      if (account?.role === 'student') return prev;
      let current = prev;
      if (current.length === 0 && typeof window !== 'undefined') {
        current = loadCategoriesFromStorage();
      }
      const next = typeof updater === 'function' ? updater(current) : updater;
      if (account?.role === 'parent' || account?.role === 'admin') {
        const snapshot = next.map(c => ({ ...c, gradeId: c.gradeId || 'lop1' }));
        queue.current = queue.current.then(async () => {
          const response = await fetch('/api/family', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'save_categories', categories: snapshot, revision: revision.current }) });
          const result = await response.json();
          if (!response.ok) { setSyncError(result.message); return; }
          revision.current = result.revision; setSyncError('');
        }).catch(() => setSyncError('Không lưu được kho từ trên server.'));
        return next;
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [account?.id, account?.role]);

  /** Add a brand-new custom category */
  const addCategory = useCallback((
    name: string,
    emoji: string,
    words: Word[],
    sourceType: CustomCategory['sourceType'],
    sourceLabel?: string,
    gradeId?: string,
  ): CustomCategory => {
    const id       = `custom_${Date.now()}`;
    const gIdx     = categories.length;
    const { color, gradient } = pickGradient(gIdx);
    const cat: CustomCategory = {
      id, name_vi: name, name_en: name, emoji,
      color, gradient, words,
      createdAt:   new Date().toISOString(),
      sourceType, sourceLabel, gradeId,
    };
    persist((prev) => {
      let next = [...prev, cat];
      if (cat.id !== NEW_WORDS_CAT_ID) {
        next = syncWordsToNewWordsCategory(next, words);
      }
      return next;
    });
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
      gradeId?: string;
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
            gradeId: item.gradeId || existingCat.gradeId,
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
            gradeId: item.gradeId,
          };
          current.push(cat);
          created.push(cat);
        }
      });

      // ĐỒNG THỜI: Tự động gom toàn bộ từ mới vào mục "🌟 Từ mới của bé"
      const allNewWords = catsToCreate.flatMap((c) => c.words);
      current = syncWordsToNewWordsCategory(current, allNewWords);

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
    persist((prev) => {
      let next = prev.map((c) => {
        if (c.id !== catId) return c;
        const existing = new Set(c.words.map((w) => w.en.toLowerCase()));
        const toAdd    = newWords.filter((w) => !existing.has(w.en.toLowerCase()));
        return { ...c, words: [...c.words, ...toAdd] };
      });
      // ĐỒNG THỜI: Thêm vào mục "🌟 Từ mới của bé"
      if (catId !== NEW_WORDS_CAT_ID) {
        next = syncWordsToNewWordsCategory(next, newWords);
      }
      return next;
    });
  }, [persist]);

  /** Update a single word inside a category */
  const updateWord = useCallback((catId: string, wordId: string, updated: Word) => {
    persist((prev) => prev.map((c) => {
      const hasWord = c.words.some((w) => w.id === wordId || w.en.toLowerCase().trim() === updated.en.toLowerCase().trim());
      if (c.id === catId || (c.id === NEW_WORDS_CAT_ID && hasWord)) {
        return {
          ...c,
          words: c.words.map((w) => (w.id === wordId || w.en.toLowerCase().trim() === updated.en.toLowerCase().trim()) ? updated : w),
        };
      }
      return c;
    }));
  }, [persist]);

  /**
   * "Tốt nghiệp" một từ khỏi danh sách "🌟 Từ mới của bé".
   * Từ vẫn còn trong category gốc (Động vật, Trái cây...) nhưng được xóa
   * khỏi custom_new_words vì bé đã đọc đúng rồi.
   */
  const graduateWord = useCallback((wordId: string) => {
    persist((prev) => prev.map((c) => {
      if (c.id !== NEW_WORDS_CAT_ID) return c;
      return {
        ...c,
        words: c.words.filter((w) => w.id !== wordId),
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
    persist((prev) => {
      let next = prev.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          words: [word, ...c.words],
        };
      });
      // ĐỒNG THỜI: Tự động đưa từ mới vào mục "🌟 Từ mới của bé"
      if (catId !== NEW_WORDS_CAT_ID) {
        next = syncWordsToNewWordsCategory(next, [word]);
      }
      return next;
    });
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
      gradeId:   c.gradeId,
    } as any)),
  [categories]);

  return {
    categories,
    importStoryWords,
    hydrated,
    syncError,
    addCategory,
    addMultipleCategories,
    updateCategory,
    deleteCategory,
    appendWords,
    updateWord,
    deleteWord,
    graduateWord,
    addWord,
    exportJSON,
    importJSON,
    asCategories,
  };
}
