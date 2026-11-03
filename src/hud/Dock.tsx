import { NavLink } from 'react-router-dom';
import { destinations, accentVar } from '../data/destinations';
import { iconMap } from './icons';
import { playSound } from '../hooks/useSound';

/** Bottom destination dock — always visible, the map-free way to every section. */
export function Dock() {
  return (
    <nav aria-label="Destinations" className="hud-dock pointer-events-auto">
      <ul className="flex items-end gap-1.5 sm:gap-2">
        {destinations.map((d) => {
          const Icon = iconMap[d.icon];
          return (
            <li key={d.id}>
              <NavLink
                to={d.path}
                onMouseEnter={() => playSound('tick')}
                onClick={() => playSound('pop')}
                className={({ isActive }) => `dock-btn ${isActive ? 'is-active' : ''}`}
                style={{ ['--chip' as string]: accentVar[d.accent] }}
                aria-label={`${d.name} (key ${d.key})`}
              >
                <span className="dock-btn__chip">
                  <Icon size={20} strokeWidth={2.2} aria-hidden />
                </span>
                <span className="dock-btn__label">{d.short}</span>
                <kbd className="dock-btn__key" aria-hidden>
                  {d.key}
                </kbd>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
