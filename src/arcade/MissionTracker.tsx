import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { missions } from '../data/missions';
import { useMissions } from './useMissions';
import { useAchievements } from '../store/useAchievements';
import { toast } from '../hud/Toasts';
import { playSound } from '../hooks/useSound';

/**
 * Mounted once in the Shell. Completes a started Project Explorer mission when
 * the visitor actually lands on its case study. Renders nothing.
 */
export function MissionTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    const m = /^\/projects\/([^/]+)\/?$/.exec(pathname);
    if (!m) return;
    const slug = decodeURIComponent(m[1]);
    const { started } = useMissions.getState();
    const ach = useAchievements.getState();
    for (const mission of missions) {
      if (mission.target !== slug || !started.includes(mission.id) || ach.completedMissions.includes(mission.id)) continue;
      ach.completeMission(mission.id, missions.length);
      const done = useAchievements.getState().completedMissions.filter((id) => missions.some((x) => x.id === id)).length;
      if (useMissions.getState().active === mission.id) useMissions.setState({ active: null });
      playSound('chime');
      toast({
        kind: 'success',
        title: `Mission complete: ${mission.title}`,
        body: `You found ${mission.project.title}. ${done}/${missions.length} missions done.`,
      });
    }
  }, [pathname]);
  return null;
}

export default MissionTracker;
