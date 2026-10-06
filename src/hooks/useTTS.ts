// =============================================
// VocaKids – useTTS Hook
// Text-to-Speech với Web Speech API
// =============================================

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTTSReturn {
  speak: (text: string, lang?: string, rate?: number, onStarted?: () => void, onEnded?: () => void) => void;
  isSpeaking: boolean;
  error: string | null;
  cancel: () => void;
  audioSource: {provider:'loading'|'elevenlabs'|'system';text:string}|null;
}

export function useTTS(): UseTTSReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioSource,setAudioSource]=useState<UseTTSReturn['audioSource']>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const generationRef = useRef(0);

  useEffect(()=>{
    const stop=()=>{generationRef.current++;requestRef.current?.abort();audioRef.current?.pause();utterRef.current=null;if(timerRef.current)clearTimeout(timerRef.current);if(startTimeoutRef.current)clearTimeout(startTimeoutRef.current);setIsSpeaking(false);setAudioSource(current=>current?.provider==='loading'?null:current);};
    window.addEventListener('vocakids-stop-audio',stop);
    return ()=>{window.removeEventListener('vocakids-stop-audio',stop);stop();};
  },[]);

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
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        if (timerRef.current) clearTimeout(timerRef.current);
        if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakBrowser = useCallback((text: string, lang = 'en-US', rate = 0.85, onStarted?: () => void, onEnded?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setAudioSource(null);
      setError('Thiết bị chưa hỗ trợ đọc mẫu. Con vẫn có thể tiếp tục phần đọc.');
      return;
    }
    setError(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
    
    // Stop any currently playing audio
    window.speechSynthesis.cancel();
    document.querySelectorAll('audio').forEach(audio => audio.pause());

    // Keep the system fallback intelligible, including legacy very slow callers.
    const safeRate = Math.max(0.7, Math.min(rate, 2.0));

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

    utter.onstart = () => { if (utterRef.current !== utter) return; if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current); setAudioSource({provider:'system',text});setIsSpeaking(true); onStarted?.(); };
    utter.onend   = () => { if (utterRef.current !== utter) return; if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current); setIsSpeaking(false); onEnded?.(); };
    utter.onerror = (event) => {
      if (utterRef.current !== utter) return;
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
      setIsSpeaking(false);
      setAudioSource(null);
      if (event.error !== 'canceled' && event.error !== 'interrupted') setError('Không phát được audio. Con có thể tiếp tục phần đọc; bài nghe chưa được đánh giá.');
    };

    utterRef.current = utter;

    // Small delay to prevent Chromium cancel() collision
    timerRef.current = setTimeout(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.speak(utter);
        startTimeoutRef.current = setTimeout(() => {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
          setAudioSource(null);
          setError('Giọng đọc chưa phát được. Con có thể tiếp tục phần đọc hoặc bỏ qua bài nghe.');
        }, 8000);
      }
    }, 15);
  }, []);

  const speak = useCallback((text: string, lang = 'en-US', rate = 0.85, onStarted?: () => void, onEnded?: () => void) => {
    window.dispatchEvent(new Event('vocakids-stop-audio'));
    const generation=++generationRef.current;
    requestRef.current?.abort();audioRef.current?.pause();
    utterRef.current=null;
    if(timerRef.current)clearTimeout(timerRef.current);
    if(startTimeoutRef.current)clearTimeout(startTimeoutRef.current);
    window.speechSynthesis?.cancel();document.querySelectorAll('audio').forEach(a=>a.pause());
    setIsSpeaking(false);setError(null);setAudioSource({provider:'loading',text});
    let fellBack=false;
    const fallback=()=>{if(!fellBack&&generationRef.current===generation){fellBack=true;speakBrowser(text,lang,rate,onStarted,onEnded);}};
    if(!lang.startsWith('en')){fallback();return;}
    const controller=new AbortController();requestRef.current=controller;
    void (async()=>{
      try{
        const options={method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,pace:rate<=0.7?'slow':'normal'}),signal:AbortSignal.any([controller.signal,AbortSignal.timeout(50000)])};
        let response=await fetch('/api/media/tts',options);
        if(response.status===401)response=await fetch('/api/admin/media/tts',options);
        if(!response.ok)throw new Error();const result=await response.json();if(generationRef.current!==generation)return;
        // The provider generates the chosen pace. Do not stretch the MP3 again.
        const audio=new Audio(result.url);audioRef.current=audio;audio.playbackRate=1;
        let started=false;
        audio.onplaying=()=>{if(generationRef.current!==generation)return;setAudioSource({provider:'elevenlabs',text});setIsSpeaking(true);if(!started){started=true;onStarted?.();}};
        audio.onended=()=>{if(generationRef.current!==generation)return;setIsSpeaking(false);onEnded?.();};
        audio.onerror=()=>{audio.pause();fallback();};
        await audio.play();
      }catch{if(!controller.signal.aborted)fallback();}
    })();
  },[speakBrowser]);

  const cancel = useCallback(() => {
    setAudioSource(current=>current?.provider==='loading'?null:current);
    generationRef.current++;
    requestRef.current?.abort();audioRef.current?.pause();utterRef.current=null;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, isSpeaking, cancel, error, audioSource };
}
