// ============================================================
// FRONTEND src/components/home/LatestPosts.jsx
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ArticleCard from '../blog/ArticleCard';

const LatestPosts = ({ posts }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!posts || posts.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2
          className={`text-2xl font-bold mb-8 ${
            isDark ? 'text-[#F8FAFC]' : 'text-[#1E1B4B]'
          }`}
        >
          Latest Posts
        </h2>
        <p className={isDark ? 'text-[#F8FAFC]/60' : 'text-[#334155]/60'}>
          No posts yet. Check back soon!
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2
          className={`text-2xl font-bold ${
            isDark ? 'text-[#F8FAFC]' : 'text-[#1E1B4B]'
          }`}
        >
          Latest Posts
        </h2>
        <Link
          to="/blog"
          className={`text-sm font-medium transition-colors duration-300 hover:underline ${
            isDark
              ? 'text-[#EA580C] hover:text-[#F8FAFC]'
              : 'text-[#2563EB] hover:text-[#EA580C]'
          }`}
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <ArticleCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default LatestPosts;