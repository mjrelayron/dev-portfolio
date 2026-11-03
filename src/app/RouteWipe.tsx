import { motion } from 'framer-motion';
import { accentVar, type Accent } from '../data/destinations';

/** Diagonal colour wipe (~420 ms) in the destination accent. */
export function RouteWipe({ accent, onDone }: { accent: string; onDone: () => void }) {
  const color = accentVar[accent as Accent] ?? accentVar.violet;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-y-[-20vh] left-0 z-[95] w-[300vw]"
      style={{ background: `linear-gradient(100deg, ${color} 0%, ${color} 90%, transparent 90%)`, skewX: -14 }}
      initial={{ x: '-310vw' }}
      animate={{ x: ['-310vw', '-120vw', '110vw'] }}
      transition={{ duration: 0.42, times: [0, 0.5, 1], ease: [0.65, 0, 0.35, 1] }}
      onAnimationComplete={onDone}
    />
  );
}
