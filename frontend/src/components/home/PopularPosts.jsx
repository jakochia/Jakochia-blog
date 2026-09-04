// ============================================================
// FRONTEND src/components/home/PopularPosts.jsx
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';

const PopularPosts = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold mb-8">Popular Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post._id}
            to={`/blog/${post.slug}`}
            className="group p-4 rounded-lg bg-background-secondary border border-border hover:border-blue-500/50 transition-all"
          >
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
                loading="lazy"
              />
            )}
            <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
              {post.category && (
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {post.category.name}
                </span>
              )}
              <span>·</span>
              <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 className="font-semibold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-text-secondary">
              <span>👁️ {post.viewCount || 0} views</span>
              <span>❤️ {post.reactionCounts?.like || 0}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularPosts;