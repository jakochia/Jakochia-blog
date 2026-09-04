// ============================================================
// FRONTEND src/pages/admin/AdminDashboard.jsx
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import DashboardStats from '../../components/admin/DashboardStats';
import { api } from '../../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, analyticsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/dashboard/analytics?days=30'),
        ]);
        setData(dashboardRes.data);
        setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const { stats, recentActivity, recentPosts, recentComments } = data || {};

  return (
    <AdminLayout title="Dashboard">
      {stats && <DashboardStats stats={stats} />}

      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-background-secondary border border-border rounded-xl p-4">
            <h3 className="font-medium mb-3">Top Articles</h3>
            <div className="space-y-2">
              {analytics.topArticles?.map((post, i) => (
                <div key={post._id} className="flex items-center justify-between p-2 rounded hover:bg-background/50">
                  <span className="text-sm truncate flex-1">{i + 1}. {post.title}</span>
                  <span className="text-sm text-text-secondary">{post.viewCount} views</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-background-secondary border border-border rounded-xl p-4">
            <h3 className="font-medium mb-3">Device Breakdown</h3>
            <div className="space-y-2">
              {analytics.devices?.map((d) => (
                <div key={d.type} className="flex items-center justify-between p-2">
                  <span className="text-sm capitalize">{d.type || 'Unknown'}</span>
                  <span className="text-sm text-text-secondary">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-background-secondary border border-border rounded-xl p-4">
          <h3 className="font-medium mb-3">Recent Posts</h3>
          {recentPosts?.length > 0 ? (
            <div className="space-y-2">
              {recentPosts.map((post) => (
                <div key={post._id} className="flex items-center justify-between p-2 rounded hover:bg-background/50">
                  <span className="text-sm truncate flex-1">{post.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    post.status === 'published' ? 'bg-green-500/10 text-green-600' :
                    post.status === 'draft' ? 'bg-yellow-500/10 text-yellow-600' :
                    'bg-neutral-500/10 text-neutral-600'
                  }`}>
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm">No posts yet</p>
          )}
        </div>

        <div className="bg-background-secondary border border-border rounded-xl p-4">
          <h3 className="font-medium mb-3">Recent Comments</h3>
          {recentComments?.length > 0 ? (
            <div className="space-y-2">
              {recentComments.map((comment) => (
                <div key={comment._id} className="p-2 rounded hover:bg-background/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{comment.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      comment.status === 'approved' ? 'bg-green-500/10 text-green-600' :
                      comment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600' :
                      'bg-red-500/10 text-red-600'
                    }`}>
                      {comment.status}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary truncate">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm">No comments yet</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;