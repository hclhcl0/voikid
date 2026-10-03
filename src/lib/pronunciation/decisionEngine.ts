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
      // ĐỐI CHIẾU ÂM ĐUÔI VỚI NHÁNH A (PERCEPTION):
      // Nếu Nhánh B báo 'needs_practice' vì nghi ngờ thiếu âm đuôi,
      // nhưng Nhánh A (ASR khách quan không biết trước bài tập) đã nghe và nhận diện được âm đuôi rõ ràng (vd: nghe rõ "cat", "cats"):
      // Điều này chứng minh âm đuôi có tồn tại trong tín hiệu âm thanh và không bị nuốt.
      // Chuẩn hóa về 'acceptable' -> status: 'pass' để tránh bắt bẻ quá mức gây ức chế cho người học.
      const onlyEndingSoundIssue = !assessment.issues || assessment.issues.length === 0 || assessment.issues.every(iss => 
        iss.suggestionVi?.toLowerCase().includes('âm đuôi') || 
        iss.suggestionVi?.toLowerCase().includes('bật') ||
        iss.suggestionVi?.toLowerCase().includes('xì') ||
        iss.suggestionVi?.toLowerCase().includes('cuối')
      );

      if (policy.taskKind === 'word' && onlyEndingSoundIssue && isEndingSoundArticulatedInTranscript(perception.transcript, policy)) {
        if (scoreMode === 'estimated' && assessment.rawModelScore !== null) {
          finalScore = Math.max(assessment.rawModelScore, 85);
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
      }

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

function isEndingSoundArticulatedInTranscript(
  transcript: string | null,
  policy: LessonPolicy
): boolean {
  if (!transcript) return false;
  const cleanTranscript = transcript.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const tokens = cleanTranscript.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return false;

  const target = policy.targetText.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
  if (!target) return false;

  // 1. Nếu transcript chứa chính xác target hoặc target + 's' (ví dụ "cat", "cats", "bird", "birds", "bus")
  if (tokens.includes(target) || tokens.includes(target + 's')) {
    return true;
  }

  // 2. Nếu target có âm đuôi (như /t/, /s/, /k/, /d/, /p/, /ʃ/)
  // và một token trong transcript kết thúc bằng ký tự âm đuôi đó
  const sound = policy.endingSound?.toLowerCase() || '';
  for (const token of tokens) {
    if (sound.includes('t') && (token.endsWith('t') || token.endsWith('ts') || token.endsWith('te'))) return true;
    if (sound.includes('s') && (token.endsWith('s') || token.endsWith('se') || token.endsWith('ce'))) return true;
    if (sound.includes('k') && (token.endsWith('k') || token.endsWith('ck') || token.endsWith('ke'))) return true;
    if (sound.includes('d') && (token.endsWith('d') || token.endsWith('de'))) return true;
    if (sound.includes('p') && (token.endsWith('p') || token.endsWith('pe'))) return true;
    if (sound.includes('ʃ') && token.endsWith('sh')) return true;
    if (sound.includes('tʃ') && token.endsWith('ch')) return true;
    if (sound.includes('ks') && token.endsWith('x')) return true;
  }

  return false;
}

function createServiceError(baseResult: any, reason: AttemptResult['reason']): AttemptResult {
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
