import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { User, LayoutGrid, Cpu, Building2, FileText, Send, SquareTerminal, type LucideIcon } from 'lucide-react';
import type { AppId, Geom } from '../store/useWindows';

export interface OsApp {
  id: AppId;
  name: string;
  /** shown in the launcher */
  hint: string;
  keywords: string;
  icon: LucideIcon;
  accent: string;
  accentDark: string;
  /** route the same content lives at outside the OS */
  path?: string;
  Component: LazyExoticComponent<ComponentType>;
  size: { w: number; h: number };
}

// The page components are reused as-is inside windows (os.css neutralises the
// PageFrame paddings meant for the HUD).
export const apps: OsApp[] = [
  {
    id: 'about',
    name: 'About Me',
    hint: 'Story, stats and the person behind the verse',
    keywords: 'about bio profile story me',
    icon: User,
    accent: '#FFFFFF',
    accentDark: '#C9CCEC',
    path: '/about',
    Component: lazy(() => import('../pages/AboutPage')),
    size: { w: 860, h: 620 },
  },
  {
    id: 'projects',
    name: 'My Projects',
    hint: 'Case studies of shipped work',
    keywords: 'projects work portfolio case studies',
    icon: LayoutGrid,
    accent: '#6C63FF',
    accentDark: '#4A42C7',
    path: '/projects',
    Component: lazy(() => import('../pages/ProjectsPage')),
    size: { w: 980, h: 660 },
  },
  {
    id: 'skills',
    name: 'Tech Stack',
    hint: 'Skills, backed by the projects that use them',
    keywords: 'skills tech stack tools languages',
    icon: Cpu,
    accent: '#42BDF5',
    accentDark: '#2289B8',
    path: '/skills',
    Component: lazy(() => import('../pages/SkillsPage')),
    size: { w: 920, h: 640 },
  },
  {
    id: 'experience',
    name: 'Experience',
    hint: 'Career timeline, newest first',
    keywords: 'experience career jobs work history timeline',
    icon: Building2,
    accent: '#FFAD5A',
    accentDark: '#D9823A',
    path: '/experience',
    Component: lazy(() => import('../pages/ExperiencePage')),
    size: { w: 880, h: 640 },
  },
  {
    id: 'resume',
    name: 'Resume',
    hint: 'One-page CV and PDF download',
    keywords: 'resume cv pdf download',
    icon: FileText,
    accent: '#79D8A0',
    accentDark: '#4AA874',
    path: '/resume',
    Component: lazy(() => import('../pages/ResumePage')),
    size: { w: 820, h: 660 },
  },
  {
    id: 'contact',
    name: 'Contact',
    hint: 'Start a project or say hello',
    keywords: 'contact email hire message hello',
    icon: Send,
    accent: '#FFCF6B',
    accentDark: '#D9A23A',
    path: '/contact',
    Component: lazy(() => import('../pages/ContactPage')),
    size: { w: 780, h: 640 },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    hint: 'Explore the portfolio from the command line',
    keywords: 'terminal shell console cli command',
    icon: SquareTerminal,
    accent: '#79D8A0',
    accentDark: '#4AA874',
    Component: lazy(() => import('./Terminal')),
    size: { w: 680, h: 440 },
  },
];

export const appById = Object.fromEntries(apps.map((a) => [a.id, a])) as Record<AppId, OsApp>;

export const TOPBAR_H = 40;
export const DOCK_H = 84;

/** Default geometry: centred-ish with a cascade offset, fitted to the work area. */
export function defaultGeom(app: OsApp, cascade: number, vw: number, vh: number): Geom {
  const areaH = vh - TOPBAR_H - DOCK_H;
  const w = Math.min(app.size.w, vw - (vw < 1100 ? 132 : 48));
  const h = Math.min(app.size.h, areaH - 24);
  const off = (cascade % 6) * 28;
  // keep clear of the desktop icon column when there is room
  const gutter = Math.max(12, Math.min(116, vw - w - 8));
  const x = Math.max(gutter, Math.round((vw - w) / 2 - 60 + off));
  const y = Math.max(TOPBAR_H + 12, Math.round(TOPBAR_H + (areaH - h) / 2 - 40 + off));
  return clampGeom({ x, y, w, h }, vw, vh);
}

export const MIN_W = 320;
export const MIN_H = 220;

/** Keep a window fully inside the work area (between top bar and dock). */
export function clampGeom(g: Geom, vw: number, vh: number): Geom {
  const maxW = Math.max(MIN_W, vw - 16);
  const maxH = Math.max(MIN_H, vh - TOPBAR_H - DOCK_H - 8);
  const w = Math.min(Math.max(g.w, MIN_W), maxW);
  const h = Math.min(Math.max(g.h, MIN_H), maxH);
  const x = Math.min(Math.max(g.x, 8), Math.max(8, vw - w - 8));
  const y = Math.min(Math.max(g.y, TOPBAR_H + 4), Math.max(TOPBAR_H + 4, vh - DOCK_H - h - 4));
  return { x, y, w, h };
}
