
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Heart, Search, Shield } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from './UserMenu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useCart();
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/2775f7ab-5f14-4745-8ef9-2f8676acd727.png" 
              alt="ELSO Boutique Logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium tracking-wide transition-colors ${
                isActive('/') ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`font-medium tracking-wide transition-colors ${
                isActive('/shop') ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className={`font-medium tracking-wide transition-colors ${
                isActive('/about') ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`font-medium tracking-wide transition-colors ${
                isActive('/contact') ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-pink-600 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="text-gray-700 hover:text-pink-500 transition-colors">
              <Heart className="h-5 w-5" />
            </button>
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-pink-600 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
            {user && isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-pink-600 transition-colors"
                title="Admin Dashboard"
              >
                <Shield className="h-5 w-5" />
              </Link>
            )}
            <UserMenu />
          </div>

          {/* Mobile menu button and actions */}
          <div className="md:hidden flex items-center space-x-4">
            {user && isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-pink-600 transition-colors"
                title="Admin Dashboard"
              >
                <Shield className="h-5 w-5" />
              </Link>
            )}
            <UserMenu />
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-pink-600 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-slate-200">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive('/') ? 'text-pink-600 bg-pink-50' : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive('/shop') ? 'text-pink-600 bg-pink-50' : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                }`}
              >
                Shop
              </Link>
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive('/about') ? 'text-pink-600 bg-pink-50' : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive('/contact') ? 'text-pink-600 bg-pink-50' : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
