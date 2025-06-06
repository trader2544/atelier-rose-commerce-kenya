
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
        <div className="absolute top-40 right-20 w-6 h-6 bg-pink-300/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-20 w-8 h-8 bg-rose-200/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-pink-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-800 mb-6 sm:mb-8">
            Welcome to <span className="text-pink-600">ELSO</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-6 sm:mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            Discover elegance in every piece. Handcrafted luxury for the modern woman.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 sm:mb-12">
            <Link to="/shop">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all">
                <span>Shop Collection</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            
            <Link to="/about">
              <Button className="bg-gray-600 hover:bg-gray-700 text-white text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl transition-all">
                Our Story
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-12 sm:mt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="glassmorphic max-w-xs sm:max-w-sm mx-auto overflow-hidden">
            <div className="relative">
              <img
                src="/lovable-uploads/0525f4a8-9906-49c9-bb80-531c27a15228.png"
                alt="ELSO Hero"
                className="w-full h-36 sm:h-48 object-cover"
              />
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-pink-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                New Collection
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">Luxury Collection</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3">Elegant pieces that define luxury</p>
              <Link to="/shop">
                <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white text-sm">
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
