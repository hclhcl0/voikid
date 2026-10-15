'use client';
import { AppPageHeader } from '@/components/ui/AppPageHeader';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { useProfileContext } from '@/context/ProfileContext';
import { useTTS } from '@/hooks/useTTS';
import type { Category } from '@/types';
import { buildWordSearch, eligibleSearchWords, matchesSearchPath, searchLine, wordSearchLevels, wordSearchReward, type SearchCell } from '@/lib/wordsearch';

const key = (c: SearchCell) => `${c.row}:${c.col}`;
const button = 'rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-bold disabled:opacity-40';
export default function WordSearchPage() {
  const {catId} = useParams<{catId:string}>();
  const {categories, settings} = useVocabularyCatalog();
  const {categories:custom, hydrated} = useCustomCategories();
  const profile = useProfileContext();
  const category = [...custom,...categories].find(c => c.id === catId);
  if (!hydrated || !profile.hydrated) return <main className="p-8">Đang nạp trò chơi…</main>;
  if (!settings.showGames || !category || !eligibleSearchWords(category.words).length) return <main className="p-8">{!settings.showGames ? 'Trò chơi đang tạm nghỉ.' : !category ? 'Không tìm thấy chủ đề.' : 'Chủ đề chưa có từ phù hợp (2–20 chữ cái).'} <Link href="/">Về trang chủ</Link></main>;
  if (!profile.activeProfile.id) return <main className="p-8"><button onClick={profile.openProfileModal}>Chọn hồ sơ để chơi và nhận thưởng</button></main>;
  return <Game key={`${profile.activeProfile.id}:${category.id}`} category={category}/>;
}

