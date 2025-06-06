
import React from 'react';
import { Heart, Star, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
      <div className="love-shapes"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-6">
            About <span className="text-pink-600">ELSO</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover elegance in every piece. Handcrafted luxury for the modern woman.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-fade-in">
            <h2 className="text-3xl font-light text-gray-800 mb-6">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              At ELSO, we believe every woman deserves to feel extraordinary. Our collection combines 
              timeless elegance with contemporary style, creating pieces that celebrate your unique 
              beauty and confidence.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              From our signature handbags to our exquisite jewelry, each item is carefully selected 
              to enhance your personal style and complement your everyday moments with a touch of luxury.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We are committed to providing authentic, high-quality products that make every woman 
              feel beautiful and confident in her own skin.
            </p>
          </div>
          
          <div className="relative">
            <div className="glassmorphic overflow-hidden">
              <img
                src="/lovable-uploads/7fb8d56d-1e3c-4ef0-a38d-ffb85e06747e.png"
                alt="ELSO Story"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-light text-gray-800 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glassmorphic text-center p-8">
              <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-4">Crafted with Love</h3>
              <p className="text-gray-600">
                Every piece in our collection is carefully selected with love and attention to detail, 
                ensuring the highest quality for our customers.
              </p>
            </div>
            
            <div className="glassmorphic text-center p-8">
              <Star className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-4">Exceptional Quality</h3>
              <p className="text-gray-600">
                We source only authentic, premium materials and work with trusted suppliers to 
                deliver products that exceed expectations.
              </p>
            </div>
            
            <div className="glassmorphic text-center p-8">
              <Award className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-4">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We provide exceptional customer service and 
                stand behind every product we sell.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="glassmorphic p-8 text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-6">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">Phone</h3>
              <p>+254 745 242 174</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Email</h3>
              <p>elsokisumu@gmail.com</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Location</h3>
              <p>Kisumu, Kenya</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
