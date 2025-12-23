import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { Clock, MapPin, Package, CheckCircle, Truck, ChefHat } from 'lucide-react';
import DebugPanel from '../components/DebugPanel';
import { getSocket } from '../lib/socket';
import { apiGet, apiPatch } from '../services/api';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const fetchOrders = async () => {
    try {
      console.log('📡 Fetching admin orders...');
      try {
        const list: any[] = await apiGet('/api/orders/admin?limit=50');
        console.log('✅ Received orders:', list?.length, list);
        setOrders(list || []);
      } catch (authErr: any) {
        // Fallback to dev endpoint if auth fails
        console.log('⚠️ Admin endpoint failed, trying dev endpoint...');
        const devData: any = await apiGet('/api/orders/dev/all?limit=50');
        const list = devData?.orders || [];
        console.log('✅ Received orders from dev endpoint:', list?.length);
        setOrders(list);
      }
    } catch (err) {
      console.error('❌ Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const socket = getSocket();
    const onNewOrder = (payload: any) => {
      const order = payload?.order || payload;
      setOrders(prev => [order, ...prev.filter(o => (o._id || o.id) !== (order._id || order.id))]);
    };
    const onOrderUpdated = (order: any) => {
      console.log('📡 Order updated via socket:', order);
      setOrders(prev => prev.map(o => {
        const oid = o._id || o.id;
        const uid = order._id || order.id;
        if (oid === uid) {
          return { ...o, ...order, status: order.status };
        }
        return o;
      }));
    };
    
    // Also listen to status-changed event
    const onStatusChanged = (data: any) => {
      console.log('📡 Order status changed:', data);
      setOrders(prev => prev.map(o => {
        const oid = (o._id || o.id)?.toString();
        const uid = data.orderId?.toString();
        if (oid === uid) {
          return { ...o, status: data.status, estimated_delivery: data.estimatedDelivery };
        }
        return o;
      }));
    };
    
    socket.on('new-order', onNewOrder);
    socket.on('order-updated', onOrderUpdated);
    socket.on('order-status-changed', onStatusChanged);

    return () => {
      socket.off('new-order', onNewOrder);
      socket.off('order-updated', onOrderUpdated);
      socket.off('order-status-changed', onStatusChanged);
    };
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await apiPatch(`/api/orders/${orderId}/status`, { status: newStatus });
      // Local optimistic update; server socket will also update
      setOrders(prev => prev.map(o => ((o._id || o.id) === orderId ? { ...o, status: newStatus } : o)));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleManualSync = () => {
    fetchOrders();
    console.log('Manual sync completed.');
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'preparing':
        return <ChefHat className="h-4 w-4" />;
      case 'out-for-delivery':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => filter === 'all' || order.status === filter);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Panel for Testing */}
      <DebugPanel />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <button
            onClick={handleManualSync}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            title="Manually sync orders from main website"
          >
            🔄 Sync
          </button>
        </div>
        
        {/* Filter buttons */}
        <div className="flex space-x-2">
          {['all', 'pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                filter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {status === 'all' ? 'All Orders' : status.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders found</h2>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "No orders have been placed yet." 
              : `No ${filter.replace('-', ' ')} orders found.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={(order._id || order.id)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      Order #{(order._id || order.id || '').toString().slice(-6)}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status.replace('-', ' ')}</span>
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg text-gray-900">
                    {formatCurrency(order.total_amount || order.total || 0)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.payment_method} • {order.payment_status}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                <div className="space-y-2">
                  {(order.items || order.order_items || []).map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">{item.quantity}x</span>
                      <span className="flex-1">{item.name || item.pizzas?.name} {item.size ? `(${item.size})` : (item.pizza_sizes?.name ? `(${item.pizza_sizes.name})` : '')}</span>
                      <span className="text-gray-600">{formatCurrency((item.total_price || item.price || 0))}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-4 flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p>{order.delivery_address?.street || order.delivery_address?.addressLine1 || ''}</p>
                  <p>{order.delivery_address?.city}{order.delivery_address?.state ? `, ${order.delivery_address.state}` : ''} {order.delivery_address?.zipCode || ''}</p>
                  {order.delivery_address?.phone && (<p>Phone: {order.delivery_address.phone}</p>)}
                </div>
              </div>

              {/* Special Instructions */}
              {order.special_instructions && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-1">Special Instructions:</h4>
                  <p className="text-sm text-gray-600">{order.special_instructions}</p>
                </div>
              )}

              {/* Status Update Buttons */}
              <div className="flex space-x-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate((order._id || order.id), 'confirmed')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Confirm Order
                  </button>
                )}
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate((order._id || order.id), 'preparing')}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => handleStatusUpdate((order._id || order.id), 'out-for-delivery')}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
                  >
                    Out for Delivery
                  </button>
                )}
                {order.status === 'out-for-delivery' && (
                  <button
                    onClick={() => handleStatusUpdate((order._id || order.id), 'delivered')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Mark as Delivered
                  </button>
                )}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusUpdate((order._id || order.id), 'cancelled')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
