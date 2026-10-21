"use client";

import { useEffect, useRef, useState } from "react";
import { SmokeRing } from "@paper-design/shaders-react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MagneticLink, RevealText, SectionLabel } from "./primitives";

const SMOKE_COLORS = ["#ece7df", "#b9ab94"];

/** Closing call to action inside a slowly turning ring of smoke. */
export function Finale() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const near = useInView(ref, { margin: "80% 0px 80% 0px" });
  const onScreen = useInView(ref);
  const [mountSmoke, setMountSmoke] = useState(false);
  useEffect(() => {
    if (near) setMountSmoke(true);
  }, [near]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const ringScale = useTransform(scrollYProgress, [0, 1], [0.55, 1]);
  const ringOpacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);

  return (
    <section ref={ref} aria-label="Find your signature" className="relative h-[100svh] min-h-[580px] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ scale: ringScale, opacity: ringOpacity }}>
        {mountSmoke && (
          <SmokeRing
            className="h-full w-full"
            colorBack="#070707"
            colors={SMOKE_COLORS}
            speed={onScreen && !reduceMotion ? 0.55 : 0}
            radius={0.3}
            thickness={0.6}
            innerShape={0.75}
            noiseScale={2.6}
            noiseIterations={6}
            scale={1.05}
            minPixelRatio={1}
            maxPixelCount={1400 * 1400}
          />
        )}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,transparent,rgba(7,7,7,0.6))]" />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <SectionLabel index="06" className="justify-center">
          Your signature
        </SectionLabel>
        <h2 className="mt-6 font-display text-[4.6rem] leading-[0.85] tracking-[-0.02em] text-white mix-blend-difference sm:text-[9rem] lg:text-[11rem]">
          <RevealText>Leave a</RevealText>
          <RevealText delay={0.1} className="italic">
            trace.
          </RevealText>
        </h2>
        <p className="mt-6 max-w-xs font-grotesk text-sm leading-relaxed text-bone/65">
          Find the scent that speaks before you do.
        </p>
        <div className="mt-10">
          <MagneticLink href="/shop">Shop the collection</MagneticLink>
        </div>
      </div>
    </section>
  );
}
