import { Box, Windows, faceQuad, Tree } from './parts';
import { isoCylinder, isoRoof, project, shade } from './iso';

// All buildings are drawn in island-local tile coordinates around (0, 0).

export function CentralPlaza() {
  const plaza = isoCylinder({ cx: 0, cy: 0, z: 0, r: 1.55, h: 0.14 });
  const ring = isoCylinder({ cx: 0, cy: 0, z: 0.14, r: 1.15, h: 0.02 });
  const basin = isoCylinder({ cx: 0, cy: 0, z: 0.14, r: 0.62, h: 0.2 });
  const water = isoCylinder({ cx: 0, cy: 0, z: 0.34, r: 0.5, h: 0 });
  const pillar = isoCylinder({ cx: 0, cy: 0, z: 0.34, r: 0.16, h: 0.9 });
  const tip = project(0, 0, 1.36);
  const posts = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    return { x: Math.cos(a) * 1.32, y: Math.sin(a) * 1.32 };
  });
  return (
    <g>
      <path d={plaza.side} fill="#9AA0CC" />
      <ellipse {...ellipse(plaza.top)} fill="#D9DCF2" />
      <ellipse {...ellipse(ring.top)} fill="none" stroke="#B9BEE3" strokeWidth="3" strokeDasharray="10 8" />
      {posts
        .filter((p) => p.x + p.y < 0.2)
        .map((p, i) => (
          <Lamp key={`b${i}`} x={p.x} y={p.y} />
        ))}
      <path d={basin.side} fill="#8D93C4" />
      <ellipse {...ellipse(basin.top)} fill="#C3C7E8" />
      <ellipse {...ellipse(water.top)} fill="#5FD0FF" opacity="0.85" />
      <path d={pillar.side} fill="url(#pillar-grad)" />
      <circle cx={tip.px} cy={tip.py} r="9" fill="#FFE2B8" filter="url(#glow-strong)" className="beacon-glow" />
      <circle cx={tip.px} cy={tip.py} r="4.5" fill="#FFFFFF" />
      {posts
        .filter((p) => p.x + p.y >= 0.2)
        .map((p, i) => (
          <Lamp key={`f${i}`} x={p.x} y={p.y} />
        ))}
    </g>
  );
}

function Lamp({ x, y }: { x: number; y: number }) {
  const post = isoCylinder({ cx: x, cy: y, z: 0.14, r: 0.04, h: 0.36 });
  const top = project(x, y, 0.52);
  return (
    <g>
      <path d={post.side} fill="#6E74A8" />
      <circle cx={top.px} cy={top.py} r="3.6" fill="#FFE7B0" filter="url(#glow-soft)" />
    </g>
  );
}

const ellipse = (t: { cx: number; cy: number; rx: number; ry: number }) => ({ cx: t.cx, cy: t.cy, rx: t.rx, ry: t.ry });

