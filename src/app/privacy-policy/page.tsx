"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-12 border-b border-neutral-800 pb-4">Privacy Policy</h1>
        
        <div className="space-y-10 text-neutral-300 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-white italic">1. Introduction</h2>
            <p>
              Welcome to Scentence. We value your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-white italic">2. Information We Collect</h2>
            <p>We may collect information that you provide directly to us, including:</p>
            <ul className="list-disc ml-6 space-y-2 text-neutral-400">
              <li>Contact information (such as name, email address, and phone number)</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information (processed securely through our payment partners)</li>
              <li>Order history and preferences</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-white italic">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc ml-6 space-y-2 text-neutral-400">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and provide customer support</li>
              <li>Send you marketing communications (if you have opted in)</li>
              <li>Improve our website and services</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-white italic">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against 
              unauthorized access, loss, or alteration. However, no method of transmission over the internet is 
              100% secure.
            </p>
          </section>

          <section className="space-y-4 border-t border-neutral-800 pt-8">
            <h2 className="text-2xl font-serif text-white italic">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:Scentence.in@gmail.com" className="text-white hover:underline transition-all">Scentence.in@gmail.com</a>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
