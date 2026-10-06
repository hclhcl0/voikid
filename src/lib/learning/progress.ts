import type { LearningSession, Skill, AnswerEvidence } from './types';
import { ACTIVITY_LABELS, CONTENT_VERSION, SKILL_LABELS } from './types';
import { isIndependent, localDate } from './engine';
import type { AppProgress } from '@/types';

export function applyLearningSession(progress: AppProgress, session: LearningSession): AppProgress {
  const rewardKey = `${session.profileId}:${session.unitId}:v${session.contentVersion}:completion`;
  const keys = progress.learningRewardKeys ?? [];
  const earn = session.completed && !keys.includes(rewardKey);
  return {
    ...progress,
    learningSessions: { ...progress.learningSessions, [session.id]: session },
    learningRewardKeys: earn ? [...keys, rewardKey] : keys,
    totalStars: progress.totalStars + (earn ? 1 : 0),
    stickers: earn ? [...progress.stickers, { id: rewardKey, name: 'Bạn chăm luyện', emoji: '🌱', tier: 'basic', setId: 'learning-effort', unitId: session.unitId, condition: 'Hoàn thành chặng luyện bổ trợ', earnedAt: session.updatedAt }] : progress.stickers,
  };
}

export function validSession(value: unknown, profileId: string): value is LearningSession {
  if (!value || typeof value !== 'object') return false;
  const s = value as LearningSession;
  return s.profileId === profileId && s.contentVersion === CONTENT_VERSION && typeof s.id === 'string' && typeof s.unitId === 'string'
    && typeof s.updatedAt === 'string' && typeof s.createdAt === 'string'
    && ['cards', 'activities', 'resource', 'application', 'result'].includes(s.stage)
    && Array.isArray(s.activities) && s.activities.every(a => a && !!ACTIVITY_LABELS[a.kind] && !!SKILL_LABELS[a.skill] && typeof a.id === 'string' && typeof a.vocabularyId === 'string' && typeof a.hint === 'string' && typeof a.instruction === 'string' && (('options' in a && Array.isArray(a.options) && a.options.every(o => o && typeof o.id === 'string' && typeof o.text === 'string')) || ('tokens' in a && Array.isArray(a.tokens) && a.tokens.every(t => t && typeof t.id === 'string' && typeof t.text === 'string')) || ('answers' in a && Array.isArray(a.answers) && a.answers.every(v => typeof v === 'string'))))
    && !!s.evidence && typeof s.evidence === 'object' && !Array.isArray(s.evidence)
    && Object.values(s.evidence).every(e => e && typeof e.response === 'string' && typeof e.completedAt === 'string' && typeof e.reviewDueDate === 'string' && !!SKILL_LABELS[e.skill] && Number.isInteger(e.attempts) && e.attempts >= 0)
    && Number.isInteger(s.activityIndex) && s.activityIndex >= 0 && s.activityIndex <= s.activities.length
    && Number.isInteger(s.cardIndex) && s.cardIndex >= 0 && Number.isInteger(s.sceneIndex) && s.sceneIndex >= 0
    && !!s.cardRatings && typeof s.cardRatings === 'object' && typeof s.applicationResponse === 'string';
}

export function sessionsFor(values: unknown, profileId: string): LearningSession[] {
  if (!values || typeof values !== 'object') return [];
  return Object.values(values).filter(s => validSession(s, profileId)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function currentSessions(sessions: LearningSession[]): LearningSession[] {
  const latest = new Map<string, LearningSession>();
  for (const session of sessions) if (!latest.has(session.unitId)) latest.set(session.unitId, session);
  return [...latest.values()].filter(s => !s.completed);
}

export function latestEvidence(sessions: LearningSession[]): AnswerEvidence[] {
  const map = new Map<string, AnswerEvidence>();
  for (const session of sessions) for (const evidence of Object.values(session.evidence)) {
    if (!evidence || typeof evidence.completedAt !== 'string' || !SKILL_LABELS[evidence.skill] || evidence.attempts < 1) continue;
    const key = `${session.unitId}:v${session.contentVersion}:${evidence.senseId}:${evidence.skill}`;
    if (!map.has(key) || map.get(key)!.completedAt < evidence.completedAt) map.set(key, evidence);
  }
  return [...map.values()];
}

export function skillReport(sessions: LearningSession[]) {
  const evidence = latestEvidence(sessions);
  return (Object.keys(SKILL_LABELS) as Skill[]).map(skill => {
    const rows = evidence.filter(e => e.skill === skill);
    return { skill, label: SKILL_LABELS[skill], practiced: rows.length, independent: rows.filter(isIndependent).length, supported: rows.filter(e => e.correct && !isIndependent(e)).length, needsReview: rows.filter(e => !e.correct || !isIndependent(e)).length };
  });
}

export function dueVocabularyIds(sessions: LearningSession[], unitId?: string, today = localDate()) {
  const filtered = unitId ? sessions.filter(s => s.unitId === unitId) : sessions;
  const ratings = new Map<string, 'again' | 'remember'>();
  for (const session of [...filtered].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))) {
    for (const [wordId, rating] of Object.entries(session.cardRatings)) if (!ratings.has(wordId)) ratings.set(wordId, rating);
  }
  return [...new Set([...latestEvidence(filtered).filter(e => e.reviewDueDate <= today || !isIndependent(e)).map(e => e.vocabularyId), ...[...ratings].filter(([, rating]) => rating === 'again').map(([wordId]) => wordId)])];
}

export function mergeSessions(current: Record<string, LearningSession> = {}, incoming: Record<string, LearningSession> = {}) {
  const merged = { ...current };
  for (const [id, session] of Object.entries(incoming)) {
    if (!session || session.id !== id || typeof session.updatedAt !== 'string') continue;
    if (!merged[id] || merged[id].updatedAt < session.updatedAt) merged[id] = session;
  }
  return merged;
}
