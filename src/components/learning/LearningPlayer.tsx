'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useProfileContext } from '@/context/ProfileContext';
import { useTTS } from '@/hooks/useTTS';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { GRADE_CONFIG } from '@/lib/learning/curriculum';
import { checkAnswer, createSession, generateActivities, isIndependent, nextReviewDate, validateActivities } from '@/lib/learning/engine';
import { dueVocabularyIds, sessionsFor, skillReport } from '@/lib/learning/progress';
import { ACTIVITY_LABELS, CONTENT_VERSION, type Activity, type AnswerEvidence, type CurriculumUnit, type LearningSession, type VocabularyItem } from '@/lib/learning/types';

const button = 'min-h-11 rounded-2xl px-5 py-3 font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-40 disabled:cursor-not-allowed';
const primary = `${button} bg-orange-600 text-white hover:bg-orange-600`;
const secondary = `${button} bg-orange-50 text-orange-900 border border-slate-200 hover:bg-orange-100`;

function subscribeAudio(callback: () => void) {
  window.speechSynthesis?.addEventListener('voiceschanged', callback);
  return () => window.speechSynthesis?.removeEventListener('voiceschanged', callback);
}
function audioSnapshot() { return !!window.speechSynthesis?.getVoices().some(v => v.lang.startsWith('en')); }
export function useEnglishAudio() { return useSyncExternalStore(subscribeAudio, audioSnapshot, () => false); }

function RecordingPractice({ onPracticed, stopAudio }: { onPracticed: () => void; stopAudio: () => void }) {
  const recorder = useAudioRecorder('sentence');
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (!recorder.audioBlob) return;
    const url = URL.createObjectURL(recorder.audioBlob);
    const element = audioRef.current;
    if (element) element.src = url;
    return () => { element?.pause(); URL.revokeObjectURL(url); };
  }, [recorder.audioBlob]);
  return <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
    <p className="text-sm">Ghi âm tùy chọn để tự nghe lại. Audio chỉ ở phiên này, không gửi lên server. Chưa chấm phát âm.</p>
    <div className="flex flex-wrap gap-2">
      <button className={secondary} disabled={recorder.status === 'requesting' || recorder.status === 'processing'} onClick={() => {
        if (recorder.status === 'recording') recorder.stopRecording(); else { stopAudio(); audioRef.current?.pause(); void recorder.startRecording(); }
      }}>{recorder.status === 'recording' ? '⏹ Dừng ghi' : recorder.status === 'requesting' ? 'Đang xin quyền micro…' : '🎙 Ghi âm để nghe lại'}</button>
      <button className={secondary} onClick={onPracticed}>Tôi đã thử nói (không ghi âm)</button>
    </div>
    {recorder.error && <p role="alert" className="text-sm text-rose-700">{recorder.error} Con vẫn có thể thử nói và tiếp tục.</p>}
    <audio ref={audioRef} controls aria-label="Nghe lại giọng của con" className={recorder.audioBlob ? 'max-w-full' : 'hidden'} onPlay={() => { stopAudio(); onPracticed(); }} />
  </div>;
}

function WordDetails({ word, onClose, speak }: { word: VocabularyItem; onClose: () => void; speak: (text: string) => void }) {
  return <aside className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 space-y-2" aria-label={`Từ ${word.text}`}>
    <div className="flex justify-between gap-3"><strong>{word.text}</strong><button className={secondary} onClick={onClose}>Đóng phần từ</button></div>
    <p>{word.senses[0].meaningVi}</p><p>{word.senses[0].exampleEn}</p><p className="text-sm text-slate-600">{word.senses[0].exampleVi}</p>
    <button className={secondary} onClick={() => speak(word.text)}>🔊 Nghe từ</button>
  </aside>;
}

