'use client';
import {Volume2} from 'lucide-react';
export function AudioSourceBadge({source,text}:{source:{provider:'loading'|'elevenlabs'|'system';text:string}|null;text:string}){
  if(!source||source.text!==text||source.provider!=='system')return null;
  return <span role="status" className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600"><Volume2 aria-hidden="true" className="h-3.5 w-3.5"/>Giọng hệ thống</span>;
}
