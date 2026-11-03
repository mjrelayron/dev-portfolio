import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { useParams } from 'react-router-dom';
import { Seo } from '../app/Seo';
import { gameBySlug, type GameSlug } from '../arcade/games';
import { GameFrame } from '../arcade/GameFrame';
import { Skeleton } from '../components/ui/Skeleton';
import NotFoundPage from './NotFoundPage';
import '../arcade/arcade.css';

// each game is its own chunk; matter-js only loads with Stack Builder
const components: Record<GameSlug, LazyExoticComponent<ComponentType>> = {
  'stack-builder': lazy(() => import('../arcade/games/stack-builder/StackBuilder')),
  'bug-hunter': lazy(() => import('../arcade/games/bug-hunter/BugHunter')),
  'project-explorer': lazy(() => import('../arcade/games/project-explorer/ProjectExplorer')),
  'workflow-challenger': lazy(() => import('../arcade/WorkflowCabinet')),
};

const descriptions: Record<GameSlug, string> = {
  'stack-builder': 'A one-button physics game: drop tech blocks from a swinging crane and stack them as high as you can.',
  'bug-hunter': 'Ten short JavaScript, React, Python and SQL snippets, each with exactly one bug. Spot the broken line.',
  'project-explorer': 'A scavenger hunt through the Project District: read a clue drawn from a real project, then find its case study.',
  'workflow-challenger': 'Pick an automation tool and learn it through curated tutorials and real-world workflow challenges.',
};

function GameSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading game">
      <Skeleton className="h-[min(70vh,560px)] w-full rounded-[20px]" />
    </div>
  );
}

export default function ArcadeGamePage() {
  const { game: slug = '' } = useParams();
  const game = gameBySlug[slug as GameSlug];
  if (!game) return <NotFoundPage />;
  const Game = components[game.slug];
  return (
    <GameFrame game={game}>
      <Seo title={`${game.name} · Arcade`} description={descriptions[game.slug]} path={`/arcade/${game.slug}`} />
      <Suspense fallback={<GameSkeleton />}>
        <Game />
      </Suspense>
    </GameFrame>
  );
}
