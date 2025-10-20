import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { MdOutlineMail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-14 pb-4 px-4 sm:px-6 lg:px-8 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: Brand and Description */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">SCENTENCE</h3>
          <p className="text-neutral-400 leading-relaxed">
            Discover your signature scent with our exclusive collection of fine fragrances.
          </p>
        </div>
        
        {/* Column 2: Contact */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Contact Us</h3>
          <ul className="space-y-2 text-neutral-400">
            <li>
              <a href="mailto:Scentence.in@gmail.com" className="hover:text-white flex items-center gap-2">
                <MdOutlineMail /> Scentence.in@gmail.com
              </a>
            </li>
            <li>
              <a href="https://wa.me/919188645067" className="hover:text-white flex items-center gap-2">
                <FaWhatsapp /> +91 9188645067
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Follow Us */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Follow Us</h3>
          <ul className="space-y-2 text-neutral-400">
            <li>
              <a href="https://www.instagram.com/scentence.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2">
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