
import React, { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import Newsletter from '@/components/Newsletter';
import { useInventory } from '@/hooks/useInventory';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, ShoppingCart } from 'lucide-react';

const Index = () => {
  const { items, loading } = useInventory();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    if (items.length > 0) {
      // Convert inventory items to display format and get featured ones
      const displayItems = items.flatMap(item => 
        item.variants.map(variant => ({
          id: `${item.item_id}-${variant.variant_id}`,
          name: `${item.name} ${variant.variant_name !== 'default' ? `(${variant.variant_name})` : ''}`,
          price: variant.price,
          images: variant.images.length > 0 ? variant.images : ['/placeholder.svg'],
          description: item.description || '',
          category: item.category,
          inStock: variant.quantity > 0,
          itemCode: item.item_code,
          quantity: variant.quantity
        }))
      );
      
      // Get random featured products (simulate featured flag)
      const shuffled = [...displayItems].sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 3));
    }
  }, [items]);

  const testimonials = [
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
    },
    {
      name: "Mary Achieng",
      text: "Fast delivery and authentic products. ELSO never disappoints!",
      rating: 5
    },
    {
      name: "Agnes Wambui",
      text: "The jewelry collection is stunning. Perfect for both casual and formal occasions.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
      <div className="love-shapes"></div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <Hero />

        {/* Featured Products */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
                Featured Collection
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our hand-picked selection of the season's most elegant pieces
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="animate-fade-in">
                    <Card className="glassmorphic hover:scale-105 transition-all duration-300 group overflow-hidden">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-pink-100 text-pink-800">Featured</Badge>
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="sm" className="bg-white/90 text-gray-800 hover:bg-white">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-medium text-gray-800 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-pink-600">
                            KSh {product.price.toLocaleString()}
                          </span>
                          <Badge className="bg-green-100 text-green-800">
                            {product.quantity} left
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center">
              <Link to="/shop">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white text-lg px-8 py-4">
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-6">
                  Crafted with Love, Designed for You
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  At ELSO, we believe every woman deserves to feel extraordinary. 
                  Our collection combines timeless elegance with contemporary style, 
                  creating pieces that celebrate your unique beauty and confidence.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  From our signature handbags to our exquisite jewelry, each item is 
                  carefully selected to enhance your personal style and complement your 
                  everyday moments with a touch of luxury.
                </p>
                <Link to="/about">
                  <Button className="bg-gray-600 hover:bg-gray-700 text-white">
                    Learn More About Us
                  </Button>
                </Link>
              </div>
              
              <div className="relative">
                <div className="glassmorphic overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=600&q=80"
                    alt="ELSO Lifestyle"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
                What Our Customers Say
              </h2>
            </div>

            {/* Desktop Testimonials */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <div key={index} className="glassmorphic text-center animate-fade-in p-6" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-pink-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                  <p className="font-medium text-gray-800">{testimonial.name}</p>
                </div>
              ))}
            </div>

            {/* Mobile Testimonials - Infinite Scroll */}
            <div className="md:hidden relative overflow-hidden">
              <div className="flex animate-scroll gap-4">
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <div key={index} className="glassmorphic text-center p-6 min-w-[280px] flex-shrink-0">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-pink-400 text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-4 text-sm">"{testimonial.text}"</p>
                    <p className="font-medium text-gray-800">{testimonial.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />
      </div>
    </div>
  );
};

export default Index;
