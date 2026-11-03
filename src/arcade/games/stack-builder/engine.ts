// Stack Builder simulation + canvas renderer. Loaded only in the browser
// (the component imports this module inside an effect, matter-js with it).
import Matter from 'matter-js';

export const WORLD_W = 420;
export const WORLD_H = 640;
const BASE_TOP = 556;
const BASE_W = 216;
const BLOCK_H = 34;
const HOOK_DROP = 112; // block centre below the camera top
const STEP = 1000 / 60;

const PALETTE = [
  ['#6C63FF', '#4A42C7', '#FFFFFF'],
  ['#42BDF5', '#2289B8', '#171B35'],
  ['#FFAD5A', '#D9823A', '#171B35'],
  ['#79D8A0', '#4AA874', '#171B35'],
  ['#FFCF6B', '#D9A23A', '#171B35'],
  ['#C9CCEC', '#959BC7', '#171B35'],
] as const;

interface BlockInfo {
  label: string;
  w: number;
  color: (typeof PALETTE)[number];
}

export interface EngineEvents {
  onScore: (floors: number) => void;
  onOver: (floors: number) => void;
}

export interface StackEngine {
  drop: () => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  resize: (cssW: number, cssH: number, dpr: number) => void;
  destroy: () => void;
}

const blockWidth = (label: string) => Math.round(Math.min(164, Math.max(84, label.length * 7.6 + 30)));

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawBlock(ctx: CanvasRenderingContext2D, b: BlockInfo, alpha = 1) {
  const [face, edge, ink] = b.color;
  const w = b.w;
  const h = BLOCK_H;
  ctx.globalAlpha = alpha;
  // physical bottom edge
  ctx.fillStyle = edge;
  roundRect(ctx, -w / 2, -h / 2 + 4, w, h - 4, 8);
  ctx.fill();
  ctx.fillStyle = face;
  roundRect(ctx, -w / 2, -h / 2, w, h - 5, 8);
  ctx.fill();
  // inner top highlight
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  roundRect(ctx, -w / 2 + 6, -h / 2 + 3, w - 12, 3, 1.5);
  ctx.fill();
  ctx.fillStyle = ink;
  ctx.font = '700 12px "JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(b.label, 0, -2.5, w - 14);
  ctx.globalAlpha = 1;
}

