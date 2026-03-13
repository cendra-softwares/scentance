import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-neutral-300">
      <h1 className="text-4xl font-serif text-white mb-12 border-b border-neutral-800 pb-4">Privacy Policy</h1>
      
      <div className="space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
          <p>
            Welcome to Scentence. We value your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>
          <p>We may collect information that you provide directly to us, including:</p>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>Contact information (such as name, email address, and phone number)</li>
            <li>Shipping and billing addresses</li>
            <li>Payment information (processed securely through our payment partners)</li>
            <li>Order history and preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders and provide customer support</li>
            <li>Send you marketing communications (if you have opted in)</li>
            <li>Improve our website and services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against 
            unauthorized access, loss, or alteration. However, no method of transmission over the internet is 
            100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            Email: <a href="mailto:Scentence.in@gmail.com" className="text-white hover:underline">Scentence.in@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
