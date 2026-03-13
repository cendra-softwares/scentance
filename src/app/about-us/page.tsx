"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutUs() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-12 border-b border-neutral-800 pb-4">About Us</h1>
        
        <div className="space-y-12 text-neutral-300 leading-relaxed text-lg">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-white italic">The Essence of Scentence</h2>
            <p>
              Scentence was born from a singular vision: to treat fragrance not merely as a product, but as a woven 
              extension of one&apos;s essence. We believe that every scent tells a story, and every bottle holds 
              a memory waiting to be unlocked.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-serif text-white italic">Curated Excellence</h2>
              <p>
                Our collection is a meticulously archived selection of the world&apos;s most evocative scents. 
                From avant-garde originals that push the boundaries of modern perfumery to timeless master 
                compositions that have defined elegance for generations.
              </p>
            </div>
            <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800 backdrop-blur-sm">
              <p className="italic text-neutral-400 text-center">
                &ldquo;A fragrance is a biography in a bottle, a silent narrative that lingers long after 
                the wearer has left the room.&rdquo;
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-white italic">Our Commitment</h2>
            <p>
              We are dedicated to providing an unparalleled olfactory experience. Our team scours the globe 
              to bring you niche and premium fragrances that are often hard to find, ensuring that our 
              community has access to the very best that the world of scent has to offer.
            </p>
          </section>

          <div className="pt-8 border-t border-neutral-800">
            <p className="text-center font-serif text-white italic text-xl">
              Discover your signature scent with Scentence.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
