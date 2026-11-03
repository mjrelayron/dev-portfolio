import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Developer OS window manager.
 *
 * Persisted: each app's last position/size (`geom`), so a window reopens where
 * the visitor left it. NOT persisted: which windows are open, minimised or
 * maximised and the z-stack — returning to /os always starts on a clean desktop
 * (reopening a stack of heavy page windows on every visit would be surprising).
 */
export type AppId = 'about' | 'projects' | 'skills' | 'experience' | 'resume' | 'contact' | 'terminal';

export interface Geom {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WinState {
  id: AppId;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

interface WindowsState {
  geom: Partial<Record<AppId, Geom>>;
  windows: WinState[]; // open windows, in open order
  focused: AppId | null;
  topZ: number;
  /** cascade counter for windows that have no saved geometry yet */
  cascade: number;
  open: (id: AppId) => void;
  close: (id: AppId) => void;
  focus: (id: AppId) => void;
  minimize: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  /** dock click: open, restore, focus, or minimise when already focused */
  dockActivate: (id: AppId) => void;
  setGeom: (id: AppId, g: Geom) => void;
  closeAll: () => void;
}

/** Topmost visible window (for focus fallback after close/minimise). */
function topVisible(windows: WinState[], except?: AppId): AppId | null {
  const vis = windows.filter((w) => !w.minimized && w.id !== except).sort((a, b) => b.z - a.z);
  return vis[0]?.id ?? null;
}

export const useWindows = create<WindowsState>()(
  persist(
    (set, get) => ({
      geom: {},
      windows: [],
      focused: null,
      topZ: 10,
      cascade: 0,
      open: (id) => {
        const s = get();
        const z = s.topZ + 1;
        const existing = s.windows.find((w) => w.id === id);
        if (existing) {
          set({ windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: false, z } : w)), focused: id, topZ: z });
          return;
        }
        set({ windows: [...s.windows, { id, z, minimized: false, maximized: false }], focused: id, topZ: z, cascade: s.cascade + 1 });
      },
      close: (id) => {
        const windows = get().windows.filter((w) => w.id !== id);
        set({ windows, focused: get().focused === id ? topVisible(windows) : get().focused });
      },
      focus: (id) => {
        const s = get();
        const w = s.windows.find((x) => x.id === id);
        if (!w) return;
        if (s.focused === id && w.z === s.topZ) return;
        const z = s.topZ + 1;
        set({ windows: s.windows.map((x) => (x.id === id ? { ...x, z, minimized: false } : x)), focused: id, topZ: z });
      },
      minimize: (id) => {
        const windows = get().windows.map((w) => (w.id === id ? { ...w, minimized: true } : w));
        set({ windows, focused: topVisible(windows, id) });
      },
      toggleMaximize: (id) => {
        const s = get();
        const z = s.topZ + 1;
        set({ windows: s.windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized, z } : w)), focused: id, topZ: z });
      },
      dockActivate: (id) => {
        const s = get();
        const w = s.windows.find((x) => x.id === id);
        if (!w || w.minimized) return s.open(id);
        if (s.focused === id) return s.minimize(id);
        s.focus(id);
      },
      setGeom: (id, g) => set((s) => ({ geom: { ...s.geom, [id]: g } })),
      closeAll: () => set({ windows: [], focused: null }),
    }),
    {
      name: 'dv-os-windows',
      version: 1,
      partialize: (s) => ({ geom: s.geom }),
    },
  ),
);
