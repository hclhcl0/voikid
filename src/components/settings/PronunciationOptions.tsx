'use client';
import { defaultPronunciationSettings, type PronunciationSettings } from '@/lib/pronunciation/settings';
export function PronunciationOptions({ value = defaultPronunciationSettings, onChange }: { value?: PronunciationSettings; onChange: (value: PronunciationSettings) => void }) {
  const numeric = [
    ['timeoutMs','Thời gian chờ AI',5,60], ['wordDurationMs','Thu tối đa cho từ/cụm từ',5,20], ['sentenceDurationMs','Thu tối đa cho câu/đoạn',10,60],
    ['waitForSpeechMs','Chờ bé bắt đầu nói',2,10], ['silenceDurationMs','Dừng sau khoảng lặng',0.8,4], ['minSpeechMs','Thời lượng tiếng nói tối thiểu',0.08,1],
  ] as const;
  return <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Thu âm & đánh giá phát âm</h2><p className="mt-1 text-sm text-slate-500">Lưu thay đổi để áp dụng trên server. Mở lại trang học để nhận cấu hình thu âm mới.</p></div><button className="learning-button border text-sm" onClick={() => onChange({ ...defaultPronunciationSettings })}>Khôi phục mặc định</button></div>
    <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={value.enabled} onChange={e=>onChange({...value,enabled:e.target.checked})}/>Bật AI đánh giá phát âm</label>
    <label className="block text-sm font-bold">Model Gemini<input className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3" value={value.model} onChange={e=>onChange({...value,model:e.target.value})}/><span className="mt-1 block text-xs font-normal text-slate-500">Dùng model có hỗ trợ audio và structured output, khả dụng với API key của bạn.</span></label>
    <div className="grid gap-4 sm:grid-cols-2">{numeric.map(([key,label,min,max])=><label key={key} className="block text-sm font-bold">{label} (giây)<input type="number" min={min} max={max} step={key==='minSpeechMs'?0.01:0.1} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3" value={value[key]/1000} onChange={e=>onChange({...value,[key]:Math.round(Number(e.target.value)*1000)})}/></label>)}</div>
    {([['adaptiveVad','Tự điều chỉnh ngưỡng micro theo tiếng nền'],['allowArticles','Cho phép thêm “a/the” trước đáp án từ'],['allowRepetitions','Cho phép đọc lặp lại toàn bộ đáp án từ']] as const).map(([key,label])=><label key={key} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={value[key]} onChange={e=>onChange({...value,[key]:e.target.checked})}/>{label}</label>)}
    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">So khớp không chấp nhận từ gần giống bằng khoảng cách chữ. Khi chưa chắc chắn, hệ thống yêu cầu thu lại và giữ tiến độ. Chưa bật điểm 0–100 hoặc tự xác nhận thành thạo từ hai lượt AI báo đạt.</p>
  </section>;
}
