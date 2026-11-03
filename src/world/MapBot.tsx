import { useEffect, useState } from 'react';
import { DevBotSvg } from '../mascot/DevBotSvg';
import { DevBot } from '../mascot/DevBot';
import { riveAvailable } from '../mascot/riveAvailability';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { project } from './iso';
import type { LookAt } from '../mascot/types';

/**
 * DEV-BOT floating over the Central Hub. Drawn as nested SVG so it scales with
 * the camera; when the Rive file exists it switches to the shared <DevBot>
 * inside a foreignObject.
 */
export function MapBot({ look, pointing }: { look?: LookAt; pointing: boolean }) {
  const reduced = useReducedMotion();
  const [rive, setRive] = useState(false);
  useEffect(() => {
    if (!reduced) riveAvailable().then(setRive);
  }, [reduced]);
  const p = project(0, 0, 2.6);
  const size = 78;
  const state = pointing ? 'point' : 'idle';
  if (rive) {
    return (
      <foreignObject x={p.px - size / 2} y={p.py - size} width={size} height={size * 1.1} style={{ overflow: 'visible', pointerEvents: 'none' }}>
        <DevBot size="md" state={state} lookAt={look} />
      </foreignObject>
    );
  }
  return (
    <g transform={`translate(${p.px - size / 2} ${p.py - size})`} style={{ pointerEvents: 'none' }}>
      <DevBotSvg px={size} state={state} lookAt={look} reduced={reduced} />
    </g>
  );
}
