
import React from 'react';
import { X, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: any) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-pink-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg mb-6">
            <img
              src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-medium text-gray-800 mb-2">{product.name}</h2>
              <Badge className="bg-pink-100 text-pink-800">{product.category}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-3xl font-semibold text-pink-600">
                KSh {product.price.toLocaleString()}
              </span>
              <Badge className={product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < (product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating || 0} ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Features */}
            <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
              <p>• Premium quality materials</p>
              <p>• Elegant design</p>
              <p>• Free delivery for orders over KSh 10,000</p>
              <p>• 30-day return policy</p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-pink-200 hover:bg-pink-50"
              >
                Back
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
