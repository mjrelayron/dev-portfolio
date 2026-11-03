import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { GameMeta } from './games';

/** Shared cabinet chrome for every game route. */
export function GameFrame({ game, aside, children }: { game: GameMeta; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="arcade-page arcade-game" data-accent={game.accent}>
      <header className="game-head">
        <div className="min-w-0">
          <Link to="/arcade" className="dest-back mono-label">
            <ArrowLeft size={14} aria-hidden /> Arcade
          </Link>
          <p className="mono-label mt-4 text-accent-text">{game.tagline}</p>
          <h1 className="mt-1 text-[clamp(1.8rem,4vw,2.8rem)] font-bold">{game.name}</h1>
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </header>
      {children}
    </div>
  );
}
