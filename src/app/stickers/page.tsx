'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChildBadge } from '@/components/ChildBadge';
import { StickerArtwork } from '@/components/StickerArtwork';
import { StickerPreview } from '@/components/StickerPreview';
import { useProfileContext } from '@/context/ProfileContext';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { STICKER_COLLECTIONS, STICKER_MILESTONES, GRADE_REWARD_EDITIONS, gradeRewardEdition, stickerMilestonesForGrade, mergeStickers, milestoneProgress, stickerStats, stickerDisplayName, type StickerCollection, type StickerMilestone, type StickerStats } from '@/lib/stickers';
import type { Sticker } from '@/types';
import styles from './stickers.module.css';

const COLLECTION_STYLE:Record<StickerCollection,string> = {
  pets:'from-rose-50 to-orange-50 border-rose-100',
  magic:'from-violet-50 to-pink-50 border-violet-100',
  explorers:'from-sky-50 to-cyan-50 border-sky-100',
  stars:'from-amber-50 to-yellow-50 border-amber-100',
  ocean:'from-sky-50 to-blue-50 border-sky-100',
  jungle:'from-emerald-50 to-lime-50 border-emerald-100',
  garden:'from-pink-50 to-green-50 border-pink-100',
  treats:'from-rose-50 to-violet-50 border-rose-100',
  vehicles:'from-blue-50 to-indigo-50 border-blue-100',
  music:'from-purple-50 to-fuchsia-50 border-purple-100',
};
type AlbumFilter = 'all'|'earned'|'edition'|StickerCollection;
type AlbumSticker = StickerMilestone | Sticker;
function isMilestone(sticker:AlbumSticker):sticker is StickerMilestone {return 'metric' in sticker;}
function dateLabel(date:string) {return new Date(date).toLocaleDateString('vi-VN');}
function Arrow({className = ''}:{className?:string}) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>;
}
function ProgressBar({value,total,label}:{value:number;total:number;label:string}) {
  return <div role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={total} className="h-1.5 overflow-hidden rounded-full bg-slate-200/70"><div className="h-full rounded-full bg-amber-400 transition-[width] motion-reduce:transition-none" style={{width:`${Math.min(100,value / total * 100)}%`}} /></div>;
}
function Sparkles() {
  return <span aria-hidden="true" className={styles.sparkles}>{[0,1,2,3].map(index => <svg key={index} viewBox="0 0 24 24" className={styles.sparkle}><path fill="currentColor" d="M12 1c1.2 7 4 9.8 11 11-7 1.2-9.8 4-11 11C10.8 16 8 13.2 1 12c7-1.2 9.8-4 11-11Z" /></svg>)}</span>;
}

function EditionBadge({sticker}:{sticker:AlbumSticker}) {
  const edition = sticker.id.startsWith('edition_') ? gradeRewardEdition(sticker.gradeId) : undefined;
  return edition ? <span data-edition={edition.level} className={`${styles.editionBadge} mt-2 inline-block rounded-full px-2 py-1 text-[11px] font-bold`}>{edition.label} · {edition.name}</span> : null;
}

