"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { MdOutlineMail, MdLocationOn } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContactForm } from '@/lib/actions';
import { toast } from 'sonner';

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    
    const result = await submitContactForm({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success('Message sent! We\'ll get back to you soon.');
      // Reset form
      (document.getElementById('contact-form') as HTMLFormElement)?.reset();
    } else {
      toast.error(result.error || 'Failed to send message. Please try again.');
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-12 border-b border-neutral-800 pb-4">Contact Us</h1>
        
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-2xl font-serif text-white italic">Get in Touch</h2>
              <p className="text-neutral-400 leading-relaxed">
                Have a question about a specific fragrance or need assistance with your order? 
                Our team is here to help you find the perfect essence.
              </p>
            </section>

            <div className="space-y-6">
              <a href="mailto:Scentence.in@gmail.com" className="flex items-center gap-4 text-neutral-300 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-neutral-700 transition-colors">
                  <MdOutlineMail className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Email us</p>
                  <p className="font-medium">Scentence.in@gmail.com</p>
                </div>
              </a>

              <a href="https://wa.me/919188645067" className="flex items-center gap-4 text-neutral-300 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-neutral-700 transition-colors">
                  <FaWhatsapp className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">WhatsApp</p>
                  <p className="font-medium">+91 9188645067</p>
                </div>
              </a>

              <a href="https://www.instagram.com/scentenceparfum/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-neutral-300 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-neutral-700 transition-colors">
                  <FaInstagram className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Instagram</p>
                  <p className="font-medium">@scentenceparfum</p>
                </div>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-neutral-900/40 p-8 rounded-3xl border border-neutral-800 backdrop-blur-md">
            <form id="contact-form" action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-neutral-300">Full Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="John Doe" 
                  required
                  minLength={1}
                  maxLength={100}
                  className="bg-black/20 border-neutral-800" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-300">Email Address</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="john@example.com" 
                  required
                  className="bg-black/20 border-neutral-800" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-neutral-300">Your Message</Label>
                <Textarea 
                  id="message" 
                  name="message"
                  placeholder="How can we help you?" 
                  required
                  minLength={10}
                  maxLength={2000}
                  className="bg-black/20 border-neutral-800 min-h-[150px]" 
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-neutral-200 transition-colors font-medium py-6 rounded-xl disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
