'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';
import { useProfileContext } from '@/context/ProfileContext';
import { useAdminContext } from '@/context/AdminContext';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { CATEGORIES } from '@/lib/vocabulary';

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <motion.div whileHover={{ y: -3 }} className={`rounded-2xl p-4 ${color} text-center shadow`}>
      <div className="text-3xl mb-1">{icon}</div>
      <div className="font-black text-2xl text-gray-800">{value}</div>
      <div className="text-xs font-bold text-gray-500">{label}</div>
    </motion.div>
  );
}

export default function ParentPage() {
  const router = useRouter();
  const { progress, todayStats, resetAll, hydrated } = useProgress();
  const {
    profiles,
    activeProfile,
    activeProfileId,
    setActiveProfileId,
    openProfileModal,
    getProfileStars,
  } = useProfileContext();
  const { isAdmin, openAdminModal, logoutAdmin } = useAdminContext();
  const { categories: customCats } = useCustomCategories();

  if (!hydrated) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-4xl animate-bounce-slow">🦉</div>
    </div>
  );

  const totalWords   = CATEGORIES.reduce((s, c) => s + c.words.length, 0);
  const masteredWords = Object.values(progress.wordProgress).filter((w) => w.stars >= 2).length;

  // Group by category
  const catStats = CATEGORIES.map((cat) => {
    const catEntries = Object.entries(progress.wordProgress).filter(([k]) => k.startsWith(`${cat.id}:`));
    const stars   = catEntries.reduce((s, [, v]) => s + v.stars, 0);
    const maxStars = cat.words.length * 3;
    const attempts = catEntries.reduce((s, [, v]) => s + v.attempts, 0);
    const pct      = maxStars > 0 ? Math.round((stars / maxStars) * 100) : 0;
    return { cat, stars, maxStars, attempts, pct };
  });

  // Recent 7 days stats
  const last7 = (() => {
    const days: { date: string; label: string; words: number; stars: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d     = new Date(Date.now() - i * 864e5);
      const date  = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('vi-VN', { weekday: 'short' });
      const found = progress.dailyStats.find((s) => s.date === date);
      days.push({ date, label, words: found?.wordsStudied ?? 0, stars: found?.totalStars ?? 0 });
    }
    return days;
  })();

  const maxWords = Math.max(...last7.map((d) => d.words), 1);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border-2 border-violet-100 space-y-5"
        >
          <div className="w-16 h-16 rounded-3xl bg-violet-100 flex items-center justify-center text-3xl mx-auto shadow-inner">
            👨‍👩‍👧
          </div>
          <div>
            <h2 className="font-black text-xl text-gray-800">Góc Phụ Huynh & Thống Kê</h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Xem chi tiết tiến trình học, điểm số và quản lý hồ sơ các bé.
            </p>
          </div>
          <button
            onClick={() => openAdminModal()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
          >
            🔑 Mở Khóa Phụ Huynh (PIN)
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            ← Về Trang Học Của Bé
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur sticky top-0 z-50 border-b border-violet-100 px-4 py-3 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center font-bold text-violet-600 hover:bg-violet-100 transition-colors cursor-pointer" title="Quay lại">←</button>
            <Link href="/" className="w-10 h-10 rounded-xl bg-orange-100/80 text-orange-600 hover:bg-orange-200/80 flex items-center justify-center font-bold text-base transition-colors shadow-xs cursor-pointer" title="Về trang chủ">🏠</Link>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-base md:text-lg text-gray-800 truncate flex items-center gap-2">
              <span>👨‍👩‍👧 Tiến Trình: {activeProfile.name} {activeProfile.avatar}</span>
              <span className="text-[10px] font-black bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                👑 Admin
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={logoutAdmin}
              className="text-xs font-bold text-gray-500 hover:text-rose-600 flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Khóa quyền phụ huynh"
            >
              <span>🔒 Khóa</span>
            </button>
            <button
              onClick={() => { if (confirm(`Xóa toàn bộ số sao và dữ liệu học của bé "${activeProfile.name}"?`)) resetAll(); }}
              className="text-xs text-gray-400 hover:text-rose-500 font-bold transition-colors shrink-0 px-2 py-1 cursor-pointer"
            >Đặt lại</button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">

        {/* Child Profile Switcher */}
        <div className="bg-white rounded-3xl p-3.5 shadow-xs border border-violet-100 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Chọn hồ sơ bé theo dõi:
            </span>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 cursor-pointer"
              >
                <span>🔑 Màn hình đăng nhập</span>
              </Link>
              <button
                onClick={openProfileModal}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
              >
                <span>⚙️ Quản lý bé</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {profiles.map((p) => {
              const isActive = p.id === activeProfileId;
              const stars = getProfileStars(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProfileId(p.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border-2 font-black text-xs transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  <span className="text-base leading-none">{p.avatar}</span>
                  <span>{p.name}</span>
                  {p.code && (
                    <span className={`text-[10px] font-mono px-1 rounded ${isActive ? 'bg-black/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                      {p.code}
                    </span>
                  )}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/30 text-white' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    ⭐ {stars}
                  </span>
                </button>
              );
            })}
            <button
              onClick={openProfileModal}
              className="px-3 py-2 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/60 text-orange-600 font-bold text-xs shrink-0 hover:bg-orange-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>+</span> Thêm bé
            </button>
          </div>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon="⭐" label="Tổng sao" value={progress.totalStars} color="bg-amber-50" />
          <StatCard icon="🔥" label="Chuỗi ngày" value={`${progress.streak} ngày`} color="bg-orange-50" />
          <StatCard icon="📚" label="Đã học" value={`${masteredWords}/${totalWords}`} color="bg-violet-50" />
        </div>

        {/* Vocabulary Management Quick Card */}
        <Link
          href="/manage"
          className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 rounded-3xl text-white shadow-lg hover:brightness-105 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
            📚
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-black text-sm">Quản lý kho từ vựng của bé</p>
              <span className="text-[10px] font-black bg-white/30 px-2 py-0.5 rounded-full shrink-0">
                {customCats.length} chủ đề
              </span>
            </div>
            <p className="text-white/90 text-xs mt-0.5 font-semibold">
              Sửa từ, xóa chủ đề, thêm từ & xuất file sao lưu
            </p>
          </div>
          <span className="text-xl font-black text-white/90 group-hover:translate-x-1 transition-transform">→</span>
        </Link>

        {/* Today's summary */}
        {todayStats && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl p-5 text-white shadow-xl">
            <p className="font-bold text-sm opacity-80 mb-2">📅 Hôm nay</p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="font-black text-3xl">{todayStats.wordsStudied}</div>
                <div className="text-xs opacity-80">từ đã học</div>
              </div>
              <div className="text-center">
                <div className="font-black text-3xl">{todayStats.totalStars}</div>
                <div className="text-xs opacity-80">sao kiếm được</div>
              </div>
              <div className="ml-auto text-5xl">🏆</div>
            </div>
          </motion.div>
        )}

        {/* 7-day bar chart */}
        <div className="bg-white rounded-3xl p-5 shadow border border-violet-100">
          <h2 className="font-black text-gray-800 mb-4">📊 Hoạt động 7 ngày qua</h2>
          <div className="flex items-end gap-2 h-24">
            {last7.map((day, i) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: day.words > 0 ? `${Math.round((day.words / maxWords) * 80)}px` : '4px' }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className={`w-full rounded-t-lg ${day.words > 0 ? 'bg-gradient-to-t from-violet-500 to-purple-400' : 'bg-gray-100'}`}
                  />
                </div>
                <span className="text-xs font-bold text-gray-400">{day.label}</span>
                {day.words > 0 && <span className="text-xs font-black text-violet-600">{day.words}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Per-category progress */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow border border-violet-100">
          <h2 className="font-black text-gray-800 text-base md:text-lg mb-4">🗂️ Tiến trình theo chủ đề</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {catStats.map(({ cat, stars, maxStars, attempts, pct }) => (
              <Link
                key={cat.id}
                href={`/learn/${cat.id}`}
                className="block group p-3.5 bg-gray-50/70 hover:bg-violet-50/60 rounded-2xl border border-gray-100 hover:border-violet-200 transition-all"
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-2xl p-1 bg-white rounded-xl shadow-2xs">{cat.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-gray-800 group-hover:text-violet-600 transition-colors">
                        {cat.name_vi}
                      </span>
                      <span className="text-xs font-black text-violet-600">{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-200/80 rounded-full mt-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 ml-10 text-xs text-gray-500 font-semibold">
                  <span>⭐ {stars}/{maxStars} sao</span>
                  <span>🔁 {attempts} lượt luyện</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Words mastered detail */}
        <div className="bg-white rounded-3xl p-5 shadow border border-violet-100">
          <h2 className="font-black text-gray-800 mb-4">🌟 Từ đã thành thạo ({masteredWords} từ)</h2>
          {masteredWords === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Bé chưa có từ nào đạt 2+ sao. Hãy luyện tập nhé! 💪</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(progress.wordProgress)
                .filter(([, v]) => v.stars >= 2)
                .map(([key, v]) => (
                  <span key={key} className="bg-violet-50 border border-violet-200 text-violet-700 font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                    {v.wordId} {v.stars >= 3 ? '⭐⭐⭐' : '⭐⭐'}
                  </span>
                ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
