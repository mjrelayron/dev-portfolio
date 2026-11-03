// GSAP is only needed once the camera moves or the intro plays, so it loads on demand.
let p: Promise<typeof import('gsap').gsap> | null = null;
export const loadGsap = () => (p ??= import('gsap').then((m) => m.gsap));
