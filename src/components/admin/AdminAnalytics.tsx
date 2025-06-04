
import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch total revenue and orders
      const { data: orders } = await supabase
        .from('orders')
        .select('total, status, created_at');

      // Fetch total users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });

      // Fetch total products
      const { count: productCount } = await supabase
        .from('products')
        .select('id', { count: 'exact' });

      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const completedOrders = orders?.filter(order => order.status === 'delivered') || [];

      setStats({
        totalRevenue,
        totalOrders: orders?.length || 0,
        totalUsers: userCount || 0,
        totalProducts: productCount || 0,
        recentOrders: orders?.slice(0, 5) || []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <div className="luxury-card">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`KSh ${stats.totalRevenue.toLocaleString()}`}
          subtitle="All time"
          color="bg-green-500"
        />
        <StatCard
          icon={ShoppingBag}
          title="Total Orders"
          value={stats.totalOrders}
          subtitle="All time"
          color="bg-blue-500"
        />
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Registered users"
          color="bg-purple-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Total Products"
          value={stats.totalProducts}
          subtitle="In catalog"
          color="bg-rose-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="luxury-card">
          <div className="p-6">
            <h3 className="font-medium text-gray-800 mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {stats.recentOrders.map((order: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Order #{order.id?.slice(0, 8) || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      KSh {Number(order.total).toLocaleString()}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {stats.recentOrders.length === 0 && (
                <p className="text-sm text-gray-600 text-center py-4">No recent orders</p>
              )}
            </div>
          </div>
        </div>

        <div className="luxury-card">
          <div className="p-6">
            <h3 className="font-medium text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full p-3 text-left bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors">
                <p className="font-medium text-rose-800">Add New Product</p>
                <p className="text-sm text-rose-600">Expand your catalog</p>
              </button>
              <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <p className="font-medium text-blue-800">Process Orders</p>
                <p className="text-sm text-blue-600">Update order statuses</p>
              </button>
              <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <p className="font-medium text-purple-800">Check Messages</p>
                <p className="text-sm text-purple-600">Respond to customers</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
