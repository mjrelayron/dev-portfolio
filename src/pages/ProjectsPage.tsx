import { useRef, type KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Landmark, LayoutGrid } from 'lucide-react';
import { PageFrame } from '../app/PageFrame';
import { Seo } from '../app/Seo';
import { projects } from '../data/portfolio';
import { playSound } from '../hooks/useSound';
import { Gallery } from '../showroom/Gallery';
import { Exhibition } from '../showroom/Exhibition';
import '../showroom/showroom.css';

type View = 'gallery' | 'exhibition';
const tabs: { id: View; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'gallery', label: 'Gallery', icon: LayoutGrid },
  { id: 'exhibition', label: 'Exhibition', icon: Landmark },
];

export default function ProjectsPage() {
  const [params, setParams] = useSearchParams();
  const view: View = params.get('view') === 'exhibition' ? 'exhibition' : 'gallery';
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (v: View, focus = false) => {
    if (v !== view) playSound('tick');
    const nextParams = new URLSearchParams(params);
    if (v === 'gallery') nextParams.delete('view');
    else nextParams.set('view', v);
    setParams(nextParams, { replace: true, preventScrollReset: true });
    if (focus) tabRefs.current[tabs.findIndex((t) => t.id === v)]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === view);
    let j = -1;
    if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = tabs.length - 1;
    if (j < 0) return;
    e.preventDefault();
    select(tabs[j].id, true);
  };

  return (
    <PageFrame
      accent="violet"
      wide
      eyebrow="Project district · Showroom"
      title="The Showroom"
      intro={`${projects.length} projects I've designed, built, automated or marketed. Browse the gallery, or walk the exhibition hall.`}
      bot={{ state: 'point', bubble: view === 'gallery' ? 'Gold = featured!' : 'Walk this way!' }}
    >
      <Seo
        title="Projects — the Showroom"
        description={`Case studies of ${projects.length} projects by Melvin Jr. Elayron: AI tools, SaaS platforms, automation, e-commerce and digital marketing.`}
        path="/projects"
      />
      <div role="tablist" aria-label="Showroom view" className="sr-tabs" onKeyDown={onKey}>
        {tabs.map(({ id, label, icon: Icon }, i) => (
          <button
            key={id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`sr-tab-${id}`}
            aria-selected={view === id}
            aria-controls="sr-panel"
            tabIndex={view === id ? 0 : -1}
            className="sr-tab"
            onClick={() => select(id)}
          >
            <Icon size={16} aria-hidden />
            {label}
          </button>
        ))}
      </div>
      <div id="sr-panel" role="tabpanel" aria-labelledby={`sr-tab-${view}`} className="mt-6">
        {view === 'gallery' ? <Gallery /> : <Exhibition />}
      </div>
    </PageFrame>
  );
}
