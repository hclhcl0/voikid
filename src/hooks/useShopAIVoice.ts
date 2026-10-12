'use client';

import {useCallback,useEffect,useRef,useState} from 'react';

/** Shop audio must come from configured ElevenLabs media, never system speech. */
export function useShopAIVoice(){
  const [available,setAvailable]=useState<boolean|null>(null);
  const [isSpeaking,setIsSpeaking]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [needsLogin,setNeedsLogin]=useState(false);
  const generation=useRef(0);
  const controller=useRef<AbortController|null>(null);
  const audio=useRef<HTMLAudioElement|null>(null);

  const cancel=useCallback(()=>{
    generation.current++;
    controller.current?.abort();controller.current=null;
    if(audio.current){audio.current.pause();audio.current.onended=null;audio.current.onerror=null;audio.current=null;}
    setIsSpeaking(false);
  },[]);

  useEffect(()=>{
    const request=new AbortController();
    const generationRef=generation, controllerRef=controller, audioRef=audio;
    void fetch('/api/media/tts',{signal:request.signal,cache:'no-store'})
      .then(response=>response.ok?response.json():null)
      .then(data=>{if(!request.signal.aborted)setAvailable(data?.available===true);})
      .catch(()=>{if(!request.signal.aborted)setAvailable(false);});
    return ()=>{request.abort();generationRef.current++;controllerRef.current?.abort();audioRef.current?.pause();};
  },[]);

  const speak=useCallback(async(text:string)=>{
    cancel();setError(null);setNeedsLogin(false);
    if(available===false){setError('Giọng AI chưa được cấu hình.');return;}
    const current=++generation.current;
    const request=new AbortController();controller.current=request;
    let serviceError:string|null=null;
    setIsSpeaking(true);
    try{
      const response=await fetch('/api/media/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,pace:'normal'}),signal:AbortSignal.any([request.signal,AbortSignal.timeout(50000)])});
      const result=await response.json().catch(()=>({})) as {url?:string;message?:string};
      if(current!==generation.current)return;
      if(!response.ok){
        if(response.status===401)setNeedsLogin(true);
        serviceError=response.status===401?'Đăng nhập tài khoản để nghe giọng AI.':result.message||'Giọng AI chưa sẵn sàng cho từ này.';
        throw new Error('SHOP_AUDIO_UNAVAILABLE');
      }
      if(!result.url?.startsWith('/api/media/audio/')&&!result.url?.startsWith('/api/admin/media/audio/'))throw new Error('AI_AUDIO_UNAVAILABLE');
      const player=new Audio(result.url);audio.current=player;
      player.onended=()=>{if(current===generation.current)setIsSpeaking(false);};
      player.onerror=()=>{if(current===generation.current){setIsSpeaking(false);setError('Không phát được giọng AI.');}};
      await player.play();
    }catch{
      if(current===generation.current){setIsSpeaking(false);setError(serviceError||'Không tải hoặc phát được giọng AI. Vui lòng thử lại.');}
    }
  },[available,cancel]);

  return {speak,cancel,isSpeaking,error,needsLogin,available};
}
