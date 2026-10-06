'use client';
import { useEffect, useState } from 'react';
interface KeyRow { id: string; name: string; project: string; enabled: boolean; masked?: string; secret?: string; usage?: { uses:number; successes:number; failures:number; blocked:boolean; retryAt:number|null; lastError:string|null } }
interface Config { revision:number; mode:'priority'|'round_robin'; maxAttempts:number; cooldownSeconds:number; keys:KeyRow[] }
const input = 'mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3';
const button = 'learning-button border border-slate-200 bg-white text-sm disabled:opacity-40';
export function ApiKeyOptions() {
  const [config,setConfig]=useState<Config|null>(null);
  const [dirty,setDirty]=useState(false);
  const [busy,setBusy]=useState(true);
  const [message,setMessage]=useState('');
  async function reload() {
    setBusy(true);
    try { const r=await fetch('/api/admin/api-keys',{cache:'no-store'}); const d=await r.json(); if(!r.ok) throw new Error(d.message); setConfig(d); setDirty(false); }
    catch(e) { setMessage(e instanceof Error?e.message:'Không tải được danh sách key.'); }
    finally { setBusy(false); }
  }
  useEffect(()=>{
    const controller=new AbortController();
    fetch('/api/admin/api-keys',{cache:'no-store',signal:controller.signal}).then(async r=>{
      const data=await r.json();
      if(!r.ok) throw new Error(data.message);
      if(!controller.signal.aborted) setConfig(data);
    }).catch(e=>{if(!controller.signal.aborted) setMessage(e instanceof Error?e.message:'Không tải được danh sách key.');}).finally(()=>{if(!controller.signal.aborted) setBusy(false);});
    return ()=>controller.abort();
  },[]);
  useEffect(()=>{ if(!dirty) return; const warn=(e:BeforeUnloadEvent)=>e.preventDefault(); window.addEventListener('beforeunload',warn); return ()=>window.removeEventListener('beforeunload',warn); },[dirty]);
  function update(next:Config) { setConfig(next); setDirty(true); setMessage(''); }
  function edit(index:number,values:Partial<KeyRow>) { if(config) update({...config,keys:config.keys.map((k,i)=>i===index?{...k,...values}:k)}); }
  function move(index:number,offset:number) { if(!config) return; const keys=[...config.keys]; [keys[index],keys[index+offset]]=[keys[index+offset],keys[index]]; update({...config,keys}); }
  async function save() {
    if(!config) return;
    setBusy(true); setMessage('');
    try {
      const r=await fetch('/api/admin/api-keys',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...config,keys:config.keys.map(({id,name,project,enabled,secret})=>({id,name,project,enabled,secret}))})});
      const d=await r.json(); if(!r.ok) throw new Error(d.message);
      setConfig(d); setDirty(false); setMessage('Đã lưu danh sách key trên server. Áp dụng ngay cho lượt chấm mới.');
    } catch(e) { setMessage(e instanceof Error?e.message:'Không lưu được key.'); }
    finally { setBusy(false); }
  }
  async function test(id:string) {
    setBusy(true); setMessage('Đang kiểm tra kết nối…');
    try { const r=await fetch('/api/admin/api-keys',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); const d=await r.json(); setMessage(d.message); if(r.ok) setConfig(d.data); }
    catch { setMessage('Không kết nối được server.'); }
    finally { setBusy(false); }
  }
  return <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">API key cho AI</h2><p className="mt-1 text-sm text-slate-500">Dùng cho chấm phát âm và tạo bài đọc. Key lưu riêng trên server; lưu danh sách bằng nút bên dưới.</p></div><button className={button} disabled={busy} onClick={()=>{if(!dirty||window.confirm('Tải lại và bỏ thay đổi danh sách key chưa lưu?')) void reload();}}>Tải lại trạng thái</button></div>
    <p role="status" className="text-sm text-orange-800">{message}</p>
    {!config ? <p className="text-sm text-slate-500">Đang tải cấu hình…</p> : <fieldset disabled={busy} className="space-y-5 disabled:opacity-70">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-bold">Chế độ<select className={input} value={config.mode} onChange={e=>update({...config,mode:e.target.value as Config['mode']})}><option value="priority">Key chính + dự phòng</option><option value="round_robin">Luân phiên</option></select></label>
        <label className="text-sm font-bold">Số key thử tối đa mỗi lượt<input className={input} type="number" min={1} max={3} value={config.maxAttempts} onChange={e=>update({...config,maxAttempts:Number(e.target.value)})}/></label>
        <label className="text-sm font-bold">Tạm nghỉ khi lỗi (giây)<input className={input} type="number" min={30} max={3600} value={config.cooldownSeconds} onChange={e=>update({...config,cooldownSeconds:Number(e.target.value)})}/></label>
      </div>
      <p className="text-sm text-slate-500">Key đầu tiên được ưu tiên trong chế độ dự phòng. Key cùng project dùng chung hạn mức; nhập cùng mã project để chúng cùng tạm nghỉ khi hết quota. Tổng thời gian thử nằm trong thời gian chờ AI đã cấu hình.</p>
      {config.keys.map((k,i)=><div key={k.id||`new-${i}`} className="space-y-3 rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={k.enabled} onChange={e=>edit(i,{enabled:e.target.checked})}/>{i===0?'Key chính':'Key '+(i+1)}</label><div className="flex gap-2"><button className={button} disabled={i===0} onClick={()=>move(i,-1)} aria-label="Đưa key lên">↑</button><button className={button} disabled={i===config.keys.length-1} onClick={()=>move(i,1)} aria-label="Đưa key xuống">↓</button><button className={button} onClick={()=>update({...config,keys:config.keys.filter((_,n)=>n!==i)})}>Bỏ key</button></div></div>
        <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Tên gợi nhớ<input className={input} maxLength={80} value={k.name} onChange={e=>edit(i,{name:e.target.value})}/></label><label className="text-sm font-bold">Mã Google Cloud project<input className={input} maxLength={100} value={k.project} onChange={e=>edit(i,{project:e.target.value})}/></label></div>
        <label className="block text-sm font-bold">{k.masked?'Thay API key (để trống để giữ key đã lưu)':'API key'}<input type="password" autoComplete="new-password" className={input} maxLength={300} placeholder={k.masked||'Dán API key'} value={k.secret||''} onChange={e=>edit(i,{secret:e.target.value})}/></label>
        <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-500">{k.usage ? `${k.usage.uses} lượt dùng · ${k.usage.successes} hoàn tất · ${k.usage.failures} lỗi` : 'Chưa lưu'}{k.usage?.blocked?' · Tạm khóa do lỗi quyền/key':k.usage?.retryAt?` · Nghỉ đến ${new Date(k.usage.retryAt).toLocaleTimeString('vi-VN')}`:''}</p><button className={button} disabled={!k.id||dirty} onClick={()=>void test(k.id)}>Kiểm tra kết nối</button></div>
      </div>)}
      {!config.keys.length&&<p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Chưa có key server: ứng dụng vẫn dùng key thiết bị hoặc GEMINI_API_KEY hiện có. Khi có danh sách, chấm phát âm ưu tiên hoàn toàn danh sách này.</p>}
      <div className="flex flex-wrap gap-3"><button className={button} disabled={config.keys.length>=10} onClick={()=>update({...config,keys:[...config.keys,{id:'',name:'',project:'',enabled:true,secret:''}]})}>+ Thêm key</button><button className="learning-button bg-orange-600 text-white disabled:opacity-40" disabled={!dirty} onClick={()=>void save()}>Lưu danh sách key</button></div>
      <p className="text-xs text-slate-500">Thống kê và thời gian nghỉ đặt lại khi server khởi động lại. Kiểm tra kết nối có gọi Gemini và dùng hạn mức. Key lỗi quyền chỉ được dùng lại sau khi thay key hoặc kiểm tra kết nối thành công.</p>
    </fieldset>}
  </section>;
}
