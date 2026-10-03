// =============================================
// VocaKids – useSettings Hook
// Lưu Gemini API Key vào localStorage
// =============================================

'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'vocakids_gemini_key';

function sanitizeKey(raw: string): string {
  if (!raw) return '';
  const match = raw.trim().match(/(AQ\.[A-Za-z0-9_-]+|AIza[A-Za-z0-9_-]+)/);
  return match ? match[1] : raw.trim();
}

export function useSettings() {
  const [apiKey, setApiKey]     = useState<string>('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY) ?? '';
      const clean = sanitizeKey(stored);
      setApiKey(clean);
      if (clean && clean !== stored) {
        localStorage.setItem(KEY, clean);
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  const saveApiKey = useCallback((key: string) => {
    const clean = sanitizeKey(key);
    setApiKey(clean);
    try {
      if (clean) localStorage.setItem(KEY, clean);
      else       localStorage.removeItem(KEY);
    } catch { /* ignore */ }
  }, []);

  const hasKey = hydrated && apiKey.length > 0;

  // Masked display: "AIza...XyZ"
  const maskedKey = apiKey.length > 8
    ? `${apiKey.slice(0, 6)}${'•'.repeat(Math.min(apiKey.length - 10, 20))}${apiKey.slice(-4)}`
    : apiKey ? '••••••••' : '';

  return { apiKey, maskedKey, hasKey, hydrated, saveApiKey };
}
