import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useId, useState } from 'react';
import type { DevBotState, LookAt } from './types';
import { burst } from '../hooks/useConfetti';

/**
 * SVG DEV-BOT — same character as the Rive file (see docs/DEVBOT_RIVE_SPEC.md):
 * rounded white body, light-blue accents, dark visor, two cyan eyes, antenna.
 */
export function DevBotSvg({ state = 'idle', lookAt, px, reduced }: { state?: DevBotState; lookAt?: LookAt; px: number; reduced: boolean }) {
  const uid = useId().replace(/:/g, '');
  const arm = useAnimationControls();
  const body = useAnimationControls();
  const [blink, setBlink] = useState(false);

  const lx = Math.max(-100, Math.min(100, lookAt?.x ?? 0)) / 100;
  const ly = Math.max(-100, Math.min(100, lookAt?.y ?? 0)) / 100;
  const thinking = state === 'think';
  const talking = state === 'talk';

  // blink every 3–6 s
  useEffect(() => {
    if (reduced) return;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        loop();
      }, 3000 + Math.random() * 3000);
    };
    loop();
    return () => clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    if (reduced) {
      arm.set({ rotate: state === 'point' ? -80 : 0 });
      return;
    }
    if (state === 'wave') {
      arm.start({ rotate: [0, -130, -95, -130, -95, 0], transition: { duration: 1.4, ease: 'easeInOut' } });
    } else if (state === 'point') {
      arm.start({ rotate: -80, transition: { type: 'spring', stiffness: 260, damping: 14 } });
    } else if (state === 'celebrate') {
      arm.start({ rotate: [0, -150, -150, 0], transition: { duration: 1 } });
      body.start({ y: [0, -22, 0, -10, 0], rotate: [0, 0, 360, 360, 360], transition: { duration: 1.1, ease: 'easeOut' } }).then(() => body.set({ rotate: 0 }));
      burst({ particleCount: 40, spread: 70, origin: undefined });
    } else {
      arm.start({ rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 18 } });
    }
  }, [state, reduced, arm, body]);

  const headRotate = reduced ? 0 : lx * 12;
  const eyeX = (thinking ? 0 : lx) * 7;
  const eyeY = (thinking ? -0.9 : ly) * 5;
  // when pointing at something on the left, mirror the bot so the arm faces it
  const mirror = state === 'point' && lx < -0.15 ? -1 : 1;

  return (
    <svg viewBox="0 0 120 130" width={px} height={px * (130 / 120)} aria-hidden="true" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`eye-${uid}`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#E9FDFF" />
          <stop offset="45%" stopColor="#5FF0FF" />
          <stop offset="100%" stopColor="#14B8E6" />
        </radialGradient>
        <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DCE6FA" />
        </linearGradient>
        <filter id={`glow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* soft floor shadow — shrinks as the bot rises */}
      <motion.ellipse
        cx="60"
        cy="124"
        rx="22"
        ry="4.5"
        fill="#05071A"
        opacity="0.35"
        animate={reduced ? undefined : { scaleX: [1, 0.82, 1], opacity: [0.35, 0.22, 0.35] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        
      />

      <motion.g
        animate={reduced ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.g animate={body}>
          <g transform={mirror === -1 ? 'translate(120 0) scale(-1 1)' : undefined}>
            {/* left arm (static) */}
            <rect x="21" y="76" width="11" height="24" rx="5.5" fill="#CFE0F7" transform="rotate(14 26 78)" />
            {/* body */}
            <path d="M34 74 Q34 66 42 66 H78 Q86 66 86 74 V96 Q86 112 60 112 Q34 112 34 96 Z" fill={`url(#body-${uid})`} />
            <path d="M40 90 H80" stroke="#8ED3F7" strokeWidth="3" strokeLinecap="round" />
            <circle cx="60" cy="100" r="3.2" fill="#42BDF5" />
            {/* right arm (animated: wave / point) */}
            <motion.g animate={arm} style={{ originX: 0.3, originY: 0.08 }}>
              <rect x="84" y="76" width="11" height="24" rx="5.5" fill="#CFE0F7" transform="rotate(-14 89 78)" />
              <circle cx="94" cy="99" r="5" fill="#FFFFFF" transform="rotate(-14 89 78)" />
            </motion.g>

            {/* head */}
            <motion.g animate={{ rotate: headRotate }} transition={{ type: 'spring', stiffness: 120, damping: 14 }} style={{ originX: 0.5, originY: 0.95 }}>
              {/* antenna */}
              <line x1="60" y1="20" x2="60" y2="8" stroke="#CFE0F7" strokeWidth="3" strokeLinecap="round" />
              <motion.circle
                cx="60"
                cy="6"
                r="4.5"
                fill="#5FF0FF"
                filter={`url(#glow-${uid})`}
                animate={reduced ? undefined : { opacity: [1, 0.45, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <rect x="20" y="18" width="80" height="50" rx="18" fill={`url(#body-${uid})`} />
              <rect x="20" y="58" width="80" height="6" rx="3" fill="#BFE6FB" opacity="0.8" />
              <rect x="14" y="34" width="8" height="16" rx="4" fill="#42BDF5" />
              <rect x="98" y="34" width="8" height="16" rx="4" fill="#42BDF5" />
              {/* visor */}
              <motion.rect
                x="28"
                y="26"
                width="64"
                height="32"
                rx="13"
                fill="#141833"
                stroke="#42BDF5"
                strokeOpacity={talking ? 0.9 : 0.25}
                strokeWidth="2"
                animate={talking && !reduced ? { strokeOpacity: [0.25, 0.95, 0.25] } : undefined}
                transition={{ duration: 0.45, repeat: Infinity }}
              />
              <path d="M34 31 Q46 28 58 29" stroke="#FFFFFF" strokeOpacity="0.14" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* eyes */}
              <motion.g animate={{ x: eyeX, y: eyeY }} transition={{ type: 'spring', stiffness: 160, damping: 16 }} filter={`url(#glow-${uid})`}>
                {[48, 72].map((cx) => (
                  <motion.ellipse
                    key={cx}
                    cx={cx}
                    cy="42"
                    rx="6"
                    ry="7.5"
                    fill={`url(#eye-${uid})`}
                    animate={{ scaleY: blink ? 0.1 : state === 'celebrate' ? 0.55 : 1 }}
                    transition={{ duration: 0.08 }}
                    
                  />
                ))}
              </motion.g>
            </motion.g>
          </g>

          {/* thinking dots */}
          {thinking && (
            <g>
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={92 + i * 9}
                  cy={10 - i * 4}
                  r={2.5 + i * 0.6}
                  fill="#C4C8E8"
                  initial={{ opacity: 0 }}
                  animate={reduced ? { opacity: 1 } : { opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </g>
          )}
        </motion.g>
      </motion.g>
    </svg>
  );
}
