import { useCallback } from 'react';
import { useSettings } from '../store/useSettings';

export type SoundName = 'tick' | 'pop' | 'whoosh' | 'chime';

// All sounds are synthesized with the Web Audio API: no files to download,
// nothing loads until sound is switched on and something is clicked.
let ctx: AudioContext | null = null;
let ambient: { stop: () => void } | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(ac: AudioContext, { freq, to, dur, type = 'sine', gain = 0.15, delay = 0 }: { freq: number; to?: number; dur: number; type?: OscillatorType; gain?: number; delay?: number }) {
  const t = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function noiseSweep(ac: AudioContext, dur: number) {
  const len = Math.floor(ac.sampleRate * dur);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(300, ac.currentTime);
  filter.frequency.exponentialRampToValueAtTime(2400, ac.currentTime + dur);
  const g = ac.createGain();
  g.gain.value = 0.12;
  src.connect(filter).connect(g).connect(ac.destination);
  src.start();
}

const recipes: Record<SoundName, (ac: AudioContext) => void> = {
  tick: (ac) => tone(ac, { freq: 1800, dur: 0.03, type: 'square', gain: 0.03 }),
  pop: (ac) => tone(ac, { freq: 420, to: 900, dur: 0.09, type: 'triangle', gain: 0.14 }),
  whoosh: (ac) => noiseSweep(ac, 0.45),
  chime: (ac) => {
    tone(ac, { freq: 784, dur: 0.5, gain: 0.1 });
    tone(ac, { freq: 1175, dur: 0.6, gain: 0.08, delay: 0.09 });
    tone(ac, { freq: 1568, dur: 0.7, gain: 0.06, delay: 0.18 });
  },
};

export function playSound(name: SoundName) {
  if (!useSettings.getState().sound) return;
  const ac = audio();
  if (ac) recipes[name](ac);
}

/** Quiet two-oscillator pad; started/stopped with the sound toggle. */
export function setAmbient(on: boolean) {
  if (!on) {
    ambient?.stop();
    ambient = null;
    return;
  }
  const ac = audio();
  if (!ac || ambient) return;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.02, ac.currentTime + 2);
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 600;
  const oscs = [110, 164.8, 220.5].map((f) => {
    const o = ac.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    o.connect(filter);
    o.start();
    return o;
  });
  filter.connect(g).connect(ac.destination);
  ambient = {
    stop: () => {
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.6);
      oscs.forEach((o) => o.stop(ac.currentTime + 0.7));
    },
  };
}

export function useSound() {
  return useCallback((name: SoundName) => playSound(name), []);
}
