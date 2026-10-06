'use client';
import Link from 'next/link';
import {useRouter,useSearchParams} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
import {useProfileContext} from '@/context/ProfileContext';
import {useSettings} from '@/hooks/useSettings';
import {useBackendSession} from '@/hooks/useBackendSession';
import {useTTS} from '@/hooks/useTTS';
import {useEnglishAudio} from '@/hooks/useEnglishAudio';
import {BAND_LABELS,newStorySession,readingBand,readingEvidence,validStorySession} from '@/lib/stories/learning';
import type {StorySession,StorySource,StoryLesson} from '@/lib/stories/types';
import type {CurriculumUnit} from '@/lib/learning/types';
import {StoryActivities} from './StoryActivities';
import {StoryTools} from './StoryTools';
import {useStoryAccess} from '@/hooks/useStoryAccess';
import {useVocabularyCatalog} from '@/hooks/useVocabularyCatalog';
import {useCustomCategories} from '@/hooks/useCustomCategories';
import {newStoryVocabulary,mergeExtractedVocabulary} from '@/lib/stories/vocabulary';
const button='learning-button border border-slate-200 bg-white text-sm disabled:opacity-40';
type Tab='passage'|'sentences'|'vocabulary'|'activities';
export function StoryReader({unit,source}:{unit:CurriculumUnit;source:StorySource}) {
  const ctx=useProfileContext();
  const access=useStoryAccess();
  if(!ctx.hydrated||access.loading) return <p role="status" className="p-8">Đang mở hồ sơ học sinh…</p>;
  return <Reader key={`${ctx.activeProfileId}:${unit.id}:${access.canManage}`} unit={unit} source={source} canManage={access.canManage}/>;
}
function Reader({unit,source,canManage}:{unit:CurriculumUnit;source:StorySource;canManage:boolean}) {
  const ctx=useProfileContext(),admin=useBackendSession(),{apiKey}=useSettings();
  const catalog=useVocabularyCatalog(),custom=useCustomCategories();
  const [importedTerms,setImportedTerms]=useState<StoryLesson['vocabulary']>([]);
  const [scanning,setScanning]=useState(false);
  const requested=useSearchParams().get('story');
  const router=useRouter();
  const savedSessions=Object.values(ctx.progress.storySessions??{}).filter(s=>validStorySession(s,ctx.activeProfileId)&&s.unitId===unit.id).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
  const [session,setSession]=useState<StorySession|null>(()=>savedSessions.find(s=>s.id===requested)??savedSessions[0]??null);
  const sessionRef=useRef(session); const controllerRef=useRef<AbortController|null>(null);const playbackRef=useRef(0);
  const [tab,setTab]=useState<Tab>(canManage?'passage':'activities'),[translation,setTranslation]=useState(true),[columns,setColumns]=useState(false),[rate,setRate]=useState(0.85),[activeLine,setActiveLine]=useState(0),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[search,setSearch]=useState(''),[selectedTerm,setSelectedTerm]=useState<StoryLesson['vocabulary'][number]|null>(null),[variant,setVariant]=useState(session?.lesson.variant??0);
  const {speak,cancel,isSpeaking,error:audioError}=useTTS(); const audioAvailable=useEnglishAudio();
  const evidence=readingEvidence(ctx.progress,ctx.activeProfileId,unit.id),band=readingBand(evidence);
  const grade=ctx.activeProfile.gradeId==='maugiao'?1:Number(ctx.activeProfile.gradeId.replace('lop',''));
  const matchingGrade=grade===unit.grade;
  function save(next:StorySession) {
    const updated={...next,savedAt:next.savedAt??new Date().toISOString(),updatedAt:new Date().toISOString()};
    const result=ctx.saveStorySession(updated);if(!result.success) {setMessage(result.message||'Chưa lưu được tiến độ.');return false;}
    if(sessionRef.current?.id!==updated.id) router.replace(`/unit/${unit.id}?story=${encodeURIComponent(updated.id)}`,{scroll:false});
    sessionRef.current=updated;setSession(updated);return true;
  }
  function stop() {playbackRef.current++;cancel();}
  useEffect(()=>()=>{controllerRef.current?.abort();playbackRef.current++;},[]);
  function openStory(next:StorySession) {
    stop();controllerRef.current?.abort();setBusy(false);setScanning(false);sessionRef.current=next;setSession(next);router.replace(`/unit/${unit.id}?story=${encodeURIComponent(next.id)}`,{scroll:false});setActiveLine(0);setTab('passage');setSelectedTerm(null);setSearch('');setVariant(next.lesson.variant??0);setMessage('');
  }
  function removeStory(id:string) {
    stop();controllerRef.current?.abort();setBusy(false);setScanning(false);
    const result=ctx.deleteStorySession(id);if(!result.success) {setMessage(result.message??'Chưa xóa được bài.');return;}
    if(sessionRef.current?.id===id) {
      const next=savedSessions.find(s=>s.id!==id)??null;
      if(next) openStory(next);else {sessionRef.current=null;setSession(null);router.replace(`/unit/${unit.id}`,{scroll:false});setActiveLine(0);setSelectedTerm(null);}
    }
    setMessage('Đã xóa đoạn văn khỏi kho bài của hồ sơ này.');
  }
  async function generate(nextVariant:number) {
    if(!canManage) return;
    stop();setBusy(true);setMessage('');controllerRef.current?.abort();const controller=new AbortController();controllerRef.current=controller;
    try {
      const response=await fetch(admin.authenticated?'/api/admin/story':'/api/story',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({unitId:unit.id,profileId:ctx.activeProfileId,gradeId:ctx.activeProfile.gradeId,evidence,variant:nextVariant,apiKey:apiKey||undefined})});
      const lesson=await response.json();if(!response.ok) throw new Error(lesson.message);
      if(controller.signal.aborted) return;
      const existing=ctx.progress.storySessions?.[lesson.id];
      if(!save(existing&&validStorySession(existing,ctx.activeProfileId)?existing:newStorySession(lesson,ctx.activeProfileId))) return;
      setVariant(nextVariant);setActiveLine(0);setTab('passage');setSelectedTerm(null);
    } catch(error) {if(!controller.signal.aborted) setMessage(error instanceof Error?error.message:'Chưa tạo được bài đọc.');}
    finally {if(!controller.signal.aborted) setBusy(false);}
  }
  async function scanVocabulary() {
    const current=sessionRef.current;if(!canManage||!current||busy||scanning)return;
    stop();setScanning(true);setMessage('');controllerRef.current?.abort();const controller=new AbortController();controllerRef.current=controller;
    try {
      const response=await fetch(admin.authenticated?'/api/admin/story/vocabulary':'/api/story/vocabulary',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({profileId:ctx.activeProfileId,lesson:current.lesson,apiKey:apiKey||undefined})});
      const result=await response.json();if(!response.ok)throw new Error(result.message);
      if(controller.signal.aborted||sessionRef.current?.id!==current.id)return;
      if(save({...sessionRef.current,lesson:mergeExtractedVocabulary(sessionRef.current.lesson,result.vocabulary)}))setMessage(result.vocabulary.length?'Đã rà soát toàn bộ đoạn văn và bổ sung danh sách từ/cụm từ mới.':'Đã rà soát toàn bộ đoạn văn; chưa tìm thấy từ/cụm từ mới ngoài kho đã học.');
    }catch(error){if(!controller.signal.aborted)setMessage(error instanceof Error?error.message:'Chưa rà soát được từ vựng.');}
    finally{if(!controller.signal.aborted)setScanning(false);}
  }
  function playLine(index:number,onStarted?:()=>void) {
    stop();const current=sessionRef.current;if(!current) return;const generation=playbackRef.current;setActiveLine(index);
    speak(current.lesson.sentences[index].en,'en-US',rate,()=>{if(generation!==playbackRef.current) return;const s=sessionRef.current;if(s&&!s.listened) save({...s,listened:true});onStarted?.();});
  }
  function playAll() {
    if(isSpeaking) {stop();return;}
    stop();const generation=playbackRef.current;
    const next=(index:number)=>{
      const current=sessionRef.current;if(!current||generation!==playbackRef.current||index>=current.lesson.sentences.length) return;
      setActiveLine(index);speak(current.lesson.sentences[index].en,'en-US',rate,()=>{if(generation!==playbackRef.current) return;const s=sessionRef.current;if(s&&!s.listened) save({...s,listened:true});},()=>next(index+1));
    };next(0);
  }
  const lesson=session?.lesson;
  const newVocabulary=lesson?newStoryVocabulary(lesson,[...catalog.categories,...custom.categories,{id:'recent_imports',name_vi:'',name_en:'',emoji:'',color:'',gradient:'',gradeId:`lop${grade}`,words:importedTerms.map(term=>({id:term.id,en:term.en,vi:term.vi,phonetic:term.ipa,emoji:'',example_en:'',example_vi:''}))}],grade):[];
  const highlighted=(text:string)=>{
    if(!lesson) return text;
    const terms=[...newVocabulary].sort((a,b)=>b.en.length-a.en.length);
    if(!terms.length) return text;
    const regex=new RegExp(`(${terms.map(v=>v.en.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`,'gi');
    return text.split(regex).map((part,i)=>{const term=terms.find(v=>v.en.toLowerCase()===part.toLowerCase());return term?<button key={i} className="rounded bg-orange-50 px-0.5 text-orange-800 underline decoration-orange-300 underline-offset-4 hover:bg-orange-100" onClick={()=>setSelectedTerm(term)}>{part}</button>:<span key={i}>{part}</span>;});
  };
  return <main className="learning-shell min-h-screen bg-slate-50 px-4 py-6 pb-20"><div className="mx-auto max-w-6xl space-y-5">
    <header className="flex flex-wrap items-center justify-between gap-3"><Link href="/curriculum" className={button}>← Các bài đọc</Link><button className={button} onClick={ctx.openProfileModal}>{ctx.activeProfile.avatar} {ctx.activeProfile.name} · Lớp {grade}</button></header>
    <section><p className="text-sm font-bold text-orange-700">Lớp {unit.grade} · Unit {source.number} · {source.topic}</p><h1 className="mt-2 text-3xl font-bold text-slate-900">{unit.emoji} {lesson?.title??'Học qua đoạn văn'}</h1><p className="mt-2 text-sm text-slate-500">{lesson?.origin==='manual'?'Đoạn văn tự viết · Nội dung do bạn cung cấp.':`${lesson?BAND_LABELS[lesson.band]:BAND_LABELS[band]} · Dựa trên mẫu câu của unit và kết quả tự làm đã lưu.`}</p></section>
    {!matchingGrade&&<p role="alert" className="rounded-xl bg-amber-50 p-4">Bài này thuộc lớp {unit.grade}. Chọn bài đúng lớp trong hồ sơ của con. <Link className="underline" href="/curriculum">Quay lại chọn bài</Link></p>}
    {message&&<p role="alert" className="rounded-xl bg-orange-50 p-4 text-orange-900">{message}</p>}
    {canManage&&matchingGrade&&<StoryTools key={session?.id??'empty'} session={session} sessions={savedSessions} unitId={unit.id} source={source} terms={newVocabulary} onImported={terms=>setImportedTerms(current=>[...current,...terms])} onOpen={openStory} onDelete={removeStory} onSave={()=>{if(session&&save(session))setMessage('Đã lưu đoạn văn và tiến độ. Mở lại trong Đoạn văn đã lưu.');}} onCreate={lesson=>{stop();controllerRef.current?.abort();setBusy(false);setScanning(false);const next=newStorySession(lesson,ctx.activeProfileId);if(save(next)){setActiveLine(0);setTab('passage');setSelectedTerm(null);setMessage('Đã lưu đoạn văn tự viết.');}}}/>}
    {!lesson&&!canManage?<p className="rounded-2xl border bg-white p-5 text-slate-600">Phụ huynh hoặc admin cần chuẩn bị bài học cho unit này trước khi con luyện tập.</p>:!lesson?<section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">Một đoạn văn mới cho chủ đề {source.topic}</h2><p className="text-slate-600">AI viết đoạn văn ngắn, bản dịch, từ vựng và câu hỏi theo mẫu câu SGK của unit này. Bài được lưu để học tiếp; mở lại không cần tạo lại.</p><button className="learning-button bg-orange-600 text-white disabled:opacity-40" disabled={busy||scanning||!matchingGrade||admin.loading} onClick={()=>void generate(0)}>{busy?'Đang tạo đoạn văn…':'Tạo bài đọc bằng AI'}</button></section>:<>
      <div className="sticky top-2 z-10 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm">
        <button className="learning-button bg-orange-600 text-white text-sm disabled:opacity-40" disabled={!audioAvailable} onClick={playAll}>{isSpeaking?'■ Dừng nghe':'▶ Nghe cả bài'}</button>
        <label className="flex items-center gap-2 text-sm">Tốc độ<select aria-label="Tốc độ đọc" className="min-h-10 rounded-lg border px-2" value={rate} onChange={e=>{stop();setRate(Number(e.target.value));}}>{[0.7,0.85,1,1.2].map(r=><option key={r} value={r}>{r}×</option>)}</select></label>
        {canManage&&<><button className={button} aria-pressed={translation} onClick={()=>setTranslation(!translation)}>{translation?'Ẩn dịch':'Hiện dịch'}</button><button className={button} aria-pressed={columns} onClick={()=>setColumns(!columns)}>{columns?'Một cột':'Hai cột'}</button></>}
        <span className="ml-auto text-xs text-slate-500">{lesson.sentences.length} câu · {newVocabulary.length} từ/cụm từ mới</span>
      </div>
      {audioError&&<p role="alert" className="text-sm text-amber-800">{audioError}</p>}{!audioAvailable&&<p className="text-sm text-slate-500">Chưa có giọng tiếng Anh trên thiết bị. Phần đọc, từ vựng và câu hỏi vẫn dùng được.</p>}
      {canManage&&tab!=='activities'&&<div className="rounded-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 p-5 shadow-sm sm:p-7"><p className="text-sm font-bold text-orange-700 sm:text-base">Dòng đang nghe · {activeLine+1}/{lesson.sentences.length}</p><p className="mt-3 break-words text-2xl font-bold leading-relaxed text-orange-950 sm:text-3xl md:text-4xl" style={{fontFamily:'var(--font-andika), "Andika", sans-serif'}}>{lesson.sentences[activeLine]?.en}</p>{translation&&<p className="mt-3 text-lg font-medium leading-relaxed text-slate-700 sm:text-xl">{lesson.sentences[activeLine]?.vi}</p>}</div>}
      {canManage&&<nav className="flex flex-wrap gap-2" aria-label="Phần bài đọc">{([['passage','Bài đọc'],['sentences','Theo câu'],['vocabulary','Từ vựng & Cụm từ'],['activities','Hoạt động']] as [Tab,string][]).map(([id,label])=><button key={id} aria-pressed={tab===id} className={`${button} ${tab===id?'border-orange-500 bg-orange-50 text-orange-800':''}`} onClick={()=>{stop();setTab(id);}}>{label}</button>)}</nav>}
      <div className={`grid items-start gap-5 ${tab!=='activities'?'lg:grid-cols-[minmax(0,1fr)_300px]':''}`}>
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          {canManage&&tab==='passage'&&<div className={`grid gap-6 ${columns&&translation?'md:grid-cols-2':''}`}><div className="text-lg leading-10">{lesson.sentences.map(s=><span key={s.id}>{highlighted(s.en)}{' '}</span>)}</div>{translation&&<div className="border-t border-slate-100 pt-4 text-base leading-8 text-slate-500 md:border-t-0 md:pt-0">{lesson.sentences.map(s=>s.vi).join(' ')}</div>}</div>}
          {canManage&&tab==='sentences'&&<div className="space-y-3">{lesson.sentences.map((s,i)=><div key={s.id} className={`rounded-xl border p-4 ${activeLine===i?'border-orange-300 bg-orange-50/50':'border-slate-100'}`}><div className="flex items-start gap-3"><button aria-label={`Nghe câu ${i+1}`} className={button} disabled={!audioAvailable} onClick={()=>playLine(i)}>🔊 {i+1}</button><div><p className="text-lg leading-8">{highlighted(s.en)}</p>{translation&&<p className="mt-1 text-sm text-slate-500">{s.vi}</p>}</div></div></div>)}</div>}
          {canManage&&tab==='vocabulary'&&<button className={button} disabled={busy||scanning} onClick={()=>void scanVocabulary()}>{scanning?'AI đang rà soát…':'AI rà soát từ mới trong toàn bộ đoạn văn'}</button>}
          {canManage&&tab==='vocabulary'&&!newVocabulary.length&&<p className="text-sm text-slate-500">{lesson.vocabularyScannedAt?'Đã rà soát toàn bài: chưa tìm thấy từ/cụm từ mới ngoài kho đã học.':'Danh sách AI đã chọn chưa có từ mới ngoài kho đã học. Bấm rà soát để kiểm tra toàn bộ đoạn văn.'}</p>}
          {canManage&&tab==='vocabulary'&&<div className="grid gap-3 sm:grid-cols-2">{newVocabulary.map(v=><div className="rounded-xl bg-slate-50 p-4" key={v.id}><button className="text-left text-lg font-bold text-orange-800" onClick={()=>{stop();speak(v.en,'en-US',rate);}}>{v.en} 🔊</button><p className="text-xs text-slate-500">{v.ipa}</p><p className="mt-2 text-sm">{v.vi}</p><p className="mt-2 text-sm text-slate-500">{lesson.sentences.find(s=>s.id===v.sentenceId)?.en}</p></div>)}</div>}
          {tab==='activities'&&session&&<StoryActivities key={session.id} session={session} save={save} play={playLine} stopAudio={stop} audioAvailable={audioAvailable}/>}
          {canManage&&selectedTerm&&newVocabulary.some(term=>term.id===selectedTerm.id)&&tab!=='activities'&&<aside className="rounded-xl border border-orange-200 bg-orange-50 p-4" aria-live="polite"><div className="flex justify-between"><strong>{selectedTerm.en}</strong><button className="text-sm underline" onClick={()=>setSelectedTerm(null)}>Đóng</button></div><p className="text-xs text-slate-500">{selectedTerm.ipa}</p><p className="mt-2">{selectedTerm.vi}</p><button className={`${button} mt-3`} onClick={()=>{stop();speak(selectedTerm.en,'en-US',rate);}}>Nghe từ</button></aside>}
        </section>
        {canManage&&tab!=='activities'&&<aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold">Từ vựng & Cụm từ</h2><p className="text-xs text-slate-500">Chưa có trong kho từ lớp 1–{grade}.</p><button className={`${button} my-2 w-full`} disabled={busy||scanning} onClick={()=>void scanVocabulary()}>{scanning?'AI đang rà soát…':'AI rà soát toàn bộ đoạn văn'}</button><label className="block"><span className="sr-only">Tìm từ hoặc nghĩa</span><input className="min-h-11 w-full rounded-xl border px-3 text-sm" placeholder="Tìm từ, nghĩa…" value={search} onChange={e=>setSearch(e.target.value)}/></label>{newVocabulary.filter(v=>`${v.en} ${v.vi}`.toLowerCase().includes(search.toLowerCase())).map(v=><button key={v.id} className="block w-full border-b border-slate-100 pb-3 text-left" onClick={()=>setSelectedTerm(v)}><strong className="text-sm text-orange-800">{v.en}</strong><span className="mt-1 block text-xs text-slate-500">{v.vi}</span></button>)}<Link className={`${button} inline-flex`} href={`/learn/${unit.id}`}>Ôn thẻ từ unit</Link></aside>}
      </div>
      {session&&<section className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5"><button className={button} onClick={()=>save({...session,read:true})}>{session.read?'✓ Đã đọc bài':'Con đã đọc xong'}</button><button className={button} disabled={!session.read||!lesson.questions.every(q=>session.answers[`quiz:${q.id}`])} onClick={()=>save({...session,completed:true})}>{session.completed?'✓ Đã hoàn thành':'Hoàn thành bài đọc'}</button><span className="text-xs text-slate-500">Hoàn thành sau khi đọc và trả lời các câu hỏi hiểu bài. Tiến độ lưu theo hồ sơ.</span>{canManage&&<button className={`${button} ml-auto`} disabled={busy||scanning||!matchingGrade} onClick={()=>void generate((variant+1)%5)}>{busy?'Đang tạo…':'Tạo đoạn văn khác'}</button>}</section>}
    </>}
    {canManage&&<details className="rounded-2xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-bold">Mẫu câu của Unit {source.number}</summary><ul className="mt-3 space-y-2 text-sm text-slate-600">{source.patterns.map(p=><li key={p}>{p}</li>)}</ul><p className="mt-4 text-xs text-slate-500">Nguồn: file tổng hợp SGK lớp 1–5 được cung cấp. {lesson?.origin==='manual'?'Bài tự viết do bạn cung cấp, chưa được đối chiếu với mẫu câu SGK.':'Bài đọc do AI tạo mới, chưa được giáo viên duyệt.'}</p></details>}
  </div></main>;
}
