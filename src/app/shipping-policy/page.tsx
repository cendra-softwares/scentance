"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-12 border-b border-neutral-800 pb-4">Shipping Policy</h1>
        
        <div className="space-y-10 text-neutral-300 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-white italic">1. Order Processing</h2>
            <p>
              All orders are processed within 1-2 business days. Orders are not shipped or delivered 
              on weekends or public holidays.
            </p>
            <p>
              If we are experiencing a high volume of orders, shipments may be delayed by a few days. 
              Please allow additional days in transit for delivery. If there will be a significant 
              delay in shipment of your order, we will contact you via email or phone.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-white italic">2. Shipping Rates & Delivery Estimates</h2>
            <p>
              Shipping charges for your order will be calculated and displayed at checkout.
            </p>
            <div className="bg-neutral-900/50 overflow-hidden rounded-xl border border-neutral-800">
              <table className="w-full text-left">
                <thead className="bg-neutral-800/50 text-white border-b border-neutral-800">
                  <tr>
                    <th className="px-6 py-4 font-serif italic">Shipping Method</th>
                    <th className="px-6 py-4 font-serif italic">Estimated Delivery</th>
                    <th className="px-6 py-4 font-serif italic">Shipment Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  <tr>
                    <td className="px-6 py-4">Standard Shipping</td>
                    <td className="px-6 py-4">5-7 business days</td>
                    <td className="px-6 py-4">Calculated at checkout</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Express Shipping</td>
                    <td className="px-6 py-4">2-3 business days</td>
                    <td className="px-6 py-4">Calculated at checkout</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-neutral-500 italic">
              * Delivery delays can occasionally occur due to logistics or customs issues.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-white italic">3. Shipment Confirmation & Order Tracking</h2>
            <p>
              You will receive a Shipment Confirmation email once your order has shipped containing 
              your tracking number(s). The tracking number will be active within 24 hours.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-white italic">4. Customs, Duties, and Taxes</h2>
            <p>
              Scentence is not responsible for any customs and taxes applied to your order. 
              All fees imposed during or after shipping are the responsibility of the customer 
              (tariffs, taxes, etc.).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-white italic">5. Damages</h2>
            <p>
              Scentence is not liable for any products damaged or lost during shipping. If you received 
              your order damaged, please contact the shipment carrier to file a claim.
            </p>
            <p>
              Please save all packaging materials and damaged goods before filing a claim.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
