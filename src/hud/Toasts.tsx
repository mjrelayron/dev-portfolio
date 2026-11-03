import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Trophy, CheckCircle2, X } from 'lucide-react';
import { create } from 'zustand';
import { useAchievements } from '../store/useAchievements';
import { achievementById } from '../data/achievements';
import { DevBot } from '../mascot/DevBot';
import { burst } from '../hooks/useConfetti';
import { playSound } from '../hooks/useSound';

interface Toast {
  id: number;
  title: string;
  body?: string;
  kind: 'achievement' | 'success' | 'info';
}

interface ToastStore {
  toasts: Toast[];
  push: (t: Omit<Toast, 'id'>) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;
export const useToasts = create<ToastStore>((set) => ({
  toasts: [],
  push: (t) => set((s) => ({ toasts: [...s.toasts, { ...t, id: nextId++ }] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));
export const toast = (t: Omit<Toast, 'id'>) => useToasts.getState().push(t);

/** Turns freshly unlocked achievements into celebratory toasts. */
function useAchievementToasts() {
  const queue = useAchievements((s) => s.queue);
  useEffect(() => {
    if (!queue.length) return;
    const id = queue[0];
    useAchievements.getState().shiftQueue();
    const a = achievementById[id];
    toast({ kind: 'achievement', title: `Unlocked: ${a.name}`, body: a.how });
    playSound('chime');
    burst({ origin: { x: 0.88, y: 0.14 }, colors: ['#FFCF6B', '#FFAD5A', '#FFFFFF'] });
  }, [queue]);
}

function ToastItem({ t }: { t: Toast }) {
  const dismiss = useToasts((s) => s.dismiss);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (hover) return;
    const timer = setTimeout(() => dismiss(t.id), 5200);
    return () => clearTimeout(timer);
  }, [hover, t.id, dismiss]);
  const Icon = t.kind === 'achievement' ? Trophy : CheckCircle2;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="panel pointer-events-auto flex w-[min(22rem,calc(100vw-2rem))] items-center gap-3 p-3 pr-3"
    >
      <DevBot size="xs" state={t.kind === 'achievement' ? 'celebrate' : 'wave'} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 font-display text-[0.95rem] font-bold">
          <Icon size={16} className={t.kind === 'achievement' ? 'text-gold' : 'text-mint'} aria-hidden />
          {t.title}
        </p>
        {t.body && <p className="text-[0.82rem] leading-snug text-ink-2">{t.body}</p>}
      </div>
      <button type="button" onClick={() => dismiss(t.id)} className="shrink-0 rounded-lg p-1.5 text-ink-3 hover:text-white" aria-label="Dismiss notification">
        <X size={14} />
      </button>
    </motion.li>
  );
}

export function Toasts() {
  useAchievementToasts();
  const toasts = useToasts((s) => s.toasts);
  return (
    <div aria-live="polite" className="pointer-events-none fixed right-3 top-[calc(var(--hud-top)+8px)] z-[90] sm:right-5">
      <ul className="flex flex-col items-end gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <ToastItem key={t.id} t={t} />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
