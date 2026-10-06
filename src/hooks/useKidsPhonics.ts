// =============================================
// VocaKids – useKidsPhonics Hook
// Fetches & caches Vietnamese phonics approximation
// per word from /api/phonics using Gemini
// =============================================

'use client';

import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import { KidsPhonics } from '@/types';
import { useSettings } from './useSettings';
import prebuiltPhonics from '@/data/phonics.json';
import {prepareAiKidsPhonics} from '@/lib/aiKidsPhonics';

// v1 mixed AI hints and automatic IPA-to-letter output.
const CACHE_KEY = 'vocakids_ai_phonics_v2';
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

type PhonicsCache = Record<string, { data: KidsPhonics; ts: number }>;

function loadCache(): PhonicsCache {
  try {
    const cache=JSON.parse(localStorage.getItem(CACHE_KEY)??'{}');
    return cache&&typeof cache==='object'&&!Array.isArray(cache)?cache:{};
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
  const {apiKey,hydrated}=useSettings();
  const wordKey=(wordEn||'').toLowerCase().trim();
  const cacheKey=JSON.stringify([wordKey,wordPhonetic?.trim()||'']);

  // 1. Kiểm tra từ initialPhonics hoặc từ điển tạo trước (Pre-generated 0ms, offline)
  const seed=initialPhonics||(wordKey?(prebuiltPhonics as Record<string,KidsPhonics>)[wordKey]:undefined);
  const prebuilt=useMemo(()=>prepareAiKidsPhonics(wordEn,wordPhonetic,seed),[wordEn,wordPhonetic,seed]);

  const [fetched, setFetched] = useState<{key:string;data:KidsPhonics}|null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const generationRef=useRef(0);

  useEffect(() => {
    generationRef.current++;
    if(!wordEn||!hydrated)return;

    let cancelled = false;
    // Normalize old cached data too; never show the previous word's result while fetching.
    const cache = loadCache();
    const cached = cache[cacheKey];
    if(cached&&Date.now()-cached.ts<CACHE_TTL_MS){
      const normalized=prepareAiKidsPhonics(wordEn,wordPhonetic,cached.data);
      if(normalized){
        queueMicrotask(()=>{if(!cancelled){setFetched({key:cacheKey,data:normalized});setLoading(false);setError(null);}});
        return ()=>{cancelled=true;};
      }
    }
    if (prebuilt) {
      queueMicrotask(()=>{if(!cancelled){setLoading(false);setError(null);}});
      return ()=>{cancelled=true;};
    }

    // Ưu tiên 3: Gọi API /api/phonics cho từ vựng mới tự nhập
    queueMicrotask(()=>{if(!cancelled){setLoading(true);setError(null);}});

    fetch('/api/phonics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: wordEn, phonetic: wordPhonetic, apiKey }),
    })
      .then(async r=>{const data=await r.json();if(!r.ok)throw new Error(data.message||'Chưa tạo được gợi ý AI. Hãy thử lại.');return data;})
      .then((data: { phonics?: KidsPhonics; error?: string }) => {
        if (cancelled) return;
        if (data.phonics) {
          const normalized=prepareAiKidsPhonics(wordEn,wordPhonetic,data.phonics);
          if(!normalized){setError('Gợi ý AI chưa khớp âm tiết. Hãy thử tạo lại.');return;}
          setFetched({key:cacheKey,data:normalized});
          // Save to cache
          const cache = loadCache();
          cache[cacheKey] = { data: normalized, ts: Date.now() };
          saveCache(cache);
        } else {
          setError('Chưa tạo được gợi ý AI. Hãy thử lại.');
        }
      })
      .catch((err) => {
        if(!cancelled)setError(err instanceof Error?err.message:'Chưa tạo được gợi ý AI.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [cacheKey,apiKey,wordEn,wordPhonetic,prebuilt,hydrated]);

  /** Manually trigger a re-fetch (skipping cache) */
  const refresh = useCallback(async () => {
    if(!wordEn)return;
    const generation=++generationRef.current;
    setLoading(true); setError(null);
    try {
      const r = await fetch('/api/phonics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: wordEn, phonetic: wordPhonetic, apiKey }),
      });
      const data=await r.json() as {phonics?:KidsPhonics;message?:string};
      if(generation!==generationRef.current)return;
      if(!r.ok)throw new Error(data.message||'Chưa tạo được gợi ý AI. Hãy thử lại.');
      if (data.phonics) {
        const normalized=prepareAiKidsPhonics(wordEn,wordPhonetic,data.phonics);
        if(!normalized)throw new Error('Gợi ý AI chưa khớp âm tiết. Hãy thử tạo lại.');
        setFetched({key:cacheKey,data:normalized});
        const cache = loadCache();
        cache[cacheKey] = { data: normalized, ts: Date.now() };
        saveCache(cache);
      } else throw new Error('Chưa tạo được gợi ý AI. Hãy thử lại.');
    } catch (err) {
      if(generation===generationRef.current)setError(err instanceof Error?err.message:'Chưa tạo được gợi ý AI.');
    } finally {
      if(generation===generationRef.current)setLoading(false);
    }
  }, [wordEn, wordPhonetic, apiKey, cacheKey]);

  const phonics=fetched?.key===cacheKey?fetched.data:prebuilt;
  return {phonics,loading,error,refresh};
}

/** Manually inject pre-generated phonics into the cache (used by vocabulary.ts) */
export function injectPhonicsCache(entries: Record<string, KidsPhonics>) {
  try {
    const cache = loadCache();
    const now = Date.now();
    for (const [en, data] of Object.entries(entries)) {
      cache[JSON.stringify([en.toLowerCase().trim(),''])] = { data, ts: now };
    }
    saveCache(cache);
  } catch { /* ignore */ }
}