function ContextText({ text, vocabulary, onWord }: { text: string; vocabulary: VocabularyItem[]; onWord: (word: VocabularyItem) => void }) {
  const terms = vocabulary.map(v => v.text).sort((a, b) => b.length - a.length).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!terms.length) return <p className="text-2xl font-bold leading-relaxed">{text}</p>;
  const pieces = text.split(new RegExp(`(\\b(?:${terms.join('|')})\\b)`, 'gi'));
  return <p className="text-2xl font-bold leading-relaxed">{pieces.map((piece, i) => {
    const word = vocabulary.find(v => v.text.toLowerCase() === piece.toLowerCase());
    return word ? <button key={i} className="min-h-11 underline decoration-dotted text-orange-700 px-1 rounded focus-visible:outline-2" onClick={() => onWord(word)}>{piece}</button> : <span key={i}>{piece}</span>;
  })}</p>;
}

function Flashcard({ word, mode, onRate, speak, audioAvailable }: { word: VocabularyItem; mode: LearningSession['cardMode']; onRate: (rating: 'remember' | 'again') => void; speak: (text: string) => void; audioAvailable: boolean }) {
  const [revealed, setRevealed] = useState(mode === 'familiar');
  const [showIpa, setShowIpa] = useState(false);
  const sense = word.senses[0];
  return <div className="space-y-5 text-center">
    {sense.emoji && mode !== 'listen' && <div className="text-7xl" role="img" aria-label={sense.meaningVi}>{sense.emoji}</div>}
    {mode === 'listen' && !revealed ? <p className="text-xl font-bold">Nghe trước, đoán từ rồi mở thẻ.</p> : <h2 className="text-4xl font-bold break-words">{word.text}</h2>}
    <button className={secondary} disabled={!audioAvailable} onClick={() => speak(word.text)}>🔊 Nghe từ</button>
    {revealed ? <div className="space-y-3">
      <p className="text-xl text-orange-700 font-bold">{sense.meaningVi}</p>
      <p className="text-lg">{sense.exampleEn}</p><p className="text-sm text-slate-500">{sense.exampleVi}</p>
      <button className={secondary} disabled={!audioAvailable} onClick={() => speak(sense.exampleEn)}>🔊 Nghe câu mẫu</button>
      {word.ipa && <div><button className={button} onClick={() => setShowIpa(!showIpa)} aria-expanded={showIpa}>Phiên âm (tùy chọn)</button>{showIpa && <p>{word.ipa}</p>}</div>}
    </div> : <button className={primary} onClick={() => setRevealed(true)}>Mở nghĩa & câu mẫu</button>}
    <p className="text-xs text-slate-500">Nhớ rồi là tự đánh giá, chưa phải kết luận thành thạo.</p>
    <div className="flex flex-wrap justify-center gap-3"><button className={secondary} onClick={() => onRate('again')}>Cần xem lại</button><button className={primary} onClick={() => onRate('remember')}>Nhớ rồi →</button></div>
  </div>;
}

