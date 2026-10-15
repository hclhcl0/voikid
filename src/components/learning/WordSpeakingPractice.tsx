'use client';
import {motion, AnimatePresence} from 'framer-motion';
import {useCallback, useEffect, useRef, useState} from 'react';
import confetti from 'canvas-confetti';
import {useAudioRecorder} from '@/hooks/useAudioRecorder';
import {useTTS} from '@/hooks/useTTS';
import {useProgress} from '@/hooks/useProgress';
import {useSettings} from '@/hooks/useSettings';
import {WordStudyCard} from './WordStudyCard';
import {WordCardSlider} from './WordCardSlider';
import {PRONUNCIATION_NOT_CONFIGURED} from '@/lib/pronunciation/messages';
import {canReassessRecording,pronunciationResultTitle,recordingAttemptFor} from '@/lib/pronunciation/recordingReview';
import type {PronunciationResult, Word} from '@/types';
import {ArrowRight,CircleCheck,Ear,Headphones,Keyboard,Lightbulb,LoaderCircle,Mic,PlugZap,RotateCcw,Square,Star,Target,Volume2} from 'lucide-react';

export function WordSpeakingPractice({word,categoryId,onPrevious,onNext}:{word:Word;categoryId:string;onPrevious?:()=>void;onNext?:()=>void}) {
  const recorder=useAudioRecorder();
  const {speak,cancel,isSpeaking,audioSource}=useTTS();
  const {recordAttempt,getWordProgress}=useProgress();
  const {apiKey,hasKey,hydrated}=useSettings();
  const [result,setResult]=useState<PronunciationResult|null>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [playing,setPlaying]=useState(false);
  const [pace,setPace]=useState<'normal'|'slow'>('normal');
  const [reviewNumber,setReviewNumber]=useState(0);
  const submitted=useRef<{blob:Blob;review:number}|null>(null);
  const recordingAttempt=useRef<{blob:Blob;id:string}|null>(null);
  const request=useRef<AbortController|null>(null);
  const selfAudio=useRef<{audio:HTMLAudioElement;url:string}|null>(null);
  const target=useRef(word);
  const record=useRef(recordAttempt);
  useEffect(()=>{target.current=word;record.current=recordAttempt;},[word,recordAttempt]);
  const stopSelfAudio=useCallback(()=>{
    if(selfAudio.current){selfAudio.current.audio.pause();URL.revokeObjectURL(selfAudio.current.url);selfAudio.current=null;}
  },[]);
  useEffect(()=>()=>{request.current?.abort();cancel();stopSelfAudio();},[cancel,stopSelfAudio]);
  useEffect(()=>{
    if(!recorder.audioBase64||!recorder.audioBlob||(submitted.current?.blob===recorder.audioBlob&&submitted.current.review===reviewNumber))return;
    submitted.current={blob:recorder.audioBlob,review:reviewNumber};
    recordingAttempt.current=recordingAttemptFor(recorder.audioBlob,recordingAttempt.current,()=>crypto.randomUUID());
    const controller=new AbortController();request.current=controller;
    const attemptId=recordingAttempt.current.id,current=target.current;
    const timer=setTimeout(()=>controller.abort(),60000);
    void (async()=>{
      setLoading(true);setError(null);
      try {
        const response=await fetch('/api/pronunciation',{method:'POST',signal:controller.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({attemptId,audioBase64:recorder.audioBase64,mimeType:recorder.audioBlob?.type||'audio/webm',targetWord:current.en,targetVi:current.vi,phonetic:current.phonetic,apiKey:apiKey||undefined,taskKind:'word'})});
        const data=await response.json();
        if(controller.signal.aborted)return;
        if(!response.ok)throw new Error(data.error==='NO_API_KEY'?PRONUNCIATION_NOT_CONFIGURED:data.message||'Chưa chấm được lần đọc này. Bé thử lại nhé!');
        if(data.attemptId!==attemptId||!['pass','practice','retry','service_error'].includes(data.status)||(data.status==='pass'&&data.passed!==true))throw new Error('Cô chưa xác nhận được lần đọc này. Bé thử lại nhé!');
        setResult(data);
        // Uncertain/service results are ungraded. Rechecking the same recording keeps its ID.
        if(data.status==='pass'||data.status==='practice')record.current(categoryId,current.id,data.score,data.status,data.attemptId);
        if(data.status==='pass'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)confetti({particleCount:50,spread:55,origin:{y:0.6}});
      } catch(e) {
        if(request.current===controller)setError(e instanceof Error&&!controller.signal.aborted?e.message:'Kết nối đang chậm. Bé thử lại nhé!');
      } finally {
        clearTimeout(timer);
        if(request.current===controller){request.current=null;setLoading(false);}
      }
    })();
    return ()=>{clearTimeout(timer);controller.abort();if(request.current===controller){request.current=null;submitted.current=null;}};
  },[recorder.audioBase64,recorder.audioBlob,apiKey,categoryId,reviewNumber]);
  const busy=loading||recorder.status==='processing'||recorder.status==='requesting';
  const locked=busy||recorder.status==='recording';
  const progress=getWordProgress(categoryId,word.id);
  function reassess(){
    if(locked||!recorder.audioBlob||!canReassessRecording(result))return;
    cancel();stopSelfAudio();setPlaying(false);setError(null);setReviewNumber(number=>number+1);
  }
  const retry=useCallback(()=>{cancel();stopSelfAudio();setPlaying(false);setResult(null);setError(null);recorder.resetRecorder();},[cancel,stopSelfAudio,recorder]);
  const mic=useCallback(()=>{
    if(busy)return;
    if(recorder.status==='recording'){recorder.stopRecording();return;}
    retry();void recorder.startRecording();
  },[busy,recorder,retry]);
  const move=useCallback((action?:()=>void)=>{if(locked||!action)return;cancel();stopSelfAudio();action();},[locked,cancel,stopSelfAudio]);
  useEffect(()=>{
    const listener=(event:KeyboardEvent)=>{
      if(event.repeat)return;
      if((event.target as HTMLElement)?.closest('button,a,input,textarea,select,summary,[contenteditable="true"]'))return;
      if(event.code==='Space'){event.preventDefault();mic();}
      else if(event.key==='ArrowLeft'&&onPrevious){event.preventDefault();move(onPrevious);}
      else if((event.key==='ArrowRight'||event.key==='Enter')&&onNext){event.preventDefault();move(onNext);}
    };
    window.addEventListener('keydown',listener);return()=>window.removeEventListener('keydown',listener);
  },[mic,move,onPrevious,onNext]);
  function listen(rate:number){stopSelfAudio();setPlaying(false);setPace(rate<=0.7?'slow':'normal');speak(word.en,'en-US',rate);}
  function listenSelf(){
    if(playing){stopSelfAudio();setPlaying(false);return;}
    if(!recorder.audioBlob)return;
    cancel();const url=URL.createObjectURL(recorder.audioBlob),audio=new Audio(url);selfAudio.current={audio,url};setPlaying(true);
    const finish=()=>{if(selfAudio.current?.audio===audio){stopSelfAudio();setPlaying(false);}};
    audio.onended=finish;audio.onerror=finish;void audio.play().catch(finish);
  }
  return <section aria-label="Luyện nói từ vựng" className="mx-auto max-w-2xl space-y-4">
    <WordCardSlider previousDisabled={!onPrevious||locked} nextDisabled={!onNext||locked} onPrevious={()=>move(onPrevious)} onNext={()=>move(onNext)}>
      <WordStudyCard word={word} audioSource={audioSource} prevStars={progress?.stars??0} audioDisabled={locked} speakingMode={isSpeaking?pace:null} onListenNormal={()=>{if(!locked)listen(0.85);}} onListenSlow={()=>{if(!locked)listen(0.7);}}/>
    </WordCardSlider>
    <p className="hidden items-center justify-center gap-2 text-xs text-slate-500 lg:flex"><Keyboard aria-hidden="true" className="h-4 w-4"/>Space: thu âm · ← / →: đổi từ</p>
    {!result&&<div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <MicButton status={loading?'processing':recorder.status} onClick={mic}/>
      {recorder.status==='recording'&&<div className="w-48 text-center"><div role="meter" aria-label="Mức âm thanh micro" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(recorder.inputLevel*100)} className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-orange-500" style={{width:`${Math.round(recorder.inputLevel*100)}%`}}/></div><p className="mt-2 text-xs text-slate-500">Con đọc rõ vào micro nhé</p></div>}
      {recorder.audioBlob&&!loading&&<button onClick={listenSelf} className="flex min-h-11 items-center gap-2 rounded-xl bg-rose-50 px-4 text-sm font-bold text-rose-700"><Headphones aria-hidden="true" className="h-4 w-4"/>{playing?'Dừng nghe':'Nghe lại giọng bé vừa thu'}</button>}
      {(error||recorder.error)&&<p role="alert" className="text-center text-sm font-semibold text-rose-700">{error||recorder.error}</p>}
      {error&&recorder.audioBlob&&<div className="flex flex-wrap justify-center gap-2"><button onClick={reassess} disabled={busy} className="ui-button ui-button-primary">Chấm lại bản ghi này</button><button onClick={retry} className="ui-button ui-button-secondary">Thu lại</button></div>}
      {hydrated&&recorder.serverConfigLoaded&&!hasKey&&!recorder.hasServerKey&&!error&&<p role="status" className="rounded-2xl bg-violet-50 p-3 text-center text-xs text-violet-700">{PRONUNCIATION_NOT_CONFIGURED}</p>}
      <p className="text-center text-xs font-semibold text-slate-500"><Lightbulb aria-hidden="true" className="mr-1 inline h-4 w-4 text-amber-500"/>Nói to rõ ràng · Máy tự dừng khi bé ngưng nói</p>
    </div>}
    <AnimatePresence>{result&&<SpeakingFeedback result={result} word={word} recordedBlob={recorder.audioBlob} consecutivePasses={progress?.consecutivePasses??0} busy={loading} reviewError={error} onReassess={reassess} onRetry={retry} onNext={onNext?()=>move(onNext):undefined}/>}</AnimatePresence>
  </section>;
}