function StickerCard({sticker,earned,stats,recent,onClick,index = 0,animated = false}:{sticker:AlbumSticker;earned?:Sticker;stats:StickerStats;recent:boolean;onClick:()=>void;index?:number;animated?:boolean}) {
  const collection = isMilestone(sticker) ? sticker.setId : null;
  const progress = isMilestone(sticker) ? milestoneProgress(sticker,stats) : 0;
  const name = stickerDisplayName(sticker,!!earned);
  const edition = sticker.id.startsWith('edition_') ? gradeRewardEdition(sticker.gradeId) : undefined;
  return <button data-edition={edition?.level} onClick={onClick} aria-label={`${name}. ${earned ? 'Đã nhận' : sticker.condition}`} style={{animationDelay:`${Math.min(index,8) * 40}ms`}} className={`${styles.card} ${edition ? styles.editionCard : ''} group relative flex min-w-0 flex-col items-center rounded-3xl border p-3 text-center transition duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 motion-reduce:transform-none ${earned ? `${styles.earnedCard} border-amber-300 bg-white shadow-sm` : 'border-slate-200 bg-white'} ${recent ? styles.newSticker : ''}`}>
    <span className={`absolute right-2.5 top-2.5 z-10 rounded-full px-2 py-0.5 text-[11px] font-semibold ${earned ? 'bg-amber-100 text-amber-800' : 'bg-violet-100 text-violet-700'}`}>{recent ? 'Mới' : earned ? '✓' : 'Bí mật'}</span>
    <div className={`${styles.illustration} ${earned ? styles.illuminated : ''} ${earned && animated ? styles.animatedIllustration : ''} mt-3 flex aspect-square w-full max-w-36 items-center justify-center rounded-2xl border bg-gradient-to-br ${collection ? COLLECTION_STYLE[collection] : 'from-amber-50 to-orange-50 border-amber-100'}`}>
      {earned && <span aria-hidden="true" className={styles.halo} />}
      <span className={`relative z-10 ${earned && animated ? styles.stickerFloat : ''}`}><StickerPreview emoji={sticker.emoji} revealed={!!earned} size={112} className={`h-20 w-20 sm:h-28 sm:w-28 ${earned ? 'group-hover:rotate-3 motion-reduce:transform-none transition-transform' : ''}`} /></span>
      {earned && animated && <Sparkles />}
    </div>
    <span className={`mt-3 min-h-10 text-sm font-bold leading-5 ${earned ? 'text-slate-800' : 'text-violet-800'}`}>{name}</span>
    <EditionBadge sticker={earned ?? sticker} />
    {earned ? <span className="mt-1 text-xs text-slate-500">{dateLabel(earned.earnedAt)}</span> : <div className="mt-2 w-full"><ProgressBar value={progress} total={isMilestone(sticker) ? sticker.target : 1} label={`Tiến độ mở quà: ${sticker.condition}`} /><span className="mt-1.5 block text-xs text-slate-500">{progress}/{isMilestone(sticker) ? sticker.target : 1} · Xem nhiệm vụ</span></div>}
  </button>;
}

