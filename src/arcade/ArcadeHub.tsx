import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Trophy, Play } from 'lucide-react';
import { games, readBest } from './games';
import { CabinetArt } from './CabinetArt';
import { achievements } from '../data/achievements';
import { missions } from '../data/missions';
import { useAchievements } from '../store/useAchievements';
import { iconMap } from '../hud/icons';
import { DevBot } from '../mascot/DevBot';
import { playSound } from '../hooks/useSound';

function useBestScores() {
  const [best, setBest] = useState<Record<string, number>>({});
  useEffect(() => {
    setBest(Object.fromEntries(games.filter((g) => g.bestKey).map((g) => [g.slug, readBest(g.bestKey!)])));
  }, []);
  return best;
}

export function ArcadeHub() {
  const best = useBestScores();
  const unlocked = useAchievements((s) => s.unlocked);
  const missionsDone = useAchievements((s) => s.completedMissions.filter((id) => missions.some((m) => m.id === id)).length);
  const visited = useAchievements((s) => s.visitedDestinations.length);
  const cases = useAchievements((s) => s.openedCaseStudies.length);
  const skills = useAchievements((s) => s.viewedSkills.length);
  const count = achievements.filter((a) => unlocked[a.id]).length;
  const progress: Record<string, string> = {
    explorer: `${Math.min(visited, 6)}/6`,
    'project-hunter': `${Math.min(cases, 5)}/5`,
    'tech-enthusiast': `${Math.min(skills, 3)}/3`,
    'mission-complete': `${missionsDone}/${missions.length}`,
  };

  return (
    <div className="arcade-page">
      <header className="arcade-hero">
        <div className="min-w-0 flex-1">
          <p className="mono-label text-[var(--orange)]">Arcade · 4 cabinets</p>
          <h1 className="mt-2 text-[clamp(2rem,4.6vw,3.4rem)] font-bold">The Arcade</h1>
          <p className="mt-3 max-w-xl text-[1.05rem] text-ink-2">
            Small games built into the portfolio. Pick a cabinet — no sign-up, no coins, and nothing on the site is locked behind a score.
          </p>
        </div>
        <div className="hidden shrink-0 self-end sm:block">
          <DevBot size="md" state="point" bubble="Four cabinets, zero coins needed. Pick one!" />
        </div>
      </header>

      <ul className="arcade-hall" aria-label="Arcade cabinets">
        {games.map((g) => (
          <li key={g.slug}>
            <Link to={`/arcade/${g.slug}`} className="cab" data-accent={g.accent} onClick={() => playSound('pop')} onMouseEnter={() => playSound('tick')}>
              <div className="cab__marquee">
                <span className="mono-label cab__tag">{g.tagline}</span>
                <h2 className="cab__name">{g.name}</h2>
              </div>
              <div className="cab__screen">
                <CabinetArt slug={g.slug} />
              </div>
              <div className="cab__deck">
                <p className="text-[0.9rem] leading-relaxed text-ink-2">{g.blurb}</p>
                <div className="mb-5 mt-4 flex flex-wrap items-center gap-2">
                  <span className="chip">{g.controls}</span>
                  {g.bestKey && best[g.slug] ? <span className="chip cab__best">{g.bestLabel!(best[g.slug])}</span> : null}
                  {g.slug === 'project-explorer' && <span className="chip cab__best">{missionsDone}/{missions.length} missions</span>}
                </div>
                <span className="cab__play btn-3d btn-3d--sm" aria-hidden>
                  <Play size={14} fill="currentColor" /> Play
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <section className="panel arcade-trophies" aria-labelledby="trophy-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mono-label text-ink-3">Trophy case</p>
            <h2 id="trophy-title" className="mt-1 flex items-center gap-2 text-2xl font-bold">
              <Trophy size={22} className="text-gold" aria-hidden /> Achievements
            </h2>
            <p className="mt-1 text-sm text-ink-2">Optional fun — trophies never gate any content.</p>
          </div>
          <div className="min-w-[180px] text-right">
            <p className="font-mono text-sm text-ink-2">
              <span className="text-gold">{count}</span> / {achievements.length} unlocked
            </p>
            <div className="arcade-meter mt-2" role="progressbar" aria-valuemin={0} aria-valuemax={achievements.length} aria-valuenow={count} aria-label="Achievements unlocked">
              <span style={{ transform: `scaleX(${count / achievements.length})` }} />
            </div>
          </div>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {achievements.map((a) => {
            const Icon = iconMap[a.icon];
            const on = !!unlocked[a.id];
            return (
              <li key={a.id} className={`trophy ${on ? 'is-on' : ''}`}>
                <span className="trophy__icon">{on ? <Icon size={20} aria-hidden /> : <Lock size={17} aria-hidden />}</span>
                <div className="min-w-0">
                  <p className="font-display font-bold leading-tight">{a.name}</p>
                  <p className="mt-0.5 text-[0.8rem] leading-snug text-ink-2">{a.how}</p>
                  <p className="mono-label mt-2 text-[0.62rem] text-ink-3">{on ? <span className="text-gold">Unlocked</span> : progress[a.id] ?? 'Locked'}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
