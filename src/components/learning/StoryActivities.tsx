'use client';
import {useEffect,useRef,useState} from 'react';
import {useAudioRecorder} from '@/hooks/useAudioRecorder';
import {normalizeReading,recordStoryAnswer} from '@/lib/stories/learning';
import type {StorySession} from '@/lib/stories/types';
import {StoryListeningFill} from './StoryListeningFill';
const button='learning-button border border-slate-200 bg-white text-sm disabled:opacity-40';
type Mode='quiz'|'dictation'|'listen-fill'|'fill'|'shadowing';
function Shadowing({session,index,play,stopAudio,save}:{session:StorySession;index:number;play:(index:number,onStarted?:()=>void)=>void;stopAudio:()=>void;save:(session:StorySession)=>void}) {
  const recorder=useAudioRecorder('sentence'); const audioRef=useRef<HTMLAudioElement>(null);
  useEffect(()=>{if(!recorder.audioBlob) return;const url=URL.createObjectURL(recorder.audioBlob);if(audioRef.current) audioRef.current.src=url;return()=>URL.revokeObjectURL(url);},[recorder.audioBlob]);
  return <div className="space-y-4"><p className="text-lg font-bold">{session.lesson.sentences[index].en}</p><p className="text-sm text-slate-500">Nghe mẫu, đọc theo và nghe lại. Bản ghi ở phiên này, chưa chấm phát âm.</p><div className="flex flex-wrap gap-2"><button className={button} onClick={()=>play(index)}>Nghe mẫu</button><button className={button} disabled={['requesting','processing'].includes(recorder.status)} onClick={()=>{stopAudio();if(recorder.status==='recording') recorder.stopRecording();else void recorder.startRecording();}}>{recorder.status==='recording'?'Dừng thu':'Thu giọng của con'}</button></div>{recorder.audioBlob&&<><audio ref={audioRef} controls className="w-full"/><button className={button} onClick={()=>save({...session,speakingPracticed:true})}>Đã thực hành đọc theo</button></>}{recorder.error&&<p role="alert" className="text-sm text-rose-700">{recorder.error}</p>}</div>;
}
export function StoryActivities({session,save,play,stopAudio,audioAvailable}:{session:StorySession;save:(session:StorySession)=>void;play:(index:number,onStarted?:()=>void)=>void;stopAudio:()=>void;audioAvailable:boolean}) {
  const [mode,setMode]=useState<Mode>(session.lesson.questions.length?'quiz':'listen-fill');const [index,setIndex]=useState(0);const [response,setResponse]=useState('');const [revealed,setRevealed]=useState(false);const [heard,setHeard]=useState(false);const [result,setResult]=useState<string>('');
  const lesson=session.lesson,question=lesson.questions[index%lesson.questions.length],sentence=lesson.sentences[index%lesson.sentences.length];
  const term=lesson.vocabulary[index%lesson.vocabulary.length];
  const gapSentence=lesson.sentences.find(s=>s.id===term?.sentenceId);
  const key=mode==='quiz'?`quiz:${question?.id}`:mode==='dictation'?`dictation:${sentence.id}`:`${mode}:${term?.id}`;
  const previous=session.answers[key];
  const count=mode==='quiz'?lesson.questions.length:mode==='fill'?lesson.vocabulary.length:lesson.sentences.length;
  const answer=mode==='quiz'?question?.options[question.answerIndex]??'':mode==='dictation'?sentence.en:term?.en??'';
  const listening=mode==='dictation';
  function reset() {stopAudio();setResponse('');setRevealed(false);setHeard(false);setResult('');}
  function choose(next:Mode) {reset();setMode(next);setIndex(0);}
  function submit() {
    const correct=normalizeReading(response)===normalizeReading(answer);
    save(recordStoryAnswer(session,key,response,correct,revealed));
    setResult(correct?'Đúng rồi!':'Con thử lại nhé.');
  }
  const gap=term&&gapSentence?gapSentence.en.replace(new RegExp(term.en.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),'_____'):'';
  return <div className="space-y-5">
    {!lesson.questions.length&&<p className="text-sm text-slate-500">Bài tự viết chưa có câu hỏi hiểu bài. Con có thể luyện nghe, điền từ và đọc theo.</p>}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{([['quiz','Hiểu bài · Quiz'],['dictation','Nghe & viết · Dictation'],['listen-fill','Nghe & điền từ'],['fill','Điền từ trong câu'],['shadowing','Đọc theo · Shadowing']] as [Mode,string][]).map(([m,label])=><button key={m} disabled={m==='quiz'&&!lesson.questions.length||m==='fill'&&!lesson.vocabulary.length} aria-pressed={mode===m} className={`${button} ${mode===m?'border-orange-500 bg-orange-50 text-orange-900':''}`} onClick={()=>choose(m)}>{label}</button>)}</div>
    {mode==='listen-fill'?<StoryListeningFill key={session.id} session={session} save={save} play={play} stopAudio={stopAudio} audioAvailable={audioAvailable}/>:<section className="space-y-4 rounded-2xl bg-slate-50 p-5">
      <div className="flex justify-between text-sm text-slate-500"><span>Câu {index+1}/{count}</span><span>{previous?`${previous.attempts} lượt · ${previous.correct?'đã làm đúng':'cần luyện'}`:''}</span></div>
      {mode==='shadowing'?<Shadowing key={index} session={session} index={index} play={play} stopAudio={stopAudio} save={save}/>:<>
        {mode==='quiz'?<><h3 className="text-lg font-bold">{question.en}</h3><p className="text-sm text-slate-500">{question.vi}</p><div className="grid gap-2 sm:grid-cols-2">{question.options.map(option=><button key={option} className={`${button} text-left ${response===option?'border-orange-500 bg-orange-50':''}`} onClick={()=>setResponse(option)}>{option}</button>)}</div></>:<>
          <h3 className="text-lg font-bold">{mode==='dictation'?'Nghe và viết lại cả câu':'Điền từ phù hợp với đoạn văn'}</h3>
          {listening&&<button className={button} disabled={!audioAvailable} onClick={()=>play(lesson.sentences.findIndex(s=>s.id===sentence.id),()=>setHeard(true))}>🔊 Nghe câu</button>}
          {mode!=='dictation'&&<p className="text-lg leading-8">{gap}</p>}
          <label className="block text-sm font-bold">{mode==='dictation'?'Câu con nghe được':'Từ còn thiếu'}<input className="mt-2 min-h-11 w-full rounded-xl border bg-white px-3" value={response} onChange={e=>setResponse(e.target.value)} maxLength={600} autoComplete="off"/></label>
        </>}
        {listening&&!audioAvailable&&<p className="text-sm text-amber-800">Thiết bị chưa có giọng tiếng Anh. Con có thể làm bài đọc hoặc điền từ.</p>}
        <div className="flex flex-wrap gap-2"><button className="learning-button bg-orange-600 text-white disabled:opacity-40" disabled={!response.trim()||listening&&!heard} onClick={submit}>Kiểm tra</button><button className={button} onClick={()=>setRevealed(true)}>Xem gợi ý / đáp án</button></div>
        {revealed&&<p className="rounded-xl bg-orange-50 p-3 text-sm">{answer}{mode==='quiz'?` · ${question.explanationVi}`:''}</p>}
        <p role="status" className="text-sm font-bold text-orange-800">{result}</p>
      </>}
      <div className="flex justify-between gap-3"><button className={button} disabled={index===0} onClick={()=>{reset();setIndex(index-1);}}>← Câu trước</button><button className={button} disabled={index>=count-1} onClick={()=>{reset();setIndex(index+1);}}>Câu tiếp →</button></div>
    </section>}
    <p className="text-xs text-slate-500">Lần đầu đúng, không xem đáp án được tính là tự làm. Luyện lại vẫn được lưu nhưng không thay thế kết quả lần đầu.</p>
  </div>;
}
