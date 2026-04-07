import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { Plus, Edit, Trash2, Warehouse as WarehouseIcon, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const { hasRole } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 10000,
    description: '',
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await api.get('/warehouse');
      if (response.data.success) {
        setWarehouses(response.data.warehouses);
      }
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
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
      if (editingWarehouse) {
        const response = await api.put(`/warehouse/${editingWarehouse._id}`, formData);
        if (response.data.success) {
          alert('Warehouse updated successfully!');
          fetchWarehouses();
          resetForm();
        }
      } else {
        const response = await api.post('/warehouse', formData);
        if (response.data.success) {
          alert('Warehouse created successfully!');
          fetchWarehouses();
          resetForm();
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      location: warehouse.location,
      capacity: warehouse.capacity,
      description: warehouse.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this warehouse?')) return;

    try {
      const response = await api.delete(`/warehouse/${id}`);
      if (response.data.success) {
        alert('Warehouse deleted successfully!');
        fetchWarehouses();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', location: '', capacity: 10000, description: '' });
    setEditingWarehouse(null);
    setShowModal(false);
  };

  if (loading) return <Loading message="Loading warehouses..." />;

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Warehouses</h1>
            <p className="text-gray-400">Manage your warehouse locations</p>
          </div>
          {hasRole(['admin', 'manager']) && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary btn-glow">
              <Plus size={20} />
              Add Warehouse
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((warehouse) => (
            <div key={warehouse._id} className="glass p-6 rounded-xl card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <WarehouseIcon className="text-primary" size={24} />
                </div>
                {warehouse.isActive ? (
                  <span className="badge badge-success">Active</span>
                ) : (
                  <span className="badge badge-error">Inactive</span>
                )}
              </div>

              <h3 className="font-bold text-xl mb-2">{warehouse.name}</h3>
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <MapPin size={16} />
                <span className="text-sm">{warehouse.location}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Capacity:</span>
                  <span className="font-semibold">{warehouse.capacity} units</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Products:</span>
                  <span className="font-semibold">{warehouse.productCount || 0}</span>
                </div>
              </div>

              {warehouse.description && (
                <p className="text-sm text-gray-400 mb-4">{warehouse.description}</p>
              )}

              {hasRole(['admin', 'manager']) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(warehouse)}
                    className="btn btn-sm btn-primary flex-1"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  {hasRole('admin') && (
                    <button
                      onClick={() => handleDelete(warehouse._id)}
                      className="btn btn-sm btn-error"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Warehouse Name *</span>
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

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Location *</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    className="input input-bordered"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Capacity (units)</span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    className="input input-bordered"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>

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

                <div className="modal-action">
                  <button type="button" onClick={resetForm} className="btn">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingWarehouse ? 'Update' : 'Create'}
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

export default Warehouses;
