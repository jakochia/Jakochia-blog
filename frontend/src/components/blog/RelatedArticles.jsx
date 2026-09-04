// ============================================================
// FRONTEND src/components/blog/RelatedArticles.jsx
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';

const RelatedArticles = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post._id}
            to={`/blog/${post.slug}`}
            className="p-4 bg-background-secondary rounded-lg border border-border hover:border-blue-500/50 transition-colors"
          >
            <h4 className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {post.title}
            </h4>
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;