function Game({category}:{category:Category}) {
  const {progress,recordUnitTest} = useProfileContext();
  const {speak,cancel,error} = useTTS();
  const [level,setLevel] = useState(0);
  const [board,setBoard] = useState<ReturnType<typeof buildWordSearch>|null>(null);
  const [found,setFound] = useState<string[]>([]);
  const [selection,setSelection] = useState<SearchCell[]>([]);
  const [hint,setHint] = useState<string|null>(null);
  const [hints,setHints] = useState(0);
  const [elapsed,setElapsed] = useState(0);
  const [message,setMessage] = useState('');
  const start = useRef<SearchCell|null>(null);
  const drag = useRef<{id:number;cell:SearchCell;moved:boolean}|null>(null);
  const saved = useRef(false), matchId = useRef('');
  const complete = !!board?.placed.length && found.length === board.placed.length;
  const reward = wordSearchReward(level,hints,found.length,board?.placed.length??0);
  useEffect(() => {
    if (!board || complete) return;
    const began = performance.now();
    const timer = setInterval(() => setElapsed(Math.floor((performance.now()-began)/1000)),1000);
    return () => clearInterval(timer);
  },[board,complete]);
  function newGame(selected=level) {
    cancel(); matchId.current=crypto.randomUUID(); saved.current=false;
    setLevel(selected); setBoard(buildWordSearch(category.words,selected,matchId.current));
    setFound([]);setSelection([]);setHint(null);setHints(0);setElapsed(0);setMessage('');start.current=null;drag.current=null;
  }
  function finish(cells:SearchCell[]) {
    if (!board || complete || saved.current) return;
    const target=board.placed.find(p=>!found.includes(p.word.id)&&matchesSearchPath(cells,p.cells));
    start.current=null;setSelection([]);
    if (!target) {setMessage('Chưa đúng, con thử đường chữ khác nhé.');return;}
    const next=[...found,target.word.id];setFound(next);setHint(null);setMessage(`✓ ${target.word.en} — ${target.word.vi}`);speak(target.word.en);
    if (next.length===board.placed.length) {
      saved.current=true;
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) confetti({particleCount:90,spread:80,origin:{y:.6}});
      recordUnitTest({unitId:`wordsearch:${category.id}`,score:100,grade:'excellent',attempts:1,fastAnswers:0,streak:next.length,correctAnswers:next.length,questionCount:next.length,gameReward:{id:matchId.current,...wordSearchReward(level,hints,next.length,board.placed.length)}});
    }
  }
  function pick(cell:SearchCell) {
    if (complete) return;
    if (start.current) finish(searchLine(start.current,cell));
    else {start.current=cell;setSelection([cell]);setMessage('Chọn ô cuối của từ.');}
  }
  function showHint() {
    const target=board?.placed.find(p=>!found.includes(p.word.id)&&p.word.id!==hint);
    if (!target) return;
    setHint(target.word.id);setHints(hints+1);setMessage(`💡 ${target.word.en}: ô đầu đang sáng trên bảng.`);
  }
  return <div className="min-h-screen bg-emerald-50 pb-20 text-slate-800">
    <AppPageHeader title="Tìm từ" description="Khám phá từ vựng trong bảng chữ cái." backHref="/games" backLabel="Trò chơi" inset/>
    <main className="mx-auto max-w-3xl space-y-3 px-3 py-4">
      <div className="flex flex-wrap justify-between gap-2"><h2 className="font-bold">{category.emoji} {category.name_vi}</h2>{board&&<span className="text-sm font-bold">{found.length}/{board.placed.length} từ · {Math.floor(elapsed/60)}:{String(elapsed%60).padStart(2,'0')}</span>}</div>
      {!board?<section className="rounded-2xl bg-white p-5"><h2 className="mb-3 font-bold">Chọn độ khó</h2><div className="grid gap-3 sm:grid-cols-3">{wordSearchLevels.map((r,i)=><button key={r.name} onClick={()=>newGame(i)} className="rounded-xl border-2 border-emerald-100 p-4 text-left hover:border-emerald-400"><strong>{r.name}</strong><p className="mt-1 text-sm">{r.size}×{r.size} · tối đa {r.count} từ</p><p className="text-xs text-slate-500">{r.description}</p><span className="mt-2 block text-xs text-amber-700">⭐ {4+i} sao nếu không gợi ý</span></button>)}</div><p className="mt-4 text-xs text-slate-500">Bấm ô đầu rồi ô cuối, hoặc kéo để chọn. Bảng tự tăng khi có từ dài.</p></section>:<>
        <div className="flex justify-between text-xs text-slate-500"><span>{wordSearchLevels[level].name} · {board.size}×{board.size}</span><span>Gợi ý: {hints}</span></div>
        <div className="flex flex-wrap gap-2">{board.placed.map(p=><button key={p.word.id} onClick={()=>speak(p.word.en)} className={`rounded-full border px-3 py-1.5 text-xs font-bold ${found.includes(p.word.id)?'border-emerald-300 bg-emerald-200':'border-slate-200 bg-white'}`}>🔊 {p.word.emoji} {p.word.en.toUpperCase()} {found.includes(p.word.id)&&'✓'}</button>)}</div>
        <div className="overflow-x-auto rounded-2xl bg-white p-2"><div role="group" aria-label="Bảng tìm từ" className="grid touch-none select-none gap-0.5" style={{gridTemplateColumns:`repeat(${board.size},minmax(0,1fr))`,minWidth:board.size*28}}
          onPointerDown={e=>{
            if(complete||e.button!==0)return;
            const el=(e.target as HTMLElement).closest<HTMLElement>('[data-cell]');if(!el)return;
            const [row,col]=el.dataset.cell!.split(':').map(Number);const cell={row,col};
            drag.current={id:e.pointerId,cell,moved:false};e.currentTarget.setPointerCapture(e.pointerId);setSelection(searchLine(start.current??cell,cell));
          }}
          onPointerMove={e=>{
            const current=drag.current;if(!current||current.id!==e.pointerId)return;
            const el=document.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>('[data-cell]');if(!el||!e.currentTarget.contains(el))return;
            const [row,col]=el.dataset.cell!.split(':').map(Number);const cell={row,col};
            if(key(cell)!==key(current.cell))current.moved=true;
            setSelection(searchLine(start.current??current.cell,cell));
          }}
          onPointerUp={e=>{
            const current=drag.current;if(!current||current.id!==e.pointerId)return;drag.current=null;
            const el=document.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>('[data-cell]');if(!el||!e.currentTarget.contains(el)){start.current=null;setSelection([]);return;}
            const [row,col]=el.dataset.cell!.split(':').map(Number);const cell={row,col};
            if(current.moved)finish(searchLine(start.current??current.cell,cell));else pick(cell);
          }} onPointerCancel={()=>{drag.current=null;start.current=null;setSelection([]);}}>
          {board.grid.flatMap((row,r)=>row.map((letter,c)=>{
            const cell={row:r,col:c};const selected=selection.some(p=>key(p)===key(cell));
            const done=board.placed.some(p=>found.includes(p.word.id)&&p.cells.some(p=>key(p)===key(cell)));
            const highlighted=board.placed.some(p=>p.word.id===hint&&key(p.cells[0])===key(cell));
            return <button key={key(cell)} data-cell={key(cell)} disabled={complete} aria-label={`Hàng ${r+1}, cột ${c+1}: ${letter}`} aria-pressed={selected} onClick={e=>{if(e.detail===0)pick(cell);}} className={`aspect-square rounded-md text-sm font-extrabold focus-visible:outline-2 focus-visible:outline-violet-600 ${selected?'bg-violet-500 text-white':highlighted?'bg-amber-300 ring-2 ring-amber-500':done?'bg-emerald-200':'hover:bg-emerald-50'}`}>{letter}</button>;
          }))}
        </div></div>
        <p role="status" className="min-h-6 text-center text-sm font-semibold text-emerald-700">{message}</p>
        {error&&<p role="alert" className="text-xs text-rose-600">{error}</p>}
        {!complete&&<div className="flex flex-wrap justify-center gap-2"><button className={button} onClick={showHint} disabled={!board.placed.some(p=>!found.includes(p.word.id)&&p.word.id!==hint)}>💡 Gợi ý ô đầu</button><button className={button} onClick={()=>{start.current=null;setSelection([]);}}>Bỏ chọn</button><button className={button} onClick={()=>newGame()}>Xáo bảng mới</button><button className={button} onClick={()=>{cancel();setBoard(null);}}>Đổi độ khó</button></div>}
        {complete&&<section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center"><h2 className="text-xl font-extrabold">🏆 Đã tìm đủ {found.length} từ!</h2><p className="my-2 font-bold text-amber-700">+{reward.stars} sao · +{reward.points} điểm</p><p className="text-xs text-slate-500">Hoàn thành +{2+level} sao{hints===0?' · Không gợi ý +2 sao':''} · Đã lưu vào hồ sơ</p><div className="my-4 flex flex-wrap justify-center gap-2">{board.placed.map(p=><button key={p.word.id} className={button} onClick={()=>speak(p.word.en)}>🔊 {p.word.en} — {p.word.vi}</button>)}</div><div className="flex flex-wrap justify-center gap-2"><button className={button} onClick={()=>newGame()}>Chơi lại</button><button className={button} onClick={()=>{cancel();setBoard(null);}}>Đổi độ khó</button><Link className={button} href={`/learn/${category.id}`}>Ôn từ</Link></div></section>}
      </>}
    </main>
  </div>;
}
