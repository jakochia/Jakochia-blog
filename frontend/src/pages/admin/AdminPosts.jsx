// ============================================================
// FRONTEND src/pages/admin/AdminPosts.jsx
// ============================================================

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import PostList from '../../components/admin/PostList';
import PostForm from '../../components/admin/PostForm';

const AdminPosts = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AdminLayout title="Posts">
            <PostList />
          </AdminLayout>
        }
      />
      <Route
        path="/create"
        element={
          <AdminLayout title="New Post">
            <PostForm />
          </AdminLayout>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <AdminLayout title="Edit Post">
            <PostForm />
          </AdminLayout>
        }
      />
    </Routes>
  );
};

export default AdminPosts;