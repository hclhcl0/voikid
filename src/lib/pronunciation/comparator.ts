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

function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length, n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
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

  // 2. Nếu là bài từ đơn (word task)
  if (policy.taskKind === 'word') {
    const targetClean = cleanAndNormalize(policy.targetText).join(' ');
    const singleWordAllowed = Array.from(new Set([
      targetClean,
      ...allAllowed.map(a => a.split(' ')).flat()
    ])).filter(Boolean);

    // 2a. Nếu một trong các token của transcript trùng khớp với target hoặc allowed
    // Ví dụ: bé nói "a cat", "the cat", "it's a cat", "cat cat" -> token "cat" khớp
    if (tTokens.some(token => singleWordAllowed.includes(token))) {
      return 'allowed_match';
    }

    // 2b. Kiểm tra khoảng cách Levenshtein / biến thể ngữ âm gần gũi
    // (ASR mở không có ngữ cảnh thường nhận âm vị trẻ em lệch nhẹ: cat -> kat, cut, cap)
    for (const token of tTokens) {
      for (const allowed of singleWordAllowed) {
        if (!allowed) continue;
        const dist = levenshteinDistance(token, allowed);
        const maxLen = Math.max(token.length, allowed.length);
        const sim = 1 - dist / maxLen;
        // Cho phép lệch tối đa 1 ký tự cho từ ngắn (<=4 ký tự) hoặc 2 ký tự cho từ dài, hoặc sim >= 0.7
        if ((maxLen <= 4 && dist <= 1) || (maxLen > 4 && dist <= 2) || sim >= 0.7) {
          return 'allowed_match';
        }
      }
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
