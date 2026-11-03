import { lazy, Suspense, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, CodeXml, Copy, ExternalLink, KeyRound, Maximize2 } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { ButtonLink } from '../components/ui/Button';
import { CoverImage, CoverPlaceholder } from './covers';
import ProjectHighlightsMarquee from '../components/ProjectHighlightsMarquee.jsx';
import './showroom.css';

const LightboxGallery = lazy(() => import('../components/LightboxGallery.jsx'));

/** Public demo credentials for a live app, with copy buttons. */
function DemoLogin({ login }: { login: NonNullable<Project['demoLogin']> }) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).then(
      () => {
        setCopied(label);
        setTimeout(() => setCopied(null), 1600);
      },
      () => {},
    );
  };
  const rows: [string, string][] = [
    ['Username', login.username],
    ['Password', login.password],
  ];
  return (
    <div className="cs-demo">
      <p className="mono-label text-accent-text">
        <KeyRound size={13} aria-hidden className="mr-1.5 inline" />
        Demo login
      </p>
      <dl className="cs-demo__rows">
        {rows.map(([label, value]) => (
          <div key={label} className="cs-demo__row">
            <dt className="mono-label text-ink-3">{label}</dt>
            <dd className="font-mono text-ink">{value}</dd>
            <button type="button" className="cs-demo__copy" onClick={() => copy(label, value)} aria-label={`Copy ${label.toLowerCase()}`}>
              {copied === label ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
            </button>
          </div>
        ))}
      </dl>
      {login.note && <p className="mt-2 text-sm text-ink-3">{login.note}</p>}
      <span className="sr-only" aria-live="polite">
        {copied ? `${copied} copied` : ''}
      </span>
    </div>
  );
}

