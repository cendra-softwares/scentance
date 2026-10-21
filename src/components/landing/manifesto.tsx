"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScentParticles } from "./scent-particles";
import { SectionLabel } from "./primitives";

// Words wrapped in *asterisks* are set in italic champagne.
const MANIFESTO =
  "A fragrance is a *biography* in a bottle — a silent narrative that *lingers* long after you have left the room.";

const REVEAL_START = 0.06;
const REVEAL_SPAN = 0.72;

/** Pinned passage that condenses out of a haze, word by word, as you scroll. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const words = MANIFESTO.split(" ");
  const step = REVEAL_SPAN / words.length;

  const haloScale = useTransform(scrollYProgress, [0, 1], [0.5, 1.35]);
  const haloOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 0.4]);
  const signature = useTransform(scrollYProgress, [0.78, 0.9], [0, 1]);
  const signatureX = useTransform(scrollYProgress, [0.78, 0.9], [24, 0]);

  return (
    <section ref={ref} aria-label="Manifesto" className="relative h-[240svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-6 sm:px-10 lg:px-20">
        <ScentParticles className="absolute inset-0 h-full w-full" />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,192,156,0.10),transparent_62%)] lg:size-[90vw]"
          style={{ scale: haloScale, opacity: haloOpacity }}
        />

        <SectionLabel index="01" className="relative mb-8 sm:mb-12">
          Manifesto
        </SectionLabel>

        <p className="relative max-w-5xl font-display text-[2.55rem] leading-[1.02] tracking-[-0.01em] text-bone sm:text-6xl lg:text-[5.5rem]">
          {words.map((word, i) => {
            const start = REVEAL_START + i * step;
            return (
              <Word
                key={i}
                word={word}
                progress={scrollYProgress}
                range={[start, start + step * 3]}
                still={!!reduceMotion}
              />
            );
          })}
        </p>

        <motion.p
          className="relative mt-10 self-end font-logo text-xl tracking-[0.3em] text-bone/70 sm:text-2xl"
          style={{ opacity: signature, x: signatureX }}
        >
          — SCENTENCE
        </motion.p>
      </div>
    </section>
  );
}

function Word({
  word,
  progress,
  range,
  still,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  still: boolean;
}) {
  const accent = word.startsWith("*");
  const text = word.replaceAll("*", "");

  const opacity = useTransform(progress, range, [0.1, 1]);
  const blur = useTransform(progress, range, ["blur(8px)", "blur(0px)"]);
  const y = useTransform(progress, range, ["0.18em", "0em"]);

  return (
    <motion.span
      className={cn("mr-[0.24em] inline-block", accent && "italic text-champagne")}
      style={still ? undefined : { opacity, filter: blur, y }}
    >
      {text}
    </motion.span>
  );
}
