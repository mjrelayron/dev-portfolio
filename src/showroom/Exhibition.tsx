import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sortedProjects } from '../data/portfolio';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { playSound } from '../hooks/useSound';
import { CoverImage } from './covers';
import './showroom.css';

/**
 * A 2D museum hall: framed installations on a long wall that scrolls sideways
 * (scroll-snap, wheel → horizontal, swipe on touch). Each frame is a link.
 */
export function Exhibition() {
  const sectionRef = useRef<HTMLElement>(null);
  const hallRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [edge, setEdge] = useState<{ start: boolean; end: boolean }>({ start: true, end: false });

  // step into the hall: bring the whole wall into view (the page header is tall)
  useEffect(() => {
    const t = setTimeout(() => sectionRef.current?.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' }), 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // edge state + parallax for the back wall (transform only, one rAF per scroll frame)
  useEffect(() => {
    const hall = hallRef.current;
    if (!hall) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = hall.scrollWidth - hall.clientWidth;
      setEdge((prev) => {
        const next = { start: hall.scrollLeft < 8, end: hall.scrollLeft > max - 8 };
        return prev.start === next.start && prev.end === next.end ? prev : next;
      });
      if (!reduced && backRef.current) backRef.current.style.transform = `translate3d(${(hall.scrollLeft * 0.35).toFixed(1)}px,0,0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    hall.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      hall.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
      if (backRef.current) backRef.current.style.transform = '';
    };
  }, [reduced]);

  // vertical mouse wheel walks the hall; at either end the page scrolls as usual
  useEffect(() => {
    const hall = hallRef.current;
    if (!hall) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
      const max = hall.scrollWidth - hall.clientWidth;
      const canGo = e.deltaY > 0 ? hall.scrollLeft < max - 1 : hall.scrollLeft > 1;
      if (!canGo) return;
      e.preventDefault();
      const px = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      hall.scrollBy({ left: px * 1.4, behavior: 'auto' });
    };
    hall.addEventListener('wheel', onWheel, { passive: false });
    return () => hall.removeEventListener('wheel', onWheel);
  }, []);

  const step = (dir: 1 | -1) => {
    const hall = hallRef.current;
    if (!hall) return;
    playSound('tick');
    const bay = hall.querySelector<HTMLElement>('.ex-bay');
    const w = bay ? bay.offsetWidth : hall.clientWidth * 0.8;
    hall.scrollBy({ left: dir * w, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section ref={sectionRef} className="ex" aria-labelledby="ex-title">
      <div className="ex__bar">
        <div>
          <h2 id="ex-title" className="font-display text-lg font-bold text-ink">
            Hall of works
          </h2>
          <p className="text-sm text-ink-3">
            {sortedProjects.length} installations · scroll, swipe or tab through the hall
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="ex__nav" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous installations">
            <ChevronLeft size={18} aria-hidden />
          </button>
          <button type="button" className="ex__nav" onClick={() => step(1)} disabled={edge.end} aria-label="Next installations">
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      </div>

      <div className="ex__viewport">
        <div ref={hallRef} className="ex__hall" tabIndex={-1}>
          <div className="ex__wall">
            <div ref={backRef} className="ex__back" aria-hidden />
            <div className="ex__molding" aria-hidden />
            <ol className="ex__row">
              <li className="ex__entrance" aria-hidden>
                <span className="mono-label text-accent-text">Project district</span>
                <span className="ex__entrance-title">The Showroom</span>
                <span className="mono-label text-ink-3">Hall A · featured wing first</span>
              </li>
              {sortedProjects.map((p, i) => (
                <li key={p.slug} className={`ex-bay ${p.featured ? 'ex-bay--featured' : ''}`}>
                  <span className="ex-bay__lamp" aria-hidden />
                  <span className="ex-bay__cone" aria-hidden />
                  <Link to={`/projects/${p.slug}`} className="ex-frame" onClick={() => playSound('pop')}>
                    <span className="ex-frame__mat">
                      <CoverImage project={p} alt="" eager={i < 3} sizes="(min-width: 1024px) 340px, 70vw" className="ex-frame__img" />
                    </span>
                    <span className="ex-plaque">
                      <span className="ex-plaque__title">{p.title}</span>
                      <span className="ex-plaque__meta">
                        {[p.year, p.category].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                  </Link>
                  <span className="ex-bay__pool" aria-hidden />
                </li>
              ))}
              <li className="ex__exit" aria-hidden>
                <span className="mono-label text-ink-3">End of hall</span>
              </li>
            </ol>
            <div className="ex__floor" aria-hidden />
          </div>
        </div>
        <span className={`ex__fade ex__fade--l ${edge.start ? 'is-hidden' : ''}`} aria-hidden />
        <span className={`ex__fade ex__fade--r ${edge.end ? 'is-hidden' : ''}`} aria-hidden />
      </div>
    </section>
  );
}
