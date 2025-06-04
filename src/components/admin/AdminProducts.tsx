
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseProduct } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductForm from './ProductForm';
import { toast } from '@/hooks/use-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DatabaseProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
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
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      fetchProducts();
    }
  };

  const handleSave = () => {
    fetchProducts();
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-gray-800">Product Management</h2>
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="luxury-card group">
              <CardHeader className="pb-3">
                <div className="relative">
                  {product.images && product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}
                  <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingProduct(product);
                        setShowForm(true);
                      }}
                      className="bg-white/90 hover:bg-white border-pink-200"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                      className="bg-white/90 hover:bg-white border-red-200 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-pink-800 text-lg">{product.name}</CardTitle>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold text-pink-600">
                    KSh {product.price.toLocaleString()}
                  </p>
                  <Badge className={product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {product.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Category: {product.category}</span>
                  {product.featured && (
                    <Badge className="bg-pink-100 text-pink-800">Featured</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
    </div>
  );
};

export default AdminProducts;
