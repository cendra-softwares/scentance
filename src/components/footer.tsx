"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { MdOutlineMail } from "react-icons/md";

const EASE = [0.16, 1, 0.3, 1] as const;

const COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Contact Us', href: '/contact-us' },
      { label: 'Shop', href: '/shop' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Shipping Policy', href: '/shipping-policy' },
      { label: 'Refund & Return', href: '/refund-return-policy' },
      { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-ink text-bone">
      <div className="mx-auto max-w-7xl px-6 pt-20 sm:px-10 sm:pt-28">
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-[1.6fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-[2.6rem] italic leading-[0.95] sm:text-5xl">
              &ldquo;Scent woven
              <br />
              into essence.&rdquo;
            </p>
            <p className="mt-6 max-w-xs font-grotesk text-sm leading-relaxed text-bone/50">
              Discover your signature scent with our exclusive collection of fine fragrances.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="font-grotesk text-[10px] font-medium uppercase tracking-[0.4em] text-bone/40">{column.title}</h3>
              <ul className="mt-5 space-y-3 font-grotesk text-sm text-bone/75">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="group relative inline-block transition-colors hover:text-bone">
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-bone/50 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Follow */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-grotesk text-[10px] font-medium uppercase tracking-[0.4em] text-bone/40">Follow Us</h3>
            <ul className="mt-5 space-y-3 font-grotesk text-sm text-bone/75">
              <li>
                <a href="https://www.instagram.com/scentenceparfum/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:text-bone">
                  <FaInstagram /> Instagram
                </a>
              </li>
              <li>
                <a href="https://wa.me/919188645067" className="flex items-center gap-2 transition-colors hover:text-bone">
                  <FaWhatsapp /> WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:Scentence.in@gmail.com" className="flex items-center gap-2 break-all transition-colors hover:text-bone">
                  <MdOutlineMail className="shrink-0" /> Scentence.in@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between gap-4 border-t border-white/[0.08] py-6 font-grotesk text-[11px] text-bone/40">
          <p>&copy; {new Date().getFullYear()} Scentence. All rights reserved.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 uppercase tracking-[0.3em] transition-colors hover:text-bone"
          >
            Top
            <ArrowUp className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Oversized wordmark, set in the logo face and cropped by the page edge */}
      <div aria-hidden className="pointer-events-none flex select-none justify-center overflow-hidden px-2">
        {'SCENTENCE'.split('').map((letter, i) => (
          <motion.span
            key={i}
            className="inline-block bg-gradient-to-b from-bone/30 via-bone/10 to-transparent bg-clip-text font-logo text-[15.6vw] font-medium leading-[0.78] text-transparent"
            initial={{ y: '70%', opacity: 0 }}
            whileInView={{ y: '12%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: i * 0.05, ease: EASE }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
