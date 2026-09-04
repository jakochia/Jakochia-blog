import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ post, featured = false }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group block rounded-xl overflow-hidden glass card-hover transition-all duration-300 ${
        featured ? 'md:col-span-1' : ''
      }`}
    >
      <div className="relative overflow-hidden">
        {post.coverImage ? (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-4xl opacity-20">📄</span>
          </div>
        )}
        {featured && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-xs font-semibold text-white shadow-lg">
            ⭐ Featured
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
          {post.category && (
            <span
              className="px-2.5 py-0.5 rounded-full text-white text-xs font-medium"
              style={{ backgroundColor: post.category.color || '#3b82f6' }}
            >
              {post.category.name}
            </span>
          )}
          <span>·</span>
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          {post.readingTime && (
            <>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
        </div>

        <h3 className="font-display font-semibold text-xl group-hover:text-gradient transition-all duration-300 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-text-secondary mt-2 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag._id}
                className="text-xs px-2.5 py-0.5 rounded-full bg-background/50 border border-border/50 text-text-secondary"
              >
                #{tag.name}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-text-secondary">+{post.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Bottom stats */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/30 text-xs text-text-secondary">
          <span className="flex items-center gap-1">👁️ {post.viewCount || 0}</span>
          <span className="flex items-center gap-1">❤️ {post.reactionCounts?.like || 0}</span>
          <span className="flex items-center gap-1">💬 {post.commentCount || 0}</span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;