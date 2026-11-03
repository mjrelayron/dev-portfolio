import { prefersReducedMotion } from './useReducedMotion';

type Opts = { particleCount?: number; spread?: number; origin?: { x: number; y: number }; colors?: string[] };

/** Tiny confetti burst. canvas-confetti is loaded on first use. */
export function burst(opts: Opts = {}) {
  if (typeof window === 'undefined' || prefersReducedMotion()) return;
  import('canvas-confetti').then(({ default: confetti }) => {
    confetti({
      particleCount: opts.particleCount ?? 28,
      spread: opts.spread ?? 60,
      startVelocity: 28,
      gravity: 1.1,
      ticks: 120,
      scalar: 0.8,
      origin: opts.origin ?? { x: 0.5, y: 0.5 },
      colors: opts.colors ?? ['#6C63FF', '#42BDF5', '#FFAD5A', '#79D8A0', '#FFFFFF'],
      disableForReducedMotion: true,
      zIndex: 9999,
    });
  });
}

export function burstAt(el: Element | null, color?: string) {
  if (!el) return burst();
  const r = el.getBoundingClientRect();
  burst({
    origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight },
    colors: color ? [color, '#FFFFFF', color] : undefined,
  });
}
