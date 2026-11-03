import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { apps, appById } from './apps';
import { AppBody } from './Window';
import { AppChip } from './Desktop';
import { TopBar, type MenuItem } from './TopBar';
import type { AppId } from '../store/useWindows';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { DevBot } from '../mascot/DevBot';

/** Phones: a home grid of app icons; each app opens as a full-screen panel. */
export function MobileOS({
  active,
  setActive,
  onSearch,
  menu,
}: {
  active: AppId | null;
  setActive: (id: AppId | null) => void;
  onSearch: () => void;
  menu: MenuItem[];
}) {
  const reduced = useReducedMotion();
  const backRef = useRef<HTMLButtonElement>(null);
  const app = active ? appById[active] : null;

  useEffect(() => {
    if (active) requestAnimationFrame(() => backRef.current?.focus({ preventScroll: true }));
  }, [active]);

  return (
    <>
      <TopBar menu={menu} onSearch={onSearch} />
      <div className="os-home" inert={!!active || undefined}>
        <div className="os-home__hello">
          <DevBot size="sm" state="wave" />
          <div>
            <p className="font-display text-lg font-bold leading-tight">Developer OS</p>
            <p className="text-[0.85rem] text-ink-2">Tap an app to open it.</p>
          </div>
        </div>
        <ul className="os-home__grid">
          {apps.map((a) => (
            <li key={a.id}>
              <button type="button" className="os-icon os-icon--home" onClick={() => setActive(a.id)}>
                <AppChip id={a.id} size="lg" />
                <span className="os-icon__label">{a.name}</span>
              </button>
            </li>
          ))}
          <li>
            <button type="button" className="os-icon os-icon--home" onClick={onSearch}>
              <span className="os-app-chip os-app-chip--lg os-app-chip--ghost" aria-hidden>
                <Search size={26} />
              </span>
              <span className="os-icon__label">Search</span>
            </button>
          </li>
        </ul>
      </div>

      <AnimatePresence>
        {app && (
          <motion.section
            key={app.id}
            className="os-panel"
            aria-label={app.name}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: 40, transition: { duration: 0.16 } }}
            transition={{ type: 'spring', stiffness: 460, damping: 40 }}
          >
            <header className="os-panel__bar" style={{ ['--win-accent' as string]: app.accent }}>
              <button ref={backRef} type="button" className="os-top-pill" onClick={() => setActive(null)}>
                <ArrowLeft size={15} aria-hidden /> Home
              </button>
              <h2 className="truncate font-display text-[1rem] font-bold">{app.name}</h2>
              <span className="w-[74px]" aria-hidden />
            </header>
            <div className={`os-panel__body os-window__body ${app.id === 'terminal' ? 'os-window__body--term' : ''}`}>
              <AppBody app={app} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
