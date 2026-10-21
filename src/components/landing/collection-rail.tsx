"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/store/useCart";
import { cn } from "@/lib/utils";
import { EASE, RevealText, SectionLabel, clamp } from "./primitives";

const ALL = "all";

export function priceOf(product: Product) {
  const base = parseFloat(product.price.replace(/,/g, "")) || 0;
  const discount = product.discount_percent || 0;
  const final = discount > 0 ? Math.round(base * (1 - discount / 100)) : base;
  return { base, final, discount };
}

export const formatINR = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export const formatVolume = (volume: string) =>
  volume.toLowerCase().includes("ml") ? volume : `${volume} ml`;

const categoryLabel = (category: string) =>
  category === ALL ? "All" : category.charAt(0).toUpperCase() + category.slice(1);

/**
 * The collection as a swipeable cover-flow: native scroll-snap for the feel of
 * the platform, with each card tilting and parallaxing by its distance from centre.
 */
export function CollectionRail({ products, loading }: { products: Product[]; loading: boolean }) {
  const [active, setActive] = useState(ALL);
  const [centred, setCentred] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const revealed = useInView(stageRef, { once: true, amount: 0.2 });
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 260, damping: 40 });

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products]
  );
  const visible = useMemo(
    () => (active === ALL ? products : products.filter((p) => p.category === active)),
    [products, active]
  );

  const layout = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    // Offsets ignore transforms, so the entrance animation can't skew the maths.
    const middle = rail.scrollLeft + rail.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Infinity;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      // Distance from the centre of the rail, measured in card widths
      const d = clamp((card.offsetLeft + card.offsetWidth / 2 - middle) / card.offsetWidth, -1.6, 1.6);
      const reach = Math.min(Math.abs(d), 1);

      const tilt = card.querySelector<HTMLElement>("[data-tilt]");
      const parallax = card.querySelector<HTMLElement>("[data-parallax]");
      if (tilt) {
        tilt.style.transform = `perspective(1100px) rotateY(${(-d * 18).toFixed(2)}deg) scale(${(1 - reach * 0.1).toFixed(3)})`;
        tilt.style.opacity = (1 - reach * 0.45).toFixed(3);
      }
      if (parallax) parallax.style.transform = `translate3d(${(-d * 12).toFixed(2)}%, 0, 0) scale(1.24)`;

      if (Math.abs(d) < nearestDistance) {
        nearestDistance = Math.abs(d);
        nearest = i;
      }
    });

    setCentred(nearest);
    const max = rail.scrollWidth - rail.clientWidth;
    progress.set(max > 0 ? rail.scrollLeft / max : 0);
  }, [progress]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(layout);
    };

    schedule();
    rail.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [layout, visible, loading]);

  const nudge = (direction: 1 | -1) => {
    const rail = railRef.current;
    const card = cardRefs.current[0];
    if (!rail || !card) return;
    rail.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: "smooth" });
  };

  const selectCategory = (category: string) => {
    setActive(category);
    railRef.current?.scrollTo({ left: 0 });
  };

  cardRefs.current.length = visible.length;
  const isEmpty = !loading && visible.length === 0;

  return (
    <section id="collection" aria-label="The collection" className="relative scroll-mt-16 py-24 sm:py-36">
      <div className="px-6 sm:px-10 lg:px-20">
        <SectionLabel index="02">The Collection</SectionLabel>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-display text-[3.6rem] leading-[0.88] tracking-[-0.02em] text-bone sm:text-8xl lg:text-[8.5rem]">
            <RevealText>The Scentence</RevealText>
            <RevealText delay={0.08} className="italic text-champagne">
              Library
            </RevealText>
          </h2>
          <motion.p
            className="max-w-sm font-grotesk text-sm leading-relaxed text-bone/55 lg:text-right"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
          >
            A curated archive of essence. Swipe through, tap a bottle to explore it, or add it straight to your bag.
          </motion.p>
        </div>

        {categories.length > 2 && (
          <div className="no-scrollbar -mx-6 mt-10 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:px-0">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => selectCategory(category)}
                className="relative shrink-0 rounded-full border border-white/10 px-5 py-2.5 font-grotesk text-[10px] font-medium uppercase tracking-[0.3em] transition-colors"
              >
                {active === category && (
                  <motion.span
                    layoutId="collection-tab"
                    className="absolute inset-0 rounded-full bg-bone"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  className={cn(
                    "relative transition-colors duration-500",
                    active === category ? "text-black" : "text-bone/55 hover:text-bone"
                  )}
                >
                  {categoryLabel(category)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={stageRef}>
        {isEmpty ? (
          <p className="mx-6 mt-16 font-display text-3xl italic text-bone/50 sm:mx-10 lg:mx-20">
            The archive is being restocked. Check back soon.
          </p>
        ) : (
          <div
            key={active}
            ref={railRef}
            className="no-scrollbar relative mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-6 [--card:min(76vw,400px)] [padding-inline:calc(50%_-_var(--card)/2)] lg:mt-14"
          >
            {loading
              ? Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className="skeleton-shimmer aspect-[3/4] w-[var(--card)] shrink-0 snap-center rounded-[1.75rem]"
                  />
                ))
              : visible.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    centred={i === centred}
                    revealed={revealed}
                    ref={(node) => {
                      cardRefs.current[i] = node;
                    }}
                  />
                ))}
          </div>
        )}
      </div>

      {!isEmpty && (
        <div className="mt-6 flex items-center gap-5 px-6 sm:px-10 lg:px-20">
          <span className="font-grotesk text-[11px] tabular-nums tracking-[0.2em] text-bone/70">
            {String(Math.min(centred + 1, Math.max(visible.length, 1))).padStart(2, "0")}
            <span className="text-bone/30"> / {String(visible.length).padStart(2, "0")}</span>
          </span>
          <div className="relative h-px flex-1 overflow-hidden bg-white/10">
            <motion.span
              className="absolute inset-0 origin-left bg-bone"
              style={{ scaleX: smoothProgress }}
            />
          </div>
          <div className="hidden gap-2 md:flex">
            {([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                aria-label={direction < 0 ? "Previous fragrance" : "Next fragrance"}
                onClick={() => nudge(direction)}
                className="grid size-11 place-items-center rounded-full border border-white/15 text-bone transition-colors duration-500 hover:bg-bone hover:text-black"
              >
                {direction < 0 ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 flex justify-center px-6">
        <Link
          href="/shop"
          className="group flex items-center gap-3 font-grotesk text-[11px] font-medium uppercase tracking-[0.35em] text-bone"
        >
          <span className="relative">
            View the full archive
            <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-100 bg-bone/40 transition-transform duration-700 ease-[var(--ease-silk)] group-hover:scale-x-0" />
          </span>
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
        </Link>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  index,
  centred,
  revealed,
  ref,
}: {
  product: Product;
  index: number;
  centred: boolean;
  revealed: boolean;
  ref: (node: HTMLElement | null) => void;
}) {
  const { base, final, discount } = priceOf(product);

  return (
    <motion.article
      ref={ref}
      className="relative w-[var(--card)] shrink-0 snap-center"
      initial={{ opacity: 0, x: 80 }}
      animate={revealed ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 1.1, delay: Math.min(index, 5) * 0.08, ease: EASE }}
    >
      <div data-tilt className="relative will-change-transform">
        <Link href={`/shop/all/${product.id}`} className="block" aria-label={product.name}>
          <div
            data-centered={centred}
            className="sheen relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-neutral-900 ring-1 ring-white/10"
          >
            <div data-parallax className="absolute inset-0 will-change-transform">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 76vw, 400px"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/30" />

            <span className="absolute left-5 top-5 font-grotesk text-[10px] tracking-[0.3em] text-bone/80">
              N°{String(index + 1).padStart(2, "0")}
            </span>
            {discount > 0 && (
              <span className="absolute right-5 top-4 rounded-full bg-champagne px-3 py-1 font-grotesk text-[10px] font-semibold tracking-[0.12em] text-black">
                −{discount}%
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 p-5 pr-20">
              <p className="font-grotesk text-[9px] uppercase tracking-[0.35em] text-bone/50">
                {product.fragrance_type || categoryLabel(product.category)}
              </p>
              <h3 className="mt-2 line-clamp-2 font-display text-[1.85rem] leading-[0.95] text-bone">
                {product.name}
              </h3>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-2 font-grotesk">
                <span className="text-[15px] font-medium text-bone">{formatINR(final)}</span>
                {discount > 0 && <span className="text-xs text-bone/40 line-through">{formatINR(base)}</span>}
                {product.volume && (
                  <span className="text-[10px] uppercase tracking-[0.2em] text-bone/40">· {formatVolume(product.volume)}</span>
                )}
              </div>
            </div>
          </div>
        </Link>
        <QuickAdd product={product} />
      </div>
    </motion.article>
  );
}

function QuickAdd({ product }: { product: Product }) {
  const addItem = useCart((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const add = () => {
    const { final } = priceOf(product);
    addItem({
      ...product,
      price: String(final),
      originalPrice: product.price,
      discount_percent: product.discount_percent,
    });
    toast.success(`${product.name} added to your bag`);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.button
      type="button"
      onClick={add}
      aria-label={`Add ${product.name} to bag`}
      whileTap={{ scale: 0.86 }}
      className={cn(
        "absolute bottom-5 right-5 grid size-12 place-items-center rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-colors duration-500",
        added ? "bg-champagne text-black" : "bg-bone text-black"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={added ? "added" : "add"}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {added ? <Check className="size-5" /> : <Plus className="size-5" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
