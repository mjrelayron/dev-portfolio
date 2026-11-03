import { lazy, Suspense, useCallback, useDeferredValue, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { categories, sortedProjects, type Project } from '../data/portfolio';
import { DevBot } from '../mascot/DevBot';
import { Button } from '../components/ui/Button';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { CategoryChips, SearchBox } from './Filters';
import { ProjectCard } from './ProjectCard';
import ImpactTicker from '../components/ImpactTicker.jsx';
import './showroom.css';

const ProjectModal = lazy(() => import('../components/ProjectModal.jsx'));

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/\p{M}+/gu, '');
const haystack = (p: Project) => norm([p.title, p.subtitle ?? '', p.summary, ...p.tech].join(' '));
const index = new Map(sortedProjects.map((p) => [p.slug, haystack(p)]));

const counts = Object.fromEntries(categories.map((c) => [c, sortedProjects.filter((p) => p.category === c).length]));
// most populated categories first
const orderedCategories = [...categories].sort((a, b) => counts[b] - counts[a]);

export function Gallery() {
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const reduced = useReducedMotion();
  const [quick, setQuick] = useState<Project | null>(null);
  const closeQuick = useCallback(() => setQuick(null), []);

  const results = useMemo(() => {
    const terms = norm(deferred).split(/\s+/).filter(Boolean);
    return sortedProjects.filter(
      (p) => (!category || p.category === category) && terms.every((t) => index.get(p.slug)!.includes(t)),
    );
  }, [category, deferred]);

  const reset = () => {
    setCategory(null);
    setQuery('');
  };

  return (
    <div>
      <h2 className="sr-only">Project gallery</h2>
      <ImpactTicker />
      <div className="sr-toolbar mt-6">
        <CategoryChips categories={orderedCategories} counts={counts} value={category} onChange={setCategory} />
        <SearchBox value={query} onChange={setQuery} />
      </div>
      <p className="mono-label mb-4 mt-5 text-ink-3" aria-live="polite">
        {results.length === sortedProjects.length
          ? `${results.length} projects · live sites first`
          : `${results.length} of ${sortedProjects.length} projects`}
      </p>

      {results.length === 0 ? (
        <div className="panel flex flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:text-left">
          <DevBot size="md" state="think" />
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-ink">Nothing on the shelves for that</h3>
            <p className="mt-1 text-ink-2">
              No project matches {deferred ? <>“{deferred}”</> : 'this filter'}
              {category ? <> in {category}</> : null}. Try a tech name like “React” or “Python”.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={reset}>
            Clear filters
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {results.map((p, i) => (
              <motion.li
                key={p.slug}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-0"
              >
                <ProjectCard project={p} eager={i < 2} onQuickLook={setQuick} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
      {quick && (
        <Suspense fallback={null}>
          <ProjectModal project={quick} onClose={closeQuick} />
        </Suspense>
      )}
    </div>
  );
}
