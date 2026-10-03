import { decideAttemptResult } from './decisionEngine';
import { LessonPolicy, PerceptionResult, AssessmentResult } from './types';

describe('decideAttemptResult', () => {
  const defaultPolicy: LessonPolicy = {
    targetText: 'cat',
    taskKind: 'word',
    locale: 'en-US',
    acceptedResponses: ['cat', 'a cat', 'the cat'],
    acceptedTranscriptAliases: [],
    policyVersion: 'v1',
  };

  const defaultPerception: PerceptionResult = {
    speechStatus: 'clear',
    transcript: 'cat',
    interference: 'none_detected',
  };

  const defaultAssessment: AssessmentResult = {
    assessability: 'usable',
    contentMatch: 'match',
    pronunciation: 'acceptable',
    issues: [],
    rawModelScore: null,
  };

  it('Case 1: T=cat; A=cat; B match + acceptable -> pass', () => {
    const result = decideAttemptResult(
      'attempt-1',
      defaultPolicy,
      defaultPerception,
      defaultAssessment,
      'allowed_match',
      'v1'
    );
    expect(result.status).toBe('pass');
    expect(result.passed).toBe(true);
    expect(result.score).toBeNull();
  });

  it('Case 2: T=cat; A=cat; B match + needs_practice -> practice/pronunciation', () => {
    const result = decideAttemptResult(
      'attempt-2',
      defaultPolicy,
      defaultPerception,
      { ...defaultAssessment, pronunciation: 'needs_practice' },
      'allowed_match',
      'v1'
    );
    expect(result.status).toBe('practice');
    expect(result.reason).toBe('pronunciation_needs_practice');
  });

  it('Case 3: T=cat; A=dog; B different + not_applicable -> practice/different_content', () => {
    const result = decideAttemptResult(
      'attempt-3',
      defaultPolicy,
      { ...defaultPerception, transcript: 'dog' },
      { ...defaultAssessment, contentMatch: 'different', pronunciation: 'not_applicable' },
      'other',
      'v1'
    );
    expect(result.status).toBe('practice');
    expect(result.reason).toBe('different_content');
    expect(result.score).toBeNull();
  });

  it('Case 4: T=cat; A=dog; B match + acceptable -> retry/conflicting_evidence', () => {
    const result = decideAttemptResult(
      'attempt-4',
      defaultPolicy,
      { ...defaultPerception, transcript: 'dog' },
      defaultAssessment,
      'other', // A says dog, so comparison is 'other'
      'v1'
    );
    expect(result.status).toBe('retry');
    expect(result.reason).toBe('conflicting_evidence');
  });

  it('Case 6: A no_speech, transcript null; B cho match/acceptable -> retry', () => {
    const result = decideAttemptResult(
      'attempt-6',
      defaultPolicy,
      { speechStatus: 'no_speech', transcript: null, interference: 'none_detected' },
      defaultAssessment,
      'other',
      'v1'
    );
    expect(result.status).toBe('retry');
  });

  it('Case 20: scoreMode off, B trả rawModelScore khác null -> service_error/invalid_model_output', () => {
    const result = decideAttemptResult(
      'attempt-20',
      defaultPolicy,
      defaultPerception,
      { ...defaultAssessment, rawModelScore: 85 },
      'allowed_match',
      'v1',
      'off'
    );
    expect(result.status).toBe('service_error');
    expect(result.reason).toBe('invalid_model_output');
  });
});
