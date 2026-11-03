import { useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useWindows } from '../store/useWindows';
import { apps, appById } from './apps';
import { Window } from './Window';
import { TopBar, type MenuItem } from './TopBar';
import type { OsApi } from './OsContext';
import { DevBot } from '../mascot/DevBot';
import { playSound } from '../hooks/useSound';

export function AppChip({ id, size = 'md' }: { id: keyof typeof appById; size?: 'md' | 'lg' }) {
  const a = appById[id];
  const Icon = a.icon;
  return (
    <span className={`os-app-chip ${size === 'lg' ? 'os-app-chip--lg' : ''}`} style={{ background: a.accent, borderBottomColor: a.accentDark }} aria-hidden>
      <Icon size={size === 'lg' ? 26 : 22} strokeWidth={2.2} />
    </span>
  );
}

export const desktopApi: OsApi = {
  openApp: (id) => {
    playSound('pop');
    useWindows.getState().open(id);
  },
  closeApp: (id) => useWindows.getState().close(id),
};

export function Desktop({ onSearch, menu }: { onSearch: () => void; menu: MenuItem[] }) {
  const windows = useWindows((s) => s.windows);
  const focused = useWindows((s) => s.focused);
  const dockActivate = useWindows((s) => s.dockActivate);
  const openIds = useMemo(() => new Set(windows.map((w) => w.id)), [windows]);
  const anyVisible = windows.some((w) => !w.minimized);

  // a fresh desktop greets you with the terminal
  useEffect(() => {
    if (useWindows.getState().windows.length === 0) useWindows.getState().open('terminal');
  }, []);

  const focusedApp = focused ? appById[focused] : null;

  return (
    <>
      <TopBar appName={focusedApp?.name} menu={menu} onSearch={onSearch} />

      {/* desktop icons */}
      <nav aria-label="Desktop apps" className="os-icons">
        {apps.map((a, i) => (
          <button key={a.id} type="button" className="os-icon" onClick={() => desktopApi.openApp(a.id)} title={`${a.name} (Ctrl+${i + 1})`}>
            <AppChip id={a.id} size="lg" />
            <span className="os-icon__label">{a.name}</span>
          </button>
        ))}
      </nav>

      {!anyVisible && (
        <div className="os-hint">
          <DevBot size="md" state="wave" bubble="Pick an app, or press Ctrl + K to search everything." />
        </div>
      )}

      <div className="os-windows">
        <AnimatePresence>
          {windows.map((w) => (
            <Window key={w.id} win={w} focused={focused === w.id} />
          ))}
        </AnimatePresence>
      </div>

      <nav aria-label="Dock" className="os-dock-wrap">
        <ul className="os-dock">
          {apps.map((a, i) => {
            const open = openIds.has(a.id);
            const win = windows.find((w) => w.id === a.id);
            return (
              <li key={a.id}>
                <button
                  type="button"
                  className={`os-dock__btn ${open ? 'is-open' : ''} ${focused === a.id ? 'is-focused' : ''}`}
                  onClick={() => {
                    playSound('pop');
                    dockActivate(a.id);
                  }}
                  aria-label={`${a.name}${open ? (win?.minimized ? ' (minimised)' : ' (open)') : ''} — Ctrl+${i + 1}`}
                  title={a.name}
                >
                  <AppChip id={a.id} />
                  <span className="os-dock__dot" aria-hidden />
                </button>
              </li>
            );
          })}
          <li className="os-dock__sep" aria-hidden />
          <li>
            <button type="button" className="os-dock__btn" onClick={onSearch} aria-label="Search apps and projects (Ctrl+K)" title="Search (Ctrl+K)">
              <span className="os-app-chip os-app-chip--ghost" aria-hidden>
                <Search size={20} />
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
