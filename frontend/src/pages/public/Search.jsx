import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ArticleCard from '../../components/blog/ArticleCard';
import { api } from '../../services/api';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data.results || []);
        setSuggestions(res.data.suggestions || []);
        setPagination(res.data.pagination || { page: 1, total: 0, pages: 0 });
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

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
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-text-secondary mb-8">
        {query ? `Showing results for "${query}"` : 'Enter a search term to find articles'}
      </p>

      {!query || query.trim().length < 2 ? (
        <div className="text-center py-12 text-text-secondary">
          <p>Type at least 2 characters to search</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">No results found for "{query}"</p>
          {suggestions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-text-secondary">Suggestions:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {suggestions.map((s, i) => (
                  <Link
                    key={i}
                    to={`/blog/${s.slug}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-text-secondary mb-4">{pagination.total} results found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;   // <-- This is the key line that was missing