import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics/react';
import { Skeleton } from '../components/ui/Skeleton';

// Each tool is its own chunk; the selector is what the user sees first.
import ServiceSelector from '../components/ServiceSelector.jsx';
const SEOSimulator = lazy(() => import('../components/SEOSimulator.jsx'));
const WordPressSimulator = lazy(() => import('../components/WordPressSimulator.jsx'));
const FullStackSimulator = lazy(() => import('../components/FullStackSimulator.jsx'));
const AISimulator = lazy(() => import('../components/AISimulator.jsx'));
const ProcessPage = lazy(() => import('../components/ProcessPage.jsx'));
const SEOQuoteGenerator = lazy(() => import('../components/SEOQuoteGenerator.jsx'));
const WordPressQuoteGenerator = lazy(() => import('../components/WordPressQuoteGenerator.jsx'));
const FullStackQuoteGenerator = lazy(() => import('../components/FullStackQuoteGenerator.jsx'));
const AIQuoteGenerator = lazy(() => import('../components/AIQuoteGenerator.jsx'));

type SimulatorId = 'seo' | 'wordpress' | 'fullstack' | 'ai-automation';
type QuoteService = 'SEO Optimization' | 'WordPress Development' | 'FullStack Development' | 'AI & Automation';
type View = { kind: 'selector' } | { kind: 'simulator'; id: SimulatorId } | { kind: 'quote'; service: QuoteService };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

/** What a finished quote hands to the contact form. */
export interface QuotePrefill {
  subject: string;
  message: string;
}

const money = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) ? `$${Math.round(n).toLocaleString()}` : null);

/** Turns any of the four quote shapes into a short, human summary. */
export function quoteToPrefill(service: string, quote: Any): QuotePrefill {
  const lines: string[] = [];
  const pkg = quote?.selectedPackage?.name ?? quote?.selectedPackage?.title;
  if (pkg) lines.push(`Package: ${pkg}`);
  const total = money(quote?.totalPrice) ?? money(quote?.total) ?? money(quote?.pricing?.total) ?? money(quote?.totalCost);
  if (total) lines.push(`Estimate: ${total}`);
  const monthly = money(quote?.pricing?.monthlyPrice);
  if (monthly) lines.push(`Monthly: ${monthly}`);
  const timeline = typeof quote?.timeline === 'string' ? quote.timeline : quote?.contractTerms?.setupTime;
  if (timeline) lines.push(`Timeline: ${timeline}`);
  return {
    subject: `Project quote: ${service}`,
    message: `Hi Melvin, I just built a ${service} quote in your Experiment Lab and would like to talk it through.\n\n${lines.join('\n')}`.trim(),
  };
}

/**
 * The old landing page's lead funnel, re-homed: ServiceSelector → one of four
 * simulators → the matching quote generator, with ProcessPage on top. Same
 * props and the same analytics events as the original App.jsx state machine;
 * the tools now render in-page inside the destination panel.
 */
