
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Package, Users, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    recentOrders: []
  });

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      // Fetch total products
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch total orders
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Fetch revenue
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'delivered');

      const revenue = ordersData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      // Fetch recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        revenue,
        recentOrders: recentOrders || []
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
        <div className="love-shapes"></div>
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
        <div className="love-shapes"></div>
        <div className="relative z-10 flex items-center justify-center h-screen">
          <Card className="glassmorphic p-8 text-center">
            <CardContent>
              <h1 className="text-2xl font-light text-gray-800 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-6">
                You don't have permission to access the admin dashboard.
              </p>
              <p className="text-sm text-gray-500">
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
            <div className="love-shapes"></div>
            <div className="relative z-10 p-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-light text-gray-800 mb-2">
                  Welcome to ELSO Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Manage your boutique with ease and elegance
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="glassmorphic hover:scale-105 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Products
                    </CardTitle>
                    <Package className="h-4 w-4 text-pink-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800">{stats.totalProducts}</div>
                    <p className="text-xs text-gray-500">Active products</p>
                  </CardContent>
                </Card>

                <Card className="glassmorphic hover:scale-105 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Orders
                    </CardTitle>
                    <Users className="h-4 w-4 text-pink-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800">{stats.totalOrders}</div>
                    <p className="text-xs text-gray-500">All time orders</p>
                  </CardContent>
                </Card>

                <Card className="glassmorphic hover:scale-105 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Revenue
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-pink-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800">KSh {stats.revenue.toLocaleString()}</div>
                    <p className="text-xs text-gray-500">Delivered orders</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Card className="glassmorphic">
                  <CardHeader>
                    <CardTitle className="text-gray-800">Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentOrders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-gray-600">{order.profiles?.full_name || order.profiles?.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-pink-600">KSh {Number(order.total).toLocaleString()}</p>
                            <Badge className={
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {stats.recentOrders.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No orders yet</p>
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
    <div className="min-h-screen pt-20">
      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-pink-100 text-pink-700 border border-pink-200'
                      : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
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
