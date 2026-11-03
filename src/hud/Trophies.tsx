import { Lock } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { achievements } from '../data/achievements';
import { useAchievements } from '../store/useAchievements';
import { iconMap } from './icons';

export function Trophies({ open, onClose }: { open: boolean; onClose: () => void }) {
  const unlocked = useAchievements((s) => s.unlocked);
  const visited = useAchievements((s) => s.visitedDestinations.length);
  const cases = useAchievements((s) => s.openedCaseStudies.length);
  const skills = useAchievements((s) => s.viewedSkills.length);
  const missions = useAchievements((s) => s.completedMissions.length);
  const progress: Record<string, string> = {
    explorer: `${Math.min(visited, 6)}/6 places`,
    'project-hunter': `${Math.min(cases, 5)}/5 cases`,
    'tech-enthusiast': `${Math.min(skills, 3)}/3 skills`,
    'mission-complete': `${missions} done`,
  };
  return (
    <Modal open={open} onClose={onClose} title="Achievements">
      <p className="mono-label text-ink-3">Trophy case</p>
      <h2 className="mt-1 text-2xl font-bold">Achievements</h2>
      <p className="mt-1 text-sm text-ink-2">Optional fun — nothing on the site is locked behind these.</p>
      <ul className="mt-5 grid gap-3">
        {achievements.map((a) => {
          const Icon = iconMap[a.icon];
          const at = unlocked[a.id];
          return (
            <li
              key={a.id}
              className={`flex items-center gap-4 rounded-2xl border p-3 ${
                at ? 'border-[rgba(255,207,107,0.5)] bg-[rgba(255,207,107,0.08)]' : 'border-line bg-[rgba(255,255,255,0.02)]'
              }`}
            >
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${at ? 'bg-gold text-navy' : 'bg-navy text-ink-3'}`}>
                {at ? <Icon size={20} aria-hidden /> : <Lock size={18} aria-hidden />}
              </span>
              <div className="min-w-0">
                <p className="font-display font-bold">{a.name}</p>
                <p className="text-sm text-ink-2">{a.how}</p>
              </div>
              <span className="mono-label ml-auto shrink-0 text-right text-ink-3">
                {at ? <span className="text-gold">Unlocked</span> : progress[a.id] ?? 'Locked'}
              </span>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
