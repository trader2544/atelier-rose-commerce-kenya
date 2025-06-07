
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useMpesa } from '@/hooks/useMpesa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const { user } = useAuth();
  const { initiateSTKPush, checkPaymentStatus, loading: mpesaLoading } = useMpesa();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    delivery_location: 'kisumu-cbd'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (state.items.length === 0) {
      navigate('/cart');
    }
  }, [state.items, navigate]);

  const getDeliveryFee = () => {
    switch (formData.delivery_location) {
      case 'kisumu-cbd': return 0;
      case 'kisumu-outside': return 100;
      case 'other-kenya': return 375; // Average of 300-450
      default: return 0;
    }
  };

  const deliveryFee = getDeliveryFee();
  const total = state.total + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const createOrder = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to place an order.",
          variant: "destructive",
        });
        return null;
      }

      const orderData = {
        user_id: user.id,
        total: total,
        status: 'pending',
        payment_status: 'pending',
        payment_method: 'mpesa',
        shipping_address: formData
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
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

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Order Creation Failed",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleMpesaPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create order first
      const order = await createOrder();
      if (!order) {
        setLoading(false);
        return;
      }

      // Initiate M-Pesa payment
      const paymentResult = await initiateSTKPush({
        phone: formData.phone,
        amount: total,
        orderId: order.id,
        accountReference: `Order-${order.id.slice(0, 8)}`,
        transactionDesc: `Payment for ELSO order ${order.id.slice(0, 8)}`
      });

      if (paymentResult.success) {
        // Start polling for payment status
        const pollPaymentStatus = async () => {
          let attempts = 0;
          const maxAttempts = 30; // Poll for 5 minutes (10s intervals)

          const poll = async () => {
            attempts++;
            const statusResult = await checkPaymentStatus(paymentResult.checkoutRequestId!);
            
            if (statusResult.status === 'completed') {
              toast({
                title: "Payment Successful!",
                description: "Your order has been placed successfully.",
              });
              dispatch({ type: 'CLEAR_CART' });
              navigate('/orders');
              return;
            } else if (statusResult.status === 'failed') {
              toast({
                title: "Payment Failed",
                description: "M-Pesa payment was not completed. Please try again.",
                variant: "destructive",
              });
              return;
            } else if (attempts < maxAttempts) {
              // Continue polling
              setTimeout(poll, 10000); // Poll every 10 seconds
            } else {
              toast({
                title: "Payment Status Unknown",
                description: "Please check your M-Pesa messages or contact support.",
                variant: "destructive",
              });
            }
          };

          poll();
        };

        pollPaymentStatus();
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: "An error occurred during checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-800 mb-6 sm:mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Shipping Information */}
          <Card className="glassmorphic">
            <CardHeader>
              <CardTitle className="text-pink-800 text-lg sm:text-xl">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMpesaPayment} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number (M-Pesa) *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0712345678"
                    required
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="street" className="text-sm font-medium">Street Address *</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="delivery_location" className="text-sm font-medium">Delivery Location *</Label>
                  <select
                    id="delivery_location"
                    name="delivery_location"
                    value={formData.delivery_location}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                    required
                  >
                    <option value="kisumu-cbd">Kisumu CBD (Free Delivery)</option>
                    <option value="kisumu-outside">Outside Kisumu CBD (+KSh 100)</option>
                    <option value="other-kenya">Other parts of Kenya (+KSh 375)</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={loading || mpesaLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-3"
                >
                  {loading || mpesaLoading ? 'Processing...' : 'Pay with M-Pesa'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="glassmorphic h-fit">
            <CardHeader>
              <CardTitle className="text-pink-800 text-lg sm:text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-pink-600 text-sm">
                    KSh {(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>KSh {state.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? 'Free' : `KSh ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-pink-600">KSh {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 text-sm mb-2">Delivery Information:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Kisumu CBD: Free delivery</li>
                  <li>• Outside Kisumu CBD: KSh 100</li>
                  <li>• Other parts of Kenya: KSh 300-450 via Easy Coach</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
