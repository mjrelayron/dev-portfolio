import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Briefcase, Rocket, Download, Mail, X } from 'lucide-react';
import { PageFrame } from '../app/PageFrame';
import { Seo, personJsonLd } from '../app/Seo';
import { Button, ButtonLink } from '../components/ui/Button';
import { ClientOnly } from '../components/ui/ClientOnly';
import { Skeleton } from '../components/ui/Skeleton';
import { ToolShell } from '../components/legacy/ToolShell';
import { prefersReducedMotion } from '../hooks/useReducedMotion';
import { profile } from '../data/profile';
import type { QuotePrefill } from '../lab/ServiceFlow';
import '../lab/lab.css';

const ContactSection = lazy(() => import('../components/ContactSection.jsx'));
const ServiceFlow = lazy(() => import('../lab/ServiceFlow'));

const HEADLINE = "Have a project in mind? Let's build something remarkable.";

function FormSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]" aria-busy="true" aria-label="Loading contact form">
      <Skeleton className="h-80 w-full rounded-2xl" />
      <Skeleton className="h-[30rem] w-full rounded-2xl" />
    </div>
  );
}

const scrollOpts = (): ScrollIntoViewOptions => ({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });

export default function ContactPage() {
  const location = useLocation();
  const incoming = (location.state as { prefill?: QuotePrefill } | null)?.prefill ?? null;
  const [prefill, setPrefill] = useState<QuotePrefill | null>(incoming);
  const [flowOpen, setFlowOpen] = useState(false);
  const flowRef = useRef<HTMLElement>(null);

  const focusForm = (field: 'name' | 'message' = 'name') => {
    const el = document.getElementById('contact');
    el?.scrollIntoView(scrollOpts());
    // focus once the scroll has started so the caret lands in view
    window.setTimeout(() => document.getElementById(`contact-${field}`)?.focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 350);
  };

  // arriving from a quote generator in the Lab: jump straight to the form
  useEffect(() => {
    if (!incoming) return;
    const t = window.setTimeout(() => focusForm('name'), 400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openFlow = () => {
    setFlowOpen(true);
    window.setTimeout(() => flowRef.current?.scrollIntoView(scrollOpts()), 60);
  };

  const closeFlow = () => {
    setFlowOpen(false);
    window.setTimeout(() => document.getElementById('portal-top')?.scrollIntoView(scrollOpts()), 30);
  };

  const onQuoteReady = (p: QuotePrefill) => {
    setPrefill(p);
    setFlowOpen(false);
    window.setTimeout(() => focusForm('name'), 60);
  };

  return (
    <PageFrame
      accent="white"
      wide
      eyebrow="Contact Portal"
      title={
        <span id="portal-top" className="portal-headline block max-w-[22ch] text-balance">
          {HEADLINE}
        </span>
      }
      intro="Freelance builds, a full-time role or a quick question — pick a door. Messages land in my inbox and I reply within 24 hours."
      bot={{ state: 'wave', bubble: 'Doors are open. I’ll make sure Melvin sees it.' }}
      actions={
        <>
          <Button className="btn-violet" icon={<Briefcase size={17} aria-hidden />} onClick={() => focusForm('name')}>
            Hire Me
          </Button>
          <Button
            className="btn-violet"
            icon={<Rocket size={17} aria-hidden />}
            onClick={openFlow}
            aria-expanded={flowOpen}
            aria-controls="portal-quote"
          >
            Start a Project
          </Button>
          <ButtonLink href={profile.resumeUrl} download variant="ghost" icon={<Download size={17} aria-hidden />}>
            Download Resume
          </ButtonLink>
          <ButtonLink href={`mailto:${profile.email}`} variant="ghost" icon={<Mail size={17} aria-hidden />}>
            Contact Me
          </ButtonLink>
        </>
      }
    >
      <Seo
        title="Contact Portal"
        description="Hire Melvin Jr. Elayron, start a project with an instant quote, download the resume or send a message."
        path="/contact"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contact Portal', mainEntity: personJsonLd }}
      />

      {flowOpen && (
        <section
          id="portal-quote"
          ref={flowRef}
          aria-label="Project quote builder"
          className="mb-8 scroll-mt-[calc(var(--hud-top)+12px)] lg:scroll-mt-4"
          data-accent="violet"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="mono-label text-accent-text">Start a project</p>
              <p className="mt-1 text-ink-2">Pick a service, try the simulator, and get a quote. Its final button drops the summary into the form below.</p>
            </div>
            <Button variant="ghost" size="sm" icon={<X size={15} aria-hidden />} onClick={closeFlow}>
              Close quote builder
            </Button>
          </div>
          <ToolShell>
            <ClientOnly fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
              <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
                <ServiceFlow onExit={closeFlow} onQuoteReady={onQuoteReady} />
              </Suspense>
            </ClientOnly>
          </ToolShell>
        </section>
      )}

      <ClientOnly fallback={<FormSkeleton />}>
        <Suspense fallback={<FormSkeleton />}>
          <ContactSection prefill={prefill} />
        </Suspense>
      </ClientOnly>
    </PageFrame>
  );
}
