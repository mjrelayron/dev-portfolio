import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { destinations, accentVar, type Destination } from '../data/destinations';
import { featuredProjects } from '../data/projects.js';
import { EXPERIENCE_DATA } from '../data/experience.js';
import { Island, Cloud, Tree, Rock } from './parts';
import { CentralPlaza, ProjectDistrict, SkillAcademy, ExperienceTower, ExperimentLab, ContactPortal } from './buildings';
import { MapBot } from './MapBot';
import { useIsDesktop, useCanHover } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { burstAt } from '../hooks/useConfetti';
import { playSound } from '../hooks/useSound';
import { project } from './iso';

type DestId = Destination['id'];

interface IslandDef {
  id: DestId;
  at: [number, number]; // screen position of the island centre
  w: number;
  d: number;
  grass?: string;
  bob: 1 | 2 | 3;
  labelY: number; // label height above the island centre
  waterfall?: boolean;
}

// Map composition, in SVG user units.
const ISLANDS: IslandDef[] = [
  { id: 'hub', at: [0, 40], w: 4.4, d: 4.4, bob: 1, labelY: -150 },
  { id: 'projects', at: [-380, -120], w: 3.9, d: 3.6, bob: 2, labelY: -200 },
  { id: 'skills', at: [380, -130], w: 3.9, d: 3.5, bob: 3, labelY: -150 },
  { id: 'experience', at: [-390, 200], w: 3.3, d: 3.3, bob: 3, labelY: -215 },
  { id: 'lab', at: [385, 195], w: 3.8, d: 3.4, bob: 2, labelY: -120, waterfall: true },
  { id: 'contact', at: [0, -300], w: 3.0, d: 2.6, grass: '#A9E7C2', bob: 1, labelY: -150 },
];
const DRAW_ORDER = [...ISLANDS].sort((a, b) => a.at[1] - b.at[1]);
const islandById = Object.fromEntries(ISLANDS.map((i) => [i.id, i])) as Record<DestId, IslandDef>;
const destById = Object.fromEntries(destinations.map((d) => [d.id, d])) as Record<DestId, Destination>;

const CONTENT = { x: -620, y: -470, w: 1240, h: 900 };

type VB = { x: number; y: number; w: number; h: number };

/** Fit a content rect into the container aspect (expanding the short side). */
function fitBox(box: VB, aspect: number): VB {
  const a = box.w / box.h;
  if (aspect > a) {
    const w = box.h * aspect;
    return { x: box.x - (w - box.w) / 2, y: box.y, w, h: box.h };
  }
  const h = box.w / aspect;
  return { x: box.x, y: box.y - (h - box.h) / 2, w: box.w, h };
}

function fitBesideCard(cw: number, ch: number, card: number): VB {
  const regionW = cw - card;
  const s = Math.min(regionW / CONTENT.w, ch / CONTENT.h);
  const w = cw / s;
  const h = ch / s;
  return { x: CONTENT.x - card / s - (regionW / s - CONTENT.w) / 2, y: CONTENT.y - (h - CONTENT.h) / 2, w, h };
}

function focusBox(id: DestId, cw: number, ch: number, desktop: boolean): VB {
  const isl = islandById[id];
  const full = fitBox(CONTENT, cw / ch);
  const scale = (cw / full.w) * (desktop ? 1.55 : 2.1);
  const w = cw / scale;
  const h = ch / scale;
  // desktop: the destination panel covers the right side, so park the island in the left strip
  const panelW = Math.min(1080, cw - 380);
  const targetX = desktop ? Math.max(170, (cw - panelW - 16) / 2) : cw / 2;
  const cx = isl.at[0];
  const cy = isl.at[1] - 60;
  return { x: cx - targetX / scale, y: cy - (ch / 2) / scale, w, h };
}

