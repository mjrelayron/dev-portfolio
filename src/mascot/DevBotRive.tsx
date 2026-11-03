import { useEffect } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import type { DevBotState, LookAt } from './types';
import { RIVE_SRC } from './riveAvailability';

const SM = 'Main';

/** Rive-driven DEV-BOT. Contract documented in docs/DEVBOT_RIVE_SPEC.md. */
export default function DevBotRive({ state, lookAt, px, onError }: { state: DevBotState; lookAt?: LookAt; px: number; onError: () => void }) {
  const { rive, RiveComponent } = useRive({
    src: RIVE_SRC,
    artboard: 'DevBot',
    stateMachines: SM,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: onError,
  });

  const wave = useStateMachineInput(rive, SM, 'wave');
  const celebrate = useStateMachineInput(rive, SM, 'celebrate');
  const point = useStateMachineInput(rive, SM, 'point');
  const think = useStateMachineInput(rive, SM, 'think');
  const talk = useStateMachineInput(rive, SM, 'talk');
  const lookX = useStateMachineInput(rive, SM, 'lookX');
  const lookY = useStateMachineInput(rive, SM, 'lookY');

  useEffect(() => {
    if (think) think.value = state === 'think';
    if (talk) talk.value = state === 'talk';
    if (state === 'wave') wave?.fire();
    if (state === 'celebrate') celebrate?.fire();
    if (state === 'point') point?.fire();
  }, [state, wave, celebrate, point, think, talk]);

  useEffect(() => {
    if (lookX) lookX.value = lookAt?.x ?? 0;
    if (lookY) lookY.value = lookAt?.y ?? 0;
  }, [lookAt?.x, lookAt?.y, lookX, lookY]);

  return <RiveComponent style={{ width: px, height: px }} aria-hidden="true" />;
}
