// =============================================
// VocaKids – useKidsPhonics Hook
// Fetches & caches Vietnamese phonics approximation
// per word from /api/phonics using Gemini
// =============================================

'use client';

import { useCallback, useEffect, useState } from 'react';
import { KidsPhonics } from '@/types';
import { useSettings } from './useSettings';
import prebuiltPhonics from '@/data/phonics.json';

const CACHE_KEY = 'vocakids_phonics_v1';
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

type PhonicsCache = Record<string, { data: KidsPhonics; ts: number }>;

function loadCache(): PhonicsCache {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function saveCache(cache: PhonicsCache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* quota exceeded — ignore */ }
}

/** Returns phonics for a single word. Instant 0ms for pre-generated built-in words or words with initialKidsPhonics, or fetches from Gemini for custom words. */
export function useKidsPhonics(wordEn: string, wordPhonetic?: string, initialPhonics?: KidsPhonics) {
  const { apiKey } = useSettings();
  const cacheKey = (wordEn || '').toLowerCase().trim();

  // 1. Kiểm tra từ initialPhonics hoặc từ điển tạo trước (Pre-generated 0ms, offline)
  const prebuilt = initialPhonics || (cacheKey ? (prebuiltPhonics as Record<string, KidsPhonics>)[cacheKey] : undefined);

  const [phonics,  setPhonics]  = useState<KidsPhonics | null>(prebuilt ?? null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    if (!wordEn) return;

    // Ưu tiên 1: Đã có sẵn từ initialPhonics hoặc phonics.json
    if (prebuilt) {
      setPhonics(prebuilt);
      return;
    }

    // Ưu tiên 2: Đã lưu trong localStorage cache
    const cache = loadCache();
    const cached = cache[cacheKey];
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      setPhonics(cached.data);
      return;
    }

    // Ưu tiên 3: Gọi API /api/phonics cho từ vựng mới tự nhập
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/phonics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: wordEn, phonetic: wordPhonetic, apiKey }),
    })
      .then((r) => r.json())
      .then((data: { phonics?: KidsPhonics; error?: string }) => {
        if (cancelled) return;
        if (data.phonics) {
          setPhonics(data.phonics);
          // Save to cache
          const cache = loadCache();
          cache[cacheKey] = { data: data.phonics, ts: Date.now() };
          saveCache(cache);
        } else {
          setError(data.error ?? 'Unknown error');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, apiKey]);

  /** Manually trigger a re-fetch (skipping cache) */
  const refresh = useCallback(async () => {
    if (!apiKey || !wordEn) return;
    setLoading(true); setError(null);
    try {
      const r = await fetch('/api/phonics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: wordEn, phonetic: wordPhonetic, apiKey }),
      });
      const data = await r.json() as { phonics?: KidsPhonics; error?: string };
      if (data.phonics) {
        setPhonics(data.phonics);
        const cache = loadCache();
        cache[cacheKey] = { data: data.phonics, ts: Date.now() };
        saveCache(cache);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [wordEn, wordPhonetic, apiKey, cacheKey]);

  return { phonics, loading, error, refresh };
}

/** Manually inject pre-generated phonics into the cache (used by vocabulary.ts) */
export function injectPhonicsCache(entries: Record<string, KidsPhonics>) {
  try {
    const cache = loadCache();
    const now = Date.now();
    for (const [en, data] of Object.entries(entries)) {
      cache[en.toLowerCase().trim()] = { data, ts: now };
    }
    saveCache(cache);
  } catch { /* ignore */ }
}
