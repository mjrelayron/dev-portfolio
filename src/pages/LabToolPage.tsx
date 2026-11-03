import { lazy, Suspense, type ComponentType } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import { PageFrame } from '../app/PageFrame';
import { Seo } from '../app/Seo';
import { ClientOnly } from '../components/ui/ClientOnly';
import { Skeleton } from '../components/ui/Skeleton';
import { ButtonLink } from '../components/ui/Button';
import { ToolShell } from '../components/legacy/ToolShell';
import { stationBySlug } from '../lab/stations';
import type { QuotePrefill } from '../lab/ServiceFlow';
import NotFoundPage from './NotFoundPage';

// Legacy tools touch window/localStorage at render: lazy chunks, client only.
const tools: Record<string, ComponentType<Record<string, unknown>>> = {
  simulators: lazy(() => import('../lab/ServiceFlow')) as unknown as ComponentType<Record<string, unknown>>,
  'scraping-dashboard': lazy(() => import('../components/ScrapingDashboard.jsx')),
  chat: lazy(() => import('../components/AIChatPage.jsx')),
  practice: lazy(() => import('../pages/EnglishPracticePage.jsx')),
};

function ToolSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading tool">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-72 w-full rounded-2xl" />
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  );
}

export default function LabToolPage() {
  const { tool = '' } = useParams();
  const navigate = useNavigate();
  const station = stationBySlug[tool];
  const Tool = tools[tool];
  if (!station || !Tool) return <NotFoundPage />;

  const extra =
    tool === 'simulators'
      ? {
          onExit: () => navigate('/lab'),
          onQuoteReady: (prefill: QuotePrefill) => navigate('/contact', { state: { prefill } }),
        }
      : {};

  return (
    <PageFrame
      accent="mint"
      wide
      eyebrow={station.kicker}
      title={station.name}
      intro={station.intro}
      actions={
        <ButtonLink to="/lab" variant="ghost" size="sm" icon={<FlaskConical size={15} aria-hidden />}>
          All stations
        </ButtonLink>
      }
    >
      <Seo title={`${station.name} · Experiment Lab`} description={station.description} path={station.path} />
      <ToolShell className={`tool-shell--${tool}`}>
        <ClientOnly fallback={<ToolSkeleton />}>
          <Suspense fallback={<ToolSkeleton />}>
            <Tool {...extra} />
          </Suspense>
        </ClientOnly>
      </ToolShell>
    </PageFrame>
  );
}
