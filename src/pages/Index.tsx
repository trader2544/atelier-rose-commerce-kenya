import React, { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import Newsletter from '@/components/Newsletter';
import ProductModal from '@/components/ProductModal';
import { useInventory } from '@/hooks/useInventory';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, ShoppingCart, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { items, loading } = useInventory();
  const { dispatch } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (items.length > 0) {
      // Get featured products from database
      const featured = items.filter(item => item.featured).slice(0, 5);
      setFeaturedProducts(featured);
    }
  }, [items]);

  const handleAddToCart = (product: any) => {
    if (!product.in_stock) {
      toast({
        title: "Out of Stock",
        description: "This item is currently unavailable.",
        variant: "destructive",
      });
      return;
    }
    
    dispatch({ type: 'ADD_TO_CART', product: {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images || ['/placeholder.svg'],
      category: product.category,
      description: product.description,
      inStock: product.in_stock
    }});
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

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
      
      {/* WhatsApp Float */}
      <a
        href="https://wa.me/254745242174"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <Hero />

        {/* Featured Products */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-4">
                Featured Collection
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                Discover our hand-picked selection of the season's most elegant pieces
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 sm:h-64 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-8 mb-8 sm:mb-12">
                {featuredProducts.map((product, index) => (
                  <div key={product.id} className="animate-fade-in">
                    <Card className="glassmorphic hover:scale-105 transition-all duration-300 group overflow-hidden">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
                          <Badge className="bg-pink-100 text-pink-800 text-xs">Featured</Badge>
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 sm:gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleViewProduct(product)}
                            className="bg-white/90 text-gray-800 hover:bg-white text-xs sm:text-sm p-2 sm:p-3"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleAddToCart(product)}
                            className="bg-pink-500 hover:bg-pink-600 text-white text-xs sm:text-sm p-2 sm:p-3"
                          >
                            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Add</span>
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-3 sm:p-4">
                        <h3 className="font-medium text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-xs text-gray-600 mb-2 sm:mb-3 line-clamp-2 hidden sm:block">
                            {product.description}
                          </p>
                        )}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                          <span className="text-sm sm:text-lg font-semibold text-pink-600">
                            KSh {product.price.toLocaleString()}
                          </span>
                          <Badge className="bg-green-100 text-green-800 text-xs w-fit">
                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
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
                <Button className="bg-pink-500 hover:bg-pink-600 text-white text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="animate-fade-in">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-4 sm:mb-6">
                  Crafted with Love, Designed for You
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  At ELSO, we believe every woman deserves to feel extraordinary. 
                  Our collection combines timeless elegance with contemporary style, 
                  creating pieces that celebrate your unique beauty and confidence.
                </p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 sm:mb-8">
                  From our signature handbags to our exquisite jewelry, each item is 
                  carefully selected to enhance your personal style and complement your 
                  everyday moments with a touch of luxury.
                </p>
                <Link to="/about">
                  <Button className="bg-gray-600 hover:bg-gray-700 text-white text-sm sm:text-base">
                    Learn More About Us
                  </Button>
                </Link>
              </div>
              
              <div className="relative">
                <div className="glassmorphic overflow-hidden">
                  <img
                    src="/lovable-uploads/833bfe1d-8774-42d0-ac7f-267e18807202.png"
                    alt="ELSO Lifestyle"
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-4">
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

            {/* Mobile Testimonials - Faster Infinite Scroll */}
            <div className="md:hidden relative overflow-hidden">
              <div className="flex animate-scroll gap-2" style={{ animationDuration: '6s' }}>
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <div key={index} className="glassmorphic text-center p-2 min-w-[160px] flex-shrink-0">
                    <div className="flex justify-center mb-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-pink-400 text-xs">★</span>
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-1 text-xs line-clamp-2">"{testimonial.text}"</p>
                    <p className="font-medium text-gray-800 text-xs">{testimonial.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Index;
