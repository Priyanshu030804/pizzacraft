import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Package,
  Star
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import useSocket from '../../hooks/useSocket';
import { formatCurrency } from '../../utils/currency';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  totalUsers: number;
  activeOrders: number;
  monthlyRevenue: number;
}

interface TopPizza {
  name: string;
  quantity: number;
}

interface LowInventoryItem {
  id: string;
  name: string;
  quantity: number;
  min_quantity: number;
  unit: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    todayOrders: 0,
    totalUsers: 0,
    activeOrders: 0,
    monthlyRevenue: 0
  });
  const [topPizzas, setTopPizzas] = useState<TopPizza[]>([]);
  const [lowInventory, setLowInventory] = useState<LowInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const fetchDashboardData = useCallback(async () => {
    // Demo data for non-authenticated users
    const demoStats: DashboardStats = {
      totalOrders: 1247,
      todayOrders: 23,
      totalUsers: 456,
      activeOrders: 8,
      monthlyRevenue: 15420
    };

    const demoTopPizzas: TopPizza[] = [
      { name: 'Margherita', quantity: 45 },
      { name: 'Pepperoni', quantity: 38 },
      { name: 'Supreme', quantity: 29 },
      { name: 'Hawaiian', quantity: 22 },
      { name: 'Veggie Deluxe', quantity: 18 }
    ];

    const demoLowInventory: LowInventoryItem[] = [
      { id: '1', name: 'Mozzarella Cheese', quantity: 5, min_quantity: 10, unit: 'kg' },
      { id: '2', name: 'Pepperoni', quantity: 8, min_quantity: 15, unit: 'kg' },
      { id: '3', name: 'Pizza Dough', quantity: 12, min_quantity: 20, unit: 'pieces' }
    ];

    try {
      setLoading(true);
      
      if (!user) {
        // Use demo data for non-authenticated users
        setStats(demoStats);
        setTopPizzas(demoTopPizzas);
        setLowInventory(demoLowInventory);
        return;
      }

      const response = await adminAPI.getDashboard();
      const { stats, topSellingPizzas, lowInventoryItems } = response.data;
      
      setStats(stats);
      setTopPizzas(topSellingPizzas);
      setLowInventory(lowInventoryItems);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to demo data on error
      setStats(demoStats);
      setTopPizzas(demoTopPizzas);
      setLowInventory(demoLowInventory);
      toast.error('Using demo data - authentication required for live data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
    
    // Setup real-time updates
    if (socket) {
      socket.emit('join-admin-room');
      socket.on('new-order', handleNewOrder);
      socket.on('low-inventory-alert', handleLowInventoryAlert);
      
      return () => {
        socket.off('new-order');
        socket.off('low-inventory-alert');
      };
    }
  }, [socket, fetchDashboardData]);

  const handleNewOrder = (data: { order: { total: number }; user: { firstName: string; lastName: string } }) => {
    setStats(prev => ({
      ...prev,
      todayOrders: prev.todayOrders + 1,
      totalOrders: prev.totalOrders + 1,
      activeOrders: prev.activeOrders + 1
    }));
    
    toast.success(`New order received from ${data.user.firstName} ${data.user.lastName}`);
  };

  const handleLowInventoryAlert = (item: LowInventoryItem) => {
    setLowInventory(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? item : i);
      }
      return [...prev, item];
    });
    
    toast.error(`Low inventory alert: ${item.name}`);
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: Clock,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Total Customers',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: Package,
      color: 'bg-orange-500',
      change: '+5%'
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: 'bg-primary-500',
      change: '+23%'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your restaurant today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">{card.change}</span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Selling Pizzas */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-900">Top Selling Pizzas</h2>
              </div>
            </div>
            
            <div className="p-6">
              {topPizzas.length > 0 ? (
                <div className="space-y-4">
                  {topPizzas.map((pizza, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold text-sm">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{pizza.name}</p>
                          <p className="text-sm text-gray-500">{pizza.quantity} sold</p>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ 
                              width: `${Math.min((pizza.quantity / (topPizzas[0]?.quantity || 1)) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No sales data available</p>
              )}
            </div>
          </div>

          {/* Low Inventory Alerts */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h2 className="text-xl font-semibold text-gray-900">Low Inventory Alerts</h2>
                </div>
                {lowInventory.length > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {lowInventory.length} alerts
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {lowInventory.length > 0 ? (
                <div className="space-y-4">
                  {lowInventory.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-red-600">
                          Only {item.quantity} {item.unit} left (min: {item.min_quantity})
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Low Stock
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {lowInventory.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{lowInventory.length - 5} more items need attention
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">All inventory levels are good!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-primary-500 text-white px-4 py-3 rounded-lg hover:bg-primary-600 transition-colors">
              <ShoppingBag className="h-5 w-5" />
              <span>View Orders</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors">
              <Package className="h-5 w-5" />
              <span>Manage Inventory</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors">
              <Users className="h-5 w-5" />
              <span>View Customers</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors">
              <TrendingUp className="h-5 w-5" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;