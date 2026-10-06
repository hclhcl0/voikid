'use client';
import {useEffect,useState,useSyncExternalStore} from 'react';
function subscribe(callback:()=>void) {window.speechSynthesis?.addEventListener('voiceschanged',callback);return ()=>window.speechSynthesis?.removeEventListener('voiceschanged',callback);}
export function useEnglishAudio() {
  const browser=useSyncExternalStore(subscribe,()=>!!window.speechSynthesis?.getVoices().some(v=>v.lang.startsWith('en')),()=>false);
  const [cloud,setCloud]=useState(false);
  useEffect(()=>{const controller=new AbortController();void fetch('/api/media/tts',{signal:controller.signal}).then(r=>r.ok?r.json():null).then(s=>{if(!controller.signal.aborted)setCloud(s?.available===true);}).catch(()=>{});return ()=>controller.abort();},[]);
  return browser||cloud;
}
