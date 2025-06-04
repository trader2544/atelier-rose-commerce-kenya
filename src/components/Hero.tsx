
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-bg"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-rose-300/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-gold-300/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-20 w-8 h-8 bg-rose-200/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-gold-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-light text-gray-800 mb-6 tracking-wide">
            <span className="text-rose-600">Elso</span> Atelier
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            Discover elegance in every piece. Handcrafted luxury for the modern woman.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/shop">
              <Button className="btn-primary text-lg px-8 py-4 flex items-center space-x-2">
                <span>Shop Collection</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/about">
              <Button className="btn-secondary text-lg px-8 py-4">
                Our Story
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Product Spotlight */}
        <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="luxury-card max-w-sm mx-auto overflow-hidden">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&q=80"
                alt="Featured Product"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Rose Gold Collection</h3>
              <p className="text-gray-600 text-sm mb-3">Elegant pieces that define luxury</p>
              <Link to="/shop">
                <Button className="w-full btn-primary">
                  Explore Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
