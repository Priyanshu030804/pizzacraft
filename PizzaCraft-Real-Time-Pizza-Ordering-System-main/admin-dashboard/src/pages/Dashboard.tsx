import React, { useState, useEffect } from 'react';
import { getSocket } from '../lib/socket';
import { apiGet } from '../services/api';
import { Order, DashboardStats } from '../types';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Users, 
  TrendingUp,
  Pizza,
  Truck
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalCustomers: 0
  });

  useEffect(() => {
    let mounted = true;

    const updateOrders = (next: Order[]) => {
      if (!mounted) return;
      setOrders(next);
      calculateStats(next);
    };

    const loadInitial = async () => {
      try {
        try {
          const adminList: any[] = await apiGet('/api/orders/admin?limit=100');
          const normalized = (adminList || []).map((o: any) => ({
            id: (o._id || o.id)?.toString(),
            status: o.status,
            total: o.total_amount || o.total || 0,
            created_at: o.created_at,
            user_id: o.user_id?._id || o.user_id || ''
          }));
          updateOrders(normalized as any);
        } catch (_auth) {
          const dev: any = await apiGet('/api/orders/dev/all?limit=100');
          const list = dev?.orders || dev || [];
          const normalized = (list || []).map((o: any) => ({
            id: (o._id || o.id)?.toString(),
            status: o.status,
            total: o.total_amount || o.total || 0,
            created_at: o.created_at,
            user_id: o.user_id?._id || o.user_id || ''
          }));
          updateOrders(normalized as any);
        }
      } catch (e) {
        console.error('Dashboard load error:', (e as any)?.message || e);
        updateOrders([]);
      }
    };
    loadInitial();

    const socket = getSocket();
    const onNewOrder = (payload: any) => {
      const order = payload?.order || payload;
      const normalized: any = {
        id: (order._id || order.id)?.toString(),
        status: order.status,
        total: order.total_amount || order.total || 0,
        created_at: order.created_at,
        user_id: order.user_id?._id || order.user_id || ''
      };
      setOrders(prev => {
        const next = [normalized, ...prev.filter(p => p.id !== normalized.id)];
        calculateStats(next);
        return next;
      });
    };
    const onOrderUpdated = (order: any) => {
      setOrders(prev => {
        const id = (order._id || order.id)?.toString();
        const next = prev.map(o => o.id === id ? { ...o, status: order.status } : o);
        calculateStats(next);
        return next;
      });
    };
    const onStatusChanged = (data: any) => {
      setOrders(prev => {
        const id = data.orderId?.toString();
        const next = prev.map(o => o.id === id ? { ...o, status: data.status } : o);
        calculateStats(next);
        return next;
      });
    };
    socket.on('new-order', onNewOrder);
    socket.on('order-updated', onOrderUpdated);
    socket.on('order-status-changed', onStatusChanged);

    return () => {
      mounted = false;
      socket.off('new-order', onNewOrder);
      socket.off('order-updated', onOrderUpdated);
      socket.off('order-status-changed', onStatusChanged);
    };
  }, []);

  const calculateStats = (orders: Order[]) => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => 
      ['pending', 'confirmed', 'preparing', 'out-for-delivery'].includes(order.status)
    ).length;
    const completedOrders = orders.filter(order => order.status === 'delivered').length;
    const totalRevenue = orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / completedOrders || 0 : 0;
    
    // Count unique customers
    const uniqueCustomers = new Set(orders.map(order => order.user_id)).size;

    setStats({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      averageOrderValue,
      totalCustomers: uniqueCustomers
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      'out-for-delivery': 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Order</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Pizza className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      {order.status === 'out-for-delivery' ? (
                        <Truck className="h-5 w-5 text-primary-600" />
                      ) : (
                        <Package className="h-5 w-5 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id.slice(-6)}</p>
                      <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('-', ' ')}
                    </span>
                    <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
