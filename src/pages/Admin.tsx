import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Package, Users, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';

interface RecentOrder {
  id: string;
  total: number;
  status: string;
  created_at: string;
  user_id: string;
  shipping_address: {
    name?: string;
    email?: string;
  };
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    recentOrders: [] as RecentOrder[]
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      console.log('Fetching admin stats...');
      
      // Ensure user is authenticated and is admin
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser || !isAdmin) {
        console.log('User not authenticated or not admin');
        return;
      }

      // Fetch total products
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (productsError) {
        console.error('Products count error:', productsError);
      } else {
        console.log('Products count:', productsCount);
      }

      // Fetch total orders
      const { count: ordersCount, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      if (ordersError) {
        console.error('Orders count error:', ordersError);
      } else {
        console.log('Orders count:', ordersCount);
      }

      // Fetch revenue from completed orders
      const { data: ordersData, error: revenueError } = await supabase
        .from('orders')
        .select('total')
        .in('status', ['completed', 'delivered']);

      if (revenueError) {
        console.error('Revenue error:', revenueError);
      } else {
        console.log('Revenue orders:', ordersData);
      }

      const revenue = ordersData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      // Fetch recent orders
      const { data: recentOrdersData, error: recentOrdersError } = await supabase
        .from('orders')
        .select('id, total, status, created_at, user_id, shipping_address')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentOrdersError) {
        console.error('Recent orders error:', recentOrdersError);
      } else {
        console.log('Recent orders:', recentOrdersData);
      }

      // Process recent orders with proper type handling
      const processedRecentOrders: RecentOrder[] = (recentOrdersData || []).map(order => {
        let shippingAddress = { name: 'Unknown', email: 'Unknown' };
        
        if (order.shipping_address && typeof order.shipping_address === 'object') {
          const addr = order.shipping_address as Record<string, any>;
          shippingAddress = {
            name: addr.name || 'Unknown',
            email: addr.email || 'Unknown'
          };
        }

        return {
          ...order,
          shipping_address: shippingAddress
        };
      });

      console.log('Final stats:', { 
        products: productsCount, 
        orders: ordersCount, 
        revenue, 
        recentOrders: processedRecentOrders.length 
      });

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        revenue,
        recentOrders: processedRecentOrders
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && user) {
      console.log('User is admin, fetching stats...');
      fetchStats();
    }
  }, [isAdmin, user]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center h-screen px-4">
          <Card className="glassmorphic p-4 sm:p-8 text-center max-w-md">
            <CardContent>
              <h1 className="text-xl sm:text-2xl font-light text-gray-800 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                You don't have permission to access the admin dashboard.
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Please contact the administrator if you believe this is an error.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
            <div className="relative z-10 p-3 sm:p-6">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-light text-gray-800 mb-2">
                  Welcome to ELSO Admin Dashboard
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Manage your boutique with ease and elegance
                </p>
              </div>

              {statsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 sm:h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
                  <Card className="glassmorphic hover:scale-105 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                        Total Products
                      </CardTitle>
                      <Package className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalProducts}</div>
                      <p className="text-xs text-gray-500">Active products</p>
                    </CardContent>
                  </Card>

                  <Card className="glassmorphic hover:scale-105 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                        Total Orders
                      </CardTitle>
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalOrders}</div>
                      <p className="text-xs text-gray-500">All time orders</p>
                    </CardContent>
                  </Card>

                  <Card className="glassmorphic hover:scale-105 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                        Revenue
                      </CardTitle>
                      <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold text-gray-800">KSh {stats.revenue.toLocaleString()}</div>
                      <p className="text-xs text-gray-500">Completed orders</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:gap-6">
                <Card className="glassmorphic">
                  <CardHeader>
                    <CardTitle className="text-gray-800 text-sm sm:text-base">Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 sm:space-y-4">
                      {stats.recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-2 sm:p-3 bg-white/50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 text-xs sm:text-sm">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                              {order.shipping_address?.name || order.shipping_address?.email || 'Unknown Customer'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-pink-600 text-xs sm:text-sm">KSh {Number(order.total).toLocaleString()}</p>
                            <Badge className={`text-xs ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {stats.recentOrders.length === 0 && (
                        <p className="text-gray-500 text-center py-4 text-xs sm:text-sm">No orders yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-16 sm:top-20 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto py-3 sm:py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-xs sm:text-sm ${
                    activeTab === tab.id
                      ? 'bg-pink-100 text-pink-700 border border-pink-200'
                      : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                  }`}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default Admin;
