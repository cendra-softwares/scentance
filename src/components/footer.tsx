import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { MdOutlineMail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-14 pb-4 px-4 sm:px-6 lg:px-8 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
        
        {/* Column 1: Brand and Description */}
        <div className="space-y-3 col-span-2 md:col-span-1">
          <h3 className="text-lg font-semibold tracking-wider">SCENTENCE</h3>
          <p className="text-neutral-400 leading-relaxed">
            Discover your signature scent with our exclusive collection of fine fragrances.
          </p>
        </div>
        
        {/* Column 2: Contact */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Contact Us</h3>
          <ul className="space-y-2 text-neutral-400">
            <li>
              <a href="mailto:Scentence.in@gmail.com" className="hover:text-white flex items-center gap-2 transition-colors">
                <MdOutlineMail /> Scentence.in@gmail.com
              </a>
            </li>
            <li>
              <a href="https://wa.me/919188645067" className="hover:text-white flex items-center gap-2 transition-colors">
                <FaWhatsapp /> +91 9188645067
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Policies */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Legal</h3>
          <ul className="space-y-2 text-neutral-400">
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/refund-return-policy" className="hover:text-white transition-colors">
                Refund & Return
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Follow Us */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Follow Us</h3>
          <ul className="space-y-2 text-neutral-400">
            <li>
              <a href="https://www.instagram.com/scentence.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2 transition-colors">
                <FaInstagram /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="mt-12 text-center text-neutral-500">
        <p>&copy; {new Date().getFullYear()} Scentence. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;