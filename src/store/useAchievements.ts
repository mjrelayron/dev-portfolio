import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { achievements, type AchievementId } from '../data/achievements';

interface AchievementState {
  unlocked: Partial<Record<AchievementId, number>>;
  visitedDestinations: string[];
  openedCaseStudies: string[];
  viewedSkills: string[];
  completedMissions: string[];
  /** queue of freshly unlocked ids for the toast layer */
  queue: AchievementId[];
  unlock: (id: AchievementId) => void;
  visitDestination: (id: string) => void;
  openCaseStudy: (slug: string) => void;
  viewSkill: (skill: string) => void;
  completeMission: (id: string, total: number) => void;
  shiftQueue: () => void;
  reset: () => void;
}

const addUnique = (list: string[], v: string) => (list.includes(v) ? list : [...list, v]);

export const useAchievements = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlocked: {},
      visitedDestinations: [],
      openedCaseStudies: [],
      viewedSkills: [],
      completedMissions: [],
      queue: [],
      unlock: (id) => {
        if (get().unlocked[id]) return;
        set((s) => ({ unlocked: { ...s.unlocked, [id]: Date.now() }, queue: [...s.queue, id] }));
      },
      visitDestination: (id) => {
        const visited = addUnique(get().visitedDestinations, id);
        set({ visitedDestinations: visited });
        if (id === 'contact') get().unlock('first-contact');
        if (visited.length >= 6) get().unlock('explorer');
      },
      openCaseStudy: (slug) => {
        const opened = addUnique(get().openedCaseStudies, slug);
        set({ openedCaseStudies: opened });
        if (opened.length >= 5) get().unlock('project-hunter');
      },
      viewSkill: (skill) => {
        const viewed = addUnique(get().viewedSkills, skill);
        set({ viewedSkills: viewed });
        if (viewed.length >= 3 && get().visitedDestinations.includes('skills')) get().unlock('tech-enthusiast');
      },
      completeMission: (id, total) => {
        const done = addUnique(get().completedMissions, id);
        set({ completedMissions: done });
        if (done.length >= total) get().unlock('mission-complete');
      },
      shiftQueue: () => set((s) => ({ queue: s.queue.slice(1) })),
      reset: () => set({ unlocked: {}, visitedDestinations: [], openedCaseStudies: [], viewedSkills: [], completedMissions: [], queue: [] }),
    }),
    {
      name: 'dv-achievements',
      partialize: ({ queue: _q, ...rest }) => rest,
    },
  ),
);

export const achievementCount = achievements.length;
