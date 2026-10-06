import { PerceptionResult, AssessmentResult, ContentComparison, AttemptResult, LessonPolicy } from './types';

export function decideAttemptResult(
  attemptId: string,
  policy: LessonPolicy,
  perception: PerceptionResult | null, // null if A failed or timeout
  assessment: AssessmentResult | null, // null if B failed or timeout
  comparison: ContentComparison | null, // null if A failed
  engineVersion: string,
  scoreMode: 'off' | 'estimated' | 'calibrated' = 'off',
  rubricVersion: string | null = null,
  calibrationVersion: string | null = null
): AttemptResult {
  
  const baseResult = {
    attemptId,
    engineVersion,
    rubricVersion,
    calibrationVersion,
    feedbackVi: '', // will be filled by caller based on status/reason
  };

  // 1. A hoặc B lỗi dịch vụ/hết timeout/không trả schema hợp lệ
  if (!perception || !assessment || comparison === null) {
    return {
      ...baseResult,
      status: 'service_error',
      reason: 'provider_unavailable',
      contentStatus: 'unknown',
      passed: null,
      score: null,
      scoreType: 'none',
    };
  }

  // Schema validation logic based on constraints in section 6
  if (perception.speechStatus === 'clear' && perception.transcript === null) {
    return createServiceError(baseResult, 'invalid_model_output');
  }
  if (perception.speechStatus === 'no_speech' && perception.transcript !== null) {
    return createServiceError(baseResult, 'invalid_model_output');
  }
  
  // 20. scoreMode off, B trả rawModelScore khác null -> invalid_model_output
  if (scoreMode === 'off' && assessment.rawModelScore !== null) {
    return createServiceError(baseResult, 'invalid_model_output');
  }

  // 2. Audio không đủ dùng hoặc A nghi có lời nói chen
  if (perception.interference === 'suspected') {
    return {
      ...baseResult,
      status: 'retry',
      reason: 'interference',
      contentStatus: 'unknown',
      passed: null,
      score: null,
      scoreType: 'none',
    };
  }

  // 3. A không clear hoặc B assessability không usable
  if (perception.speechStatus !== 'clear' || assessment.assessability !== 'usable') {
    const reason = perception.speechStatus === 'no_speech' ? 'no_clear_speech' : 'uncertain_assessment';
    return {
      ...baseResult,
      status: 'retry',
      reason,
      contentStatus: 'unknown',
      passed: null,
      score: null,
      scoreType: 'none',
    };
  }

  // 4. B contentMatch uncertain
  if (assessment.contentMatch === 'uncertain') {
    return {
      ...baseResult,
      status: 'retry',
      reason: 'uncertain_assessment',
      contentStatus: 'unknown',
      passed: null,
      score: null,
      scoreType: 'none',
    };
  }

  // Determine score based on mode
  let finalScore: number | null = null;
  let finalScoreType: 'none' | 'estimated' | 'calibrated' = 'none';

  // 5. comparison=allowed_match VÀ B contentMatch=match
  if (comparison === 'allowed_match' && assessment.contentMatch === 'match') {
    if (assessment.pronunciation === 'acceptable') {
      if (scoreMode === 'estimated' && assessment.rawModelScore !== null) {
         finalScore = assessment.rawModelScore;
         finalScoreType = 'estimated';
      }
      return {
        ...baseResult,
        status: 'pass',
        reason: 'acceptable',
        contentStatus: 'matched',
        passed: true,
        score: finalScore,
        scoreType: finalScoreType,
      };
    } else if (assessment.pronunciation === 'needs_practice') {
      if (scoreMode === 'estimated' && assessment.rawModelScore !== null) {
         finalScore = assessment.rawModelScore;
         finalScoreType = 'estimated';
      }
      return {
        ...baseResult,
        status: 'practice',
        reason: 'pronunciation_needs_practice',
        contentStatus: 'matched',
        passed: false,
        score: finalScore,
        scoreType: finalScoreType,
      };
    } else if (assessment.pronunciation === 'uncertain') {
      return {
        ...baseResult,
        status: 'retry',
        reason: 'uncertain_assessment',
        contentStatus: 'unknown',
        passed: null,
        score: null,
        scoreType: 'none',
      };
    } else if (assessment.pronunciation === 'not_applicable') {
      return createServiceError(baseResult, 'invalid_model_output');
    }
  }

  // 6. comparison=omissions_only VÀ B contentMatch=partial
  if (comparison === 'omissions_only' && assessment.contentMatch === 'partial') {
    return {
      ...baseResult,
      status: 'practice',
      reason: 'incomplete_reading',
      contentStatus: 'partial',
      passed: false,
      score: null,
      scoreType: 'none',
    };
  }

  // 7. comparison=other VÀ B contentMatch=different
  if (comparison === 'other' && assessment.contentMatch === 'different') {
    return {
      ...baseResult,
      status: 'practice',
      reason: 'different_content',
      contentStatus: 'different',
      passed: false,
      score: null,
      scoreType: 'none',
    };
  }

  // 8. Mọi tổ hợp còn lại:
  return {
    ...baseResult,
    status: 'retry',
    reason: 'conflicting_evidence',
    contentStatus: 'unknown',
    passed: null,
    score: null,
    scoreType: 'none',
  };
}

function createServiceError(baseResult: Pick<AttemptResult, 'attemptId' | 'engineVersion' | 'rubricVersion' | 'calibrationVersion' | 'feedbackVi'>, reason: AttemptResult['reason']): AttemptResult {
  return {
    ...baseResult,
    status: 'service_error',
    reason,
    contentStatus: 'unknown',
    passed: null,
    score: null,
    scoreType: 'none',
  };
}
