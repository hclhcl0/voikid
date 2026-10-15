/** A pronunciation retry or practice never removes stars earned earlier. */
export function pronunciationStarGain(previousStars: number, stars: number): number {
  return Math.max(0, stars - previousStars);
}
