import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Footer = () => {
  return (
    <motion.footer
      className="bg-background text-muted-foreground py-8 border-t border-border mt-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
          <Link href="#" className="hover:text-foreground transition-colors text-glow">
            Privacy Policy
          </Link>
          <span className="hidden md:inline-block">|</span>
          <Link href="#" className="hover:text-foreground transition-colors text-glow">
            Terms of Service
          </Link>
          <span className="hidden md:inline-block">|</span>
          <Link href="#" className="hover:text-foreground transition-colors text-glow">
            Contact
          </Link>
        </div>
        <p className="text-sm text-glow">
          &copy; {new Date().getFullYear()} SCENTENCE. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;