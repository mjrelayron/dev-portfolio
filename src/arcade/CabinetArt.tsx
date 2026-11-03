import type { GameSlug } from './games';

/** Little attract-mode screens for each cabinet (pure SVG, decorative). */
export function CabinetArt({ slug }: { slug: GameSlug }) {
  return (
    <svg viewBox="0 0 240 140" className="cab-art" aria-hidden focusable="false">
      {slug === 'stack-builder' && <StackArt />}
      {slug === 'bug-hunter' && <BugArt />}
      {slug === 'project-explorer' && <ExplorerArt />}
      {slug === 'workflow-challenger' && <FlowArt />}
    </svg>
  );
}

function Block({ x, y, w, c, d, label }: { x: number; y: number; w: number; c: string; d: string; label: string }) {
  return (
    <g>
      <rect x={x} y={y + 3} width={w} height={16} rx={4} fill={d} />
      <rect x={x} y={y} width={w} height={16} rx={4} fill={c} />
      <text x={x + w / 2} y={y + 11.5} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#171B35" fontFamily="var(--font-mono)">
        {label}
      </text>
    </g>
  );
}

function StackArt() {
  return (
    <g>
      <rect x="0" y="10" width="240" height="6" fill="#2C3366" />
      <rect x="96" y="10" width="26" height="9" rx="2" fill="#FFAD5A" />
      <g className="cab-swing">
        <line x1="109" y1="19" x2="109" y2="38" stroke="#C4C8E8" strokeWidth="1.5" />
        <Block x={84} y={38} w={50} c="#79D8A0" d="#4AA874" label="Vite" />
      </g>
      <Block x={92} y={66} w={58} c="#42BDF5" d="#2289B8" label="Node.js" />
      <Block x={78} y={85} w={66} c="#6C63FF" d="#4A42C7" label="TypeScript" />
      <Block x={86} y={104} w={60} c="#FFAD5A" d="#D9823A" label="React" />
      <path d="M50 124 h140 l-8 10 h-124 z" fill="#4AA874" />
      <rect x="50" y="122" width="140" height="4" rx="2" fill="#79D8A0" />
    </g>
  );
}

function BugArt() {
  const rows = [52, 38, 64, 30, 46, 58];
  return (
    <g fontFamily="var(--font-mono)">
      {rows.map((w, i) => (
        <g key={i}>
          <text x="22" y={30 + i * 17} fontSize="8" fill="#959BC7">
            {i + 1}
          </text>
          {i === 3 && <rect x="34" y={20 + i * 17} width="180" height="14" rx="4" fill="rgba(255,122,138,0.18)" stroke="#FF7A8A" strokeWidth="1" />}
          <rect x="40" y={24 + i * 17} width={w} height="6" rx="3" fill={i === 3 ? '#FF7A8A' : '#42BDF5'} opacity={i === 3 ? 1 : 0.75} />
          <rect x={46 + w} y={24 + i * 17} width={w * 0.8} height="6" rx="3" fill="#C4C8E8" opacity="0.35" />
        </g>
      ))}
      <g transform="translate(190 82)">
        <g className="cab-bob">
        <ellipse cx="0" cy="0" rx="11" ry="13" fill="#79D8A0" />
        <circle cx="0" cy="-14" r="6" fill="#4AA874" />
        <path d="M-11 -4 l-7 -4 M-11 4 l-8 0 M-10 10 l-6 5 M11 -4 l7 -4 M11 4 l8 0 M10 10 l6 5" stroke="#4AA874" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="-12" x2="0" y2="12" stroke="#4AA874" strokeWidth="1.5" />
        </g>
      </g>
    </g>
  );
}

function ExplorerArt() {
  const pins = [
    [60, 50, '#42BDF5'],
    [120, 34, '#FFAD5A'],
    [178, 62, '#79D8A0'],
    [92, 98, '#C4C8E8'],
  ] as const;
  return (
    <g>
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`h${i}`} x1="14" x2="226" y1={20 + i * 20} y2={20 + i * 20} stroke="#2C3366" strokeWidth="1" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line key={`v${i}`} y1="14" y2="126" x1={20 + i * 20} x2={20 + i * 20} stroke="#2C3366" strokeWidth="1" />
      ))}
      <path d="M60 50 C 90 40, 100 36, 120 34 S 160 60, 178 62 S 120 100, 92 98" fill="none" stroke="#9A94FF" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
      {pins.map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M0 0 c -7 -9 -9 -12 -9 -16 a 9 9 0 0 1 18 0 c 0 4 -2 7 -9 16 z" fill={c} />
          <circle cx="0" cy="-16" r="3.2" fill="#171B35" />
        </g>
      ))}
      <g transform="translate(178 104)">
        <g className="cab-bob">
        <circle r="15" fill="#171B35" stroke="#9A94FF" strokeWidth="2" />
        <path d="M0 -10 L4 0 L0 10 L-4 0 Z" fill="#FFAD5A" />
        <circle r="2" fill="#fff" />
        </g>
      </g>
    </g>
  );
}

function FlowArt() {
  const nodes = [
    [34, 70, '#42BDF5'],
    [96, 40, '#9A94FF'],
    [96, 100, '#FFAD5A'],
    [158, 70, '#79D8A0'],
    [212, 70, '#FFFFFF'],
  ] as const;
  return (
    <g>
      <path d="M50 70 C 70 70, 70 40, 80 40 M50 70 C 70 70, 70 100, 80 100 M112 40 C 130 40, 132 70, 142 70 M112 100 C 130 100, 132 70, 142 70 M174 70 L196 70" fill="none" stroke="#5B63A6" strokeWidth="2" />
      <circle cx="131" cy="55" r="3.5" fill="#85D6FA" className="cab-pulse" />
      <circle cx="65" cy="85" r="3.5" fill="#FFC994" className="cab-pulse cab-pulse--late" />
      {nodes.map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect x="-16" y="-13" width="32" height="30" rx="8" fill="#121630" />
          <rect x="-16" y="-16" width="32" height="30" rx="8" fill={c} />
          <rect x="-8" y="-5" width="16" height="3" rx="1.5" fill="#171B35" opacity="0.6" />
          <rect x="-8" y="1" width="10" height="3" rx="1.5" fill="#171B35" opacity="0.4" />
        </g>
      ))}
    </g>
  );
}
