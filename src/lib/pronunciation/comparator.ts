import { LessonPolicy, ContentComparison } from './types';

function cleanAndNormalize(text: string): string[] {
  if (!text) return [];
  // Chuẩn hóa Unicode, lowercase, bỏ tất cả dấu câu, ngoặc kép, nháy đơn/kép, gạch nối, ký tự đặc biệt
  const normalized = text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[.,!?;:()[\]{}"'’“”\-—_/~#@$%^&*+=\\]/g, ' ')
    .trim();
  
  if (!normalized) return [];
  return normalized.split(/\s+/).filter(Boolean);
}

export function compareContent(
  transcript: string | null,
  policy: LessonPolicy
): ContentComparison {
  if (!transcript) return 'other';

  const tTokens = cleanAndNormalize(transcript);
  if (tTokens.length === 0) return 'other';

  const tStr = tTokens.join(' ');

  // 1. So sánh toàn bộ transcript với acceptedResponses và acceptedTranscriptAliases
  const allAllowed = [
    ...policy.acceptedResponses,
    ...policy.acceptedTranscriptAliases,
  ].map(ans => cleanAndNormalize(ans).join(' ')).filter(Boolean);

  if (allAllowed.includes(tStr)) {
    return 'allowed_match';
  }

  // Repetitions are accepted only when they repeat a complete allowed response.
  if (policy.taskKind === 'word' && policy.allowRepetitions) {
    for (const allowed of allAllowed) {
      const words = allowed.split(' ');
      if (tTokens.length > words.length && tTokens.length % words.length === 0 && tTokens.every((token, i) => token === words[i % words.length])) return 'allowed_match';
    }
  }

  // 3. Nếu là bài câu và transcript khác rỗng có thể thu được bằng xóa token từ permitted response
  if (policy.taskKind === 'sentence') {
    for (const allowed of allAllowed) {
      const aTokens = allowed.split(' ');
      if (isSubsequence(tTokens, aTokens)) {
        return 'omissions_only';
      }
    }
  }

  return 'other';
}

function isSubsequence(sub: string[], main: string[]): boolean {
  if (sub.length === 0) return true;
  if (main.length === 0) return false;
  
  let i = 0;
  let j = 0;
  while (i < sub.length && j < main.length) {
    if (sub[i] === main[j]) {
      i++;
    }
    j++;
  }
  return i === sub.length;
}
