import { useLocation } from 'react-router-dom';
import { Map, List } from 'lucide-react';
import { Seo } from '../app/Seo';
import { DevBot } from '../mascot/DevBot';
import { ButtonLink } from '../components/ui/Button';

export default function NotFoundPage() {
  const { pathname } = useLocation();
  return (
    <div className="relative grid min-h-[100dvh] place-items-center overflow-hidden px-5 pb-[calc(var(--hud-dock)+24px)] pt-[var(--hud-top)]">
      <Seo title="Lost in space" description="This page drifted out of the DEVELOPERVERSE." path={pathname} noindex />
      <div className="parallax--stars pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative text-center">
        <div className="idle-anim bob-2 inline-block">
          <DevBot size="lg" state="think" bubble="Hmm… this island isn't on my map." />
        </div>
        <p className="mono-label mt-6 text-[var(--orange)]">Error 404 · lost in space</p>
        <h1 className="mt-2 text-[clamp(1.8rem,5vw,2.8rem)] font-bold">This page drifted out of the verse</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-2">
          Nothing lives at <code className="rounded bg-navy-2 px-1.5 py-0.5 font-mono text-[0.85em]">{pathname}</code>. Head back to the map or open the plain index.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/world" icon={<Map size={16} aria-hidden />}>
            Back to the map
          </ButtonLink>
          <ButtonLink to="/classic" variant="ghost" icon={<List size={16} aria-hidden />}>
            Classic view
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
