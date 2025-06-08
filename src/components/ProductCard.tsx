
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[] | null;
    category: string;
    description?: string;
    original_price?: number;
    in_stock: boolean;
    featured: boolean;
    created_at: string;
    rating: number;
    reviews: number;
    updated_at: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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

  // Safely get the first image or use placeholder
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return '/placeholder.svg';
  };

  return (
    <div className="luxury-card group overflow-hidden">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={getProductImage()}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          {product.original_price && (
            <div className="absolute top-3 left-3 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Sale
            </div>
          )}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description || 'No description available'}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-rose-600">
                KSh {product.price.toLocaleString()}
              </span>
              {product.original_price && (
                <span className="text-sm text-gray-500 line-through">
                  KSh {product.original_price.toLocaleString()}
                </span>
              )}
            </div>
            
            {product.rating && product.rating > 0 && (
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span>★</span>
                <span>{product.rating}</span>
                <span>({product.reviews})</span>
              </div>
            )}
          </div>
        </div>
      </Link>
      
      <div className="px-6 pb-6">
        <Button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{product.in_stock ? 'Add to Cart' : 'Out of Stock'}</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
