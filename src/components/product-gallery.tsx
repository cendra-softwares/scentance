"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";
import BlurText from "./BlurText";
import { Button } from "./ui/button";

const categories = ["All", "Floral", "Woody", "Oriental", "Fresh"];

const products = [
  { id: 1, name: "Lumière Noire", category: "Floral", notes: "Rose, Patchouli, Saffron", price: "$180", image: "/images/Mock_1.png" },
  { id: 2, name: "Oud Saphir", category: "Woody", notes: "Bergamot, Oud, Leather", price: "$210", image: "/images/Mock_2.png" },
  { id: 3, name: "Santal Vénitien", category: "Woody", notes: "Sandalwood, Cardamom", price: "$165", image: "/images/Mock_4.png" },
  { id: 4, name: "Figue Blanche", category: "Fresh", notes: "Fig, Jasmine, Cedar", price: "$140", image: "/images/Mock_5.png" },
  { id: 5, name: "Nuit Désert", category: "Oriental", notes: "Incense, Amber, Vanilla", price: "$195", image: "/images/Mock_8.png" },
  { id: 6, name: "Ambre Stella", category: "Oriental", notes: "Amber, Labdanum, Vanilla", price: "$175", image: "/images/Mock_1.png" },
  { id: 7, name: "Iris Céleste", category: "Floral", notes: "Iris, Violet, Musk", price: "$150", image: "/images/Mock_2.png" },
  { id: 8, name: "Vetiver Zeste", category: "Fresh", notes: "Vetiver, Grapefruit", price: "$130", image: "/images/Mock_4.png" },
  { id: 9, name: "Cèdre Atlas", category: "Woody", notes: "Cedarwood, Lemon, Jasmine", price: "$160", image: "/images/Mock_5.png" },
  { id: 10, name: "Vanille Antique", category: "Oriental", notes: "Vanilla, Cashmere, Musk", price: "$200", image: "/images/Mock_8.png" },
  { id: 11, name: "Rose Épicée", category: "Floral", notes: "Rose, Pink Pepper, Amber", price: "$185", image: "/images/Mock_1.png" },
  { id: 12, name: "Bergamote Soleil", category: "Fresh", notes: "Bergamot, Lavender, Oakmoss", price: "$145", image: "/images/Mock_2.png" },
  { id: 13, name: "Cuir Noir", category: "Woody", notes: "Leather, Tobacco, Tonka", price: "$220", image: "/images/Mock_4.png" },
  { id: 14, name: "Fleur de Lys", category: "Floral", notes: "Lily, Jasmine, Tuberose", price: "$170", image: "/images/Mock_5.png" },
  { id: 15, name: "Ébène Fumée", category: "Woody", notes: "Ebony Wood, Incense", price: "$250", image: "/images/Mock_8.png" }
];

const getSpanClasses = (index: number) => {
  const pattern = [
    "md:col-span-2 md:row-span-2", // 0: Large
    "col-span-1 row-span-1",       // 1: Normal
    "col-span-1 md:row-span-2",    // 2: Tall
    "md:col-span-2 row-span-1",    // 3: Wide
    "col-span-1 row-span-1",       // 4: Normal
    "col-span-1 row-span-1",       // 5: Normal
    "md:col-span-2 md:row-span-2", // 6: Large
    "col-span-1 row-span-1",       // 7: Normal
    "col-span-1 md:row-span-2",    // 8: Tall
    "col-span-1 row-span-1",       // 9: Normal
    "md:col-span-2 row-span-1",    // 10: Wide
    "col-span-1 row-span-1",       // 11: Normal
    "col-span-1 row-span-1",       // 12: Normal
    "col-span-1 md:row-span-2",    // 13: Tall
    "md:col-span-2 md:row-span-2", // 14: Large
  ];
  return pattern[index % pattern.length];
};

function ProductCard({ product, index, spanClass }: { product: typeof products[0], index: number, spanClass: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: (index % 5) * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-[2.5rem] cursor-pointer bg-neutral-900 ${spanClass} h-full`}
    >
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-500 group-hover:opacity-80" 
        />
      </motion.div>
      
      {/* Dynamic Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-90' : 'opacity-60'}`} />

      {/* Product Category Tag */}
      <div className="absolute top-6 left-6 z-10">
        <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] uppercase tracking-widest text-white/90 font-medium">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
        <motion.div
          animate={{ y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.5, ease: "circOut" }}
        >
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-white font-cormorant-garamond text-3xl md:text-4xl leading-tight max-w-[70%]">{product.name}</h3>
            <span className="text-white/90 font-medium text-xl">
              {product.price}
            </span>
          </div>
          
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-white/60 text-sm mb-6 font-light tracking-wide">
                  {product.notes}
                </p>
                
                <div className="flex gap-2">
                   <Button className="flex-1 bg-white text-black hover:bg-neutral-200 rounded-full py-6 font-semibold uppercase tracking-tighter text-xs">
                    Quick Add
                  </Button>
                  <Button variant="outline" className="w-12 h-12 rounded-full border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/20 p-0">
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
    <section className="w-full py-32 px-4 sm:px-8 lg:px-12 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <BlurText 
              text="The Scentance Library" 
              className="font-cormorant-garamond text-6xl md:text-7xl lg:text-8xl font-medium mb-8 text-white leading-[0.9]"
              delay={100}
            />
            <p className="text-muted-foreground md:text-xl font-light">
              Each bottle in our collection represents a unique olfactory narrative, meticulously composed for those who seek the extraordinary.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat 
                  ? "bg-white text-black font-bold" 
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
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
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[350px] grid-flow-row-dense max-w-[1500px] mx-auto"
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
      
      <div className="mt-24 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
           <p className="text-white/30 text-xs uppercase tracking-[0.5em] mb-8">Crafting essence since 1924</p>
           <div className="h-px w-24 bg-white/20 mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}
