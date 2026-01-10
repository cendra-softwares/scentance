"use client";

import { motion } from "framer-motion";
import { HeroSection } from "@/components/hero-section";
import BottleScrollSection from "@/components/bottle-scroll-section";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <motion.main
        className="flex flex-col gap-8 sm:gap-12 items-center text-center justify-center min-h-screen p-4 sm:p-8 lg:p-20"
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
      </motion.main>

      <BottleScrollSection />

      <div className="py-24 px-4 sm:px-8 lg:px-20">
        <HeroSection
          title="Discover Your Signature Scent"
          subtitle="Explore our curated collection of premium fragrances that tell your unique story"
          images={[
            { src: "/images/Mock_1.png", alt: "Premium fragrance bottle 1" },
            { src: "/images/Mock_2.png", alt: "Premium fragrance bottle 2" },
            { src: "/images/Mock_4.png", alt: "Premium fragrance bottle 3" },
            { src: "/images/Mock_5.png", alt: "Premium fragrance bottle 4" },
            { src: "/images/Mock_8.png", alt: "Premium fragrance bottle 5" }
          ]}
        />
      </div>
    </div>
  );
}
