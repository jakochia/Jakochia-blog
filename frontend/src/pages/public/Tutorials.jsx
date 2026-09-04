// ============================================================
// FRONTEND src/pages/public/Tutorials.jsx
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import ArticleCard from '../../components/blog/ArticleCard';

const Tutorials = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const res = await api.get('/posts?category=tutorials&limit=20');
        setPosts(res.data.posts || []);
      } catch (error) {
        console.error('Error fetching tutorials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutorials();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tutorials</h1>
        <p className="text-text-secondary mt-1">Step-by-step guides and learning resources</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <p>No tutorials yet. Check back soon!</p>
          <Link to="/blog" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
            View all blog posts →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tutorials;