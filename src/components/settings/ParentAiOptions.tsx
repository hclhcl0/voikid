'use client';
import {defaultParentAiSettings,type ParentAiSettings} from '@/lib/stories/parentAiSettings';

export function ParentAiOptions({value,onChange}:{value?:ParentAiSettings;onChange:(value:ParentAiSettings)=>void}) {
  const settings=value??defaultParentAiSettings;
  return <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
    <h2 className="text-lg font-bold">Giới hạn AI cho phụ huynh</h2>
    <p className="text-sm leading-6 text-slate-500">Giới hạn lượt AI tạo câu/đoạn văn thành bài đọc trong Unit, tính theo tài khoản phụ huynh và dùng chung cho tất cả các bé. Admin không bị giới hạn.</p>
    <label className="flex min-h-11 items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={settings.enabled} onChange={e=>onChange({...settings,enabled:e.target.checked})}/>Bật giới hạn lượt tạo bài đọc mỗi ngày</label>
    <label className="block text-sm font-bold">Số lượt mỗi tài khoản / ngày<input type="number" min={0} max={1000} step={1} disabled={!settings.enabled} value={settings.dailyLimit} onChange={e=>onChange({...settings,dailyLimit:Number(e.target.value)})} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 disabled:bg-slate-50 sm:max-w-64"/></label>
    <p className="text-sm leading-6 text-slate-500">0 lượt: tạm dừng tạo mới. Bài đã có sẵn và đoạn văn tự viết vẫn dùng được. AI tạo thất bại không trừ lượt. Hạn mức làm mới lúc 00:00 giờ Việt Nam và được lưu trên server.</p>
    <p className="text-xs text-violet-700">Nhấn “Lưu thay đổi” ở đầu trang để áp dụng.</p>
  </section>;
}
