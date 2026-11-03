import { projects } from '../data/portfolio';
import { arcadeGames, labTools } from './routes';

/** Routes that get a static HTML snapshot at build time (SEO). Server-only. */
export function prerenderPaths(): string[] {
  return [
    '/',
    '/world',
    '/projects',
    ...projects.map((p) => `/projects/${p.slug}`),
    '/skills',
    '/experience',
    '/lab',
    ...labTools.map((t) => `/lab/${t}`),
    '/about',
    '/contact',
    '/resume',
    '/os',
    '/arcade',
    ...arcadeGames.map((g) => `/arcade/${g}`),
    '/classic',
  ];
}
