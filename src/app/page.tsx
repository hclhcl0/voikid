'use client';

import Link from 'next/link';
import Image from 'next/image';
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
import {BookOpen,CircleCheck,Flame,House,RotateCcw,Search,ShoppingBag,Speech,Star,Swords,UsersRound,Sparkles,Settings} from 'lucide-react';
import {EmojiImage} from '@/components/WordImage';
import {DailyWordCard} from '@/components/learning/DailyWordCard';

type GradeCategory = Category & { gradeId?: string; isCustom?: boolean };

export default function HomePage() {
  const { categories: serverCategories, settings } = useVocabularyCatalog();
  const { progress, hydrated, activeProfile, getDueReviewWords } = useProgress();
  const { categories: customCats, hydrated: customHydrated } = useCustomCategories();
  const { isAdmin, logoutAdmin } = useAdminContext();
  const { isAuthenticated, isLoading: authLoading, openAuthModal, account } = useAuth();
  const adminSession = useBackendSession();
  const [query, setQuery] = useState('');
  const [topicPagination, setTopicPagination] = useState({ scope: '', page: 1 });
  const selectedGrade = activeProfile?.gradeId ?? 'maugiao';
  const gradeMeta = GRADE_METAS[selectedGrade] ?? GRADE_METAS.lop1;
  const due = hydrated ? getDueReviewWords().length : 0;
  const categories = [
    ...(customHydrated ? customCats.filter(c => c.id === NEW_WORDS_CAT_ID ? c.words.length > 0 : !c.gradeId || c.gradeId === selectedGrade) : []),
    ...(serverCategories as GradeCategory[]).filter(c => c.gradeId === selectedGrade),
  ];
  const search = query.trim().toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  const visible = categories.filter(c => `${c.name_vi} ${c.name_en}`.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').includes(search));
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const topicScope = `${activeProfile.id}:${selectedGrade}:${search}`;
  const topicPage = topicPagination.scope === topicScope ? Math.min(topicPagination.page, pageCount) : 1;
  const pagedTopics = visible.slice((topicPage - 1) * pageSize, topicPage * pageSize);
  const starsFor = (cat: Category) => hydrated ? cat.words.reduce((sum, word) => sum + (progress.wordProgress[`${cat.id}:${word.id}`]?.stars ?? 0), 0) : 0;

  return <div className="clean-home min-h-screen bg-slate-50 text-slate-800">
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
        {/* Left: Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 text-lg sm:text-xl font-extrabold tracking-tight shrink-0">
          <div className="relative h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-xl shadow-sm border border-orange-200 shrink-0">
            <Image src="/logo.png" alt="Logo" width={36} height={36} className="h-full w-full object-cover" priority />
          </div>
          <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent font-black tracking-tight">
            {settings.appName}
          </span>
        </Link>

        {/* Right: Profile Badge & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ChildBadge variant="compact" />

          {/* Login / Account button */}
          <div className="flex shrink-0">
            {authLoading || adminSession.loading ? (
              <span role="status" className="h-9 px-2.5 inline-flex items-center text-xs font-bold text-slate-400">...</span>
            ) : isAuthenticated ? (
              <button
                onClick={() => openAuthModal('login')}
                className="h-9 px-2.5 sm:px-3 inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 whitespace-nowrap transition-colors"
                title={account?.email}
              >
                {account?.displayName || 'Tài khoản'}
              </button>
            ) : adminSession.authenticated ? (
              <Link
                href="/admin"
                className="h-9 px-2.5 sm:px-3 inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 text-xs font-bold text-orange-700 hover:bg-orange-100 whitespace-nowrap transition-colors"
                title="Quản trị ứng dụng (Đã đăng nhập)"
              >
                <Settings className="h-4 w-4 text-orange-600 animate-spin-slow" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="h-9 px-2.5 sm:px-3 inline-flex items-center rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 whitespace-nowrap transition-colors"
              >
                Đăng nhập
              </button>
            )}
          </div>

          {/* Admin / Settings gear icon button */}
          {account?.role !== 'student' && !adminSession.loading && !adminSession.authenticated && (
            <Link
              href="/admin"
              className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 transition-colors shadow-xs"
              title="Quản trị ứng dụng & Cài đặt hệ thống"
              aria-label="Quản trị ứng dụng"
            >
              <Settings className="h-4 w-4" />
            </Link>
          )}

          {isAdmin && (
            <button
              onClick={logoutAdmin}
              className="h-9 px-2.5 inline-flex items-center rounded-xl text-xs font-bold text-orange-700 hover:bg-orange-50 whitespace-nowrap transition-colors"
            >
              Khóa quản trị
            </button>
          )}

          {/* Install WebApp button */}
          <button
            onClick={() => window.dispatchEvent(new Event('vocakids:open-install-guide'))}
            className="h-9 px-2.5 sm:px-3 inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50/80 text-xs font-bold text-orange-700 hover:bg-orange-100 whitespace-nowrap transition-colors hidden md:inline-flex"
            title="Cài đặt ứng dụng lên màn hình chính điện thoại"
          >
            📱 Cài App
          </button>

          {/* Guide link */}
          <Link
            href="/guide"
            className="h-9 px-2 sm:px-2.5 inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:text-orange-600 hover:bg-slate-50 whitespace-nowrap transition-colors hidden sm:inline-flex"
            title="Hướng dẫn sử dụng"
          >
            📖 <span className="hidden md:inline">Hướng dẫn</span>
          </Link>
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-6xl space-y-7 px-4 py-6 pb-28 sm:px-6 sm:py-8">
      {/* Gamification Stats & Greeting Bar */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600 sm:text-sm">
            {settings.welcomeText}
          </p>
          <h1 className="mt-0.5 text-2xl font-black text-slate-900 sm:text-3xl">
            {activeProfile?.name ? `Chào bé ${activeProfile.name}! 👋` : 'Hôm nay mình học gì? 🚀'}
          </h1>
        </div>

        {/* Gamified counters: Streak, Stars, Stickers */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3" aria-label="Thành tích học tập">
          <div className="inline-flex items-center gap-1.5 rounded-2xl border-b-2 border-orange-700 bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-xs font-black text-white shadow-sm sm:px-4 sm:text-sm">
            <Flame className="h-4 w-4 animate-bounce-slow text-yellow-200" />
            <span>{hydrated ? progress.streak : 0} ngày</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-2xl border-b-2 border-amber-600 bg-gradient-to-r from-yellow-400 to-amber-400 px-3 py-1.5 text-xs font-black text-amber-950 shadow-sm sm:px-4 sm:text-sm">
            <Star className="h-4 w-4 fill-amber-300 text-amber-800" />
            <span>{hydrated ? progress.totalStars : 0} sao</span>
          </div>

          <Link
            href="/stickers"
            className="inline-flex items-center gap-1.5 rounded-2xl border-b-2 border-pink-700 bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1.5 text-xs font-black text-white shadow-sm hover:brightness-105 active:translate-y-0.5 active:border-b-0 transition-all sm:px-4 sm:text-sm"
          >
            <span>🎁</span>
            <span className="hidden xs:inline">Sticker</span>
          </Link>

          <Link
            href="/guide"
            className="inline-flex items-center gap-1 rounded-2xl border-2 border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-100 transition-colors"
          >
            📖 <span className="hidden sm:inline">Cẩm nang</span>
          </Link>
        </div>
      </section>

      {!hydrated ? (
        <div role="status" className="flex items-center justify-center p-12 text-slate-500">
          <div className="text-4xl animate-bounce-slow">🦉</div>
          <span className="ml-3 font-bold">Đang nạp dữ liệu bài học…</span>
        </div>
      ) : !activeProfile.id ? (
        <section className="space-y-4 rounded-3xl border-2 border-orange-300 bg-orange-50/80 p-6 sm:p-8 text-center shadow-md">
          <div className="text-5xl">👶</div>
          <h2 className="text-xl font-extrabold text-orange-950">Chưa có hồ sơ học sinh</h2>
          <p className="mx-auto max-w-md text-sm text-slate-600">
            Tạo hồ sơ và chọn khối lớp cho bé để mở kho bài học chuẩn SGK Bộ Giáo Dục nhé!
          </p>
          <div>
            <Link href="/parent" className="btn-3d-orange px-6 py-3 text-sm font-black">
              + Thêm học sinh ngay
            </Link>
          </div>
        </section>
      ) : (
        <>
          <LearningEntry />
          <DailyWordCard />

          {/* Công cụ học tập 3D */}
          <section aria-labelledby="tools-title" className="space-y-3">
            <h2 id="tools-title" className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="text-xl">🎮</span> Góc Luyện Tập &amp; Trò Chơi
            </h2>
            <nav
              aria-label="Công cụ học tập"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7"
            >
              {[
                { href: '/daily', Icon: Sparkles, color: 'bg-amber-100 text-amber-600', title: 'Từ mới', detail: 'Học & nói AI' },
                { href: '/review', Icon: RotateCcw, color: 'bg-violet-100 text-violet-600', title: 'Ôn tập', detail: due ? `${due} từ ôn` : 'Trí nhớ dài hạn' },
                { href: '/test', Icon: CircleCheck, color: 'bg-emerald-100 text-emerald-600', title: 'Luyện tập', detail: 'Nghe & ghép từ' },
                { href: '/ipa', Icon: Speech, color: 'bg-orange-100 text-orange-600', title: 'Phát âm', detail: '44 âm IPA chuẩn' },
                { href: `/wordsearch/${categories[0]?.id ?? 'animals'}`, Icon: Search, color: 'bg-sky-100 text-sky-600', title: 'Tìm từ', detail: 'Ô chữ vui vẻ' },
                { href: '/arena', Icon: Swords, color: 'bg-purple-100 text-purple-600', title: 'Đấu trường', detail: 'Tung chiêu từ vựng' },
                { href: '/shop', Icon: ShoppingBag, color: 'bg-teal-100 text-teal-600', title: 'Cửa hàng', detail: '500 từ mua sắm' },
              ]
                .filter(item => settings.showGames || !['Tìm từ', 'Đấu trường', 'Cửa hàng'].includes(item.title))
                .map(item => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex flex-col justify-between rounded-2xl border-2 border-slate-200/90 bg-white p-3.5 shadow-[0_4px_0_0_#e2e8f0] hover:shadow-[0_6px_0_0_#cbd5e1] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color} shadow-sm group-hover:scale-105 transition-transform`}>
                        <item.Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <h3 className="text-sm font-black text-slate-800">{item.title}</h3>
                      <p className="text-[11px] font-semibold text-slate-400 truncate">{item.detail}</p>
                    </div>
                  </Link>
                ))}
            </nav>
          </section>

          {/* Danh mục chủ đề bài học chuẩn SGK */}
          <section className="space-y-4 pt-2" aria-labelledby="topics-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="topics-title" className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span className="text-2xl">📚</span> Bài Học Theo SGK
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 font-bold">
                  Khối {gradeMeta.name} ({gradeMeta.age}) · {categories.length} chủ đề
                </p>
              </div>
              <label className="w-full sm:w-72">
                <span className="sr-only">Tìm chủ đề</span>
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="🔍 Tìm tên bài học…"
                  className="min-h-11 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 text-sm font-bold shadow-sm focus:border-orange-500 focus:outline-none transition-colors"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pagedTopics.map(cat => {
                const stars = starsFor(cat);
                const max = cat.words.length * 3;
                const pct = max ? Math.min(100, Math.round((stars / max) * 100)) : 0;

                return (
                  <article
                    key={cat.id}
                    className="flex flex-col rounded-3xl border-2 border-slate-200/90 bg-white p-5 shadow-[0_6px_0_0_#e2e8f0] hover:shadow-[0_10px_0_0_#cbd5e1] hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 border border-orange-100 shadow-inner">
                        <EmojiImage emoji={cat.emoji} alt={cat.name_vi} size="md" />
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                          {cat.words.length} từ
                        </span>
                        {pct === 100 && (
                          <div className="mt-1 text-[11px] font-black text-emerald-600">
                            ✓ Hoàn thành
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3.5">
                      <h3 className="text-base font-black text-slate-900">{cat.name_vi}</h3>
                      <p className="text-xs font-bold text-orange-600">{cat.name_en}</p>
                    </div>

                    {/* Thanh tiến độ */}
                    <div className="mt-auto pt-4 space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Tiến độ bài học</span>
                        <span className="text-orange-600 font-black">{pct}%</span>
                      </div>
                      <div
                        role="progressbar"
                        aria-label={`Tiến độ ${cat.name_vi}`}
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="h-2.5 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60 p-0.5"
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Nút hành động 3D phong cách học tập */}
                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      <Link
                        href={`/learn/${cat.id}`}
                        className="btn-3d-orange py-2.5 text-xs font-black shadow-sm"
                      >
                        Học từ 🚀
                      </Link>
                      <Link
                        href={`/test/${cat.id}`}
                        className="btn-3d-white py-2.5 text-xs font-bold"
                      >
                        Luyện tập 🎯
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {!visible.length && (
              <div role="status" className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
                <span className="text-3xl">🔍</span>
                <p className="mt-2 font-bold">{search ? 'Không tìm thấy chủ đề phù hợp.' : 'Chưa có chủ đề cho khối lớp này.'}</p>
              </div>
            )}

            {pageCount > 1 && (
              <nav aria-label="Phân trang chủ đề" className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p role="status" className="text-xs font-bold text-slate-500">
                  Trang {topicPage} / {pageCount} ({visible.length} chủ đề)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={topicPage === 1}
                    onClick={() => setTopicPagination({ scope: topicScope, page: topicPage - 1 })}
                    className="btn-3d-white px-3 py-1.5 text-xs font-bold disabled:opacity-40"
                  >
                    ← Trước
                  </button>
                  <button
                    disabled={topicPage === pageCount}
                    onClick={() => setTopicPagination({ scope: topicScope, page: topicPage + 1 })}
                    className="btn-3d-white px-3 py-1.5 text-xs font-bold disabled:opacity-40"
                  >
                    Sau →
                  </button>
                </div>
              </nav>
            )}

            {isAdmin && (
              <div className="pt-2">
                <Link
                  href={`/import?targetGrade=${selectedGrade}`}
                  className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 px-4 py-2 text-xs font-bold text-orange-700 hover:bg-orange-100"
                >
                  + Thêm bài học mới cho khối {gradeMeta.name}
                </Link>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  </div>;
}


