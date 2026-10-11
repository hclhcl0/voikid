'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ArenaAnswer } from '@/lib/arena';

// Locally synthesized effects: no downloads or external audio requests.
export function useArenaSound() {
  const [enabled, setEnabled] = useState(true);
  const context = useRef<AudioContext | null>(null);
  const voices = useRef(new Set<AudioScheduledSourceNode>());
  const generation = useRef(0);
  const stop = useCallback(() => {
    generation.current++;
    for (const voice of voices.current) { try { voice.stop(); } catch { /* Already ended. */ } }
    voices.current.clear();
  }, []);
  useEffect(() => {
    const hide = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', hide);
    return () => {
      document.removeEventListener('visibilitychange', hide);
      stop();
      void context.current?.close().catch(() => {});
      context.current = null;
    };
  }, [stop]);
  const toggle = () => { stop(); setEnabled(value => !value); };
  const play = (answer: ArenaAnswer, special: boolean, motion: 'auto' | 'full' | 'light') => {
    stop();
    if (!enabled || typeof window.AudioContext !== 'function') return;
    try {
      const ctx = context.current ?? new AudioContext();
      context.current = ctx;
      const playback = generation.current;
      // Invoked by the answer gesture to unlock browser audio.
      void ctx.resume().then(() => {
        if (context.current !== ctx || document.hidden || generation.current !== playback) return;
        const reduced = motion === 'light' || (motion === 'auto' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        const base = ctx.currentTime + .02;
        const timing = reduced ? .15 : 1;
        const track = (source: AudioScheduledSourceNode, gain: GainNode) => {
          voices.current.add(source);
          source.onended = () => { voices.current.delete(source); source.disconnect(); gain.disconnect(); };
        };
        const tone = (delay: number, from: number, to: number, duration: number, volume: number, type: OscillatorType = 'sine') => {
          const oscillator = ctx.createOscillator(), gain = ctx.createGain();
          const at = base + delay * timing;
          oscillator.type = type;
          oscillator.frequency.setValueAtTime(from, at);
          oscillator.frequency.exponentialRampToValueAtTime(to, at + duration);
          gain.gain.setValueAtTime(.0001, at);
          gain.gain.exponentialRampToValueAtTime(volume, at + .01);
          gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
          oscillator.connect(gain); gain.connect(ctx.destination); track(oscillator, gain);
          oscillator.start(at); oscillator.stop(at + duration + .01);
        };
        const whoosh = (delay: number, power: number) => {
          const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * .2), ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
          const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
          const at = base + delay * timing;
          source.buffer = buffer; filter.type = 'bandpass'; filter.Q.value = .8;
          filter.frequency.setValueAtTime(900 + power * 200, at); filter.frequency.exponentialRampToValueAtTime(250, at + .2);
          gain.gain.setValueAtTime(.12, at); gain.gain.exponentialRampToValueAtTime(.0001, at + .2);
          source.connect(filter); filter.connect(gain); gain.connect(ctx.destination); track(source, gain);
          source.addEventListener('ended', () => filter.disconnect(), { once: true }); source.start(at);
        };
        if (answer.correct) {
          whoosh(.16, answer.speedTier ?? 0);
          tone(.48, 190, 65, .16, .16, 'triangle');
          tone(.49, 700, 230, .12, .07);
          if (special || (answer.speedTier ?? 0) >= 2) {
            [660, 880, special ? 1320 : 1100].forEach((frequency, i) => tone(.08 + i * .07, frequency, frequency * 1.12, .24, .055));
          }
        } else tone(.06, 330, 220, .18, .06, 'triangle');
        if (answer.rivalDamage > 0) {
          whoosh(.85, 0);
          tone(1.05, 130, 45, .2, .13, 'triangle');
        }
      }).catch(() => {});
    } catch { /* Unsupported or blocked audio must never interrupt the match. */ }
  };
  return { enabled, toggle, play, stop };
}
