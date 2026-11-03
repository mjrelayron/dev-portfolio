import { useSyncExternalStore } from 'react';

let cached = { w: 1440, h: 900 };
const read = () => {
  if (typeof window === 'undefined') return cached;
  if (cached.w !== window.innerWidth || cached.h !== window.innerHeight) cached = { w: window.innerWidth, h: window.innerHeight };
  return cached;
};
const SERVER = { w: 1440, h: 900 };

/** Viewport size, client-side; a fixed desktop size during prerender. */
export function useViewport() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener('resize', cb);
      return () => window.removeEventListener('resize', cb);
    },
    read,
    () => SERVER,
  );
}
