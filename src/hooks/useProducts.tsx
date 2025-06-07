
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { toast } from '@/hooks/use-toast';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match our Product type
      const transformedProducts: Product[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        images: item.images || [],
        category: item.category,
        description: item.description || '',
        original_price: item.original_price ? Number(item.original_price) : undefined,
        in_stock: item.in_stock ?? true,
        featured: item.featured ?? false,
        created_at: item.created_at || new Date().toISOString(),
        rating: Number(item.rating) || 0,
        reviews: Number(item.reviews) || 0,
        updated_at: item.updated_at || new Date().toISOString()
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error in fetchProducts:', error);
      setError('Failed to fetch products');
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching featured products:', error);
        setError(error.message);
        return;
      }

      const transformedProducts: Product[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        images: item.images || [],
        category: item.category,
        description: item.description || '',
        original_price: item.original_price ? Number(item.original_price) : undefined,
        in_stock: item.in_stock ?? true,
        featured: item.featured ?? false,
        created_at: item.created_at || new Date().toISOString(),
        rating: Number(item.rating) || 0,
        reviews: Number(item.reviews) || 0,
        updated_at: item.updated_at || new Date().toISOString()
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error in fetchFeaturedProducts:', error);
      setError('Failed to fetch featured products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return { products, loading, error, refetch: fetchFeaturedProducts };
};
