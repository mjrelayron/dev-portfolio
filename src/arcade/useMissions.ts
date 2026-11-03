import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Which Project Explorer missions the visitor has started (completion lives in useAchievements). */
interface MissionState {
  started: string[];
  /** the mission shown as "current" in the explorer */
  active: string | null;
  revealed: string[];
  start: (id: string) => void;
  reveal: (id: string) => void;
  reset: () => void;
}

export const useMissions = create<MissionState>()(
  persist(
    (set, get) => ({
      started: [],
      active: null,
      revealed: [],
      start: (id) => set({ started: get().started.includes(id) ? get().started : [...get().started, id], active: id }),
      reveal: (id) => set({ revealed: get().revealed.includes(id) ? get().revealed : [...get().revealed, id] }),
      reset: () => set({ started: [], active: null, revealed: [] }),
    }),
    { name: 'dv-missions' },
  ),
);
