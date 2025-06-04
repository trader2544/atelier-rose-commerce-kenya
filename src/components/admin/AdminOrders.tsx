
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OrderWithItems } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:product_id (
            name,
            price,
            images
          )
        ),
        profiles:user_id (
          id,
          email,
          full_name,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      fetchOrders();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="p-6">
        <h2 className="text-2xl font-light text-gray-800 mb-6">Order Management</h2>
        
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="luxury-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-pink-800">Order #{order.id.slice(0, 8)}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Customer: {order.profiles?.full_name || order.profiles?.email || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {order.profiles?.phone || 'Not provided'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-pink-600">
                      KSh {order.total.toLocaleString()}
                    </p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Items:</h4>
                    <div className="space-y-2">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-2 bg-pink-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.product?.name || 'Unknown Product'}</p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} × KSh {item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Shipping Address:</h4>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {order.shipping_address && typeof order.shipping_address === 'object' ? (
                        <>
                          <p>{(order.shipping_address as any).name}</p>
                          <p>{(order.shipping_address as any).phone}</p>
                          <p>{(order.shipping_address as any).street}</p>
                          <p>{(order.shipping_address as any).city}, {(order.shipping_address as any).county}</p>
                          <p>{(order.shipping_address as any).postalCode}</p>
                        </>
                      ) : (
                        <p>Address information not available</p>
                      )}
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">Update Status:</h4>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="border-pink-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
