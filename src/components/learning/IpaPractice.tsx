'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { IpaSound } from '@/data/ipaChart';
import { useProfileContext } from '@/context/ProfileContext';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';
import { useTTS } from '@/hooks/useTTS';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { EmojiImage } from '@/components/WordImage';
import { mergeIpaPractice, PRACTICE_SOUNDS, practiceRecord, practiceWords, recommendSound, containsSound, phoneticTokens } from '@/lib/ipa/practice';

const button = 'rounded-xl bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40';
const secondary = 'rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40';
const stages = ['Nghe', 'Khẩu hình', 'Đọc theo', 'Phân biệt', 'Ký hiệu', 'Vận dụng'];

function RecordedAudio({blob}:{blob:Blob}) {
  const audio = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const url=URL.createObjectURL(blob);
    if(audio.current)audio.current.src=url;
    return ()=>URL.revokeObjectURL(url);
  },[blob]);
  return <div className="space-y-2"><p className="text-sm text-slate-600">Giọng của con · nghe lại và so với mẫu</p><audio ref={audio} controls className="w-full" /></div>;
}

function HighlightedWord({sound}:{sound:IpaSound}) {
  const at=sound.sample_word.toLowerCase().indexOf(sound.sample_highlight.toLowerCase());
  if(at<0)return <strong>{sound.sample_word}</strong>;
  return <strong>{sound.sample_word.slice(0,at)}<mark className="rounded bg-orange-100 px-1 text-orange-900">{sound.sample_word.slice(at,at+sound.sample_highlight.length)}</mark>{sound.sample_word.slice(at+sound.sample_highlight.length)}</strong>;
}

