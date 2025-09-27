"use client";

import { motion } from "framer-motion";
import { GlowingEffectDemo } from "@/components/ui/glowing-effect-demo";
import { Button } from "@/components/ui/button";
import ProductShowcase from "@/components/ui/ProductShowcase";
import AboutSection from "@/components/ui/AboutSection";
import ContactSection from "@/components/ui/ContactSection";

const products = [
  {
    name: "Midnight Bloom",
    description: "A captivating blend of jasmine and dark amber.",
    imageUrl: "/next.svg", // Placeholder image
    price: "$120",
  },
  {
    name: "Golden Hour",
    description: "Warm notes of vanilla and sandalwood, reminiscent of twilight.",
    imageUrl: "/vercel.svg", // Placeholder image
    price: "$110",
  },
  {
    name: "Ocean Breeze",
    description: "Crisp and refreshing, with hints of sea salt and citrus.",
    imageUrl: "/globe.svg", // Placeholder image
    price: "$95",
  },
];

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-4 sm:p-8 lg:p-20">
      <motion.main
        className="flex flex-col gap-8 sm:gap-12 items-center text-center justify-center min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className={`font-cormorant-garamond text-5xl sm:text-7xl lg:text-8xl font-medium text-glow`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          SCENTENCE
        </motion.h1>

        <motion.blockquote
          className="font-cormorant-garamond text-sm sm:text-base lg:text-lg italic text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          &ldquo;Scent woven into essence.&rdquo;
        </motion.blockquote>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <Button
            variant="outline"
            className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-background"
          >
            Explore Collection
          </Button>
        </motion.div>
      </motion.main>
      <motion.div
        className="mt-96"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <GlowingEffectDemo />
      </motion.div>
      <ProductShowcase products={products} />
      <AboutSection />
      <ContactSection />
    </div>
  );
}
