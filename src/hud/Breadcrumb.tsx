import { Link, useLocation } from 'react-router-dom';
import { destinationForPath } from '../data/destinations';

const extra: Record<string, string> = {
  '/about': 'About',
  '/resume': 'Resume',
  '/os': 'Developer OS',
  '/arcade': 'Arcade',
  '/classic': 'Classic view',
};

export function Breadcrumb() {
  const { pathname } = useLocation();
  const dest = destinationForPath(pathname);
  const parts: string[] = [];
  if (dest) parts.push(dest.id === 'hub' ? extra[pathname] ?? dest.name : dest.name);
  else {
    const top = '/' + (pathname.split('/')[1] ?? '');
    if (extra[top]) parts.push(extra[top]);
  }
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Link to="/world" className="hud-logo" aria-label="DEVELOPERVERSE home map (H)">
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden>
          <path d="M16 3 L28 10 L16 17 L4 10 Z" fill="#9A94FF" />
          <path d="M4 10 L16 17 V29 L4 22 Z" fill="#6C63FF" />
          <path d="M28 10 L16 17 V29 L28 22 Z" fill="#4A42C7" />
          <circle cx="16" cy="10" r="2.4" fill="#FFAD5A" />
        </svg>
        <span className="hidden font-display text-[0.95rem] font-bold tracking-[0.06em] sm:inline">DEVELOPERVERSE</span>
      </Link>
      <nav aria-label="Breadcrumb" className="mono-label hidden min-w-0 truncate text-ink-2 md:block">
        <Link to="/world" className="hover:text-white">
          HUB
        </Link>
        {parts.map((p) => (
          <span key={p}>
            <span className="mx-2 text-ink-3" aria-hidden>
              ›
            </span>
            <span aria-current="page" className="text-white">
              {p}
            </span>
          </span>
        ))}
      </nav>
    </div>
  );
}
