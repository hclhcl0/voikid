'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ChildBadge} from '@/components/ChildBadge';
import {ArrowLeft,BookOpen,House,Mic,Speech} from 'lucide-react';

export function WordLearningNavigation({categoryId,emoji,index,total,mode}:{categoryId:string;emoji:string;index:number;total:number;mode:'learn'|'speak'}){
  const router=useRouter();
  return <>
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center gap-2">
        <button type="button" onClick={()=>router.back()} aria-label="Quay lại" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"><ArrowLeft aria-hidden="true" className="h-5 w-5"/></button>
        <Link href="/" aria-label="Về trang chủ" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-orange-600 hover:bg-orange-50"><House aria-hidden="true" className="h-5 w-5"/></Link>
        <div className="min-w-10 flex-1">
          <div role="progressbar" aria-label="Tiến độ các từ" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index+1} className="h-2 overflow-hidden rounded-full bg-violet-100">
            <div className="h-full rounded-full bg-violet-600 transition-all" style={{width:`${((index+1)/total)*100}%`}}/>
          </div>
          <p className="mt-1 whitespace-nowrap text-right text-xs font-semibold text-slate-500">{index+1} / {total}</p>
        </div>
        <div className="min-w-0 max-w-[40%] [&_button]:max-w-full [&_a]:max-w-full"><ChildBadge variant="compact"/></div>
        <span aria-hidden="true" className="hidden text-2xl sm:inline">{emoji}</span>
      </div>
    </header>
    <nav aria-label="Chế độ học từ" className="mx-auto flex max-w-2xl gap-2 px-4 pt-3">
      {([{mode:'learn',label:'Học từ',Icon:BookOpen},{mode:'speak',label:'Luyện nói',Icon:Mic}] as const).map(tab=><Link key={tab.mode} href={`/${tab.mode}/${categoryId}`} aria-current={mode===tab.mode?'page':undefined} className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-2 text-xs font-bold transition-colors sm:px-3 sm:text-sm ${mode===tab.mode?'border-violet-600 bg-violet-600 text-white':'border-slate-200 bg-white text-slate-600 hover:bg-violet-50'}`}><tab.Icon aria-hidden="true" className="h-4 w-4"/>{tab.label}</Link>)}
      <Link href="/ipa" className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 hover:bg-violet-50 sm:px-3 sm:text-sm" title="Bảng 44 âm IPA"><Speech aria-hidden="true" className="h-4 w-4 text-violet-500"/>IPA</Link>
    </nav>
  </>;
}
