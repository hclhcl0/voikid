import { runPerceptionBranch, runAssessmentBranch } from './geminiAdapter';
import { compareContent } from './comparator';
import { decideAttemptResult } from './decisionEngine';
import { LessonPolicy, AttemptResult } from './types';

export const ENGINE_VERSION = '2.0.0-dual-branch';

export async function evaluatePronunciationDual(
  attemptId: string,
  audioBase64: string,
  mimeType: string,
  policy: LessonPolicy,
  apiKey: string,
  scoreMode: 'off' | 'estimated' | 'calibrated' = 'off'
): Promise<AttemptResult> {
  const resolvedMime = mimeType || 'audio/webm';
  const modelName = 'gemini-3.5-flash-lite'; // You can fall back if needed

  // A/B chạy song song có giới hạn concurrency; xử lý cả hai kết quả bằng allSettled
  const [perceptionOutcome, assessmentOutcome] = await Promise.allSettled([
    runPerceptionBranch(audioBase64, resolvedMime, apiKey, modelName),
    runAssessmentBranch(audioBase64, resolvedMime, policy, apiKey, scoreMode !== 'off', modelName)
  ]);

  const perception = perceptionOutcome.status === 'fulfilled' ? perceptionOutcome.value : null;
  if (perceptionOutcome.status === 'rejected') {
    console.error('[Perception Error]', perceptionOutcome.reason);
  }

  const assessment = assessmentOutcome.status === 'fulfilled' ? assessmentOutcome.value : null;
  if (assessmentOutcome.status === 'rejected') {
    console.error('[Assessment Error]', assessmentOutcome.reason);
  }

  const comparison = perception ? compareContent(perception.transcript, policy) : null;

  console.log('[DUAL-BRANCH DEBUG]', JSON.stringify({
    attemptId,
    perception,
    assessment,
    comparison,
    targetText: policy.targetText,
    acceptedResponses: policy.acceptedResponses,
  }, null, 2));

  const result = decideAttemptResult(
    attemptId,
    policy,
    perception,
    assessment,
    comparison,
    ENGINE_VERSION,
    scoreMode
  );

  // Gắn phản hồi mẫu dựa theo status, reason và transcript
  result.feedbackVi = generateFeedback(result, policy, assessment, perception);

  return result;
}

function generateFeedback(
  result: AttemptResult,
  policy: LessonPolicy,
  assessment: any,
  perception: any
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
      if (perception?.transcript) {
        return `Cô nghe thấy từ "${perception.transcript}". Con đọc lại từ "${policy.targetText}" nhé! 🎤`;
      }
      return 'Chưa nghe rõ từ con đọc. Con nói to và rõ hơn vào mic nhé! 🎤';
    }
    if (result.reason === 'uncertain_assessment') {
      return 'Âm thanh chưa đủ rõ để chấm. Con nói to và gần mic hơn một chút nhé! 🎤';
    }
    return 'Mình chưa nghe rõ lần này. Con thử nói lại nhé. 🎤';
  }
  if (result.status === 'service_error') {
    return 'Kết nối đang gặp trục trặc. Hãy thử gửi lại bản ghi. 🔌';
  }
  return 'Lỗi không xác định.';
}
