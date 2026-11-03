import { useEffect, useRef, useState, type KeyboardEvent as RKeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, Search } from 'lucide-react';

/** Client-only clock: renders nothing during prerender, ticks on the minute. */
export function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      setNow(new Date());
      t = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 20);
    };
    t = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 20);
    return () => clearTimeout(t);
  }, []);
  if (!now) return <span className="os-clock" aria-hidden />;
  const day = now.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return (
    <time className="os-clock" dateTime={now.toISOString()}>
      <span className="hidden sm:inline">{day}</span> {time}
    </time>
  );
}

export interface MenuItem {
  label: string;
  hint?: string;
  to?: string;
  onSelect?: () => void;
}

/** "DEVELOPERVERSE OS" system menu + active app name + clock + Exit. */
export function TopBar({ appName, menu, onSearch }: { appName?: string; menu: MenuItem[]; onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        wrap.current?.querySelector<HTMLButtonElement>('button')?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => wrap.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus());
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onMenuKey = (e: RKeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = [...(wrap.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
  };

  return (
    <header className="os-topbar">
      <div ref={wrap} className="relative">
        <button type="button" className="os-menu-btn" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className="os-logo" aria-hidden />
          <span className="whitespace-nowrap font-display font-bold tracking-[0.08em]">
            <span className="hidden sm:inline">DEVELOPERVERSE </span>
            <span className="sm:hidden">DV </span>OS
          </span>
          <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
        </button>
        {open && (
          <div className="os-menu" role="menu" aria-label="System" onKeyDown={onMenuKey}>
            {menu.map((m) =>
              m.to ? (
                <Link key={m.label} to={m.to} role="menuitem" className="os-menu__item" onClick={() => setOpen(false)}>
                  <span>{m.label}</span>
                  {m.hint && <kbd className="os-kbd">{m.hint}</kbd>}
                </Link>
              ) : (
                <button
                  key={m.label}
                  type="button"
                  role="menuitem"
                  className="os-menu__item"
                  onClick={() => {
                    setOpen(false);
                    m.onSelect?.();
                  }}
                >
                  <span>{m.label}</span>
                  {m.hint && <kbd className="os-kbd">{m.hint}</kbd>}
                </button>
              ),
            )}
          </div>
        )}
      </div>
      {appName && <span className="os-topbar__app hidden md:inline">{appName}</span>}
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button type="button" className="os-top-pill" onClick={onSearch} aria-label="Search apps and projects (Ctrl+K)">
          <Search size={14} aria-hidden />
          <span className="hidden lg:inline">Search</span>
          <span className="hidden lg:inline">
            <kbd className="os-kbd">Ctrl K</kbd>
          </span>
        </button>
        <Clock />
        <Link to="/world" className="os-top-pill os-top-pill--exit" aria-label="Exit OS to the world map">
          <LogOut size={14} aria-hidden />
          <span className="hidden min-[360px]:inline">Exit OS</span>
        </Link>
      </div>
    </header>
  );
}
