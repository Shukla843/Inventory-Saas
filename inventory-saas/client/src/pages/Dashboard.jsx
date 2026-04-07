import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import {
  Package,
  Warehouse,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatDateTime, getTimeAgo } from '../utils/helpers';
import { staggerFadeIn, cardReveal, animateNumber } from '../utils/animations';

/**
 * Dashboard Page
 * Main analytics and overview page
 */
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cardsRef = useRef([]);
  const statsRef = useRef([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    if (stats && cardsRef.current.length > 0) {
      cardReveal(cardsRef.current);
      
      // Animate numbers
      statsRef.current.forEach((ref, index) => {
        if (ref) {
          const values = [
            stats.overview.totalProducts,
            stats.overview.totalWarehouses,
            stats.overview.totalSuppliers,
            stats.overview.lowStockCount,
          ];
          setTimeout(() => animateNumber(ref, values[index], 1.5), 300);
        }
      });
    }
  }, [stats]);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading dashboard..." />;

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening with your inventory.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Products */}
          <div
            ref={(el) => (cardsRef.current[0] = el)}
            className="glass p-6 rounded-xl card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Package className="text-primary" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Products</h3>
            <p ref={(el) => (statsRef.current[0] = el)} className="text-3xl font-bold">
              0
            </p>
          </div>

          {/* Total Warehouses */}
          <div
            ref={(el) => (cardsRef.current[1] = el)}
            className="glass p-6 rounded-xl card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Warehouse className="text-secondary" size={24} />
              </div>
              <Activity className="text-blue-500" size={20} />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Warehouses</h3>
            <p ref={(el) => (statsRef.current[1] = el)} className="text-3xl font-bold">
              0
            </p>
          </div>

          {/* Total Suppliers */}
          <div
            ref={(el) => (cardsRef.current[2] = el)}
            className="glass p-6 rounded-xl card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Users className="text-accent" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Suppliers</h3>
            <p ref={(el) => (statsRef.current[2] = el)} className="text-3xl font-bold">
              0
            </p>
          </div>

          {/* Low Stock Alerts */}
          <div
            ref={(el) => (cardsRef.current[3] = el)}
            className="glass p-6 rounded-xl card-hover border-2 border-yellow-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <AlertTriangle className="text-yellow-500" size={24} />
              </div>
              <TrendingDown className="text-red-500" size={20} />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Low Stock Alerts</h3>
            <p ref={(el) => (statsRef.current[3] = el)} className="text-3xl font-bold text-yellow-500">
              0
            </p>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="glass p-6 rounded-xl mb-8">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-green-500" size={24} />
            <h3 className="text-lg font-semibold">Total Inventory Value</h3>
          </div>
          <p className="text-4xl font-bold text-green-500">
            {formatCurrency(stats?.overview.totalInventoryValue || 0)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution */}
          <div className="glass p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
            {stats?.categoryDistribution && stats.categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.categoryDistribution}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {stats.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-20">No data available</p>
            )}
          </div>

          {/* Warehouse Inventory */}
          <div className="glass p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Warehouse Inventory</h3>
            {stats?.warehouseInventory && stats.warehouseInventory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.warehouseInventory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="warehouseName" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="productCount" fill="#6366f1" name="Products" />
                  <Bar dataKey="totalQuantity" fill="#8b5cf6" name="Total Quantity" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-20">No warehouses created yet</p>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Recent Stock Movements</h3>
          {stats?.recentActivities && stats.recentActivities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Warehouse</th>
                    <th>Performed By</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentActivities.slice(0, 10).map((activity) => (
                    <tr key={activity._id}>
                      <td>
                        <div className="font-semibold">{activity.product?.name}</div>
                        <div className="text-xs text-gray-400">{activity.product?.sku}</div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            activity.type === 'inward'
                              ? 'badge-success'
                              : activity.type === 'outward'
                              ? 'badge-error'
                              : 'badge-warning'
                          }`}
                        >
                          {activity.type}
                        </span>
                      </td>
                      <td>{activity.quantity}</td>
                      <td>{activity.warehouse?.name}</td>
                      <td>{activity.performedBy?.name}</td>
                      <td className="text-sm text-gray-400">
                        {getTimeAgo(activity.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-10">No recent activities</p>
          )}
        </div>

        {/* Low Stock Products */}
        {stats?.restockNeeded && stats.restockNeeded.length > 0 && (
          <div className="glass p-6 rounded-xl mt-6 border-2 border-yellow-500/30">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" />
              Products Needing Restock
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.restockNeeded.map((product) => (
                <div key={product._id} className="bg-dark-light p-4 rounded-lg">
                  <h4 className="font-semibold mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-400 mb-2">{product.sku}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-500">
                      Stock: {product.quantity}/{product.lowStockThreshold}
                    </span>
                    <button
                      onClick={() => navigate('/inventory')}
                      className="btn btn-xs btn-primary"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
