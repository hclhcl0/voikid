import type { AppProgress } from '@/types';
import { sessionsFor, latestEvidence } from '@/lib/learning/progress';
import type { ReadingBand, ReadingEvidence, StoryLesson, StorySession } from './types';
export const BAND_LABELS: Record<ReadingBand,string> = {support:'Có hỗ trợ',standard:'Vừa sức',challenge:'Mở rộng nhẹ'};
export function readingEvidence(progress: AppProgress, profileId:string, unitId:string): ReadingEvidence {
  const old=latestEvidence(sessionsFor(progress.learningSessions,profileId).filter(s=>s.unitId===unitId)).filter(e=>['context','meaning','spelling'].includes(e.skill));
  const sessions=Object.values(progress.storySessions ?? {}).filter(s=>validStorySession(s,profileId)&&s.unitId===unitId);
  // Only reading-comprehension answers influence the next passage, not repeated vocabulary/dictation drills.
  const answers=sessions.flatMap(s=>s.lesson.questions.flatMap(q=>s.answers[`quiz:${q.id}`]?[s.answers[`quiz:${q.id}`]]:[]));
  return {total:old.length+answers.length,independent:old.filter(e=>e.firstCorrect&&!e.hinted&&!e.revealed&&e.attempts===1).length+answers.filter(a=>a.firstCorrect&&!a.supported).length};
}
export function readingBand(e:ReadingEvidence): ReadingBand {
  if(e.total<4 || e.independent/e.total<0.6) return 'support';
  return e.total>=8&&e.independent/e.total>=0.85?'challenge':'standard';
}
export function storyLimits(grade:number,band:ReadingBand) {
  const base=[0,5,6,8,10,12][grade] || 5;
  const sentences=band==='support'?Math.max(3,base-2):band==='challenge'?base+2:base;
  const maxSentenceWords=[0,9,12,16,20,24][grade] || 9;
  return {minSentences:Math.max(3,sentences-1),maxSentences:sentences+1,maxSentenceWords, maxWords:sentences*maxSentenceWords};
}
export function normalizeReading(text:string) {return text.normalize('NFC').toLowerCase().replace(/[’']/g,"'").replace(/[.,!?;:“”"()]/g,' ').replace(/\s+/g,' ').trim();}
export function recordStoryAnswer(session:StorySession,key:string,response:string,correct:boolean,supported:boolean): StorySession {
  const previous=session.answers[key];
  return {...session,updatedAt:new Date().toISOString(),answers:{...session.answers,[key]:{response,correct,attempts:(previous?.attempts??0)+1,firstCorrect:previous?.firstCorrect??correct,supported:previous?.supported||supported}}};
}
export function validStorySession(value:unknown,profileId:string): value is StorySession {
  const s=value as StorySession;
  return !!s&&s.profileId===profileId&&typeof s.id==='string'&&s.id===s.lesson?.id&&s.unitId===s.lesson?.unitId&&typeof s.updatedAt==='string'&&!!s.answers&&typeof s.answers==='object'&&!Array.isArray(s.answers)&&Object.values(s.answers).every(a=>a&&typeof a.response==='string'&&a.response.length<2000&&Number.isInteger(a.attempts)&&a.attempts>0&&typeof a.firstCorrect==='boolean'&&typeof a.correct==='boolean'&&typeof a.supported==='boolean')&&typeof s.read==='boolean'&&typeof s.listened==='boolean'&&typeof s.completed==='boolean'&&Array.isArray(s.lesson?.sentences)&&s.lesson.sentences.every(l=>l&&typeof l.en==='string'&&typeof l.vi==='string'&&typeof l.id==='string')&&Array.isArray(s.lesson?.vocabulary)&&s.lesson.vocabulary.every(v=>v&&typeof v.en==='string'&&typeof v.vi==='string')&&Array.isArray(s.lesson?.questions)&&s.lesson.questions.every(q=>q&&typeof q.en==='string'&&Array.isArray(q.options)&&q.options.every(o=>typeof o==='string'));
}
export function newStorySession(lesson:StoryLesson,profileId:string):StorySession {return {id:lesson.id,profileId,unitId:lesson.unitId,lesson,updatedAt:new Date().toISOString(),read:false,listened:false,speakingPracticed:false,completed:false,answers:{}};}
