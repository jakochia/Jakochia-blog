// ============================================================
// FRONTEND src/pages/public/Tag.jsx
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ArticleCard from '../../components/blog/ArticleCard';
import { api } from '../../services/api';

const Tag = () => {
  const { slug } = useParams();
  const [tag, setTag] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTag = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/tags/${slug}`);
        setTag(res.data.tag);
        setPosts(res.data.posts || []);
      } catch (error) {
        console.error('Error fetching tag:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTag();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold">Tag not found</h1>
        <Link to="/blog" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">#{tag.name}</h1>
        <p className="text-sm text-text-secondary mt-1">{posts.length} articles tagged</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <p>No posts with this tag yet</p>
          <Link to="/blog" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
            View all posts →
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

export default Tag;