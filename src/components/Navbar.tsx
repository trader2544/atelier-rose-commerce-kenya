
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import UserMenu from './UserMenu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useCart();
  const { user, isAdmin } = useAuth();
  const { isDark, setTheme } = useTheme();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/f3f4ab23-dc2f-4925-a596-a079b08ced43.png"
              alt="ELSO"
              className="h-8 w-auto sm:h-10"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-pink-600 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-foreground hover:text-pink-600 transition-colors">
              Shop
            </Link>
            <Link to="/about" className="text-foreground hover:text-pink-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-pink-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user && isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="border-pink-200 hover:bg-pink-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            
            <Link to="/cart" className="relative">
              <Button variant="outline" size="sm" className="border-pink-200 hover:bg-pink-50">
                <ShoppingCart className="h-4 w-4" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {state.itemCount}
                  </span>
                )}
              </Button>
            </Link>

            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <UserMenu />
            <Link to="/cart" className="relative">
              <Button variant="outline" size="sm" className="border-pink-200 hover:bg-pink-50 p-2">
                <ShoppingCart className="h-4 w-4" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {state.itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <button
              onClick={toggleMenu}
              className="text-foreground hover:text-pink-600 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-sm border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block py-2 text-foreground hover:text-pink-600 transition-colors"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block py-2 text-foreground hover:text-pink-600 transition-colors"
              onClick={closeMenu}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="block py-2 text-foreground hover:text-pink-600 transition-colors"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-foreground hover:text-pink-600 transition-colors"
              onClick={closeMenu}
            >
              Contact
            </Link>
            {user && isAdmin && (
              <Link
                to="/admin"
                className="block py-2 text-foreground hover:text-pink-600 transition-colors"
                onClick={closeMenu}
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
