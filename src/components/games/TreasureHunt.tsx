'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Gem, Gift, Headphones, LoaderCircle, Mic, Puzzle, RotateCcw, Square, Star, Volume2 } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useSettings } from '@/hooks/useSettings';
import { useProfileContext } from '@/context/ProfileContext';
import { shuffle } from '@/lib/learning/engine';
import { treasureChoices, treasureComplete, treasureReward, treasureWords } from '@/lib/games/treasure';
import { pronunciationStarGain } from '@/lib/pronunciation/rewards';
import type { Category, PronunciationResult, Word } from '@/types';

type Expedition = { seed: string; words: Word[] };
const primary = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 font-bold text-white hover:bg-violet-700 disabled:opacity-50';
const secondary = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50';

export function TreasureHunt({ category }: { category: Category }) {
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  function start() {
    const seed = crypto.randomUUID();
    setExpedition({ seed, words: treasureWords(category.words, seed) });
  }
  if (expedition) return <Journey key={expedition.seed} category={category} expedition={expedition} onRestart={start}/>;
  const available = treasureWords(category.words, 'preview').length;
  return <section className="mt-5 rounded-3xl border border-violet-100 bg-white p-6 text-center shadow-sm">
    <div aria-hidden="true" className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-100 to-violet-100"><Gift className="h-16 w-16 text-amber-600"/></div>
    <h2 className="mt-5 text-2xl font-bold">Một rương bí mật đang chờ bé!</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600">{available} từ · 3 chặng · Không giới hạn thời gian</p>
    <ol className="my-6 space-y-3 text-left">{['Nghe và tìm đúng nghĩa', 'Ghép các cặp từ', 'Đọc từ để khám phá rương'].map((label, i) => <li key={label} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">{i + 1}</span><span className="text-sm font-semibold">{label}</span></li>)}</ol>
    {available > 0 ? <button onClick={start} className={primary}>Bắt đầu khám phá<ArrowRight className="h-5 w-5" aria-hidden="true"/></button> : <p>Chủ đề cần có từ tiếng Anh và nghĩa tiếng Việt để chơi.</p>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Mỗi Unit có một quà khám phá cho từng lớp. Đọc đúng được cộng sao; thử lại không bị trừ sao.</p>
  </section>;
}

function Journey({ category, expedition, onRestart }: { category: Category; expedition: Expedition; onRestart: () => void }) {
  const { words, seed } = expedition;
  const { activeProfile, recordAttempt, awardSticker, progress } = useProfileContext();
  const { apiKey } = useSettings();
  const { speak, cancel, isSpeaking, error: audioError } = useTTS();
  const { status, audioBlob, audioBase64, startRecording, stopRecording, resetRecorder, error: recorderError, inputLevel, hasServerKey } = useAudioRecorder();
  const [stage, setStage] = useState<'listen' | 'match' | 'speak' | 'done'>('listen');
  const [index, setIndex] = useState(0);
  const [heard, setHeard] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [spoken, setSpoken] = useState<string[]>([]);
  const [passed, setPassed] = useState<string[]>([]);
  const [starsEarned, setStarsEarned] = useState(0);
  const [roundStars, setRoundStars] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [listened, setListened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState('Nhấn loa, nghe từ rồi chọn nghĩa nhé!');
  const [correct, setCorrect] = useState(false);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const request = useRef<AbortController | null>(null);
  const processed = useRef<string | null>(null);
  const progressRef = useRef(progress);
  useEffect(() => { progressRef.current = progress; }, [progress]);
  const word = words[index];
  const reward = treasureReward(category.id, activeProfile.gradeId);
  const alreadyEarned = progress.stickers.some(s => s.id === reward.id);
  const recording = status === 'recording';
  const locked = busy || recording || status === 'requesting' || status === 'processing';

  useEffect(() => () => { request.current?.abort(); cancel(); }, [cancel]);

  useEffect(() => {
    if (stage !== 'speak' || !audioBase64 || !audioBlob || processed.current === audioBase64) return;
    processed.current = audioBase64;
    const controller = new AbortController();
    request.current = controller;
    const attemptId = crypto.randomUUID();
    const timer = setTimeout(() => controller.abort(), 45000);
    setBusy(true);
    setMessage('Cô đang nghe lượt đọc của bé…');
    void (async () => {
      try {
        const response = await fetch('/api/pronunciation', { method: 'POST', signal: controller.signal,
          headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ attemptId, audioBase64, mimeType: audioBlob.type, targetWord: word.en, targetVi: word.vi, phonetic: word.phonetic, apiKey: apiKey || undefined, taskKind: 'word' }) });
        const data = await response.json();
        if (controller.signal.aborted) return;
        if (!response.ok || !['pass', 'practice', 'retry', 'service_error'].includes(data.status) || (data.status === 'pass' && data.passed !== true)) {
          setMessage('Cô chưa nghe được lúc này. Bé thử lại hoặc luyện tiếp nhé!'); return;
        }
        const assessment = data as PronunciationResult;
        setResult(assessment);
        setMessage(assessment.feedbackVi || 'Bé nghe mẫu rồi thử lại nhé!');
        if (assessment.status === 'pass') {
          const gained = pronunciationStarGain(progressRef.current.wordProgress[`${category.id}:${word.id}`]?.stars ?? 0, 3);
          setRoundStars(gained); setStarsEarned(prev => prev + gained);
          setPassed(prev => [...new Set([...prev, word.id])]);
        }
        // This game uses confirmed pass/fail evidence, never estimated score stars.
        recordAttempt(category.id, word.id, null, assessment.status, attemptId);
      } catch {
        if (request.current === controller) setMessage('Kết nối đang chậm. Bé thử lại hoặc luyện tiếp, không mất sao nhé!');
      } finally {
        clearTimeout(timer);
        if (request.current === controller) { request.current = null; setBusy(false); }
      }
    })();
    return () => {
      clearTimeout(timer); controller.abort();
      if (request.current === controller) { request.current = null; setBusy(false); }
    };
  }, [stage, audioBase64, audioBlob, word, apiKey, category.id, recordAttempt]);

  function resetRound() {
    cancel(); resetRecorder(); setResult(null); setRoundStars(0); setCorrect(false); setListened(false); setRevealed(false);
  }
  function nextListening() {
    const nextHeard = [...heard, word.id];
    setHeard(nextHeard); resetRound();
    if (index + 1 < words.length) { setIndex(index + 1); setMessage('Nghe từ tiếp theo và chọn nghĩa nhé!'); }
    else { setStage('match'); setIndex(0); setMessage('Chọn một từ tiếng Anh, rồi chọn nghĩa tương ứng.'); }
  }
  function match(id: string) {
    if (!selected) { setMessage('Bé chọn thẻ tiếng Anh trước nhé!'); return; }
    if (selected !== id) { setMessage('Hai thẻ chưa thành một cặp. Bé thử lại nhé!'); return; }
    const next = [...matched, id]; setMatched(next); setSelected(null); setMessage('Đúng một cặp rồi!');
    if (next.length === words.length) setMessage('Đã ghép đủ các cặp! Cùng đọc để mở rương nhé!');
  }
  function nextSpeaking() {
    const next = [...spoken, word.id];
    setSpoken(next); resetRound();
    if (index + 1 < words.length) { setIndex(index + 1); setMessage('Nghe mẫu rồi đọc từ tiếp theo nhé!'); }
    else if (treasureComplete(words, heard, matched, next)) { awardSticker(reward); setStage('done'); setMessage('Bé đã hoàn thành hành trình!'); }
  }
  const step = stage === 'listen' ? 0 : stage === 'match' ? 1 : 2;
  const steps = [{ title: 'Nghe', Icon: Headphones }, { title: 'Ghép', Icon: Puzzle }, { title: 'Nói', Icon: Mic }];

  return <section className="mt-5">
    <ol aria-label="Hành trình kho báu" className="mb-4 flex gap-2">{steps.map(({ title, Icon }, i) => <li key={title} aria-current={stage !== 'done' && i === step ? 'step' : undefined} className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-bold ${i === step ? 'border-violet-500 bg-violet-100 text-violet-800' : i < step ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500'}`}><Icon className="h-4 w-4" aria-hidden="true"/>{title}</li>)}</ol>
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      {stage === 'done' ? <div className="text-center">
        <div aria-hidden="true" className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-violet-100"><Gem className="h-16 w-16 text-violet-600 motion-safe:animate-pulse"/><Star className="absolute right-2 top-2 h-7 w-7 fill-amber-300 text-amber-500"/></div>
        <h2 className="mt-5 text-2xl font-bold">Rương đã mở!</h2><p className="mt-2 text-lg font-bold text-violet-700">{reward.emoji} {reward.name}</p>
        <p className="mt-2 text-sm text-slate-600">Quà khám phá đã có trong bộ sưu tập của bé.</p>
        <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">Đã khám phá {words.length} từ · AI xác nhận đọc đúng {passed.length}/{words.length} từ · +{starsEarned} sao mới</p>
        <p className="mt-3 text-xs leading-5 text-slate-500">Quà ghi nhận hành trình khám phá. Những từ chưa được AI xác nhận vẫn cần luyện thêm.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3"><Link href="/stickers" className={primary}><Gift className="h-5 w-5" aria-hidden="true"/>Xem quà</Link><button onClick={onRestart} className={secondary}><RotateCcw className="h-4 w-4" aria-hidden="true"/>Chơi lại</button></div>
      </div> : <>
        <div className="mb-5 flex items-center justify-between gap-2"><h2 className="text-lg font-bold">{stage === 'listen' ? 'Tìm dấu vết' : stage === 'match' ? 'Ghép bản đồ' : 'Chìa khóa giọng nói'}</h2><span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-bold text-violet-700">{stage === 'match' ? matched.length : index + 1}/{words.length}</span></div>
        {stage === 'listen' && <>
          <div className="mb-5 text-center"><button disabled={correct} onClick={() => speak(word.en, 'en-US', 0.85, undefined, () => setListened(true))} className={`${primary} min-w-40`}><Volume2 className="h-6 w-6" aria-hidden="true"/>{isSpeaking ? 'Đang đọc…' : 'Nghe từ'}</button>{revealed && <p className="mt-3 text-2xl font-bold text-violet-700">{word.en}</p>}</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{treasureChoices(words, word, `${seed}:${word.id}`).map(option => <button key={option.id} disabled={correct || (!listened && !revealed)} onClick={() => { if (option.id === word.id) { cancel(); setCorrect(true); setMessage(`Đúng rồi! ${word.en}: ${word.vi}`); } else setMessage('Bé nghe lại và thử chọn nghĩa khác nhé!'); }} className={`min-h-14 rounded-2xl border px-4 py-3 text-left font-bold disabled:opacity-60 ${correct && option.id === word.id ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : 'border-slate-200 hover:border-violet-400 hover:bg-violet-50'}`}>{option.vi}</button>)}</div>
          {!correct && <button onClick={() => { cancel(); setRevealed(true); setMessage('Bé có thể đọc từ để tìm nghĩa, rồi nghe lại khi âm thanh sẵn sàng.'); }} className="mt-4 min-h-11 text-sm font-semibold text-slate-500 underline">Cần gợi ý? Xem từ</button>}
          {correct && <button onClick={nextListening} className={`${primary} mt-5 w-full`}>Tiếp tục<ArrowRight className="h-5 w-5" aria-hidden="true"/></button>}
        </>}
        {stage === 'match' && <>
          <div className="grid grid-cols-2 gap-3"><div className="space-y-3"><p className="text-xs font-bold text-slate-500">Tiếng Anh</p>{words.map(w => <button key={w.id} disabled={matched.includes(w.id)} aria-pressed={selected === w.id} onClick={() => { setSelected(w.id); setMessage(`Tìm nghĩa của ${w.en} nhé!`); }} className={`flex min-h-16 w-full items-center justify-center gap-1 break-words rounded-2xl border px-2 py-3 text-sm font-bold ${matched.includes(w.id) ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : selected === w.id ? 'border-violet-500 bg-violet-100 text-violet-800 ring-2 ring-violet-200' : 'border-slate-200 hover:bg-violet-50'}`}>{matched.includes(w.id) && <Check className="h-4 w-4 shrink-0" aria-hidden="true"/>}{w.en}</button>)}</div><div className="space-y-3"><p className="text-xs font-bold text-slate-500">Nghĩa tiếng Việt</p>{shuffle(words, `${seed}:match`).map(w => <button key={w.id} disabled={matched.includes(w.id)} onClick={() => match(w.id)} className={`flex min-h-16 w-full items-center justify-center gap-1 break-words rounded-2xl border px-2 py-3 text-sm font-bold ${matched.includes(w.id) ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:bg-amber-50'}`}>{matched.includes(w.id) && <Check className="h-4 w-4 shrink-0" aria-hidden="true"/>}{w.vi}</button>)}</div></div>
          {matched.length === words.length && <button onClick={() => { setStage('speak'); setIndex(0); setMessage('Nghe mẫu rồi đọc từ nhé!'); }} className={`${primary} mt-5 w-full`}>Đến rương bí mật<ArrowRight className="h-5 w-5" aria-hidden="true"/></button>}
        </>}
        {stage === 'speak' && <>
          <div className="rounded-3xl bg-violet-50 px-4 py-6 text-center"><p className="break-words text-3xl font-bold text-violet-800 sm:text-4xl">{word.en}</p><p className="mt-2 text-slate-600">{word.vi}</p></div>
          <div className="mt-4 flex flex-wrap justify-center gap-3"><button disabled={locked} onClick={() => speak(word.en, 'en-US', 0.7)} className={secondary}><Volume2 className="h-5 w-5" aria-hidden="true"/>Nghe mẫu chậm</button><button disabled={busy || status === 'requesting' || status === 'processing' || passed.includes(word.id)} onClick={() => { if (recording) stopRecording(); else { cancel(); resetRecorder(); setResult(null); processed.current = null; void startRecording(); } }} className={primary}>{busy || status === 'requesting' || status === 'processing' ? <LoaderCircle className="h-5 w-5 motion-safe:animate-spin" aria-hidden="true"/> : recording ? <Square className="h-5 w-5" aria-hidden="true"/> : <Mic className="h-5 w-5" aria-hidden="true"/>}{recording ? 'Dừng thu' : passed.includes(word.id) ? 'Đã đọc đúng' : 'Bé đọc thử'}</button></div>
          {recording && <div className="mt-3"><p className="text-center text-sm text-violet-700">Cô đang nghe. Bé đọc tự nhiên nhé!</p><div aria-hidden="true" className="mx-auto mt-2 h-2 max-w-40 overflow-hidden rounded-full bg-violet-100"><div className="h-full bg-violet-500" style={{ width: `${Math.min(100, inputLevel * 500)}%` }}/></div></div>}
          {!apiKey && !hasServerKey && <p className="mt-3 text-center text-xs text-slate-500">Nếu AI chưa sẵn sàng, bé vẫn có thể nghe và luyện tiếp.</p>}
          {result?.status === 'pass' && <p className="mt-4 text-center font-bold text-emerald-700">{roundStars > 0 ? `Đọc đúng! +${roundStars} sao` : 'Đọc đúng! Từ này đã có đủ 3 sao.'}</p>}
          <button disabled={locked} onClick={nextSpeaking} className={`${passed.includes(word.id) ? primary : secondary} mt-5 w-full`}>{passed.includes(word.id) ? 'Tiếp tục' : 'Luyện tiếp · chưa cộng sao'}<ArrowRight className="h-5 w-5" aria-hidden="true"/></button>
        </>}
      </>}
      <p role="status" aria-live="polite" className="mt-4 rounded-2xl bg-slate-50 p-3 text-center text-sm leading-6 text-slate-600">{stage === 'speak' ? recorderError || audioError || message : stage === 'listen' && !correct ? audioError || message : message}</p>
      {alreadyEarned && stage !== 'done' && <p className="mt-3 text-center text-xs text-slate-500">Bé đã có quà Unit này. Chơi lại để luyện thêm nhé!</p>}
    </div>
  </section>;
}
