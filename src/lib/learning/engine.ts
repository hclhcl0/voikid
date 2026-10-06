import { GRADE_CONFIG } from './curriculum';
import { CONTENT_VERSION, type Activity, type AnswerEvidence, type CurriculumUnit, type LearningSession, type VocabularyItem } from './types';

// Punctuation outside the spelling objective is ignored, spelling itself is exact.
export function normalizeAnswer(value: string): string {
  return value.normalize('NFC').trim().toLowerCase().replace(/[.,!?;:]+$/g, '').replace(/\s+/g, ' ');
}

export function shuffle<T>(items: T[], seed: string): T[] {
  let state = Array.from(seed).reduce((n, c) => (Math.imul(n, 31) + c.charCodeAt(0)) >>> 0, 2166136261);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function semanticKey(word: VocabularyItem) {
  const text = normalizeAnswer(word.text);
  if (['hello', 'hi'].includes(text)) return 'greeting';
  if (['bye', 'goodbye'].includes(text)) return 'farewell';
  return normalizeAnswer(word.senses[0].meaningVi);
}

function optionsFor(unit: CurriculumUnit, target: VocabularyItem, seed: string, meaning: boolean) {
  const candidates: VocabularyItem[] = [target];
  const used = new Set([semanticKey(target)]);
  for (const word of shuffle(unit.vocabulary, seed)) {
    if (normalizeAnswer(word.text) === normalizeAnswer(target.text) || used.has(semanticKey(word))) continue;
    used.add(semanticKey(word));
    candidates.push(word);
    if (candidates.length >= GRADE_CONFIG[unit.grade].choices) break;
  }
  return shuffle(candidates.map(w => ({ id: w.id, text: meaning ? w.senses[0].meaningVi : w.text })), seed);
}

export function generateActivities(unit: CurriculumUnit, seed: string, mode: LearningSession['mode'] = 'path', audio = false, weakIds?: string[]): Activity[] {
  const config = GRADE_CONFIG[unit.grade];
  if (mode === 'context-choice' && unit.resource?.questions.length) {
    return unit.resource.questions.map(q => {
      const word = unit.vocabulary.find(v => v.id === q.answerId)!;
      return { id: `${q.id}:v${CONTENT_VERSION}:${seed}`, kind: 'context-choice', vocabularyId: word.id, senseId: word.senses[0].id,
        objectiveIds: [`${unit.id}:context`], skill: 'context', instruction: q.question, hint: q.hint,
        text: 'Nhớ lại tình huống vừa đọc. Có thể mở gợi ý nếu con cần hỗ trợ.', options: shuffle(q.options, seed + q.id), answerId: q.answerId };
    });
  }
  const words = (weakIds?.length ? unit.vocabulary.filter(w => weakIds.includes(w.id)) : unit.vocabulary).slice(0, mode === 'path' ? Math.min(config.batch, 4) : config.batch);
  const result: Activity[] = [];
  for (const [index, word] of words.entries()) {
    const sense = word.senses[0];
    const base = { id: `${unit.id}:v${CONTENT_VERSION}:${seed}:${word.id}:${mode}`, vocabularyId: word.id, senseId: sense.id, objectiveIds: [`${unit.id}:meaning`], skill: 'meaning' as const, instruction: word.text, hint: `${word.text} — ${sense.meaningVi}` };
    const kind = mode === 'path' || mode === 'review'
      ? (unit.grade === 1 ? 'meaning-choice' : unit.grade === 2 ? (index % 2 ? 'letter-order' : 'word-choice') : index % 3 === 2 ? 'spelling' : 'word-choice')
      : mode;
    if (kind === 'spelling' || kind === 'dictation') {
      if (kind === 'dictation' && !audio) continue;
      result.push({ ...base, kind, skill: kind === 'dictation' ? 'listening' : 'spelling', objectiveIds: [`${unit.id}:${kind === 'dictation' ? 'listening' : 'spelling'}`], instruction: kind === 'dictation' ? 'Nghe và viết từ/cụm từ.' : sense.meaningVi, answers: [word.text], audioText: kind === 'dictation' ? word.text : undefined });
    } else if (kind === 'letter-order') {
      const tokens = Array.from(word.text).map((text, i) => ({ id: `${word.id}:letter${i}`, text }));
      result.push({ ...base, kind, skill: 'spelling', objectiveIds: [`${unit.id}:spelling`], instruction: sense.meaningVi, tokens: shuffle(tokens, seed + word.id), answerTokenIds: tokens.map(t => t.id), answer: word.text });
    } else if (kind === 'context-choice') {
      const scene = unit.resource?.scenes.find(s => s.vocabularyIds.includes(word.id) && normalizeAnswer(s.en).includes(normalizeAnswer(word.text)));
      if (!scene) continue;
      const options = optionsFor(unit, word, seed + word.id, true);
      if (options.length < 2) continue;
      const start = scene.en.toLowerCase().indexOf(word.text.toLowerCase());
      if (start < 0) continue;
      result.push({ ...base, kind, skill: 'context', objectiveIds: [`${unit.id}:context`], instruction: `Trong câu này, “${word.text}” có nghĩa gì?`, text: scene.en, hint: scene.vi, options, answerId: word.id });
    } else {
      if (kind === 'listen-choice' && !audio) continue;
      const options = optionsFor(unit, word, seed + word.id, kind === 'meaning-choice');
      if (options.length < 2) {
        // A one-word unit remains playable through spelling, without fake distractors.
        const tokens = Array.from(word.text).map((text, i) => ({ id: `${word.id}:letter${i}`, text }));
        result.push({ ...base, kind: 'letter-order', skill: 'spelling', objectiveIds: [`${unit.id}:spelling`], instruction: sense.meaningVi, tokens: shuffle(tokens, seed), answerTokenIds: tokens.map(t => t.id), answer: word.text });
        continue;
      }
      result.push({ ...base, kind, skill: kind === 'listen-choice' ? 'listening' : 'meaning', objectiveIds: [`${unit.id}:${kind === 'listen-choice' ? 'listening' : 'meaning'}`], instruction: kind === 'meaning-choice' ? word.text : kind === 'listen-choice' ? 'Nghe và chọn từ.' : sense.meaningVi, options, answerId: word.id, audioText: kind === 'listen-choice' ? word.text : undefined });
    }
  }
  return result;
}

export function checkAnswer(activity: Activity, response: string): boolean {
  if ('options' in activity) return response === activity.answerId;
  if (activity.kind === 'letter-order') return normalizeAnswer(response) === normalizeAnswer(activity.answer);
  return activity.answers.some(a => normalizeAnswer(a) === normalizeAnswer(response));
}

export function isIndependent(e: AnswerEvidence): boolean {
  return !!e && e.firstCorrect === true && e.correct === true && !e.hinted && !e.revealed && (e.skill !== 'listening' || e.audioPlayed === true);
}

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function nextReviewDate(independent: boolean, previousIndependent = 0, now = new Date()): string {
  const intervals = [1, 3, 7, 14, 30];
  const date = new Date(now);
  date.setDate(date.getDate() + (independent ? intervals[Math.min(previousIndependent, intervals.length - 1)] : 1));
  return localDate(date);
}

export function createSession(unit: CurriculumUnit, profileId: string, mode: LearningSession['mode'] = 'path', audio = false, weakIds?: string[]): LearningSession {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  return { id, profileId, unitId: unit.id, contentVersion: CONTENT_VERSION, mode, createdAt: now, updatedAt: now, stage: mode === 'path' ? 'cards' : 'activities', cardIndex: 0, cardMode: 'familiar', cardRatings: {}, activities: generateActivities(unit, id, mode, audio, weakIds), activityIndex: 0, evidence: {}, sceneIndex: 0, resourceRead: false, applicationResponse: '', applicationCompleted: false, speakingPracticed: false, completed: false, rewardGranted: false };
}

export function validateActivities(activities: Activity[], unit: CurriculumUnit): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const activity of activities) {
    if (ids.has(activity.id)) errors.push(`Duplicate activity: ${activity.id}`);
    ids.add(activity.id);
    if (!unit.vocabulary.some(v => v.id === activity.vocabularyId && v.senses.some(s => s.id === activity.senseId))) errors.push(`Invalid vocabulary: ${activity.id}`);
    if ('options' in activity && (activity.options.length < 2 || !activity.options.some(o => o.id === activity.answerId) || new Set(activity.options.map(o => normalizeAnswer(o.text))).size !== activity.options.length)) errors.push(`Invalid options: ${activity.id}`);
  }
  return errors;
}
