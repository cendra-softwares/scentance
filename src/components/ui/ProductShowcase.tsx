import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  description: string;
  imageUrl: string;
  price: string;
}

const ProductCard = ({ name, description, imageUrl, price }: ProductCardProps) => {
  return (
    <motion.div
      className="relative group overflow-hidden rounded-lg border-[0.75px] border-border bg-card shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="relative w-full h-60">
        <Image
          src={imageUrl}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-foreground text-glow">{name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <p className="mt-2 text-lg font-medium text-primary text-glow">{price}</p>
        <Button
          variant="outline"
          className="mt-4 w-full text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-background"
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
};

interface ProductShowcaseProps {
  products: ProductCardProps[];
}

const ProductShowcase = ({ products }: ProductShowcaseProps) => {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-cormorant-garamond font-medium text-center text-foreground mb-12 text-glow">
        Our Exquisite Collections
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </section>
  );
};

export default ProductShowcase;