"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { openCart } from "@/components/cart-icon";
import { useCart } from "@/lib/store/useCart";
import { cn } from "@/lib/utils";
import { EASE } from "./primitives";

const LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "The Collection", href: "#collection" },
  { label: "Anatomy", href: "#anatomy" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact-us" },
];

// Where the menu's circular reveal grows from: the menu button
const ORIGIN = "at 2.6rem 2rem";

/**
 * Minimal header that difference-blends over whatever is beneath it, tucks
 * away while scrolling down, and opens a full-screen menu.
 */
export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [mounted, setMounted] = useState(false);
  const count = useCart((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const { scrollY } = useScroll();

  useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - (scrollY.getPrevious() ?? 0);
    setPastHero(y > window.innerHeight * 0.65);
    if (y < window.innerHeight * 0.9 || delta < -6) setHidden(false);
    else if (delta > 6) setHidden(true);
  });

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const follow = (href: string) => (e: React.MouseEvent) => {
    setOpen(false);
    if (!href.startsWith("#")) return;
    e.preventDefault();
    // Let the page unlock scrolling before jumping to the section
    requestAnimationFrame(() =>
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" })
    );
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference"
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-5 pt-[env(safe-area-inset-top)] sm:h-20 sm:px-10">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="group flex items-center gap-3 justify-self-start py-2 font-grotesk text-[10px] font-medium uppercase tracking-[0.35em]"
          >
            <span className="relative block h-3 w-7">
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-silk)]",
                  open ? "translate-y-1.5 rotate-45" : "group-hover:scale-x-75"
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-silk)]",
                  open ? "-translate-y-1.5 -rotate-45" : "origin-left scale-x-[0.6] group-hover:scale-x-100"
                )}
              />
            </span>
            <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
          </button>

          <Link
            href="/"
            aria-label="Scentence home"
            onClick={() => setOpen(false)}
            className={cn(
              "font-logo text-xl font-semibold tracking-[0.32em] transition-all duration-700 ease-[var(--ease-silk)] sm:text-2xl",
              pastHero || open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
            )}
          >
            SCENTENCE
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open bag${mounted && count ? `, ${count} item${count === 1 ? "" : "s"}` : ""}`}
            className="flex items-center gap-2 justify-self-end py-2 font-grotesk text-[10px] font-medium uppercase tracking-[0.35em]"
          >
            <span className="hidden sm:inline">Bag</span>
            <span className="relative">
              <ShoppingBag className="size-5" strokeWidth={1.4} />
              <AnimatePresence>
                {mounted && count > 0 && (
                  <motion.span
                    key={count}
                    className="absolute -right-2 -top-1.5 grid min-w-4 place-items-center rounded-full bg-white px-1 text-[9px] font-semibold leading-4 tracking-normal text-black"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto overflow-x-hidden bg-ink px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 text-bone sm:px-10"
            initial={{ clipPath: `circle(0% ${ORIGIN})` }}
            animate={{ clipPath: `circle(150% ${ORIGIN})` }}
            exit={{ clipPath: `circle(0% ${ORIGIN})` }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-1/3 top-1/4 size-[90vw] rounded-full bg-[radial-gradient(circle,rgba(214,192,156,0.12),transparent_65%)]"
            />

            <nav className="relative flex-1">
              <ul>
                {LINKS.map((link, i) => (
                  <li key={link.href} className="overflow-hidden border-b border-white/10">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: EASE }}
                    >
                      <Link
                        href={link.href}
                        onClick={follow(link.href)}
                        className="group flex items-baseline justify-between py-4"
                      >
                        <span className="font-display text-[2.9rem] leading-none transition-[transform,color] duration-500 ease-[var(--ease-silk)] group-hover:translate-x-3 group-hover:italic group-hover:text-champagne sm:text-7xl">
                          {link.label}
                        </span>
                        <span className="font-grotesk text-[10px] tracking-[0.3em] text-bone/40">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="relative mt-12 flex flex-wrap items-center justify-between gap-4 font-grotesk text-xs text-bone/60"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
            >
              <a href="mailto:Scentence.in@gmail.com" className="transition-colors hover:text-bone">
                Scentence.in@gmail.com
              </a>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/scentenceparfum/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="grid size-11 place-items-center rounded-full border border-white/15 transition-colors hover:bg-bone hover:text-black"
                >
                  <FaInstagram className="size-4" />
                </a>
                <a
                  href="https://wa.me/919188645067"
                  aria-label="WhatsApp"
                  className="grid size-11 place-items-center rounded-full border border-white/15 transition-colors hover:bg-bone hover:text-black"
                >
                  <FaWhatsapp className="size-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
