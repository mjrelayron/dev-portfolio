import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinations } from '../data/destinations';

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));

/** 1–6 jump to destinations, H goes home, Esc closes a destination back to the map. */
export function useKeyboardNav(enabled = true) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      if (document.querySelector('[aria-modal="true"]')) return;
      const dest = destinations.find((d) => d.key === e.key);
      if (dest) {
        e.preventDefault();
        navigate(dest.path);
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        navigate('/world');
      } else if (e.key === 'Escape' && window.location.pathname !== '/world' && window.location.pathname !== '/') {
        navigate('/world');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled, navigate]);
}
