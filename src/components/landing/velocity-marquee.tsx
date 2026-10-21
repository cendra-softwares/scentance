"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

/** Giant type that drifts on its own and surges, or reverses, with scroll speed. */
export function VelocityMarquee() {
  return (
    <section aria-hidden className="relative overflow-hidden border-y border-white/[0.06] py-10 sm:py-16">
      <MarqueeRow baseVelocity={-2.2}>
        <span className="text-outline font-display">Scent woven into essence</span>
        <Sparkle />
      </MarqueeRow>
      <MarqueeRow baseVelocity={2.2}>
        <span className="font-display italic text-champagne">Wear it like a signature</span>
        <Sparkle />
      </MarqueeRow>
    </section>
  );
}

function MarqueeRow({ children, baseVelocity }: { children: ReactNode; baseVelocity: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduceMotion = useReducedMotion();

  const offset = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(offset, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (!inView || reduceMotion) return;
    const surge = boost.get();
    if (surge < 0) direction.current = -1;
    else if (surge > 0) direction.current = 1;

    let move = direction.current * baseVelocity * (delta / 1000);
    move += direction.current * move * surge;
    offset.set(offset.get() + move);
  });

  return (
    <div ref={ref} className="flex overflow-hidden whitespace-nowrap leading-[0.95]">
      <motion.div className="flex shrink-0 whitespace-nowrap text-[17vw] sm:text-[11vw]" style={{ x }}>
        {[0, 1, 2, 3].map((copy) => (
          <span key={copy} className="flex shrink-0 items-center gap-[0.25em] pr-[0.25em]">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" className="size-[0.32em] shrink-0 fill-bone/70">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}