export function ProjectDistrict({ covers }: { covers: string[] }) {
  const violet = '#6C63FF';
  const t1 = { x: -1.1, y: -1.0, w: 0.95, d: 0.95, h: 3.3 };
  const t2 = { x: 0.15, y: -1.25, w: 0.8, d: 0.8, h: 2.3 };
  const t3 = { x: -0.7, y: 0.3, w: 1.4, d: 0.95, h: 1.5 };
  // big screen on the tallest tower's front-left face
  const sx = t1.x + 0.1;
  const sw = t1.w - 0.2;
  const sTop = t1.h - 0.25;
  const sH = 0.95;
  const o = project(sx, t1.y + t1.d + 0.001, sTop);
  const u = { x: (TW / 2) * sw, y: (TH / 2) * sw };
  const v = { x: 0, y: TZ * sH };
  const screen = faceQuad('left', t1, 0.1, 0.1 + sw, sTop - sH, sTop);
  return (
    <g>
      <Box {...t2} color={shade(violet, 0.08)} r={2}>
        <Windows face="left" box={t2} cols={2} rows={5} seed={2} />
        <Windows face="right" box={t2} cols={2} rows={5} seed={5} />
      </Box>
      <Box {...t1} color={violet} r={2}>
        <Windows face="left" box={{ ...t1, h: t1.h - 1.3 }} cols={3} rows={5} seed={1} />
        <Windows face="right" box={t1} cols={3} rows={8} seed={3} />
      </Box>
      {/* antenna */}
      <line x1={project(t1.x + t1.w / 2, t1.y + t1.d / 2, t1.h).px} y1={project(t1.x + t1.w / 2, t1.y + t1.d / 2, t1.h).py} x2={project(t1.x + t1.w / 2, t1.y + t1.d / 2, t1.h + 0.6).px} y2={project(t1.x + t1.w / 2, t1.y + t1.d / 2, t1.h + 0.6).py} stroke="#C9C6FF" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={project(t1.x + t1.w / 2, t1.y + t1.d / 2, t1.h + 0.6).px} cy={project(t1.x + t1.w / 2, t1.y + t1.d / 2, t1.h + 0.6).py} r="3.5" fill="#FF8FA3" filter="url(#glow-soft)" className="blink-slow" />
      {/* screen with rotating project covers */}
      <path d={screen} fill="#0F1228" stroke="#C9C6FF" strokeWidth="1.5" />
      <clipPath id="screen-clip">
        <path d={screen} />
      </clipPath>
      <g clipPath="url(#screen-clip)">
        {covers.slice(0, 4).map((src, i) => (
          <image
            key={src}
            href={src}
            width="1"
            height="1"
            preserveAspectRatio="xMidYMid slice"
            transform={`matrix(${u.x} ${u.y} ${v.x} ${v.y} ${o.px} ${o.py})`}
            className="screen-slide"
            style={{ animationDelay: `${i * 3}s` }}
          />
        ))}
        <path d={screen} fill="url(#screen-sheen)" />
      </g>
      <Box {...t3} color={shade(violet, -0.05)} r={2}>
        <Windows face="left" box={t3} cols={4} rows={3} seed={4} />
        <Windows face="right" box={t3} cols={2} rows={3} seed={6} />
      </Box>
      <Tree x={1.25} y={0.9} s={0.9} />
      <Tree x={-1.5} y={1.1} s={0.7} />
    </g>
  );
}

const TW = 64;
const TH = 32;
const TZ = 32;

export function SkillAcademy() {
  const sky = '#42BDF5';
  const main = { x: -1.2, y: -0.55, w: 2.1, d: 1.2, h: 1.05 };
  const wing = { x: 0.9, y: -0.3, w: 0.7, d: 0.9, h: 0.7 };
  const clock = { x: -1.45, y: -1.15, w: 0.5, d: 0.5, h: 2.3 };
  const dome = isoCylinder({ cx: main.x + main.w / 2, cy: main.y + main.d / 2, z: main.h, r: 0.45, h: 0.14 });
  const domeTop = project(main.x + main.w / 2, main.y + main.d / 2, main.h + 0.14);
  const clockFace = project(clock.x + clock.w / 2, clock.y + clock.d, clock.h - 0.4);
  const clockRoof = isoRoof({ x: clock.x - 0.05, y: clock.y - 0.05, z: clock.h, w: clock.w + 0.1, d: clock.d + 0.1, h: 0.45 });
  const tipTop = project(clock.x + clock.w / 2, clock.y + clock.d / 2, clock.h + 0.45);
  return (
    <g>
      <Box {...clock} color={shade(sky, -0.05)} r={2} />
      <path d={clockRoof.left} fill={shade(sky, -0.3)} />
      <path d={clockRoof.right} fill={shade(sky, -0.48)} />
      <line x1={tipTop.px} y1={tipTop.py} x2={tipTop.px} y2={tipTop.py - 18} stroke="#E8F7FF" strokeWidth="2" />
      <circle cx={tipTop.px} cy={tipTop.py - 19} r="3" fill="#FFFFFF" filter="url(#glow-soft)" className="blink-slow" />
      {/* clock face drawn as a circle mapped onto the tower's front-left face */}
      <g transform={`matrix(${TW / 2} ${TH / 2} 0 ${-TZ} ${clockFace.px} ${clockFace.py})`}>
        <circle cx="0" cy="0" r="0.19" fill="#F3FBFF" />
        <path d="M0 0 L0 0.12 M0 0 L0.09 0" stroke="#2289B8" strokeWidth="0.035" strokeLinecap="round" fill="none" />
      </g>
      <Box {...main} color={sky} r={3}>
        <Windows face="left" box={main} cols={6} rows={2} seed={7} color="#E8F7FF" />
        <Windows face="right" box={main} cols={3} rows={2} seed={8} color="#E8F7FF" />
      </Box>
      {/* dome */}
      <path d={dome.side} fill={shade(sky, -0.2)} />
      <path
        d={`M${dome.top.cx - dome.top.rx} ${dome.top.cy} A${dome.top.rx} ${dome.top.rx * 0.95} 0 0 1 ${dome.top.cx + dome.top.rx} ${dome.top.cy} A${dome.top.rx} ${dome.top.ry} 0 0 1 ${dome.top.cx - dome.top.rx} ${dome.top.cy} Z`}
        fill="url(#dome-grad)"
      />
      <circle cx={domeTop.px} cy={domeTop.py - dome.top.rx * 0.95 - 3} r="3" fill="#E8F7FF" />
      <Box {...wing} color={shade(sky, 0.06)} r={2}>
        <Windows face="right" box={wing} cols={2} rows={1} seed={9} color="#E8F7FF" />
      </Box>
      <Tree x={1.35} y={1.0} s={0.8} />
      <Tree x={-0.9} y={1.2} s={0.75} tone="#5DBF8A" />
    </g>
  );
}

