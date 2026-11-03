import { lazy } from 'react';
import { featuredProjects, otherProjects } from '../data/projects.js';

// Every page is its own chunk. The prerenderer waits for these to resolve.
export const pages = {
  Home: lazy(() => import('../pages/HomePage')),
  World: lazy(() => import('../pages/WorldPage')),
  Projects: lazy(() => import('../pages/ProjectsPage')),
  CaseStudy: lazy(() => import('../pages/CaseStudyPage')),
  Skills: lazy(() => import('../pages/SkillsPage')),
  Experience: lazy(() => import('../pages/ExperiencePage')),
  Lab: lazy(() => import('../pages/LabPage')),
  LabTool: lazy(() => import('../pages/LabToolPage')),
  About: lazy(() => import('../pages/AboutPage')),
  Contact: lazy(() => import('../pages/ContactPage')),
  Resume: lazy(() => import('../pages/ResumePage')),
  OS: lazy(() => import('../pages/OSPage')),
  Arcade: lazy(() => import('../pages/ArcadePage')),
  ArcadeGame: lazy(() => import('../pages/ArcadeGamePage')),
  Classic: lazy(() => import('../pages/ClassicPage')),
  NotFound: lazy(() => import('../pages/NotFoundPage')),
};

export const legacyRedirects: Record<string, string> = {
  '/workflow-challenger': '/arcade/workflow-challenger',
  '/scraping-dashboard': '/lab/scraping-dashboard',
  '/chat': '/lab/chat',
  '/practice': '/lab/practice',
};

export const labTools = ['simulators', 'scraping-dashboard', 'chat', 'practice'] as const;
export const arcadeGames = ['stack-builder', 'bug-hunter', 'project-explorer', 'workflow-challenger'] as const;

/** Routes that get a static HTML snapshot at build time (SEO). */
export function prerenderPaths(): string[] {
  const slugs = [...featuredProjects, ...otherProjects].map((p: { slug: string }) => p.slug);
  return [
    '/',
    '/world',
    '/projects',
    ...slugs.map((s) => `/projects/${s}`),
    '/skills',
    '/experience',
    '/lab',
    '/about',
    '/contact',
    '/resume',
    '/os',
    '/arcade',
    '/classic',
  ];
}

export type LayoutMode = 'world' | 'destination' | 'plain' | 'os';

export function layoutFor(pathname: string): LayoutMode {
  if (pathname === '/' || pathname === '/world') return 'world';
  if (pathname.startsWith('/os')) return 'os';
  const top = '/' + (pathname.split('/')[1] ?? '');
  if (['/projects', '/skills', '/experience', '/lab', '/about', '/contact', '/resume'].includes(top)) return 'destination';
  return 'plain';
}
