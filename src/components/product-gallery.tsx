"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import BlurText from "./BlurText";
import { Button } from "./ui/button";

const categories = ["All", "Original", "7A Master Copy"];

const products = [
  { id: 1, name: "Giorgio Armani Sì", category: "7A Master Copy", notes: "Blackcurrant, Freesia, May Rose", price: "₹1,900", image: "/images/IMG_4432.JPG.jpeg" },
  { id: 2, name: "N°5 Chanel EDP", category: "7A Master Copy", notes: "Aldehydes, Jasmine, Neroli", price: "₹2,600", image: "/images/IMG_4425.JPG.jpeg" },
  { id: 3, name: "Ombre Nomade Louis Vuitton", category: "7A Master Copy", notes: "Oud Wood, Benzoin, Raspberry", price: "₹2,800", image: "/images/IMG_4428.JPG.jpeg" },
  { id: 4, name: "Silver Birch", category: "Original", notes: "Birch Wood, Leather, Smoke", price: "₹2,600", image: "/images/IMG_4427.JPG.jpeg" },
  { id: 5, name: "Acqua di Giò Giorgio Armani", category: "Original", notes: "Marine Notes, Bergamot, Cedarwood", price: "₹1,900", image: "/images/IMG_4429.JPG.jpeg" },
  { id: 6, name: "Azure Breeze", category: "Original", notes: "Sea Salt, Sage, Ambrette", price: "₹2,600", image: "/images/IMG_4430.JPG.jpeg" },
  { id: 7, name: "Imagination Louis Vuitton", category: "7A Master Copy", notes: "Ambrosia, Citrus, Black Tea", price: "₹2,800", image: "/images/IMG_4433.JPG.jpeg" }
];

const getSpanClasses = (index: number) => {
  const pattern = [
    "col-span-2 md:col-span-2 md:row-span-2", // 0: Large Feature
    "col-span-1 md:col-span-1 md:row-span-1", // 1: Small
    "col-span-1 md:col-span-1 md:row-span-2", // 2: Tall
    "col-span-2 md:col-span-2 md:row-span-1", // 3: Wide
    "col-span-1 md:col-span-1 md:row-span-1", // 4: Small
    "col-span-1 md:col-span-1 md:row-span-2", // 5: Tall
    "col-span-2 md:col-span-2 md:row-span-2", // 6: Large
  ];
  return pattern[index % pattern.length];
};

function ProductCard({ product, index, spanClass }: { product: typeof products[0], index: number, spanClass: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
      className={`group relative overflow-hidden rounded-[2rem] md:rounded-[3rem] cursor-pointer bg-neutral-900 ${spanClass} h-full`}
    >
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      >
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-700 group-hover:opacity-70" 
        />
      </motion.div>
      
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-70'}`} />

      <div className="absolute top-6 left-6 z-10">
        <span className="px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-[9px] uppercase tracking-[0.2em] text-white font-medium">
          {product.category}
        </span>
      </div>

      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end z-10">
        <motion.div
          animate={{ y: isHovered ? 0 : 15 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-1 mb-4">
            <h3 className="text-white font-cormorant-garamond text-3xl md:text-5xl leading-[1]">{product.name}</h3>
            <span className="text-white/80 font-light text-lg md:text-2xl mt-1">
              {product.price}
            </span>
          </div>
          
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-white/50 text-xs md:text-sm mb-8 font-light tracking-wide max-w-[90%]">
                  {product.notes}
                </p>
                
                <div className="flex gap-3">
                   <Button className="flex-1 bg-white text-black hover:bg-neutral-200 rounded-full py-6 font-bold uppercase tracking-widest text-[10px] transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="w-14 h-14 rounded-full border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/20 p-0 text-xl">
                    +
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ProductGallery() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = products.filter(p => 
    activeCategory === "All" || p.category === activeCategory
  );

  return (
    <section className="w-full py-24 md:py-48 px-6 sm:px-12 lg:px-24 bg-black overflow-hidden">
      <div className="max-w-[1600px] mx-auto mb-20 md:mb-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <span className="text-white/30 text-xs uppercase tracking-[0.5em] mb-8 block">Private Collection</span>
              <BlurText 
                text="The Scentance Library" 
                className="font-cormorant-garamond text-7xl md:text-9xl lg:text-[10rem] font-medium text-white leading-[0.8] mb-12"
                delay={100}
              />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="text-white/40 text-lg md:text-2xl font-light leading-relaxed max-w-2xl"
            >
              Discover a meticulously curated archive of essence. From avant-garde originals to timeless master compositions.
            </motion.p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] transition-all duration-700 border ${
                  activeCategory === cat 
                  ? "bg-white text-black border-white scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]" 
                  : "bg-transparent text-white/30 border-white/5 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 auto-rows-[250px] md:auto-rows-[350px] grid-flow-row-dense max-w-[1600px] mx-auto"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index} 
              spanClass={getSpanClasses(index)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      
      <div className="mt-32 md:mt-48 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
           <p className="text-white/20 text-[10px] md:text-xs uppercase tracking-[0.8em] mb-12">Archives of Essence • Est. 1924</p>
           <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}
