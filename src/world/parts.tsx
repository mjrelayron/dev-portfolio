import type { ReactNode, SVGProps } from 'react';
import { isoBox, isoCone, isoCylinder, isoIsland, faces, project, shade, TILE_W, TILE_H } from './iso';

const fmt = (n: number) => Math.round(n * 100) / 100;

export function Box({ x, y, z = 0, w, d, h, color, r = 3, className, children }: { x: number; y: number; z?: number; w: number; d: number; h: number; color: string; r?: number; className?: string; children?: ReactNode }) {
  const f = isoBox({ x, y, z, w, d, h, radius: r });
  const c = faces(color);
  return (
    <g className={className}>
      <path d={f.left} fill={c.left} />
      <path d={f.right} fill={c.right} />
      <path d={f.top} fill={c.top} />
      {children}
    </g>
  );
}

/** Quad on a box face. face 'left' = the +y face (front-left), 'right' = the +x face. u along the face, v up. */
export function faceQuad(face: 'left' | 'right', b: { x: number; y: number; z?: number; w: number; d: number }, u0: number, u1: number, v0: number, v1: number) {
  const z = b.z ?? 0;
  const pts =
    face === 'left'
      ? [project(b.x + u0, b.y + b.d, z + v1), project(b.x + u1, b.y + b.d, z + v1), project(b.x + u1, b.y + b.d, z + v0), project(b.x + u0, b.y + b.d, z + v0)]
      : [project(b.x + b.w, b.y + u0, z + v1), project(b.x + b.w, b.y + u1, z + v1), project(b.x + b.w, b.y + u1, z + v0), project(b.x + b.w, b.y + u0, z + v0)];
  return `M${pts.map((p) => `${fmt(p.px)} ${fmt(p.py)}`).join(' L')} Z`;
}

/** Grid of lit windows on a face; each flickers on with its own delay. */
export function Windows({ face, box, cols, rows, pad = 0.14, gap = 0.1, color = '#FFE7B0', seed = 1 }: { face: 'left' | 'right'; box: { x: number; y: number; z?: number; w: number; d: number; h: number }; cols: number; rows: number; pad?: number; gap?: number; color?: string; seed?: number }) {
  const span = face === 'left' ? box.w : box.d;
  const cw = (span - pad * 2 - gap * (cols - 1)) / cols;
  const rh = (box.h - pad * 2 - gap * (rows - 1)) / rows;
  const out: ReactNode[] = [];
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const u0 = pad + c * (cw + gap);
      const v0 = pad + r * (rh + gap);
      const k = (i * 7 + seed * 13) % 11;
      out.push(
        <path
          key={i}
          d={faceQuad(face, box, u0, u0 + cw, v0, v0 + rh)}
          fill={color}
          className="win"
          style={{ animationDelay: `${(k * 0.83).toFixed(2)}s`, animationDuration: `${7 + (k % 4)}s`, opacity: face === 'right' ? 0.75 : 0.95 }}
        />,
      );
      i++;
    }
  }
  return <g filter="url(#glow-soft)">{out}</g>;
}

export function Tree({ x, y, z = 0, s = 1, tone = '#4AA874' }: { x: number; y: number; z?: number; s?: number; tone?: string }) {
  const trunk = isoCylinder({ cx: x, cy: y, z, r: 0.06 * s, h: 0.22 * s });
  const c1 = isoCone({ cx: x, cy: y, z: z + 0.18 * s, r: 0.32 * s, h: 0.55 * s });
  const c2 = isoCone({ cx: x, cy: y, z: z + 0.45 * s, r: 0.24 * s, h: 0.45 * s });
  return (
    <g>
      <path d={trunk.side} fill="#7A5236" />
      <path d={c1.left} fill={tone} />
      <path d={c1.right} fill={shade(tone, -0.25)} />
      <path d={c2.left} fill={shade(tone, 0.14)} />
      <path d={c2.right} fill={shade(tone, -0.12)} />
    </g>
  );
}

export function Rock({ x, y, z = 0, s = 1 }: { x: number; y: number; z?: number; s?: number }) {
  return <Box x={x} y={y} z={z} w={0.32 * s} d={0.26 * s} h={0.16 * s} color="#8D93B8" r={3} />;
}

/** Grass-topped floating island with a rocky, tapering underside. */
export function Island({ w, d, depth = 2.4, grass = '#79D8A0', rock = '#5B5F8F', waterfall, children }: { w: number; d: number; depth?: number; grass?: string; rock?: string; waterfall?: boolean; children?: ReactNode }) {
  const isl = isoIsland({ x: -w / 2, y: -d / 2, w, d, depth });
  const wf = waterfall ? project(w / 2 - 0.4, d / 2, -0.1) : null;
  return (
    <g>
      {/* soft shadow far below */}
      <ellipse cx={0} cy={isl.tip.py + 26} rx={(w + d) * TILE_W * 0.17} ry={(w + d) * TILE_H * 0.1} fill="url(#isl-shadow)" className="isl-shadow" />
      <path d={isl.rockLeft} fill={rock} />
      <path d={isl.rockRight} fill={shade(rock, -0.3)} />
      <path d={isl.lipLeft} fill={shade(grass, -0.18)} />
      <path d={isl.lipRight} fill={shade(grass, -0.38)} />
      <path d={isl.top} fill={grass} />
      <path d={isl.top} fill="url(#grass-sheen)" opacity="0.5" />
      {wf && (
        <g className="waterfall">
          <path d={`M${fmt(wf.px)} ${fmt(wf.py)} q4 30 2 ${depth * 28} q-2 20 3 40`} stroke="#9FE3FF" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d={`M${fmt(wf.px)} ${fmt(wf.py)} q4 30 2 ${depth * 28} q-2 20 3 40`} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 14" fill="none" className="waterfall__flow" />
        </g>
      )}
      {children}
    </g>
  );
}

export function Cloud({ x, y, s = 1, opacity = 0.18, ...rest }: { x: number; y: number; s?: number; opacity?: number } & SVGProps<SVGGElement>) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} {...rest}>
      <g className="cloud-drift">
        <ellipse cx="0" cy="0" rx="46" ry="16" fill="#FFFFFF" />
        <ellipse cx="-22" cy="-8" rx="22" ry="16" fill="#FFFFFF" />
        <ellipse cx="14" cy="-12" rx="26" ry="19" fill="#FFFFFF" />
      </g>
    </g>
  );
}
