import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Filter, AlertTriangle, Package } from 'lucide-react';
import { inventoryAPI } from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import useSocket from '../../hooks/useSocket';
import toast from 'react-hot-toast';

interface InventoryItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  min_quantity: number;
  price_per_unit: number;
  supplier: string;
  created_at: string;
  updated_at: string;
}

const AdminInventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'base',
    quantity: '',
    unit: '',
    min_quantity: '',
    price_per_unit: '',
    supplier: ''
  });
  const socket = useSocket();

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params: { type?: string; lowStock?: boolean } = {};
      if (typeFilter !== 'all') params.type = typeFilter;
      if (showLowStock) params.lowStock = true;
      
      const response = await inventoryAPI.getItems(params);
      let filteredItems = response.data;
      
      if (searchTerm) {
        filteredItems = filteredItems.filter((item: InventoryItem) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setItems(filteredItems);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, [typeFilter, showLowStock, searchTerm]);

  useEffect(() => {
    fetchItems();
    
    // Setup real-time updates
    if (socket) {
      socket.emit('subscribe-inventory');
      socket.on('inventory-updated', handleInventoryUpdate);
      socket.on('low-inventory-alert', handleLowInventoryAlert);
      
      return () => {
        socket.off('inventory-updated');
        socket.off('low-inventory-alert');
      };
    }
  }, [socket, typeFilter, showLowStock, searchTerm, fetchItems]);

  const handleInventoryUpdate = (data: { action: string; item?: InventoryItem; itemId?: string; items?: InventoryItem[] }) => {
    switch (data.action) {
      case 'item-created':
        if (data.item) {
          setItems(prev => [data.item!, ...prev]);
        }
        break;
      case 'item-updated':
        if (data.item) {
          setItems(prev =>
            prev.map(item => item.id === data.item!.id ? data.item! : item)
          );
        }
        break;
      case 'item-deleted':
        if (data.itemId) {
          setItems(prev => prev.filter(item => item.id !== data.itemId));
        }
        break;
      case 'bulk-updated':
        if (data.items) {
          setItems(prev =>
            prev.map(item => {
              const updated = data.items!.find((i: InventoryItem) => i.id === item.id);
              return updated || item;
            })
          );
        }
        break;
    }
  };

  const handleLowInventoryAlert = (item: InventoryItem) => {
    toast.error(`Low inventory alert: ${item.name}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const itemData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        minQuantity: parseInt(formData.min_quantity),
        pricePerUnit: parseFloat(formData.price_per_unit) || 0
      };

      if (editingItem) {
        await inventoryAPI.updateItem(editingItem.id, itemData);
        toast.success('Item updated successfully');
      } else {
        await inventoryAPI.createItem(itemData);
        toast.success('Item created successfully');
      }
      
      setShowModal(false);
      setEditingItem(null);
      resetForm();
      fetchItems();
    } catch (error: unknown) {
      console.error('Error saving item:', error);
      const message = error instanceof Error && 'response' in error && 
                     error.response && typeof error.response === 'object' && 
                     'data' in error.response && error.response.data &&
                     typeof error.response.data === 'object' && 'error' in error.response.data
                     ? String(error.response.data.error) 
                     : 'Failed to save item';
      toast.error(message);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      type: item.type,
      quantity: item.quantity.toString(),
      unit: item.unit,
      min_quantity: item.min_quantity.toString(),
      price_per_unit: item.price_per_unit.toString(),
      supplier: item.supplier || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await inventoryAPI.deleteItem(itemId);
      toast.success('Item deleted successfully');
      fetchItems();
    } catch (error: unknown) {
      console.error('Error deleting item:', error);
      const message = error instanceof Error && 'response' in error && 
                     error.response && typeof error.response === 'object' && 
                     'data' in error.response && error.response.data &&
                     typeof error.response.data === 'object' && 'error' in error.response.data
                     ? String(error.response.data.error) 
                     : 'Failed to delete item';
      toast.error(message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'base',
      quantity: '',
      unit: '',
      min_quantity: '',
      price_per_unit: '',
      supplier: ''
    });
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.min_quantity) {
      return { status: 'low', color: 'bg-red-100 text-red-800', label: 'Low Stock' };
    } else if (item.quantity <= item.min_quantity * 1.5) {
      return { status: 'medium', color: 'bg-yellow-100 text-yellow-800', label: 'Medium Stock' };
    } else {
      return { status: 'good', color: 'bg-green-100 text-green-800', label: 'Good Stock' };
    }
  };

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'base', label: 'Base' },
    { value: 'sauce', label: 'Sauce' },
    { value: 'cheese', label: 'Cheese' },
    { value: 'vegetable', label: 'Vegetable' },
    { value: 'meat', label: 'Meat' },
    { value: 'other', label: 'Other' }
  ];

  const lowStockItems = items.filter(item => item.quantity <= item.min_quantity);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900">
              Inventory Management
            </h1>
            <p className="text-gray-600">
              Track and manage your restaurant inventory
            </p>
          </div>
          
          <button
            onClick={() => {
              resetForm();
              setEditingItem(null);
              setShowModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-red-800 font-medium">
                {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} running low on stock
              </h3>
            </div>
            <div className="mt-2 text-sm text-red-700">
              {lowStockItems.slice(0, 3).map(item => item.name).join(', ')}
              {lowStockItems.length > 3 && ` and ${lowStockItems.length - 3} more`}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Low Stock Filter */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Low stock only</span>
            </label>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Required
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price/Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No inventory items found
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const stockStatus = getStockStatus(item);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Package className="h-8 w-8 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {item.id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                            {item.type}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.quantity} {item.unit}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.min_quantity} {item.unit}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                            {stockStatus.label}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(item.price_per_unit)}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.supplier || 'N/A'}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Item Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="base">Base</option>
                      <option value="sauce">Sauce</option>
                      <option value="cheese">Cheese</option>
                      <option value="vegetable">Vegetable</option>
                      <option value="meat">Meat</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="kg, liters, pieces"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.min_quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_quantity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Unit
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price_per_unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_per_unit: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    {editingItem ? 'Update' : 'Create'} Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInventory;