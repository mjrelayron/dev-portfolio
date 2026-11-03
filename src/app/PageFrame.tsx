import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { Accent } from '../data/destinations';
import { DevBot } from '../mascot/DevBot';
import type { DevBotState } from '../mascot/types';

/**
 * The one container for destination pages. Desktop: a panel floating over the
 * zoomed map. Mobile: a full page. Same component, CSS decides the container.
 */
export function PageFrame({
  accent,
  eyebrow,
  title,
  intro,
  actions,
  bot,
  wide,
  children,
}: {
  accent: Accent;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  actions?: ReactNode;
  bot?: { state?: DevBotState; bubble?: string };
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`dest-frame ${wide ? 'dest-frame--wide' : ''}`} data-accent={accent}>
      <div id="dest-scroll" className="dest-frame__scroll">
        <header className="dest-header">
          <div className="min-w-0 flex-1">
            <Link to="/world" className="dest-back mono-label">
              <ArrowLeft size={14} aria-hidden /> Map <kbd className="dest-back__kbd">Esc</kbd>
            </Link>
            <p className="mono-label mt-4 text-accent-text">{eyebrow}</p>
            <h1 className="mt-2 text-[clamp(2rem,4.2vw,3.25rem)] font-bold">{title}</h1>
            {intro && <div className="mt-3 max-w-2xl text-[1.05rem] text-ink-2">{intro}</div>}
            {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
          </div>
          {bot && (
            <div className="hidden shrink-0 self-end sm:block">
              <DevBot size="md" state={bot.state ?? 'idle'} bubble={bot.bubble} bubbleAlign="end" />
            </div>
          )}
        </header>
        <div className="dest-body">{children}</div>
      </div>
    </div>
  );
}
