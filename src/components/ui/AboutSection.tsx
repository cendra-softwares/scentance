import React from "react";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.h2
        className="text-4xl font-cormorant-garamond font-medium text-center text-foreground mb-8 text-glow"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        Our Philosophy
      </motion.h2>
      <motion.p
        className="text-lg text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        At SCENTENCE, we believe that fragrance is an art form, a delicate symphony of notes that evokes emotions and memories. Each of our creations is a testament to timeless elegance and unparalleled craftsmanship. We meticulously source the finest ingredients from around the globe, ensuring every drop embodies purity and sophistication. Our commitment is to offer not just perfumes, but experiences that linger, leaving an indelible mark on your senses and soul. Discover the essence of luxury, crafted for the discerning individual.
      </motion.p>
    </section>
  );
};

export default AboutSection;