import { useMediaQuery } from './useMediaQuery';

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)', false);

/** Non-hook check for imperative code (GSAP timelines, confetti). */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
