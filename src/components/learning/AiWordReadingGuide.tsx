import type {KidsPhonics} from '@/types';
import {phonicsParts} from '@/lib/kidsPhonics';
import {Sparkles} from 'lucide-react';

export function AiWordReadingGuide({phonics,loading,error,onRefresh}:{phonics:KidsPhonics|null;loading:boolean;error:string|null;onRefresh:()=>void}) {
  const parsed=phonics?phonicsParts(phonics):null;
  return <div className="w-full space-y-2">
    {parsed&&<>
      <p className="text-[11px] font-semibold text-slate-500">Gợi ý gần âm bằng tiếng Việt · AI</p>
      <div className="flex flex-wrap items-baseline justify-center gap-2" aria-label={parsed.hasRhythm?`Nhịp đọc: ${parsed.parts.map(part=>part.stressed?'nhấn':'nhẹ').join(' – ')}`:'Gợi ý đọc gần âm'}>
        {parsed.parts.map((part,index)=><span key={index} className="inline-flex items-baseline gap-2">
          {index>0&&<span aria-hidden="true" className="text-slate-300">·</span>}
          <span className={`text-2xl ${part.stressed?'font-black text-orange-600':'font-medium text-slate-600'}`}>{part.main}{part.ending&&<span className="text-sm font-semibold" title="Âm cuối: đọc nối, không thêm âm ờ">{part.ending}</span>}</span>
        </span>)}
      </div>
      <p className="text-xs leading-relaxed text-slate-600">{parsed.hasRhythm?'Nhấn phần màu cam, ':''}nối liền theo giọng mẫu.{parsed.parts.some(part=>part.ending)?' Phần trong ngoặc là âm cuối, không thêm “ờ”.':''}</p>
    </>}
    {loading&&<p role="status" className="text-sm text-orange-700">AI đang tạo gợi ý đọc…</p>}
    {error&&<p role="alert" className="text-xs text-rose-700">{error}</p>}
    {!parsed&&!loading&&!error&&<p className="text-sm text-slate-500">Chưa có gợi ý AI cho từ này. Con có thể nghe mẫu trước nhé.</p>}
    <button type="button" disabled={loading} onClick={onRefresh} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-semibold text-orange-800 hover:bg-orange-50 disabled:opacity-50"><Sparkles aria-hidden="true" className="h-3.5 w-3.5"/>{phonics?'AI tạo lại gợi ý':'Tạo gợi ý bằng AI'}</button>
  </div>;
}