// ── Mic button with wave animation ────────────────────────────────────────
function MicButton({ status, onClick }: { status: string; onClick: () => void }) {
  const isRecording = status === 'recording';
  const isProcessing = status === 'processing';
  const isRequesting = status === 'requesting';

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        disabled={isProcessing || isRequesting}
        className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center gap-1 text-white shadow-2xl transition-all font-bold ${
          isRecording
            ? 'bg-gradient-to-br from-rose-500 to-red-600 animate-record-pulse'
            : isProcessing
            ? 'bg-gradient-to-br from-amber-400 to-orange-500'
            : 'bg-gradient-to-br from-rose-400 to-pink-500 hover:shadow-rose-300 hover:shadow-xl'
        }`}
      >
        {isProcessing||isRequesting?<LoaderCircle aria-hidden="true" className="h-9 w-9 animate-spin"/>:isRecording?<Square aria-hidden="true" className="h-8 w-8 fill-current"/>:<Mic aria-hidden="true" className="h-9 w-9"/>}
        <span className="text-xs">
          {isRequesting ? 'Đang mở mic...' : isProcessing ? 'Đang chấm...' : isRecording ? 'Dừng lại' : 'Nhấn để nói'}
        </span>
      </motion.button>

      {/* Sound wave animation */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1 h-10"
        >
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ── Score display ──────────────────────────────────────────────────────────
export function SpeakingFeedback({ result, word, recordedBlob, consecutivePasses = 0, onNext, onRetry, onReassess, busy=false, reviewError }: {
  result: PronunciationResult;
  word: Word;
  recordedBlob: Blob | null;
  consecutivePasses?: number;
  onNext?: () => void;
  onRetry: () => void;
  onReassess?: () => void;
  busy?: boolean;
  reviewError?: string|null;
}) {
  const isPassed = result.status === 'pass' && result.passed === true;
  const scoreNum = result.score ?? 0;
  const stars = scoreNum >= 85 ? 3 : scoreNum >= 70 ? 2 : scoreNum >= 50 ? 1 : 0;

  const { speak, cancel:cancelModel, isSpeaking: isModelSpeaking } = useTTS();
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);
  const userUrlRef = useRef<string|null>(null);
  const stopUserAudio=useCallback(()=>{
    userAudioRef.current?.pause();userAudioRef.current=null;
    if(userUrlRef.current){URL.revokeObjectURL(userUrlRef.current);userUrlRef.current=null;}
    setIsPlayingUserAudio(false);
  },[]);

  const handlePlayUserAudio = () => {
    if (!recordedBlob) return;
    if (isPlayingUserAudio && userAudioRef.current) {
      stopUserAudio();
      return;
    }
    cancelModel();stopUserAudio();
    const url = URL.createObjectURL(recordedBlob);
    const audio = new Audio(url);
    userUrlRef.current=url;
    userAudioRef.current = audio;
    setIsPlayingUserAudio(true);

    const finish=()=>{if(userAudioRef.current===audio)stopUserAudio();};
    audio.onended=finish;audio.onerror=finish;void audio.play().catch(finish);
  };

  const handlePlayModelAudio = () => {
    stopUserAudio();
    speak(word.en, 'en-US', 0.85);
  };

  useEffect(() => {
    return () => {
      if (userAudioRef.current) {
        userAudioRef.current.pause();
        userAudioRef.current = null;
      }
      if(userUrlRef.current){URL.revokeObjectURL(userUrlRef.current);userUrlRef.current=null;}
      cancelModel();
    };
  }, [cancelModel]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`rounded-3xl p-5 border-2 shadow-xl ${
        isPassed
          ? 'bg-emerald-50 border-emerald-300'
          : 'bg-amber-50 border-amber-300'
      }`}
    >
      {/* 2-Streak Mastery Bar */}
      <div className="bg-white/90 backdrop-blur rounded-2xl px-3.5 py-2 mb-3.5 border border-amber-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Target aria-hidden="true" className="h-4 w-4 text-violet-500"/>
          <span className="text-xs font-bold text-gray-700">Lượt đọc rõ liên tiếp:</span>
        </div>
        <div>
          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
            consecutivePasses >= 2
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : consecutivePasses === 1
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {consecutivePasses >= 2
              ? 'Đã đọc rõ 2 lượt'
              : consecutivePasses === 1
              ? 'Đã đọc rõ 1 lượt'
              : 'Chưa có lượt đọc rõ'}
          </span>
        </div>
      </div>

      {/* Score ring */}
      <div className="flex items-center gap-4 mb-3">
        {result.score !== null ? (
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black shadow-inner ${
            isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {result.score}
          </div>
        ) : (
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black shadow-inner ${
            isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {isPassed?<Star aria-hidden="true" className="h-9 w-9 fill-amber-200 text-amber-500"/>:<RotateCcw aria-hidden="true" className="h-9 w-9"/>}
          </div>
        )}
        <div className="flex-1">
          {result.score !== null && (
            <div className="flex gap-1 mb-1">
              {[1,2,3].map((s) => (
                <motion.span key={s} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: s * 0.1, type: 'spring' }}
                  ><Star aria-hidden="true" className={`h-6 w-6 ${s <= stars ? 'fill-amber-300 text-amber-500' : 'text-slate-200'}`}/></motion.span>
              ))}
            </div>
          )}
          <p className="flex items-center gap-1.5 font-bold text-sm text-gray-600">
            {isPassed?<CircleCheck aria-hidden="true" className="h-4 w-4 text-emerald-600"/>:result.status==='service_error'?<PlugZap aria-hidden="true" className="h-4 w-4"/>:result.status==='retry'?<Ear aria-hidden="true" className="h-4 w-4"/>:<RotateCcw aria-hidden="true" className="h-4 w-4"/>}
            {pronunciationResultTitle(result)}
          </p>
        </div>
      </div>

      {/* Feedback */}
      <div className={`rounded-2xl p-3 mb-3 ${isPassed ? 'bg-emerald-100' : 'bg-amber-100'}`}>
        <p role="status" className="font-bold text-sm text-gray-700">{busy?'Đang kiểm tra lại bản ghi của con…':result.feedbackVi}</p>
        {(result.status==='retry'||result.status==='service_error')&&<p className="mt-2 text-xs text-slate-600">Lần này chưa được chấm đúng hoặc sai và không làm mất sao.</p>}
        {reviewError&&<p role="alert" className="mt-2 text-sm text-rose-700">{reviewError}</p>}
      </div>

      {/* ── Compare audio box: Giọng của bé & Giọng mẫu ── */}
      <div className="bg-white/90 backdrop-blur rounded-2xl p-3.5 mb-4 border border-rose-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-black text-gray-700 flex items-center gap-1.5">
            <Headphones aria-hidden="true" className="h-4 w-4 text-violet-500"/>
            <span>Nghe lại &amp; So sánh:</span>
          </p>
          {recordedBlob && (
            <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
              Bản thu của bé
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Nút nghe lại giọng bé */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handlePlayUserAudio}
            disabled={!recordedBlob||busy}
            className={`py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              isPlayingUserAudio
                ? 'bg-rose-500 text-white ring-2 ring-rose-300 animate-pulse'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-rose-200 hover:shadow-md'
            }`}
          >
            {isPlayingUserAudio?<Square aria-hidden="true" className="h-4 w-4"/>:<Headphones aria-hidden="true" className="h-4 w-4"/>}
            <span>{isPlayingUserAudio ? 'Đang phát...' : 'Nghe giọng bé'}</span>
          </motion.button>

          {/* Nút nghe giọng mẫu chuẩn */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handlePlayModelAudio}
            disabled={busy}
            className={`py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              isModelSpeaking
                ? 'bg-violet-600 text-white ring-2 ring-violet-300 animate-pulse'
                : 'bg-white text-violet-700 border-2 border-violet-200 hover:bg-violet-50'
            }`}
          >
            {isModelSpeaking?<Square aria-hidden="true" className="h-4 w-4"/>:<Volume2 aria-hidden="true" className="h-4 w-4"/>}
            <span>{isModelSpeaking ? 'Đang đọc...' : 'Nghe mẫu'}</span>
          </motion.button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" aria-busy={busy}>
        {recordedBlob&&onReassess&&canReassessRecording(result)&&<button onClick={()=>{stopUserAudio();cancelModel();onReassess();}} disabled={busy} className="ui-button ui-button-primary flex-1 disabled:opacity-50">{busy?'Đang chấm lại…':'Chấm lại bản ghi này'}</button>}
        <button onClick={onRetry} disabled={busy} className="flex flex-1 items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-sm bg-white border-2 border-gray-200 text-gray-600 hover:border-violet-300 transition-colors disabled:opacity-50">
          <RotateCcw aria-hidden="true" className="h-4 w-4"/>Thử lại
        </button>
        {isPassed && onNext && (
          <button onClick={onNext} className="flex flex-1 items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg">
            Tiếp<ArrowRight aria-hidden="true" className="h-4 w-4"/>
          </button>
        )}
      </div>
    </motion.div>
  );
}
