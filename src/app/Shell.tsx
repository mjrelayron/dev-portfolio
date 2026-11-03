import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { destinationForPath } from '../data/destinations';
import { layoutFor } from './routes';
import { HubMap } from '../world/HubMap';
import { Breadcrumb } from '../hud/Breadcrumb';
import { Toggles } from '../hud/Toggles';
import { Dock } from '../hud/Dock';
import { Toasts } from '../hud/Toasts';
import { useKeyboardNav } from '../hooks/useKeyboardNav';
import { useAchievements } from '../store/useAchievements';
import { ClientOnly } from '../components/ui/ClientOnly';

const ChatWidget = lazy(() => import('../components/ChatWidget.jsx'));
// completes Project Explorer missions when a target case study is visited (lazy: keeps data out of the entry)
const MissionTracker = lazy(() => import('../arcade/MissionTracker').then((m) => ({ default: m.MissionTracker })));

/** Persistent chrome: the hub map (kept mounted so zooms can reverse), HUD, toasts, chat. */
export function Shell({ pathname, children }: { pathname: string; children: ReactNode }) {
  const mode = layoutFor(pathname);
  const dest = destinationForPath(pathname);
  useKeyboardNav(mode !== 'os');

  useEffect(() => {
    const track = useAchievements.getState().visitDestination;
    if (dest) track(dest.id);
  }, [dest]);

  // pause idle loops while the tab is hidden
  useEffect(() => {
    const onVis = () => (document.documentElement.dataset.hidden = String(document.hidden));
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const showMap = mode === 'world' || mode === 'destination';

  return (
    <div className={`app-shell layout-${mode}`} data-accent={dest?.accent ?? 'violet'}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {showMap && (
        <div className={`world-layer ${mode === 'destination' ? 'world-layer--behind' : ''}`}>
          <HubMap focus={mode === 'destination' ? dest?.id ?? null : null} interactive={mode === 'world'} />
        </div>
      )}

      {mode !== 'os' && (
        <>
          <header className="hud-top">
            <Breadcrumb />
            <Toggles />
          </header>
          <div className="hud-bottom">
            <Dock />
          </div>
        </>
      )}

      <main id="main" tabIndex={-1} className={`main-${mode}`}>
        {children}
      </main>

      <Toasts />
      <ClientOnly>
        <Suspense fallback={null}>
          <MissionTracker />
        </Suspense>
      </ClientOnly>
      {mode !== 'os' && (
        <ClientOnly>
          <Suspense fallback={null}>
            <div className="chat-dock">
              <ChatWidget />
            </div>
          </Suspense>
        </ClientOnly>
      )}
    </div>
  );
}
