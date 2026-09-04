// ============================================================
// FRONTEND src/pages/admin/AdminSubscribers.jsx
// ============================================================

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('active');

  useEffect(() => {
    fetchSubscribers();
  }, [page, statusFilter]);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, status: statusFilter });
      const res = await api.get(`/admin/subscribers?${params}`);
      setSubscribers(res.data.subscribers || []);
      setPagination(res.data.pagination || { page: 1, total: 0, pages: 0 });
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, email) => {
    if (!confirm(`Remove subscriber "${email}"?`)) return;
    try {
      await api.delete(`/admin/subscribers/${id}`);
      fetchSubscribers();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Subscribers">
        <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Subscribers">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition"
          >
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
          </select>
        </div>
        <span className="text-sm text-text-secondary">{pagination.total} subscribers</span>
      </div>

      {subscribers.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <p>No subscribers found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-text-secondary border-b border-border">
                <tr>
                  <th className="text-left py-3 px-3">Email</th>
                  <th className="text-left py-3 px-3 hidden md:table-cell">Status</th>
                  <th className="text-left py-3 px-3 hidden md:table-cell">Subscribed</th>
                  <th className="text-left py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="border-b border-border">
                    <td className="py-3 px-3">{sub.email}</td>
                    <td className="py-3 px-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        sub.status === 'active' ? 'bg-green-500/10 text-green-600' :
                        sub.status === 'unsubscribed' ? 'bg-neutral-500/10 text-neutral-600' :
                        'bg-red-500/10 text-red-600'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell text-text-secondary">
                      {formatDate(sub.subscribedAt)}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleDelete(sub._id, sub.email)}
                        className="text-red-600 dark:text-red-400 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded transition-colors ${
                    p === page ? 'bg-blue-600 text-white' : 'hover:bg-border'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminSubscribers;