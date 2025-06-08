
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-800 mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button className="btn-primary">
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product.in_stock) {
      toast({
        title: "Out of Stock",
        description: "This item is currently unavailable.",
        variant: "destructive",
      });
      return;
    }
    
    dispatch({ type: 'ADD_TO_CART', payload: product });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center space-x-2 text-gray-600 hover:text-rose-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Shop</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="luxury-card overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-rose-400' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-light text-gray-800 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {product.category}
              </p>
            </div>

            {product.rating && (
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <span className="text-3xl font-semibold text-rose-600">
                KSh {product.price.toLocaleString()}
              </span>
              {product.original_price && (
                <span className="text-xl text-gray-500 line-through">
                  KSh {product.original_price.toLocaleString()}
                </span>
              )}
            </div>

            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.in_stock ? 'In Stock' : 'Out of Stock'}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="w-full btn-primary flex items-center justify-center space-x-2 text-lg py-4"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{product.in_stock ? 'Add to Cart' : 'Out of Stock'}</span>
            </Button>

            <div className="border-t pt-6 space-y-3 text-sm text-gray-600">
              <p>• Free delivery for orders over KSh 10,000</p>
              <p>• 30-day return policy</p>
              <p>• Authentic products only</p>
              <p>• Secure payment processing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
