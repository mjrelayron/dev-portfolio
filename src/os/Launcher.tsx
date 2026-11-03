import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, LogOut, Gamepad2, CornerDownLeft } from 'lucide-react';
import { apps } from './apps';
import { sortedProjects } from '../data/portfolio';
import { fuzzyScore } from './fuzzy';
import { useOs } from './OsContext';
import { playSound } from '../hooks/useSound';

type Item = {
  key: string;
  label: string;
  sub: string;
  group: 'Apps' | 'Projects' | 'System';
  haystack: string;
  icon: ReactNode;
  run: () => void;
};

/** Ctrl+K spotlight: fuzzy over apps, project titles and a few system actions. */
export function Launcher({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const os = useOs();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const items: Item[] = useMemo(
    () => [
      ...apps.map((a, i) => {
        const Icon = a.icon;
        return {
          key: `app-${a.id}`,
          label: a.name,
          sub: `${a.hint} · Ctrl ${i + 1}`,
          group: 'Apps' as const,
          haystack: `${a.name} ${a.keywords}`,
          icon: (
            <span className="os-app-chip os-app-chip--xs" style={{ background: a.accent, borderBottomColor: a.accentDark }}>
              <Icon size={14} strokeWidth={2.4} />
            </span>
          ),
          run: () => os.openApp(a.id),
        };
      }),
      ...sortedProjects.map((p) => ({
        key: `p-${p.slug}`,
        label: p.title,
        sub: `${p.category} · ${p.tech.slice(0, 3).join(', ')}`,
        group: 'Projects' as const,
        haystack: `${p.title} ${p.slug} ${p.category} ${p.tech.join(' ')}`,
        icon: (
          <span className="os-app-chip os-app-chip--xs os-app-chip--ghost">
            <LayoutGrid size={14} />
          </span>
        ),
        run: () => navigate(`/projects/${p.slug}`),
      })),
      {
        key: 'sys-arcade',
        label: 'Arcade',
        sub: 'Mini-games: Stack Builder, Bug Hunter…',
        group: 'System' as const,
        haystack: 'arcade games play stack bug hunter',
        icon: (
          <span className="os-app-chip os-app-chip--xs os-app-chip--ghost">
            <Gamepad2 size={14} />
          </span>
        ),
        run: () => navigate('/arcade'),
      },
      {
        key: 'sys-exit',
        label: 'Exit OS',
        sub: 'Back to the world map',
        group: 'System' as const,
        haystack: 'exit quit leave map world home',
        icon: (
          <span className="os-app-chip os-app-chip--xs os-app-chip--ghost">
            <LogOut size={14} />
          </span>
        ),
        run: () => navigate('/world'),
      },
    ],
    [navigate, os],
  );

  const results = useMemo(() => {
    if (!q.trim()) return items.filter((i) => i.group !== 'Projects').concat(items.filter((i) => i.group === 'Projects').slice(0, 5));
    return items
      .map((i) => ({ i, s: Math.max(fuzzyScore(q, i.label) + 50, i.haystack.toLowerCase().includes(q.trim().toLowerCase()) ? fuzzyScore(q, i.haystack) : -Infinity) }))
      .filter((r) => r.s > -Infinity)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((r) => r.i);
  }, [q, items]);

  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    if (!open) return;
    setQ('');
    const prev = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => prev?.focus?.({ preventScroll: true });
  }, [open]);
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  if (!open || typeof document === 'undefined') return null;

  const choose = (item?: Item) => {
    if (!item) return;
    playSound('pop');
    onClose();
    item.run();
  };

  let lastGroup = '';
  return createPortal(
    <div className="os-launcher" role="presentation" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="os-launcher__panel" role="dialog" aria-modal="true" aria-label="Search apps and projects">
        <div className="os-launcher__field">
          <Search size={18} className="text-ink-3" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSel((s) => Math.min(results.length - 1, s + 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSel((s) => Math.max(0, s - 1));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                choose(results[sel]);
              } else if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }
            }}
            placeholder="Search apps and projects…"
            className="os-launcher__input"
            role="combobox"
            aria-expanded="true"
            aria-controls="os-launcher-list"
            aria-activedescendant={results[sel] ? `ol-${results[sel].key}` : undefined}
            aria-autocomplete="list"
            spellCheck={false}
          />
          <kbd className="os-kbd">Esc</kbd>
        </div>
        <ul ref={listRef} id="os-launcher-list" role="listbox" className="os-launcher__list" aria-label="Results">
          {results.length === 0 && <li className="px-4 py-6 text-center text-sm text-ink-3">Nothing matches “{q}”. Try “terminal” or a project name.</li>}
          {results.map((r, idx) => {
            const header = r.group !== lastGroup ? r.group : null;
            lastGroup = r.group;
            return (
              <li key={r.key} role="none">
                {header && <p className="os-launcher__group mono-label">{header}</p>}
                <div
                  id={`ol-${r.key}`}
                  role="option"
                  aria-selected={idx === sel}
                  className="os-launcher__item"
                  onPointerMove={() => idx !== sel && setSel(idx)}
                  onClick={() => choose(r)}
                >
                  {r.icon}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">{r.label}</span>
                    <span className="block truncate text-[0.78rem] text-ink-3">{r.sub}</span>
                  </span>
                  {idx === sel && <CornerDownLeft size={14} className="shrink-0 text-ink-3" aria-hidden />}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="os-launcher__foot">
          <span>
            <kbd className="os-kbd">↑</kbd> <kbd className="os-kbd">↓</kbd> move
          </span>
          <span>
            <kbd className="os-kbd">Enter</kbd> open
          </span>
          <span>
            <kbd className="os-kbd">Ctrl</kbd> <kbd className="os-kbd">1–7</kbd> apps
          </span>
        </p>
      </div>
    </div>,
    document.body,
  );
}
