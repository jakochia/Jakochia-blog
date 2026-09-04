import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const CategoryFilter = ({ categories, selected }) => {
  const [searchParams] = useSearchParams();

  const getLink = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.delete('page');
    return `?${params.toString()}`;
  };

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">Categories</h3>
      <ul className="space-y-1">
        <li>
          <Link
            to={getLink('')}
            className={`text-sm transition-colors ${!selected ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-text-secondary hover:text-text'}`}
          >
            All
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat._id}>
            <Link
              to={getLink(cat.slug)}
              className={`text-sm transition-colors ${selected === cat.slug ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-text-secondary hover:text-text'}`}
              style={selected === cat.slug ? { color: cat.color } : {}}
            >
              {cat.name} ({cat.count || 0})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;   // <-- ADD THIS LINE