
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: any;
  created_at: string;
  updated_at: string;
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

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
        setError(ordersError.message);
        return;
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
        const shippingAddress = order.shipping_address as any;
        
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
      setError('Failed to fetch orders');
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders, updateOrderStatus };
};
