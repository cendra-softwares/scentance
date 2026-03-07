"use client";

import { motion } from "framer-motion";

export default function PerfumesPage() {
  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <motion.main
        className="flex flex-col gap-8 sm:gap-12 items-center text-center justify-center"
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
    </div>
  );
}