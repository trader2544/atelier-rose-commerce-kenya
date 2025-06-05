
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '@/hooks/useInventory';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, ShoppingCart } from 'lucide-react';

const Shop = () => {
  const { items, loading } = useInventory();
  const { dispatch } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const categories = ['All', ...new Set(items.map(item => item.category))];

  const filteredProducts = useMemo(() => {
    let filtered = items;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [items, selectedCategory, searchTerm, sortBy]);

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
    // Create a modal or navigate to product detail
    toast({
      title: product.name,
      description: product.description || "View more details about this product",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 pb-16 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
        <div className="love-shapes"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 sm:h-12 bg-gray-200 rounded w-1/3 mx-auto mb-6 sm:mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 sm:h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
      <div className="love-shapes"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-light text-gray-800 mb-4">
            Our Collection
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of luxury items, each piece designed to bring elegance to your everyday.
          </p>
        </div>

        {/* Filters */}
        <div className="glassmorphic p-4 sm:p-6 mb-6 sm:mb-8 space-y-4">
          {/* Search */}
          <div className="max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/70 border-pink-200 focus:border-pink-400 text-sm"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                className={`text-xs sm:text-sm ${
                  selectedCategory === category 
                    ? 'bg-pink-500 hover:bg-pink-600 text-white' 
                    : 'bg-white/70 hover:bg-pink-50 border-pink-200'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex justify-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 sm:px-4 py-2 bg-white/70 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="glassmorphic hover:scale-105 transition-all duration-300 group overflow-hidden">
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
                  <Badge className={product.in_stock ? 'bg-green-100 text-green-800 text-xs' : 'bg-red-100 text-red-800 text-xs'}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                {product.featured && (
                  <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                    <Badge className="bg-pink-100 text-pink-800 text-xs">
                      Featured
                    </Badge>
                  </div>
                )}
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
                    disabled={!product.in_stock}
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-2 sm:p-4">
                <h3 className="font-medium text-gray-800 mb-1 sm:mb-2 line-clamp-2 text-sm sm:text-base">
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
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-xs text-gray-500 line-through">
                      KSh {product.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-base sm:text-lg">
              No products found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
