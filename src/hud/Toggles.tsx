import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Trophy, Monitor, Gamepad2, List } from 'lucide-react';
import { useSettings } from '../store/useSettings';
import { useAchievements, achievementCount } from '../store/useAchievements';
import { setAmbient, playSound } from '../hooks/useSound';
import { Trophies } from './Trophies';

export function Toggles() {
  const sound = useSettings((s) => s.sound);
  const setSound = useSettings((s) => s.setSound);
  const unlocked = useAchievements((s) => Object.keys(s.unlocked).length);
  const [trophiesOpen, setTrophiesOpen] = useState(false);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Link to="/classic" className="hud-pill" title="Plain index of all content">
        <List size={16} aria-hidden />
        <span className="hidden lg:inline">Classic view</span>
        <span className="sr-only lg:hidden">Classic view</span>
      </Link>
      <Link to="/os" className="hud-pill" title="Developer OS">
        <Monitor size={16} aria-hidden />
        <span className="hidden xl:inline">OS</span>
        <span className="sr-only xl:hidden">Developer OS</span>
      </Link>
      <Link to="/arcade" className="hud-pill" title="Arcade">
        <Gamepad2 size={16} aria-hidden />
        <span className="hidden xl:inline">Arcade</span>
        <span className="sr-only xl:hidden">Arcade</span>
      </Link>
      <button
        type="button"
        className="hud-pill"
        onClick={() => setTrophiesOpen(true)}
        aria-label={`Achievements: ${unlocked} of ${achievementCount} unlocked`}
      >
        <Trophy size={16} aria-hidden className={unlocked ? 'text-gold' : ''} />
        <span className="font-mono text-xs">
          {unlocked}/{achievementCount}
        </span>
      </button>
      <button
        type="button"
        className="hud-pill"
        aria-pressed={sound}
        aria-label="Sound"
        title={sound ? 'Sound is on' : 'Sound is off'}
        onClick={() => {
          const next = !sound;
          setSound(next);
          setAmbient(next);
          if (next) setTimeout(() => playSound('chime'), 30);
        }}
      >
        {sound ? <Volume2 size={16} aria-hidden /> : <VolumeX size={16} aria-hidden />}
      </button>
      <Trophies open={trophiesOpen} onClose={() => setTrophiesOpen(false)} />
    </div>
  );
}
