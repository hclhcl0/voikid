'use client';

import { AppPageHeader } from '@/components/ui/AppPageHeader';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { TreasureHunt } from '@/components/games/TreasureHunt';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { useProfileContext } from '@/context/ProfileContext';
import { ArrowLeft } from 'lucide-react';

export default function TreasurePage() {
  const { catId } = useParams<{ catId: string }>();
  const { categories } = useVocabularyCatalog();
  const { categories: custom } = useCustomCategories();
  const { activeProfile, hydrated, openProfileModal } = useProfileContext();
  const category = (catId.startsWith('custom_') ? [...custom, ...categories] : categories).find(c => c.id === catId);
  return <div className="min-h-dvh bg-slate-50 text-slate-800">
    <AppPageHeader title="Săn kho báu từ vựng" description="Nghe, ghép nghĩa và luyện nói để khám phá quà." inset actions={<>
<Link href={`/learn/${catId}`} className="flex min-h-11 items-center gap-2 text-sm font-bold text-violet-700"><ArrowLeft className="h-5 w-5" aria-hidden="true"/>Học từ</Link>
</>}/>
    <main className="mx-auto max-w-2xl px-4 py-5">
      <h2 className="ui-section-title">{category?.name_vi ?? 'Đang tìm chủ đề…'}</h2>
      {!hydrated ? <p role="status" className="mt-6">Đang tải hồ sơ…</p> : !activeProfile.id ? <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6"><p>Chọn học sinh để lưu quà và tiến độ nhé!</p><button onClick={openProfileModal} className="mt-4 min-h-11 rounded-xl bg-violet-600 px-5 font-bold text-white">Chọn học sinh</button></div> : category ? <TreasureHunt key={`${activeProfile.id}:${activeProfile.gradeId}:${catId}`} category={category}/> : <p role="status" className="mt-6">Chủ đề chưa có trong kho từ. <Link href="/curriculum" className="text-violet-700 underline">Chọn Unit khác</Link></p>}
    </main>
  </div>;
}