function Question({ activity, saved, save, onNext, speak, audioAvailable, audioError, previousIndependent = 0 }: {
  activity: Activity; saved?: AnswerEvidence; save: (evidence: AnswerEvidence) => void; onNext: () => void;
  speak: (text: string, onStarted: () => void) => void; audioAvailable: boolean; audioError: string | null; previousIndependent?: number;
}) {
  const [response, setResponse] = useState(saved?.response ?? '');
  const [selected, setSelected] = useState<string[]>([]);
  const [hinted, setHinted] = useState(saved?.hinted ?? false);
  const [revealed, setRevealed] = useState(saved?.revealed ?? false);
  const [audioPlayed, setAudioPlayed] = useState(saved?.audioPlayed ?? false);
  const [attempts, setAttempts] = useState(saved?.attempts ?? 0);
  const [correct, setCorrect] = useState(saved?.correct ?? false);
  const [feedback, setFeedback] = useState(saved ? saved.correct ? 'Con đã trả lời đúng.' : saved.attempts ? 'Con có thể thử lại hoặc xem đáp án.' : '' : '');
  const needsAudio = activity.skill === 'listening';
  const answerText = 'options' in activity ? activity.options.find(o => o.id === activity.answerId)?.text ?? '' : activity.kind === 'letter-order' ? activity.answer : activity.answers[0];
  const evidence = (overrides: Partial<AnswerEvidence> = {}): AnswerEvidence => ({ history: saved?.history ?? [], activityId: activity.id, vocabularyId: activity.vocabularyId, senseId: activity.senseId, objectiveIds: activity.objectiveIds, skill: activity.skill, attempts, firstCorrect: saved?.firstCorrect ?? false, correct, hinted, revealed, audioPlayed, response, completedAt: new Date().toISOString(), reviewDueDate: nextReviewDate(false), ...overrides });
  const submit = () => {
    const right = checkAnswer(activity, response);
    const next = evidence({ attempts: attempts + 1, correct: right, firstCorrect: attempts === 0 ? right : saved?.firstCorrect ?? false, history: [...(saved?.history ?? []), { response, correct: right, at: new Date().toISOString() }] });
    next.reviewDueDate = nextReviewDate(isIndependent(next), previousIndependent);
    setAttempts(next.attempts); setCorrect(right); save(next);
    setFeedback(right ? isIndependent(next) ? '✓ Con tự làm được ngay lần đầu!' : '✓ Con đã làm được sau khi luyện hoặc có hỗ trợ.' : 'Chưa đúng. Con thử lại nhé; có thể mở gợi ý.');
  };
  const options = 'options' in activity ? (attempts >= 2 ? activity.options.filter(o => o.id === activity.answerId || o.id === activity.options.find(x => x.id !== activity.answerId)?.id) : activity.options) : [];
  return <div className="space-y-5">
    <p className="text-sm font-bold text-orange-700">{ACTIVITY_LABELS[activity.kind]}</p>
    <h2 className="text-2xl font-bold break-words">{activity.instruction}</h2>
    {activity.kind === 'context-choice' && <p className="text-xl">{activity.text}</p>}
    {'audioText' in activity && activity.audioText && <button className={secondary} disabled={!audioAvailable} onClick={() => speak(activity.audioText!, () => { setAudioPlayed(true); save(evidence({ audioPlayed: true })); })}>🔊 Nghe / nghe lại</button>}
    {needsAudio && (!audioAvailable || audioError) && <p role="status" className="text-rose-700">Bài nghe chưa được đánh giá. Con có thể bỏ qua và tiếp tục.</p>}
    {'options' in activity ? <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Chọn đáp án">{options.map(option => <button key={option.id} disabled={correct || revealed} aria-pressed={response === option.id} className={`${button} border-2 text-left ${response === option.id ? 'border-violet-600 bg-slate-50' : 'border-slate-200 bg-white'}`} onClick={() => setResponse(option.id)}>{response === option.id ? '● ' : '○ '}{option.text}</button>)}</div>
      : activity.kind === 'letter-order' ? <div className="space-y-3">
        <div className="min-h-14 rounded-2xl border-2 border-slate-200 p-3 text-2xl font-bold" aria-live="polite">{response || 'Chạm chữ theo thứ tự'}</div>
        <div className="flex flex-wrap gap-2">{activity.tokens.map(token => <button key={token.id} className={secondary} disabled={selected.includes(token.id) || correct || revealed} aria-label={token.text === ' ' ? 'Khoảng trắng' : `Chữ ${token.text}`} onClick={() => { const next = [...selected, token.id]; setSelected(next); setResponse(next.map(id => activity.tokens.find(t => t.id === id)!.text).join('')); }}>{token.text === ' ' ? '␣' : token.text}</button>)}</div>
        <button className={secondary} disabled={correct || revealed} onClick={() => { setSelected([]); setResponse(''); }}>Xếp lại</button>
      </div> : <label className="block space-y-2"><span className="font-bold">Từ/cụm từ của con</span><input className="w-full min-h-12 rounded-2xl border-2 border-slate-200 p-3 text-xl" value={response} autoComplete="off" autoCorrect="off" spellCheck={false} disabled={correct || revealed} onChange={e => setResponse(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && response.trim() && (!needsAudio || (audioPlayed && !audioError))) submit(); }} /></label>}
    {hinted && <p className="rounded-xl bg-amber-50 p-3">Gợi ý: {activity.hint}</p>}
    {revealed && <p className="rounded-xl bg-slate-50 p-3">Đáp án: <strong>{answerText}</strong>. Mục này cần ôn lại.</p>}
    {feedback && <p role="status" aria-live="polite" className="font-bold">{feedback}</p>}
    <div className="flex flex-wrap gap-2">
      {!correct && !revealed && <>
        <button className={primary} disabled={!response.trim() || (needsAudio && (!audioPlayed || !audioAvailable || !!audioError))} onClick={submit}>Kiểm tra</button>
        <button className={secondary} onClick={() => { setHinted(true); save(evidence({ hinted: true })); }}>Gợi ý</button>
        <button className={secondary} onClick={() => { setRevealed(true); save(evidence({ revealed: true, attempts: Math.max(1, attempts) })); }}>Xem đáp án / bỏ qua</button>
      </>}
      {(correct || revealed) && <button className={primary} onClick={onNext}>Tiếp tục →</button>}
    </div>
  </div>;
}

export function LearningPlayer({ unit }: { unit: CurriculumUnit }) {
  const { hydrated, activeProfileId } = useProfileContext();
  if (!hydrated) return <p className="p-8" role="status">Đang mở hồ sơ…</p>;
  return <Player key={`${activeProfileId}:${unit.id}:v${CONTENT_VERSION}`} unit={unit} />;
}

function Player({ unit }: { unit: CurriculumUnit }) {
  const ctx = useProfileContext();
  const history = sessionsFor(ctx.progress.learningSessions, ctx.activeProfileId).filter(s => s.unitId === unit.id);
  const [session, setSession] = useState<LearningSession | null>(() => history.find(s => validateActivities(s.activities, unit).length === 0) ?? null);
  const [notice, setNotice] = useState('');
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [contextTranslation, setContextTranslation] = useState(false);
  const audioAvailable = useEnglishAudio();
  const { speak, cancel, error: audioError } = useTTS();
  const weakIds = dueVocabularyIds(history, unit.id);
  const save = (next: LearningSession) => {
    const updated = { ...next, updatedAt: new Date().toISOString() };
    const result = ctx.saveLearningSession(updated);
    setSession(updated);
    setNotice(result.success ? '' : result.message ?? 'Chưa lưu được tiến trình.');
  };
  const move = (next: LearningSession) => { cancel(); setSelectedWord(null); setContextTranslation(false); save(next); };
  const finish = () => { if (session) move({ ...session, stage: 'result', completed: true, rewardGranted: true }); };
  const start = (mode: LearningSession['mode']) => {
    cancel(); save(createSession(unit, ctx.activeProfileId, mode, audioAvailable, mode === 'review' ? weakIds : undefined));
  };
  const cardWords = unit.vocabulary.slice(0, GRADE_CONFIG[unit.grade].batch);
  const word = session ? cardWords[Math.min(session.cardIndex, cardWords.length - 1)] : undefined;
  const activity = session?.activities[session.activityIndex];
  const scene = session && unit.resource ? unit.resource.scenes[Math.min(session.sceneIndex, unit.resource.scenes.length - 1)] : undefined;
  const summaries = session ? skillReport([session]) : [];
  const availableModes = (Object.keys(ACTIVITY_LABELS) as Activity['kind'][]).filter(kind =>
    (!['spelling', 'dictation'].includes(kind) || GRADE_CONFIG[unit.grade].writing) &&
    (!['dictation', 'listen-choice'].includes(kind) || audioAvailable) &&
    (kind !== 'context-choice' || !!unit.resource));

  const practiceRoom = <details className="border-t pt-4"><summary className="min-h-11 cursor-pointer font-bold">Phòng luyện từ · chọn dạng luyện</summary>
    <div className="mt-4 space-y-4">
      <div><h3 className="font-bold mb-2">1. Học từ</h3><div className="flex flex-wrap gap-2">{([['familiar', 'Làm quen'], ['recall', 'Tự nhớ'], ['listen', 'Nghe trước']] as const).map(([cardMode, label]) => <button key={cardMode} className={secondary} disabled={cardMode === 'listen' && !audioAvailable} onClick={() => { cancel(); save({ ...createSession(unit, ctx.activeProfileId, 'path', audioAvailable), cardMode }); }}>{label}</button>)}</div></div>
      <div><h3 className="font-bold mb-2">2. Nghe & chọn</h3><div className="flex flex-wrap gap-2">{availableModes.filter(m => ['meaning-choice', 'word-choice', 'listen-choice'].includes(m)).map(mode => <button key={mode} className={secondary} onClick={() => start(mode)}>{ACTIVITY_LABELS[mode]}</button>)}</div></div>
      <div><h3 className="font-bold mb-2">3. Nhớ & viết</h3><div className="flex flex-wrap gap-2">{availableModes.filter(m => ['letter-order', 'spelling', 'dictation'].includes(m)).map(mode => <button key={mode} className={secondary} onClick={() => start(mode)}>{ACTIVITY_LABELS[mode]}</button>)}</div></div>
      <div><h3 className="font-bold mb-2">4. Chơi & ôn</h3><div className="flex flex-wrap gap-2"><button className={secondary} disabled={!weakIds.length} onClick={() => start('review')}>Ôn {weakIds.length} mục cần luyện</button><Link className={secondary} href={`/wordsearch/${unit.id}`}>Tìm từ (trò chơi hiện có)</Link><Link className={secondary} href={`/test/${unit.id}`}>Bài luyện & ghép thẻ hiện có</Link></div></div>
      <div><h3 className="font-bold mb-2">5. Nói & dùng từ</h3><div className="flex flex-wrap gap-2">{unit.resource ? <><button className={secondary} onClick={() => start('context-choice')}>Hiểu tình huống</button><button className={secondary} onClick={() => { cancel(); save({ ...createSession(unit, ctx.activeProfileId, 'path', audioAvailable), stage: 'resource' }); }}>Đọc, nói & vận dụng</button></> : <p className="text-sm text-slate-500">Ngữ cảnh bổ trợ cho bài này đang chờ biên soạn.</p>}</div></div>
    </div>
  </details>;

  return <main className="learning-shell min-h-screen bg-gradient-to-br from-orange-50 via-white to-violet-50 px-4 py-6 pb-24">
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3"><Link className={secondary} href={`/curriculum?grade=${unit.grade}`}>← Chọn bài</Link><button className={secondary} onClick={ctx.openProfileModal}>{ctx.activeProfile.avatar} {ctx.activeProfile.name} · Đổi hồ sơ</button></header>
      <div><p className="text-sm font-bold text-orange-700">Nội dung bổ trợ VocaKids · Bản thí điểm cần đối chiếu</p><h1 className="mt-2 text-3xl font-bold">{unit.emoji} {unit.title}</h1><p className="mt-2 text-slate-600">{GRADE_CONFIG[unit.grade].description}</p></div>
      {notice && <div role="alert" className="rounded-2xl bg-rose-50 p-4 text-rose-700">{notice}<button className={secondary} onClick={() => session && save(session)}>Thử lưu lại</button></div>}
      {audioError && <p role="alert" className="rounded-2xl bg-amber-50 p-3">{audioError}</p>}
      {!audioAvailable && <p className="text-sm text-slate-500">Chưa có giọng đọc tiếng Anh trên thiết bị. Phần đọc vẫn hoạt động; bài nghe sẽ mở khi có giọng phù hợp.</p>}
      {!session ? <section className="rounded-2xl bg-white border border-slate-200 p-6 space-y-5 shadow-sm">
        <h2 className="text-xl font-bold">Một chặng học ngắn</h2><p>Học từ → luyện nhớ → gặp từ trong ngữ cảnh → thử dùng từ → kết quả.</p>
        <button className={primary} disabled={!unit.vocabulary.length} onClick={() => start('path')}>▶ Luyện từ theo chặng</button>
        {!!weakIds.length && <button className={`${secondary} ml-2`} onClick={() => start('review')}>Ôn {weakIds.length} mục cần luyện</button>}
        {practiceRoom}
        {history.length > 0 && <p className="text-sm text-slate-500">Đã lưu {history.length} lượt học cho hồ sơ này. Học lại tạo lượt mới.</p>}
      </section> : <section className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-8 shadow-sm space-y-6">
        <div className="flex justify-between gap-2 text-xs font-bold text-slate-500"><span>{session.stage === 'cards' ? '1 · Làm quen' : session.stage === 'activities' ? '2 · Luyện tập' : session.stage === 'resource' ? '3 · Ngữ cảnh' : session.stage === 'application' ? '4 · Vận dụng' : '5 · Kết quả'}</span><span>Tiến trình tự lưu theo bé</span></div>
        {session.stage === 'cards' && word && <>
          <div className="flex flex-wrap gap-2" aria-label="Chế độ thẻ">{([['familiar', 'Làm quen'], ['recall', 'Tự nhớ'], ['listen', 'Nghe trước']] as const).map(([mode, label]) => <button key={mode} className={session.cardMode === mode ? primary : secondary} disabled={mode === 'listen' && !audioAvailable} onClick={() => move({ ...session, cardMode: mode })}>{label}</button>)}</div>
          <p className="text-sm text-center">Thẻ {session.cardIndex + 1}/{cardWords.length}</p>
          <Flashcard key={`${word.id}:${session.cardMode}`} word={word} mode={session.cardMode} speak={speak} audioAvailable={audioAvailable} onRate={rating => move({ ...session, cardRatings: { ...session.cardRatings, [word.id]: rating }, cardIndex: session.cardIndex + 1 < cardWords.length ? session.cardIndex + 1 : session.cardIndex, stage: session.cardIndex + 1 < cardWords.length ? 'cards' : 'activities' })} />
        </>}
        {session.stage === 'activities' && (activity ? <><p className="text-sm">Câu {session.activityIndex + 1}/{session.activities.length}</p><Question key={activity.id} activity={activity} saved={session.evidence[activity.id]} previousIndependent={history.filter(s => s.id !== session.id).flatMap(s => Object.values(s.evidence)).filter(e => e.vocabularyId === activity.vocabularyId && e.skill === activity.skill && isIndependent(e)).length} audioAvailable={audioAvailable} audioError={audioError} speak={(text, onStarted) => speak(text, 'en-US', 0.85, onStarted)} save={e => save({ ...session, evidence: { ...session.evidence, [activity.id]: e } })} onNext={() => {
          if (session.activityIndex + 1 < session.activities.length) move({ ...session, activityIndex: session.activityIndex + 1 });
          else if (session.mode === 'path' && unit.resource) move({ ...session, stage: session.resourceRead ? 'application' : 'resource' });
          else finish();
        }} /></> : <><p>Chưa có câu phù hợp cho dạng luyện này. Con có thể tiếp tục đọc ngữ cảnh hoặc chọn dạng khác.</p><button className={primary} onClick={() => session.mode === 'path' && unit.resource ? move({ ...session, stage: 'resource' }) : finish()}>Tiếp tục</button></>)}
        {session.stage === 'resource' && scene && unit.resource && <>
          <h2 className="text-2xl font-bold">{unit.resource.title}</h2><p className="text-sm">Cảnh {session.sceneIndex + 1}/{unit.resource.scenes.length} · Chạm từ gạch chân để mở thẻ. Câu bổ trợ mới có nghĩa tiếng Việt.</p>
          {scene.speaker && <p className="font-bold text-orange-700">{scene.speaker}</p>}
          <ContextText text={scene.en} vocabulary={unit.vocabulary.filter(v => scene.vocabularyIds.includes(v.id))} onWord={setSelectedWord} />
          <div className="flex flex-wrap gap-2"><button className={secondary} disabled={!audioAvailable} onClick={() => speak(scene.en)}>🔊 Nghe cảnh</button><button className={secondary} aria-expanded={contextTranslation} onClick={() => setContextTranslation(!contextTranslation)}>Nghĩa tiếng Việt</button></div>
          {contextTranslation && <p className="text-slate-600">{scene.vi}</p>}
          {selectedWord && <WordDetails word={selectedWord} speak={speak} onClose={() => setSelectedWord(null)} />}
          <div className="flex justify-between gap-3"><button className={secondary} disabled={session.sceneIndex === 0} onClick={() => move({ ...session, sceneIndex: session.sceneIndex - 1 })}>← Cảnh trước</button><button className={primary} onClick={() => {
            if (session.sceneIndex + 1 < unit.resource!.scenes.length) move({ ...session, sceneIndex: session.sceneIndex + 1 });
            else {
              const context = generateActivities(unit, session.id + ':context', 'context-choice', audioAvailable);
              move({ ...session, resourceRead: true, activities: [...session.activities, ...context], activityIndex: session.activities.length, stage: context.length ? 'activities' : 'application' });
            }
          }}>{session.sceneIndex + 1 < unit.resource.scenes.length ? 'Cảnh tiếp →' : 'Thử hiểu & dùng từ →'}</button></div>
        </>}
        {session.stage === 'application' && unit.resource && <>
          <h2 className="text-2xl font-bold">Đến lượt con!</h2><p>{unit.resource.application.instruction}</p>
          <div className="rounded-2xl bg-orange-50 p-4 space-y-2">{unit.resource.application.prompts.map(p => <p key={p} className="font-bold">{p}</p>)}<p className="text-sm">Mẫu: {unit.resource.application.example}</p><p className="text-sm text-slate-600">{unit.resource.application.exampleVi}</p><button className={secondary} disabled={!audioAvailable} onClick={() => speak(unit.resource!.application.example)}>🔊 Nghe mẫu</button></div>
          {GRADE_CONFIG[unit.grade].writing && <label className="block space-y-2"><span className="font-bold">Câu của con (tùy chọn)</span><textarea className="w-full rounded-2xl border-2 border-slate-200 p-3" rows={4} maxLength={2000} value={session.applicationResponse} onChange={e => save({ ...session, applicationResponse: e.target.value })} /></label>}
          <RecordingPractice stopAudio={cancel} onPracticed={() => save({ ...session, speakingPracticed: true })} />
          <div className="flex flex-wrap gap-2"><button className={primary} onClick={() => move({ ...session, applicationCompleted: true, completed: true, rewardGranted: true, stage: 'result' })}>Tôi đã thực hành → Kết quả</button><button className={secondary} onClick={finish}>Để luyện sau</button></div>
        </>}
        {session.stage === 'result' && <>
          <h2 className="text-3xl font-bold">🌱 Con đã hoàn thành lượt luyện!</h2><p>Thưởng nỗ lực: 1 sao và sticker cho lần hoàn thành đầu tiên của bài/phiên bản. Học lại vẫn lưu kết quả, không cộng thưởng lặp.</p>
          <div className="grid gap-3 sm:grid-cols-2">{summaries.filter(s => s.practiced > 0).map(s => <div key={s.skill} className="rounded-2xl bg-slate-50 p-4"><h3 className="font-bold">{s.label}</h3><p>{s.independent} mục tự làm được · {s.supported} mục có hỗ trợ</p><p>{s.needsReview} mục cần ôn</p></div>)}</div>
          <p>Vận dụng: {session.applicationCompleted ? 'đã thực hành, chưa chấm' : 'chưa thực hành'}. Nói: {session.speakingPracticed ? 'đã thử, chưa chấm' : 'chưa ghi nhận'}.</p>
          <p className="text-sm text-slate-500">Kết quả một lượt chưa phải kết luận thành thạo. Thẻ “Nhớ rồi” không tính là đáp án đúng độc lập.</p>
          <div className="flex flex-wrap gap-2"><button className={primary} onClick={() => { cancel(); setSession(null); }}>Chọn chặng tiếp theo</button><button className={secondary} onClick={() => start('review')}>Ôn mục cần luyện</button><Link className={secondary} href="/learning-report">Xem báo cáo kỹ năng</Link></div>
        </>}
      </section>}
      {session && <section className="rounded-2xl bg-white border border-slate-200 p-5">{practiceRoom}</section>}
      <footer className="text-xs text-slate-500">ID và dữ liệu cũ được giữ nguyên. Ấn bản, tập và mục tiêu chính khóa đang chờ đối chiếu; đây là nội dung bổ trợ thí điểm.</footer>
    </div>
  </main>;
}
