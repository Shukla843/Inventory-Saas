import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { Plus, Edit, Trash2, Users, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const { hasRole } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    rating: 0,
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/supplier');
      if (response.data.success) {
        setSuppliers(response.data.suppliers);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
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
      const payload = {
        name: formData.name,
        contact: {
          phone: formData.phone,
          email: formData.email,
        },
        address: formData.address,
        rating: parseInt(formData.rating),
      };

      if (editingSupplier) {
        const response = await api.put(`/supplier/${editingSupplier._id}`, payload);
        if (response.data.success) {
          alert('Supplier updated successfully!');
          fetchSuppliers();
          resetForm();
        }
      } else {
        const response = await api.post('/supplier', payload);
        if (response.data.success) {
          alert('Supplier created successfully!');
          fetchSuppliers();
          resetForm();
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      phone: supplier.contact.phone,
      email: supplier.contact.email || '',
      address: supplier.address || '',
      rating: supplier.rating,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;

    try {
      const response = await api.delete(`/supplier/${id}`);
      if (response.data.success) {
        alert('Supplier deleted successfully!');
        fetchSuppliers();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', email: '', address: '', rating: 0 });
    setEditingSupplier(null);
    setShowModal(false);
  };

  if (loading) return <Loading message="Loading suppliers..." />;

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Suppliers</h1>
            <p className="text-gray-400">Manage your supplier network</p>
          </div>
          {hasRole(['admin', 'manager']) && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary btn-glow">
              <Plus size={20} />
              Add Supplier
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <div key={supplier._id} className="glass p-6 rounded-xl card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Users className="text-accent" size={24} />
                </div>
                <div className="rating rating-sm">
                  {[...Array(5)].map((_, i) => (
                    <input
                      key={i}
                      type="radio"
                      className="mask mask-star-2 bg-yellow-500"
                      checked={i < supplier.rating}
                      readOnly
                    />
                  ))}
                </div>
              </div>

              <h3 className="font-bold text-xl mb-4">{supplier.name}</h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <span>{supplier.contact.phone}</span>
                </div>
                {supplier.contact.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-gray-400" />
                    <span>{supplier.contact.email}</span>
                  </div>
                )}
              </div>

              {supplier.address && (
                <p className="text-sm text-gray-400 mb-4">{supplier.address}</p>
              )}

              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-400">Products Supplied:</span>
                <span className="font-semibold">{supplier.productCount || 0}</span>
              </div>

              {hasRole(['admin', 'manager']) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="btn btn-sm btn-primary flex-1"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  {hasRole('admin') && (
                    <button
                      onClick={() => handleDelete(supplier._id)}
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
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Supplier Name *</span>
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
                    <span className="label-text">Phone *</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="input input-bordered"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="input input-bordered"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <textarea
                    name="address"
                    className="textarea textarea-bordered"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                  ></textarea>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Rating (0-5)</span>
                  </label>
                  <input
                    type="number"
                    name="rating"
                    className="input input-bordered"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                  />
                </div>

                <div className="modal-action">
                  <button type="button" onClick={resetForm} className="btn">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingSupplier ? 'Update' : 'Create'}
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

export default Suppliers;
