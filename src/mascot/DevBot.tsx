import { lazy, Suspense, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { DevBotSvg } from './DevBotSvg';
import { riveAvailable } from './riveAvailability';
import { sizePx, type DevBotSize, type DevBotState, type LookAt } from './types';
import { useReducedMotion } from '../hooks/useReducedMotion';

const DevBotRive = lazy(() => import('./DevBotRive'));

export interface DevBotProps {
  state?: DevBotState;
  lookAt?: LookAt;
  size?: DevBotSize;
  bubble?: string;
  className?: string;
  /** accessible description; the bot is decorative unless this is set */
  label?: string;
  /** where the speech bubble anchors; 'end' keeps it inside right-hand layouts */
  bubbleAlign?: 'center' | 'end';
}

/**
 * The one mascot component. Renders the Rive file when /rive/devbot.riv
 * exists, otherwise the SVG fallback — dropping the .riv in needs no code change.
 */
export function DevBot({ state = 'idle', lookAt, size = 'md', bubble, className = '', label, bubbleAlign = 'center' }: DevBotProps) {
  const reduced = useReducedMotion();
  const [useRiveBot, setUseRiveBot] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const px = sizePx[size];

  useEffect(() => {
    if (reduced) return; // static SVG pose under reduced motion
    let alive = true;
    riveAvailable().then((ok) => alive && setUseRiveBot(ok));
    return () => {
      alive = false;
    };
  }, [reduced]);

  useEffect(() => setBubbleOpen(true), [bubble]);

  const svg = <DevBotSvg state={state} lookAt={lookAt} px={px} reduced={reduced} />;

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`} role={label ? 'img' : undefined} aria-label={label}>
      {bubble && bubbleOpen && (
        <div
          className={`devbot-bubble pointer-events-auto absolute bottom-full mb-2 w-max ${bubbleAlign === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'} max-w-[15rem] rounded-2xl border border-line bg-white px-3 py-2 pr-7 text-left text-[0.8rem] font-medium leading-snug text-navy shadow-lg`}
          role="status"
        >
          {bubble}
          <button
            type="button"
            onClick={() => setBubbleOpen(false)}
            className="absolute right-1.5 top-1.5 rounded-full p-1 text-[#171b35]/60 hover:bg-[#171b35]/10"
            aria-label="Dismiss message"
          >
            <X size={12} />
          </button>
        </div>
      )}
      <div className="pointer-events-none" style={{ width: px, height: px * (130 / 120) }}>
        {useRiveBot ? (
          <Suspense fallback={svg}>
            <DevBotRive state={state} lookAt={lookAt} px={px} onError={() => setUseRiveBot(false)} />
          </Suspense>
        ) : (
          svg
        )}
      </div>
    </div>
  );
}

export default DevBot;
