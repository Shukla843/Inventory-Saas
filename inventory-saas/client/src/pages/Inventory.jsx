import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { Plus, Search, Edit, Trash2, Package, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate, getStockStatus } from '../utils/helpers';
import { staggerFadeIn } from '../utils/animations';
import { useAuth } from '../context/AuthContext';

/**
 * Inventory Page
 * Manage all products with CRUD operations
 */
const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { hasRole } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Other',
    quantity: 0,
    price: 0,
    lowStockThreshold: 10,
    warehouse: '',
    supplier: '',
    description: '',
  });

  const cardsRef = useRef([]);

  const categories = ['Electronics', 'Clothing', 'Food', 'Furniture', 'Hardware', 'Medical', 'Other'];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (products.length > 0 && cardsRef.current.length > 0) {
      staggerFadeIn(cardsRef.current, 0.05);
    }
  }, [products]);

  const fetchData = async () => {
    try {
      const [productsRes, warehousesRes, suppliersRes] = await Promise.all([
        api.get('/products'),
        api.get('/warehouse'),
        api.get('/supplier'),
      ]);

      if (productsRes.data.success) setProducts(productsRes.data.products);
      if (warehousesRes.data.success) setWarehouses(warehousesRes.data.warehouses);
      if (suppliersRes.data.success) setSuppliers(suppliersRes.data.suppliers);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update product
        const response = await api.put(`/products/${editingProduct._id}`, formData);
        if (response.data.success) {
          alert('Product updated successfully!');
          fetchData();
          resetForm();
        }
      } else {
        // Create product
        const response = await api.post('/products', formData);
        if (response.data.success) {
          alert('Product created successfully!');
          fetchData();
          resetForm();
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      lowStockThreshold: product.lowStockThreshold,
      warehouse: product.warehouse._id,
      supplier: product.supplier?._id || '',
      description: product.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await api.delete(`/products/${id}`);
      if (response.data.success) {
        alert('Product deleted successfully!');
        fetchData();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      category: 'Other',
      quantity: 0,
      price: 0,
      lowStockThreshold: 10,
      warehouse: '',
      supplier: '',
      description: '',
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <Loading message="Loading inventory..." />;

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
            <p className="text-gray-400">Manage your products and stock levels</p>
          </div>
          {hasRole(['admin', 'manager']) && (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary btn-glow"
            >
              <Plus size={20} />
              Add Product
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="glass p-6 rounded-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="form-control">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or SKU..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="form-control">
              <select
                className="select select-bordered"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="glass p-20 rounded-xl text-center">
            <Package className="mx-auto mb-4 text-gray-500" size={64} />
            <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || selectedCategory
                ? 'Try adjusting your filters'
                : 'Get started by adding your first product'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => {
              const stockStatus = getStockStatus(product.quantity, product.lowStockThreshold);
              return (
                <div
                  key={product._id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="glass p-6 rounded-xl card-hover"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-400">{product.sku}</p>
                    </div>
                    <span className="badge badge-primary">{product.category}</span>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Stock Level</span>
                      <span className={`badge ${stockStatus.badge}`}>
                        {stockStatus.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-dark-light rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            product.quantity === 0
                              ? 'bg-red-500'
                              : product.quantity <= product.lowStockThreshold
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(
                              (product.quantity / (product.lowStockThreshold * 2)) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="font-bold">{product.quantity}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Price:</span>
                      <span className="font-semibold">{formatCurrency(product.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Warehouse:</span>
                      <span>{product.warehouse?.name}</span>
                    </div>
                    {product.supplier && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Supplier:</span>
                        <span>{product.supplier.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {hasRole(['admin', 'manager']) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="btn btn-sm btn-primary flex-1"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      {hasRole('admin') && (
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="btn btn-sm btn-error"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Product Name *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="input input-bordered"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* SKU */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">SKU *</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      className="input input-bordered"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      disabled={!!editingProduct}
                    />
                  </div>

                  {/* Category */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Category *</span>
                    </label>
                    <select
                      name="category"
                      className="select select-bordered"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Warehouse */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Warehouse *</span>
                    </label>
                    <select
                      name="warehouse"
                      className="select select-bordered"
                      value={formData.warehouse}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Warehouse</option>
                      {warehouses.map((wh) => (
                        <option key={wh._id} value={wh._id}>
                          {wh.name} - {wh.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Initial Quantity *</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      className="input input-bordered"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="0"
                      required
                      disabled={!!editingProduct}
                    />
                  </div>

                  {/* Price */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Price *</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      className="input input-bordered"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  {/* Low Stock Threshold */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Low Stock Threshold</span>
                    </label>
                    <input
                      type="number"
                      name="lowStockThreshold"
                      className="input input-bordered"
                      value={formData.lowStockThreshold}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>

                  {/* Supplier */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Supplier (Optional)</span>
                    </label>
                    <select
                      name="supplier"
                      className="select select-bordered"
                      value={formData.supplier}
                      onChange={handleInputChange}
                    >
                      <option value="">No Supplier</option>
                      {suppliers.map((sup) => (
                        <option key={sup._id} value={sup._id}>
                          {sup.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="description"
                    className="textarea textarea-bordered"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>

                {/* Actions */}
                <div className="modal-action">
                  <button type="button" onClick={resetForm} className="btn">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Update' : 'Create'} Product
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-backdrop" onClick={resetForm}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
