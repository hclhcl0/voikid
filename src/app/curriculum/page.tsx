'use client';
import Link from 'next/link';
import {useState} from 'react';
import {curriculumForCategories} from '@/lib/learning/curriculum';
import {storySource} from '@/lib/stories/source';
import {BAND_LABELS,readingBand,readingEvidence,validStorySession} from '@/lib/stories/learning';
import {useVocabularyCatalog} from '@/hooks/useVocabularyCatalog';
import {useProfileContext} from '@/context/ProfileContext';
import {useStoryAccess} from '@/hooks/useStoryAccess';
export default function CurriculumPage() {
  const ctx=useProfileContext();
  const access=useStoryAccess();
  if(!ctx.hydrated||access.loading) return <p role="status" className="p-8">Đang mở các bài đọc…</p>;
  if(!ctx.activeProfileId) return <main className="mx-auto max-w-lg space-y-4 p-8"><Link href="/" className="text-sm text-slate-500">← VocaKids</Link><h1 className="text-2xl font-bold">Chọn học sinh để mở bài học</h1><p className="text-slate-600">Thêm hồ sơ và chọn lớp tại Góc phụ huynh.</p><Link href="/parent" className="learning-button bg-orange-600 text-white">Thêm học sinh</Link></main>;
  return <StoryBrowser key={ctx.activeProfileId} canManage={access.canManage}/>;
}
function StoryBrowser({canManage}:{canManage:boolean}) {
  const ctx=useProfileContext(),{categories}=useVocabularyCatalog();const [search,setSearch]=useState('');
  const grade=ctx.activeProfile.gradeId==='maugiao'?1:Number(ctx.activeProfile.gradeId.replace('lop',''));
  const units=curriculumForCategories(categories).filter(u=>u.grade===grade&&storySource(u)).sort((a,b)=>a.order-b.order);
  const sessions=Object.values(ctx.progress.storySessions??{}).filter(s=>validStorySession(s,ctx.activeProfileId)&&units.some(u=>u.id===s.unitId)).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
  const resume=sessions.find(s=>!s.completed),featured=units.find(u=>u.id===resume?.unitId)??units[0];
  const filtered=units.filter(u=>`${u.title} ${storySource(u)?.topic} unit ${u.order}`.toLowerCase().includes(search.toLowerCase()));
  return <main className="learning-shell min-h-screen bg-slate-50 px-4 py-6 pb-20"><div className="mx-auto max-w-5xl space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-3"><Link href="/" className="learning-button border bg-white">← VocaKids</Link><button className="learning-button border bg-white" onClick={ctx.openProfileModal}>{ctx.activeProfile.avatar} {ctx.activeProfile.name} · Lớp {grade}</button><Link href="/learning-report" className="learning-button bg-orange-50 text-orange-800">Tiến độ học</Link></header>
    <section><p className="text-sm font-bold text-orange-700">Học theo đoạn văn · Lớp {grade}</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Mỗi unit, một câu chuyện nhỏ</h1><p className="mt-3 text-slate-600">Đọc, nghe và luyện tập trong cùng một chủ đề. AI viết đoạn văn theo mẫu câu SGK và kết quả tự làm của con.</p></section>
    {featured&&<section className="space-y-3 rounded-2xl border border-orange-200 bg-orange-50 p-6"><p className="text-sm font-bold text-orange-700">{resume?'Tiếp tục bài đang đọc':'Bắt đầu với chủ đề đầu tiên'}</p><h2 className="text-2xl font-bold">{featured.emoji} Unit {featured.order} · {storySource(featured)?.topic}</h2><p className="text-sm text-slate-600">{resume?.lesson.title??'Bài đọc, từng câu, từ vựng và hoạt động luyện tập.'}</p><Link className="learning-button inline-flex bg-orange-600 text-white" href={`/unit/${featured.id}`}>{resume?'Đọc tiếp →':'Mở bài đọc →'}</Link></section>}
    {canManage&&sessions.length>0&&<details className="rounded-2xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-bold">Đoạn văn đã lưu ({sessions.length})</summary><div className="mt-4 grid gap-3 sm:grid-cols-2">{sessions.map(session=><Link key={session.id} href={`/unit/${session.unitId}?story=${encodeURIComponent(session.id)}`} className="rounded-xl border border-slate-100 p-4 hover:bg-orange-50"><p className="font-bold">{session.lesson.title}</p><p className="mt-1 text-sm text-slate-500">Unit {storySource(units.find(u=>u.id===session.unitId)!)?.number} · {session.lesson.topic} · {session.lesson.origin==='manual'?'Tự viết':'AI tạo'} · {session.completed?'Đã hoàn thành':'Đang học'}</p></Link>)}</div></details>}
    <label className="block"><span className="sr-only">Tìm unit hoặc chủ đề</span><input className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4" placeholder="Tìm unit hoặc chủ đề…" value={search} onChange={e=>setSearch(e.target.value)}/></label>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label={`Bài đọc lớp ${grade}`}>{filtered.map(unit=>{
      const source=storySource(unit)!;const latest=sessions.find(s=>s.unitId===unit.id);const band=latest?.lesson.band??readingBand(readingEvidence(ctx.progress,ctx.activeProfileId,unit.id));
      return <article key={unit.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5"><div className="flex justify-between gap-2"><span className="text-3xl">{unit.emoji}</span><span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">Unit {source.number}</span></div><h2 className="text-lg font-bold">{source.topic}</h2><p className="text-sm text-slate-500">{unit.title}</p><p className="text-sm text-slate-600">{latest?latest.lesson.title:source.patterns[0]}</p><div className="mt-auto flex flex-wrap gap-2 text-xs text-slate-500"><span>{BAND_LABELS[band]}</span><span>· {latest?.completed?'Đã hoàn thành':latest?'Đang đọc':'Chưa bắt đầu'}</span></div><Link className="learning-button bg-orange-50 text-sm text-orange-800" href={`/unit/${unit.id}`}>{canManage?(latest?'Mở đoạn văn':'Tạo & học đoạn văn'):'Mở bài luyện'} →</Link></article>;
    })}</section>
    {!filtered.length&&<p className="rounded-2xl border bg-white p-6 text-slate-500">Chưa có unit phù hợp. Thử từ khóa khác hoặc kiểm tra học liệu của lớp này.</p>}
    <p className="text-xs text-slate-500">Mẫu câu lấy từ file tổng hợp SGK lớp 1–5 đã cung cấp. Độ dài và độ hỗ trợ thay đổi theo kết quả học; khi chưa đủ dữ liệu, bài bắt đầu ở mức có hỗ trợ.</p>
  </div></main>;
}