function StickerDetails({sticker,earned,stats,onClose,unitLabel,unitHref}:{sticker:AlbumSticker;earned?:Sticker;stats:StickerStats;onClose:()=>void;unitLabel?:string;unitHref?:string}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {ref.current?.showModal();},[]);
  const progress = isMilestone(sticker) ? milestoneProgress(sticker,stats) : 0;
  const name = stickerDisplayName(sticker,!!earned);
  return <dialog ref={ref} onClose={onClose} onClick={event => {if (event.target === event.currentTarget) onClose();}} aria-labelledby="sticker-detail-title" className={`${styles.dialog} m-auto w-[calc(100%_-_2rem)] max-w-sm overflow-visible rounded-3xl border-0 p-0 text-slate-800 shadow-xl backdrop:bg-slate-900/40`}>
    <div className="relative rounded-3xl bg-white p-6 text-center">
      <button onClick={onClose} aria-label="Đóng chi tiết sticker" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 hover:bg-slate-200">×</button>
      <div className={`${styles.illustration} ${earned ? `${styles.illuminated} ${styles.animatedIllustration}` : ''} mx-auto mt-3 flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50 to-violet-50`}>{earned && <span aria-hidden="true" className={styles.halo} />}<span className={`relative z-10 ${earned ? styles.stickerFloat : ''}`}><StickerPreview emoji={sticker.emoji} revealed={!!earned} size={144} className="h-36 w-36" /></span>{earned && <Sparkles />}</div>
      <p className="mt-5 text-xs font-bold uppercase tracking-widest text-amber-700">{earned ? 'Một dấu mốc của bé' : 'Một bất ngờ đang chờ bé'}</p>
      <h2 id="sticker-detail-title" className="mt-2 text-2xl font-bold">{name}</h2>
      <EditionBadge sticker={earned ?? sticker} />
      {!earned && <p className="mt-2 text-sm text-violet-700">Hoàn thành nhiệm vụ để khám phá sticker bên trong nhé!</p>}
      <p className="mt-3 text-sm leading-6 text-slate-600">{earned?.condition ?? sticker.condition}</p>
      {unitLabel && <p className="mt-2 text-sm font-semibold text-slate-700">{unitLabel}</p>}
      {earned ? <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">Đã nhận ngày {dateLabel(earned.earnedAt)}</p> : isMilestone(sticker) && <div className="mt-4 text-left"><div className="mb-2 flex justify-between text-sm"><span>Tiến độ mở quà</span><span className="font-bold">{progress}/{sticker.target}</span></div><ProgressBar value={progress} total={sticker.target} label="Tiến độ mở quà bí mật" /></div>}
      {isMilestone(sticker) ? <Link href={sticker.href} className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600">{sticker.action}<Arrow /></Link> : unitHref && <Link href={unitHref} className="mt-5 block rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600">Mở chủ đề</Link>}
      <button onClick={onClose} className="mt-3 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800">Quay lại album</button>
    </div>
  </dialog>;
}

export default function StickersPage() {
  const {progress,hydrated,activeProfile,activeProfileId,reconcileStickerRewards} = useProfileContext();
  const {categories} = useVocabularyCatalog();
  const {categories:customCategories} = useCustomCategories();
  const [filter,setFilter] = useState<AlbumFilter>('all');
  const [selection,setSelection] = useState<{profileId:string;id:string}|null>(null);
  const [openedAt] = useState(() => Date.now());
  useEffect(() => {if (hydrated) reconcileStickerRewards();},[hydrated,progress,reconcileStickerRewards]);
  const earned = useMemo(() => mergeStickers(progress.stickers,[]).sort((a,b) => b.earnedAt.localeCompare(a.earnedAt)),[progress.stickers]);
  const earnedMap = new Map(earned.map(s => [s.id,s]));
  const stats = useMemo(() => stickerStats(progress,activeProfileId),[progress,activeProfileId]);
  const edition = gradeRewardEdition(activeProfile.gradeId);
  const milestones = stickerMilestonesForGrade(activeProfile.gradeId);
  const milestoneIds = new Set(milestones.map(s => s.id));
  const souvenirs = earned.filter(s => !milestoneIds.has(s.id));
  const collected = milestones.filter(s => earnedMap.has(s.id)).length;
  const visible = milestones.filter(s => filter === 'all' || (filter === 'earned' ? earnedMap.has(s.id) : filter === 'edition' ? !!s.gradeId : s.setId === filter)).sort((a,b) => Number(earnedMap.has(b.id)) - Number(earnedMap.has(a.id)));
  const upcoming = milestones.filter(s => !earnedMap.has(s.id)).sort((a,b) => stats[b.metric] / b.target - stats[a.metric] / a.target).slice(0,3);
  const selected = selection?.profileId === activeProfileId ? milestones.find(s => s.id === selection.id) ?? earnedMap.get(selection.id) : null;
  // Use the live catalog only for links; souvenirs from previous grades stay visible.
  const gradeCategories = [...categories,...customCategories].filter(c => !('archived' in c && c.archived) && (!c.gradeId || c.gradeId === activeProfile.gradeId));
  const selectedUnit = selected?.unitId ? gradeCategories.find(c => c.id === selected.unitId) : null;
  const activeCollection = STICKER_COLLECTIONS.find(c => c.id === filter);
  const isRecent = (s?:Sticker) => !!s && openedAt - Date.parse(s.earnedAt) < 86400000;
  const openDetails = (id:string) => setSelection({profileId:activeProfileId,id});

  if (!hydrated) return <main className="mx-auto max-w-5xl px-4 py-16" aria-busy="true"><p className="text-center text-slate-500">Đang mở album của bé…</p></main>;
  if (!activeProfileId) return <main className="mx-auto max-w-lg space-y-4 p-8"><Link href="/" className="text-sm text-slate-500">← Trang chủ</Link><h1 className="text-2xl font-bold">Mở album của học sinh</h1><p className="text-slate-600">Thêm hồ sơ học sinh để lưu bộ sưu tập và những phần thưởng của bé.</p><Link href="/parent" className="learning-button bg-orange-600 text-white">Thêm học sinh</Link></main>;
  return <div className="min-h-screen bg-slate-50 text-slate-800">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6"><Link href="/" className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-orange-600"><Arrow className="rotate-180" />Trang chủ</Link><ChildBadge /></div></header>
    <main className="mx-auto max-w-5xl space-y-7 px-4 py-6 sm:px-6 sm:py-8">
      {edition && <section aria-labelledby="grade-gifts-title" className="rounded-3xl border border-violet-100 bg-white p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 id="grade-gifts-title" className="text-lg font-bold">Quà {edition.label} · Phiên bản {edition.name}</h2><p className="mt-1 text-sm leading-6 text-slate-500">6 quà riêng cho lớp của bé. Càng lên lớp, phiên bản càng quý và mốc học càng cao.</p></div><button onClick={() => setFilter('edition')} className="rounded-xl bg-violet-100 px-4 py-2 text-sm font-bold text-violet-800 hover:bg-violet-200">Khám phá quà theo lớp ↓</button></div><div aria-label="Các phiên bản quà theo lớp" className="mt-4 grid grid-cols-5 gap-1.5 sm:gap-3">{GRADE_REWARD_EDITIONS.map(item => <div key={item.gradeId} data-edition={item.level} aria-current={edition.gradeId === item.gradeId ? 'step' : undefined} className={`${styles.editionBadge} rounded-2xl border px-1 py-3 text-center ${edition.gradeId === item.gradeId ? 'ring-2 ring-violet-500 ring-offset-2' : 'opacity-60'}`}><span className="block text-[11px] sm:text-xs">{item.label}</span><span className="mt-1 block text-[11px] font-bold sm:text-sm">{item.name}</span></div>)}</div><p className="mt-4 text-xs leading-5 text-slate-500">Tiến độ đã học được cộng dồn. Quà đã nhận giữ nguyên phiên bản, kể cả khi bé lên lớp.</p></section>}
      <section className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50 to-rose-50 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg"><p className="text-xs font-bold uppercase tracking-[.16em] text-orange-600">Mỗi cố gắng, một niềm vui</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Album sticker của bé</h1><p className="mt-3 text-sm leading-6 text-slate-600">{activeProfile.name} ơi, cùng lấp đầy album bằng những bước học nhỏ mỗi ngày nhé!</p>
            <div className="mt-5 flex flex-wrap items-center gap-3"><span className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-amber-800">{earned.length} sticker đã nhận</span><span className="text-sm text-slate-500">{collected}/{STICKER_MILESTONES.length} mốc trong {STICKER_COLLECTIONS.length} bộ sưu tập</span></div>
            <div className="mt-4 max-w-sm"><ProgressBar value={Math.min(collected,STICKER_MILESTONES.length)} total={STICKER_MILESTONES.length} label="Bộ sưu tập đã hoàn thành" /></div>
          </div>
          <div aria-hidden="true" className={`${styles.heroStickers} relative flex shrink-0 items-center justify-center gap-2 sm:gap-0`}><span className={styles.heroGlow} />{[0,1,2].map(index => <div key={index} className={`relative rounded-3xl border bg-white/90 p-2 shadow-sm ${index === 1 ? 'z-10 -translate-y-3 border-violet-200 sm:-ml-3' : index === 0 ? '-rotate-12 border-rose-200' : 'rotate-12 border-amber-200 sm:-ml-3'}`}><span className={`${styles.heroFloat} block`} style={{animationDelay:`${index * -2}s`}}><StickerPreview emoji={earned[index]?.emoji ?? '🎁'} revealed={!!earned[index]} size={index === 1 ? 112 : 88} className={index === 1 ? 'h-24 w-24' : 'h-20 w-20'} /></span></div>)}<Sparkles /></div>
        </div>
      </section>

      {upcoming.length > 0 && <section aria-labelledby="next-stickers-title"><div className="mb-3 flex items-center justify-between"><h2 id="next-stickers-title" className="text-lg font-bold">Sắp mở quà bí mật</h2><span className="text-xs text-slate-500 sm:hidden">Vuốt để xem thêm →</span><span className="hidden text-xs text-slate-500 sm:inline">Một bước nhỏ nữa</span></div><div className="grid grid-flow-col auto-cols-[85%] snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-3 sm:overflow-visible">{upcoming.map(s => {const value = milestoneProgress(s,stats); return <div key={s.id} className="flex snap-start flex-col rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-3"><StickerPreview emoji={s.emoji} revealed={false} size={56} className="h-14 w-14 shrink-0" /><div><h3 className="text-sm font-bold">{stickerDisplayName(s,false)} · {STICKER_COLLECTIONS.find(c => c.id === s.setId)?.name}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{s.condition}</p></div></div><div className="mb-2 mt-4 flex justify-between text-xs text-slate-500"><span>Đã hoàn thành</span><span className="font-bold text-slate-700">{value}/{s.target}</span></div><ProgressBar value={value} total={s.target} label={`Tiến độ mở quà: ${s.condition}`} /><Link href={s.href} className="mt-4 flex items-center justify-between rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100">{s.action}<Arrow /></Link></div>;})}</div></section>}

      <section aria-labelledby="album-title"><div className="mb-4"><h2 id="album-title" className="text-lg font-bold">Bộ sưu tập của {activeProfile.name}</h2><p className="mt-1 text-sm text-slate-500">Sticker chưa mở được giấu trong hộp quà. Chạm vào để xem nhiệm vụ nhé!</p></div>
        <div aria-label="Chọn bộ sticker" className="mb-5 flex flex-wrap gap-2">{([{id:'all',name:'Tất cả',emoji:''},{id:'earned',name:'Đã nhận',emoji:'✓'},...STICKER_COLLECTIONS] as const).map(item => <button key={item.id} onClick={() => setFilter(item.id)} aria-pressed={filter === item.id} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${filter === item.id ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50'}`}>{item.emoji && <span aria-hidden="true" className="mr-1.5">{item.emoji}</span>}{item.name}{STICKER_COLLECTIONS.some(c => c.id === item.id) && <span className="ml-2 text-xs opacity-80">{STICKER_MILESTONES.filter(s => s.setId === item.id && earnedMap.has(s.id)).length}/{STICKER_MILESTONES.filter(s => s.setId === item.id).length}</span>}</button>)}</div>
        {activeCollection && <p className="mb-4 text-sm text-slate-500">{activeCollection.description}</p>}
        {visible.length ? <div className="grid grid-cols-2 gap-3 min-[400px]:grid-cols-3 sm:gap-4 lg:grid-cols-6">{visible.map((s,index) => <StickerCard key={s.id} sticker={s} earned={earnedMap.get(s.id)} stats={stats} recent={isRecent(earnedMap.get(s.id))} onClick={() => openDetails(s.id)} index={index} animated={index < 6} />)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center"><StickerArtwork emoji="🎁" size={80} className="mx-auto h-20 w-20" /><p className="mt-3 font-bold">Album đang chờ sticker đầu tiên</p><p className="mt-2 text-sm text-slate-500">Thử một bài luyện âm hoặc luyện nói một từ nhé.</p><Link href="/ipa" className="mt-4 inline-block rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white">Bắt đầu luyện âm</Link></div>}
      </section>

      {souvenirs.length > 0 && (filter === 'all' || filter === 'earned') && <section aria-labelledby="souvenirs-title"><h2 id="souvenirs-title" className="text-lg font-bold">Kỷ niệm bài học <span className="text-sm font-normal text-slate-500">({souvenirs.length})</span></h2><p className="mb-4 mt-1 text-sm text-slate-500">Những sticker bé đã nhận ở các chủ đề, kể cả từ lớp trước.</p><div className="grid grid-cols-2 gap-3 min-[400px]:grid-cols-3 sm:gap-4 lg:grid-cols-6">{souvenirs.map((s,index) => <StickerCard key={s.id} sticker={s} earned={s} stats={stats} recent={isRecent(s)} onClick={() => openDetails(s.id)} index={index} animated={index < 6} />)}</div></section>}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500"><p>Học vừa sức, nghỉ khi cần. Mỗi lần thử đều đáng khen.</p><a href="https://github.com/microsoft/fluentui-emoji" target="_blank" rel="noreferrer" className="hover:text-slate-700">Hình: Microsoft Fluent Emoji · MIT</a></footer>
    </main>
    {selected && <StickerDetails key={`${activeProfileId}:${selected.id}`} sticker={selected} earned={earnedMap.get(selected.id)} stats={stats} onClose={() => setSelection(null)} unitLabel={selectedUnit?.name_vi} unitHref={selectedUnit ? `/learn/${encodeURIComponent(selectedUnit.id)}` : undefined} />}
  </div>;
}
