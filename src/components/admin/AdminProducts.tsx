
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useImageStorage } from '@/hooks/useImageStorage';
import ProductForm from './ProductForm';

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

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { getImageUrl } = useImageStorage();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        });
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    fetchProducts();
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="p-3 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h2 className="text-lg sm:text-xl font-light text-gray-800">Product Management</h2>
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-pink-600 hover:bg-pink-700 text-white text-sm w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="relative">
                {product.images && product.images.length > 0 && (
                  <img
                    src={getImageUrl(product.images[0]) || product.images[0]}
                    alt={product.name}
                    className="w-full h-32 sm:h-40 object-cover rounded-lg mb-2 sm:mb-3"
                  />
                )}
                <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingProduct(product);
                      setShowForm(true);
                    }}
                    className="bg-white/90 hover:bg-white border-pink-200 h-6 w-6 sm:h-8 sm:w-8 p-0"
                  >
                    <Edit className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    className="bg-white/90 hover:bg-white border-red-200 text-red-600 hover:text-red-700 h-6 w-6 sm:h-8 sm:w-8 p-0"
                  >
                    <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-pink-800 text-sm sm:text-base line-clamp-2">{product.name}</CardTitle>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <p className="text-base sm:text-lg font-semibold text-pink-600">
                  KSh {product.price.toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge className={`text-xs ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                  {product.featured && (
                    <Badge className="bg-pink-100 text-pink-800 text-xs">Featured</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">
                {product.description}
              </p>
              <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
                <span>Category: {product.category}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-12 sm:py-16">
          <p className="text-gray-600 text-sm sm:text-base">No products found. Add your first product!</p>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminProducts;
