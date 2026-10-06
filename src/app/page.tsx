'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GRADE_METAS } from '@/lib/vocabulary';
import { useProgress } from '@/hooks/useProgress';
import { useCustomCategories, NEW_WORDS_CAT_ID } from '@/hooks/useCustomCategories';
import { useAdminContext } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { useBackendSession } from '@/hooks/useBackendSession';
import { ChildBadge } from '@/components/ChildBadge';
import { LearningEntry } from '@/components/learning/LearningSummary';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';
import type { Category } from '@/types';

type GradeCategory = Category & { gradeId?: string; isCustom?: boolean };

export default function HomePage() {
  const { categories: serverCategories, settings } = useVocabularyCatalog();
  const { progress, hydrated, activeProfile, getDueReviewWords } = useProgress();
  const { categories: customCats, hydrated: customHydrated } = useCustomCategories();
  const { isAdmin, logoutAdmin } = useAdminContext();
  const { isAuthenticated, isLoading: authLoading, openAuthModal, account } = useAuth();
  const adminSession = useBackendSession();
  const [query, setQuery] = useState('');
  const selectedGrade = activeProfile?.gradeId ?? 'maugiao';
  const gradeMeta = GRADE_METAS[selectedGrade] ?? GRADE_METAS.lop1;
  const due = hydrated ? getDueReviewWords().length : 0;
  const categories = [
    ...(customHydrated ? customCats.filter(c => c.id === NEW_WORDS_CAT_ID ? c.words.length > 0 : !c.gradeId || c.gradeId === selectedGrade) : []),
    ...(serverCategories as GradeCategory[]).filter(c => c.gradeId === selectedGrade),
  ];
  const search = query.trim().toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  const visible = categories.filter(c => `${c.name_vi} ${c.name_en}`.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').includes(search));
  const starsFor = (cat: Category) => hydrated ? cat.words.reduce((sum, word) => sum + (progress.wordProgress[`${cat.id}:${word.id}`]?.stars ?? 0), 0) : 0;

  return <div className="clean-home min-h-screen bg-slate-50 text-slate-800">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight"><span aria-hidden="true">🦉</span>{settings.appName}</Link>
        <div className="flex items-center gap-2">
          <ChildBadge variant="compact" />
          <div className="flex">
            {authLoading || adminSession.loading ? <span role="status" className="learning-button text-sm text-slate-500">Đang kiểm tra tài khoản…</span>
              : isAuthenticated ? <button onClick={() => openAuthModal('login')} className="learning-button border border-slate-200 bg-white text-sm" title={account?.email}>{account?.displayName || 'Tài khoản'}</button>
              : adminSession.authenticated ? <Link href="/admin" className="learning-button border border-slate-200 bg-white text-sm">Admin · Đã đăng nhập</Link>
              : <button onClick={() => openAuthModal('login')} className="learning-button border border-slate-200 bg-white text-sm">Đăng nhập</button>}
          </div>
          {isAdmin && <button onClick={logoutAdmin} className="learning-button text-sm text-orange-700">Khóa quản trị</button>}
          {account?.role !== 'student' && !adminSession.loading && !adminSession.authenticated && <Link href="/admin" className="learning-button text-sm text-slate-600">Quản trị</Link>}
          
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-6xl space-y-7 px-4 py-7 pb-28 sm:px-6 sm:py-10">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-sm text-slate-500">{settings.welcomeText}</p><h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Hôm nay mình học gì?</h1></div>
        <div className="flex gap-4 text-sm text-slate-600" aria-label="Thành tích">
          <span className="hidden sm:inline">Mục tiêu: {settings.dailyGoal} từ/ngày</span>
          <span>⭐ <strong>{hydrated ? progress.totalStars : 0}</strong> sao</span>
          <span>🔥 <strong>{hydrated ? progress.streak : 0}</strong> ngày học</span>
          <Link href="/stickers" className="underline decoration-slate-300 underline-offset-4">Sticker</Link>
        </div>
      </section>
      {!hydrated ? <p role="status" className="text-sm text-slate-500">Đang nạp hồ sơ học sinh…</p> : !activeProfile.id ? <section className="space-y-3 rounded-2xl border border-orange-200 bg-orange-50 p-5"><h2 className="font-bold">Chưa có hồ sơ học sinh</h2><p className="text-sm text-slate-600">Thêm học sinh và chọn lớp để mở bài học phù hợp.</p><Link href="/parent" className="learning-button bg-orange-600 text-white">Thêm học sinh</Link></section> : <>
      <LearningEntry />
      <nav aria-label="Công cụ học tập" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { href: '/review', icon: '↻', title: 'Ôn tập', detail: due ? `${due} từ đến lịch ôn` : 'Ôn lại từ đã học' },
          { href: '/test', icon: '✓', title: 'Luyện tập', detail: 'Nghe, ghép và viết' },
          { href: '/ipa', icon: 'Aa', title: 'Phát âm', detail: 'Khám phá 44 âm IPA' },
          { href: `/wordsearch/${categories[0]?.id ?? 'animals'}`, icon: '⌕', title: 'Tìm từ', detail: 'Chơi cùng từ vựng' },
        ].filter(item => settings.showGames || item.title !== 'Tìm từ').map(item => <Link key={item.title} href={item.href} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-orange-300">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-600">{item.icon}</span>
          <div><h2 className="text-sm font-bold">{item.title}</h2><p className="mt-1 text-xs text-slate-500">{item.detail}</p></div>
        </Link>)}
      </nav>
      <section className="space-y-4" aria-labelledby="topics-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 id="topics-title" className="text-xl font-extrabold">Chủ đề của bé</h2><p className="mt-1 text-sm text-slate-500">{categories.length} chủ đề · {gradeMeta.age}</p></div>
          <label className="w-full sm:w-72"><span className="sr-only">Tìm chủ đề</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm chủ đề…" className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm" /></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(cat => {
            const stars = starsFor(cat);
            const max = cat.words.length * 3;
            const pct = max ? Math.min(100, Math.round(stars / max * 100)) : 0;
            return <article key={cat.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between"><span aria-hidden="true" className="text-3xl">{cat.emoji}</span><span className="text-xs text-slate-500">{cat.words.length} từ{pct === 100 ? ' · Hoàn thành' : ''}</span></div>
              <h3 className="mt-4 font-bold">{cat.name_vi}</h3><p className="mt-1 text-sm text-slate-500">{cat.name_en}</p>
              <div className="mt-auto pt-4"><div className="mb-2 flex justify-between text-xs text-slate-500"><span>Tiến độ</span><span>{pct}%</span></div><div role="progressbar" aria-label={`Tiến độ ${cat.name_vi}`} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-orange-500" style={{ width: `${pct}%` }} /></div></div>
              <div className="mt-4 grid grid-cols-2 gap-2"><Link href={`/learn/${cat.id}`} className="learning-button bg-orange-50 text-sm text-orange-800 hover:bg-orange-100">Học từ</Link><Link href={`/test/${cat.id}`} className="learning-button border border-slate-200 text-sm hover:bg-slate-50">Luyện tập</Link></div>
            </article>;
          })}
        </div>
        {!visible.length && <p role="status" className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">{search ? 'Chưa tìm thấy chủ đề. Thử tên khác nhé.' : 'Chưa có chủ đề cho lớp này.'}</p>}
        {isAdmin && <Link href={`/import?targetGrade=${selectedGrade}`} className="learning-button border border-dashed border-slate-300 bg-white text-sm">+ Thêm bài học</Link>}
      </section>
      </>}
    </main>
    <nav aria-label="Điều hướng chính" className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-lg grid-cols-4 py-2">{[
        { href: '/', label: 'Trang chủ', icon: '⌂' }, { href: '/curriculum', label: adminSession.authenticated || account?.role === 'parent' ? 'Đoạn văn' : 'Bài luyện', icon: '▤' }, { href: '/review', label: 'Ôn tập', icon: '↻' }, { href: '/parent', label: 'Phụ huynh', icon: '☷' },
      ].filter(item => account?.role !== 'student' || item.href !== '/parent').map(item => <Link key={item.href} href={item.href} aria-current={item.href === '/' ? 'page' : undefined} className={`flex min-h-12 flex-col items-center justify-center gap-1 text-xs font-bold ${item.href === '/' ? 'text-orange-700' : 'text-slate-500 hover:text-slate-800'}`}><span aria-hidden="true" className="text-xl">{item.icon}</span>{item.label}</Link>)}</div>
    </nav>
  </div>;
}


