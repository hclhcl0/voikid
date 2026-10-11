import type { CSSProperties } from 'react';
import { FighterArt, type FighterKind } from './FighterArt';
import type { ArenaAnswer } from '@/lib/arena';
import styles from '@/app/arena/arena.module.css';

interface BattleStageProps {
  motion: 'auto' | 'full' | 'light';
  fighter: FighterKind;
  opponent: FighterKind;
  opponentName: string;
  name: string;
  health: number;
  rivalHealth: number;
  round: number;
  total: number;
  combo: number;
  answer?: ArenaAnswer;
  special: boolean;
  onAnimationComplete: () => void;
}

export function BattleStage({ motion, fighter, opponent, opponentName, name, health, rivalHealth, round, total, combo, answer, special, onAnimationComplete }: BattleStageProps) {
  const attack = !!answer?.correct;
  const counter = !!answer?.rivalDamage;
  const defeated = rivalHealth === 0;
  const speedTier = answer?.speedTier ?? 0;
  return <section className={styles.battlefield} aria-label="Đấu trường" data-motion={motion} data-fighter={fighter} data-battle={answer ? 'action' : 'idle'} data-special={special && attack} data-speed={speedTier}>
    <div className={styles.scenery} aria-hidden="true"><span className={styles.moon} /><span className={styles.cloudOne} /><span className={styles.cloudTwo} /><span className={styles.mountainOne} /><span className={styles.mountainTwo} /><div className={styles.floor} /><div className={styles.floorRing} /></div>
    <div className={styles.battleHud}><Health name={name} health={health} /><div className={styles.roundBadge}><strong>VS</strong><span>{round}/{total}</span></div><Health name={opponentName} health={rivalHealth} rival /></div>
    <div className={styles.stage}>
      <div className={styles.playerPosition}>
        <div key={`player:${round}:${!!answer}`} className={[styles.actor, attack && answer ? styles.playerAttack : '', counter ? styles.playerHit : '', answer && !attack && !counter ? styles.playerGuard : ''].join(' ')}>
          <FighterArt kind={fighter} motion={motion} attack={attack} hurt={counter} defeated={health === 0} />
        </div>
        {counter && <span key={`player-damage:${round}`} className={`${styles.damageNumber} ${styles.playerDamage}`}>−{answer!.rivalDamage}</span>}
        {answer && !attack && <span className={styles.shieldAura} aria-hidden="true" />}
      </div>
      <div className={styles.rivalPosition}>
        <div key={`rival:${round}:${!!answer}`} className={[styles.actor, styles.rivalActor, counter ? styles.rivalAttack : '', attack ? styles.rivalHit : '', defeated ? styles.defeated : ''].join(' ')}><FighterArt kind={opponent} motion={motion} attack={counter} hurt={attack} defeated={defeated} rival /></div>
        {attack && <span key={`rival-damage:${round}`} className={`${styles.damageNumber} ${styles.rivalDamage}`}>−{answer!.damage}</span>}
      </div>
      {answer && <div key={`effects:${round}`} className={styles.effects} aria-hidden="true">
        {attack && speedTier > 0 && <><span className={styles.speedFlash} /><span className={styles.speedBurst}>{['', 'NHANH!', 'CHỚP NHOÁNG!', 'THẦN TỐC!'][speedTier]} +{answer.speedBonus}</span>{Array.from({ length: speedTier * 4 }, (_, i) => <span key={`speed:${i}`} className={styles.speedRay} style={{ '--angle': `${i * 360 / (speedTier * 4)}deg` } as CSSProperties} />)}</>}
        <span className={styles.battleTimeline} onAnimationEnd={onAnimationComplete} />
        {attack && <><span className={`${styles.projectile} ${special ? styles.specialProjectile : ''}`}><span /><i /><b /></span><span className={styles.impactRing} /><span className={styles.impactStar}>✦</span><span className={styles.slash} />
          {Array.from({ length: 10 }, (_, i) => <span key={i} className={styles.spark} style={{ '--angle': `${i * 36}deg`, '--distance': `${45 + i % 3 * 18}px`, '--spark-color': special ? '#edc5ff' : '#fff1a4' } as CSSProperties} />)}
        </>}
        {counter && <><span className={styles.rivalProjectile}><i /><b /></span><span className={styles.playerImpact} /></>}
        {attack && <span className={`${styles.moveBanner} ${special ? styles.specialBanner : ''}`}>{special ? 'SIÊU NĂNG LỰC!' : combo >= 2 ? `COMBO ×${combo}` : fighter === 'fox' ? 'KIẾM ÁNH SÁNG' : fighter === 'panda' ? 'KIẾM BẦU TRỜI' : 'PHÉP THUẬT TỪ VỰNG'}</span>}
      </div>}
      {!answer && <span className={styles.readyBadge}>SẴN SÀNG THÁCH ĐẤU</span>}
    </div>
    {answer && <div className={styles.battleStatus} aria-live="polite">{`${answer.correct ? `⚡ Con gây ${answer.damage} sức mạnh!` : '🛡️ Cùng nhớ từ này cho lượt sau nhé.'} ${counter ? `Vệ binh đáp lại ${answer.rivalDamage}.` : 'Vệ binh đang nghỉ lấy sức.'}`}</div>}
  </section>;
}

function Health({ name, health, rival = false }: { name: string; health: number; rival?: boolean }) {
  return <div className={styles.combatant}><div className={styles.healthLabel}><strong>{name}</strong><small>{health}/100</small></div><div className={styles.health} role="progressbar" aria-label={`Sức lực ${name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={health}><div className={rival ? styles.rivalBar : styles.playerBar} style={{ width: `${health}%` }} /></div><span className={styles.healthCaption}>{rival ? 'VỆ BINH TỪ VỰNG' : 'CHIẾN BINH TRI THỨC'}</span></div>;
}
