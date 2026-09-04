// ============================================================
// FRONTEND src/components/blog/SearchBar.jsx
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
        className="px-3 py-1.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition text-sm w-48 md:w-64"
        minLength={2}
      />
      <button
        type="submit"
        className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        aria-label="Search"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;