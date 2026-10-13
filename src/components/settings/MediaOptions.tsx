'use client';

import {useEffect,useRef,useState} from 'react';
import type {MediaAudio} from '@/lib/media/store';
import {MIN_NORMAL_SPEED,SLOW_AUDIO_SPEED,MAX_AUDIO_SPEED} from '@/lib/media/pace';
import {isShopVoiceText} from '@/lib/shop';
import {KeyRound,Plus,Trash2,ArrowUp,ArrowDown,Shuffle,Award,CheckCircle2,AlertCircle} from 'lucide-react';

const field='min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2';

type BatchScope = 'all' | 'shop' | 'curriculum';

interface ScopeStat {
  total: number;
  cached: number;
  missing: number;
}

interface BatchStats {
  shop: ScopeStat;
  curriculum: ScopeStat;
  all: ScopeStat;
}

interface BatchState {
  running: boolean;
  scope: BatchScope;
  total: number;
  done: number;
  errors: number;
  alreadyDone: number;
  currentWord?: string;
  log: string[];
  fatalError?: string;
}

interface KeyItem {
  id: string;
  name: string;
  enabled: boolean;
  masked?: string;
  key?: string;
  uses?: number;
  successes?: number;
  failures?: number;
  isCooldown?: boolean;
  lastError?: string | null;
}

const BATCH_IDLE: BatchState = {
  running: false,
  scope: 'all',
  total: 0,
  done: 0,
  errors: 0,
  alreadyDone: 0,
  log: [],
};