export function ExperienceTower({ floors }: { floors: number }) {
  const orange = '#FFAD5A';
  const base = { x: -0.85, y: -0.85, w: 1.5, d: 1.5, h: 0.5 };
  const tower = { x: -0.6, y: -0.6, w: 1.0, d: 1.0, h: 4.3 };
  const fh = (tower.h - 0.5) / floors;
  const roof = isoRoof({ x: tower.x - 0.08, y: tower.y - 0.08, z: tower.h + 0.5, w: tower.w + 0.16, d: tower.d + 0.16, h: 0.6 });
  const crown = { ...tower, z: tower.h, h: 0.5, x: tower.x - 0.08, y: tower.y - 0.08, w: tower.w + 0.16, d: tower.d + 0.16 };
  const flagBase = project(tower.x + tower.w / 2, tower.y + tower.d / 2, tower.h + 1.1);
  return (
    <g>
      <Box {...base} color={shade(orange, -0.15)} r={3} />
      <Box {...tower} z={0.5} h={tower.h - 0.5} color={orange} r={2}>
        {Array.from({ length: floors }, (_, i) => (
          <g key={i}>
            <path d={faceQuad('left', { ...tower, z: 0.5 }, 0, tower.w, i * fh + fh - 0.05, i * fh + fh)} fill={shade(orange, -0.32)} />
            <path d={faceQuad('right', { ...tower, z: 0.5 }, 0, tower.d, i * fh + fh - 0.05, i * fh + fh)} fill={shade(orange, -0.5)} />
            <path d={faceQuad('left', { ...tower, z: 0.5 }, 0.16, tower.w - 0.16, i * fh + 0.1, i * fh + fh - 0.14)} fill="#FFF1D6" className="win" style={{ animationDelay: `${i * 0.9}s`, animationDuration: `${8 + (i % 3)}s` }} filter="url(#glow-soft)" />
            <path d={faceQuad('right', { ...tower, z: 0.5 }, 0.2, tower.d - 0.2, i * fh + 0.1, i * fh + fh - 0.14)} fill="#FFE0B0" opacity="0.7" className="win" style={{ animationDelay: `${i * 1.3 + 0.4}s`, animationDuration: `${9 + (i % 2)}s` }} />
          </g>
        ))}
      </Box>
      <Box {...crown} color={shade(orange, -0.1)} r={2} />
      <path d={roof.left} fill={shade(orange, -0.35)} />
      <path d={roof.right} fill={shade(orange, -0.52)} />
      <line x1={flagBase.px} y1={flagBase.py} x2={flagBase.px} y2={flagBase.py - 26} stroke="#FFF1D6" strokeWidth="2" />
      <path d={`M${flagBase.px} ${flagBase.py - 26} l16 5 l-16 5 Z`} fill="#FFFFFF" className="flag-wave" />
      <Tree x={1.2} y={0.6} s={0.8} />
      <Tree x={0.7} y={1.25} s={0.6} tone="#5DBF8A" />
    </g>
  );
}

