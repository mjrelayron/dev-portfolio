import { lazy, Suspense } from 'react';
import { ClientOnly } from '../components/ui/ClientOnly';
import { ToolShell } from '../components/legacy/ToolShell';
import { Skeleton } from '../components/ui/Skeleton';

const WorkflowChallenger = lazy(() => import('../components/WorkflowChallenger.jsx'));

function Loading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2" aria-busy="true" aria-label="Loading Workflow Challenger">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-[18px]" />
      ))}
    </div>
  );
}

/** The legacy Workflow Challenger, untouched, inside the navy ToolShell. */
export default function WorkflowCabinet() {
  return (
    <ClientOnly fallback={<Loading />}>
      <Suspense fallback={<Loading />}>
        <ToolShell className="arcade-wc">
          <WorkflowChallenger />
        </ToolShell>
      </Suspense>
    </ClientOnly>
  );
}