export function MediaOptions(){
  const [settings,setSettings]=useState({
    enabled:false,
    voiceId:'',
    model:'eleven_flash_v2_5',
    speed:0.85,
    configured:false,
    keyFingerprint:'',
    keySource:'',
    activeKeyCount:0,
    keyMode:'priority' as 'priority'|'round_robin',
  });
  const [apiKeys,setApiKeys]=useState<KeyItem[]>([]);
  const [keyMode,setKeyMode]=useState<'priority'|'round_robin'>('priority');
  const [newKeyName,setNewKeyName]=useState('');
  const [newKeySecret,setNewKeySecret]=useState('');

  const [key,setKey]=useState(''),[text,setText]=useState('Hello! Welcome to our English lesson.'),[items,setItems]=useState<MediaAudio[]>([]),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
  const [scope,setScope]=useState<BatchScope>('all');
  const [stats,setStats]=useState<BatchStats|null>(null);
  const [batch,setBatch]=useState<BatchState>(BATCH_IDLE);
  const batchAbort=useRef<AbortController|null>(null);
  const logBoxRef=useRef<HTMLDivElement|null>(null);

  // Auto scroll log to bottom
  useEffect(()=>{
    if(logBoxRef.current){
      logBoxRef.current.scrollTop=logBoxRef.current.scrollHeight;
    }
  },[batch.log]);

  async function fetchStats(){
    try{
      const r=await fetch('/api/admin/media/tts/batch');
      if(r.ok){
        const data=await r.json();
        setStats(data);
      }
    }catch{/* ignore */}
  }

  async function refresh(){
    const r=await fetch('/api/admin/media');
    if(!r.ok)throw new Error('Không tải được Media.');
    const data=await r.json();
    setSettings(data.settings);
    if(data.settings.apiKeys)setApiKeys(data.settings.apiKeys);
    if(data.settings.keyMode)setKeyMode(data.settings.keyMode);
    setItems(data.items);
    await fetchStats();
  }

  useEffect(()=>{
    const controller=new AbortController();
    void fetch('/api/admin/media',{signal:controller.signal})
      .then(async r=>{if(!r.ok)throw new Error('Không tải được Media.');return r.json();})
      .then(data=>{
        if(!controller.signal.aborted){
          setSettings(data.settings);
          if(data.settings.apiKeys)setApiKeys(data.settings.apiKeys);
          if(data.settings.keyMode)setKeyMode(data.settings.keyMode);
          setItems(data.items);
        }
      })
      .catch(e=>{if(!controller.signal.aborted)setMessage(e.message);});

    void fetchStats();
    return ()=>controller.abort();
  },[]);

  function handleAddKey(){
    const secret=newKeySecret.trim().replace(/[\u200B-\u200D\uFEFF]/g,'');
    if(!secret)return;
    if(/[\s"'`]/.test(secret)){
      setMessage('Key không được chứa khoảng trắng hoặc ký tự đặc biệt.');
      return;
    }
    const name=newKeyName.trim()||`Key ${apiKeys.length+1}`;
    const id='key_'+Date.now()+'_'+Math.random().toString(36).slice(2,6);
    setApiKeys(prev=>[
      ...prev,
      {
        id,
        name,
        enabled:true,
        key:secret,
        masked:`••••••${secret.slice(-4)}`,
        uses:0,
        successes:0,
        failures:0,
      }
    ]);
    setNewKeyName('');
    setNewKeySecret('');
    setMessage(`Đã thêm "${name}" vào danh sách. Hãy nhấn "Lưu cấu hình giọng đọc" để lưu trên server.`);
  }

  function handleRemoveKey(id:string){
    setApiKeys(prev=>prev.filter(k=>k.id!==id));
  }

  function handleToggleKey(id:string){
    setApiKeys(prev=>prev.map(k=>k.id===id?{...k,enabled:!k.enabled}:k));
  }

  function handleMoveKey(index:number,delta:number){
    const target=index+delta;
    if(target<0||target>=apiKeys.length)return;
    setApiKeys(prev=>{
      const next=[...prev];
      const [item]=next.splice(index,1);
      next.splice(target,0,item);
      return next;
    });
  }

  async function save(){
    setBusy(true);
    try{
      const payload={
        ...settings,
        apiKey:key||undefined,
        apiKeys:apiKeys.map(k=>({
          id:k.id,
          name:k.name,
          enabled:k.enabled,
          key:k.key||undefined,
        })),
        keyMode,
      };
      const r=await fetch('/api/admin/media',{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload),
      });
      const data=await r.json();
      if(!r.ok)throw new Error(data.message);
      setSettings(data);
      if(data.apiKeys)setApiKeys(data.apiKeys);
      if(data.keyMode)setKeyMode(data.keyMode);
      setKey('');
      setMessage('Đã lưu cấu hình và danh sách API Key trên server thành công.');
      await fetchStats();
    }catch(e){
      setMessage(e instanceof Error?e.message:'Không lưu được.');
    }finally{
      setBusy(false);
    }
  }

  async function generate(){
    setBusy(true);
    setMessage('Đang tạo và lưu audio…');
    try{
      const r=await fetch('/api/admin/media/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});
      const data=await r.json();
      if(!r.ok)throw new Error(data.message);
      await refresh();
      setMessage('Đã lưu MP3 vào Media. Nội dung trùng sẽ dùng lại audio có sẵn.');
    }catch(e){
      setMessage(e instanceof Error?e.message:'Không tạo được.');
    }finally{
      setBusy(false);
    }
  }

  async function startBatch(targetScope: BatchScope = scope){
    if(batch.running){
      batchAbort.current?.abort();
      setBatch(b=>({...b,running:false,log:[...b.log,'⏹ Đã dừng theo yêu cầu của bạn.']}));
      return;
    }

    const scopeLabel = targetScope === 'all' ? 'Toàn bộ ứng dụng' : targetScope === 'shop' ? 'Cửa hàng (Shop)' : 'Bài học (Curriculum)';
    const ctrl=new AbortController();
    batchAbort.current=ctrl;
    setBatch({
      running:true,
      scope:targetScope,
      total:0,
      done:0,
      errors:0,
      alreadyDone:0,
      log:[`🚀 Đang quét và kết nối đến máy chủ (Phạm vi: ${scopeLabel})…`],
    });

    try{
      const res=await fetch('/api/admin/media/tts/batch',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({scope:targetScope}),
        signal:ctrl.signal,
      });

      if(!res.ok){
        const d=await res.json().catch(()=>({})) as {message?:string};
        setBatch({...BATCH_IDLE,fatalError:d.message||'Lỗi máy chủ.',log:[d.message||'Lỗi máy chủ.']});
        return;
      }

      const reader=res.body!.getReader();
      const decoder=new TextDecoder();
      let buf='';

      while(true){
        const {done,value}=await reader.read();
        if(done)break;
        buf+=decoder.decode(value,{stream:true});
        const lines=buf.split('\n');
        buf=lines.pop()??'';
        for(const line of lines){
          if(!line.trim())continue;
          try{
            const ev=JSON.parse(line) as {
              type:string;
              scope?:string;
              total?:number;
              done?:number;
              errors?:number;
              alreadyDone?:number;
              todo?:number;
              text?:string;
              msg?:string;
              code?:string;
            };

            setBatch(b=>{
              const next={...b};
              if(ev.total!=null)next.total=ev.total;
              if(ev.done!=null)next.done=ev.done;
              if(ev.errors!=null)next.errors=ev.errors;
              if(ev.alreadyDone!=null)next.alreadyDone=ev.alreadyDone;

              if(ev.type==='start'){
                next.log=[`📋 Quét xong: Tổng ${ev.total} từ · ${ev.alreadyDone} từ đã có MP3 · Cần tạo ${ev.todo} từ mới`];
              }else if(ev.type==='progress'){
                next.currentWord=ev.text;
              }else if(ev.type==='ok'){
                next.log=[...b.log.slice(-19),`✓ Đã tạo: "${ev.text}" (${ev.done}/${ev.total})`];
              }else if(ev.type==='error'){
                next.log=[...b.log.slice(-19),`✗ Lỗi từ "${ev.text}": ${ev.msg}`];
              }else if(ev.type==='fatal'){
                next.running=false;
                next.fatalError=ev.msg;
                next.log=[...b.log.slice(-19),`⛔ DỪNG LẠI: ${ev.msg}`];
              }else if(ev.type==='done'){
                next.running=false;
                next.currentWord=undefined;
                next.log=[...b.log.slice(-19),`🎉 HOÀN TẤT! Đã tạo/có sẵn ${ev.done}/${ev.total} từ (${ev.errors} lỗi)`];
              }
              return next;
            });
          }catch{/* ignore json parse */}
        }
      }
    }catch(e){
      if(!(e instanceof DOMException&&e.name==='AbortError')){
        setBatch(b=>({...b,running:false,fatalError:'Mất kết nối mạng.',log:[...b.log,'Kết nối mạng bị ngắt.']}));
      }else{
        setBatch(b=>({...b,running:false,log:[...b.log,'Đã dừng.']}));
      }
    }
    await refresh().catch(()=>{});
  }

  const currentStat: ScopeStat = stats?.[scope] || {
    total: scope === 'all' ? 1409 : scope === 'shop' ? 500 : 909,
    cached: items.length,
    missing: Math.max(0, (scope === 'all' ? 1409 : scope === 'shop' ? 500 : 909) - items.length),
  };

  const activeKeysCount = apiKeys.filter(k=>k.enabled).length || (settings.configured ? 1 : 0);
  const canBatch = settings.enabled && activeKeysCount > 0 && !!settings.voiceId;
  const batchPct = batch.total>0?Math.round(batch.done/batch.total*100):0;
  const cachedPct = currentStat.total>0?Math.round((currentStat.cached/currentStat.total)*100):0;

  return (
    <section className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-lg font-bold text-slate-800">Media · Giọng đọc ElevenLabs & Quản Lý Nhiều API Key</h2>
        <p className="text-sm text-slate-500 mt-1">
          Hệ thống lưu trữ audio cố định trên máy chủ. Tự động luân phiên hoặc chuyển đổi dự phòng (failover) giữa nhiều tài khoản ElevenLabs khi hết hạn mức ký tự (quota).
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-2">
          <span className="inline-flex items-center gap-1 rounded bg-orange-100 px-2 py-0.5 font-semibold text-orange-800">
            {activeKeysCount} key đang kích hoạt
          </span>
          <span>·</span>
          <span>Chế độ: <strong>{keyMode==='round_robin'?'Luân phiên (Round-Robin)':'Ưu tiên (Failover)'}</strong></span>
          <span>·</span>
          <span>Nguồn: {settings.keySource === 'settings' ? 'Cài đặt Admin' : 'Biến môi trường'}</span>
        </div>
      </header>

      {/* Cấu hình cơ bản ElevenLabs */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <label className="flex items-center gap-3 font-medium text-slate-800 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            checked={settings.enabled}
            onChange={e=>setSettings({...settings,enabled:e.target.checked})}
          />
          Bật tạo và lưu audio ElevenLabs
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Voice ID</span>
            <input
              className={`${field} mt-1`}
              value={settings.voiceId}
              onChange={e=>setSettings({...settings,voiceId:e.target.value})}
              placeholder="Voice ID từ ElevenLabs"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Model</span>
            <select
              className={`${field} mt-1`}
              value={settings.model}
              onChange={e=>setSettings({...settings,model:e.target.value})}
            >
              <option value="eleven_flash_v2_5">Flash v2.5 (nhanh & tiết kiệm quota)</option>
              <option value="eleven_multilingual_v2">Multilingual v2</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Tốc độ đọc Chuẩn ({settings.speed}×)</span>
            <input
              type="range"
              min={MIN_NORMAL_SPEED}
              max={MAX_AUDIO_SPEED}
              step={0.05}
              value={settings.speed}
              onChange={e=>setSettings({...settings,speed:Number(e.target.value)})}
              className="mt-3 w-full accent-orange-600"
            />
            <span className="text-[11px] text-slate-500">Chuẩn: {MIN_NORMAL_SPEED}×–{MAX_AUDIO_SPEED}×. Nút Chậm: {SLOW_AUDIO_SPEED}×.</span>
          </label>
        </div>

        {/* ── QUẢN LÝ NHIỀU API KEY ELEVENLABS ─────────────────────────────────── */}
        <div className="space-y-4 pt-3 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-orange-600" />
              <h3 className="font-bold text-slate-800 text-sm">Danh sách API Key ElevenLabs ({apiKeys.length})</h3>
            </div>

            {/* Chọn chế độ key */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 text-xs font-medium">
              <button
                type="button"
                onClick={()=>setKeyMode('priority')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                  keyMode === 'priority'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Dùng key đầu tiên; khi hết quota hoặc lỗi sẽ tự động chuyển sang key tiếp theo"
              >
                <Award className="h-3.5 w-3.5" />
                Ưu tiên (Failover)
              </button>
              <button
                type="button"
                onClick={()=>setKeyMode('round_robin')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                  keyMode === 'round_robin'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Chia đều lượt gọi cho các key để phân tải hạn mức đồng đều"
              >
                <Shuffle className="h-3.5 w-3.5" />
                Luân phiên (Round-Robin)
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Hỗ trợ cấu hình tối đa 20 key. Ở chế độ <strong>Ưu tiên</strong>, hệ thống tự động nhảy sang key dự phòng khi key chính gặp lỗi <code>QUOTA</code> (429) hoặc <code>INVALID_KEY</code> (401).
          </p>

          {/* Bảng danh sách các key */}
          {apiKeys.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500 bg-white">
              Chưa có danh sách API Key nào. Bạn có thể thêm key bên dưới hoặc nhập nhanh 1 key đơn lẻ.
            </div>
          ) : (
            <div className="space-y-2">
              {apiKeys.map((k, index)=>(
                <div
                  key={k.id}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 transition-colors ${
                    k.enabled
                      ? 'border-slate-200 bg-white shadow-xs'
                      : 'border-slate-200/60 bg-slate-100/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[11px] font-bold text-orange-800">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-slate-800 truncate">{k.name}</strong>
                        {k.isCooldown && (
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Tạm nghỉ ({k.lastError||'quota'})
                          </span>
                        )}
                        {!k.isCooldown && k.enabled && (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Sẵn sàng
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                        <span>{k.masked || '••••••'}</span>
                        {(k.uses ?? 0) > 0 && (
                          <span className="font-sans text-[11px] text-slate-400">
                            · {k.uses} lượt gọi ({k.successes ?? 0} thành công)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={()=>handleMoveKey(index, -1)}
                      className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-600"
                      title="Tăng độ ưu tiên (lên trước)"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === apiKeys.length - 1}
                      onClick={()=>handleMoveKey(index, 1)}
                      className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-600"
                      title="Giảm độ ưu tiên (xuống sau)"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={()=>handleToggleKey(k.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                        k.enabled
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'border-slate-300 bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {k.enabled ? 'Đang bật' : 'Đã tắt'}
                    </button>
                    <button
                      type="button"
                      onClick={()=>handleRemoveKey(k.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                      title="Xóa key này"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form thêm key mới */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-orange-600" /> Thêm API Key mới
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4">
                <input
                  type="text"
                  className={field}
                  value={newKeyName}
                  onChange={e=>setNewKeyName(e.target.value)}
                  placeholder="Tên gợi nhớ (VD: Tài khoản Pro 2)"
                />
              </div>
              <div className="md:col-span-6">
                <input
                  type="password"
                  autoComplete="new-password"
                  className={field}
                  value={newKeySecret}
                  onChange={e=>setNewKeySecret(e.target.value)}
                  placeholder="Nhập ElevenLabs API Key bí mật..."
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={handleAddKey}
                  disabled={!newKeySecret.trim()}
                  className="w-full h-11 rounded-xl bg-slate-800 text-white font-medium text-xs hover:bg-slate-900 disabled:opacity-40 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Thêm key
                </button>
              </div>
            </div>
          </div>

          {/* Ô nhập nhanh API key cũ (tương thích ngược) */}
          <details className="text-xs text-slate-600">
            <summary className="cursor-pointer hover:text-slate-900 font-medium">
              Nhập nhanh 1 key đơn lẻ thay thế toàn bộ (Legacy)
            </summary>
            <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200">
              <input
                type="password"
                autoComplete="new-password"
                className={field}
                value={key}
                onChange={e=>setKey(e.target.value)}
                placeholder="Nhập key mới để cập nhật nhanh..."
              />
            </div>
          </details>
        </div>

        <button
          disabled={busy}
          className="learning-button bg-orange-600 text-white disabled:opacity-50 text-sm font-medium mt-2"
          onClick={()=>void save()}
        >
          {busy ? 'Đang lưu…' : 'Lưu cấu hình giọng đọc'}
        </button>
        {message && <p role="status" className="text-xs text-orange-800 font-semibold mt-1">{message}</p>}
      </div>

      {/* ── BATCH AUDIO GENERATOR: QUÉT VÀ TẠO TẤT CẢ ───────────────────────────────────────── */}
      <div className="rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/70 to-amber-50/70 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎙️</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Quét & Tạo Audio Hàng Loạt</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Tự động quét các từ chưa có file MP3 trên máy chủ và gọi ElevenLabs tạo mới hàng loạt. Tự động chuyển đổi giữa {activeKeysCount} API Key khi hết quota.
              </p>
            </div>
          </div>
          <button
            onClick={()=>void fetchStats()}
            className="text-xs font-medium text-orange-700 hover:text-orange-900 border border-orange-300 rounded-lg px-2.5 py-1 bg-white/80"
          >
            🔄 Quét lại dữ liệu
          </button>
        </div>

        {/* Tab chọn phạm vi quét */}
        <div className="flex flex-wrap border-b border-orange-200 gap-1 pt-1">
          <button
            onClick={()=>setScope('all')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all ${
              scope === 'all'
                ? 'bg-white text-orange-700 border-t-2 border-l border-r border-orange-300 -mb-px shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-orange-100/50'
            }`}
          >
            🌟 Toàn bộ ứng dụng ({stats?.all.total ?? 1409} từ)
          </button>
          <button
            onClick={()=>setScope('shop')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all ${
              scope === 'shop'
                ? 'bg-white text-orange-700 border-t-2 border-l border-r border-orange-300 -mb-px shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-orange-100/50'
            }`}
          >
            🏪 Cửa hàng / Shop ({stats?.shop.total ?? 500} từ)
          </button>
          <button
            onClick={()=>setScope('curriculum')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all ${
              scope === 'curriculum'
                ? 'bg-white text-orange-700 border-t-2 border-l border-r border-orange-300 -mb-px shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-orange-100/50'
            }`}
          >
            📚 Bài học theo chủ đề ({stats?.curriculum.total ?? 909} từ)
          </button>
        </div>

        {/* Thẻ thống kê chi tiết theo Tab */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/90 border border-orange-200 rounded-xl p-3 shadow-xs">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">Tổng từ vựng</div>
            <div className="text-xl font-bold text-slate-800 mt-0.5">{currentStat.total}</div>
          </div>
          <div className="bg-white/90 border border-orange-200 rounded-xl p-3 shadow-xs">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">Đã có MP3</div>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">
              {currentStat.cached} <span className="text-xs font-normal text-slate-500">({cachedPct}%)</span>
            </div>
          </div>
          <div className={`border rounded-xl p-3 shadow-xs ${currentStat.missing > 0 ? 'bg-orange-100/70 border-orange-300' : 'bg-emerald-50 border-emerald-300'}`}>
            <div className="text-[11px] text-slate-500 uppercase font-semibold">Chưa có (cần tạo mới)</div>
            <div className={`text-xl font-bold mt-0.5 ${currentStat.missing > 0 ? 'text-orange-900' : 'text-emerald-800'}`}>
              {currentStat.missing > 0 ? currentStat.missing : '✓ Đủ 100%'}
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-slate-600">
            {currentStat.missing > 0 ? (
              <span>Còn <strong>{currentStat.missing}</strong> từ chưa có audio. Bấm nút bên phải để bắt đầu tạo.</span>
            ) : (
              <span className="text-emerald-700 font-semibold">🎉 Đã có đủ audio cho toàn bộ danh sách này!</span>
            )}
          </p>

          <button
            disabled={(!canBatch && !batch.running)}
            onClick={()=>void startBatch(scope)}
            className={`learning-button text-sm font-semibold px-5 py-2.5 shadow-sm transition-all disabled:opacity-50 ${
              batch.running
                ? 'border border-red-300 bg-red-600 text-white hover:bg-red-700'
                : currentStat.missing === 0
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            {batch.running
              ? '⏹ Dừng tạo'
              : currentStat.missing === 0
              ? '🔄 Quét lại & Tạo bổ sung'
              : `▶ Quét & Bắt đầu tạo mới (${currentStat.missing} từ)`}
          </button>
        </div>

        {!canBatch && !batch.running && (
          <div className="rounded-lg bg-amber-100/80 border border-amber-300 p-2.5 text-xs text-amber-900 flex items-center gap-2">
            <span>⚠</span>
            <span>Cần cấu hình ElevenLabs (Bật checkbox + Voice ID + ít nhất 1 API Key khả dụng) và bấm <strong>Lưu cấu hình giọng đọc</strong> trước khi tạo hàng loạt.</span>
          </div>
        )}

        {batch.fatalError && !batch.running && (
          <div className="rounded-lg bg-red-100 border border-red-300 p-2.5 text-xs text-red-900 font-medium">
            ⛔ {batch.fatalError}
          </div>
        )}

        {(batch.total > 0 || batch.running) && (
          <div className="space-y-2 pt-2 border-t border-orange-200/80">
            <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
              <span>
                Tiến độ: <strong>{batch.done}</strong>/{batch.total} từ
                {batch.alreadyDone > 0 && <span className="text-slate-500 font-normal"> · {batch.alreadyDone} từ có sẵn</span>}
                {batch.errors > 0 && <span className="text-red-600"> · {batch.errors} từ lỗi</span>}
              </span>
              <span className="font-bold text-orange-700">{batchPct}%</span>
            </div>

            <div className="h-3 w-full rounded-full bg-orange-100 overflow-hidden p-0.5 border border-orange-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                style={{width:`${batchPct}%`}}
              />
            </div>

            {batch.currentWord && batch.running && (
              <p className="text-xs text-slate-600 italic">
                Đang xử lý: <strong className="text-slate-800 not-italic">"{batch.currentWord}"</strong>…
              </p>
            )}

            <div
              ref={logBoxRef}
              className="max-h-40 overflow-y-auto rounded-lg bg-slate-900 text-slate-100 p-3 text-xs font-mono space-y-1 shadow-inner"
            >
              {batch.log.map((line,i)=>(
                <div
                  key={i}
                  className={
                    line.startsWith('✗') || line.startsWith('⛔')
                      ? 'text-red-400'
                      : line.startsWith('✓') || line.startsWith('🎉')
                      ? 'text-emerald-400'
                      : line.startsWith('📋') || line.startsWith('🚀')
                      ? 'text-amber-300'
                      : 'text-slate-300'
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tạo audio cho từ/câu lẻ */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h3 className="font-bold text-slate-800 text-sm">Tạo audio cho câu hoặc từ vựng bất kỳ</h3>
        <label className="block text-sm">
          <textarea
            className={field}
            rows={3}
            maxLength={6000}
            value={text}
            onChange={e=>setText(e.target.value)}
            placeholder="Nhập từ, câu hoặc đoạn văn cần tạo audio..."
          />
        </label>
        <button
          disabled={busy||!text.trim()||!canBatch}
          className="learning-button border border-slate-300 bg-white hover:bg-slate-50 text-sm disabled:opacity-50"
          onClick={()=>void generate()}
        >
          {busy?'Đang xử lý…':'Tạo và lưu vào Media'}
        </button>
      </div>

      {/* Danh sách audio đã lưu */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Audio đã lưu trên máy chủ ({items.length})</h3>
          <span className="text-xs text-slate-500">
            {items.filter(it=>isShopVoiceText(it.text)).length} từ Shop · {items.filter(it=>!isShopVoiceText(it.text)).length} nội dung khác
          </span>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-slate-400 italic">Chưa có file audio nào được lưu.</p>
        ) : (
          <div className="max-h-96 space-y-2 overflow-auto pr-1">
            {items.map(item=>(
              <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800 truncate">{item.text}</p>
                    {isShopVoiceText(item.text) && (
                      <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-800">
                        SHOP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tốc độ: {item.speed??1}× · {(item.bytes/1024).toFixed(1)} KB · {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <audio controls preload="none" src={item.url} className="h-8 max-w-[200px]"/>
                  <a className="text-xs font-semibold text-orange-700 hover:underline" href={item.url} download={`${item.text || item.id}.mp3`}>
                    Tải MP3
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
