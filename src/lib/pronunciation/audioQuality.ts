export function frameQuality(samples: Uint8Array) {
  let squares = 0, clipped = 0;
  for (const value of samples) { const x = (value - 128) / 128; squares += x*x; if (value <= 1 || value >= 254) clipped++; }
  return { rms: Math.sqrt(squares / Math.max(1,samples.length)), clippedFraction: clipped / Math.max(1,samples.length) };
}
/** Float samples retain quiet consonants that are rounded away by byte sampling. */
export function floatFrameQuality(samples: Float32Array) {
  let squares=0,clipped=0;
  for(const value of samples){squares+=value*value;if(Math.abs(value)>=0.99)clipped++;}
  return {rms:Math.sqrt(squares/Math.max(1,samples.length)),clippedFraction:clipped/Math.max(1,samples.length)};
}

export function voiceThresholds(noiseFloor:number,adaptive:boolean) {
  if(!adaptive)return {speech:0.018,silence:0.01};
  const floor=Math.max(0,Number.isFinite(noiseFloor)?noiseFloor:0.004);
  const speech=Math.min(0.08,Math.max(0.012,floor*3));
  // Hysteresis must remain ordered even in a noisy room, or speech can end while audible.
  const silence=Math.min(speech*0.65,Math.max(0.004,floor*1.5));
  return {speech,silence};
}

export function recordingProblem(speechMs: number, clippedFraction: number, minSpeechMs: number): string | null {
  if (speechMs < minSpeechMs) return 'Chưa nghe rõ tiếng con. Con nói gần micro hơn và thử lại nhé.';
  if (clippedFraction > 0.08) return 'Âm thanh bị vỡ. Con để micro xa hơn một chút và thu lại nhé.';
  return null;
}
