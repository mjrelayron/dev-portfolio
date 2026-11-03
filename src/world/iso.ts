// 2:1 isometric projection helpers. Every island and building on the hub is
// composed from these primitives so it stays recolorable and crisp at any size.

export const TILE_W = 64;
export const TILE_H = 32;
export const TILE_Z = 32;

export interface Point {
  px: number;
  py: number;
}

export interface FaceColors {
  top: string;
  left: string;
  right: string;
}

export function project(x: number, y: number, z = 0): Point {
  return {
    px: ((x - y) * TILE_W) / 2,
    py: ((x + y) * TILE_H) / 2 - z * TILE_Z,
  };
}

const fmt = (n: number) => Math.round(n * 100) / 100;

function poly(points: Point[]): string {
  return `M${points.map((p) => `${fmt(p.px)} ${fmt(p.py)}`).join(' L')} Z`;
}

/** Polygon path with rounded corners (quadratic joins). */
function roundedPoly(points: Point[], radius: number): string {
  if (radius <= 0) return poly(points);
  const n = points.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const cur = points[i];
    const next = points[(i + 1) % n];
    const v1 = { x: prev.px - cur.px, y: prev.py - cur.py };
    const v2 = { x: next.px - cur.px, y: next.py - cur.py };
    const l1 = Math.hypot(v1.x, v1.y) || 1;
    const l2 = Math.hypot(v2.x, v2.y) || 1;
    const r = Math.min(radius, l1 / 2, l2 / 2);
    const a = { x: cur.px + (v1.x / l1) * r, y: cur.py + (v1.y / l1) * r };
    const b = { x: cur.px + (v2.x / l2) * r, y: cur.py + (v2.y / l2) * r };
    d += `${i === 0 ? 'M' : 'L'}${fmt(a.x)} ${fmt(a.y)} Q${fmt(cur.px)} ${fmt(cur.py)} ${fmt(b.x)} ${fmt(b.y)} `;
  }
  return `${d}Z`;
}

export interface IsoBoxInput {
  x: number;
  y: number;
  z?: number;
  w: number;
  d: number;
  h: number;
  radius?: number;
}

export interface IsoFaces {
  top: string;
  left: string;
  right: string;
}

/** Box occupying [x, x+w] × [y, y+d] × [z, z+h]. Returns the three visible faces. */
export function isoBox({ x, y, z = 0, w, d, h, radius = 0 }: IsoBoxInput): IsoFaces {
  const t = z + h;
  const p = (xx: number, yy: number, zz: number) => project(xx, yy, zz);
  return {
    top: roundedPoly([p(x, y, t), p(x + w, y, t), p(x + w, y + d, t), p(x, y + d, t)], radius),
    // left face is the one facing +y (front-left on screen)
    left: roundedPoly([p(x, y + d, t), p(x + w, y + d, t), p(x + w, y + d, z), p(x, y + d, z)], radius * 0.5),
    // right face is the one facing +x (front-right on screen)
    right: roundedPoly([p(x + w, y, t), p(x + w, y + d, t), p(x + w, y + d, z), p(x + w, y, z)], radius * 0.5),
  };
}

export interface IsoCylinderInput {
  cx: number;
  cy: number;
  z?: number;
  r: number;
  h: number;
}

export interface IsoCylinder {
  top: { cx: number; cy: number; rx: number; ry: number };
  /** Body path; fill with a left→right gradient for shading. */
  side: string;
}

export function isoCylinder({ cx, cy, z = 0, r, h }: IsoCylinderInput): IsoCylinder {
  const c = project(cx, cy, z + h);
  const b = project(cx, cy, z);
  // a circle of radius r on the ground plane projects to an ellipse
  const rx = (r * TILE_W) / Math.SQRT2;
  const ry = (r * TILE_H) / Math.SQRT2;
  const side = `M${fmt(c.px - rx)} ${fmt(c.py)} L${fmt(b.px - rx)} ${fmt(b.py)} A${fmt(rx)} ${fmt(ry)} 0 0 0 ${fmt(
    b.px + rx,
  )} ${fmt(b.py)} L${fmt(c.px + rx)} ${fmt(c.py)} A${fmt(rx)} ${fmt(ry)} 0 0 1 ${fmt(c.px - rx)} ${fmt(c.py)} Z`;
  return { top: { cx: c.px, cy: c.py, rx, ry }, side };
}