export function HubMap({ focus, interactive }: { focus: DestId | null; interactive: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const vb = useRef<VB>({ ...CONTENT });
  const tween = useRef<gsap.core.Tween | null>(null);
  const navigate = useNavigate();
  const desktop = useIsDesktop();
  const canHover = useCanHover();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<DestId | null>(null);
  const [armed, setArmed] = useState<DestId | null>(null); // touch: first tap shows the label
  const [pressed, setPressed] = useState<DestId | null>(null);
  const [entering, setEntering] = useState<DestId | null>(null);
  const activeFocus = entering ?? focus;

  const covers = useMemo(() => featuredProjects.map((p: { image: string }) => p.image).filter(Boolean), []);

  const apply = useCallback((b: VB) => {
    vb.current = b;
    svgRef.current?.setAttribute('viewBox', `${b.x.toFixed(1)} ${b.y.toFixed(1)} ${b.w.toFixed(1)} ${b.h.toFixed(1)}`);
  }, []);

  const target = useCallback(
    (id: DestId | null): VB => {
      const el = svgRef.current;
      const cw = el?.clientWidth || 1440;
      const ch = el?.clientHeight || 900;
      if (id) return focusBox(id, cw, ch, desktop);
      // world view on desktop: keep the left column free for the welcome card
      if (desktop && interactive && cw >= 1100) return fitBesideCard(cw, ch, 440);
      return fitBox(CONTENT, cw / ch);
    },
    [desktop, interactive],
  );

  const moveCamera = useCallback(
    (id: DestId | null, duration = 0.7) => {
      tween.current?.kill();
      const to = target(id);
      if (reduced || duration === 0) {
        apply(to);
        return Promise.resolve();
      }
      const from = { ...vb.current };
      return new Promise<void>((resolve) => {
        tween.current = gsap.to(from, {
          ...to,
          duration,
          ease: id ? 'back.out(1.15)' : 'power3.inOut',
          onUpdate: () => apply(from),
          onComplete: resolve,
        });
      });
    },
    [apply, reduced, target],
  );

  // initial frame + resize
  useLayoutEffect(() => {
    apply(target(focus));
    const ro = new ResizeObserver(() => {
      tween.current?.kill();
      apply(target(entering ?? focus));
    });
    if (svgRef.current) ro.observe(svgRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktop, interactive]);

  // route-driven camera: zoom in to the destination, or back out on Esc/Home/back
  useEffect(() => {
    if (entering) return;
    moveCamera(focus);
  }, [focus, moveCamera, entering]);

  useEffect(() => {
    if (!entering) return;
    if (focus === entering) setEntering(null);
  }, [focus, entering]);

  // centre the mobile swipe strip on the hub
  useLayoutEffect(() => {
    const s = scrollRef.current;
    if (s && !desktop) s.scrollLeft = (s.scrollWidth - s.clientWidth) / 2;
  }, [desktop]);

  // pointer parallax (desktop, world view only): CSS variables, no React state
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !interactive || !canHover || reduced) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty('--mx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        root.style.setProperty('--my', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      root.style.setProperty('--mx', '0');
      root.style.setProperty('--my', '0');
    };
  }, [interactive, canHover, reduced]);

  const enter = useCallback(
    async (id: DestId, el: Element | null) => {
      const dest = destById[id];
      setPressed(id);
      playSound('pop');
      setTimeout(() => setPressed(null), 140);
      burstAt(el, accentVar[dest.accent === 'white' ? 'violet' : dest.accent]);
      setEntering(id);
      setHovered(null);
      setArmed(null);
      playSound('whoosh');
      await moveCamera(id, 0.7);
      navigate(dest.path);
    },
    [moveCamera, navigate],
  );

  const onActivate = (id: DestId, el: Element | null) => {
    if (!interactive) return;
    // touch: first tap shows the label, second tap enters
    if (!canHover && armed !== id) {
      setArmed(id);
      playSound('tick');
      return;
    }
    enter(id, el);
  };

  const labelFor = canHover ? hovered : armed;
  const botLook = labelFor && labelFor !== 'hub' ? { x: Math.sign(islandById[labelFor].at[0]) * 80 || 0, y: islandById[labelFor].at[1] < 0 ? -70 : 50 } : undefined;

  const mapSvg = (
    <svg ref={svgRef} className="hub-svg" viewBox={`${CONTENT.x} ${CONTENT.y} ${CONTENT.w} ${CONTENT.h}`} preserveAspectRatio="xMidYMid meet" role="group" aria-label="DEVELOPERVERSE world map">
      <MapDefs />
      {/* far layer: distant desaturated islands */}
      <g className="parallax parallax--far" aria-hidden>
        <FarIslands />
      </g>
      {/* bridges / light paths */}
      <g className="parallax parallax--main" aria-hidden>
        {ISLANDS.filter((i) => i.id !== 'hub').map((i) => (
          <path key={i.id} d={`M0 40 Q${i.at[0] * 0.5} ${(i.at[1] + 40) / 2 + 40} ${i.at[0]} ${i.at[1]}`} className={`light-path ${activeFocus && activeFocus !== i.id ? 'is-dim' : ''}`} />
        ))}
        <Cloud x={-210} y={-250} s={0.9} opacity={0.12} />
        <Cloud x={230} y={330} s={1.1} opacity={0.1} />
        <Birds />
      </g>
      <g className="parallax parallax--main">
        {DRAW_ORDER.map((isl) => {
          const dest = destById[isl.id];
          const isFocus = activeFocus === isl.id;
          const dim = activeFocus && !isFocus;
          return (
            <g key={isl.id} transform={`translate(${isl.at[0]} ${isl.at[1]})`} className={`island ${dim ? 'is-dim' : ''}`}>
              <g className={`idle-anim bob-${isl.bob}`}>
                <a
                  href={dest.path}
                  className={`bld ${labelFor === isl.id ? 'is-hover' : ''} ${pressed === isl.id ? 'is-pressed' : ''}`}
                  aria-label={`${dest.name}: ${dest.blurb}${dest.id === 'hub' ? ' Opens About.' : ''}`}
                  tabIndex={interactive ? 0 : -1}
                  style={{ ['--glow' as string]: accentVar[dest.accent] }}
                  onClick={(e) => {
                    e.preventDefault();
                    onActivate(isl.id, e.currentTarget);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === ' ') {
                      e.preventDefault();
                      enter(isl.id, e.currentTarget);
                    }
                  }}
                  onPointerEnter={(e) => {
                    if (e.pointerType !== 'mouse') return;
                    setHovered(isl.id);
                    playSound('tick');
                  }}
                  onPointerLeave={() => setHovered((h) => (h === isl.id ? null : h))}
                  onFocus={() => setHovered(isl.id)}
                  onBlur={() => setHovered((h) => (h === isl.id ? null : h))}
                >
                  <Island w={isl.w} d={isl.d} grass={isl.grass} waterfall={isl.waterfall}>
                    <IslandDecor id={isl.id} />
                    <g className="bld-body">
                      <Building id={isl.id} covers={covers} />
                    </g>
                  </Island>
                  {/* generous invisible hit area */}
                  <ellipse cx="0" cy="-40" rx="150" ry="120" fill="transparent" />
                </a>
                {isl.id === 'hub' && <MapBot look={botLook} pointing={!!botLook} />}
              </g>
            </g>
          );
        })}
      </g>
      {/* labels last so they sit above every island */}
      <g className="parallax parallax--main">
        {ISLANDS.map((isl) => (
          <g key={isl.id} transform={`translate(${isl.at[0]} ${isl.at[1]})`}>
            <g className={`idle-anim bob-${isl.bob}`}>
              <MapLabel show={labelFor === isl.id && interactive} y={isl.labelY} dest={destById[isl.id]} touch={!canHover} />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );

  return (
    <div ref={rootRef} className={`hub-root ${interactive ? 'is-interactive' : ''} ${activeFocus ? 'has-focus' : ''}`}>
      <div className="parallax-dom parallax--stars" aria-hidden />
      {desktop ? (
        <div className="hub-stage">{mapSvg}</div>
      ) : (
        <div ref={scrollRef} className="hub-strip scrollbar-none" aria-label="Swipe to explore islands">
          <div className="hub-strip__inner">
            {mapSvg}
            <span className="snap-mark" style={{ left: '22%' }} />
            <span className="snap-mark" style={{ left: '50%' }} />
            <span className="snap-mark" style={{ left: '78%' }} />
          </div>
        </div>
      )}
      <div className="parallax-dom parallax--near" aria-hidden>
        <NearClouds />
      </div>
    </div>
  );
}

function Building({ id, covers }: { id: DestId; covers: string[] }): ReactNode {
  switch (id) {
    case 'hub':
      return <CentralPlaza />;
    case 'projects':
      return <ProjectDistrict covers={covers} />;
    case 'skills':
      return <SkillAcademy />;
    case 'experience':
      return <ExperienceTower floors={Math.min(EXPERIENCE_DATA.length, 9)} />;
    case 'lab':
      return <ExperimentLab />;
    case 'contact':
      return <ContactPortal />;
  }
}

function IslandDecor({ id }: { id: DestId }) {
  if (id === 'hub')
    return (
      <g>
        <Tree x={-1.9} y={0.6} s={0.9} />
        <Tree x={0.9} y={1.8} s={0.8} tone="#5DBF8A" />
        <Tree x={1.8} y={-1.2} s={0.7} />
        <Rock x={1.4} y={1.3} />
        <Rock x={-1.3} y={1.6} s={0.8} />
      </g>
    );
  if (id === 'contact') return <Rock x={0.9} y={0.8} s={0.8} />;
  return <Rock x={1.2} y={-1.3} s={0.9} />;
}

function MapLabel({ show, y, dest, touch }: { show: boolean; y: number; dest: Destination; touch: boolean }) {
  const line2 = touch ? 'Tap again to enter' : dest.blurb;
  const w = Math.max(dest.name.length * 10.5, line2.length * 6.6) + 32;
  return (
    <g className={`map-label ${show ? 'is-on' : ''}`} transform={`translate(0 ${y})`} aria-hidden>
      <g className="map-label__inner">
        <rect x={-w / 2} y={-46} width={w} height={50} rx={12} fill="#222850" stroke="rgba(255,255,255,0.22)" />
        <rect x={-w / 2} y={-46} width={6} height={50} rx={3} fill={accentVar[dest.accent]} />
        <text x={-w / 2 + 18} y={-25} className="map-label__title">
          {dest.name.toUpperCase()}
        </text>
        <text x={-w / 2 + 18} y={-9} className="map-label__sub">
          {line2}
        </text>
        <path d="M-7 4 L0 12 L7 4 Z" fill="#222850" />
      </g>
    </g>
  );
}

function FarIslands() {
  const items = [
    [-540, -320, 0.45],
    [520, -330, 0.5],
    [-200, -420, 0.32],
    [250, -430, 0.36],
    [560, 340, 0.42],
    [-560, 360, 0.38],
  ] as const;
  return (
    <g opacity="0.55">
      {items.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`} className={`idle-anim bob-${(i % 3) + 1}`}>
          <Island w={3} d={2.6} grass="#4C6B86" rock="#2E3462" />
        </g>
      ))}
    </g>
  );
}

function Birds() {
  return (
    <g className="birds" aria-hidden>
      {[0, 1, 2].map((i) => (
        <path key={i} d="M0 0 q5 -5 10 0 q5 -5 10 0" stroke="#E8EAFF" strokeWidth="1.6" fill="none" strokeLinecap="round" className="bird" style={{ animationDelay: `${i * -9}s`, transform: `translateY(${-220 + i * 60}px)` }} />
      ))}
    </g>
  );
}

function NearClouds() {
  return (
    <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <Cloud x={90} y={560} s={1.6} opacity={0.05} />
      <Cloud x={930} y={70} s={1.3} opacity={0.045} />
    </svg>
  );
}

function MapDefs() {
  const s = project(0, 0, 0);
  void s;
  return (
    <defs>
      <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.6" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="glow-strong" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="6" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <radialGradient id="isl-shadow">
        <stop offset="0" stopColor="#05071A" stopOpacity="0.38" />
        <stop offset="1" stopColor="#05071A" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="grass-sheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
        <stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="pillar-grad" x1="0" x2="1">
        <stop offset="0" stopColor="#E6E8FA" />
        <stop offset="1" stopColor="#8D93C4" />
      </linearGradient>
      <linearGradient id="tank-grad" x1="0" x2="1">
        <stop offset="0" stopColor="#E9FFF2" />
        <stop offset="1" stopColor="#6FB98E" />
      </linearGradient>
      <linearGradient id="dome-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#E8F7FF" />
        <stop offset="1" stopColor="#42BDF5" />
      </linearGradient>
      <linearGradient id="screen-sheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.22" />
        <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="portal-inner" cx="50%" cy="50%" r="55%">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="0.45" stopColor="#C9C6FF" />
        <stop offset="1" stopColor="#6C63FF" stopOpacity="0.85" />
      </radialGradient>
      <linearGradient id="portal-ring" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#9A94FF" />
      </linearGradient>
    </defs>
  );
}
