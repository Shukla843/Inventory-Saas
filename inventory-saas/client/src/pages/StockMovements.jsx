import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { Plus, ArrowUpCircle, ArrowDownCircle, RefreshCw } from 'lucide-react';
import { formatDateTime, getTimeAgo } from '../utils/helpers';

const StockMovements = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    productId: '',
    type: 'inward',
    quantity: 0,
    reason: '',
    reference: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [movementsRes, productsRes] = await Promise.all([
        api.get('/stock/history?limit=50'),
        api.get('/products'),
      ]);

      if (movementsRes.data.success) setMovements(movementsRes.data.movements);
      if (productsRes.data.success) setProducts(productsRes.data.products);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/stock/move', formData);
      if (response.data.success) {
        alert(`Stock ${formData.type} recorded successfully!`);
        fetchData();
        resetForm();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      type: 'inward',
      quantity: 0,
      reason: '',
      reference: '',
    });
    setShowModal(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'inward':
        return <ArrowUpCircle className="text-green-500" size={20} />;
      case 'outward':
        return <ArrowDownCircle className="text-red-500" size={20} />;
      case 'adjustment':
        return <RefreshCw className="text-yellow-500" size={20} />;
      default:
        return null;
    }
  };

  if (loading) return <Loading message="Loading stock movements..." />;

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Stock Movements</h1>
            <p className="text-gray-400">Track all inventory changes</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-glow">
            <Plus size={20} />
            Record Movement
          </button>
        </div>

        {/* Movements Table */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Previous</th>
                  <th>New</th>
                  <th>Warehouse</th>
                  <th>Performed By</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-gray-400">
                      No stock movements recorded yet
                    </td>
                  </tr>
                ) : (
                  movements.map((movement) => (
                    <tr key={movement._id}>
                      <td>
                        <div className="text-sm">{formatDateTime(movement.createdAt)}</div>
                        <div className="text-xs text-gray-400">
                          {getTimeAgo(movement.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(movement.type)}
                          <span
                            className={`badge ${
                              movement.type === 'inward'
                                ? 'badge-success'
                                : movement.type === 'outward'
                                ? 'badge-error'
                                : 'badge-warning'
                            }`}
                          >
                            {movement.type}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold">{movement.product?.name}</div>
                        <div className="text-xs text-gray-400">{movement.product?.sku}</div>
                      </td>
                      <td className="font-bold">{movement.quantity}</td>
                      <td>{movement.previousQuantity}</td>
                      <td className="font-semibold">{movement.newQuantity}</td>
                      <td>{movement.warehouse?.name}</td>
                      <td>{movement.performedBy?.name}</td>
                      <td className="text-sm text-gray-400">{movement.reason || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Record Movement Modal */}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Record Stock Movement</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Product *</span>
                  </label>
                  <select
                    name="productId"
                    className="select select-bordered"
                    value={formData.productId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} ({product.sku}) - Current: {product.quantity}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Movement Type *</span>
                  </label>
                  <select
                    name="type"
                    className="select select-bordered"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="inward">Inward (Add Stock)</option>
                    <option value="outward">Outward (Remove Stock)</option>
                    <option value="adjustment">Adjustment (Correct Stock)</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Quantity *</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    className="input input-bordered"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Reason</span>
                  </label>
                  <input
                    type="text"
                    name="reason"
                    className="input input-bordered"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="e.g., New purchase, Sale, Damaged items"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Reference (Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="reference"
                    className="input input-bordered"
                    value={formData.reference}
                    onChange={handleInputChange}
                    placeholder="e.g., PO-123, Invoice-456"
                  />
                </div>

                <div className="modal-action">
                  <button type="button" onClick={resetForm} className="btn">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Record Movement
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

export default StockMovements;
