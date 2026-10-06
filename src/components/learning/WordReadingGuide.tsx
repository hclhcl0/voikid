import {vietnameseReadingGroups,vietnameseReadingCue} from '@/lib/vietnameseReading';

/** Vietnamese approximation with IPA rhythm and all final consonants retained. */
export function WordReadingGuide({word,phonetic}:{word:string;phonetic?:string}) {
  const groups=vietnameseReadingGroups(word,phonetic);
  const cue=vietnameseReadingCue(phonetic);
  if(!groups)return <p className="text-sm leading-relaxed text-slate-600">Chưa có gợi ý tiếng Việt cho từ này. Nghe mẫu chậm rồi đọc theo nhé.</p>;
  return <div className="space-y-3">
    <div className="flex flex-wrap justify-center gap-4">
      {groups.map((beats,i)=>{
        return <div key={i} className="rounded-xl bg-white px-3 py-2">
          <div className="flex flex-wrap items-baseline justify-center gap-2" aria-label={`Nhịp đọc: ${beats.map(beat=>beat.stressed?'nhấn':'nhẹ').join(' – ')}`}>
            {beats.map((beat,j)=><span key={j} className="inline-flex items-baseline gap-2">
              {j>0&&<span aria-hidden="true" className="text-slate-300">·</span>}
              <span className={`text-2xl ${beat.stressed?'font-black text-orange-600':'font-medium text-slate-600'}`}>{beat.main}{beat.ending&&<span className="text-sm font-semibold" title="Âm cuối: đọc nối, không thêm âm ờ">({beat.ending})</span>}</span>
            </span>)}
          </div>
        </div>;
      })}
    </div>
    {cue&&<p className="rounded-xl bg-orange-50 px-3 py-2 text-sm leading-relaxed text-orange-900">{cue}</p>}
    <p className="text-xs leading-relaxed text-slate-600">Nhấn phần màu cam, nối liền theo mẫu.{groups.some(beats=>beats.some(beat=>beat.ending))?' Phần trong ngoặc là âm cuối, không thêm “ờ”.':''}</p>
    <p className="text-[11px] leading-relaxed text-slate-500">Chữ Việt gợi ý gần âm. Nghe mẫu để đọc đúng nhé!</p>
  </div>;
}
