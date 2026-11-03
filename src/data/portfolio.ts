// Typed project model over src/data/projects.js (the content source of truth).
// Nothing is invented here: fields are mapped 1:1, and links that are clearly
// placeholders (github.com/username/...) are dropped rather than shown.
import { featuredProjects, otherProjects } from './projects.js';

export interface Metric {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  overview?: string;
  problem?: string;
  solution?: string;
  impact?: string;
  role?: string;
  contribution: string[];
  tech: string[];
  features: string[];
  metrics: Metric[];
  category: string;
  featured: boolean;
  year?: number;
  status?: string;
  cover?: string;
  screenshots: string[];
  video?: string;
  liveUrl?: string; // absolute URL or internal route
  repoUrl?: string;
  color?: string;
}

type Raw = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const isVideo = (s: string) => /\.(mp4|webm|mov)(\?|$)/i.test(s);
const realUrl = (u: unknown): string | undefined => {
  if (typeof u !== 'string' || !u) return undefined;
  if (/github\.com\/username\//.test(u)) return undefined;
  return u;
};
// old internal routes now live elsewhere
const internal: Record<string, string> = { '/workflow-challenger': '/arcade/workflow-challenger' };

function toProject(p: Raw): Project {
  const gallery: string[] = (p.gallery ?? p.hero?.gallery ?? []).filter((g: unknown): g is string => typeof g === 'string');
  const live = realUrl(p.links?.live) ?? realUrl(p.links?.demo);
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    summary: p.summary,
    overview: p.overview,
    problem: p.problem,
    solution: p.solution,
    impact: p.impact,
    role: p.role,
    contribution: p.responsibilities ?? [],
    tech: p.technologies ?? [],
    features: p.features ?? [],
    metrics: p.metrics ?? [],
    category: p.category ?? 'Other',
    featured: !!p.featured,
    year: p.year,
    status: p.status,
    cover: p.image ?? p.hero?.banner,
    screenshots: [...new Set(gallery.filter((g) => !isVideo(g)))],
    video: p.video ?? gallery.find(isVideo),
    liveUrl: live ? internal[live] ?? live : undefined,
    repoUrl: realUrl(p.links?.github),
    color: p.color,
  };
}

export const projects: Project[] = [...featuredProjects, ...otherProjects].map(toProject);

// featured first, then newest
export const sortedProjects = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured) || (b.year ?? 0) - (a.year ?? 0));

export const projectBySlug: Record<string, Project> = Object.fromEntries(projects.map((p) => [p.slug, p]));

export const categories = [...new Set(projects.map((p) => p.category))];

export function neighbours(slug: string): { prev: Project; next: Project } {
  const i = sortedProjects.findIndex((p) => p.slug === slug);
  const n = sortedProjects.length;
  return { prev: sortedProjects[(i - 1 + n) % n], next: sortedProjects[(i + 1) % n] };
}
