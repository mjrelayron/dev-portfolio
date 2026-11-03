import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  sound: boolean;
  introSeen: boolean;
  setSound: (on: boolean) => void;
  toggleSound: () => void;
  markIntroSeen: () => void;
  replayIntro: () => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      sound: false,
      introSeen: false,
      setSound: (sound) => set({ sound }),
      toggleSound: () => set((s) => ({ sound: !s.sound })),
      markIntroSeen: () => set({ introSeen: true }),
      replayIntro: () => set({ introSeen: false }),
    }),
    { name: 'dv-settings' },
  ),
);
