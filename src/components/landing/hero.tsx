"use client";

import { useState } from "react";
import Link from "next/link";
import { MeshGradient } from "@paper-design/shaders-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;
const WORDMARK = "SCENTENCE".split("");
const MESH_COLORS = ["#000000", "#1a1a1a", "#333333", "#ffffff"];

const viewportProgress = (y: number) =>
  typeof window === "undefined" ? 0 : Math.min(Math.max(y / window.innerHeight, 0), 1);

/**
 * Entrance: the original monochrome mesh shader, pinned in place while the
 * rest of the page slides over it like a curtain.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, viewportProgress);

  const wordScale = useTransform(progress, [0, 1], [1, 0.84]);
  const wordY = useTransform(progress, [0, 1], ["0vh", "-14vh"]);
  const wordBlur = useTransform(progress, [0.05, 0.9], ["blur(0px)", "blur(14px)"]);
  const wordOpacity = useTransform(progress, [0.1, 0.85], [1, 0]);
  const chromeOpacity = useTransform(progress, [0, 0.35], [1, 0]);
  const dim = useTransform(progress, [0, 1], [0, 0.9]);

  // Stop the shader's render loop once the hero is fully covered.
  const [covered, setCovered] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setCovered(y > window.innerHeight * 1.05));

  return (
    <section
      aria-label="Scentence"
      className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black"
      style={{ visibility: covered ? "hidden" : "visible" }}
    >
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        colors={MESH_COLORS}
        speed={reduceMotion || covered ? 0 : 1}
        grainOverlay={0.08}
      />

      {/* Soft vignette keeps the edges deep and the centre luminous */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_45%,transparent_35%,rgba(0,0,0,0.7)_100%)]" />
      <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />

      {/* Difference blending lets the wordmark invert as the gradient flows behind it */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-5 text-white mix-blend-difference"
        style={
          reduceMotion
            ? undefined
            : { scale: wordScale, y: wordY, filter: wordBlur, opacity: wordOpacity }
        }
      >
        <motion.p
          className="font-grotesk text-[10px] font-medium uppercase tracking-[0.55em] sm:text-xs"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
        >
          Fine Fragrance Archive
        </motion.p>

        <motion.h1
          aria-label="Scentence"
          className="mt-5 flex justify-center whitespace-nowrap font-logo text-[clamp(3rem,13.6vw,11.5rem)] font-medium leading-none"
          initial={reduceMotion ? false : { gap: "0.38em" }}
          animate={{ gap: "0.045em" }}
          transition={{ duration: 2.4, ease: EASE }}
        >
          {WORDMARK.map((letter, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block"
              initial={reduceMotion ? false : { opacity: 0, y: "0.4em", filter: "blur(18px)" }}
              animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
              transition={{ duration: 1.6, delay: 0.2 + i * 0.075, ease: EASE }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        <motion.span
          aria-hidden
          className="mt-6 block h-px w-28 origin-center bg-white/70 sm:w-40"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, delay: 1.2, ease: EASE }}
        />

        <motion.p
          className="mt-6 font-display text-[1.65rem] italic leading-none sm:text-4xl"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4, delay: 1.45, ease: EASE }}
        >
          Scent woven into essence.
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute inset-x-0 bottom-0 text-bone"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 2 }}
      >
        <motion.div
          className="flex items-end justify-between px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:px-10 sm:pb-10"
          style={{ opacity: chromeOpacity }}
        >
          <div className="flex items-center gap-3">
            <span className="relative block h-14 w-px overflow-hidden bg-white/15">
              <span className="animate-drip absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent to-white" />
            </span>
            <span className="font-grotesk text-[10px] uppercase tracking-[0.4em] text-bone/60">Scroll</span>
          </div>

          <Link
            href="/shop"
            className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 font-grotesk text-[10px] uppercase tracking-[0.3em] backdrop-blur-md transition-colors duration-500 hover:bg-white hover:text-black"
          >
            Shop the archive
            <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