function PracticeLesson({sound,onClose,onComplete}:{sound:IpaSound;onClose:()=>void;onComplete:()=>void}) {
  const ctx=useProfileContext();
  const {categories}=useVocabularyCatalog();
  const {speak,cancel,isSpeaking,error,audioSource}=useTTS();
  const recorder=useAudioRecorder('word');
  const [step,setStep]=useState(0);
  const [heard,setHeard]=useState(false);
  const [tried,setTried]=useState(false);
  const [question,setQuestion]=useState(0);
  const [firstTry,setFirstTry]=useState<boolean[]>([]);
  const [mistakes,setMistakes]=useState(0);
  const [chosen,setChosen]=useState<number|null>(null);
  const [symbol,setSymbol]=useState<string|null>(null);
  const [feedback,setFeedback]=useState('');
  const [saved,setSaved]=useState(false);
  const [flipped]=useState(()=>Math.random()>=0.5);
  const words=practiceWords(sound.ipa);
  const busy=isSpeaking||audioSource?.provider==='loading';
  const recording=['requesting','recording','processing'].includes(recorder.status);
  const younger=['maugiao','lop1','lop2'].includes(ctx.activeProfile.gradeId||'lop1');
  const related=categories.filter(cat=>cat.gradeId===ctx.activeProfile.gradeId&&!cat.archived).flatMap(cat=>cat.words)
    .find(word=>word.en.toLowerCase()!==sound.sample_word.toLowerCase()&&containsSound(word.phonetic,sound.ipa));
  const application=related?.en||sound.sample_word;
  const phrase=related?.example_en||`I can say ${sound.sample_word}.`;
  const options=flipped?[1,0]:[0,1];
  const symbols=[sound.ipa,...PRACTICE_SOUNDS.filter(s=>s.ipa!==sound.ipa&&s.type===sound.type).slice(0,2).map(s=>s.ipa)];
  if(flipped)symbols.reverse();
  const done=step===6;

  const play=(text:string,markHeard=false,slow=false)=>{
    setHeard(false);
    speak(text,'en-US',slow?0.7:0.85,undefined,()=>{if(markHeard)setHeard(true);});
  };
  const move=(next:number)=>{
    cancel();recorder.resetRecorder();setHeard(false);setFeedback('');setStep(next);
  };
  const finish=()=>{
    const result=ctx.saveIpaPractice(practiceRecord(ctx.activeProfileId,sound.ipa,firstTry));
    if(!result.success){setFeedback(result.message||'Chưa lưu được bài luyện.');return;}
    cancel();setSaved(true);setStep(6);
  };
  const answer=(index:number)=>{
    if(!heard||chosen!==null)return;
    if(index!==question){setMistakes(n=>n+1);setFeedback('Nghe lại nhé. Chú ý âm ở trong từ, rồi chọn một lần nữa.');setHeard(false);return;}
    setChosen(index);setFirstTry(values=>[...values,mistakes===0]);setFeedback('Đúng rồi! Con đã nghe ra từ này.');
  };
  const canNext=step===0?heard:step===2?tried&&!recording:step===3?chosen!==null:step===4?younger||symbol===sound.ipa:step===5?heard:true;

  return <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm sm:p-7 space-y-5">
    <div className="flex items-center justify-between gap-3"><p className="text-sm font-bold text-orange-700">Bài luyện · {sound.sample_word} {step>=4&&sound.display}</p><button className="text-sm font-semibold text-slate-500" onClick={()=>{cancel();recorder.resetRecorder();onClose();}}>Đóng bài</button></div>
    {!done&&<><div className="flex flex-wrap gap-2" aria-label="Các bước luyện âm">{stages.map((label,index)=><span key={label} aria-current={step===index?'step':undefined} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${step===index?'bg-orange-600 text-white':step>index?'bg-emerald-50 text-emerald-700':'bg-slate-100 text-slate-500'}`}>{index+1}. {label}</span>)}</div><p className="text-sm text-slate-500">Mỗi lần một âm · khoảng 3–5 phút · con có thể nghe lại nhiều lần</p></>}
    {step===0&&<div className="space-y-4 text-center"><EmojiImage emoji={sound.emoji} alt={sound.sample_word_vi} size="xl" className="mx-auto"/><h2 className="text-4xl font-bold text-slate-900">{sound.sample_word}</h2><p className="text-lg text-slate-600">{sound.sample_word_vi}</p><p>Nghe cả từ và chú ý âm trong từ. Chưa cần nhớ ký hiệu.</p><button className={button} disabled={busy} onClick={()=>play(sound.sample_word,true)}>🔊 Nghe từ mẫu</button><p role="status" className="text-sm text-emerald-700">{heard?'Nghe xong rồi. Cùng xem cách đặt miệng nhé.':busy?'Đang chuẩn bị hoặc phát mẫu…':'Bấm nghe trước khi tiếp tục.'}</p></div>}
    {step===1&&<div className="space-y-4"><h2 className="text-2xl font-bold">Quan sát miệng, làm theo mẫu</h2><div className="rounded-2xl bg-orange-50 p-5"><p className="text-xl font-bold leading-relaxed text-orange-950">👄 {sound.mouth_action}</p><p className="mt-3 text-sm text-slate-600">Dùng gương hoặc nhìn miệng của bố mẹ. Đặt miệng thoải mái, không cần gồng.</p></div><div className="grid gap-3 sm:grid-cols-2">{[['Môi',sound.mouth_detail.lips],['Lưỡi',sound.mouth_detail.tongue]].map(([label,text])=><div className="rounded-xl border border-slate-200 p-4" key={label}><p className="font-bold text-orange-700">{label}</p><p className="mt-1 leading-relaxed">{text}</p></div>)}</div><details className="rounded-xl bg-slate-50 p-4"><summary className="cursor-pointer font-semibold">Hướng dẫn thêm cho phụ huynh</summary><p className="mt-3">Răng: {sound.mouth_detail.teeth}</p><p className="mt-2">Cổ họng: {sound.mouth_detail.voice_box}</p><p className="mt-2 text-sm text-slate-600">{sound.vietnamese_tip} Đây là gợi ý gần đúng; hãy lấy audio mẫu làm chuẩn.</p></details></div>}
    {step===2&&<div className="space-y-4"><h2 className="text-2xl font-bold">Nghe mẫu, rồi đến lượt con</h2><p className="text-3xl font-bold text-orange-900">{sound.sample_word}</p><p>Nghe xong, con đọc lại từ 2–3 lần. Bố mẹ có thể đọc cùng con.</p><div className="flex flex-wrap gap-3"><button className={button} disabled={busy||recording} onClick={()=>play(sound.sample_word,true,true)}>🔊 Nghe mẫu chậm</button><button className={secondary} disabled={!heard||busy||recording} onClick={()=>{setTried(true);setFeedback('Con đã luyện đọc. Cùng chơi trò nghe chọn từ nhé.');}}>Con đã đọc theo</button></div><details className="rounded-xl border border-slate-200 p-4"><summary className="cursor-pointer font-semibold">🎙️ Ghi âm để tự nghe lại (tùy chọn)</summary><p className="my-3 text-sm text-slate-600">Bản ghi chỉ dùng trên màn hình này. Con nghe lại và so với mẫu.</p>{recorder.status==='recording'?<button className={button} onClick={recorder.stopRecording}>■ Dừng ghi âm</button>:<button className={secondary} disabled={busy||recording} onClick={()=>{cancel();void recorder.startRecording();}}>Bắt đầu ghi âm</button>}{recording&&<p role="status" className="mt-2">{recorder.status==='recording'?'Đang ghi âm…':'Đang chuẩn bị bản ghi…'}</p>}{recorder.error&&<p role="alert" className="mt-3 text-rose-700">{recorder.error}</p>}{recorder.audioBlob&&<RecordedAudio blob={recorder.audioBlob}/>}</details></div>}
    {step===3&&<div className="space-y-4"><h2 className="text-2xl font-bold">Nghe và chọn từ · {question+1}/2</h2><p>Nghe từ bí mật, rồi chọn hình và từ con vừa nghe.</p><button className={button} disabled={busy} onClick={()=>play(words[question].en,true)}>🔊 Nghe từ bí mật</button><div className="grid grid-cols-2 gap-3">{options.map(index=><button key={words[index].en} className={`rounded-2xl border-2 p-4 text-center ${chosen===index?'border-emerald-500 bg-emerald-50':'border-slate-200 bg-white hover:border-orange-300'} disabled:opacity-50`} disabled={!heard||busy||chosen!==null} onClick={()=>answer(index)}><EmojiImage emoji={words[index].emoji} alt={words[index].vi} size="lg" className="mx-auto"/><span className="mt-3 block text-xl font-bold">{words[index].en}</span><span className="text-sm text-slate-600">{words[index].vi}</span></button>)}</div><p className="text-sm text-slate-500">Khi đã biết nghĩa hai từ, con chú ý cách mỗi từ phát âm khác nhau.</p>{chosen!==null&&<button className={secondary} onClick={()=>play(words[question].en)}>Nghe lại đáp án</button>}</div>}
    {step===4&&<div className="space-y-4"><h2 className="text-2xl font-bold">Gặp ký hiệu của âm</h2><p className="text-5xl font-bold text-orange-700">{sound.display}</p><p className="text-lg">Trong <HighlightedWord sound={sound}/>, phần chữ màu cam biểu thị âm này.</p><p className="text-2xl font-semibold">{phoneticTokens(sound.sample_word_ipa).map((token,index)=><span key={index} className={token===sound.ipa?'rounded bg-orange-100 text-orange-900':''}>{token}</span>)}</p>{younger?<p className="rounded-xl bg-orange-50 p-4">Con chỉ cần làm quen. Chưa cần học thuộc ký hiệu.</p>:<><p>Chọn ký hiệu vừa học:</p><div className="flex flex-wrap gap-3">{symbols.map(ipa=><button key={ipa} className={`${secondary} text-2xl ${symbol===ipa?'ring-2 ring-orange-500':''}`} onClick={()=>{setSymbol(ipa);setFeedback(ipa===sound.ipa?'Đúng rồi. Cùng dùng âm này trong từ nhé.':'Nhìn lại ký hiệu phía trên rồi thử lại nhé.');}}>/{ipa}/</button>)}</div></>}</div>}
    {step===5&&<div className="space-y-4"><h2 className="text-2xl font-bold">Đọc từ rồi đọc câu</h2><p className="text-sm text-slate-500">{related?'Từ trong kho từ vựng của lớp con':'Dùng từ vừa luyện'}</p><p className="text-3xl font-bold text-orange-900">{application}</p><button className={secondary} disabled={busy} onClick={()=>play(application,false,true)}>🔊 Nghe từ</button><p className="rounded-2xl bg-orange-50 p-5 text-2xl font-bold leading-relaxed">{phrase}</p><button className={button} disabled={busy} onClick={()=>play(phrase,true)}>🔊 Nghe câu rồi đọc theo</button><p>Đọc lại cả câu, giữ âm vừa học thật rõ. Nghe xong rồi bấm hoàn thành.</p></div>}
    {done&&<div className="space-y-4 text-center"><p className="text-5xl">🌱</p><h2 className="text-2xl font-bold">Con đã hoàn thành bài luyện!</h2><p>Âm {sound.display} · {firstTry.filter(Boolean).length}/2 câu nghe đúng ngay lần đầu.</p><p className="text-sm text-slate-600">{firstTry.every(Boolean)?'Hẹn con ôn lại sau 3 ngày.':'Ngày mai mình nghe lại hai từ để quen tai hơn nhé.'}</p><p className="text-sm text-slate-500">Đã lưu việc luyện đọc; phần đọc theo chưa được chấm phát âm.</p><button className={button} onClick={onComplete}>Về bài luyện hôm nay</button></div>}
    {error&&<p role="alert" className="text-rose-700">{error} Bấm nghe để thử lại.</p>}
    {feedback&&<p role="status" className="rounded-xl bg-slate-50 p-3 text-slate-700">{feedback}</p>}
    {!done&&<div className="flex justify-end border-t pt-4"><button className={button} disabled={!canNext||busy||recording||!ctx.hydrated||saved} onClick={()=>{if(step===3&&question===0){cancel();setQuestion(1);setHeard(false);setChosen(null);setMistakes(0);setFeedback('');}else if(step===5)finish();else move(step+1);}}>{step===5?'Con đã đọc câu · Hoàn thành':'Tiếp tục →'}</button></div>}
  </section>;
}

export function IpaPractice({view,onLookup,initialSound}:{view:'today'|'review';onLookup:()=>void;initialSound?:IpaSound|null}) {
  const ctx=useProfileContext();
  const records=useMemo(()=>mergeIpaPractice(ctx.progress.ipaPractice,{},ctx.activeProfileId),[ctx.progress.ipaPractice,ctx.activeProfileId]);
  const [selected,setSelected]=useState<IpaSound|null>(initialSound??null);
  const [now]=useState(Date.now);
  const recommended=recommendSound(records,now);
  const due=PRACTICE_SOUNDS.filter(sound=>records[sound.ipa]&&Date.parse(records[sound.ipa].reviewDueAt)<=now);
  if(!ctx.hydrated)return <p role="status">Đang mở bài luyện của con…</p>;
  if(selected)return <PracticeLesson key={`${ctx.activeProfileId}:${selected.ipa}`} sound={selected} onClose={()=>setSelected(null)} onComplete={()=>setSelected(null)}/>;
  return <div className="space-y-5">
    {view==='today'?<><section className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm"><p className="text-sm font-semibold text-orange-700">Bài luyện hôm nay · {ctx.activeProfile.name}</p><div className="mt-4 flex flex-wrap items-center gap-5"><EmojiImage emoji={recommended.emoji} alt={recommended.sample_word_vi} size="lg"/><div className="space-y-2"><h2 className="text-3xl font-bold text-slate-900">Cùng đọc {recommended.sample_word}</h2><p className="text-slate-600">Nghe → nhìn miệng → đọc theo → chơi chọn từ</p><p className="text-sm text-slate-500">Một âm mỗi lần · 3–5 phút · {Object.keys(records).length}/{PRACTICE_SOUNDS.length} âm đã luyện</p><button className={button} onClick={()=>setSelected(recommended)}>Bắt đầu bài luyện →</button></div></div></section><section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-lg font-bold">Bố mẹ đồng hành</h2><p className="mt-2 leading-relaxed text-slate-600">Đọc cùng con, dùng gương để quan sát miệng. Mỗi lần góp ý một điều nhỏ. Với bé mới bắt đầu, ưu tiên nghe và đọc theo trước khi nhớ ký hiệu.</p><p className="mt-2 text-sm text-slate-500">Các bài dùng từ mẫu trước. Từ và câu cùng lớp được gợi ý ở bước vận dụng. Bảng IPA hiện có là tài liệu tra cứu; giọng đọc được lấy từ cấu hình Media.</p><button className={`${secondary} mt-4`} onClick={onLookup}>Tra cứu một âm khác</button></section></>:<><section className="rounded-2xl border border-orange-200 bg-orange-50 p-5"><h2 className="text-xl font-bold">Âm cần ôn · {due.length}</h2><p className="mt-2 text-slate-600">Ưu tiên âm đã luyện đến ngày ôn. Chưa gắn nhãn phát âm thành thạo.</p></section>{due.map(sound=><div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4" key={sound.ipa}><div><p className="text-xl font-bold">{sound.display} · {sound.sample_word}</p><p className="text-sm text-slate-500">{records[sound.ipa].firstTry.filter(Boolean).length}/2 câu nghe đúng ngay lần đầu</p></div><button className={button} onClick={()=>setSelected(sound)}>Ôn âm này</button></div>)}{!due.length&&<p className="rounded-2xl bg-white p-5 text-slate-600">Chưa có âm đến hạn. Con có thể luyện lại một âm đã học hoặc bắt đầu bài hôm nay.</p>}<h3 className="font-bold">Đã luyện · {Object.keys(records).length} âm</h3><div className="flex flex-wrap gap-3">{PRACTICE_SOUNDS.filter(sound=>records[sound.ipa]).map(sound=><button className={secondary} key={sound.ipa} onClick={()=>setSelected(sound)}>{sound.display} · {sound.sample_word}</button>)}</div></>}
  </div>;
}
