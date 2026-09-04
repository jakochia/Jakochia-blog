// ============================================================
// FRONTEND src/pages/admin/AdminComments.jsx
// ============================================================

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchComments();
  }, [page, statusFilter]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.append('status', statusFilter);
      const res = await api.get(`/admin/comments?${params}`);
      setComments(res.data.comments || []);
      setPagination(res.data.pagination || { page: 1, total: 0, pages: 0 });
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/admin/comments/${id}`, { status });
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await api.delete(`/admin/comments/${id}`);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'rejected': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      case 'spam': return 'bg-neutral-500/10 text-neutral-600';
      default: return 'bg-neutral-500/10 text-neutral-600';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Comments">
        <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Comments">
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="spam">Spam</option>
        </select>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <p>No comments found</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment._id} className="p-4 bg-background-secondary border border-border rounded-xl">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{comment.name}</span>
                      <span className="text-xs text-text-secondary">· {comment.email}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(comment.status)}`}>
                        {comment.status}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                      <span>On: {comment.post?.title || 'Deleted post'}</span>
                      <span>·</span>
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {comment.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusUpdate(comment._id, 'approved')} className="text-xs text-green-600 dark:text-green-400 hover:underline">Approve</button>
                        <button onClick={() => handleStatusUpdate(comment._id, 'rejected')} className="text-xs text-red-600 dark:text-red-400 hover:underline">Reject</button>
                        <button onClick={() => handleStatusUpdate(comment._id, 'spam')} className="text-xs text-neutral-600 dark:text-neutral-400 hover:underline">Spam</button>
                      </>
                    )}
                    {comment.status === 'approved' && (
                      <button onClick={() => handleStatusUpdate(comment._id, 'rejected')} className="text-xs text-red-600 dark:text-red-400 hover:underline">Unapprove</button>
                    )}
                    <button onClick={() => handleDelete(comment._id)} className="text-xs text-red-600 dark:text-red-400 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
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

export default AdminComments;