"use client";

import { motion } from "framer-motion";
import { GlowingEffectDemo } from "@/components/ui/glowing-effect-demo";

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
          &ldquo;Where elegance meets fragrance.&rdquo;
        </motion.blockquote>
      </motion.main>
      <motion.div
        className="mt-96"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <GlowingEffectDemo />
      </motion.div>
    </div>
  );
}
