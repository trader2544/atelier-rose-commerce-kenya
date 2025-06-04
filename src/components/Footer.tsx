
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sparkle-effect">
            <h3 className="text-2xl font-light text-pink-400 mb-4 tracking-wider">
              ELSO Atelier
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Crafting elegance and luxury for the modern woman. Every piece tells a story of sophistication and beauty.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-pink-300">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-pink-300 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-gray-300 hover:text-pink-300 transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-pink-300 transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-pink-300 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-pink-300">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-300">Free Delivery: Kisumu CBD</span></li>
              <li><span className="text-gray-300">KSh 100: Outside Kisumu CBD</span></li>
              <li><span className="text-gray-300">KSh 300-450: Via Easy Coach</span></li>
              <li><span className="text-gray-300">Paybill: 880100</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-pink-300">Contact Us</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Kisumu, Kenya</p>
              <p>Phone: +254 745242174</p>
              <p>Email: elsokisumu@gmail.com</p>
              <p className="text-xs mt-3 text-pink-200">Orders must be placed through the website. We do not accept cash payments!</p>
            </div>
          </div>
        </div>

        <div className="border-t border-pink-800/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 ELSO Atelier. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">
              Privacy Policy
            </span>
            <span className="text-gray-400 text-sm">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
