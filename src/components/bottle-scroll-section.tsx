"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import BlurText from './BlurText';

interface BottleScrollSectionProps {
  className?: string;
}

const TOTAL_FRAMES = 101;
const FRAME_PATH_PREFIX = '/frames/ezgif-frame-';
const SCROLL_HEIGHT = 400;

export default function BottleScrollSection({ className = '' }: BottleScrollSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const smoothScrollY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const frameIndex = useTransform(smoothScrollY, [0, 1], [0, TOTAL_FRAMES - 1]);

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises: Promise<HTMLImageElement>[] = [];
      
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = `${FRAME_PATH_PREFIX}${i.toString().padStart(3, '0')}.jpg`;
        
        const promise = new Promise<HTMLImageElement>((resolve) => {
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img);
        });
        
        imagePromises.push(promise);
        imagesRef.current.push(img);
      }
      
      await Promise.all(imagePromises);
      setImagesLoaded(true);
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !imagesLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const unsubscribe = frameIndex.on('change', (value) => {
      const index = Math.round(value);
      const img = imagesRef.current[index];
      
      if (img && img.complete) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      }
    });

    return () => unsubscribe();
  }, [frameIndex, imagesLoaded]);

  const scrollProgress = useTransform(smoothScrollY, [0, 1], [0, 100]);
  const scrollPillOpacity = useTransform(smoothScrollY, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <div 
      ref={scrollRef} 
      className={`relative w-full ${className}`}
      style={{ height: `${SCROLL_HEIGHT}vh` }}
    >
      <div className="sticky top-0 left-0 right-0 h-screen overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />
        
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white text-glow font-cormorant-garamond text-2xl animate-pulse">
              Loading experience...
            </div>
          </div>
        )}

        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ opacity: scrollPillOpacity }}
        >
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
            <div className="w-2 h-2 bg-[oklch(0.65_0.25_25)] rounded-full animate-pulse" />
            <span className="font-geist-sans text-white/60 text-sm">Scroll to explore</span>
            <div className="w-2 h-2 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="sticky top-0 left-0 right-0 h-screen flex flex-col items-center justify-center">
          <HeroSection progress={smoothScrollY} />
        </div>
      </div>
    </div>
  );
}

function HeroSection({ progress }: { progress: any }) {
  const inHeroSection = useTransform(progress, [0, 0.15], [1, 0]);
  const inCraftsmanshipSection = useTransform(progress, [0.15, 0.28, 0.4], [0, 1, 0]);
  const inNotesSection = useTransform(progress, [0.4, 0.52, 0.65], [0, 1, 0]);
  const inEssenceSection = useTransform(progress, [0.65, 0.75, 0.85], [0, 1, 0]);
  const inCTASection = useTransform(progress, [0.85, 1], [0, 1]);

  return (
    <div className="w-full max-w-4xl px-4 sm:px-8">
      <motion.div 
        className="text-center"
        style={{ opacity: inHeroSection }}
      >
        <BlurText
          text="SCENTENCE"
          delay={150}
          animateBy="words"
          direction="top"
          className="font-cormorant-garamond text-5xl sm:text-6xl lg:text-7xl lg:text-8xl font-medium text-glow text-white mb-6"
        />
        <BlurText
          text="Scent woven into essence."
          delay={200}
          animateBy="words"
          direction="top"
          className="font-geist-sans text-lg sm:text-xl lg:text-2xl text-white/80 mb-4"
        />
        <motion.p 
          className="font-geist-sans text-base sm:text-lg text-white/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Discover your signature scent—a journey through layers of luxury.
        </motion.p>
      </motion.div>

      <motion.div 
        className="absolute inset-0 flex items-start justify-center px-8 pt-16 pb-8 sm:relative sm:left-8 sm:left-16 sm:top-1/4 sm:-translate-y-1/2 sm:max-w-md"
        style={{ opacity: inCraftsmanshipSection }}
      >
        <div className="max-w-md text-center sm:text-left">
          <BlurText
            text="Crafted by master perfumers."
            delay={150}
            animateBy="words"
            direction="top"
            className="font-cormorant-garamond text-3xl sm:text-4xl sm:text-5xl text-white mb-6"
          />
          <div className="space-y-3">
            <motion.p 
              className="font-geist-sans text-white/80 text-base sm:text-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Each fragrance tells a story—layers of top, heart, and base notes.
            </motion.p>
            <motion.p 
              className="font-geist-sans text-white/80 text-base sm:text-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Hand-selected ingredients from around the world, blended with precision.
            </motion.p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="absolute inset-0 flex items-start justify-center px-8 pt-16 pb-8 sm:relative sm:right-8 sm:right-16 sm:top-1/4 sm:-translate-y-1/2 sm:max-w-md"
        style={{ opacity: inNotesSection }}
      >
        <div className="max-w-md text-center sm:text-right">
          <BlurText
            text="Notes that unfold over time."
            delay={150}
            animateBy="words"
            direction="top"
            className="font-cormorant-garamond text-3xl sm:text-4xl sm:text-5xl text-white mb-6"
          />
          <div className="space-y-3">
            <motion.p 
              className="font-geist-sans text-white/80 text-base sm:text-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="text-white/60">Top notes:</span> bright bergamot, sparkling citrus
            </motion.p>
            <motion.p 
              className="font-geist-sans text-white/80 text-base sm:text-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="text-white/60">Heart notes:</span> delicate jasmine, warm amber
            </motion.p>
            <motion.p 
              className="font-geist-sans text-white/80 text-base sm:text-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="text-white/60">Base notes:</span> deep sandalwood, sensual musk
            </motion.p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="absolute inset-0 flex items-start justify-center px-8 pt-16 pb-8 sm:relative sm:left-8 sm:left-16 sm:top-1/4 sm:-translate-y-1/2 sm:max-w-md"
        style={{ opacity: inEssenceSection }}
      >
        <div className="max-w-md text-center sm:text-left">
          <BlurText
            text="Pure essence, captured."
            delay={150}
            animateBy="words"
            direction="top"
            className="font-cormorant-garamond text-3xl sm:text-4xl sm:text-5xl text-white mb-6"
          />
          <div className="space-y-3">
            <motion.p 
              className="font-geist-sans text-white/80 text-base sm:text-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              A symphony of ingredients, transformed into liquid gold.
            </motion.p>
            <motion.p 
              className="font-geist-sans text-white/80 text-base sm:text-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Every drop carries soul of its origins—crafted to perfection.
            </motion.p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="absolute inset-0 flex items-start justify-center px-8 pt-16 pb-8 sm:relative sm:right-8 sm:right-16 sm:top-1/4 sm:-translate-y-1/2 sm:max-w-md"
        style={{ opacity: inCTASection }}
      >
        <div className="max-w-md text-center sm:text-right">
          <BlurText
            text="Find your signature."
            delay={150}
            animateBy="words"
            direction="top"
            className="font-cormorant-garamond text-3xl sm:text-4xl sm:text-5xl text-white mb-6"
          />
          <motion.p 
            className="font-geist-sans text-white/80 text-base sm:text-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            SCENTENCE. Where scent becomes essence.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
