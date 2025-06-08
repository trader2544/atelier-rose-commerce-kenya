
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Hero from '@/components/Hero';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
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
        .limit(4);

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
    <div className="min-h-screen">
      <Hero />
      
      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-800 mb-4">Featured Collection</h2>
            <p className="text-xl text-gray-600">Handpicked pieces that define elegance</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600">No featured products available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 text-lg">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-800 mb-4">Why Choose ELSO?</h2>
            <p className="text-xl text-gray-600">Experience the difference of true elegance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="luxury-card text-center p-8">
              <CardContent>
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Premium Quality</h3>
                <p className="text-gray-600">Each piece is carefully curated for exceptional quality and craftsmanship.</p>
              </CardContent>
            </Card>

            <Card className="luxury-card text-center p-8">
              <CardContent>
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Exclusive Designs</h3>
                <p className="text-gray-600">Unique pieces that make you stand out with sophisticated style.</p>
              </CardContent>
            </Card>

            <Card className="luxury-card text-center p-8">
              <CardContent>
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Personal Service</h3>
                <p className="text-gray-600">Dedicated support to help you find the perfect pieces for your style.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
