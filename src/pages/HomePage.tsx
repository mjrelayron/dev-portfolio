import { WorldOverlay } from './WorldOverlay';
import { Intro } from '../world/Intro';
import { useSettings } from '../store/useSettings';
import { ClientOnly } from '../components/ui/ClientOnly';

export default function HomePage() {
  const introSeen = useSettings((s) => s.introSeen);
  const markIntroSeen = useSettings((s) => s.markIntroSeen);
  return (
    <>
      <WorldOverlay path="/" />
      <ClientOnly>{!introSeen && <Intro onDone={markIntroSeen} />}</ClientOnly>
    </>
  );
}
