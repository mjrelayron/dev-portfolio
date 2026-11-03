import type { ImgHTMLAttributes } from 'react';
import type { Project } from '../data/portfolio';
import manifest from './covers.manifest.json';

/** Written by `npm run covers` (scripts/build-covers.mjs). Only lists files that exist. */
type Entry = { w: number; h: number; widths: number[] };
const covers = manifest as Record<string, Entry>;

export const coverEntry = (slug: string): Entry | undefined => covers[slug];

/** Tiny or banner-shaped sources look wrong when cropped: show them whole on a mat. */
export function coverFit(slug: string): 'cover' | 'contain' {
  const e = covers[slug];
  if (!e) return 'cover';
  return e.w < 480 || e.h / e.w < 0.42 ? 'contain' : 'cover';
}

const srcset = (slug: string, widths: number[], fmt: 'avif' | 'webp') => widths.map((w) => `/covers/${slug}-${w}.${fmt} ${w}w`).join(', ');

export function CoverImage({
  project,
  sizes = '(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw',
  eager = false,
  alt,
  className = '',
  ...rest
}: {
  project: Project;
  sizes?: string;
  /** above the fold: load immediately with high priority */
  eager?: boolean;
  alt?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes' | 'alt'>) {
  const entry = covers[project.slug];
  const fit = coverFit(project.slug);
  const img = (
    <img
      src={project.cover}
      alt={alt ?? `${project.title} cover`}
      width={entry?.w ?? 1600}
      height={entry?.h ?? 1000}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...(eager ? { fetchPriority: 'high' as const } : {})}
      className={`${className} ${fit === 'contain' ? 'sr-cover--contain' : 'sr-cover--cover'}`}
      {...rest}
    />
  );
  if (!project.cover) return <CoverPlaceholder project={project} alt={alt} className={className} />;
  if (!entry?.widths.length) return img;
  return (
    <picture>
      <source type="image/avif" srcSet={srcset(project.slug, entry.widths, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(project.slug, entry.widths, 'webp')} sizes={sizes} />
      {img}
    </picture>
  );
}

/** "MedOps" → "MO", "Social Media Campaign" → "SM" */
export function initials(title: string): string {
  const words = title.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  const caps = (words[0] ?? '').match(/\p{Lu}/gu);
  return (caps && caps.length > 1 ? caps.slice(0, 2).join('') : (words[0] ?? '?').slice(0, 2)).toUpperCase();
}

/**
 * No cover (private / internal work): an isometric tile in the project's colour
 * with its initials, on the district's navy — intentional, never a broken image.
 */
export function CoverPlaceholder({ project, alt, className = '' }: { project: Project; alt?: string; className?: string }) {
  const c = project.color ?? 'var(--accent)';
  const label = alt === '' ? undefined : (alt ?? `${project.title} (no public screenshots)`);
  return (
    <span className={`sr-ph ${className}`} style={{ ['--ph' as string]: c }} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid meet" className="sr-ph__svg" aria-hidden>
        <ellipse cx="80" cy="104" rx="46" ry="9" fill="rgba(0,0,0,0.28)" />
        {/* left + right faces */}
        <path d="M34 54 L80 78 L80 102 L34 78 Z" className="sr-ph__l" />
        <path d="M126 54 L80 78 L80 102 L126 78 Z" className="sr-ph__r" />
        {/* top face */}
        <path d="M80 30 L126 54 L80 78 L34 54 Z" className="sr-ph__t" />
        <path d="M80 30 L126 54 L80 78 L34 54 Z" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <text x="0" y="0" textAnchor="middle" dominantBaseline="central" className="sr-ph__txt" transform="translate(80 54) matrix(0.72 0.375 -0.72 0.375 0 0)">
          {initials(project.title)}
        </text>
      </svg>
      {project.status && <span className="sr-ph__tag mono-label">{project.status} build</span>}
    </span>
  );
}
