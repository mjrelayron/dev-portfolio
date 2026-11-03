import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Trophy } from 'lucide-react';
import { allSkills } from '../../../data/skills';
import { gameBySlug, readBest, writeBest } from '../../games';
import { Button, ButtonLink } from '../../../components/ui/Button';
import { DevBot } from '../../../mascot/DevBot';
import { burst } from '../../../hooks/useConfetti';
import { playSound } from '../../../hooks/useSound';
import { prefersReducedMotion } from '../../../hooks/useReducedMotion';
import type { StackEngine } from './engine';

const meta = gameBySlug['stack-builder'];
type Phase = 'loading' | 'ready' | 'playing' | 'paused' | 'over';

/** Stable pseudo-shuffle so every run mixes the stack differently. */
function shuffled<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function StackBuilder() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<StackEngine | null>(null);
  const phaseRef = useRef<Phase>('loading');
  const [phase, setPhaseState] = useState<Phase>('loading');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const bestRef = useRef(0);
  const overAt = useRef(0);
  const primaryRef = useRef<HTMLButtonElement>(null);

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };

  // boot the engine in the browser only
  useEffect(() => {
    let alive = true;
    let ro: ResizeObserver | null = null;
    const b = readBest(meta.bestKey!);
    bestRef.current = b;
    setBest(b);
    import('./engine').then(({ createStackEngine, WORLD_W, WORLD_H }) => {
      if (!alive || !canvasRef.current || !wrapRef.current) return;
      const labels = shuffled(allSkills.map((s) => s.name));
      const eng = createStackEngine(
        canvasRef.current,
        labels,
        {
          onScore: (n) => {
            setScore(n);
            playSound('tick');
          },
          onOver: (n) => {
            overAt.current = performance.now();
            setPhase('over');
            if (n > bestRef.current) {
              bestRef.current = n;
              writeBest(meta.bestKey!, n);
              setBest(n);
              setNewBest(true);
              playSound('chime');
              if (!prefersReducedMotion()) burst({ origin: { x: 0.5, y: 0.4 }, particleCount: 50 });
            } else playSound('whoosh');
          },
        },
        { reduced: prefersReducedMotion() },
      );
      engineRef.current = eng;
      const fit = () => {
        const el = wrapRef.current;
        if (!el) return;
        const w = el.clientWidth;
        eng.resize(w, (w * WORLD_H) / WORLD_W, Math.min(2, window.devicePixelRatio || 1));
      };
      ro = new ResizeObserver(fit);
      ro.observe(wrapRef.current);
      fit();
      setPhase('ready');
    });
    return () => {
      alive = false;
      ro?.disconnect();
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    if (!engineRef.current) return;
    setScore(0);
    setNewBest(false);
    engineRef.current.start();
    setPhase('playing');
    wrapRef.current?.focus({ preventScroll: true });
  }, []);

  const pause = useCallback(() => {
    if (phaseRef.current !== 'playing') return;
    engineRef.current?.pause();
    setPhase('paused');
  }, []);

  const resume = useCallback(() => {
    if (phaseRef.current !== 'paused') return;
    engineRef.current?.resume();
    setPhase('playing');
    wrapRef.current?.focus({ preventScroll: true });
  }, []);

  const act = useCallback(() => {
    const p = phaseRef.current;
    if (p === 'playing') {
      engineRef.current?.drop();
      playSound('pop');
    } else if (p === 'ready' || (p === 'over' && performance.now() - overAt.current > 900)) start();
    else if (p === 'paused') resume();
  }, [start, resume]);

  // keyboard: Space / Enter drop, P / Esc pause
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('input,textarea,select,[contenteditable="true"]')) return;
      if (e.key === ' ' || e.key === 'Enter') {
        if (el.closest('button,a')) return; // let real buttons click
        e.preventDefault();
        if (!e.repeat) act();
      } else if (e.key === 'p' || e.key === 'P') {
        phaseRef.current === 'paused' ? resume() : pause();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [act, pause, resume]);

  // pause when the tab is hidden
  useEffect(() => {
    const onVis = () => document.hidden && pause();
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('blur', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('blur', onVis);
    };
  }, [pause]);

  useEffect(() => {
    if (phase === 'over' || phase === 'paused') requestAnimationFrame(() => primaryRef.current?.focus({ preventScroll: true }));
  }, [phase]);

  return (
    <div className="sb">
      <div className="sb-side">
        <div className="sb-stats" aria-live="polite">
          <div className="sb-stat">
            <span className="mono-label text-ink-3">Height</span>
            <span className="sb-stat__value">{score}</span>
            <span className="text-xs text-ink-3">floors</span>
          </div>
          <div className="sb-stat">
            <span className="mono-label text-ink-3">Best</span>
            <span className="sb-stat__value text-gold">{best}</span>
            <span className="text-xs text-ink-3">floors</span>
          </div>
        </div>
        <div className="panel sb-help">
          <p className="font-display font-bold">How to play</p>
          <ul className="mt-2 space-y-1 text-[0.9rem] text-ink-2">
            <li>
              <kbd className="sb-kbd">Space</kbd> / tap to release the block.
            </li>
            <li>Blocks keep the crane’s swing — time it.</li>
            <li>Anything that falls off the island ends the run.</li>
            <li>
              <kbd className="sb-kbd">P</kbd> pauses.
            </li>
          </ul>
          {phase === 'playing' && (
            <Button size="sm" variant="ghost" className="mt-4" onClick={pause} icon={<Pause size={14} aria-hidden />}>
              Pause
            </Button>
          )}
        </div>
      </div>

      <div
        ref={wrapRef}
        className="sb-stage"
        tabIndex={0}
        role="application"
        aria-label={`Stack Builder game. Height ${score} floors. Press Space to ${phase === 'playing' ? 'drop the block' : 'start'}.`}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('button,a')) return;
          e.preventDefault();
          act();
        }}
      >
        <canvas ref={canvasRef} className="sb-canvas" aria-hidden />
        <div className="sb-score" aria-hidden>
          {score}
          <span className="sb-score__best">Best {best}</span>
        </div>

        {phase !== 'playing' && (
          <div className="sb-overlay">
            {phase === 'loading' && <p className="font-mono text-sm text-ink-2">Pouring concrete…</p>}
            {phase === 'ready' && (
              <div className="sb-card">
                <DevBot size="sm" state="wave" />
                <p className="mt-2 font-display text-xl font-bold">Build the tallest tech stack</p>
                <p className="mt-1 text-sm text-ink-2">Each block is a tool from the portfolio’s skill tree.</p>
                <Button ref={primaryRef} className="mt-4" onClick={start} icon={<Play size={16} aria-hidden />}>
                  Start
                </Button>
                <p className="mt-2 text-xs text-ink-3">or press Space</p>
              </div>
            )}
            {phase === 'paused' && (
              <div className="sb-card">
                <p className="font-display text-xl font-bold">Paused</p>
                <Button ref={primaryRef} className="mt-4" onClick={resume} icon={<Play size={16} aria-hidden />}>
                  Resume
                </Button>
              </div>
            )}
            {phase === 'over' && (
              <div className="sb-card">
                <DevBot size="sm" state={newBest ? 'celebrate' : 'think'} />
                <p className="mono-label mt-2 text-accent-text">{newBest ? 'New high score' : 'Tower toppled'}</p>
                <p className="mt-1 font-display text-4xl font-bold">
                  {score} <span className="text-lg text-ink-3">floor{score === 1 ? '' : 's'}</span>
                </p>
                <p className="mt-1 text-sm text-ink-2">{newBest ? 'That’s your tallest stack yet.' : `Best: ${best} floors. One more go?`}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Button ref={primaryRef} onClick={start} icon={<RotateCcw size={16} aria-hidden />}>
                    Play again
                  </Button>
                  <ButtonLink to="/arcade" variant="ghost" icon={<Trophy size={16} aria-hidden />}>
                    Arcade
                  </ButtonLink>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
