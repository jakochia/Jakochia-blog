// ============================================================
// FRONTEND src/pages/public/Blog.jsx
// ============================================================

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ArticleCard from '../../components/blog/ArticleCard';
import CategoryFilter from '../../components/blog/CategoryFilter';
import TagFilter from '../../components/blog/TagFilter';
import SearchBar from '../../components/blog/SearchBar';
import Pagination from '../../components/common/Pagination';
import { api } from '../../services/api';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);

  const page = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const tag = searchParams.get('tag') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsRes, categoriesRes, tagsRes] = await Promise.all([
          api.get(`/posts?page=${page}&limit=9${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}`),
          api.get('/categories'),
          api.get('/tags'),
        ]);

        setPosts(postsRes.data.posts || []);
        setPagination(postsRes.data.pagination || { page: 1, total: 0, pages: 0 });
        setTotalPosts(postsRes.data.pagination?.total || 0);
        setCategories(categoriesRes.data || []);
        setTags(tagsRes.data || []);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, category, tag]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-text-secondary mt-1">{totalPosts} articles</p>
        </div>
        <SearchBar />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <CategoryFilter categories={categories} selected={category} />
            <TagFilter tags={tags} selected={tag} />
          </div>
        </aside>

        {/* Posts */}
        <div className="flex-1">
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <ArticleCard key={post._id} post={post} />
                ))}
              </div>
              {pagination.pages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-secondary">No posts found</p>
              <Link to="/blog" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;