export function createStackEngine(canvas: HTMLCanvasElement, labels: string[], events: EngineEvents, opts: { reduced: boolean }): StackEngine {
  const { Engine, Bodies, Composite, Body, Events } = Matter;
  const ctx = canvas.getContext('2d')!;
  const engine = Engine.create({ enableSleeping: true, positionIterations: 10, velocityIterations: 8 });
  engine.gravity.y = 1;
  const world = engine.world;

  let scale = 1;
  let dpr = 1;
  let raf = 0;
  let running = false;
  let over = false;
  let last = 0;
  let acc = 0;
  let t = 0;
  let camY = 0;
  let shake = 0;
  let score = 0;
  let labelIdx = 0;
  let next: BlockInfo;
  let falling: Matter.Body | null = null;
  let fallingSince = 0;
  let hookReadyAt = 0;
  const info = new Map<number, BlockInfo>();
  const stars = Array.from({ length: 46 }, (_, i) => ({ x: (i * 97.3) % WORLD_W, y: ((i * 211.7) % 1400) - 700, r: 0.6 + ((i * 7) % 10) / 10 }));

  const base = Bodies.rectangle(WORLD_W / 2, BASE_TOP + 20, BASE_W, 40, { isStatic: true, friction: 1, chamfer: { radius: 4 } });

  const newBlock = (): BlockInfo => {
    const label = labels[labelIdx % labels.length];
    const color = PALETTE[labelIdx % PALETTE.length];
    labelIdx++;
    return { label, w: blockWidth(label), color };
  };

  function reset() {
    Composite.clear(world, false);
    Composite.add(world, base);
    info.clear();
    t = 0;
    camY = 0;
    shake = 0;
    score = 0;
    labelIdx = 0;
    falling = null;
    over = false;
    hookReadyAt = 0;
    next = newBlock();
  }
  reset();

  const amp = () => 92 + Math.min(score * 4, 70);
  const omega = () => 1.5 + Math.min(score * 0.06, 1.3);
  const hookX = () => WORLD_W / 2 + amp() * Math.sin(t * omega());
  const hookVx = () => amp() * omega() * Math.cos(t * omega()); // px/s

  Events.on(engine, 'collisionStart', (e) => {
    if (!falling) return;
    for (const p of e.pairs) {
      if (p.bodyA === falling || p.bodyB === falling) {
        if (!opts.reduced) shake = Math.min(7, 3 + Math.abs(falling.velocity.y) * 0.6);
        break;
      }
    }
  });

  function blocks() {
    return Composite.allBodies(world).filter((b) => b !== base);
  }

  function update(now: number) {
    t += STEP / 1000;
    Engine.update(engine, STEP);
    const all = blocks();
    // fell off the island?
    if (all.some((b) => b.position.y > BASE_TOP + 70)) {
      over = true;
      running = false;
      events.onOver(score);
      return;
    }
    // landed?
    if (falling) {
      const settled = falling.speed < 0.35 && now - fallingSince > 450;
      if (settled || now - fallingSince > 2600) {
        falling = null;
        hookReadyAt = now + 220;
        next = newBlock();
      }
    }
    // height from settled blocks
    const resting = all.filter((b) => b !== falling && b.speed < 1.2);
    if (resting.length) {
      const top = Math.min(...resting.map((b) => b.bounds.min.y));
      const floors = Math.max(0, Math.round((BASE_TOP - top) / (BLOCK_H - 3)));
      if (floors > score) {
        score = floors;
        events.onScore(score);
      }
    }
  }

  function topOfStack() {
    const all = blocks().filter((b) => b !== falling);
    return all.length ? Math.min(...all.map((b) => b.bounds.min.y)) : BASE_TOP;
  }

  function render(now: number) {
    const target = Math.min(0, topOfStack() - 340);
    camY += (target - camY) * 0.06;
    const sx = shake ? (Math.random() - 0.5) * shake : 0;
    const sy = shake ? (Math.random() - 0.5) * shake : 0;
    shake = shake > 0.2 ? shake * 0.86 : 0;

    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    // sky
    const g = ctx.createLinearGradient(0, 0, 0, WORLD_H);
    g.addColorStop(0, '#11142B');
    g.addColorStop(0.6, '#171B35');
    g.addColorStop(1, '#241F45');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    for (const s of stars) {
      const y = (((s.y - camY * 0.25) % 1400) + 1400) % 1400 - 380;
      if (y < -4 || y > WORLD_H) continue;
      ctx.beginPath();
      ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(sx, -camY + sy);

    // height markers every 5 floors
    ctx.font = '600 10px "JetBrains Mono Variable", ui-monospace, monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let f = 5; f < 400; f += 5) {
      const y = BASE_TOP - f * (BLOCK_H - 3);
      if (y < camY - 20) break;
      if (y > camY + WORLD_H) continue;
      ctx.fillStyle = f <= score ? 'rgba(255,207,107,0.9)' : 'rgba(149,155,199,0.55)';
      ctx.fillRect(WORLD_W - 26, y, 14, 1.5);
      ctx.fillText(String(f), WORLD_W - 30, y);
    }

    // island
    ctx.fillStyle = '#3B2F5C';
    ctx.beginPath();
    ctx.moveTo(WORLD_W / 2 - BASE_W / 2 + 6, BASE_TOP + 22);
    ctx.lineTo(WORLD_W / 2 + BASE_W / 2 - 6, BASE_TOP + 22);
    ctx.lineTo(WORLD_W / 2 + 34, BASE_TOP + 110);
    ctx.lineTo(WORLD_W / 2 - 40, BASE_TOP + 96);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#4AA874';
    roundRect(ctx, WORLD_W / 2 - BASE_W / 2, BASE_TOP + 4, BASE_W, 26, 8);
    ctx.fill();
    ctx.fillStyle = '#79D8A0';
    roundRect(ctx, WORLD_W / 2 - BASE_W / 2, BASE_TOP, BASE_W, 14, 7);
    ctx.fill();

    // bodies
    for (const b of blocks()) {
      const bi = info.get(b.id);
      if (!bi) continue;
      ctx.save();
      ctx.translate(b.position.x, b.position.y);
      ctx.rotate(b.angle);
      drawBlock(ctx, bi);
      ctx.restore();
    }

    // crane (screen space at the camera top)
    const hx = hookX();
    const top = camY;
    ctx.fillStyle = '#2C3366';
    ctx.fillRect(-10, top, WORLD_W + 20, 16);
    ctx.fillStyle = '#222850';
    ctx.fillRect(-10, top + 16, WORLD_W + 20, 3);
    ctx.fillStyle = '#FFAD5A';
    roundRect(ctx, hx - 16, top + 6, 32, 16, 4);
    ctx.fill();
    ctx.fillStyle = '#D9823A';
    ctx.fillRect(hx - 16, top + 18, 32, 4);
    const ready = !falling && running && now >= hookReadyAt;
    ctx.strokeStyle = '#C4C8E8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(hx, top + 22);
    ctx.lineTo(hx, top + HOOK_DROP - BLOCK_H / 2 - (ready || !running ? 0 : 26));
    ctx.stroke();
    if (ready || (!running && !over)) {
      // aim guide
      ctx.setLineDash([2, 7]);
      ctx.strokeStyle = 'rgba(196,200,232,0.25)';
      ctx.beginPath();
      ctx.moveTo(hx, top + HOOK_DROP + BLOCK_H / 2 + 4);
      ctx.lineTo(hx, topOfStack() - 6);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.save();
      ctx.translate(hx, top + HOOK_DROP);
      drawBlock(ctx, next);
      ctx.restore();
    }
    ctx.restore();
  }

  function frame(now: number) {
    if (!running) return;
    if (!last) last = now;
    acc += Math.min(100, now - last);
    last = now;
    let n = 0;
    while (acc >= STEP && n < 5 && running) {
      update(now);
      acc -= STEP;
      n++;
    }
    render(now);
    if (running) raf = requestAnimationFrame(frame);
  }

  function loop() {
    cancelAnimationFrame(raf);
    last = 0;
    acc = 0;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  return {
    start() {
      reset();
      loop();
    },
    drop() {
      const now = performance.now();
      if (!running || falling || now < hookReadyAt) return;
      const x = hookX();
      const body = Bodies.rectangle(x, camY + HOOK_DROP, next.w, BLOCK_H - 3, {
        chamfer: { radius: 6 },
        friction: 0.9,
        frictionStatic: 1.4,
        frictionAir: 0.012,
        restitution: 0,
        density: 0.0024,
        slop: 0.02,
      });
      Body.setVelocity(body, { x: (hookVx() / 60) * 0.45, y: 0.8 });
      info.set(body.id, next);
      Composite.add(world, body);
      falling = body;
      fallingSince = now;
    },
    pause() {
      running = false;
      cancelAnimationFrame(raf);
    },
    resume() {
      if (over) return;
      loop();
    },
    resize(cssW, cssH, ratio) {
      dpr = ratio;
      scale = cssW / WORLD_W;
      canvas.width = Math.round(cssW * ratio);
      canvas.height = Math.round(cssH * ratio);
      render(performance.now());
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      Events.off(engine, 'collisionStart');
      Composite.clear(world, false);
      Engine.clear(engine);
    },
  };
}