export interface IsoRoofInput {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
}

/** Pyramid roof. Returns the two visible sloped faces. */
export function isoRoof({ x, y, z, w, d, h }: IsoRoofInput): { left: string; right: string } {
  const apex = project(x + w / 2, y + d / 2, z + h);
  return {
    left: poly([project(x, y + d, z), project(x + w, y + d, z), apex]),
    right: poly([project(x + w, y, z), project(x + w, y + d, z), apex]),
  };
}

/** Cone (trees, spires) — a triangle with a projected ellipse base. */
export function isoCone({ cx, cy, z = 0, r, h }: IsoCylinderInput): { left: string; right: string; base: Point } {
  const base = project(cx, cy, z);
  const apex = project(cx, cy, z + h);
  const rx = (r * TILE_W) / Math.SQRT2;
  const ry = (r * TILE_H) / Math.SQRT2;
  const left = `M${fmt(apex.px)} ${fmt(apex.py)} L${fmt(base.px - rx)} ${fmt(base.py)} A${fmt(rx)} ${fmt(ry)} 0 0 0 ${fmt(
    base.px,
  )} ${fmt(base.py + ry)} Z`;
  const right = `M${fmt(apex.px)} ${fmt(apex.py)} L${fmt(base.px)} ${fmt(base.py + ry)} A${fmt(rx)} ${fmt(ry)} 0 0 0 ${fmt(
    base.px + rx,
  )} ${fmt(base.py)} Z`;
  return { left, right, base };
}

/**
 * Floating island: a rounded grass slab whose rocky underside tapers to a point.
 * Size is in tiles; returns grass top, grass lip, and two rock faces.
 */
export function isoIsland({ x, y, z = 0, w, d, depth = 2.4 }: { x: number; y: number; z?: number; w: number; d: number; depth?: number }) {
  const lip = 0.22;
  const box = isoBox({ x, y, z: z - lip, w, d, h: lip, radius: 10 });
  const cx = x + w / 2;
  const cy = y + d / 2;
  const tip = project(cx + 0.15, cy + 0.15, z - lip - depth);
  const fl = project(x, y + d, z - lip);
  const fm = project(x + w, y + d, z - lip);
  const fr = project(x + w, y, z - lip);
  const mid = (a: Point, b: Point, t: number) => ({ px: a.px + (b.px - a.px) * t, py: a.py + (b.py - a.py) * t });
  // rough, chunky facets so the underside reads as rock
  const leftRock = [fl, mid(fl, fm, 0.45), { px: mid(fl, fm, 0.45).px + 4, py: mid(fl, fm, 0.45).py + depth * TILE_Z * 0.45 }, tip, {
    px: fl.px + (tip.px - fl.px) * 0.35,
    py: fl.py + (tip.py - fl.py) * 0.5,
  }];
  const rightRock = [fm, fr, { px: fr.px + (tip.px - fr.px) * 0.35, py: fr.py + (tip.py - fr.py) * 0.5 }, tip, {
    px: mid(fl, fm, 0.45).px + 4,
    py: mid(fl, fm, 0.45).py + depth * TILE_Z * 0.45,
  }, mid(fl, fm, 0.45)];
  return {
    top: box.top,
    lipLeft: box.left,
    lipRight: box.right,
    rockLeft: roundedPoly(leftRock, 4),
    rockRight: roundedPoly(rightRock, 4),
    tip,
    center: project(cx, cy, z),
  };
}

/** Mix a hex color toward white (amt > 0) or black (amt < 0). */
export function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const target = amt > 0 ? 255 : 0;
  const t = Math.abs(amt);
  r = Math.round(r + (target - r) * t);
  g = Math.round(g + (target - g) * t);
  b = Math.round(b + (target - b) * t);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export function faces(base: string): FaceColors {
  return { top: shade(base, 0.28), left: base, right: shade(base, -0.28) };
}
