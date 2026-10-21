"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { RevealText, SectionLabel } from "./primitives";

const CHAPTERS = [
  {
    numeral: "I",
    title: "The Gesture",
    copy: "One deliberate spray. A sentence written in scent, read by everyone you pass.",
    image: "/images/landing/gesture.webp",
    alt: "A hand holding a Scentence sample vial against a tailored sleeve",
    position: "object-[40%_50%]",
  },
  {
    numeral: "II",
    title: "The Signature",
    copy: "Worn like a well-cut suit: quietly, unmistakably yours.",
    image: "/images/landing/signature.webp",
    alt: "A man in a dark suit holding a Scentence box",
    position: "object-[50%_55%]",
  },
  {
    numeral: "III",
    title: "The Keepsake",
    copy: "A box, a card, a first spray. The small ceremony of something chosen well.",
    image: "/images/landing/keepsake.webp",
    alt: "Hands holding a Scentence card beside a wristwatch",
    position: "object-[60%_50%]",
  },
] as const;

/** Full-bleed cards that pin and stack, each one settling back into the deck. */
export function Chapters() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section aria-label="Rituals" className="relative pt-24 sm:pt-36">
      <div className="px-6 sm:px-10 lg:px-20">
        <SectionLabel index="04">Rituals</SectionLabel>
        <h2 className="mt-6 font-display text-[3.4rem] leading-[0.9] tracking-[-0.02em] text-bone sm:text-8xl">
          <RevealText>Three chapters</RevealText>
          <RevealText delay={0.08}>
            <span className="italic text-champagne">of a scent.</span>
          </RevealText>
        </h2>
      </div>

      <div ref={ref} className="relative mt-4">
        {CHAPTERS.map((chapter, i) => (
          <ChapterCard
            key={chapter.numeral}
            chapter={chapter}
            index={i}
            total={CHAPTERS.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

function ChapterCard({
  chapter,
  index,
  total,
  progress,
}: {
  chapter: (typeof CHAPTERS)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: arrival } = useScroll({ target: ref, offset: ["start end", "start start"] });

  const isLast = index === total - 1;
  const settledScale = 1 - (total - 1 - index) * 0.05;
  const scale = useTransform(progress, [index / total, 1], [1, settledScale]);
  const shade = useTransform(progress, [index / total, (index + 1) / total], [0, isLast ? 0 : 0.6]);
  const imageScale = useTransform(arrival, [0, 1], [1.35, 1]);
  const numeralY = useTransform(arrival, [0, 1], ["60%", "0%"]);

  return (
    <div ref={ref} className="sticky top-0 flex h-[100svh] items-center justify-center px-3 sm:px-5">
      <motion.article
        className="relative h-[80svh] w-full max-w-7xl origin-top overflow-hidden rounded-[2rem] bg-neutral-900 ring-1 ring-white/10 sm:rounded-[2.5rem]"
        style={{ scale, top: `${index * 16}px` }}
      >
        <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
          <Image
            src={chapter.image}
            alt={chapter.alt}
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            className={`object-cover ${chapter.position}`}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40" />
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: shade }} />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 font-grotesk text-[10px] uppercase tracking-[0.4em] text-bone/70 sm:p-10">
          <span>Chapter {chapter.numeral}</span>
          <span>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
          <div className="overflow-hidden">
            <motion.span
              className="block font-display text-[6.5rem] italic leading-[0.8] text-champagne sm:text-[10rem]"
              style={{ y: numeralY }}
            >
              {chapter.numeral}
            </motion.span>
          </div>
          <h3 className="mt-4 font-display text-[2.6rem] leading-none text-bone sm:text-6xl">{chapter.title}</h3>
          <p className="mt-4 max-w-sm font-grotesk text-sm leading-relaxed text-bone/70 sm:text-base">
            {chapter.copy}
          </p>
          {isLast && (
            <Link
              href="/shop"
              className="group mt-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 font-grotesk text-[10px] font-medium uppercase tracking-[0.3em] text-bone backdrop-blur-md transition-colors duration-500 hover:bg-bone hover:text-black"
            >
              Begin your collection
              <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:rotate-45" />
            </Link>
          )}
        </div>
      </motion.article>
    </div>
  );
}
