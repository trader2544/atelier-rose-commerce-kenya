
import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import AuthModal from '@/components/AuthModal';
import { Address } from '@/types';

const Checkout = () => {
  const { state, dispatch } = useCart();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [address, setAddress] = useState<Address>({
    name: '',
    phone: '',
    street: '',
    city: '',
    county: '',
    postalCode: ''
  });

  useEffect(() => {
    if (profile) {
      setAddress(prev => ({
        ...prev,
        name: profile.full_name || '',
        phone: profile.phone || ''
      }));
    }
  }, [profile]);

  const subtotal = state.total;
  const getShippingCost = () => {
    if (subtotal >= 10000) return 0; // Free delivery for orders over 10k
    if (address.city?.toLowerCase() === 'kisumu' || address.city?.toLowerCase().includes('kisumu cbd')) {
      return 0; // Free delivery within Kisumu CBD
    }
    if (address.city?.toLowerCase().includes('kisumu')) {
      return 100; // Ksh 100 for orders outside Kisumu CBD
    }
    return 375; // Average of 300-450 for outside Kisumu town
  };
  
  const shipping = getShippingCost();
  const total = subtotal + shipping;

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleMpesaPayment = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!address.name || !address.phone || !address.street || !address.city) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required shipping information.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: total,
          status: 'pending',
          shipping_address: address,
          payment_method: 'mpesa',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = state.items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Show M-Pesa prompt
      toast({
        title: "M-Pesa Payment Initiated",
        description: `Please check your phone ${address.phone} for M-Pesa payment prompt to pay KSh ${total.toLocaleString()}.`,
      });

      // Simulate M-Pesa payment process
      setTimeout(() => {
        toast({
          title: "Order Placed Successfully!",
          description: "Your order has been placed and you will receive a confirmation shortly. Please check your phone for M-Pesa payment confirmation.",
        });
        
        // Clear cart after successful order
        dispatch({ type: 'CLEAR_CART' });
        setIsLoading(false);
      }, 3000);

    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-medium text-gray-800 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-light text-gray-800 mb-8">Checkout</h1>

        {!user && (
          <div className="luxury-card mb-6">
            <div className="p-6 text-center">
              <h2 className="text-xl font-medium text-gray-800 mb-4">Sign in to continue</h2>
              <p className="text-gray-600 mb-6">Please sign in or create an account to place your order.</p>
              <Button onClick={() => setShowAuthModal(true)} className="btn-primary">
                Sign In / Sign Up
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div className="luxury-card">
            <div className="p-6">
              <h2 className="text-xl font-medium text-gray-800 mb-6">Shipping Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={address.name}
                    onChange={(e) => handleAddressChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="border-rose-200 focus:border-rose-400"
                    disabled={!user}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={address.phone}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    placeholder="254712345678"
                    className="border-rose-200 focus:border-rose-400"
                    disabled={!user}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be used for M-Pesa payment and delivery updates
                  </p>
                </div>

                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    placeholder="Enter your street address"
                    className="border-rose-200 focus:border-rose-400"
                    disabled={!user}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      placeholder="City"
                      className="border-rose-200 focus:border-rose-400"
                      disabled={!user}
                    />
                  </div>

                  <div>
                    <Label htmlFor="county">County</Label>
                    <Input
                      id="county"
                      value={address.county}
                      onChange={(e) => handleAddressChange('county', e.target.value)}
                      placeholder="County"
                      className="border-rose-200 focus:border-rose-400"
                      disabled={!user}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={address.postalCode}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    placeholder="00100"
                    className="border-rose-200 focus:border-rose-400"
                    disabled={!user}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <div className="luxury-card">
              <div className="p-6">
                <h2 className="text-xl font-medium text-gray-800 mb-4">Delivery Information</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Free Delivery:</strong> Within Kisumu CBD and orders over KSh 10,000</p>
                  <p><strong>KSh 100:</strong> Orders outside Kisumu CBD</p>
                  <p><strong>KSh 300-450:</strong> Outside Kisumu town via Easy Coach Courier</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="luxury-card">
              <div className="p-6">
                <h2 className="text-xl font-medium text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        KSh {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>KSh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `KSh ${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-rose-600">KSh {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="luxury-card">
              <div className="p-6">
                <h2 className="text-xl font-medium text-gray-800 mb-4">Payment Method</h2>
                
                <div className="border border-rose-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">M</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">M-Pesa</p>
                      <p className="text-sm text-gray-600">Pay with M-Pesa mobile money</p>
                      <p className="text-xs text-gray-500">Paybill: 880100, Account: 640011</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleMpesaPayment}
                  disabled={isLoading || !user}
                  className="w-full btn-primary text-lg py-4"
                >
                  {isLoading ? 'Processing Payment...' : `Pay KSh ${total.toLocaleString()} with M-Pesa`}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  {user ? 
                    "You will receive an M-Pesa prompt on your phone to complete the payment. Your order will be confirmed once payment is received." :
                    "Please sign in to continue with your order."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Checkout;
