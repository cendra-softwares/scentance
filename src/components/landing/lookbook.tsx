"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { EASE, RevealText, SectionLabel } from "./primitives";

type Look = { src: string; alt: string; aspect: string };

const LOOKS: Look[] = [
  { src: "/images/landing/look-3.webp", alt: "Ombre Nomade resting on grey linen", aspect: "aspect-[3/4]" },
  { src: "/images/landing/silk.webp", alt: "Chanel Paris-Riviera on ivory silk", aspect: "aspect-[4/5]" },
  { src: "/images/landing/look-5.webp", alt: "Acqua di Giò under rippling light", aspect: "aspect-[3/4]" },
  { src: "/images/landing/look-1.webp", alt: "Armani Sì on a white plinth", aspect: "aspect-[4/5]" },
  { src: "/images/landing/look-4.webp", alt: "Dior Sauvage on crumpled linen", aspect: "aspect-[9/14]" },
  { src: "/images/landing/look-2.webp", alt: "Chanel N°5 with its box on white sheets", aspect: "aspect-[3/4]" },
  { src: "/images/landing/look-7.webp", alt: "Louis Vuitton Imagination on soft white fabric", aspect: "aspect-[2/3]" },
  { src: "/images/landing/look-house.webp", alt: "A Scentence house bottle on grey linen", aspect: "aspect-[4/5]" },
];

// Three columns on desktop; phones show the first two.
const COLUMNS = [
  [LOOKS[0], LOOKS[3], LOOKS[6]],
  [LOOKS[1], LOOKS[4], LOOKS[5]],
  [LOOKS[2], LOOKS[7]],
];

/** Columns of imagery drifting at different speeds as they pass. */
export function Lookbook() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const drift = [
    useTransform(scrollYProgress, [0, 1], [60, -90]),
    useTransform(scrollYProgress, [0, 1], [-40, 120]),
    useTransform(scrollYProgress, [0, 1], [110, -60]),
  ];

  return (
    <section aria-label="Lookbook" className="relative overflow-hidden py-24 sm:py-36">
      <div className="flex flex-col gap-6 px-6 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-20">
        <div>
          <SectionLabel index="05">In the wild</SectionLabel>
          <h2 className="mt-6 font-display text-[3.4rem] leading-[0.9] tracking-[-0.02em] text-bone sm:text-8xl">
            <RevealText>Worn, kept,</RevealText>
            <RevealText delay={0.08}>
              <span className="italic text-champagne">remembered.</span>
            </RevealText>
          </h2>
        </div>
        <a
          href="https://www.instagram.com/scentenceparfum/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex w-fit items-center gap-3 rounded-full border border-white/15 px-5 py-3 font-grotesk text-[11px] tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-bone hover:text-black"
        >
          <FaInstagram className="size-4" />
          @scentenceparfum
        </a>
      </div>

      <div ref={ref} className="mt-16 grid grid-cols-2 gap-3 px-3 sm:gap-5 sm:px-5 lg:grid-cols-3 lg:px-20">
        {COLUMNS.map((column, c) => (
          <Column key={c} looks={column} y={drift[c]} className={c === 1 ? "pt-20" : c === 2 ? "hidden pt-8 lg:flex" : undefined} />
        ))}
      </div>
    </section>
  );
}

function Column({ looks, y, className }: { looks: Look[]; y: MotionValue<number>; className?: string }) {
  return (
    <motion.div className={cn("flex flex-col gap-3 sm:gap-5", className)} style={{ y }}>
      {looks.map((look) => (
        <motion.figure
          key={look.src}
          className={`group relative overflow-hidden rounded-[1.25rem] bg-neutral-900 sm:rounded-[1.75rem] ${look.aspect}`}
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.3, ease: EASE }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.3 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1.8, ease: EASE }}
          >
            <Image
              src={look.src}
              alt={look.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover grayscale-[35%] transition-[filter,transform] duration-1000 ease-[var(--ease-silk)] group-hover:scale-105 group-hover:grayscale-0"
            />
          </motion.div>
        </motion.figure>
      ))}
    </motion.div>
  );
}
