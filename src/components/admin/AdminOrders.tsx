
import React, { useState, useEffect } from 'react';
import { Search, Package, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  delivery_location?: string;
}

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: ShippingAddress;
  created_at: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  order_items: Array<{
    id: string;
    quantity: number;
    price: number;
    product_id: string;
    products?: {
      name: string;
      images: string[];
    };
  }>;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders with order items and products
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products:product_id (
              name,
              images
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Orders fetch error:', ordersError);
        throw ordersError;
      }

      // Fetch customer profiles separately
      const userIds = [...new Set(ordersData?.map(order => order.user_id) || [])];
      
      let customerProfiles: any[] = [];
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone')
          .in('id', userIds);

        if (profilesError) {
          console.error('Profiles fetch error:', profilesError);
        } else {
          customerProfiles = profilesData || [];
        }
      }

      // Combine orders with customer data
      const enrichedOrders = (ordersData || []).map(order => {
        const customerProfile = customerProfiles.find(profile => profile.id === order.user_id);
        const shippingAddress = order.shipping_address as ShippingAddress;
        
        return {
          ...order,
          shipping_address: shippingAddress,
          customer_name: customerProfile?.full_name || shippingAddress?.name || 'Unknown',
          customer_email: customerProfile?.email || 'Unknown',
          customer_phone: customerProfile?.phone || shippingAddress?.phone || 'Unknown'
        };
      });

      setOrders(enrichedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });

      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-3 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 sm:h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-light text-gray-800">Orders Management</h2>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders by ID, status, or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/70 border-pink-200 text-sm"
          />
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="glassmorphic">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div className="flex-1">
                  <CardTitle className="text-sm sm:text-lg font-medium text-gray-800">
                    Order #{order.id.slice(-8)}
                  </CardTitle>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1 space-y-1">
                    <p>{new Date(order.created_at).toLocaleDateString()}</p>
                    <p><strong>Customer:</strong> {order.customer_name}</p>
                    <p><strong>Email:</strong> {order.customer_email}</p>
                    {order.customer_phone && <p><strong>Phone:</strong> {order.customer_phone}</p>}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    KSh {order.total.toLocaleString()}
                  </Badge>
                  <Badge className={
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {order.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Shipping Address */}
              {order.shipping_address && (
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <p className="font-medium text-xs sm:text-sm text-gray-800 mb-1">Shipping Address:</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {order.shipping_address.name}<br/>
                    {order.shipping_address.street}, {order.shipping_address.city}<br/>
                    Phone: {order.shipping_address.phone}
                    {order.shipping_address.delivery_location && (
                      <><br/>Delivery: {order.shipping_address.delivery_location === 'kisumu-cbd' ? 'Kisumu CBD' : 
                                        order.shipping_address.delivery_location === 'kisumu-outside' ? 'Outside Kisumu CBD' : 
                                        'Other parts of Kenya'}</>
                    )}
                  </p>
                </div>
              )}

              {/* Order Items */}
              <div>
                <p className="font-medium text-xs sm:text-sm text-gray-800 mb-2">Items Ordered:</p>
                <div className="space-y-1 sm:space-y-2">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 sm:gap-3 p-2 bg-pink-50 rounded-lg">
                      {item.products?.images && item.products.images.length > 0 && (
                        <img
                          src={item.products.images[0]}
                          alt={item.products?.name || 'Product'}
                          className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                          {item.products?.name || 'Unknown Product'}
                        </p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity} × KSh {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="font-medium">Payment Status:</span>
                  <span className={`ml-2 ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.payment_status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Payment Method:</span>
                  <span className="ml-2">{order.payment_method}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateOrderStatus(order.id, 'processing')}
                  disabled={order.status === 'processing'}
                  className="text-xs sm:text-sm"
                >
                  <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Process
                </Button>
                <Button
                  size="sm"
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                  disabled={order.status === 'completed'}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm"
                >
                  Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-sm sm:text-base">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
