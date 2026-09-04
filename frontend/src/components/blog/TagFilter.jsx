// ============================================================
// FRONTEND src/components/blog/TagFilter.jsx
// ============================================================

import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const TagFilter = ({ tags, selected }) => {
  const [searchParams] = useSearchParams();

  const getLink = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('tag', slug);
    } else {
      params.delete('tag');
    }
    params.delete('page');
    return `?${params.toString()}`;
  };

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">Tags</h3>
      <div className="flex flex-wrap gap-1.5">
        <Link
          to={getLink('')}
          className={`text-xs px-2 py-1 rounded-full transition-colors ${!selected ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-neutral-100 dark:bg-neutral-800 text-text-secondary hover:text-text'}`}
        >
          All
        </Link>
        {tags.slice(0, 15).map((tag) => (
          <Link
            key={tag._id}
            to={getLink(tag.slug)}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${selected === tag.slug ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-neutral-100 dark:bg-neutral-800 text-text-secondary hover:text-text'}`}
          >
            #{tag.name} ({tag.count || 0})
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;