'use client';

import { useEffect, useState } from 'react';
import styles from '@/app/arena/arena.module.css';

export type FighterKind = 'flower' | 'star' | 'rainbow' | 'fox' | 'panda' | 'rabbit' | 'dragon' | `valkyrie-${1 | 2 | 3}` | `seer-${1 | 2 | 3}` | `dark_oracle-${1 | 2 | 3}` | `skeleton_warrior-${1 | 2 | 3}`;
type Pose = 'idle' | 'slashing' | 'hurt' | 'dying' | 'victory';
const frames: Record<Pose, number> = { idle: 18, slashing: 12, hurt: 12, dying: 15, victory: 4 };

// Preserve the source canvas so wings and weapons stay aligned between frames.
export function FighterArt({ kind, motion = 'auto', attack = false, hurt = false, defeated = false, rival = false, victory = false }: {
  kind: FighterKind;
  motion?: 'auto' | 'full' | 'light';
  attack?: boolean;
  hurt?: boolean;
  defeated?: boolean;
  rival?: boolean;
  victory?: boolean;
}) {
  const [sprite, setSprite] = useState<{ pose: Pose; frame: number }>({ pose: 'idle', frame: 0 });
  const variant = kind === 'fox' ? '1' : kind === 'rabbit' ? '3' : kind === 'panda' || kind === 'dragon' ? '2' : kind;
  const original = kind === 'flower' || kind === 'star' || kind === 'rainbow';
  useEffect(() => {
    for (const pose of original ? ['idle', 'slashing', 'hurt', 'victory'] : ['idle', 'slashing', 'hurt', 'dying']) {
      const image = new Image();
      image.src = `/arena/chibi/${variant}-${pose}.webp`;
    }
  }, [variant, original]);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setInterval>;
    let resetTimer: ReturnType<typeof setTimeout>;
    const run = () => {
      clearInterval(timer);
      clearTimeout(resetTimer);
      const start = performance.now();
      const update = () => {
        const elapsed = performance.now() - start;
        const reduced = motion === 'light' || (motion === 'auto' && preference.matches);
        let pose: Pose = 'idle';
        let since = elapsed;
        // Reduced motion shows a brief static action, then returns to the idle pose.
        if (reduced && elapsed < 250) {
          if (attack) pose = 'slashing';
          if (hurt) pose = 'hurt';
        }
        if (!reduced) {
          if (rival) {
            if (hurt && elapsed < 800) { pose = 'hurt'; since = Math.max(0, elapsed - 420); }
            if (attack && elapsed >= 800 && elapsed < 1600) { pose = 'slashing'; since = elapsed - 800; }
            if (defeated && elapsed >= 1600) { pose = 'dying'; since = elapsed - 1600; }
          } else {
            if (attack && elapsed < 900) { pose = 'slashing'; since = elapsed; }
            if (hurt && elapsed >= 1050 && elapsed < 1800) { pose = 'hurt'; since = elapsed - 1050; }
            if (defeated && elapsed >= 1800) { pose = 'dying'; since = elapsed - 1800; }
          }
        }
        if (original && pose === 'dying') pose = 'hurt';
        if (original && victory) pose = 'victory';
        const count = original ? 4 : frames[pose];
        const index = Math.floor(since / (original ? (pose === 'idle' ? 250 : 180) : pose === 'idle' ? 90 : 55));
        const frame = reduced ? pose === 'slashing' ? (original ? 2 : Math.floor(count / 2)) : 0 : pose === 'idle' || pose === 'victory' ? index % count : Math.min(index, count - 1);
        setSprite(previous => previous.pose === pose && previous.frame === frame ? previous : { pose, frame });
      };
      update();
      if (motion !== 'light' && (motion === 'full' || !preference.matches)) timer = setInterval(update, 55);
      else resetTimer = setTimeout(update, 260);
    };
    run();
    preference.addEventListener('change', run);
    return () => { clearInterval(timer); clearTimeout(resetTimer); preference.removeEventListener('change', run); };
  }, [motion, attack, hurt, defeated, rival, original, victory]);
  const count = original ? 4 : frames[sprite.pose];
  return <div className={styles.characterArt} aria-hidden="true" data-original={original} data-pose={sprite.pose} style={{
    backgroundImage: `url('/arena/chibi/${variant}-${sprite.pose}.webp')`,
    backgroundSize: `${count * 100}% 100%`,
    backgroundPosition: `${Math.min(sprite.frame, count - 1) / (count - 1) * 100}% 0`,
  }} />;
}
