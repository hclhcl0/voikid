'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useProfileContext } from '@/context/ProfileContext';
import { useAdminContext } from '@/context/AdminContext';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  isSupabaseConfigured,
  testSupabaseConnection,
} from '@/lib/supabase';
import { syncAllLocalToCloud } from '@/lib/supabaseSync';

// ── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ hasKey }: { hasKey: boolean }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${
      hasKey
        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
        : 'bg-amber-100 text-amber-700 border border-amber-300'
    }`}>
      <span className={`w-2 h-2 rounded-full ${hasKey ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
      {hasKey ? 'Đã cài đặt ✓' : 'Chưa có API Key'}
    </div>
  );
}

// ── Main Settings Page ──────────────────────────────────────────────────────
export default function SettingsPage() {
  const router = useRouter();
  const { apiKey, maskedKey, hasKey, hydrated, saveApiKey } = useSettings();
  const {
    profiles,
    activeProfileId,
    setActiveProfileId,
    openProfileModal,
    getProfileStars,
  } = useProfileContext();

  const [input,     setInput]     = useState('');
  const [showKey,   setShowKey]   = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [testing,   setTesting]   = useState(false);
  const [testResult, setTestResult] = useState<'ok' | 'fail' | null>(null);
  const [testError,  setTestError]  = useState<string>('');
  const [deleted,   setDeleted]   = useState(false);

  // ── Supabase Cloud Database States ──
  const [sbUrl, setSbUrl] = useState('');
  const [sbKey, setSbKey] = useState('');
  const [showSbKey, setShowSbKey] = useState(false);
  const [sbTesting, setSbTesting] = useState(false);
  const [sbSyncing, setSbSyncing] = useState(false);
  const [sbStatus, setSbStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [isSbConnected, setIsSbConnected] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  useEffect(() => {
    const cfg = getSupabaseConfig();
    setSbUrl(cfg.url);
    setSbKey(cfg.anonKey);
    setIsSbConnected(isSupabaseConfigured());
  }, []);

  const handleSaveSupabase = async () => {
    const url = sbUrl.trim();
    const key = sbKey.trim();
    if (!url || !key) {
      setSbStatus({ type: 'err', text: 'Vui lòng nhập cả Supabase URL và Anon Key!' });
      return;
    }

    setSbTesting(true);
    setSbStatus(null);
    saveSupabaseConfig(url, key);

    const testRes = await testSupabaseConnection(url, key);
    setSbTesting(false);

    if (testRes.success) {
      setIsSbConnected(true);
      setSbStatus({ type: 'ok', text: testRes.message });
    } else {
      setIsSbConnected(false);
      setSbStatus({ type: 'err', text: testRes.message });
    }
  };

  const handleSyncAllToCloud = async () => {
    setSbSyncing(true);
    setSbStatus(null);
    const res = await syncAllLocalToCloud();
    setSbSyncing(false);
    if (res.success) {
      setSbStatus({ type: 'ok', text: res.message });
    } else {
      setSbStatus({ type: 'err', text: res.message });
    }
  };

  const handleCopySchema = () => {
    const schemaSql = `-- VocaKids Database Schema
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '🐰',
  grade_id TEXT NOT NULL DEFAULT 'lop1',
  color TEXT NOT NULL DEFAULT 'from-orange-400 to-amber-500',
  code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.user_progress (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  cat_id TEXT NOT NULL,
  word_id TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  best_score INTEGER NOT NULL DEFAULT 0,
  last_practiced TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.user_stickers (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  sticker_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.user_daily_stats (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  date TEXT NOT NULL,
  words_studied INTEGER NOT NULL DEFAULT 0,
  total_stars INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.custom_categories (
  id TEXT PRIMARY KEY,
  name_vi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '📚',
  grade_id TEXT NOT NULL DEFAULT 'custom',
  words JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public user_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public user_progress" ON public.user_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public user_stickers" ON public.user_stickers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public user_daily_stats" ON public.user_daily_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public custom_categories" ON public.custom_categories FOR ALL USING (true) WITH CHECK (true);`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(schemaSql);
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 3000);
    }
  };

  const handleSave = () => {
    const key = input.trim();
    if (!key) return;
    saveApiKey(key);
    setInput('');
    setSaved(true);
    setTestResult(null);
    setTestError('');
    setDeleted(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = () => {
    saveApiKey('');
    setInput('');
    setTestResult(null);
    setTestError('');
    setDeleted(true);
    setTimeout(() => setDeleted(false), 3000);
  };

  const handleTest = async () => {
    const raw = input.trim() || apiKey;
    const match = raw.match(/(AQ\.[A-Za-z0-9_-]+|AIza[A-Za-z0-9_-]+)/);
    const keyToTest = match ? match[1] : raw;
    setTesting(true);
    setTestResult(null);
    setTestError('');
    try {
      const res = await fetch('/api/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyToTest }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setTestResult('ok');
        setTestError(data.fromEnv ? 'Đang dùng API Key từ biến môi trường máy chủ.' : '');
      } else {
        setTestResult('fail');
        setTestError(data.details || data.error || 'Không kết nối được tới Google Gemini.');
      }
    } catch (e) {
      setTestResult('fail');
      setTestError(String(e));
    } finally {
      setTesting(false);
    }
  };

  const {
    isAdmin,
    openAdminModal,
    logoutAdmin,
    changePin,
    resetPinToDefault,
    hasCustomPin,
  } = useAdminContext();

  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinStatus, setPinStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = changePin(oldPin, newPin);
    if (res.success) {
      setPinStatus({ type: 'ok', text: res.message });
      setOldPin('');
      setNewPin('');
      setTimeout(() => setPinStatus(null), 3000);
    } else {
      setPinStatus({ type: 'err', text: res.message });
    }
  };

  const handleResetPin = () => {
    if (confirm('Đặt lại mã PIN Admin về mặc định (1234)?')) {
      resetPinToDefault();
      setPinStatus({ type: 'ok', text: 'Đã đặt lại mã PIN về mặc định (1234)!' });
      setTimeout(() => setPinStatus(null), 3000);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border-2 border-violet-100 space-y-5"
        >
          <div className="w-16 h-16 rounded-3xl bg-violet-100 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🔒
          </div>
          <div>
            <h2 className="font-black text-xl text-gray-800">Khu Vực Quản Trị Viên</h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Cài đặt hệ thống, API Key và cấu hình chỉ dành cho Phụ huynh & Quản trị viên.
            </p>
          </div>
          <button
            onClick={() => openAdminModal()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
          >
            🔑 Mở Khóa Quyền Admin
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur sticky top-0 z-50 border-b border-violet-100 px-4 py-3 flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center font-bold text-violet-600 hover:bg-violet-100 transition-colors"
            title="Quay lại"
          >←</button>
          <Link
            href="/"
            className="w-9 h-9 rounded-xl bg-orange-100/80 text-orange-600 hover:bg-orange-200/80 flex items-center justify-center font-bold text-base transition-colors shadow-xs"
            title="Về trang chủ"
          >🏠</Link>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-xl text-gray-800 flex items-center gap-2">
            <span>⚙️ Cài Đặt</span>
            <span className="text-[11px] font-black bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
              👑 Admin
            </span>
          </h1>
        </div>
        <button
          onClick={logoutAdmin}
          className="text-xs font-bold text-gray-400 hover:text-rose-600 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-rose-50 transition-colors cursor-pointer"
          title="Khóa quyền quản trị viên"
        >
          <span>🔒</span>
          <span>Khóa</span>
        </button>
        {hydrated && <StatusBadge hasKey={hasKey} />}
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 pb-24 space-y-5">

        {/* ── Quản Lý Mã PIN Admin ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 shadow border border-violet-100"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-2xl">🔐</span>
            <div>
              <h2 className="font-black text-base text-gray-800">Mã PIN Admin / Phụ Huynh</h2>
              <p className="text-xs text-gray-500 font-semibold">Bảo vệ cài đặt để tránh các bé vô tình sửa đổi</p>
            </div>
          </div>

          {pinStatus && (
            <div
              className={`p-3 rounded-2xl text-xs font-bold mb-3 ${
                pinStatus.type === 'ok'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {pinStatus.text}
            </div>
          )}

          <form onSubmit={handleChangePin} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-black text-gray-600 mb-1">Mã PIN cũ:</label>
                <input
                  type="password"
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  placeholder="Mã hiện tại"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold focus:border-violet-500 focus:outline-hidden"
                  maxLength={8}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-600 mb-1">Mã PIN mới (4-8 số):</label>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Mã mới"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold focus:border-violet-500 focus:outline-hidden"
                  maxLength={8}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              {hasCustomPin ? (
                <button
                  type="button"
                  onClick={handleResetPin}
                  className="text-[11px] text-gray-400 hover:text-rose-500 font-bold"
                >
                  🔄 Đặt lại về mặc định (1234)
                </button>
              ) : (
                <span className="text-[11px] text-gray-400">
                  Mã mặc định: <code className="text-violet-600 font-bold">1234</code>
                </span>
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
              >
                Đổi mã PIN
              </button>
            </div>
          </form>
        </motion.div>

        {/* ── Quản lý hồ sơ các bé ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 shadow border border-violet-100"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">👨‍👩‍👧</span>
              <div>
                <h2 className="font-black text-base text-gray-800">Tài Khoản Các Bé</h2>
                <p className="text-xs text-gray-500 font-semibold">Quản lý nhiều bé trên cùng thiết bị</p>
              </div>
            </div>
            <button
              onClick={openProfileModal}
              className="px-3 py-1.5 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 font-black text-xs transition-colors cursor-pointer"
            >
              Cài đặt ⚙️
            </button>
          </div>

          <div className="space-y-2 mt-3">
            {profiles.map((p) => {
              const isActive = p.id === activeProfileId;
              const stars = getProfileStars(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => setActiveProfileId(p.id)}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    isActive ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300/40' : 'bg-gray-50/70 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.avatar}</span>
                    <div>
                      <p className="font-black text-sm text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-400 font-semibold">⭐ {stars} sao</p>
                    </div>
                  </div>
                  {isActive ? (
                    <span className="text-xs bg-amber-500 text-white font-black px-2.5 py-1 rounded-full">
                      Đang học ✓
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 font-bold hover:text-orange-600">
                      Chọn bé này →
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={openProfileModal}
            className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>+</span> Thêm tài khoản bé mới
          </button>
        </motion.div>

        {/* ── Hero card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl"
        >
          <div className="text-4xl mb-3">🤖</div>
          <h2 className="font-black text-xl mb-1">Gemini API Key</h2>
          <p className="text-white/80 text-sm leading-relaxed">
            App sử dụng <strong>Google Gemini AI</strong> để chấm điểm phát âm của bé.
            Nhập API Key miễn phí để kích hoạt tính năng này.
          </p>
        </motion.div>

        {/* ── Hướng dẫn lấy key ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-5 shadow border border-violet-100"
        >
          <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-xs flex items-center justify-center font-black">?</span>
            Cách lấy Gemini API Key miễn phí
          </h3>
          <ol className="space-y-3">
            {[
              { step: '1', icon: '🌐', text: 'Truy cập', link: { label: 'aistudio.google.com', href: 'https://aistudio.google.com/app/apikey' } },
              { step: '2', icon: '🔑', text: 'Nhấn "Get API key" → "Create API key"', link: null },
              { step: '3', icon: '📋', text: 'Copy key (dạng AIzaSy...)', link: null },
              { step: '4', icon: '✅', text: 'Dán vào ô bên dưới và nhấn Lưu', link: null },
            ].map((item) => (
              <li key={item.step} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-black flex-shrink-0 mt-0.5">
                  {item.step}
                </span>
                <span className="text-sm text-gray-600">
                  {item.icon} {item.text}
                  {item.link && (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-violet-600 font-bold underline underline-offset-2"
                    >
                      {item.link.label} ↗
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex gap-2">
            <span className="text-lg">🎁</span>
            <p className="text-xs text-emerald-700 font-semibold">
              <strong>Hoàn toàn miễn phí!</strong> Google cung cấp quota miễn phí 1,500 request/ngày,
              đủ cho bé luyện tập hàng ngàn từ mỗi tháng.
            </p>
          </div>
        </motion.div>

        {/* ── Input key ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-5 shadow border border-violet-100"
        >
          <h3 className="font-black text-gray-800 mb-4">🔑 Nhập API Key</h3>

          {/* Current key display */}
          {hydrated && hasKey && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-emerald-600 mb-0.5">Key hiện tại</p>
                <p className="font-mono text-sm text-gray-700 truncate">
                  {showKey ? apiKey : maskedKey}
                </p>
              </div>
              <button
                onClick={() => setShowKey((v) => !v)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                {showKey ? '🙈 Ẩn' : '👁 Xem'}
              </button>
            </div>
          )}

          {/* Input field */}
          <div className="relative mb-3">
            <input
              type={showKey ? 'text' : 'password'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="AIzaSy... (dán API key vào đây)"
              className="w-full rounded-2xl border-2 border-gray-200 focus:border-violet-400 focus:outline-none px-4 py-3.5 font-mono text-sm bg-gray-50 focus:bg-white transition-all pr-20"
            />
            {input && (
              <button
                onClick={() => setInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              >✕ Xóa</button>
            )}
          </div>

          {/* Buttons row */}
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={!input.trim()}
              className="flex-1 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              💾 Lưu Key
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleTest}
              disabled={testing || (!input.trim() && !hasKey)}
              className="px-4 py-3 rounded-2xl font-bold text-sm bg-violet-50 text-violet-600 border-2 border-violet-200 hover:bg-violet-100 disabled:opacity-40 transition-colors"
            >
              {testing ? '⏳' : '🧪 Test'}
            </motion.button>
          </div>

          {/* Feedback messages */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center gap-2"
              >
                <span className="text-lg">🎉</span>
                <p className="text-sm font-bold text-emerald-700">API Key đã được lưu thành công!</p>
              </motion.div>
            )}
            {deleted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 bg-gray-50 border border-gray-200 rounded-2xl p-3 flex items-center gap-2"
              >
                <span className="text-lg">🗑️</span>
                <p className="text-sm font-bold text-gray-600">Đã xóa API Key.</p>
              </motion.div>
            )}
            {testResult === 'ok' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center gap-2"
              >
                <span className="text-lg">✅</span>
                <div>
                  <p className="text-sm font-bold text-emerald-700">API Key hợp lệ! Sẵn sàng sử dụng.</p>
                  {testError && <p className="text-xs text-emerald-600 mt-0.5">{testError}</p>}
                </div>
              </motion.div>
            )}
            {testResult === 'fail' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 bg-rose-50 border border-rose-300 rounded-2xl p-3 flex items-start gap-2"
              >
                <span className="text-lg mt-0.5">❌</span>
                <div>
                  <p className="text-sm font-bold text-rose-700">Kiểm tra không thành công</p>
                  <p className="text-xs text-rose-600 mt-0.5 break-all">{testError || 'Key không hợp lệ hoặc hết quota. Kiểm tra lại tại aistudio.google.com'}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delete existing key */}
          {hydrated && hasKey && (
            <button
              onClick={handleDelete}
              className="mt-3 w-full text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors py-2"
            >
              🗑️ Xóa API Key hiện tại
            </button>
          )}
        </motion.div>

        {/* ── Supabase Cloud Database ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-3xl p-5 shadow border border-emerald-100 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-black text-gray-800 text-base flex items-center gap-2">
                  Cơ sở dữ liệu Supabase Cloud
                </h3>
                <p className="text-xs text-gray-500 font-medium">Đồng bộ hồ sơ, sao & sticker đa thiết bị (PostgreSQL)</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
              isSbConnected ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-gray-100 text-gray-500'
            }`}>
              {isSbConnected ? '🟢 Đã kết nối' : '⚪ Chưa kết nối'}
            </span>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-3 mb-4 text-xs text-emerald-800 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <span>💡</span> Đồng bộ dữ liệu mọi lúc, mọi nơi:
            </p>
            <p className="text-emerald-700 leading-relaxed">
              Dùng <strong>Supabase (PostgreSQL Cloud)</strong> miễn phí để bé học trên điện thoại hay máy tính đều giữ nguyên điểm số, sticker và từ vựng! Nếu chưa cài, hệ thống vẫn tự lưu trên máy (Offline-first).
            </p>
          </div>

          {/* Setup Guide Steps */}
          <div className="bg-gray-50 rounded-2xl p-3.5 mb-4 border border-gray-100 text-xs text-gray-600 space-y-2">
            <div className="font-bold text-gray-700 flex items-center justify-between">
              <span>🚀 3 bước cài đặt nhanh:</span>
              <button
                type="button"
                onClick={handleCopySchema}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all text-xs flex items-center gap-1 ${
                  copiedSchema
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                {copiedSchema ? '✓ Đã sao chép SQL!' : '📋 Copy mã SQL Schema'}
              </button>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-gray-600">
              <li>Đăng ký/đăng nhập <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold underline">supabase.com ↗</a> tạo New Project.</li>
              <li>Mở menu <strong>SQL Editor</strong>, bấm nút <em>"Copy mã SQL Schema"</em> ở trên rồi dán vào nhấn <strong>Run</strong>.</li>
              <li>Vào <strong>Project Settings → API</strong>, copy <strong>Project URL</strong> và <strong>anon key</strong> dán vào 2 ô dưới:</li>
            </ol>
          </div>

          {/* Form fields */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={sbUrl}
                onChange={(e) => setSbUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full rounded-2xl border-2 border-gray-200 focus:border-emerald-400 focus:outline-none px-4 py-2.5 font-mono text-xs bg-gray-50 focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-600">
                  Supabase Anon Public Key
                </label>
                <button
                  type="button"
                  onClick={() => setShowSbKey((v) => !v)}
                  className="text-[11px] font-bold text-gray-400 hover:text-gray-600"
                >
                  {showSbKey ? '🙈 Ẩn' : '👁 Xem'}
                </button>
              </div>
              <input
                type={showSbKey ? 'text' : 'password'}
                value={sbKey}
                onChange={(e) => setSbKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full rounded-2xl border-2 border-gray-200 focus:border-emerald-400 focus:outline-none px-4 py-2.5 font-mono text-xs bg-gray-50 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleSaveSupabase}
              disabled={sbTesting}
              className="flex-1 py-3 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
            >
              {sbTesting ? (
                <>
                  <span className="animate-spin inline-block">⏳</span> Đang kiểm tra...
                </>
              ) : (
                <>
                  <span>💾</span> Lưu & Thử kết nối
                </>
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleSyncAllToCloud}
              disabled={sbSyncing || !isSbConnected}
              className="py-3 px-4 rounded-2xl font-bold text-sm bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-100 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
            >
              {sbSyncing ? (
                <>
                  <span className="animate-spin inline-block">🔄</span> Đang đồng bộ...
                </>
              ) : (
                <>
                  <span>☁️</span> Đẩy dữ liệu máy lên Cloud
                </>
              )}
            </motion.button>
          </div>

          {/* Status alerts */}
          <AnimatePresence>
            {sbStatus && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-3 p-3 rounded-2xl border flex items-start gap-2 text-xs font-semibold ${
                  sbStatus.type === 'ok'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-rose-50 border-rose-300 text-rose-800'
                }`}
              >
                <span className="text-base">{sbStatus.type === 'ok' ? '🎉' : '⚠️'}</span>
                <p className="mt-0.5">{sbStatus.text}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Security note ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border border-blue-200 rounded-3xl p-5"
        >
          <h3 className="font-black text-blue-800 mb-2 flex items-center gap-2">
            <span>🔒</span> Bảo mật
          </h3>
          <ul className="space-y-2 text-xs text-blue-700 font-semibold">
            <li>• API Key được lưu <strong>trên thiết bị của bạn</strong> (localStorage), không gửi lên server nào khác.</li>
            <li>• Chỉ dùng để gọi Gemini API khi bé luyện phát âm.</li>
            <li>• Bạn có thể xóa key bất cứ lúc nào bằng nút "Xóa API Key".</li>
            <li>• Không chia sẻ API Key với người khác để tránh hết quota.</li>
          </ul>
        </motion.div>

        {/* ── Vocabulary & Backup link ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-gray-800 text-sm flex items-center gap-1.5">
                <span>📚</span> Quản lý kho từ vựng
              </h3>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                Sửa từ, xóa chủ đề, xuất & nhập file JSON sao lưu
              </p>
            </div>
            <button
              onClick={() => router.push('/manage')}
              className="px-3.5 py-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md transition-colors"
            >
              Mở →
            </button>
          </div>
        </motion.div>

        {/* ── Back button ── */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/')}
          className="w-full py-4 rounded-3xl font-black text-gray-600 border-2 border-gray-200 bg-white hover:border-violet-300 hover:text-violet-600 transition-colors"
        >
          🏠 Về trang chủ
        </motion.button>

      </div>
    </div>
  );
}
