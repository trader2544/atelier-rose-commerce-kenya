
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Hero from '@/components/Hero';
import Newsletter from '@/components/Newsletter';
import Testimonials from '@/components/Testimonials';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  original_price?: number;
  in_stock: boolean;
  featured: boolean;
  created_at: string;
  rating: number;
  reviews: number;
  updated_at: string;
}

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedProducts = async () => {
    try {
      console.log('Fetching featured products...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('in_stock', true)
        .limit(8);

      if (error) {
        console.error('Error fetching featured products:', error);
        toast({
          title: "Error",
          description: "Failed to load featured products",
          variant: "destructive",
        });
        return;
      }

      console.log('Featured products fetched:', data);
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      toast({
        title: "Error",
        description: "Failed to load featured products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="page-background">
      <Hero />
      
      {/* Featured Products Section */}
      <section className="py-8 sm:py-16 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-light text-gray-800 mb-3 sm:mb-4">Featured Collection</h2>
            <p className="text-lg sm:text-xl text-gray-600">Handpicked pieces that define elegance</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 sm:h-80 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              {/* Mobile: Scrolling products */}
              <div className="block sm:hidden overflow-hidden">
                <div className="flex featured-scroll">
                  {[...featuredProducts, ...featuredProducts].map((product, index) => (
                    <div key={`${product.id}-${index}`} className="flex-shrink-0 w-40 mx-2">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop: Grid layout */}
              <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 sm:py-16">
              <p className="text-gray-600">No featured products available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-6 sm:mt-12">
            <Link to="/shop">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-8 sm:py-16 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-light text-gray-800 mb-3 sm:mb-4">Why Choose ELSO?</h2>
            <p className="text-lg sm:text-xl text-gray-600">Experience the difference of true elegance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            <Card className="luxury-card text-center p-4 sm:p-8 card-hover">
              <CardContent>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2 sm:mb-3">Premium Quality</h3>
                <p className="text-sm sm:text-base text-gray-600">Each piece is carefully curated for exceptional quality and craftsmanship.</p>
              </CardContent>
            </Card>

            <Card className="luxury-card text-center p-4 sm:p-8 card-hover">
              <CardContent>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2 sm:mb-3">Exclusive Designs</h3>
                <p className="text-sm sm:text-base text-gray-600">Unique pieces that make you stand out with sophisticated style.</p>
              </CardContent>
            </Card>

            <Card className="luxury-card text-center p-4 sm:p-8 card-hover">
              <CardContent>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2 sm:mb-3">Personal Service</h3>
                <p className="text-sm sm:text-base text-gray-600">Dedicated support to help you find the perfect pieces for your style.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Testimonials />
      <Newsletter />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