export default function ServiceFlow({
  onExit,
  onQuoteReady,
}: {
  /** closing the selector leaves the flow */
  onExit: () => void;
  /** a quote generator's final CTA ("Get This Quote", "Book Consultation") */
  onQuoteReady?: (prefill: QuotePrefill) => void;
}) {
  const [view, setView] = useState<View>({ kind: 'selector' });
  const [processService, setProcessService] = useState<string | null>(null);
  const [currentServiceData, setCurrentServiceData] = useState<Any>(null);
  const root = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

  // opening the flow is opening the selector
  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    track('service_selector_opened');
  }, []);

  // every screen change starts at the top of the flow, like the old overlays did
  const viewKey = `${view.kind}:${'id' in view ? view.id : 'service' in view ? view.service : ''}:${processService ?? ''}`;
  const shownKey = useRef<string | null>(null);
  // called by <OnShown> once the (lazy) screen has actually committed, so the page is tall enough to scroll
  const onScreenShown = (key: string) => {
    if (shownKey.current === null || shownKey.current === key) {
      shownKey.current = key; // first screen, or a StrictMode re-run
      return;
    }
    shownKey.current = key;
    root.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
  };

  const handleCloseServiceSelector = () => onExit();

  const handleSelectService = (service: { id: string }) => {
    track('simulator_opened', { simulator: service.id });
    if (service.id === 'seo' || service.id === 'wordpress' || service.id === 'fullstack' || service.id === 'ai-automation') {
      setView({ kind: 'simulator', id: service.id });
    }
  };

  const handleBackFromSimulator = () => {
    if (view.kind === 'simulator') {
      track('simulator_abandoned', { simulator: view.id === 'ai-automation' ? 'ai' : view.id });
    }
    setView({ kind: 'selector' });
  };

  const handleProceedToQuote = (serviceData: Any) => {
    setCurrentServiceData(serviceData);
    track('quote_generator_opened', { service: serviceData.service.toLowerCase().replace(' ', '_') });
    // FullStackSimulator reports 'Full Stack Development' (with a space); the old
    // App.jsx only matched 'FullStack Development', so that quote never opened.
    const s = (serviceData.service === 'Full Stack Development' ? 'FullStack Development' : serviceData.service) as QuoteService;
    if (s === 'SEO Optimization' || s === 'WordPress Development' || s === 'FullStack Development' || s === 'AI & Automation') {
      setView({ kind: 'quote', service: s });
    }
  };

  const handleShowProcessPage = (service: string) => setProcessService(service);

  const handleCloseProcessPage = () => {
    setProcessService(null);
    document.body.style.overflow = 'unset';
  };

  const handleCloseQuoteGenerator = () => {
    setCurrentServiceData(null);
    setView({ kind: 'selector' });
  };

  const handleGenerateQuote = (quoteData: Any) => {
    if (view.kind !== 'quote' || !onQuoteReady) return;
    onQuoteReady(quoteToPrefill(view.service, quoteData));
  };

  const showProcess = processService !== null;
  const simProps = { onBack: handleBackFromSimulator, onProceedToQuote: handleProceedToQuote, onShowProcessPage: handleShowProcessPage };
  const quoteProps = { onBack: handleCloseQuoteGenerator, onGenerateQuote: handleGenerateQuote };

  return (
    <div ref={root} className="lab-flow">
      <Suspense fallback={<FlowSkeleton />}>
        {/* the current screen stays mounted under ProcessPage so simulator progress survives */}
        <div hidden={showProcess}>
          {view.kind === 'selector' && (
            <ServiceSelector
              key={`service-selector-${showProcess}`}
              onSelectService={handleSelectService}
              onClose={handleCloseServiceSelector}
              onShowProcessPage={handleShowProcessPage}
            />
          )}
          {view.kind === 'simulator' && view.id === 'seo' && <SEOSimulator {...simProps} />}
          {view.kind === 'simulator' && view.id === 'wordpress' && <WordPressSimulator {...simProps} />}
          {view.kind === 'simulator' && view.id === 'fullstack' && <FullStackSimulator {...simProps} />}
          {view.kind === 'simulator' && view.id === 'ai-automation' && <AISimulator {...simProps} />}

          {view.kind === 'quote' && view.service === 'SEO Optimization' && (
            <SEOQuoteGenerator {...quoteProps} simulatorData={currentServiceData?.simulatorData} />
          )}
          {view.kind === 'quote' && view.service === 'WordPress Development' && (
            <WordPressQuoteGenerator {...quoteProps} simulatorData={currentServiceData} />
          )}
          {view.kind === 'quote' && view.service === 'FullStack Development' && (
            <FullStackQuoteGenerator {...quoteProps} simulatorData={currentServiceData} />
          )}
          {view.kind === 'quote' && view.service === 'AI & Automation' && (
            <AIQuoteGenerator {...quoteProps} simulatorData={currentServiceData?.simulatorData} />
          )}
        </div>

        {showProcess && <ProcessPage service={processService} onBack={handleCloseProcessPage} />}
        <OnShown key={viewKey} run={() => onScreenShown(viewKey)} />
      </Suspense>
    </div>
  );
}

/** Commits together with the screen in the same Suspense boundary. */
function OnShown({ run }: { run: () => void }) {
  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function FlowSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading tool">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid gap-4 pt-2 sm:grid-cols-2">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    </div>
  );
}
