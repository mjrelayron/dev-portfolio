import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { allProjects } from '../data/projects';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { CoverImage } from '../showroom/covers';
import '../showroom/showroom.css';

/** "More from the district": a slow strip of other case studies. Static row under reduced motion. */
const ProjectHighlightsMarquee = ({ currentSlug }) => {
  const reduced = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);

  const baseProjects = useMemo(() => {
    return allProjects
      .filter((project) => project.slug !== currentSlug && project.image)
      .slice(0, 4);
  }, [currentSlug]);

  const marqueeProjects = useMemo(() => {
    if (!baseProjects.length) {
      return [];
    }
    return reduced ? baseProjects : [...baseProjects, ...baseProjects];
  }, [baseProjects, reduced]);

  if (baseProjects.length < 2) {
    return null;
  }

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  return (
    <section className="sr-mq" aria-labelledby="sr-mq-h">
      <p className="mono-label text-accent-text">Featured highlights</p>
      <h2 id="sr-mq-h" className="mt-1 font-display text-lg font-bold text-ink">
        More from the district
      </h2>

      <div
        className={`sr-mq__clip ${reduced ? 'sr-mq__clip--static' : ''}`}
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
        onFocus={handlePause}
        onBlur={handleResume}
      >
        <ul className={`sr-mq__track ${isPaused ? 'is-paused' : ''}`}>
          {marqueeProjects.map((project, index) => {
            const clone = index >= baseProjects.length;
            return (
              <li key={`${project.slug}-${index}`} aria-hidden={clone || undefined}>
                <Link
                  to={`/projects/${project.slug}`}
                  className="sr-mq__card"
                  tabIndex={clone ? -1 : undefined}
                  style={{ '--mq': project.color ?? 'var(--accent)' }}
                >
                  <span className="sr-mq__img">
                    <CoverImage project={{ ...project, cover: project.image }} alt="" sizes="240px" />
                  </span>
                  <span className="sr-mq__body">
                    <span className="mono-label text-ink-3">
                      {project.category ?? 'Case study'}
                      {project.year && <> · {project.year}</>}
                    </span>
                    <span className="mt-1 block truncate font-display font-bold text-ink">{project.title}</span>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-accent-text">
                      View case study <ArrowRight size={12} aria-hidden />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ProjectHighlightsMarquee;
