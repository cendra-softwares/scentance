import React from 'react';
import { motion } from 'framer-motion';

export default function RefundReturnPolicy() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-12 border-b border-neutral-800 pb-4">Refund & Return Policy</h1>
        
        <div className="space-y-10 text-neutral-300 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-white italic">1. No Returns Policy</h2>
            <p>
              Due to the nature of our products (perfumes and fragrances) and for hygiene and safety reasons, 
              <strong className="text-white"> we do not accept returns or offer refunds</strong> once a product has been purchased and delivered.
            </p>
            <p>
              Perfumes are personal care items that cannot be resold once opened or handled, as the integrity 
              of the scent and bottle cannot be guaranteed.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-white italic">2. Damaged or Wrong Items</h2>
            <p>
              While we do not offer standard returns, we are committed to your satisfaction. If you receive 
              a product that is damaged during transit or if you receive the wrong item, please contact us 
              within 48 hours of delivery.
            </p>
            <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
              <p className="mb-4 text-white">To be eligible for a replacement:</p>
              <ul className="list-disc ml-6 space-y-2 text-neutral-400">
                <li>The issue must be reported within 48 hours of delivery.</li>
                <li>You must provide proof of purchase and clear photographic evidence of the damage.</li>
                <li>The item must be in its original packaging.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-white italic">3. Process for Replacements</h2>
            <p>
              Once your claim is inspected and approved, we will initiate a replacement for the same product. 
              If the product is out of stock, we may offer an alternative or a store credit at our discretion.
            </p>
          </section>

          <section className="space-y-4 border-t border-neutral-800 pt-8">
            <h2 className="text-2xl font-serif text-white italic">4. Contact Information</h2>
            <p>
              For any issues regarding your order, please reach out to us at:
              <br />
              <a href="mailto:Scentence.in@gmail.com" className="text-white hover:underline transition-all">Scentence.in@gmail.com</a>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
