'use client';
import {useEffect,useState} from 'react';
import type {StoryLesson} from '@/lib/stories/types';
import type {SharedStory} from '@/lib/stories/shared';
import {BAND_LABELS} from '@/lib/stories/learning';
const button='ui-button ui-button-secondary text-sm disabled:opacity-40';
export function SharedStoryLibrary({unitId,admin,lesson,revision,onOpen}:{unitId:string;admin:boolean;lesson:StoryLesson|null;revision:number;onOpen:(lesson:StoryLesson)=>void}){
  const [stories,setStories]=useState<SharedStory[]>([]),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[reload,setReload]=useState(0);
  useEffect(()=>{const controller=new AbortController();fetch(`/api/story/library?unitId=${encodeURIComponent(unitId)}`,{signal:controller.signal,cache:'no-store'}).then(async response=>{const result=await response.json();if(!response.ok)throw new Error(result.message);if(!controller.signal.aborted){setStories(result.stories);setLoading(false);}}).catch(error=>{if(!controller.signal.aborted){setMessage(error instanceof Error?error.message:'Chưa tải được bài đọc chung.');setLoading(false);}});return()=>controller.abort();},[unitId,revision,reload]);
  async function change(method:'POST'|'DELETE',id?:string){
    if(busy)return;setBusy(true);setMessage('');
    try{const response=await fetch('/api/story/library',{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(method==='POST'?{lesson}:{unitId,id})});const result=await response.json();if(!response.ok)throw new Error(result.message);setReload(value=>value+1);setMessage(method==='POST'?'Đã lưu bài vào thư viện chung cho phụ huynh.':'Đã gỡ khỏi thư viện chung. Bài và tiến độ đã lưu của từng bé vẫn được giữ.');}
    catch(error){setMessage(error instanceof Error?error.message:'Chưa lưu được thư viện.');}finally{setBusy(false);}
  }
  return <section aria-label="Bài đọc chung của admin" className="space-y-3 rounded-2xl border border-orange-200 bg-orange-50/50 p-4 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold text-slate-900">Bài đọc chung của admin</h2><p className="mt-1 text-sm text-slate-600">Chọn bài đã chuẩn bị để học ngay. Tiến độ được lưu riêng cho bé đang chọn.</p></div>{admin&&lesson&&<button className={button} disabled={busy} onClick={()=>void change('POST')}>Chia sẻ bài đang mở</button>}</div>
    {loading?<p role="status" className="text-sm text-slate-500">Đang tải bài đọc chung…</p>:!stories.length?<p className="text-sm text-slate-500">Unit này chưa có bài đọc chung. {admin?'Tạo bài AI, dán bài tự viết hoặc chia sẻ bài cũ đang mở.':'Phụ huynh vẫn có thể tạo bài riêng cho con.'}</p>:<div className="grid gap-3 sm:grid-cols-2">{stories.map(entry=><article key={entry.id} className="space-y-3 rounded-xl border border-orange-100 bg-white p-4"><div><h3 className="font-bold text-slate-900">{entry.lesson.title}</h3><p className="mt-1 text-xs text-slate-500">{BAND_LABELS[entry.lesson.band]} · {entry.lesson.sentences.length} câu · {entry.lesson.vocabulary.length} từ/cụm từ</p></div><div className="flex flex-wrap gap-2"><button className="ui-button ui-button-primary text-sm" disabled={busy} onClick={()=>onOpen(entry.lesson)}>Học bài này</button>{admin&&<button className={button} disabled={busy} onClick={()=>{if(window.confirm('Gỡ bài này khỏi thư viện dùng chung?'))void change('DELETE',entry.id);}}>Gỡ bài chung</button>}</div></article>)}</div>}
    {message&&<p role="status" className="text-sm text-orange-900">{message}</p>}
    <button className={button} disabled={busy} onClick={()=>{setMessage('');setReload(value=>value+1);}}>Tải lại bài chung</button>
  </section>;
}
