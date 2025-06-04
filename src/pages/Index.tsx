
import React from 'react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import Newsletter from '@/components/Newsletter';
import { products } from '@/data/products';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const featuredProducts = products.filter(product => product.featured).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our hand-picked selection of the season's most elegant pieces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <div key={product.id} className="animate-fade-in">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/shop">
              <Button className="btn-primary text-lg px-8 py-4">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gradient-to-r from-rose-50 to-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-6">
                Crafted with Love, Designed for You
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                At Elso Atelier, we believe every woman deserves to feel extraordinary. 
                Our collection combines timeless elegance with contemporary style, 
                creating pieces that celebrate your unique beauty and confidence.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                From our signature handbags to our exquisite jewelry, each item is 
                carefully selected to enhance your personal style and complement your 
                everyday moments with a touch of luxury.
              </p>
              <Link to="/about">
                <Button className="btn-secondary">
                  Learn More About Us
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="luxury-card overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=600&q=80"
                  alt="Elso Atelier Lifestyle"
                  className="w-full h-80 object-cover"
                />
              </div>
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-200/30 rounded-full animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gold-300/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Wanjiku",
                text: "The quality is amazing and the designs are so elegant. I always feel confident wearing pieces from Elso Atelier.",
                rating: 5
              },
              {
                name: "Grace Muthoni",
                text: "Beautiful handbags that go with everything. The customer service is also exceptional.",
                rating: 5
              },
              {
                name: "Jennifer Kimani",
                text: "I love the attention to detail in every piece. Truly luxurious yet accessible.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="luxury-card text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                  <p className="font-medium text-gray-800">{testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default Index;
