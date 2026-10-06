export const MIN_NORMAL_SPEED=0.85;
export const SLOW_AUDIO_SPEED=0.7;
export const MAX_AUDIO_SPEED=1.2;

/** Legacy settings could assign slow speed to both buttons. Keep them distinct. */
export function normalAudioSpeed(value:unknown):number {
  const speed=typeof value==='number'&&Number.isFinite(value)?value:MIN_NORMAL_SPEED;
  return Math.max(MIN_NORMAL_SPEED,Math.min(MAX_AUDIO_SPEED,speed));
}
