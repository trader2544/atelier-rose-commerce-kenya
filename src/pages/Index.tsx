
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import ProductModal from "@/components/ProductModal";
import { Product } from "@/types/product";

const Index = () => {
  const { products: featuredProducts, loading } = useFeaturedProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dispatch } = useCart();

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Featured Collection */}
      <section className="py-20 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
        <div className="love-shapes"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-800 mb-4">Featured Collection</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium pieces
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden glassmorphic hover:scale-105 transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleViewProduct(product)}
                        className="bg-white/90 hover:bg-white text-gray-800"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="bg-pink-500 hover:bg-pink-600 text-white"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">{product.name}</h3>
                    <Badge className="bg-pink-100 text-pink-800 mb-3">{product.category}</Badge>
                    
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        ({product.reviews})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-semibold text-pink-600">
                          KSh {product.price.toLocaleString()}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            KSh {product.original_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-800 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real people who love ELSO
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glassmorphic">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "I absolutely love the handbag I purchased from ELSO. The
                  quality is outstanding, and it's even more beautiful in
                  person. I get compliments every time I use it!"
                </p>
                <p className="text-sm text-gray-500">
                  - Jane Doe, Nairobi
                </p>
              </CardContent>
            </Card>
            <Card className="glassmorphic">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "The jewelry from ELSO is simply stunning. I bought a necklace
                  for a special occasion, and it was the perfect touch of
                  elegance. I will definitely be shopping here again."
                </p>
                <p className="text-sm text-gray-500">
                  - Alice Smith, Mombasa
                </p>
              </CardContent>
            </Card>
            <Card className="glassmorphic">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "ELSO has become my go-to for fashion accessories. Their
                  selection is unique, and the customer service is
                  exceptional. I highly recommend them!"
                </p>
                <p className="text-sm text-gray-500">
                  - Sarah Johnson, Kisumu
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Newsletter />

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Index;
