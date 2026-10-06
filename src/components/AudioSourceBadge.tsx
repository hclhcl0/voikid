'use client';
export function AudioSourceBadge({source,text}:{source:{provider:'loading'|'elevenlabs'|'system';text:string}|null;text:string}){
  if(!source||source.text!==text||source.provider==='elevenlabs')return null;
  const loading=source.provider==='loading';
  return <span role="status" className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600"><span aria-hidden="true">{loading?'…':'🔊'}</span>{loading?'Đang chuẩn bị giọng đọc…':'Giọng hệ thống'}</span>;
}
