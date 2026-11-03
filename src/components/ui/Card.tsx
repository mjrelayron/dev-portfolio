import { useRef, type ReactNode, type PointerEvent } from 'react';
import { useCanHover } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Card with a pointer-follow tilt (max 6°) and moving highlight sheen.
 * Pure CSS transforms; no React state per frame.
 */
export function TiltCard({ children, className = '', rarity }: { children: ReactNode; className?: string; rarity?: 'featured' | 'standard' }) {
  const ref = useRef<HTMLDivElement>(null);
  const canHover = useCanHover();
  const reduced = useReducedMotion();
  const enabled = canHover && !reduced;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !enabled) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
    el.style.setProperty('--sx', `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--sy', `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt-card ${rarity === 'featured' ? 'tilt-card--featured' : ''} ${className}`}
    >
      {children}
      <span className="tilt-card__sheen" aria-hidden />
    </div>
  );
}
