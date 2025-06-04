
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-6">
            About Elso Atelier
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Where elegance meets craftsmanship, and every piece tells a story of sophistication.
          </p>
        </div>

        {/* Story Section */}
        <div className="luxury-card mb-12">
          <div className="p-8">
            <h2 className="text-2xl font-medium text-gray-800 mb-6">Our Story</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded in the heart of Nairobi, Elso Atelier was born from a passion for creating timeless pieces 
                that celebrate the modern woman's journey. Our founder, inspired by the rich cultural heritage of 
                Kenya and the contemporary elegance of global fashion, envisioned a brand that would bridge 
                tradition with innovation.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Each piece in our collection is carefully curated and crafted with attention to detail that 
                reflects our commitment to quality and elegance. We believe that luxury should be accessible, 
                and that every woman deserves to feel confident and beautiful in what she wears.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From our signature handbags to our exquisite jewelry collection, every item is chosen to 
                complement the sophisticated lifestyle of our customers while maintaining the highest 
                standards of craftsmanship and ethical sourcing.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="luxury-card text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Quality</h3>
              <p className="text-gray-600 text-sm">
                We source only the finest materials and work with skilled artisans to ensure every piece meets our high standards.
              </p>
            </div>
          </div>

          <div className="luxury-card text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Elegance</h3>
              <p className="text-gray-600 text-sm">
                Our designs embody timeless elegance, creating pieces that remain beautiful and relevant for years to come.
              </p>
            </div>
          </div>

          <div className="luxury-card text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Sustainability</h3>
              <p className="text-gray-600 text-sm">
                We are committed to ethical sourcing and sustainable practices that respect both people and the environment.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="luxury-card">
          <div className="p-8">
            <h2 className="text-2xl font-medium text-gray-800 mb-6 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-rose-200 to-rose-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-white">ES</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Elsie Wanjiku</h3>
                <p className="text-rose-600 mb-2">Founder & Creative Director</p>
                <p className="text-gray-600 text-sm">
                  With over 10 years of experience in fashion and design, Elsie brings her vision of accessible luxury to life.
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-rose-200 to-rose-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-white">AM</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Alice Mwangi</h3>
                <p className="text-rose-600 mb-2">Head of Operations</p>
                <p className="text-gray-600 text-sm">
                  Alice ensures that every aspect of our operations runs smoothly, from sourcing to customer service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
