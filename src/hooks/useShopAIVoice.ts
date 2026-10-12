'use client';

import {useCallback,useEffect,useRef,useState} from 'react';

type AudioMode = 'elevenlabs' | 'system';

/** Shop audio: prefers ElevenLabs cached audio, falls back to Web Speech API when not available. */
export function useShopAIVoice(){
  const [available,setAvailable]=useState<boolean|null>(null);
  const [isSpeaking,setIsSpeaking]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [loginHref,setLoginHref]=useState<'/admin'|'/login'|null>(null);
  const [audioMode,setAudioMode]=useState<AudioMode>('elevenlabs');
  const generation=useRef(0);
  const controller=useRef<AbortController|null>(null);
  const audio=useRef<HTMLAudioElement|null>(null);
  const utterRef=useRef<SpeechSynthesisUtterance|null>(null);
  const voicesRef=useRef<SpeechSynthesisVoice[]>([]);

  // Pre-load browser voices for Web Speech fallback
  useEffect(()=>{
    if(typeof window==='undefined'||!window.speechSynthesis)return;
    const load=()=>{const v=window.speechSynthesis.getVoices();if(v.length>0)voicesRef.current=v;};
    load();
    window.speechSynthesis.addEventListener('voiceschanged',load);
    return ()=>{window.speechSynthesis.removeEventListener('voiceschanged',load);};
  },[]);

  const cancel=useCallback(()=>{
    generation.current++;
    controller.current?.abort();controller.current=null;
    if(audio.current){audio.current.pause();audio.current.onended=null;audio.current.onerror=null;audio.current=null;}
    if(typeof window!=='undefined'&&window.speechSynthesis){window.speechSynthesis.cancel();}
    utterRef.current=null;
    setIsSpeaking(false);
  },[]);

  useEffect(()=>{
    const request=new AbortController();
    const generationRef=generation,controllerRef=controller,audioRef=audio;
    void fetch('/api/media/tts',{signal:request.signal,cache:'no-store'})
      .then(response=>response.ok?response.json():null)
      .then(data=>{if(!request.signal.aborted)setAvailable(data?.available===true);})
      .catch(()=>{if(!request.signal.aborted)setAvailable(false);});
    return ()=>{request.abort();generationRef.current++;controllerRef.current?.abort();audioRef.current?.pause();};
  },[]);

  const speakBrowser=useCallback((text:string,current:number)=>{
    if(typeof window==='undefined'||!window.speechSynthesis){setIsSpeaking(false);return;}
    window.speechSynthesis.cancel();
    const voices=voicesRef.current.length>0?voicesRef.current:window.speechSynthesis.getVoices();
    const preferred=
      voices.find(v=>v.lang.startsWith('en')&&/natural|online|neural/i.test(v.name))||
      voices.find(v=>v.lang==='en-US'&&/google/i.test(v.name))||
      voices.find(v=>v.lang.startsWith('en')&&/female|zira|samantha|jenny|aria|karen/i.test(v.name))||
      voices.find(v=>v.lang==='en-US')||
      voices.find(v=>v.lang.startsWith('en'));
    const utter=new SpeechSynthesisUtterance(text);
    utter.lang='en-US';utter.rate=0.85;utter.pitch=1.05;utter.volume=1;
    if(preferred)utter.voice=preferred;
    utter.onstart=()=>{if(generation.current!==current)return;setIsSpeaking(true);};
    utter.onend=()=>{if(generation.current!==current)return;setIsSpeaking(false);utterRef.current=null;};
    utter.onerror=(e)=>{
      if(generation.current!==current)return;
      if(e.error!=='canceled'&&e.error!=='interrupted')setIsSpeaking(false);
      utterRef.current=null;
    };
    utterRef.current=utter;
    setTimeout(()=>{if(generation.current===current&&window.speechSynthesis)window.speechSynthesis.speak(utter);},15);
  },[]);

  const speak=useCallback(async(text:string)=>{
    cancel();setError(null);setLoginHref(null);
    const current=++generation.current;
    const request=new AbortController();controller.current=request;
    setIsSpeaking(true);

    try{
      const session=await fetch('/api/admin/session',{signal:request.signal,cache:'no-store'})
        .then(r=>r.ok?r.json():null).catch(()=>null);
      if(current!==generation.current)return;
      const isAdmin=session?.authenticated===true;
      const response=await fetch(
        isAdmin?'/api/admin/media/tts':'/api/media/tts',
        {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,pace:'normal'}),signal:AbortSignal.any([request.signal,AbortSignal.timeout(50000)])}
      );
      const result=await response.json().catch(()=>({})) as {url?:string;message?:string};
      if(current!==generation.current)return;

      if(response.ok&&(result.url?.startsWith('/api/media/audio/')||result.url?.startsWith('/api/admin/media/audio/'))){
        // ElevenLabs cached audio found — play it
        const player=new Audio(result.url);audio.current=player;
        player.onended=()=>{if(current===generation.current)setIsSpeaking(false);};
        player.onerror=()=>{
          if(current!==generation.current)return;
          // Playback failed → fallback silently to Web Speech
          setAudioMode('system');
          speakBrowser(text,current);
        };
        await player.play();
        setAudioMode('elevenlabs');
        return;
      }

      // ElevenLabs audio not cached (404) or server error (5xx) → fallback to Web Speech
      if(current!==generation.current)return;
      if(response.status===401){
        // 401: show login hint but still allow Web Speech playback
        setLoginHref(isAdmin?'/admin':'/login');
        setError(isAdmin?'Phiên quản trị đã hết hạn.':'Đăng nhập để nghe giọng AI ElevenLabs. Đang dùng giọng thiết bị.');
      }
      setAudioMode('system');
      speakBrowser(text,current);
    }catch(err){
      if(current!==generation.current)return;
      if(err instanceof DOMException&&err.name==='AbortError'){setIsSpeaking(false);return;}
      // Any other error (network, timeout) → fallback to Web Speech silently
      setAudioMode('system');
      speakBrowser(text,current);
    }
  },[available,cancel,speakBrowser]); // eslint-disable-line react-hooks/exhaustive-deps

  return {speak,cancel,isSpeaking,error,loginHref,available,audioMode};
}
