// ============================================================
// FRONTEND src/pages/admin/AdminCategories.jsx
// ============================================================

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', color: '#2563eb' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, form);
      } else {
        await api.post('/admin/categories', form);
      }
      setForm({ name: '', description: '', color: '#2563eb' });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.response?.data?.error || 'Failed to save category');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name, description: cat.description || '', color: cat.color || '#2563eb' });
  };

  if (loading) {
    return (
      <AdminLayout title="Categories">
        <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Categories">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-background-secondary border border-border rounded-xl p-4">
          <h3 className="font-medium mb-4">{editingId ? 'Edit Category' : 'New Category'}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Category name *"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 outline-none transition"
              required
            />
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description (optional)"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 outline-none transition"
            />
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
              className="w-full h-10 rounded-lg border border-border cursor-pointer"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setForm({ name: '', description: '', color: '#2563eb' }); }}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-background/50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-background-secondary border border-border rounded-xl p-4">
          <h3 className="font-medium mb-4">All Categories ({categories.length})</h3>
          {categories.length === 0 ? (
            <p className="text-text-secondary text-sm">No categories yet</p>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors border border-border">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color || '#2563eb' }} />
                    <div>
                      <span className="font-medium">{cat.name}</span>
                      {cat.description && <span className="text-xs text-text-secondary ml-2">{cat.description}</span>}
                      <span className="text-xs text-text-secondary ml-2">({cat.count || 0} posts)</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(cat)} className="text-blue-600 dark:text-blue-400 text-xs hover:underline">Edit</button>
                    <button onClick={() => handleDelete(cat._id, cat.name)} className="text-red-600 dark:text-red-400 text-xs hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;