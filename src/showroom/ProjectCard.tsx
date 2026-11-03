import { Link } from 'react-router-dom';
import { ArrowUpRight, Eye, Star } from 'lucide-react';
import { TiltCard } from '../components/ui/Card';
import type { Project } from '../data/portfolio';
import { CoverImage } from './covers';
import './showroom.css';

export function ProjectCard({ project, eager = false, onQuickLook }: { project: Project; eager?: boolean; onQuickLook?: (p: Project) => void }) {
  const extra = project.tech.length - 3;
  return (
    <TiltCard rarity={project.featured ? 'featured' : 'standard'} className="sr-card h-full">
      <Link to={`/projects/${project.slug}`} className="sr-card__link">
        <div className="sr-card__media">
          <CoverImage project={project} eager={eager} alt="" className="sr-card__img" />
          {project.featured && (
            <span className="sr-card__badge mono-label">
              <Star size={11} aria-hidden fill="currentColor" /> Featured
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
          <p className="mono-label flex items-center gap-2 text-ink-3">
            <span>{project.category}</span>
            {project.year && (
              <>
                <span aria-hidden>·</span>
                <span>{project.year}</span>
              </>
            )}
            {project.status && project.status !== 'Live' && project.status !== 'Completed' && (
              <span className="sr-status ml-auto">{project.status}</span>
            )}
          </p>
          <h3 className="flex items-start gap-2 font-display text-[1.2rem] font-bold leading-tight text-ink">
            <span className="min-w-0 flex-1">{project.title}</span>
            <ArrowUpRight size={18} aria-hidden className="sr-card__arrow mt-0.5 shrink-0 text-accent-text" />
          </h3>
          {project.subtitle && <p className="-mt-1 text-sm font-medium text-accent-text">{project.subtitle}</p>}
          <p className="line-clamp-3 text-[0.92rem] leading-relaxed text-ink-2">{project.summary}</p>
          {project.tech.length > 0 && (
            <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Tech">
              {project.tech.slice(0, 3).map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
              {extra > 0 && <li className="chip text-ink-3">+{extra}</li>}
            </ul>
          )}
        </div>
      </Link>
      {onQuickLook && (
        <button type="button" className="sr-card__quick" onClick={() => onQuickLook(project)} aria-label={`Quick look: ${project.title}`}>
          <Eye size={14} aria-hidden /> Quick look
        </button>
      )}
    </TiltCard>
  );
}
