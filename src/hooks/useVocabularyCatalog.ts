'use client';
import { useEffect, useState } from 'react';
import { CATEGORIES } from '@/lib/vocabulary';
import { defaultSettings, type ContentStore, type ManagedCategory } from '@/lib/backend/types';
export function useVocabularyCatalog() {
  const [catalog, setCatalog] = useState<Pick<ContentStore, 'categories' | 'settings'>>({ categories: CATEGORIES as ManagedCategory[], settings: defaultSettings });
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/catalog', { signal: controller.signal, cache: 'no-store' }).then(async r => { if (r.ok) setCatalog(await r.json()); }).catch(() => {});
    return () => controller.abort();
  }, []);
  return catalog;
}
