// =============================================
// VocaKids – useTTS Hook
// Text-to-Speech với Web Speech API
// =============================================

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTTSReturn {
  speak: (text: string, lang?: string, rate?: number) => void;
  isSpeaking: boolean;
  cancel: () => void;
}

export function useTTS(): UseTTSReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Pre-load voices & keep them up-to-date across browser voice changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        voicesRef.current = v;
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = useCallback((text: string, lang = 'en-US', rate = 0.85) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Stop any currently playing audio
    window.speechSynthesis.cancel();

    // Clamp rate (minimum 0.2, maximum 2.0)
    const safeRate = Math.max(0.2, Math.min(rate, 2.0));

    const utter  = new SpeechSynthesisUtterance(text);
    utter.lang   = lang;
    utter.rate   = safeRate;
    // For slow reading (<= 0.5), use pitch 1.0 for clear, natural, warm teacher voice
    utter.pitch  = safeRate <= 0.5 ? 1.0 : 1.05;
    utter.volume = 1;

    // Pick best voice from cached voices
    const voices = voicesRef.current.length > 0
      ? voicesRef.current
      : window.speechSynthesis.getVoices();

    const preferred =
      // 1. Natural / online neural voices
      voices.find((v) => v.lang.startsWith('en') && /natural|online|neural/i.test(v.name)) ||
      // 2. Google US English (Chrome)
      voices.find((v) => v.lang === 'en-US' && /google/i.test(v.name)) ||
      // 3. Clear friendly female voices
      voices.find((v) => v.lang.startsWith('en') && /female|zira|samantha|jenny|aria|karen/i.test(v.name)) ||
      // 4. Any en-US voice
      voices.find((v) => v.lang === 'en-US') ||
      // 5. Any English voice
      voices.find((v) => v.lang.startsWith('en'));

    if (preferred) utter.voice = preferred;

    utter.onstart = () => setIsSpeaking(true);
    utter.onend   = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);

    utterRef.current = utter;

    // Small delay to prevent Chromium cancel() collision
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.speak(utter);
        setIsSpeaking(true);
      }
    }, 15);
  }, []);

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, isSpeaking, cancel };
}

