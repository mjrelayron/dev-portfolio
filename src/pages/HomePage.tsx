import { WorldOverlay } from './WorldOverlay';
import { Intro } from '../world/Intro';
import { useSettings } from '../store/useSettings';
import { ClientOnly } from '../components/ui/ClientOnly';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const introSeen = useSettings((s) => s.introSeen);
  const markIntroSeen = useSettings((s) => s.markIntroSeen);
  // the welcome card waits until the intro has played (static HTML still has it)
  const [playing, setPlaying] = useState(false);
  useEffect(() => setPlaying(!introSeen), [introSeen]);
  return (
    <>
      <WorldOverlay path="/" hidden={playing} />
      <ClientOnly>{!introSeen && <Intro onDone={markIntroSeen} />}</ClientOnly>
    </>
  );
}
