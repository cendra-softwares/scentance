"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import BlurText from "./BlurText";
import { Button } from "./ui/button";
import { useCart } from "@/lib/store/useCart";
import { useProducts, Product } from "@/lib/hooks/useProducts";

const categories = ["All", "Original", "7A Master Copy"];

const getSpanClasses = (index: number) => {
  const pattern = [
    "col-span-2 lg:col-span-2 lg:row-span-2", // 0: Large Feature
    "col-span-1 lg:col-span-1 lg:row-span-1", // 1: Small
    "col-span-1 lg:col-span-1 lg:row-span-2", // 2: Tall
    "col-span-2 lg:col-span-2 lg:row-span-1", // 3: Wide
    "col-span-1 lg:col-span-1 lg:row-span-1", // 4: Small
    "col-span-1 lg:col-span-1 lg:row-span-2", // 5: Tall
    "col-span-2 lg:col-span-2 lg:row-span-2", // 6: Large
  ];
  return pattern[index % pattern.length];
};

function ProductCard({ product, index, spanClass }: { product: Product, index: number, spanClass: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { addItem } = useCart();

  const priceValue = parseFloat(product.price.replace(/,/g, '')) || 0;
  const discount = product.discount_percent || 0;
  const finalPrice = discount > 0 ? priceValue * (1 - discount / 100) : priceValue;
  const hasDiscount = discount > 0;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    } else {
      setIsHovered(!isHovered);
    }
  };

  const isActive = isMobile ? isExpanded : isHovered;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
      onMouseEnter={() => window.innerWidth >= 768 && setIsHovered(true)}
      onMouseLeave={() => window.innerWidth >= 768 && setIsHovered(false)}
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl lg:rounded-[3rem] cursor-pointer bg-neutral-900 ${spanClass} min-h-[200px] lg:min-h-0`}
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
      
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-80'}`} />

      <div className="absolute top-3 left-3 lg:top-6 lg:left-6 z-10">
        <span className="px-3 py-1 lg:px-4 lg:py-1.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-[8px] lg:text-[9px] uppercase tracking-[0.2em] text-white font-medium">
          {product.category}
        </span>
      </div>

      <div className="absolute inset-0 p-4 lg:p-10 flex flex-col justify-end z-10">
        <motion.div
          animate={{ y: isActive ? 0 : 8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-1 mb-2 lg:mb-4">
            <h3 className="text-white font-cormorant-garamond text-xl lg:text-3xl xl:text-5xl leading-[1] line-clamp-2">{product.name}</h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 lg:mt-2">
              {hasDiscount && (
                <span className="text-white/40 font-medium text-sm lg:text-xl xl:text-2xl line-through">
                  ₹{priceValue.toLocaleString("en-IN")}
                </span>
              )}
              <span className={`font-bold text-lg lg:text-2xl xl:text-3xl ${hasDiscount ? 'text-rose-400' : 'text-white/80'}`}>
                ₹{Math.round(finalPrice).toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <span className="px-2 py-1 lg:px-4 lg:py-2 bg-rose-600 text-white text-[10px] lg:text-base font-bold rounded-full shadow-lg shadow-rose-500/30">
                  -{discount}%
                </span>
              )}
              {product.volume && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-white/40 font-light text-[10px] lg:text-sm xl:text-base uppercase tracking-widest">
                    {product.volume.toLowerCase().includes('ml') ? product.volume : `${product.volume} ml`}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                className="lg:hidden"
              >
                <p className="text-white/50 text-xs mb-4 font-light tracking-wide line-clamp-2">
                  {product.notes}
                </p>
                
                <div className="flex gap-2">
                   <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem({
                        ...product,
                        price: String(Math.round(finalPrice)),
                        originalPrice: product.price,
                        discount_percent: product.discount_percent
                      });
                    }}
                    className="flex-1 bg-white text-black hover:bg-neutral-200 rounded-full py-3 font-bold uppercase tracking-widest text-[9px] transition-transform active:scale-[0.98]"
                  >
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(isHovered || isExpanded) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                className="hidden lg:block"
              >
                <p className="text-white/50 text-xs md:text-sm mb-8 font-light tracking-wide max-w-[90%]">
                  {product.notes}
                </p>
                
                <div className="flex gap-3">
                   <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem({
                        ...product,
                        price: String(Math.round(finalPrice)),
                        originalPrice: product.price,
                        discount_percent: product.discount_percent
                      });
                    }}
                    className="flex-1 bg-white text-black hover:bg-neutral-200 rounded-full py-6 font-bold uppercase tracking-widest text-[10px] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem({
                        ...product,
                        price: String(Math.round(finalPrice)),
                        originalPrice: product.price,
                        discount_percent: product.discount_percent
                      });
                    }}
                    className="w-14 h-14 rounded-full border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/20 p-0 text-xl"
                  >
                    +
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <p className="text-white/30 text-[10px] mt-2 hidden lg:block xl:hidden">
            {isExpanded ? 'Tap to collapse' : 'Hover for details'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ProductGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { products: dbProducts, loading, error } = useProducts();

  const filteredProducts = dbProducts.filter(p => 
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
                text="The Scentence Library" 
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
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-10 auto-rows-[220px] lg:auto-rows-[350px] grid-flow-row-dense max-w-[1600px] mx-auto min-h-[400px]"
      >
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-40">
              <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index} 
                spanClass={getSpanClasses(index)}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>
      
      <div className="mt-32 md:mt-48 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center gap-12"
        >
           <Link 
            href="/shop"
            className="group relative px-12 py-5 bg-white text-black rounded-full text-xs uppercase tracking-[0.4em] font-bold hover:scale-105 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)]"
           >
            Explore Full Collection
            <div className="absolute inset-0 rounded-full border border-white/20 scale-110 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500" />
           </Link>
           <div className="space-y-12">
             <p className="text-white/20 text-[10px] md:text-xs uppercase tracking-[0.8em]">Archives of Essence • Est. 1924</p>
             <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
           </div>
        </motion.div>
      </div>
    </section>
  );
}