export function ExperimentLab() {
  const mint = '#79D8A0';
  const lab = { x: -1.0, y: -0.7, w: 1.7, d: 1.2, h: 1.0 };
  const annex = { x: -1.3, y: 0.55, w: 0.8, d: 0.6, h: 0.55 };
  const dishBase = project(lab.x + 1.25, lab.y + 0.35, lab.h);
  const tankA = isoCylinder({ cx: 1.15, cy: 0.35, z: 0, r: 0.26, h: 0.75 });
  const tankB = isoCylinder({ cx: 1.25, cy: 0.95, z: 0, r: 0.18, h: 0.5 });
  const flaskBase = project(0.1, 1.0, 0);
  return (
    <g>
      <Box {...lab} color={mint} r={3}>
        <Windows face="left" box={lab} cols={4} rows={2} seed={10} color="#E9FFF2" />
        <Windows face="right" box={lab} cols={3} rows={2} seed={11} color="#E9FFF2" />
      </Box>
      {/* satellite dish */}
      <line x1={dishBase.px} y1={dishBase.py} x2={dishBase.px} y2={dishBase.py - 16} stroke="#C9F2DA" strokeWidth="3" />
      <g className="dish-scan" style={{ transformOrigin: `${dishBase.px}px ${dishBase.py - 20}px` }}>
        <ellipse cx={dishBase.px} cy={dishBase.py - 22} rx="16" ry="9" fill="#F2FFF7" transform={`rotate(-28 ${dishBase.px} ${dishBase.py - 22})`} />
        <ellipse cx={dishBase.px + 1} cy={dishBase.py - 21} rx="11" ry="5" fill="#BFEBD1" transform={`rotate(-28 ${dishBase.px} ${dishBase.py - 22})`} />
        <circle cx={dishBase.px - 6} cy={dishBase.py - 30} r="2.5" fill="#FFFFFF" filter="url(#glow-soft)" />
      </g>
      <Box {...annex} color={shade(mint, -0.08)} r={2} />
      {/* tanks */}
      <path d={tankA.side} fill="url(#tank-grad)" />
      <ellipse cx={tankA.top.cx} cy={tankA.top.cy} rx={tankA.top.rx} ry={tankA.top.ry} fill="#C9F2DA" />
      <path d={tankB.side} fill="url(#tank-grad)" />
      <ellipse cx={tankB.top.cx} cy={tankB.top.cy} rx={tankB.top.rx} ry={tankB.top.ry} fill="#C9F2DA" />
      {/* flasks */}
      <g transform={`translate(${flaskBase.px} ${flaskBase.py})`}>
        <path d="M-4 -26 h8 v8 l9 14 q3 6 -3 6 h-20 q-6 0 -3 -6 l9 -14 Z" fill="#E9FFF2" opacity="0.9" />
        <path d="M-9 -8 h18 l3 4 q2 4 -2 4 h-20 q-4 0 -2 -4 Z" fill="#79D8A0" />
        <path d="M14 -18 h6 v6 q8 3 6 10 q-2 4 -9 4 q-7 0 -9 -4 q-2 -7 6 -10 Z" fill="#E9FFF2" opacity="0.9" />
        <path d="M11 -6 q2 4 9 4 q7 0 9 -4 Z" fill="#FFAD5A" />
      </g>
      {/* bubbles */}
      <g className="bubbles">
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={flaskBase.px + (i % 2 ? 4 : -2) + i} cy={flaskBase.py - 28} r={2 + (i % 3)} fill="#C9F2DA" className="bubble" style={{ animationDelay: `${i * 0.7}s` }} />
        ))}
      </g>
      <Tree x={-1.45} y={-0.9} s={0.7} tone="#5DBF8A" />
    </g>
  );
}

export function ContactPortal() {
  const base = { x: -0.95, y: -0.55, w: 1.9, d: 1.1, h: 0.28 };
  const c = project(0, 0, 1.45);
  return (
    <g>
      <Box {...base} color="#B9BEE3" r={4} />
      <Box x={-0.7} y={-0.35} z={0.28} w={1.4} d={0.7} h={0.14} color="#D9DCF2" r={3} />
      <g transform={`translate(${c.px} ${c.py})`}>
        {/* inner glow */}
        <ellipse cx="0" cy="0" rx="40" ry="52" fill="url(#portal-inner)" className="portal-breathe" filter="url(#glow-strong)" />
        {/* stone ring */}
        <ellipse cx="0" cy="0" rx="46" ry="58" fill="none" stroke="url(#portal-ring)" strokeWidth="11" />
        <ellipse cx="0" cy="0" rx="46" ry="58" fill="none" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="1.5" />
        {/* slow rotating rune ring, flattened into the ring's plane */}
        <g transform="scale(0.79 1)">
          <g className="portal-spin">
            <circle r="66" fill="none" stroke="#C9C6FF" strokeWidth="2" strokeDasharray="3 13" strokeLinecap="round" opacity="0.8" />
          </g>
        </g>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={Math.cos(i) * 22} cy={Math.sin(i * 1.7) * 30} r="1.8" fill="#FFFFFF" className="sparkle" style={{ animationDelay: `${i * 0.6}s` }} />
        ))}
      </g>
    </g>
  );
}
