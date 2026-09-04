// ============================================================
// FRONTEND src/pages/admin/AdminTags.jsx
// ============================================================

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';

const AdminTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tags');
      setTags(res.data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (editingId) {
        await api.put(`/admin/tags/${editingId}`, { name: name.trim() });
      } else {
        await api.post('/admin/tags', { name: name.trim() });
      }
      setName('');
      setEditingId(null);
      fetchTags();
    } catch (error) {
      console.error('Error saving tag:', error);
      alert(error.response?.data?.error || 'Failed to save tag');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete tag "${name}"?`)) return;
    try {
      await api.delete(`/admin/tags/${id}`);
      fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const handleEdit = (tag) => {
    setEditingId(tag._id);
    setName(tag.name);
  };

  if (loading) {
    return (
      <AdminLayout title="Tags">
        <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tags">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-background-secondary border border-border rounded-xl p-4">
          <h3 className="font-medium mb-4">{editingId ? 'Edit Tag' : 'New Tag'}</h3>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tag name *"
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 outline-none transition"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
          </form>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setName(''); }}
              className="mt-2 text-sm text-text-secondary hover:text-text transition-colors"
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="lg:col-span-2 bg-background-secondary border border-border rounded-xl p-4">
          <h3 className="font-medium mb-4">All Tags ({tags.length})</h3>
          {tags.length === 0 ? (
            <p className="text-text-secondary text-sm">No tags yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div key={tag._id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border hover:border-blue-500/50 transition-colors">
                  <span className="text-sm">#{tag.name}</span>
                  <span className="text-xs text-text-secondary">({tag.count || 0})</span>
                  <button onClick={() => handleEdit(tag)} className="text-blue-600 dark:text-blue-400 text-xs hover:underline">Edit</button>
                  <button onClick={() => handleDelete(tag._id, tag.name)} className="text-red-600 dark:text-red-400 text-xs hover:underline">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTags;