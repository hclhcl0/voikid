'use client';

import Link from 'next/link';
import { Suspense, useEffect, useEffectEvent, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Shield, Sparkles, Swords, Volume2, Zap } from 'lucide-react';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { useProfileContext } from '@/context/ProfileContext';
import { useTTS } from '@/hooks/useTTS';
import { useArenaSound } from '@/hooks/useArenaSound';
import { arenaReward, arenaDifficulties, arenaResult, arenaWords, arenaSpeedTier, answerArena, createArenaQuestions, initialArena, type ArenaQuestion, type ArenaState } from '@/lib/arena';
import type { Category } from '@/types';
import { FighterArt, type FighterKind } from '@/components/arena/FighterArt';
import { BattleStage } from '@/components/arena/BattleStage';
import styles from './arena.module.css';

const fighters: { kind: FighterKind; name: string; power: string }[] = [
  { kind: 'flower', name: 'Tiên Hoa', power: 'Cánh hoa nhiệm màu' },
  { kind: 'star', name: 'Pháp sư Sao', power: 'Ánh sao tri thức' },
  { kind: 'rainbow', name: 'Hiệp sĩ Cầu Vồng', power: 'Kiếm cầu vồng' },
  { kind: 'valkyrie-1', name: 'Valkyrie Bình Minh', power: 'Kiếm bình minh' },
  { kind: 'valkyrie-2', name: 'Valkyrie Cầu Vồng', power: 'Ánh sáng tri thức' },
  { kind: 'valkyrie-3', name: 'Valkyrie Ngôi Sao', power: 'Sức mạnh ngôi sao' },
  { kind: 'seer-1', name: 'Seer Ánh Trăng', power: 'Phép thuật trí nhớ' },
  { kind: 'seer-2', name: 'Seer Ngân Hà', power: 'Phép thuật từ vựng' },
  { kind: 'seer-3', name: 'Seer Sao Mai', power: 'Phép thuật khám phá' },
  { kind: 'fox', name: 'Kiếm sĩ Ánh Sáng', power: 'Kiếm phép tri thức' },
  { kind: 'panda', name: 'Hộ vệ Bầu Trời', power: 'Thanh kiếm kiên trì' },
  { kind: 'rabbit', name: 'Hiệp sĩ Hoàng Hôn', power: 'Lưỡi kiếm từ vựng' },
];

const opponents: { kind: FighterKind; name: string }[] = [
  { kind: 'skeleton_warrior-1', name: 'Chiến binh Xương 1' },
  { kind: 'skeleton_warrior-2', name: 'Chiến binh Xương 2' },
  { kind: 'skeleton_warrior-3', name: 'Chiến binh Xương 3' },
  { kind: 'dark_oracle-1', name: 'Oracle Huyền Bí 1' },
  { kind: 'dark_oracle-2', name: 'Oracle Huyền Bí 2' },
  { kind: 'dark_oracle-3', name: 'Oracle Huyền Bí 3' },
];

export default function ArenaPage() {
  return <Suspense fallback={<p role="status">Đang nạp đấu trường…</p>}><ArenaPageContent /></Suspense>;
}

function ArenaPageContent() {
  const query = useSearchParams();
  const entry = { category: query.get('category') ?? '', words: query.getAll('word') };
  const { categories, settings } = useVocabularyCatalog();
  const { categories: custom, hydrated: customHydrated } = useCustomCategories();
  const profile = useProfileContext();
  const grade = profile.activeProfile.gradeId;
  const available = [...(customHydrated ? custom.filter(c => !c.gradeId || c.gradeId === grade) : []), ...categories.filter(c => c.gradeId === grade)]
    .map(c => entry?.words.length ? { ...c, words: c.words.filter(w => entry.words.includes(`${c.id}:${w.id}`)) } : c)
    .filter((category, index, all) => arenaWords(category.words).length >= 2 && all.findIndex(c => c.id === category.id) === index);

  return <div className={styles.page}>
    <header className={styles.header}><Link href="/" className={styles.back}><ArrowLeft size={18} /> Trang chủ</Link><span className={styles.brand}><Swords size={19} /> Đấu trường từ vựng</span><span className={styles.profile}>{profile.activeProfile.name || 'VocaKids'}</span></header>
    <main className={styles.main}>
      {!profile.hydrated || !customHydrated || !entry ? <p role="status">Đang nạp đấu trường…</p>
        : !settings.showGames ? <div className={styles.card}><h1>Trò chơi đang tạm nghỉ</h1><p>Con có thể tiếp tục học từ và luyện tập nhé.</p><Link href="/" className={styles.primary}>Về trang chủ</Link></div>
        : !profile.activeProfile.id ? <div className={styles.card}><h1>Chọn hồ sơ để chơi</h1><p>Chọn học sinh để dùng chủ đề và lưu kết quả của bé.</p><button className={styles.primary} onClick={profile.openProfileModal}>Chọn hồ sơ</button></div>
        : <Arena key={`${profile.activeProfile.id}:${grade}:${query.toString()}`} categories={available} initialCategory={entry.category} />}
    </main>
  </div>;
}

function Arena({ categories, initialCategory }: { categories: Category[]; initialCategory: string }) {
  const { activeProfile, recordUnitTest, progress } = useProfileContext();
  const { speak, cancel, error: audioError, isSpeaking } = useTTS();
  const battleSound = useArenaSound();
  const [categoryId, setCategoryId] = useState(initialCategory);
  const [fighter, setFighter] = useState(0);
  const [opponent, setOpponent] = useState(0);
  const [match, setMatch] = useState<{ category: Category; questions: ArenaQuestion[] } | null>(null);
  const [state, setState] = useState<ArenaState>(initialArena);
  const [phase, setPhase] = useState<'lobby' | 'answer' | 'feedback' | 'result'>('lobby');
  const [response, setResponse] = useState('');
  const [letterOrder, setLetterOrder] = useState<number[]>([]);
  const [hinted, setHinted] = useState(false);
  const [special, setSpecial] = useState(false);
  const [battleAnimating, setBattleAnimating] = useState(false);
  const [lastSpecial, setLastSpecial] = useState(false);
  const motion = 'full' as const;
  const locked = useRef(false);
  const saved = useRef(false);
  const rewardId = useRef('');
  const questionStarted = useRef(0);
  const [elapsed, setElapsed] = useState(0);
  const category = categories.find(c => c.id === categoryId) ?? categories[0];
  const difficultyIndex = opponent % 3;
  const difficulty = arenaDifficulties[difficultyIndex];
  const question = match?.questions[state.index];
  const last = state.answers.at(-1);
  const correctCount = state.answers.filter(a => a.correct && !a.hinted).length;
  const timeoutAnswer = useEffectEvent(() => submit('', true));
  useEffect(() => {
    if (phase !== 'answer') return;
    questionStarted.current = performance.now();
    const timer = setInterval(() => {
      const duration = performance.now() - questionStarted.current;
      setElapsed(duration);
      if (duration >= difficulty.timeMs) timeoutAnswer();
    }, 100);
    return () => clearInterval(timer);
  }, [phase, state.index, difficulty.timeMs]);
  const speedTier = hinted ? 0 : arenaSpeedTier(elapsed, question?.kind ?? 'meaning');

  function start() {
    if (!category) return;
    battleSound.stop();
    cancel();
    rewardId.current = crypto.randomUUID();
    const questions = createArenaQuestions(category.words, rewardId.current);
    if (!questions.length) return;
    if (questions[0].kind === 'listening') speak(questions[0].word.en);
    setMatch({ category, questions }); setState(initialArena()); setPhase('answer');
    setElapsed(0); setLetterOrder([]); setResponse(''); setHinted(false); setSpecial(false); setBattleAnimating(false); setLastSpecial(false); locked.current = false; saved.current = false;
  }

  function submit(value: string, timedOut = false) {
    if (phase !== 'answer' || !match || !question || locked.current || (!timedOut && !value.trim())) return;
    locked.current = true;
    cancel();
    // Answers and timeout share the same lock to prevent scoring a round twice.
    const duration = performance.now() - questionStarted.current;
    const next = answerArena(state, match.questions, value, hinted, special, duration, timedOut || duration >= difficulty.timeMs, difficultyIndex);
    battleSound.play(next.answers[next.answers.length - 1], special && state.energy >= 3, motion);
    setLastSpecial(special && state.energy >= 3);
    setBattleAnimating(true);
    setResponse(value); setState(next); setPhase('feedback');
    if (next.finished && !saved.current) {
      saved.current = true;
      const independent = next.answers.filter(a => a.correct && !a.hinted).length;
      const score = Math.round(independent / next.answers.length * 100);
      recordUnitTest({ arenaReward: { id: rewardId.current, ...arenaReward(next, difficultyIndex) }, unitId: `arena:${match.category.id}`, score, grade: score >= 90 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'pass' : 'fail', attempts: 1, fastAnswers: next.answers.filter(a => (a.speedTier ?? 0) > 0).length, streak: next.bestCombo, correctAnswers: independent, questionCount: next.answers.length });
    }
  }

  function next(animationComplete = false) {
    if (phase !== 'feedback' || (battleAnimating && !animationComplete)) return;
    setBattleAnimating(false);
    battleSound.stop();
    cancel();
    if (state.finished) { setPhase('result'); return; }
    const upcoming = match?.questions[state.index];
    if (upcoming && (upcoming.kind === 'listening' || upcoming.kind === 'listen-choice')) speak(upcoming.word.en);
    setElapsed(0); setLetterOrder([]); setResponse(''); setHinted(false); setSpecial(false); locked.current = false; setPhase('answer');
  }

  function lobby() { battleSound.stop(); cancel(); setPhase('lobby'); setMatch(null); }

  if (phase === 'lobby') return <>
    <section className={styles.lobbyHeading}>
      <h1>Đấu trường từ vựng</h1><span className={styles.rewardBalance}>⭐ {progress.totalStars} sao · 💎 {progress.totalPoints} điểm</span>
    </section>
    <section className={styles.setup}>
      <div className={styles.card}>
        <h2>1. Chọn bạn đồng hành</h2>
        <div className={styles.fighterGroups} aria-label="Nhóm nhân vật">{['Tiên phép', 'Valkyrie', 'Seer', 'Thiên thần'].map((name, group) => <button key={name} aria-pressed={Math.floor(fighter / 3) === group} onClick={() => setFighter(group * 3)}>{name}</button>)}</div>
        <div className={styles.fighters}>{fighters.map((f, i) => Math.floor(i / 3) === Math.floor(fighter / 3) && <button key={f.name} className={fighter === i ? styles.chosenFighter : styles.fighter} aria-pressed={fighter === i} onClick={() => setFighter(i)}><FighterArt kind={f.kind} /><strong>{f.name}</strong><small>{f.power}</small></button>)}</div>
        <details className={styles.rules}><summary>Cách chơi</summary><p><Shield size={17} /> Trả lời đúng để tấn công và giảm đòn của đối thủ.</p><p><Zap size={17} /> Trả lời càng nhanh, tuyệt chiêu càng mạnh.</p><p><Sparkles size={17} /> Đúng 3 câu không gợi ý để nạp đòn đặc biệt. Mỗi trận tối đa 10 câu.</p></details>
      </div>
      <div className={styles.card}>
        <h2>2. Chuẩn bị trận đấu</h2>
        {category ? <>
          <label htmlFor="arena-category">Chủ đề của {activeProfile.name}</label>
          <select id="arena-category" value={category.id} onChange={e => setCategoryId(e.target.value)} className={styles.select}>{categories.map(c => <option key={c.id} value={c.id}>{c.name_vi} · {arenaWords(c.words).length} từ</option>)}</select>
          <p className={styles.roundInfo}>{category.emoji} {Math.min(10, arenaWords(category.words).length)} câu · Chọn nghĩa, chọn từ, viết từ, nghe và điền</p>
          <fieldset className={styles.opponentPicker}>
            <legend>Chọn đối thủ</legend>
            <div className={styles.opponentGrid}>{opponents.map((o, i) => <button type="button" key={o.kind} className={opponent === i ? styles.chosenFighter : styles.fighter} aria-pressed={opponent === i} onClick={() => setOpponent(i)}><FighterArt kind={o.kind} /><strong>{o.name}</strong><small>{arenaDifficulties[i % 3].name} · {arenaDifficulties[i % 3].timeMs / 1000}s</small></button>)}</div>
          </fieldset>
          <div className={styles.matchPreview} aria-label="Nhân vật trong trận"><div><FighterArt kind={fighters[fighter].kind} /><strong>{fighters[fighter].name}</strong></div><span aria-hidden="true">VS</span><div><div className={styles.previewOpponent}><FighterArt kind={opponents[opponent].kind} /></div><strong>{opponents[opponent].name}</strong></div></div>
          <button className={styles.primary} onClick={start}>Vào đấu trường <Swords size={19} /></button><p className={styles.note}>Đấu với máy · Không cần chờ đối thủ</p>
        </> : <p>Chưa có chủ đề đủ 2 từ có nghĩa. Hãy thêm học liệu hoặc chọn lớp khác trong hồ sơ.</p>}
      </div>
    </section>
  </>;

  const result = arenaResult(state);
  const reward = arenaReward(state, difficultyIndex);
  if (phase === 'result') return <section className={`${styles.card} ${styles.result}`}>
    <div className={`${styles.resultCharacter} ${result === 'win' ? styles.victory : ''}`} aria-hidden="true"><FighterArt kind={fighters[fighter].kind} victory={result === 'win'} motion={motion} />{result === 'win' && <><span>✦</span><span>✦</span><span>✦</span></>}</div>
    <span className={styles.eyebrow}>TRẬN ĐẤU HOÀN THÀNH</span><h1>{result === 'win' ? `Con đã thắng ${opponents[opponent].name}!` : result === 'draw' ? 'Một trận đấu ngang tài!' : 'Mỗi lần chơi, thêm một điều mới!'}</h1>
    <p>{match?.category.name_vi} · Kết quả đã lưu vào hồ sơ của {activeProfile.name}.</p>
    <div className={styles.stats}><div><strong>{correctCount}/{state.answers.length}</strong><span>Đúng không gợi ý</span></div><div><strong>{state.bestCombo}</strong><span>Combo tốt nhất</span></div><div><strong>{state.answers.filter(a => a.hinted).length}</strong><span>Câu có gợi ý</span></div></div>
    <div className={styles.rewardPanel}><strong>🎁 +{reward.stars} sao · +{reward.points} điểm</strong><p>Hoàn thành trận +{reward.base} · Nhanh +{reward.speed} · Combo +{reward.combo} · Độ khó +{reward.difficultyBonus}</p><span>Đã nhận thưởng · Tổng {progress.totalStars} sao</span></div>
    <h2>{state.answers.some(a => !a.correct || a.hinted) ? 'Cùng nhớ lại những từ này' : 'Con nhớ rất tốt những từ vừa chơi!'}</h2>
    <div className={styles.review}>{state.answers.filter(a => !a.correct || a.hinted).map((a, i) => <button key={`${a.word.id}:${i}`} onClick={() => speak(a.word.en)}><Volume2 size={16} /><strong>{a.word.en}</strong><span>{a.word.vi}</span></button>)}</div>
    {audioError && <p role="status">{audioError}</p>}
    <div className={styles.actions}><button className={styles.primary} onClick={start}>Chơi lại</button><button className={styles.secondary} onClick={lobby}>Đổi chủ đề</button><Link className={styles.secondary} href={`/learn/${match?.category.id}`}>Ôn bằng thẻ từ</Link></div>
  </section>;

  return <>
    <div className={styles.matchHeading}><div><h1>{match?.category.name_vi}</h1><span className={styles.matchDifficulty}>{difficulty.name} · {difficulty.timeMs / 1000}s/câu</span></div><button className={styles.secondary} onClick={lobby}>Rời trận</button></div>
    <BattleStage opponent={opponents[opponent].kind} opponentName={opponents[opponent].name} motion={motion} fighter={fighters[fighter].kind} name={activeProfile.name} health={state.health} rivalHealth={state.rivalHealth} round={Math.min(state.index + (phase === 'answer' ? 1 : 0), match?.questions.length ?? 0)} total={match?.questions.length ?? 0} combo={state.combo} answer={phase === 'feedback' ? last : undefined} special={lastSpecial} onAnimationComplete={() => next(true)} />
    <div className={styles.energy}><span><Zap size={18} /> Năng lượng {'●'.repeat(state.energy)}{'○'.repeat(3 - state.energy)}</span><span>🔥 Combo {state.combo}</span></div>
    {phase === 'answer' && <div className={styles.speedMeter} data-tier={speedTier} role="status"><strong>{['Sức mạnh cơ bản', 'Nhanh · +4 sức mạnh', 'Chớp nhoáng · +8 sức mạnh', 'Thần tốc · +12 sức mạnh'][speedTier]}</strong><span>Còn {Math.max(0, (difficulty.timeMs - elapsed) / 1000).toFixed(1)}s · Hết giờ đối thủ phản công.</span></div>}
    <section className={`${styles.card} ${styles.question}`}>
      {phase === 'answer' && question ? <>
        <span className={styles.eyebrow}>{question.kind === 'missing' ? 'ĐIỀN CHỮ THIẾU' : question.kind === 'scramble' ? 'SẮP XẾP CHỮ CÁI' : question.kind === 'listen-choice' ? 'NGHE VÀ CHỌN TỪ' : question.kind === 'listening' ? 'NGHE VÀ ĐIỀN TỪ' : question.kind === 'meaning' ? 'CHỌN NGHĨA ĐÚNG' : question.kind === 'word' ? 'CHỌN TỪ TIẾNG ANH' : 'VIẾT TỪ TIẾNG ANH'}</span>
        <h2>{question.kind === 'missing' ? question.prompt : question.kind === 'listening' || question.kind === 'listen-choice' ? '🎧 Con nghe được từ gì?' : question.kind === 'meaning' ? question.word.en : question.word.vi}</h2>
        <p>{question.kind === 'missing' ? `Điền các chữ còn thiếu theo thứ tự. Nghĩa: ${question.word.vi}` : question.kind === 'scramble' ? 'Bấm chữ cái theo đúng thứ tự để ghép từ.' : question.kind === 'listen-choice' ? 'Nghe phát âm rồi chọn từ đúng.' : question.kind === 'listening' ? 'Nghe phát âm rồi điền từ tiếng Anh để tung đòn.' : question.kind === 'meaning' ? 'Từ này có nghĩa là gì?' : 'Từ tiếng Anh nào phù hợp?'}</p>
        {question.kind === 'scramble' ? <div className={styles.letterPuzzle}><strong aria-live="polite">{response || '…'}</strong><div>{question.letters?.map((letter, i) => <button key={i} disabled={letterOrder.includes(i)} onClick={() => { setLetterOrder([...letterOrder, i]); setResponse(response + letter); }}>{letter}</button>)}</div><div><button className={styles.secondary} onClick={() => { setLetterOrder([]); setResponse(''); }}>Xếp lại</button><button className={styles.primary} disabled={!response || letterOrder.length !== question.letters?.length} onClick={() => submit(response)}>Tung đòn</button></div></div> : question.kind === 'spelling' || question.kind === 'listening' || question.kind === 'missing' ? <form className={styles.spelling} onSubmit={e => { e.preventDefault(); submit(response); }}><label className="sr-only" htmlFor="arena-answer">Từ tiếng Anh</label><input autoFocus id="arena-answer" value={response} onChange={e => setResponse(e.target.value)} placeholder="Viết từ ở đây…" autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={150} /><button className={styles.primary} disabled={!response.trim()} type="submit">Tung đòn</button></form>
          : <div className={styles.options}>{question.options.map((o, i) => <button key={o.id} onClick={() => submit(o.id)}><span>{String.fromCharCode(65 + i)}</span>{o.text}</button>)}</div>}
        {hinted && <p className={styles.hint} role="status">💡 {question.word.en} — {question.word.vi}. Đúng với gợi ý vẫn tạo sức mạnh, nhưng không tăng combo.</p>}
        <div className={styles.tools}><button className={styles.secondary} disabled={hinted} onClick={() => setHinted(true)}>💡 Gợi ý</button>{(question.kind === 'meaning' || question.kind === 'listening' || question.kind === 'listen-choice') && <button className={styles.secondary} onClick={() => speak(question.word.en)}><Volume2 size={17} />{question.kind === 'listening' || question.kind === 'listen-choice' || isSpeaking ? 'Nghe lại' : 'Nghe từ'}</button>}<button className={special ? styles.armed : styles.secondary} aria-pressed={special} disabled={state.energy < 3} onClick={() => setSpecial(!special)}><Zap size={17} />{special ? 'Đã chọn đòn đặc biệt' : 'Đòn đặc biệt · 3 năng lượng'}</button></div>
        <p className={styles.note}>{special ? 'Đáp án đúng thêm 15 sức mạnh. Lượt này dùng 3 năng lượng.' : `Sai hoặc quá ${difficulty.timeMs / 1000} giây: mất ${difficulty.wrongDamage} sức lực.`}</p>
      </> : last && <div className={styles.feedback} aria-live="polite"><span className={styles.resultEmoji} aria-hidden="true">{last.correct ? '✨' : '💡'}</span><h2>{last.correct ? last.hinted ? 'Con đã làm được với gợi ý!' : 'Chính xác! Con giỏi lắm!' : last.timedOut ? 'Hết giờ! Đối thủ phản công!' : 'Trả lời sai! Đối thủ phản công!'}</h2><p><strong>{last.word.en}</strong> — {last.word.vi}</p><button className={styles.secondary} onClick={() => speak(last.word.en)}><Volume2 size={17} /> Nghe phát âm</button><p className={styles.note} role="status">Đang tung đòn… {state.finished ? 'Kết quả sẽ hiện sau đòn đánh.' : 'Tự chuyển câu sau đòn đánh.'}</p></div>}
      {audioError && <p role="status" className={styles.note}>{audioError}</p>}
    </section>
  </>;
}
