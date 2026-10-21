"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FlutedGlass, type PaperShaderElement } from "@paper-design/shaders-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatINR, priceOf } from "./collection-rail";
import { EASE, SectionLabel, clamp, lerp } from "./primitives";

const TIERS = [
  { key: "top_note", label: "Top", title: "The opening" },
  { key: "middle_note", label: "Heart", title: "The heart" },
  { key: "bottom_note", label: "Base", title: "The trail" },
] as const;

// Scroll progress at which each tier of notes surfaces
const TIER_AT = [0.2, 0.42, 0.64];
const CLEAR_FROM = 0.04;
const CLEAR_TO = 0.8;

const GLASS_START = { distortion: 1, blur: 38, edges: 0.4 };

/**
 * A spotlight product behind fluted glass. Scrolling polishes the glass clear
 * while the pyramid of notes surfaces tier by tier.
 */
export function ScentAnatomy({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const glassRef = useRef<PaperShaderElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Only spin up WebGL once the section is close, then keep it.
  const near = useInView(ref, { margin: "60% 0px 60% 0px" });
  const [mountGlass, setMountGlass] = useState(false);
  useEffect(() => {
    if (near) setMountGlass(true);
  }, [near]);

  const [stage, setStage] = useState(-1);
  const [revealed, setRevealed] = useState(false);

  const polish = (p: number) => {
    const t = clamp((p - CLEAR_FROM) / (CLEAR_TO - CLEAR_FROM));
    const eased = 1 - Math.pow(1 - t, 2.2);
    glassRef.current?.paperShaderMount?.setUniforms({
      u_distortion: lerp(GLASS_START.distortion, 0, eased),
      u_blur: lerp(GLASS_START.blur, 0, eased),
      u_edges: lerp(GLASS_START.edges, 0, eased),
    });
  };

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    polish(p);
    setStage(TIER_AT.filter((at) => p >= at).length - 1);
    setRevealed(p >= 0.78);
  });

  const crisp = useTransform(scrollYProgress, [0.74, 0.86], [0, 1]);
  const sweep = useTransform(scrollYProgress, [0, 1], ["-120%", "320%"]);
  const fill = useTransform(scrollYProgress, [TIER_AT[0] - 0.05, TIER_AT[2] + 0.08], [0, 1]);
  const { final, base, discount } = priceOf(product);

  return (
    <section ref={ref} id="anatomy" aria-label="Anatomy of a scent" className="relative h-[360svh]">
      <div className="sticky top-0 h-[100svh] p-3 sm:p-5">
        <div className="relative h-full overflow-hidden rounded-[2rem] bg-neutral-950 ring-1 ring-white/10 lg:grid lg:grid-cols-2 lg:rounded-[2.5rem]">
          {/* Glass panel: the upper two thirds on phones, the left half on desktop */}
          <div className="absolute inset-x-0 top-0 h-[68%] overflow-hidden lg:relative lg:m-5 lg:h-auto lg:rounded-[2rem]">
            <img
              src={product.image}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
            />
            {mountGlass && !reduceMotion && (
              <FlutedGlass
                ref={glassRef}
                className="absolute inset-0 h-full w-full"
                image={product.image}
                fit="cover"
                shape="lines"
                distortionShape="lens"
                size={0.12}
                distortion={GLASS_START.distortion}
                blur={GLASS_START.blur}
                edges={GLASS_START.edges}
                maxPixelCount={1600 * 1600}
              />
            )}
            <motion.img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: reduceMotion ? 1 : crisp }}
            />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              style={{ x: sweep, skewX: -12 }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.05)_34%,rgba(10,10,10,0)_58%,rgb(10,10,10)_100%)] lg:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.25),transparent_40%,rgba(0,0,0,0.35))]" />
          </div>

          {/* Copy: overlaid on phones, the right half on desktop */}
          <div className="relative flex h-full flex-col justify-between p-6 sm:p-10 lg:p-14">
            <div>
              <SectionLabel index="03">Anatomy of a scent</SectionLabel>
              <h2 className="mt-5 font-display text-[2.6rem] leading-[0.92] text-bone sm:text-6xl lg:text-7xl">
                Three acts,
                <br />
                <span className="italic text-champagne">one signature.</span>
              </h2>
            </div>

            <div>
              <div className="relative pl-6">
                <span aria-hidden className="absolute bottom-2 left-0 top-2 w-px bg-white/15" />
                <motion.span
                  aria-hidden
                  className="absolute bottom-2 left-0 top-2 w-px origin-top bg-champagne"
                  style={{ scaleY: reduceMotion ? 1 : fill }}
                />
                <ol className="space-y-4 sm:space-y-6">
                  {TIERS.map((tier, i) => {
                    const reached = !!reduceMotion || stage >= i;
                    const notes = (product[tier.key] ?? "").split(",").map((n) => n.trim()).filter(Boolean);
                    return (
                      <li
                        key={tier.key}
                        className={cn(
                          "relative transition-opacity duration-700",
                          reached ? "opacity-100" : "opacity-30"
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "absolute -left-[1.6rem] top-2 size-[9px] rounded-full border transition-colors duration-700",
                            reached ? "border-champagne bg-champagne" : "border-white/30 bg-neutral-950"
                          )}
                        />
                        <div className="flex items-baseline gap-3">
                          <span className="font-display text-2xl text-bone sm:text-3xl">{tier.title}</span>
                          <span className="font-grotesk text-[9px] uppercase tracking-[0.35em] text-bone/45">
                            {tier.label} notes
                          </span>
                        </div>
                        <p className="mt-1 flex flex-wrap gap-x-2 font-grotesk text-[13px] text-bone/75 sm:text-sm">
                          {notes.map((note, n) => (
                            <motion.span
                              key={`${note}-${n}`}
                              initial={false}
                              animate={
                                reached
                                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                                  : { opacity: 0, y: 6, filter: "blur(6px)" }
                              }
                              transition={{ duration: 0.7, delay: reached ? n * 0.09 : 0, ease: EASE }}
                            >
                              {note}
                              {n < notes.length - 1 && <span className="text-bone/30"> ·</span>}
                            </motion.span>
                          ))}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="mt-6 h-14 sm:mt-8">
                <AnimatePresence mode="wait" initial={false}>
                  {revealed || reduceMotion ? (
                    <motion.div
                      key="product"
                      className="flex items-center justify-between gap-4 border-t border-white/10 pt-4"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.6, ease: EASE }}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-display text-xl text-bone sm:text-2xl">{product.name}</p>
                        <p className="font-grotesk text-xs text-bone/55">
                          {formatINR(final)}
                          {discount > 0 && <span className="ml-2 text-bone/35 line-through">{formatINR(base)}</span>}
                        </p>
                      </div>
                      <Link
                        href={`/shop/all/${product.id}`}
                        className="flex shrink-0 items-center gap-2 rounded-full bg-bone px-5 py-3 font-grotesk text-[10px] font-medium uppercase tracking-[0.3em] text-black transition-colors duration-500 hover:bg-champagne"
                      >
                        Discover
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="hint"
                      className="border-t border-white/10 pt-4 font-grotesk text-[10px] uppercase tracking-[0.35em] text-bone/40"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Keep scrolling — the glass clears
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
