import type { PerceptionResult, AssessmentResult } from './types';
export function parsePerception(value: unknown): PerceptionResult {
  const v = value as PerceptionResult;
  if (!v || !['clear','unclear','no_speech'].includes(v.speechStatus) || !['none_detected','suspected'].includes(v.interference) || !(v.transcript === null || typeof v.transcript === 'string') || (typeof v.transcript === 'string' && v.transcript.length > 2000) || (v.speechStatus === 'clear' && !v.transcript?.trim()) || (v.speechStatus === 'no_speech' && v.transcript !== null)) throw new Error('invalid_model_output');
  return v;
}
export function parseAssessment(value: unknown, tokenCount: number): AssessmentResult {
  const v = value as AssessmentResult;
  if (!v || !['usable','uncertain','unusable'].includes(v.assessability) || !['match','partial','different','uncertain'].includes(v.contentMatch) || !['acceptable','needs_practice','uncertain','not_applicable'].includes(v.pronunciation) || v.rawModelScore !== null || !Array.isArray(v.issues) || v.issues.length > 2) throw new Error('invalid_model_output');
  for (const issue of v.issues) if (!issue || !['sound','stress','fluency'].includes(issue.kind) || !Number.isInteger(issue.targetTokenIndex) || issue.targetTokenIndex < 0 || issue.targetTokenIndex >= tokenCount || typeof issue.suggestionVi !== 'string' || !issue.suggestionVi.trim() || issue.suggestionVi.length > 300) throw new Error('invalid_model_output');
  if (v.assessability !== 'usable' && (v.contentMatch !== 'uncertain' || v.pronunciation !== 'uncertain' || v.issues.length)) throw new Error('invalid_model_output');
  if (v.contentMatch === 'uncertain' && (v.pronunciation !== 'uncertain' || v.issues.length)) throw new Error('invalid_model_output');
  if (['partial','different'].includes(v.contentMatch) && (v.pronunciation !== 'not_applicable' || v.issues.length)) throw new Error('invalid_model_output');
  if (v.pronunciation !== 'needs_practice' && v.issues.length) throw new Error('invalid_model_output');
  if (v.contentMatch === 'match' && v.assessability === 'usable' && v.pronunciation === 'not_applicable') throw new Error('invalid_model_output');
  return v;
}
