export function frameQuality(samples: Uint8Array) {
  let squares = 0, clipped = 0;
  for (const value of samples) { const x = (value - 128) / 128; squares += x*x; if (value <= 1 || value >= 254) clipped++; }
  return { rms: Math.sqrt(squares / Math.max(1,samples.length)), clippedFraction: clipped / Math.max(1,samples.length) };
}
export function recordingProblem(speechMs: number, clippedFraction: number, minSpeechMs: number): string | null {
  if (speechMs < minSpeechMs) return 'Chưa nghe rõ tiếng con. Con nói gần micro hơn và thử lại nhé.';
  if (clippedFraction > 0.08) return 'Âm thanh bị vỡ. Con để micro xa hơn một chút và thu lại nhé.';
  return null;
}
