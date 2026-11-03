import { useCallback, useEffect, useMemo, useState } from 'react';
import { Seo } from '../app/Seo';
import { HubMap } from '../world/HubMap';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useWindows, type AppId } from '../store/useWindows';
import { apps } from '../os/apps';
import { Desktop, desktopApi } from '../os/Desktop';
import { MobileOS } from '../os/MobileOS';
import { Launcher } from '../os/Launcher';
import { OsContext, type OsApi } from '../os/OsContext';
import type { MenuItem } from '../os/TopBar';
import { playSound } from '../hooks/useSound';
import '../os/os.css';

const TITLE = 'Developer OS';
const DESCRIPTION = 'The portfolio as a tiny desktop: draggable app windows, a Ctrl+K launcher and a terminal that answers from the real project data.';

/**
 * Pages reused inside windows render their own <Seo>, which would retitle the
 * tab. Snapshot the OS head tags once and put them back whenever they change.
 */
function useHeadLock() {
  useEffect(() => {
    const keys = ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:url"]', 'link[rel="canonical"]'];
    const title = document.title;
    const snap = keys.map((k) => {
      const el = document.head.querySelector(k);
      return [k, el?.getAttribute(k.startsWith('link') ? 'href' : 'content') ?? null] as const;
    });
    let restoring = false;
    const restore = () => {
      if (restoring) return;
      restoring = true;
      if (document.title !== title) document.title = title;
      for (const [k, v] of snap) {
        const el = document.head.querySelector(k);
        const attr = k.startsWith('link') ? 'href' : 'content';
        if (el && v !== null && el.getAttribute(attr) !== v) el.setAttribute(attr, v);
      }
      restoring = false;
    };
    const mo = new MutationObserver(restore);
    mo.observe(document.head, { subtree: true, childList: true, attributes: true, characterData: true });
    return () => mo.disconnect();
  }, []);
}

export default function OSPage() {
  const mobile = useMediaQuery('(max-width: 767px)', false);
  const [launcher, setLauncher] = useState(false);
  const [mobileApp, setMobileApp] = useState<AppId | null>(null);
  useHeadLock();

  const api: OsApi = useMemo(
    () =>
      mobile
        ? {
            openApp: (id) => {
              playSound('pop');
              setMobileApp(id);
            },
            closeApp: () => setMobileApp(null),
          }
        : desktopApi,
    [mobile],
  );

  const openSearch = useCallback(() => setLauncher(true), []);

  // OS-wide shortcuts. Ctrl+W / Ctrl+1–7 are reserved by some browsers, so the
  // same actions also answer to Alt+W / Alt+1–7.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && !e.altKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setLauncher((o) => !o);
        return;
      }
      if (document.querySelector('.os-launcher')) return;
      if ((mod || e.altKey) && (e.key === 'w' || e.key === 'W' || e.code === 'KeyW')) {
        e.preventDefault();
        if (mobile) setMobileApp(null);
        else {
          const f = useWindows.getState().focused;
          if (f) useWindows.getState().close(f);
        }
        return;
      }
      const digit = /^Digit([1-7])$/.exec(e.code)?.[1];
      if ((mod || e.altKey) && digit) {
        e.preventDefault();
        api.openApp(apps[Number(digit) - 1].id);
        return;
      }
      if (e.key === 'Escape' && mobile && mobileApp) setMobileApp(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [api, mobile, mobileApp]);

  const menu: MenuItem[] = useMemo(
    () => [
      { label: 'Search apps & projects', hint: 'Ctrl K', onSelect: openSearch },
      ...(mobile ? [] : [{ label: 'Close all windows', onSelect: () => useWindows.getState().closeAll() }]),
      { label: 'Open the Arcade', to: '/arcade' },
      { label: 'Classic view', to: '/classic' },
      { label: 'Exit OS', hint: 'to map', to: '/world' },
    ],
    [mobile, openSearch],
  );

  return (
    <OsContext.Provider value={api}>
      <div className="os-root">
        <Seo title={TITLE} description={DESCRIPTION} path="/os" />
        <div className="os-wallpaper" aria-hidden inert>
          <div className="os-wallpaper__map">
            <HubMap focus={null} interactive={false} />
          </div>
          <div className="os-wallpaper__shade" />
        </div>
        <h1 className="sr-only">Developer OS</h1>
        {mobile ? (
          <MobileOS active={mobileApp} setActive={(id) => (id ? api.openApp(id) : setMobileApp(null))} onSearch={openSearch} menu={menu} />
        ) : (
          <Desktop onSearch={openSearch} menu={menu} />
        )}
        <Launcher open={launcher} onClose={() => setLauncher(false)} />
      </div>
    </OsContext.Provider>
  );
}
