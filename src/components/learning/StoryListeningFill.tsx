'use client';

import {useEffect,useId,useRef,useState} from 'react';
import {gradeListeningTask,listeningLengthHint,listeningTasks} from '@/lib/stories/listeningFill';
import type {ListeningFillScope,ListeningTask} from '@/lib/stories/listeningFill';
import type {StorySession} from '@/lib/stories/types';

const button='learning-button border border-slate-200 bg-white text-sm disabled:opacity-40';
type Props={session:StorySession;save:(session:StorySession)=>void;play:(index:number,onStarted?:()=>void)=>void;stopAudio:()=>void;audioAvailable:boolean};

function Exercise({session,save,play,audioAvailable,task}:Props&{task:ListeningTask}) {
  const [responses,setResponses]=useState<string[]>(task.gaps.map(()=>''));
  const [heard,setHeard]=useState(false);
  const [revealed,setRevealed]=useState(false);
  const [correct,setCorrect]=useState<boolean[]|null>(null);
  const active=useRef(true);
  const hintId=useId();
  useEffect(()=>{active.current=true;return()=>{active.current=false;};},[]);
  const learned=task.gaps.filter(gap=>session.answers[gap.key]?.correct).length;
  function submit() {
    const result=gradeListeningTask(session,task,responses,revealed);
    save(result.session);setCorrect(result.correct);
  }
  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-lg font-bold">Nghe câu rồi điền từ còn thiếu</h3>
      {learned>0&&<span className="text-sm text-slate-500">Đã làm đúng {learned}/{task.gaps.length} từ</span>}
    </div>
    <button className={button} disabled={!audioAvailable} onClick={()=>play(task.sentenceIndex,()=>{if(active.current)setHeard(true);})}>🔊 Nghe câu</button>
    <div className="text-lg leading-[3rem]">
      {task.gaps.map((gap,index)=><span key={gap.key}>
        {task.text.slice(index?task.gaps[index-1].end:0,gap.start)}
        <label className="mx-1 mb-3 inline-flex max-w-full flex-col align-top" style={{width:`${Math.min(24,Math.max(8,Array.from(gap.answer).length+2))}ch`}}>
          <span className="sr-only">Từ / cụm từ còn thiếu ({index+1})</span>
          <input aria-describedby={`${hintId}-${index}`} aria-invalid={correct?.[index]===false} className={`h-11 w-full rounded-lg border-2 bg-white px-2 text-center text-lg leading-normal outline-none focus:ring-2 focus:ring-orange-200 ${correct?.[index]===true?'border-emerald-500':correct?.[index]===false?'border-rose-400':'border-orange-300'}`} value={responses[index]} onChange={e=>{setResponses(responses.map((value,i)=>i===index?e.target.value:value));setCorrect(null);}} placeholder={listeningLengthHint(gap.answer)} maxLength={200} autoComplete="off" autoCapitalize="none" spellCheck={false}/>
          <span id={`${hintId}-${index}`} className="sr-only">Số chữ cái cần điền: {listeningLengthHint(gap.answer)}</span>
          {correct&&<span className={`mt-1 text-xs leading-4 ${correct[index]?'text-emerald-700':'text-rose-700'}`}>{correct[index]?'Đúng rồi!':'Con nghe lại và thử nhé.'}</span>}
        </label>
      </span>)}
      {task.text.slice(task.gaps[task.gaps.length-1].end)}
    </div>
    {!audioAvailable&&<p className="text-sm text-amber-800">Thiết bị chưa có giọng tiếng Anh. Con có thể làm bài đọc hoặc điền từ.</p>}
    {!heard&&audioAvailable&&<p className="text-sm text-slate-500">Con nghe câu trước khi kiểm tra nhé.</p>}
    <div className="flex flex-wrap gap-2">
      <button className="learning-button bg-orange-600 text-white disabled:opacity-40" disabled={!heard||responses.some(value=>!value.trim())} onClick={submit}>Kiểm tra</button>
      <button className={button} onClick={()=>setRevealed(true)}>Xem đáp án</button>
    </div>
    {revealed&&<p className="rounded-xl bg-orange-50 p-3 text-sm">{task.gaps.map((gap,index)=>`(${index+1}) ${gap.answer}`).join(' · ')}</p>}
    <p role="status" className="text-sm font-bold text-orange-800">{correct?(correct.every(Boolean)?'Con đã điền đúng tất cả các từ!':`Đúng ${correct.filter(Boolean).length}/${correct.length} từ. Con thử lại nhé.`):''}</p>
  </div>;
}

export function StoryListeningFill(props:Props) {
  const [size,setSize]=useState<1|2|3>(props.session.lesson.grade<=2?1:2);
  const [scope,setScope]=useState<ListeningFillScope>('main');
  const [index,setIndex]=useState(0);
  const tasks=listeningTasks(props.session.lesson,size,scope);
  const task=tasks[index];
  const totalWords=tasks.reduce((sum,item)=>sum+item.gaps.length,0);
  const correctWords=tasks.flatMap(item=>item.gaps).filter(gap=>props.session.answers[gap.key]?.correct).length;
  function reset() {props.stopAudio();setIndex(0);}
  return <section className="space-y-5 rounded-2xl bg-slate-50 p-5">
    <div className="flex flex-wrap gap-4">
      <label className="text-sm font-bold">Chỗ trống mỗi câu
        <select className="ml-2 min-h-11 rounded-xl border bg-white px-3" value={size} onChange={e=>{reset();setSize(Number(e.target.value) as 1|2|3);}}>
          <option value={1}>1 chỗ trống</option><option value={2}>2 chỗ trống</option><option value={3}>3 chỗ trống</option>
        </select>
      </label>
      <label className="text-sm font-bold">Từ luyện tập
        <select className="ml-2 min-h-11 rounded-xl border bg-white px-3" value={scope} onChange={e=>{reset();setScope(e.target.value as ListeningFillScope);}}>
          <option value="main">Từ chính trong bài</option><option value="all">Tất cả từ trong bài</option>
        </select>
      </label>
    </div>
    <p className="text-sm text-slate-500">{totalWords} lượt điền từ trong toàn bộ đoạn văn · Đã làm đúng {correctWords}/{totalWords}. Mỗi câu có thể được luyện nhiều lượt với các từ khác nhau.</p>
    {task?<>
      <p className="text-sm text-slate-500">Bài {index+1}/{tasks.length} · Câu {task.sentenceIndex+1}/{props.session.lesson.sentences.length}</p>
      <Exercise key={`${size}:${scope}:${task.id}`} {...props} task={task}/>
      <div className="flex justify-between gap-3">
        <button className={button} disabled={index===0} onClick={()=>{props.stopAudio();setIndex(index-1);}}>← Bài trước</button>
        <button className={button} disabled={index>=tasks.length-1} onClick={()=>{props.stopAudio();setIndex(index+1);}}>Bài tiếp →</button>
      </div>
    </>:<p>Đoạn văn này chưa có từ để luyện nghe.</p>}
  </section>;
}
