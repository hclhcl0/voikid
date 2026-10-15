'use client';
import {useEffect,useState} from 'react';
interface Config{revision:number;mode:'shared'|'personal';fallbackToShared:boolean;hasKey:boolean;masked:string}
export function FamilyAiOptions(){
  const [config,setConfig]=useState<Config|null>(null),[key,setKey]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
  const [reload,setReload]=useState(0);
  useEffect(()=>{const controller=new AbortController();fetch('/api/family/ai-key',{cache:'no-store',signal:controller.signal}).then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.message);if(!controller.signal.aborted)setConfig(data);}).catch(error=>{if(!controller.signal.aborted)setMessage(error instanceof Error?error.message:'Chưa tải được cấu hình.');});return()=>controller.abort();},[reload]);
  async function send(method:'PUT'|'DELETE'|'POST'){
    if(!config||busy)return;setBusy(true);setMessage('');
    try {const response=await fetch('/api/family/ai-key',{method,headers:{'Content-Type':'application/json'},body:method==='POST'?undefined:JSON.stringify({revision:config.revision,mode:config.mode,fallbackToShared:config.fallbackToShared,...(key.trim()&&method==='PUT'?{apiKey:key.trim()}:{})})});const data=await response.json();if(!response.ok)throw new Error(data.message);if(method==='POST')setMessage(data.message);else{setConfig(data);setKey('');setMessage(method==='DELETE'?'Đã xóa key riêng và chuyển sang key chung.':'Đã lưu cấu hình AI của gia đình. Áp dụng cho lượt gọi AI mới.');}}
    catch(error){setMessage(error instanceof Error?error.message:'Chưa thực hiện được.');}finally{setBusy(false);}
  }
  return <section aria-label="API key riêng của gia đình" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
    <div><h2 className="text-lg font-bold">API key AI của gia đình</h2><p className="mt-1 text-sm text-slate-600">Áp dụng cho chấm phát âm, tạo bài đọc và rà soát từ vựng của các bé trong gia đình. Học sinh không xem hoặc sửa được key.</p></div>
    {message&&<p role="status" className="text-sm text-orange-800">{message}</p>}
    {!config?message?<button className="ui-button ui-button-secondary" onClick={()=>{setMessage('');setReload(value=>value+1);}}>Tải lại cấu hình AI</button>:<p className="text-sm text-slate-500">Đang tải cấu hình…</p>:<fieldset disabled={busy} className="space-y-4 disabled:opacity-60">
      <label className="block text-sm font-semibold">Nguồn AI<select className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3" value={config.mode} onChange={event=>setConfig({...config,mode:event.target.value as Config['mode']})}><option value="shared">Dùng key chung của ứng dụng</option><option value="personal">Dùng key riêng của gia đình</option></select></label>
      <label className="block text-sm font-semibold">{config.hasKey?`Thay key riêng · đã lưu ${config.masked}`:'Gemini API key riêng'}<input type="password" autoComplete="new-password" maxLength={300} value={key} onChange={event=>setKey(event.target.value)} placeholder={config.hasKey?'Để trống để giữ key đã lưu':'Dán Gemini API key'} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3"/></label>
      <label className="flex items-start gap-3 text-sm"><input className="mt-1" type="checkbox" disabled={config.mode!=='personal'} checked={config.fallbackToShared} onChange={event=>setConfig({...config,fallbackToShared:event.target.checked})}/><span>Dự phòng sang key chung khi key riêng hết hạn mức hoặc gặp lỗi kết nối/quyền truy cập.</span></label>
      <div className="flex flex-wrap gap-2"><button className="ui-button ui-button-primary" disabled={config.mode==='personal'&&!config.hasKey&&!key.trim()} onClick={()=>void send('PUT')}>{busy?'Đang xử lý…':'Lưu cấu hình AI'}</button><button className="ui-button ui-button-secondary" disabled={!config.hasKey||!!key.trim()} onClick={()=>void send('POST')}>Kiểm tra key đã lưu</button>{config.hasKey&&<button className="ui-button ui-button-secondary" onClick={()=>void send('DELETE')}>Xóa key riêng</button>}</div>
      <p className="text-xs leading-relaxed text-slate-500">Key được mã hóa và lưu riêng trên server. Kiểm tra kết nối sử dụng một lượt gọi Gemini. Giới hạn tạo bài mỗi ngày do admin đặt vẫn áp dụng. Các key thuộc cùng Google Cloud project dùng chung hạn mức.</p>
    </fieldset>}
  </section>;
}
