
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '@/hooks/useInventory';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, ShoppingCart } from 'lucide-react';

const Shop = () => {
  const { items, loading } = useInventory();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const categories = ['All', ...new Set(items.map(item => item.category))];

  // Convert inventory items to display format
  const displayItems = useMemo(() => {
    return items.flatMap(item => 
      item.variants.map(variant => ({
        id: `${item.item_id}-${variant.variant_id}`,
        name: `${item.name} ${variant.variant_name !== 'default' ? `(${variant.variant_name})` : ''}`,
        price: variant.price,
        images: variant.images.length > 0 ? variant.images : ['/placeholder.svg'],
        description: item.description || '',
        category: item.category,
        inStock: variant.quantity > 0,
        itemCode: item.item_code,
        variant: variant.variant_name,
        quantity: variant.quantity
      }))
    );
  }, [items]);

  const filteredProducts = useMemo(() => {
    let filtered = displayItems;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [displayItems, selectedCategory, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
        <div className="love-shapes"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
      <div className="love-shapes"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
            Our Collection
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of luxury items, each piece designed to bring elegance to your everyday.
          </p>
        </div>

        {/* Filters */}
        <div className="glassmorphic p-6 mb-8 space-y-4">
          {/* Search */}
          <div className="max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/70 border-pink-200 focus:border-pink-400"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`${
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
              className="px-4 py-2 bg-white/70 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="glassmorphic hover:scale-105 transition-all duration-300 group overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge className={product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge className="bg-pink-100 text-pink-800 text-xs">
                    {product.itemCode}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" className="bg-white/90 text-gray-800 hover:bg-white">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white" disabled={!product.inStock}>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-pink-600">
                    KSh {product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.quantity} left
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              No products found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
