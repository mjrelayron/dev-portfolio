import { Suspense, useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useParams, type Location } from 'react-router-dom';
import { pages as P, legacyRedirects } from './routes';
import { Shell } from './Shell';
import { RouteWipe } from './RouteWipe';
import { destinationForPath } from '../data/destinations';
import { prefersReducedMotion } from '../hooks/useReducedMotion';
import { PageSkeleton } from '../components/ui/Skeleton';

function LegacyProjectRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/projects/${slug}`} replace />;
}

/**
 * Routes render against a "display" location that lags the real one by the
 * first half of the colour wipe, so the swap happens under cover.
 */
export function App() {
  const location = useLocation();
  const [display, setDisplay] = useState<Location>(location);
  const [wipe, setWipe] = useState<{ key: string; accent: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (location.pathname === display.pathname) {
      setDisplay(location);
      return;
    }
    const top = (p: string) => p.split('/')[1] ?? '';
    // no wipe between sub-routes of the same section, or under reduced motion
    if (prefersReducedMotion() || top(location.pathname) === top(display.pathname)) {
      setDisplay(location);
      return;
    }
    const dest = destinationForPath(location.pathname);
    setWipe({ key: location.key, accent: dest?.accent ?? 'violet' });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDisplay(location), 210);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    // new page: scroll to top (window on mobile, the destination panel on desktop)
    window.scrollTo(0, 0);
    document.getElementById('dest-scroll')?.scrollTo(0, 0);
  }, [display.pathname]);

  return (
    <Shell pathname={display.pathname}>
      <Suspense fallback={<PageSkeleton />}>
        <Routes location={display}>
          <Route path="/" element={<P.Home />} />
          <Route path="/world" element={<P.World />} />
          <Route path="/projects" element={<P.Projects />} />
          <Route path="/projects/:slug" element={<P.CaseStudy />} />
          <Route path="/skills" element={<P.Skills />} />
          <Route path="/experience" element={<P.Experience />} />
          <Route path="/lab" element={<P.Lab />} />
          <Route path="/lab/:tool" element={<P.LabTool />} />
          <Route path="/about" element={<P.About />} />
          <Route path="/contact" element={<P.Contact />} />
          <Route path="/resume" element={<P.Resume />} />
          <Route path="/os" element={<P.OS />} />
          <Route path="/arcade" element={<P.Arcade />} />
          <Route path="/arcade/:game" element={<P.ArcadeGame />} />
          <Route path="/classic" element={<P.Classic />} />
          {Object.entries(legacyRedirects).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
          <Route path="/project/:slug" element={<LegacyProjectRedirect />} />
          <Route path="*" element={<P.NotFound />} />
        </Routes>
      </Suspense>
      {wipe && <RouteWipe key={wipe.key} accent={wipe.accent} onDone={() => setWipe(null)} />}
    </Shell>
  );
}

export default App;
