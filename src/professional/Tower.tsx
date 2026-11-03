import { useEffect, useRef, useState } from 'react';
import { Building2, CheckSquare, ChevronsDown } from 'lucide-react';
import { experience, otherClients, type Role } from '../data/career';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { playSound } from '../hooks/useSound';
import './professional.css';

const TOTAL = experience.length;
/** newest role is the top floor */
const floorOf = (i: number) => TOTAL - i;
const pad = (n: number) => String(n).padStart(2, '0');

function Roof() {
  return (
    <div className="tw-roof" aria-hidden>
      <svg className="tw-roof__antenna" viewBox="0 0 40 60">
        <rect x="17" y="10" width="6" height="50" fill="#3a4280" />
        <circle className="tw-beacon" cx="20" cy="10" r="8" fill="var(--accent)" />
        <circle cx="20" cy="10" r="3.5" fill="var(--accent-light)" />
      </svg>
      {/* roof: light left face, dark right face */}
      <svg className="tw-roof__faces" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M50 0 L3 40 H50 Z" fill="#3a4280" />
        <path d="M50 0 L97 40 H50 Z" fill="#262d5c" />
      </svg>
    </div>
  );
}

function Floor({ role, i, here, lit }: { role: Role; i: number; here: boolean; lit: boolean }) {
  const n = floorOf(i);
  return (
    <article
      id={`floor-${n}`}
      data-floor={n}
      className={`tw-floor ${here ? 'tw-floor--here' : ''} ${lit ? 'tw-floor--lit' : ''}`}
      aria-labelledby={`role-${role.id}`}
    >
      {i > 0 && <div className="tw-slab" aria-hidden />}
      <div className="tw-room">
        <div className="tw-plate">
          <span className="tw-plate__num">
            <small>FLOOR</small>
            {pad(n)}
          </span>
          <span className="tw-window" aria-hidden>
            <i />
          </span>
        </div>
        <div className="min-w-0">
          <div className="tw-head">
            {role.logo ? (
              <span className="tw-logo">
                <img src={role.logo} alt={`${role.company} logo`} width={48} height={48} loading="lazy" decoding="async" />
              </span>
            ) : (
              <span className="tw-logo tw-logo--initials" aria-hidden>
                <Building2 size={22} />
              </span>
            )}
            <div className="min-w-0">
              <p className="mono-label tw-period">{role.period}</p>
              <h2 id={`role-${role.id}`} className="tw-title">
                {role.title}
              </h2>
              <p className="tw-company">{role.company}</p>
            </div>
          </div>
          <p className="tw-summary">{role.summary}</p>
          <ul className="tw-quests" aria-label="Highlights">
            {role.highlights.map((h) => (
              <li key={h}>
                <CheckSquare size={15} aria-hidden />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function Tower() {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(TOTAL);
  const [lit, setLit] = useState<Set<number>>(() => new Set([TOTAL]));
  const shaft = useRef<HTMLDivElement>(null);

  // Which floor sits in the middle band of the viewport. IntersectionObserver with the
  // viewport root also works inside the desktop panel's own scroll container.
  useEffect(() => {
    const floors = shaft.current?.querySelectorAll<HTMLElement>('[data-floor]');
    if (!floors?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const n = Number((e.target as HTMLElement).dataset.floor);
          setCurrent(n);
          setLit((s) => (s.has(n) ? s : new Set(s).add(n)));
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    floors.forEach((f) => io.observe(f));
    return () => io.disconnect();
  }, []);

  const goTo = (n: number) => {
    playSound('tick');
    const el = document.getElementById(`floor-${n}`);
    el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  // reduced motion: no light-up sequence, every window is on
  const isLit = (n: number) => reduce || lit.has(n);
  const currentRole = experience[TOTAL - current];

  return (
    <div className="tw-layout">
      <aside className="tw-elevator" aria-label="Elevator: jump to a floor">
        <div className="tw-elevator__panel">
          <div className="tw-elevator__screen" aria-live="polite">
            <small>FLOOR</small>
            {pad(current)}
          </div>
          <div className="tw-elevator__track">
            <span className="tw-elevator__car" style={{ transform: `translateY(${(TOTAL - current) * 46}px)` }} aria-hidden />
            {experience.map((r, i) => {
              const n = floorOf(i);
              return (
                <button
                  key={r.id}
                  type="button"
                  className="tw-floorbtn"
                  aria-current={n === current}
                  aria-label={`Floor ${n}: ${r.title}, ${r.company}`}
                  title={`${r.title} · ${r.period}`}
                  onClick={() => goTo(n)}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>
        {currentRole && <p className="mono-label mt-3 text-center text-ink-3">{currentRole.period.split(' ')[0]}</p>}
      </aside>

      <div className="tw-tower">
        <Roof />
        <div className="tw-shaft" ref={shaft}>
          <p className="tw-hint mono-label">
            <ChevronsDown size={14} aria-hidden /> Top floor is today · scroll down to go back in time
          </p>
          {experience.map((r, i) => (
            <Floor key={r.id} role={r} i={i} here={floorOf(i) === current} lit={isLit(floorOf(i))} />
          ))}
          {otherClients.length > 0 && (
            <>
              <div className="tw-slab" aria-hidden />
              <section className="tw-lobby" aria-labelledby="lobby-h">
                <p id="lobby-h" className="mono-label text-ink-3">
                  Lobby · also worked with
                </p>
                <div className="tw-lobby__row">
                  {otherClients.map((c) => (
                    <div key={c.name} className="tw-client">
                      <span className="tw-logo">
                        <img src={c.logo} alt={`${c.name} logo`} width={48} height={48} loading="lazy" decoding="async" />
                      </span>
                      <span>
                        <span className="block font-semibold text-ink">{c.name}</span>
                        <span className="block text-sm text-ink-2">
                          {c.role} · {c.period}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
          <div className="tw-ground mt-3" aria-hidden />
        </div>
      </div>
    </div>
  );
}
