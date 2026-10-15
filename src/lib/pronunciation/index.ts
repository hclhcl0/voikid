import { runPerceptionBranch, runAssessmentBranch } from './geminiAdapter';
import { compareContent } from './comparator';
import { decideAttemptResult } from './decisionEngine';
import { LessonPolicy, AttemptResult, AssessmentResult, PerceptionResult } from './types';

export const ENGINE_VERSION = '3.1.0-bounded-audio-recheck';

export async function evaluatePronunciationDual(
  attemptId: string,
  audioBase64: string,
  mimeType: string,
  policy: LessonPolicy,
  apiKey: string,
  scoreMode: 'off' | 'estimated' | 'calibrated' = 'off',
  modelName = 'gemini-3.5-flash-lite',
  timeoutMs = 20000,
  onProviderErrors?: (errors: unknown[]) => void
): Promise<AttemptResult> {
  const resolvedMime = mimeType || 'audio/webm';
  const deadline = Date.now() + timeoutMs;
  // Leave time to recheck contradictory evidence on the SAME recording.
  const initialTimeout = Math.max(1000, Math.floor(timeoutMs * 0.65));

  // A/B chạy song song có giới hạn concurrency; xử lý cả hai kết quả bằng allSettled
  const [perceptionOutcome, assessmentOutcome] = await Promise.allSettled([
    runPerceptionBranch(audioBase64, resolvedMime, apiKey, modelName, initialTimeout),
    runAssessmentBranch(audioBase64, resolvedMime, policy, apiKey, scoreMode !== 'off', modelName, initialTimeout)
  ]);
  onProviderErrors?.([perceptionOutcome, assessmentOutcome].flatMap(outcome => outcome.status === 'rejected' ? [outcome.reason] : []));

  let perception = perceptionOutcome.status === 'fulfilled' ? perceptionOutcome.value : null;

  let assessment = assessmentOutcome.status === 'fulfilled' ? assessmentOutcome.value : null;

  const comparison = perception ? compareContent(perception.transcript, policy) : null;


  let result = decideAttemptResult(
    attemptId,
    policy,
    perception,
    assessment,
    comparison,
    ENGINE_VERSION,
    scoreMode
  );
  if ([perceptionOutcome, assessmentOutcome].some(outcome => outcome.status === 'rejected' && outcome.reason instanceof Error && outcome.reason.message === 'invalid_model_output')) {
    result.reason = 'invalid_model_output';
  }

  const remaining = deadline - Date.now();
  if (result.status === 'retry' &&
      ['conflicting_evidence','uncertain_assessment'].includes(result.reason) &&
      perception?.speechStatus === 'clear' && perception.interference === 'none_detected' &&
      assessment?.assessability === 'usable' && remaining >= 2500) {
    // Keep transcription blind to the target. Never turn text recognition alone into a pass.
    const rechecked = await Promise.allSettled([
      runPerceptionBranch(audioBase64, resolvedMime, apiKey, modelName, remaining),
      runAssessmentBranch(audioBase64, resolvedMime, policy, apiKey, scoreMode !== 'off', modelName, remaining),
    ]);
    onProviderErrors?.(rechecked.flatMap(outcome => outcome.status === 'rejected' ? [outcome.reason] : []));
    if (rechecked[0].status === 'fulfilled' && rechecked[1].status === 'fulfilled') {
      const heard = rechecked[0].value, assessed = rechecked[1].value;
      const checked = decideAttemptResult(attemptId, policy, heard, assessed,
        compareContent(heard.transcript, policy), ENGINE_VERSION, scoreMode);
      if (checked.status === 'pass' || checked.status === 'practice') {
        result = checked; perception = heard; assessment = assessed;
      }
    }
  }

  // Gắn phản hồi mẫu dựa theo status, reason và transcript
  result.feedbackVi = generateFeedback(result, policy, assessment, perception);

  return result;
}

function generateFeedback(
  result: AttemptResult,
  policy: LessonPolicy,
  assessment: AssessmentResult | null,
  perception: PerceptionResult | null
): string {
  if (result.status === 'pass') {
    return 'Con đọc rõ rồi! Mình sang từ tiếp theo nhé. 👏';
  }
  if (result.status === 'practice') {
    if (result.reason === 'pronunciation_needs_practice') {
      const suggestion = assessment?.issues?.[0]?.suggestionVi;
      if (suggestion) {
        return suggestion.startsWith('Con') ? suggestion : `Con thử đọc lại nhé. ${suggestion}`;
      }
      if (policy.endingSound) {
        return `Con đọc gần đúng rồi, nhưng nhớ phát âm rõ âm đuôi ${policy.endingSound} ở cuối từ nhé! 💪`;
      }
      return 'Con thử phát âm lại từ này cho rõ ràng hơn nhé! 💪';
    }
    if (result.reason === 'incomplete_reading') {
      return 'Con thử đọc đủ từ/câu mẫu một lần nữa nhé.';
    }
    if (result.reason === 'different_content') {
      if (perception?.transcript) {
        return `Cô nghe thấy từ "${perception.transcript}". Mình cùng đọc lại từ "${policy.targetText}" nhé! 😊`;
      }
      return `Mình cùng đọc lại từ "${policy.targetText}" trên màn hình nhé.`;
    }
  }
  if (result.status === 'retry') {
    if (result.reason === 'no_clear_speech') {
      return 'Chưa nghe thấy tiếng con nói. Con hãy nói to và rõ hơn vào mic nhé! 🎤';
    }
    if (result.reason === 'interference') {
      return 'Có tiếng ồn xung quanh hoặc tiếng người khác nói. Con tìm chỗ yên tĩnh đọc lại nhé! 🤫';
    }
    if (result.reason === 'conflicting_evidence') {
      return 'Hai lượt AI nhận diện chưa thống nhất, chưa kết luận con đọc sai. Con nghe lại bản ghi rồi thử đọc lại nhé! 🎤';
    }
    if (result.reason === 'uncertain_assessment') {
      return 'AI chưa đánh giá chắc chắn lần đọc này, chưa kết luận con đọc sai. Con nghe lại bản ghi rồi thử đọc lại nhé! 🎤';
    }
    return 'Mình chưa nghe rõ lần này. Con thử nói lại nhé. 🎤';
  }
  if (result.status === 'service_error') {
    return 'Kết nối đang gặp trục trặc. Hãy thử gửi lại bản ghi. 🔌';
  }
  return 'Lỗi không xác định.';
}
