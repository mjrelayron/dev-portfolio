import { memo, Suspense, useEffect, useRef, type PointerEvent as RPointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Square, Copy, X, ExternalLink } from 'lucide-react';
import { useWindows, type Geom, type WinState } from '../store/useWindows';
import { appById, clampGeom, defaultGeom, DOCK_H, MIN_H, MIN_W, TOPBAR_H, type OsApp } from './apps';
import { useViewport } from './useViewport';
import { AppErrorBoundary } from './AppErrorBoundary';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Skeleton } from '../components/ui/Skeleton';
import { playSound } from '../hooks/useSound';

export function WindowSkeleton() {
  return (
    <div className="space-y-4 p-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-9 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid gap-3 pt-2 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="aspect-[16/9] w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

/** App content never re-renders because of window moves. */
export const AppBody = memo(function AppBody({ app }: { app: OsApp }) {
  const C = app.Component;
  return (
    <AppErrorBoundary name={app.name}>
      <Suspense fallback={<WindowSkeleton />}>
        <C />
      </Suspense>
    </AppErrorBoundary>
  );
});

export function Window({ win, focused }: { win: WinState; focused: boolean }) {
  const app = appById[win.id];
  const vp = useViewport();
  const reduced = useReducedMotion();
  const saved = useWindows((s) => s.geom[win.id]);
  const cascade = useWindows((s) => s.cascade);
  const { focus, close, minimize, toggleMaximize, setGeom } = useWindows.getState();
  const outer = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const initialCascade = useRef(cascade);

  const base: Geom = clampGeom(saved ?? defaultGeom(app, initialCascade.current, vp.w, vp.h), vp.w, vp.h);
  const g: Geom = win.maximized ? { x: 0, y: TOPBAR_H, w: vp.w, h: vp.h - TOPBAR_H - DOCK_H } : base;

  // first open: remember the default geometry so later opens are stable
  useEffect(() => {
    if (!saved) setGeom(win.id, base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // move focus into the window when it opens (unless the app focused something itself)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (!section.current?.contains(document.activeElement)) section.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // when this window becomes the focused one after a close/minimise, catch the stray keyboard focus
  useEffect(() => {
    if (!focused || win.minimized) return;
    const a = document.activeElement;
    if (!a || a === document.body) section.current?.focus({ preventScroll: true });
  }, [focused, win.minimized]);

  /** Shared pointer-drag plumbing: writes styles directly, commits on release. */
  const startDrag = (e: RPointerEvent, mode: 'move' | 'resize') => {
    if (e.button !== 0 || win.maximized) return;
    if (mode === 'move' && (e.target as HTMLElement).closest('button,a')) return;
    e.preventDefault();
    const el = outer.current;
    if (!el) return;
    const start = { px: e.clientX, py: e.clientY, ...g };
    let next = { ...g };
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    el.classList.add('is-dragging');
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - start.px;
      const dy = ev.clientY - start.py;
      if (mode === 'move') {
        next = clampGeom({ ...start, x: start.x + dx, y: start.y + dy }, window.innerWidth, window.innerHeight);
      } else {
        const maxW = window.innerWidth - start.x - 8;
        const maxH = window.innerHeight - DOCK_H - start.y - 4;
        next = { ...start, w: Math.min(maxW, Math.max(MIN_W, start.w + dx)), h: Math.min(maxH, Math.max(MIN_H, start.h + dy)) };
      }
      el.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
      el.style.width = `${next.w}px`;
      el.style.height = `${next.h}px`;
    };
    const onUp = () => {
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
      target.removeEventListener('pointercancel', onUp);
      el.classList.remove('is-dragging');
      setGeom(win.id, { x: next.x, y: next.y, w: next.w, h: next.h });
    };
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
    target.addEventListener('pointercancel', onUp);
  };

  const Icon = app.icon;
  const titleId = `win-title-${win.id}`;

  return (
    <div
      ref={outer}
      className={`os-window-pos ${win.maximized ? 'is-max' : ''}`}
      style={{ transform: `translate3d(${g.x}px, ${g.y}px, 0)`, width: g.w, height: g.h, zIndex: win.z }}
      onPointerDownCapture={() => focus(win.id)}
      inert={win.minimized || undefined}
    >
      <motion.section
        ref={section}
        tabIndex={-1}
        aria-labelledby={titleId}
        className={`os-window ${focused ? 'is-focused' : ''}`}
        style={{ ['--win-accent' as string]: app.accent, transformOrigin: '50% 100%' }}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 14 }}
        animate={win.minimized ? (reduced ? { opacity: 0 } : { opacity: 0, scale: 0.55, y: 260 }) : { opacity: 1, scale: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 10, transition: { duration: 0.14 } }}
        transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 520, damping: 38, mass: 0.8 }}
      >
        <header className="os-window__bar" onPointerDown={(e) => startDrag(e, 'move')} onDoubleClick={(e) => !(e.target as HTMLElement).closest('button,a') && toggleMaximize(win.id)}>
          <span className="os-window__icon" style={{ background: app.accent, borderBottomColor: app.accentDark }} aria-hidden>
            <Icon size={13} strokeWidth={2.4} />
          </span>
          <h2 id={titleId} className="os-window__title">
            {app.name}
          </h2>
          <div className="os-window__controls">
            {app.path && (
              <Link to={app.path} className="os-ctl" title="Open as full page" aria-label={`Open ${app.name} as a full page`}>
                <ExternalLink size={13} aria-hidden />
              </Link>
            )}
            <button type="button" className="os-ctl" onClick={() => minimize(win.id)} title="Minimise" aria-label={`Minimise ${app.name}`}>
              <Minus size={14} aria-hidden />
            </button>
            <button
              type="button"
              className="os-ctl"
              onClick={() => toggleMaximize(win.id)}
              title={win.maximized ? 'Restore' : 'Maximise'}
              aria-label={`${win.maximized ? 'Restore' : 'Maximise'} ${app.name}`}
            >
              {win.maximized ? <Copy size={12} aria-hidden /> : <Square size={11} aria-hidden />}
            </button>
            <button
              type="button"
              className="os-ctl os-ctl--close"
              onClick={() => {
                playSound('tick');
                close(win.id);
              }}
              title="Close (Ctrl+W)"
              aria-label={`Close ${app.name}`}
            >
              <X size={14} aria-hidden />
            </button>
          </div>
        </header>
        <div className={`os-window__body ${win.id === 'terminal' ? 'os-window__body--term' : ''}`}>
          <AppBody app={app} />
        </div>
        {!win.maximized && <div className="os-window__resize" onPointerDown={(e) => startDrag(e, 'resize')} aria-hidden />}
      </motion.section>
    </div>
  );
}
