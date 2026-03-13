import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-neutral-300">
      <h1 className="text-4xl font-serif text-white mb-12 border-b border-neutral-800 pb-4">Terms & Conditions</h1>
      
      <div className="space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Scentence website, you agree to comply with and be bound by these 
            Terms & Conditions. If you do not agree to these terms, please refrain from using our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">2. Product Information</h2>
          <p>
            We strive to provide accurate descriptions and images of our fragrances. However, we do not 
            warrant that the descriptions or other content are entirely accurate, complete, or error-free. 
            The actual color and appearance of products may vary slightly from what is shown on your screen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">3. Pricing and Payments</h2>
          <p>
            All prices are subject to change without notice. We reserve the right to modify or discontinue 
            a product at any time. Payment must be made in full at the time of purchase. We use secure 
            third-party payment processors to handle all transactions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">4. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and images, is the property of 
            Scentence and is protected by intellectual property laws. You may not use, reproduce, or 
            distribute any content without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
          <p>
            Scentence shall not be liable for any direct, indirect, incidental, or consequential damages 
            arising from the use of our products or website. Our liability is limited to the purchase 
            price of the product in question.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">6. Governing Law</h2>
          <p>
            These Terms & Conditions shall be governed by and construed in accordance with the laws of India.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">7. Contact Us</h2>
          <p>
            If you have any questions regarding these Terms & Conditions, please contact us at:
            <br />
            Email: <a href="mailto:Scentence.in@gmail.com" className="text-white hover:underline">Scentence.in@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
