import { Link } from 'react-router-dom';
import { ArrowRight, Send, RotateCcw } from 'lucide-react';
import { Seo, personJsonLd } from '../app/Seo';
import { profile } from '../data/profile';
import { ButtonLink } from '../components/ui/Button';
import { useSettings } from '../store/useSettings';
import { ClientOnly } from '../components/ui/ClientOnly';

/** The text layer over the hub map: who this is, and the two main ways in. */
export function WorldOverlay({ path, hidden }: { path: string; hidden?: boolean }) {
  const replay = useSettings((s) => s.replayIntro);
  const seen = useSettings((s) => s.introSeen);
  return (
    <>
      <Seo
        title={`DEVELOPERVERSE · ${profile.name} — Full-Stack Developer & Automation Architect`}
        description="Explore the portfolio of MJR Elayron: full-stack web apps, AI tools and automations, presented as a small explorable world. Every section is also one click away in the dock."
        path={path}
        jsonLd={personJsonLd}
      />
      <section aria-hidden={hidden || undefined} className={`world-card ${hidden ? 'is-hidden' : ''} pointer-events-none fixed left-3 right-3 top-[calc(var(--hud-top)+4px)] z-20 sm:left-6 sm:right-auto lg:top-[calc(var(--hud-top)+18px)]`}>
        <div className="panel pointer-events-auto max-w-[25rem] p-4 sm:p-5">
          <p className="mono-label text-[var(--orange)]">Welcome to the verse</p>
          <h1 className="mt-1.5 text-[1.45rem] font-bold sm:text-[1.7rem]">
            {profile.name}
            <span className="block text-[0.98rem] font-medium text-ink-2 sm:text-[1.05rem]">{profile.headline}</span>
          </h1>
          <p className="mt-2 hidden text-[0.9rem] text-ink-2 sm:block">{profile.shortBio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink to="/projects" size="sm" icon={<ArrowRight size={16} aria-hidden />} style={{ ['--btn-face' as string]: 'var(--violet)', ['--btn-edge' as string]: 'var(--violet-dark)', color: '#fff' }}>
              See the work
            </ButtonLink>
            <ButtonLink to="/contact" size="sm" variant="ghost" icon={<Send size={15} aria-hidden />}>
              Hire me
            </ButtonLink>
          </div>
          <p className="mono-label mt-4 hidden text-ink-3 lg:block">
            Click an island · keys 1–6 · <Link to="/classic" className="underline hover:text-white">plain index</Link>
          </p>
          <p className="mono-label mt-3 text-ink-3 lg:hidden">Swipe to explore · tap twice to enter</p>
          <ClientOnly>
            {seen && path === '/' && (
              <button type="button" onClick={replay} className="mono-label mt-2 inline-flex items-center gap-1.5 text-ink-3 hover:text-white">
                <RotateCcw size={12} aria-hidden /> Replay intro
              </button>
            )}
          </ClientOnly>
        </div>
      </section>
    </>
  );
}
