"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export const EASE = [0.16, 1, 0.3, 1] as const;

export const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/** "(01) —— Label" eyebrow used to open each section. */
export function SectionLabel({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-grotesk text-[10px] font-medium uppercase tracking-[0.45em] text-bone/50",
        className
      )}
    >
      {index && <span className="text-bone/80">({index})</span>}
      <span aria-hidden className="h-px w-8 bg-bone/25" />
      <span>{children}</span>
    </div>
  );
}

/** A line of text that slides up from behind a mask when it enters the viewport. */
export function RevealText({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <span className={cn("block overflow-hidden pb-[0.1em]", className)}>
      <motion.span
        className="block"
        initial={{ y: "110%", rotate: 3 }}
        whileInView={{ y: "0%", rotate: 0 }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ duration: 1.2, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** A pill link that leans toward the pointer on devices that hover. */
export function MagneticLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const move = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
    };
    const leave = () => {
      x.set(0);
      y.set(0);
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  return (
    <motion.span className="inline-block" style={{ x: springX, y: springY }}>
      <Link
        ref={ref}
        href={href}
        className={cn(
          "group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-bone px-8 py-4 font-grotesk text-[11px] font-medium uppercase tracking-[0.32em] text-black transition-transform duration-500 active:scale-[0.97]",
          className
        )}
      >
        <span
          aria-hidden
          className="absolute inset-0 translate-y-full rounded-full bg-champagne transition-transform duration-700 ease-[var(--ease-silk)] group-hover:translate-y-0"
        />
        <span className="relative">{children}</span>
      </Link>
    </motion.span>
  );
}
