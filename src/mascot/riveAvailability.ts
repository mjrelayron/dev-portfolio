export const RIVE_SRC = '/rive/devbot.riv';

declare const __HAS_RIVE__: boolean;

// vite.config.js sets __HAS_RIVE__ from whether public/rive/devbot.riv exists,
// so dropping the file in (and rebuilding/deploying) is the only step needed —
// and no 404 request is made while it's missing.
export function riveAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  return Promise.resolve(__HAS_RIVE__);
}