function Section({ id, n, title, children }: { id: string; n: number; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="cs-section">
      <p className="mono-label text-accent-text" aria-hidden>
        {String(n).padStart(2, '0')}
      </p>
      <h2 id={`${id}-h`} className="cs-h2">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CaseStudy({ project: p, prev, next }: { project: Project; prev: Project; next: Project }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  // screenshots that aren't just the hero image again
  const extraShots = p.screenshots.filter((s) => s !== p.cover);
  const lightboxImages = p.screenshots.length ? p.screenshots : p.cover ? [p.cover] : [];
  const openAt = (src: string) => {
    const i = lightboxImages.indexOf(src);
    setLightbox(i < 0 ? 0 : i);
  };

  let n = 0;
  const num = () => ++n;
  const hasContribution = !!p.role || p.contribution.length > 0;
  const hasImpact = !!p.impact || p.metrics.length > 0;
  const internalLive = p.liveUrl?.startsWith('/');

  const facts = [
    p.year && { k: 'Year', v: String(p.year) },
    p.status && { k: 'Status', v: p.status },
    { k: 'Category', v: p.category },
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    <article className="cs">
      {!p.cover && (
        <figure className="cs-hero cs-hero--ph">
          <CoverPlaceholder project={p} alt={`${p.title}: internal project, no public screenshots`} />
          <figcaption className="sr-only">Screens for this project are private.</figcaption>
        </figure>
      )}
      {p.cover && (
        <figure className="cs-hero">
          <button type="button" className="cs-hero__btn" onClick={() => openAt(p.cover!)} aria-label={`Enlarge ${p.title} cover image`}>
            <CoverImage project={p} eager sizes="(min-width: 1024px) 1000px, 100vw" alt={`${p.title} — main screen`} className="cs-hero__img" />
            <span className="cs-hero__zoom" aria-hidden>
              <Maximize2 size={16} />
            </span>
          </button>
        </figure>
      )}

      <dl className="cs-facts">
        {facts.map((f) => (
          <div key={f.k} className="cs-fact">
            <dt className="mono-label text-ink-3">{f.k}</dt>
            <dd className="mt-1 font-display font-semibold text-ink">{f.v}</dd>
          </div>
        ))}
      </dl>

      {p.overview && (
        <Section id="overview" n={num()} title="Overview">
          <p className="cs-lead">{p.overview}</p>
        </Section>
      )}

      {(p.problem || p.solution) && (
        <div className="cs-split">
          {p.problem && (
            <Section id="problem" n={num()} title="The problem">
              <p className="cs-body">{p.problem}</p>
            </Section>
          )}
          {p.solution && (
            <Section id="solution" n={num()} title="The solution">
              <p className="cs-body">{p.solution}</p>
            </Section>
          )}
        </div>
      )}

      {hasContribution && (
        <Section id="contribution" n={num()} title="My contribution">
          {p.role && (
            <p className="cs-body">
              Role: <strong className="font-semibold text-ink">{p.role}</strong>
            </p>
          )}
          {p.contribution.length > 0 && (
            <ul className="cs-resp">
              {p.contribution.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {p.tech.length > 0 && (
        <Section id="tech" n={num()} title="Tech stack">
          <ul className="flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <li key={t} className="cs-tech">
                {t}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {p.features.length > 0 && (
        <Section id="features" n={num()} title="Key features">
          <ul className="cs-features">
            {p.features.map((f) => (
              <li key={f}>
                <Check size={16} aria-hidden className="mt-0.5 shrink-0 text-[var(--mint)]" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {hasImpact && (
        <Section id="impact" n={num()} title="Impact">
          {p.metrics.length > 0 && (
            <dl className="cs-metrics">
              {p.metrics.map((m) => (
                <div key={m.label} className="cs-metric">
                  <dt className="cs-metric__k">{m.label}</dt>
                  <dd className="cs-metric__v">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {p.impact && <p className="cs-body mt-4">{p.impact}</p>}
        </Section>
      )}

      {extraShots.length > 0 && (
        <Section id="screenshots" n={num()} title="Screenshots">
          <ul className="cs-shots">
            {extraShots.map((s, i) => (
              <li key={s}>
                <button type="button" className="cs-shot" onClick={() => openAt(s)} aria-label={`Open screenshot ${i + 1} of ${extraShots.length}`}>
                  <img src={s} alt={`${p.title} screenshot ${i + 1}`} width={640} height={400} loading="lazy" decoding="async" />
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {p.video && (
        <Section id="video" n={num()} title="Walkthrough video">
          <div className="cs-video">
            <video controls preload="metadata" playsInline poster={p.cover} width={1280} height={720}>
              <source src={p.video} type="video/mp4" />
              <a href={p.video}>Download the {p.title} walkthrough video</a>
            </video>
          </div>
        </Section>
      )}

      {(p.liveUrl || p.repoUrl) && (
        <div className="cs-cta">
          <div>
            <p className="mono-label text-accent-text">See it for real</p>
            <p className="mt-1 font-display text-lg font-bold text-ink">{internalLive ? `Play ${p.title} right here` : `Explore ${p.title}`}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {p.liveUrl &&
              (internalLive ? (
                <ButtonLink to={p.liveUrl} icon={<ArrowRight size={16} aria-hidden />}>
                  Visit live
                </ButtonLink>
              ) : (
                <ButtonLink href={p.liveUrl} icon={<ExternalLink size={16} aria-hidden />}>
                  Visit live <span className="sr-only">(opens in a new tab)</span>
                </ButtonLink>
              ))}
            {p.repoUrl && (
              <ButtonLink href={p.repoUrl} variant="ghost" icon={<CodeXml size={16} aria-hidden />}>
                View code <span className="sr-only">(opens in a new tab)</span>
              </ButtonLink>
            )}
          </div>
          {p.demoLogin && <DemoLogin login={p.demoLogin} />}
        </div>
      )}

      <ProjectHighlightsMarquee currentSlug={p.slug} />

      <nav className="cs-neighbours" aria-label="More projects">
        <NeighbourLink project={prev} dir="prev" />
        <NeighbourLink project={next} dir="next" />
      </nav>

      {lightbox !== null && (
        <Suspense fallback={null}>
          <LightboxGallery images={lightboxImages} isOpen onClose={() => setLightbox(null)} initialIndex={lightbox} />
        </Suspense>
      )}
    </article>
  );
}

function NeighbourLink({ project, dir }: { project: Project; dir: 'prev' | 'next' }) {
  return (
    <Link to={`/projects/${project.slug}`} className={`cs-nb cs-nb--${dir}`} rel={dir}>
      <span className="cs-nb__thumb">
        <CoverImage project={project} alt="" sizes="160px" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="mono-label flex items-center gap-1.5 text-ink-3">
          {dir === 'prev' ? <ArrowLeft size={12} aria-hidden /> : null}
          {dir === 'prev' ? 'Previous project' : 'Next project'}
          {dir === 'next' ? <ArrowRight size={12} aria-hidden /> : null}
        </span>
        <span className="mt-1 block truncate font-display font-bold text-ink">{project.title}</span>
        <span className="block truncate text-sm text-ink-3">{project.category}</span>
      </span>
    </Link>
  );
}
