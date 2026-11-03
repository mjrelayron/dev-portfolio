export type DevBotState = 'idle' | 'wave' | 'point' | 'celebrate' | 'think' | 'talk';
export interface LookAt {
  x: number; // -100..100
  y: number; // -100..100
}
export type DevBotSize = 'xs' | 'sm' | 'md' | 'lg';
export const sizePx: Record<DevBotSize, number> = { xs: 32, sm: 48, md: 96, lg: 180 };
