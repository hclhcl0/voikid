'use client';
import Link from 'next/link';
import { PronunciationOptions } from '@/components/settings/PronunciationOptions';
import { ApiKeyOptions } from '@/components/settings/ApiKeyOptions';
import { MediaOptions } from '@/components/settings/MediaOptions';
import SettingsPanel from '@/components/settings/SettingsPanel';
import { useEffect, useState } from 'react';
import type { ContentStore } from '@/lib/backend/types';
const field = 'min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2';
const button = 'learning-button border border-slate-200 bg-white text-sm hover:bg-slate-50';
export default function BackendPage() {
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
  if (loading) return <p className="p-8" role="status">Đang mở quản trị…</p>;
  if (!authenticated) return <main className="min-h-screen bg-slate-50 px-4 py-16"><form className="mx-auto max-w-sm space-y-5 rounded-2xl border bg-white p-6" onSubmit={e => { e.preventDefault(); if(configured) void login(); }}><Link href="/" className="text-sm text-slate-500">← VocaKids</Link><h1 className="text-2xl font-bold">Quản trị ứng dụng</h1><p className="text-sm text-slate-600">Đăng nhập để quản lý học liệu và cài đặt chung.</p>{configured && <><label className="block text-sm font-bold">Mật khẩu quản trị<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className={`${field} mt-2`} /></label><button disabled={busy} className="learning-button w-full bg-orange-600 text-white">{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}</button></>}<p role="status" className="text-sm text-orange-800">{message}</p></form></main>;
  return <main className="min-h-screen bg-slate-50 p-4 text-slate-800 sm:p-8"><div className="mx-auto max-w-5xl space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><Link href="/" className="text-sm text-slate-500">← Về ứng dụng</Link><h1 className="mt-2 text-2xl font-bold">Quản trị ứng dụng</h1><p className="mt-1 text-sm text-slate-500">Cài đặt chung và quản lý nội dung.</p></div><div className="flex flex-wrap gap-2"><button className={button} onClick={exportData}>Xuất bản sao JSON</button><button className={button} disabled={busy} onClick={async () => { if (dirty && !window.confirm('Có thay đổi chưa lưu. Đăng xuất và bỏ các thay đổi này?')) return; const response = await fetch('/api/admin/session', { method: 'DELETE' }); if (response.ok) { setAuthenticated(false); setData(null); setDirty(false); window.dispatchEvent(new Event('vocakids:admin-session-changed')); } }}>Đăng xuất</button><button disabled={busy || !dirty} className="learning-button bg-orange-600 text-white disabled:opacity-50" onClick={() => void save()}>{busy ? 'Đang lưu…' : dirty ? 'Lưu thay đổi' : 'Đã lưu'}</button></div></header>
    <p role="status" className="text-sm text-orange-800">{message || `Phiên bản ${data?.revision} · ${data?.categories.length} chủ đề · ${data?.categories.reduce((sum, c) => sum + c.words.length, 0)} từ`}</p>
    {data && <MediaOptions />}
    {data && <div className="space-y-6"><section className="space-y-5 rounded-2xl border bg-white p-6"><h2 className="text-lg font-bold">Cài đặt ứng dụng</h2>{(['appName','welcomeText','dailyGoal'] as const).map(key => <label key={key} className="block text-sm font-bold">{{ appName: 'Tên ứng dụng', welcomeText: 'Lời chào trang chủ', dailyGoal: 'Mục tiêu từ mỗi ngày' }[key]}<input className={`${field} mt-2`} type={key === 'dailyGoal' ? 'number' : 'text'} min={1} max={50} value={data.settings[key]} onChange={e => { setData({ ...data, settings: { ...data.settings, [key]: key === 'dailyGoal' ? Number(e.target.value) : e.target.value } }); setDirty(true); }} /></label>)}<label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={data.settings.showGames} onChange={e => { setData({ ...data, settings: { ...data.settings, showGames: e.target.checked } }); setDirty(true); }} />Hiện trò chơi Tìm từ trên trang chủ</label><p className="text-sm text-slate-500">Các mục ở đây lưu chung trên server. Phần bên dưới quản lý hồ sơ, PIN phụ huynh và cấu hình trên thiết bị này.</p></section><div className="rounded-xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-600">Cài đặt thiết bị: API key ở phần này lưu trong trình duyệt hiện tại.</div><PronunciationOptions value={data.settings.pronunciation} onChange={pronunciation => { setData({ ...data, settings: { ...data.settings, pronunciation } }); setDirty(true); }} /><ApiKeyOptions /><SettingsPanel embedded /></div>}
  </div></main>;
}

