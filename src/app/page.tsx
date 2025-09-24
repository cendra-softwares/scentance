"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GlowingEffectDemo } from "@/components/ui/glowing-effect-demo";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-4 sm:p-8 lg:p-20">
       <motion.main
         className="flex flex-col gap-8 sm:gap-12 items-center text-center justify-center min-h-screen"
         initial={{ opacity: 0, y: 50 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8 }}
         viewport={{ once: true }}
       >
         <motion.h1
           className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold"
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           viewport={{ once: true }}
         >
           Scentance
         </motion.h1>

         <motion.blockquote
           className="text-sm sm:text-base lg:text-lg italic text-gray-600 dark:text-gray-400"
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.6 }}
           viewport={{ once: true }}
         >
           &ldquo;Where elegance meets fragrance.&rdquo;
         </motion.blockquote>
       </motion.main>
       <motion.div
         className="mt-96"
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         transition={{ duration: 1 }}
         viewport={{ once: true }}
       >
         <GlowingEffectDemo />
       </motion.div>
    </div>
  );
}
