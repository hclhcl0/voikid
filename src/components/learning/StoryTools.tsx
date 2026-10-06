'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useAuth} from '@/context/AuthContext';
import {useBackendSession} from '@/hooks/useBackendSession';
import {useCustomCategories} from '@/hooks/useCustomCategories';
import {manualStory,splitPassage} from '@/lib/stories/library';
import type {StoryLesson,StorySession,StorySource} from '@/lib/stories/types';
import {useStoryAccess} from '@/hooks/useStoryAccess';
const button='learning-button border border-slate-200 bg-white text-sm disabled:opacity-40';
const field='mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-normal';
type Props={session:StorySession|null;sessions:StorySession[];unitId:string;source:StorySource;terms:StoryLesson['vocabulary'];onImported:(terms:StoryLesson['vocabulary'])=>void;onOpen:(session:StorySession)=>void;onDelete:(id:string)=>void;onSave:()=>void;onCreate:(lesson:StoryLesson)=>void};

export function StoryTools({session,sessions,unitId,source,terms,onImported,onOpen,onDelete,onSave,onCreate}:Props) {
  const access=useStoryAccess();
  const {account}=useAuth();const admin=useBackendSession();const {importStoryWords}=useCustomCategories();
  const [panel,setPanel]=useState<'saved'|'paste'|'words'|null>(null),[pendingDelete,setPendingDelete]=useState('');
  const [title,setTitle]=useState(source.topic),[text,setText]=useState(''),[translation,setTranslation]=useState(''),[vocabulary,setVocabulary]=useState('');
  const [selected,setSelected]=useState<string[]>(session?.lesson.vocabulary.map(v=>v.id)??[]),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
  const selectedIds=selected.filter(id=>terms.some(term=>term.id===id));
  const [wordCategory,setWordCategory]=useState('');
  const canAddWords=admin.authenticated||account?.role!=='student';
  function toggle(next:typeof panel) {setPanel(panel===next?null:next);setMessage('');setPendingDelete('');}
  function paste() {
    try {onCreate(manualStory({title,text,translation,vocabulary},unitId,source,`story_manual_${crypto.randomUUID()}`));}
    catch(error) {setMessage(error instanceof Error?error.message:'Chưa lưu được đoạn văn.');}
  }
  async function addWords() {
    if(!session) return;setBusy(true);setMessage('');
    try {const result=await importStoryWords(session.lesson,selectedIds);onImported(terms.filter(term=>selectedIds.includes(term.id)));setWordCategory(result.categoryId);setMessage(result.added?`Đã thêm ${result.added} từ vào ${admin.authenticated?'kho từ của unit trong admin':account?.role==='parent'?'kho từ gia đình':'kho từ trên thiết bị'}.`:'Các từ đã có trong chủ đề này; không thêm trùng.');}
    catch(error) {setMessage(error instanceof Error?error.message:'Chưa thêm được từ.');}
    finally {setBusy(false);}
  }
  if(access.loading||!access.canManage) return null;
  return <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
    <div className="flex flex-wrap gap-2">
      {session&&<button className={button} onClick={onSave}>Lưu đoạn văn</button>}
      <button className={button} aria-expanded={panel==='saved'} onClick={()=>toggle('saved')}>Đoạn văn đã lưu ({sessions.length})</button>
      <button className={button} aria-expanded={panel==='paste'} onClick={()=>toggle('paste')}>Dán đoạn văn tự viết</button>
      {session&&canAddWords&&<button className={button} disabled={admin.loading||!terms.length} aria-expanded={panel==='words'} onClick={()=>toggle('words')}>Thêm từ vào kho từ vựng</button>}
    </div>
    {panel==='saved'&&<div className="space-y-3">
      <h2 className="font-bold">Đoạn văn của hồ sơ này · Unit {source.number}</h2>
      {!sessions.length&&<p className="text-sm text-slate-500">Chưa lưu đoạn văn nào. Tạo bằng AI hoặc dán bài tự viết.</p>}
      {sessions.map(item=><article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
        <div><p className="font-bold">{item.lesson.title}{session?.id===item.id?' · Đang mở':''}</p><p className="mt-1 text-xs text-slate-500">{item.lesson.origin==='manual'?'Tự viết':'AI tạo'} · {item.lesson.sentences.length} câu · {new Date(item.savedAt??item.lesson.generatedAt).toLocaleDateString('vi-VN')} · {item.completed?'Đã hoàn thành':'Đang học'}</p></div>
        <div className="flex gap-2"><button className={button} onClick={()=>onOpen(item)}>Mở bài</button><button className={`${button} text-rose-700`} onClick={()=>setPendingDelete(item.id)}>Xóa</button></div>
        {pendingDelete===item.id&&<div className="w-full rounded-xl bg-rose-50 p-3 text-sm"><p>Xóa “{item.lesson.title}” và tiến độ bài này khỏi hồ sơ đang chọn?</p><div className="mt-2 flex gap-2"><button className="learning-button bg-rose-600 text-white text-sm" onClick={()=>{setPendingDelete('');onDelete(item.id);}}>Xác nhận xóa</button><button className={button} onClick={()=>setPendingDelete('')}>Giữ lại</button></div></div>}
      </article>)}
    </div>}
    {panel==='paste'&&<form className="space-y-4" onSubmit={e=>{e.preventDefault();paste();}}>
      <h2 className="font-bold">Thêm bài đọc tự viết</h2>
      <label className="block text-sm font-bold">Tiêu đề<input className={field} required maxLength={100} value={title} onChange={e=>setTitle(e.target.value)}/></label>
      <label className="block text-sm font-bold">Đoạn văn tiếng Anh<textarea className={field} rows={5} required maxLength={6000} value={text} onChange={e=>setText(e.target.value)} placeholder="Dán đoạn văn tiếng Anh của bạn tại đây…"/></label>
      <p className="text-xs text-slate-500">{text.trim()?splitPassage(text).length:0} câu · Giữ nội dung bạn viết. Có nghe bài, nghe–viết, nghe–điền từ và đọc theo; chưa có câu hỏi hiểu bài tự động.</p>
      {text.trim()&&<details className="rounded-xl bg-slate-50 p-3 text-sm"><summary className="cursor-pointer font-bold">Xem thứ tự các câu để nhập bản dịch</summary><ol className="mt-2 list-decimal space-y-2 pl-5">{splitPassage(text).map((sentence,index)=><li key={index}>{sentence}</li>)}</ol></details>}
      <label className="block text-sm font-bold">Bản dịch tiếng Việt (không bắt buộc)<textarea className={field} rows={3} maxLength={12000} value={translation} onChange={e=>setTranslation(e.target.value)} placeholder="Mỗi dòng dịch ứng với một câu tiếng Anh, theo đúng thứ tự."/></label>
      <label className="block text-sm font-bold">Từ vựng trong đoạn (không bắt buộc)<textarea className={field} rows={3} maxLength={8000} value={vocabulary} onChange={e=>setVocabulary(e.target.value)} placeholder={'friend | người bạn\nhappy | vui vẻ'}/></label>
      <button className="learning-button bg-orange-600 text-white" type="submit">Lưu & mở đoạn văn</button>
    </form>}
    {panel==='words'&&session&&<div className="space-y-3">
      <h2 className="font-bold">Chọn từ để thêm · Lớp {session.lesson.grade} · {session.lesson.topic}</h2>
      <p className="text-sm text-slate-500">Lưu nghĩa, phiên âm và câu ví dụ của bài đọc. Bỏ qua từ đã có trong cùng chủ đề.</p>
      <div className="grid gap-2 sm:grid-cols-2">{terms.map(term=><label key={term.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm"><input type="checkbox" checked={selected.includes(term.id)} onChange={e=>setSelected(e.target.checked?[...selected,term.id]:selected.filter(id=>id!==term.id))}/><span><strong>{term.en}</strong> · {term.vi}</span></label>)}</div>
      <button className="learning-button bg-orange-600 text-white disabled:opacity-40" disabled={busy||!selectedIds.length} onClick={()=>void addWords()}>{busy?'Đang lưu từ…':`Thêm ${selectedIds.length} từ đã chọn`}</button>
      {wordCategory&&<Link className={`${button} ml-2 inline-flex`} href={`/learn/${wordCategory}`}>Luyện từ trong kho →</Link>}
    </div>}
    {message&&<p role="status" className="rounded-xl bg-orange-50 p-3 text-sm text-orange-900">{message}</p>}
  </section>;
}
