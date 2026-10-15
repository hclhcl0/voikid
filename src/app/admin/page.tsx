'use client';
import { AppPageHeader } from '@/components/ui/AppPageHeader';
import Link from 'next/link';
import { PronunciationOptions } from '@/components/settings/PronunciationOptions';
import { ApiKeyOptions } from '@/components/settings/ApiKeyOptions';
import { MediaOptions } from '@/components/settings/MediaOptions';
import { AdminParentsManager } from '@/components/admin/AdminParentsManager';
import { ParentAiOptions } from '@/components/settings/ParentAiOptions';
import SettingsPanel from '@/components/settings/SettingsPanel';
import { useEffect, useState } from 'react';
import type { ContentStore } from '@/lib/backend/types';

type AdminTab = 'parents' | 'app' | 'media' | 'system';

const TABS: { id: AdminTab; label: string; icon: string }[] = [
  { id: 'parents', label: 'Phụ Huynh & Học Sinh', icon: '👨‍👩‍👧' },
  { id: 'app', label: 'Cài Đặt Ứng Dụng', icon: '⚙️' },
  { id: 'media', label: 'Giọng Đọc & Audio', icon: '🎙️' },
  { id: 'system', label: 'AI & Thiết Bị', icon: '🤖' },
];

const field = 'min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2';
const button = 'ui-button ui-button-secondary text-sm hover:bg-slate-50';
export default function BackendPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('parents');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [password, setPassword] = useState('');
  const [data, setData] = useState<ContentStore | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    fetch('/api/admin/session').then(r => r.json()).then(async session => {
      setConfigured(session.configured === true);
      if (!session.configured) setMessage('Server chưa có mật khẩu admin. Đặt VOCAKIDS_ADMIN_PASSWORD trong biến môi trường runtime rồi khởi động lại ứng dụng.');
      if (session.authenticated) {
        const response = await fetch('/api/admin/content');
        if (response.ok) { setData(await response.json()); setAuthenticated(true); }
      }
    }).catch(() => setMessage('Không kết nối được server.')).finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  async function login() {
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      const content = await fetch('/api/admin/content');
      if (!content.ok) throw new Error('Không tải được dữ liệu.');
      setData(await content.json()); setAuthenticated(true); setPassword('');
      window.dispatchEvent(new Event('vocakids:admin-session-changed'));
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Đăng nhập thất bại.'); }
    finally { setBusy(false); }
  }
  async function save() {
    if (!data) return;
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setData(result); setDirty(false); setMessage('Đã lưu trên server. Các trang học nhận dữ liệu mới khi mở lại.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Không lưu được.'); }
    finally { setBusy(false); }
  }
  function exportData() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'vocakids-content.json'; link.click(); URL.revokeObjectURL(url);
  }
  const [email, setEmail] = useState('admin@vocakids.com');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, action: 'login' }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Đăng nhập không thành công.');

      // Check if session is admin
      const sessionRes = await fetch('/api/admin/session');
      const sessionData = await sessionRes.json();
      if (sessionData.authenticated) {
        const content = await fetch('/api/admin/content');
        if (content.ok) setData(await content.json());
        setAuthenticated(true);
        setPassword('');
        window.dispatchEvent(new Event('vocakids:admin-session-changed'));
      } else {
        setMessage('Tài khoản này chỉ có quyền Phụ huynh, không có quyền Quản trị viên hệ thống.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Đăng nhập thất bại.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4"><p className="text-sm font-bold text-slate-500 animate-pulse" role="status">Đang mở khu vực quản trị…</p></div>;
  if (!authenticated) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 pb-28 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border-2 border-orange-200 overflow-hidden">
          <div className="bg-orange-500 p-6 text-white text-center relative">
            <Link href="/" className="absolute top-4 left-4 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all">
              ← Về trang chủ
            </Link>
            <div className="text-4xl mb-2">⚙️</div>
            <h1 className="text-xl font-black">Quản Trị Hệ Thống</h1>
            <p className="text-xs text-white/90 mt-1">Đăng nhập tài khoản quản trị</p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                Email / Tài khoản
              </label>
              <input
                type="text"
                required
                placeholder="admin@vocakids.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`${field} text-sm font-bold border-2 focus:border-orange-500 focus:outline-hidden`}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`${field} text-sm font-bold border-2 focus:border-orange-500 focus:outline-hidden`}
              />
            </div>

            <button
              disabled={busy}
              className="learning-button w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-3.5 rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {busy ? 'Đang đăng nhập…' : 'Đăng Nhập Quản Trị 🚀'}
            </button>

            {message && (
              <div role="status" className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-orange-800 text-center">
                {message}
              </div>
            )}

            <div className="text-center pt-2 text-xs text-slate-400">
              🔒 Khu vực quản trị bảo mật của hệ thống VocaKids
            </div>
          </form>
        </div>
      </main>
    );
  }


  return <main className="min-h-screen bg-slate-50 p-4 pb-28 text-slate-800 sm:p-8 sm:pb-28"><div className="mx-auto max-w-5xl space-y-6">
    <AppPageHeader title="Quản trị ứng dụng" description="Quản lý học liệu, tài khoản và cài đặt chung." profile={false} actions={<>
<button className={button} onClick={exportData}>Xuất bản sao JSON</button>
<button className={button} disabled={busy} onClick={async () => { if (dirty && !window.confirm('Có thay đổi chưa lưu. Đăng xuất và bỏ các thay đổi này?')) return; const response = await fetch('/api/admin/session', { method: 'DELETE' }); if (response.ok) { setAuthenticated(false); setData(null); setDirty(false); window.dispatchEvent(new Event('vocakids:admin-session-changed')); } }}>Đăng xuất</button>
<button disabled={busy || !dirty} className="ui-button ui-button-primary disabled:opacity-50" onClick={() => void save()}>{busy ? 'Đang lưu…' : dirty ? 'Lưu thay đổi' : 'Đã lưu'}</button>
</>}/>
    <p role="status" className="text-sm font-bold text-orange-800">{message || `Phiên bản ${data?.revision} · ${data?.categories.length} chủ đề · ${data?.categories.reduce((sum, c) => sum + c.words.length, 0)} từ`}</p>

    {/* Tab Navigation */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={isActive}
            className={`py-3 px-2 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs font-black ${
              isActive
                ? 'bg-violet-50 text-violet-800 border border-violet-200'
                : 'bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-center leading-snug">{tab.label}</span>
          </button>
        );
      })}
    </div>

    {/* Tab Panels */}
    {data && (
      <div>
        {/* TAB 1: Phụ huynh & Học sinh */}
        {activeTab === 'parents' && <AdminParentsManager />}

        {/* TAB 2: Cài đặt ứng dụng */}
        {activeTab === 'app' && (
          <section className="space-y-5 rounded-2xl border bg-white p-6 shadow-xs">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>⚙️</span>
                <span>Cài Đặt Ứng Dụng & Học Liệu</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tùy chỉnh tên app, lời chào, số lượng từ mới mỗi ngày và nguồn bài học.
              </p>
            </div>

            {(['appName', 'welcomeText', 'dailyGoal'] as const).map((key) => (
              <label key={key} className="block text-sm font-bold">
                {{ appName: 'Tên ứng dụng', welcomeText: 'Lời chào trang chủ', dailyGoal: 'Mục tiêu từ mỗi ngày' }[key]}
                <input
                  className={`${field} mt-2`}
                  type={key === 'dailyGoal' ? 'number' : 'text'}
                  min={1}
                  max={50}
                  value={data.settings[key]}
                  onChange={(e) => {
                    setData({
                      ...data,
                      settings: {
                        ...data.settings,
                        [key]: key === 'dailyGoal' ? Number(e.target.value) : e.target.value,
                      },
                    });
                    setDirty(true);
                  }}
                />
              </label>
            ))}

            <label className="block text-sm font-bold">
              Số từ mới mỗi ngày (Học từ & Luyện nói)
              <input
                className={`${field} mt-2`}
                type="number"
                min={1}
                max={20}
                value={data.settings.dailyNewWordsCount ?? 1}
                onChange={(e) => {
                  setData({
                    ...data,
                    settings: {
                      ...data.settings,
                      dailyNewWordsCount: Math.max(1, Math.min(20, Number(e.target.value) || 1)),
                    },
                  });
                  setDirty(true);
                }}
              />
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Số lượng từ mới được chọn mỗi ngày cho học sinh học qua Flashcard và luyện nói AI (1–20 từ, mặc định: 1).
              </span>
            </label>

            <label className="block text-sm font-bold">
              Nguồn từ mới mỗi ngày
              <select
                className={`${field} mt-2`}
                value={data.settings.dailyNewWordsSource ?? 'curriculum'}
                onChange={(e) => {
                  setData({
                    ...data,
                    settings: {
                      ...data.settings,
                      dailyNewWordsSource: e.target.value as 'curriculum' | 'shop' | 'all',
                    },
                  });
                  setDirty(true);
                }}
              >
                <option value="curriculum">📚 Bài học SGK theo khối lớp (Mặc định)</option>
                <option value="shop">🏪 Trò chơi Cửa hàng (500 từ mua sắm & đời sống)</option>
                <option value="all">🌟 Kết hợp cả hai (SGK + Trò chơi Cửa hàng)</option>
              </select>
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Chọn kho từ vựng dùng để tuyển chọn từ mới mỗi ngày cho học sinh.
              </span>
            </label>

            <label className="flex min-h-11 items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={data.settings.showGames}
                onChange={(e) => {
                  setData({ ...data, settings: { ...data.settings, showGames: e.target.checked } });
                  setDirty(true);
                }}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm font-bold text-slate-800">Hiện trò chơi Tìm từ trên trang chủ</span>
            </label>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                disabled={busy || !dirty}
                onClick={() => void save()}
                className="learning-button bg-orange-600 hover:bg-orange-700 text-white font-black py-2.5 px-5 rounded-xl disabled:opacity-50 transition-all cursor-pointer shadow-xs"
              >
                {busy ? 'Đang lưu…' : dirty ? 'Lưu thay đổi cài đặt' : '✓ Đã lưu'}
              </button>
            </div>
          </section>
        )}

        {/* TAB 3: Giọng đọc & Audio */}
        {activeTab === 'media' && <MediaOptions />}

        {/* TAB 4: AI & Thiết bị */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <ParentAiOptions value={data.settings.parentAi} onChange={parentAi=>{setData({...data,settings:{...data.settings,parentAi}});setDirty(true);}}/>
            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 text-xs font-semibold text-slate-600">
              💡 Cài đặt thiết bị: API key và cấu hình phát âm ở phần này được lưu trong trình duyệt hiện tại.
            </div>
            <PronunciationOptions
              value={data.settings.pronunciation}
              onChange={(pronunciation) => {
                setData({ ...data, settings: { ...data.settings, pronunciation } });
                setDirty(true);
              }}
            />
            <ApiKeyOptions />
            <SettingsPanel embedded />
          </div>
        )}
      </div>
    )}
  </div></main>;
}

