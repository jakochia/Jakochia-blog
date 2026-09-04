// ============================================================
// FRONTEND src/components/home/FeaturedArticles.jsx
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../blog/ArticleCard';

const FeaturedArticles = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  const featured = posts.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Featured Articles</h2>
        <Link to="/blog" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featured.map((post) => (
          <ArticleCard key={post._id} post={post} featured />
        ))}
      </div>
    </section>
  );
};

export default FeaturedArticles;