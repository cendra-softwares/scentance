import React from 'react';

export default function RefundReturnPolicy() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-neutral-300">
      <h1 className="text-4xl font-serif text-white mb-12 border-b border-neutral-800 pb-4">Refund & Return Policy</h1>
      
      <div className="space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">1. No Returns Policy</h2>
          <p>
            Due to the nature of our products (perfumes and fragrances) and for hygiene and safety reasons, 
            <strong> we do not accept returns or offer refunds</strong> once a product has been purchased and delivered.
          </p>
          <p className="mt-4">
            Perfumes are personal care items that cannot be resold once opened or handled, as the integrity 
            of the scent and bottle cannot be guaranteed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">2. Damaged or Wrong Items</h2>
          <p>
            While we do not offer standard returns, we are committed to your satisfaction. If you receive 
            a product that is damaged during transit or if you receive the wrong item, please contact us 
            within 48 hours of delivery.
          </p>
          <p className="mt-4">
            To be eligible for a replacement in these specific cases:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>The issue must be reported within 48 hours of delivery.</li>
            <li>You must provide proof of purchase and clear photographic evidence of the damage or the wrong item.</li>
            <li>The item must be in its original packaging.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">3. Process for Replacements</h2>
          <p>
            Once your claim is inspected and approved, we will initiate a replacement for the same product. 
            If the product is out of stock, we may offer an alternative or a store credit at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">4. Contact Information</h2>
          <p>
            For any issues regarding your order, please reach out to us at:
            <br />
            Email: <a href="mailto:Scentence.in@gmail.com" className="text-white hover:underline">Scentence.in@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
