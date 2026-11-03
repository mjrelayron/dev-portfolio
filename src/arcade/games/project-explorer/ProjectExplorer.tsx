import { useEffect, useState } from 'react';
import { Check, Compass, Lightbulb, MapPin, ArrowRight, Flag } from 'lucide-react';
import { missions } from '../../../data/missions';
import { useMissions } from '../../useMissions';
import { useAchievements } from '../../../store/useAchievements';
import { Button, ButtonLink } from '../../../components/ui/Button';
import { DevBot } from '../../../mascot/DevBot';
import { burst } from '../../../hooks/useConfetti';
import { playSound } from '../../../hooks/useSound';

const CELEBRATED = 'dv-missions-celebrated';

export default function ProjectExplorer() {
  // persisted stores: render after mount so the prerendered HTML is the neutral state
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const started = useMissions((s) => s.started);
  const active = useMissions((s) => s.active);
  const revealed = useMissions((s) => s.revealed);
  const { start, reveal } = useMissions.getState();
  const completedAll = useAchievements((s) => s.completedMissions);
  const completed = ready ? completedAll.filter((id) => missions.some((m) => m.id === id)) : [];
  const done = completed.length;
  const allDone = done === missions.length;

  useEffect(() => {
    if (!ready || !allDone) return;
    try {
      if (localStorage.getItem(CELEBRATED)) return;
      localStorage.setItem(CELEBRATED, '1');
    } catch {
      return;
    }
    playSound('chime');
    burst({ origin: { x: 0.5, y: 0.3 }, particleCount: 60 });
  }, [ready, allDone]);

  const isStarted = (id: string) => ready && started.includes(id);
  const current = ready ? missions.find((m) => m.id === active && !completed.includes(m.id)) : undefined;

  return (
    <div className="pe">
      <div className="panel game-card pe-head">
        <DevBot
          size="md"
          state={allDone ? 'celebrate' : current ? 'point' : 'wave'}
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold">{allDone ? 'Explorer certified' : 'How it works'}</h2>
          <p className="mt-1 text-ink-2">
            Each clue describes a real project. Start a mission, browse the Project District, and open the matching case study — the mission completes the moment you land on it.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-ink-2">
              <span className="text-ink">{done}</span>/{missions.length} complete
            </span>
            <div className="arcade-meter w-40" role="progressbar" aria-valuemin={0} aria-valuemax={missions.length} aria-valuenow={done} aria-label="Missions complete">
              <span style={{ transform: `scaleX(${done / missions.length})` }} />
            </div>
            {allDone && (
              <span className="chip" style={{ color: 'var(--gold)', borderColor: 'var(--gold)' }}>
                <Flag size={12} aria-hidden /> Mission Complete trophy
              </span>
            )}
          </div>
        </div>
      </div>

      <ol className="pe-list">
        {missions.map((m, i) => {
          const isDone = completed.includes(m.id);
          const isOn = !isDone && isStarted(m.id);
          const hint = ready && revealed.includes(m.id);
          return (
            <li key={m.id} className={`pe-card ${isDone ? 'is-done' : ''} ${isOn ? 'is-on' : ''} ${current?.id === m.id ? 'is-current' : ''}`}>
              <div className="flex items-start gap-3">
                <span className="pe-card__no" aria-hidden>
                  {isDone ? <Check size={16} /> : String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="mono-label text-[0.64rem] text-ink-3">
                    Mission {i + 1} · {isDone ? 'complete' : isOn ? 'in progress' : 'not started'}
                  </p>
                  <h3 className="mt-0.5 text-lg font-bold">{m.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-[0.95rem] text-ink-2">{m.clue}</p>
              {(hint || isDone) && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {m.hints.map((h) => (
                    <li key={h} className="chip">
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {isDone ? (
                  <ButtonLink to={`/projects/${m.target}`} size="sm" variant="ghost" icon={<ArrowRight size={14} aria-hidden />}>
                    {m.project.title}
                  </ButtonLink>
                ) : isOn ? (
                  <>
                    <ButtonLink to="/projects" size="sm" icon={<MapPin size={14} aria-hidden />}>
                      Search the District
                    </ButtonLink>
                    {!hint && (
                      <Button size="sm" variant="ghost" onClick={() => reveal(m.id)} icon={<Lightbulb size={14} aria-hidden />}>
                        Hint
                      </Button>
                    )}
                  </>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => start(m.id)} icon={<Compass size={14} aria-hidden />}>
                    Start mission
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
