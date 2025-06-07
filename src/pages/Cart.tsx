
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

const Cart = () => {
  const { state, dispatch } = useCart();

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const shippingFee = 200;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-medium text-gray-800 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Discover our beautiful collection and add some items to your cart.</p>
            <Link to="/shop">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-800 mb-6 sm:mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {state.items.map((item) => (
              <div key={item.id} className="glassmorphic">
                <div className="flex items-center p-4 sm:p-6">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  
                  <div className="flex-1 ml-3 sm:ml-4 min-w-0">
                    <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{item.product.category}</p>
                    <p className="text-pink-600 font-semibold mt-1 text-sm sm:text-base">
                      KSh {item.product.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-2 ml-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-sm"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 sm:w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="glassmorphic h-fit">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-medium text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span>KSh {state.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span>KSh {shippingFee.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-base sm:text-lg">
                    <span>Total</span>
                    <span className="text-pink-600">
                      KSh {(state.total + shippingFee).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center space-x-2 py-3">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link 
                to="/shop" 
                className="block text-center text-gray-600 hover:text-pink-600 mt-4 transition-colors text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
