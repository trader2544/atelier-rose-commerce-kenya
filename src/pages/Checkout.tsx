import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Copy, CheckCircle, CreditCard, Smartphone } from 'lucide-react';

interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
}

const Checkout = () => {
  const { state, dispatch } = useCart();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paybill' | 'stk'>('paybill');
  const [hasPaid, setHasPaid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('kisumu-cbd');
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
  
  // Calculate delivery fee based on location
  const getDeliveryFee = () => {
    switch (deliveryLocation) {
      case 'kisumu-cbd':
        return 0; // Free delivery
      case 'kisumu-outside':
        return 100;
      case 'kenya-other':
        return 375; // Average of 300-450
      default:
        return 0;
    }
  };

  const deliveryFee = getDeliveryFee();
  const total = subtotal + deliveryFee;

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Payment details copied to clipboard",
    });
  };

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to place an order.",
        variant: "destructive",
      });
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
          shipping_address: {
            ...address,
            delivery_location: deliveryLocation,
            delivery_fee: deliveryFee
          },
          payment_method: paymentMethod,
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

      setHasPaid(true);
      setIsLoading(false);

      toast({
        title: "Order Created",
        description: "Please complete payment to confirm your order",
      });

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

  const handleConfirmPayment = () => {
    const locationText = deliveryLocation === 'kisumu-cbd' ? 'Kisumu CBD (Free Delivery)' :
                        deliveryLocation === 'kisumu-outside' ? 'Outside Kisumu CBD (+KSh 100)' :
                        'Other parts of Kenya (+KSh 375)';
    
    const message = `Hi ELSO Team! I have completed payment of KSh ${total.toLocaleString()} for my order. Order details: ${state.items.map(item => `${item.product.name} (Qty: ${item.quantity})`).join(', ')}. Delivery to: ${locationText} - ${address.street}, ${address.city}. Payment method: ${paymentMethod.toUpperCase()}. Please confirm receipt and process my order. Thank you!`;
    
    const whatsappUrl = `https://wa.me/254745242174?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Order Confirmed!",
      description: "Thank you! We'll process your order and contact you soon.",
    });
    
    // Clear cart after confirmation
    dispatch({ type: 'CLEAR_CART' });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-xl sm:text-2xl font-medium text-gray-800 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 text-sm sm:text-base">Add some items to your cart before checking out.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 pt-16 sm:pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <h1 className="text-xl sm:text-3xl font-light text-gray-800 mb-6 sm:mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Left Column - Shipping & Payment */}
          <div className="space-y-4 sm:space-y-6">
            {/* Shipping Information */}
            <div className="glassmorphic p-3 sm:p-6">
              <h2 className="text-base sm:text-xl font-medium text-gray-800 mb-3 sm:mb-6">Shipping Information</h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="name" className="text-xs sm:text-sm">Full Name *</Label>
                    <Input
                      id="name"
                      value={address.name}
                      onChange={(e) => handleAddressChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="border-pink-200 focus:border-pink-400 mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      placeholder="254712345678"
                      className="border-pink-200 focus:border-pink-400 mt-1 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="delivery-location" className="text-xs sm:text-sm">Delivery Location *</Label>
                  <Select value={deliveryLocation} onValueChange={setDeliveryLocation}>
                    <SelectTrigger className="border-pink-200 focus:border-pink-400 mt-1 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kisumu-cbd">Kisumu CBD (Free Delivery)</SelectItem>
                      <SelectItem value="kisumu-outside">Outside Kisumu CBD (+KSh 100)</SelectItem>
                      <SelectItem value="kenya-other">Other Parts of Kenya (+KSh 300-450)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="street" className="text-xs sm:text-sm">Street Address *</Label>
                  <Input
                    id="street"
                    value={address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    placeholder="Enter your street address"
                    className="border-pink-200 focus:border-pink-400 mt-1 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="city" className="text-xs sm:text-sm">City *</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      placeholder="City"
                      className="border-pink-200 focus:border-pink-400 mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="county" className="text-xs sm:text-sm">County</Label>
                    <Input
                      id="county"
                      value={address.county}
                      onChange={(e) => handleAddressChange('county', e.target.value)}
                      placeholder="County"
                      className="border-pink-200 focus:border-pink-400 mt-1 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="glassmorphic p-3 sm:p-6">
              <h2 className="text-base sm:text-xl font-medium text-gray-800 mb-3 sm:mb-4">Payment Method</h2>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div 
                  className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'paybill' ? 'border-pink-400 bg-pink-50' : 'border-gray-200 hover:border-pink-200'
                  }`}
                  onClick={() => setPaymentMethod('paybill')}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">M-Pesa Paybill</p>
                      <p className="text-xs sm:text-sm text-gray-600">Pay via Paybill number</p>
                    </div>
                  </div>
                </div>

                <div 
                  className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'stk' ? 'border-pink-400 bg-pink-50' : 'border-gray-200 hover:border-pink-200'
                  }`}
                  onClick={() => setPaymentMethod('stk')}
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">M-Pesa STK Push</p>
                      <p className="text-xs sm:text-sm text-gray-600">Direct payment to your phone</p>
                    </div>
                  </div>
                </div>
              </div>

              {!hasPaid ? (
                <Button
                  onClick={handlePayment}
                  disabled={isLoading || !user}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 sm:py-3 text-sm sm:text-base"
                >
                  {isLoading ? 'Processing...' : `Pay KSh ${total.toLocaleString()}`}
                </Button>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {paymentMethod === 'paybill' ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                      <h3 className="font-medium text-green-800 mb-2 sm:mb-3 text-sm sm:text-base">M-Pesa Paybill Instructions</h3>
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between items-center">
                          <span>1. Go to M-Pesa menu</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>2. Select Lipa na M-Pesa</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>3. Select Pay Bill</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>4. Business No: 880100</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => copyToClipboard('880100')}
                            className="h-6 px-2"
                          >
                            {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>5. Account No: 640011</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => copyToClipboard('640011')}
                            className="h-6 px-2"
                          >
                            {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>6. Amount: KSh {total.toLocaleString()}</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => copyToClipboard(total.toString())}
                            className="h-6 px-2"
                          >
                            {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>7. Enter your M-Pesa PIN</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                      <h3 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">STK Push Sent!</h3>
                      <p className="text-xs sm:text-sm text-blue-600">
                        Please check your phone for M-Pesa prompt and enter your PIN to complete payment.
                      </p>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleConfirmPayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 text-sm sm:text-base"
                  >
                    I have Paid - Confirm Order via WhatsApp
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="glassmorphic h-fit p-3 sm:p-6">
            <h2 className="text-base sm:text-xl font-medium text-gray-800 mb-3 sm:mb-4">Order Summary</h2>
            
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 sm:space-x-3 py-1 sm:py-2">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold">
                    KSh {(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 sm:pt-4 space-y-1 sm:space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Subtotal</span>
                <span>KSh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'Free' : `KSh ${deliveryFee.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-sm sm:text-lg border-t pt-1 sm:pt-2">
                <span>Total</span>
                <span className="text-pink-600">KSh {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
