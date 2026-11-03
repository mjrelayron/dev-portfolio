import { useEffect, useRef, useState } from 'react';
import { loadGsap } from './gsap';
import { DevBot } from '../mascot/DevBot';
import { prefersReducedMotion } from '../hooks/useReducedMotion';
import { playSound } from '../hooks/useSound';
import type { DevBotState } from '../mascot/types';

/**
 * 5-second intro: dark sky → portal ring draws and glows → DEV-BOT pops out and
 * waves → the camera pulls back to the archipelago → wordmark → settle.
 * Always skippable; the HUD (incl. Classic view) stays above it.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [bot, setBot] = useState<DevBotState>('idle');
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    const world = document.querySelector<HTMLElement>('.world-layer');
    if (world) {
      world.style.transform = '';
      world.style.opacity = '';
    }
    onDone();
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let kill = () => {};
    loadGsap().then((gsap) => {
      if (done.current) return;
      kill = play(gsap, el);
    });
    return () => kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function play(gsap: typeof import('gsap').gsap, el: HTMLDivElement) {
    const world = document.querySelector<HTMLElement>('.world-layer');

    if (prefersReducedMotion()) {
      const t = gsap.to(el, { opacity: 0, duration: 0.6, delay: 0.8, onComplete: finish });
      return () => {
        t.kill();
      };
    }

    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({ onComplete: finish });
    if (world) gsap.set(world, { scale: 2.6, opacity: 0, transformOrigin: '50% 20%' });
    gsap.set(q('.intro-ring'), { strokeDasharray: 700, strokeDashoffset: 700 });
    gsap.set(q('.intro-glow'), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' });
    gsap.set(q('.intro-bot'), { y: 40, scale: 0.3, opacity: 0 });
    gsap.set(q('.intro-word span'), { y: 24, opacity: 0 });
    gsap.set(q('.intro-tag'), { opacity: 0, y: 10 });

    tl.to(q('.intro-ring'), { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut' }, 0.3)
      .to(q('.intro-glow'), { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 1.0)
      .add(() => playSound('whoosh'), 1.0)
      .to(q('.intro-bot'), { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' }, 1.4)
      .add(() => setBot('wave'), 1.9)
      .to(q('.intro-portal'), { scale: 0.25, y: '-34vh', opacity: 0, duration: 1.1, ease: 'power3.inOut' }, 2.7)
      .to(q('.intro-bg'), { opacity: 0, duration: 1.1, ease: 'power2.inOut' }, 2.7);
    if (world) tl.to(world, { scale: 1, opacity: 1, duration: 1.3, ease: 'power3.inOut' }, 2.6);
    tl.to(q('.intro-word span'), { y: 0, opacity: 1, duration: 0.5, stagger: 0.035, ease: 'back.out(1.6)' }, 3.3)
      .to(q('.intro-tag'), { opacity: 1, y: 0, duration: 0.4 }, 3.9)
      .to(q('.intro-title'), { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, 5.0)
      .to(el, { opacity: 0, duration: 0.3 }, 5.3);

    return () => {
      tl.kill();
    };
  }

  const word = 'DEVELOPERVERSE';
  return (
    <div ref={root} className="intro" role="dialog" aria-label="Intro animation">
      <div className="intro-bg absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 55%, #1d2250 0%, #0b0d20 70%)' }} />
      <div className="intro-portal relative grid place-items-center">
        <svg viewBox="-120 -140 240 280" width="240" height="280" aria-hidden>
          <defs>
            <radialGradient id="intro-inner" cx="50%" cy="50%" r="55%">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.45" stopColor="#C9C6FF" />
              <stop offset="1" stopColor="#6C63FF" stopOpacity="0.85" />
            </radialGradient>
            <filter id="intro-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>
          <g className="intro-glow">
            <ellipse rx="92" ry="118" fill="#6C63FF" opacity="0.45" filter="url(#intro-blur)" />
            <ellipse rx="80" ry="104" fill="url(#intro-inner)" />
          </g>
          <ellipse className="intro-ring" rx="92" ry="118" fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
        </svg>
        <div className="intro-bot absolute">
          <DevBot size="lg" state={bot} />
        </div>
      </div>
      <div className="intro-title pointer-events-none absolute inset-x-0 top-[22vh] text-center">
        <p className="intro-word intro__wordmark" aria-label={word}>
          {word.split('').map((c, i) => (
            <span key={i} className="inline-block" aria-hidden>
              {c}
            </span>
          ))}
        </p>
        <p className="intro-tag mono-label mt-3 text-ink-2">Build. Explore. Experience.</p>
      </div>
      <button type="button" className="btn-3d btn-3d--ghost intro__skip" onClick={finish} autoFocus>
        Skip intro
      </button>
    </div>
  );
}
