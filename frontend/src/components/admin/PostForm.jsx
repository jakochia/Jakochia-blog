// ============================================================
// FRONTEND src/components/admin/PostForm.jsx
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { api } from '../../services/api';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    status: 'draft',
    featured: false,
    coverImage: '',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    ogImage: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/tags'),
        ]);
        setCategories(categoriesRes.data || []);
        setTags(tagsRes.data || []);

        if (id) {
          const postRes = await api.get(`/admin/posts/${id}`);
          const post = postRes.data;
          setForm({
            title: post.title || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            category: post.category?._id || '',
            tags: post.tags?.map(t => t._id) || [],
            status: post.status || 'draft',
            featured: post.featured || false,
            coverImage: post.coverImage || '',
            seoTitle: post.seoTitle || '',
            seoDescription: post.seoDescription || '',
            canonicalUrl: post.canonicalUrl || '',
            ogImage: post.ogImage || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTagsChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setForm(prev => ({ ...prev, tags: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (id) {
        await api.put(`/admin/posts/${id}`, form);
      } else {
        await api.post('/admin/posts', form);
      }
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      alert(error.response?.data?.error || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Post title *"
            className="w-full px-4 py-3 text-xl font-semibold rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
            required
          />

          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            placeholder="Brief excerpt (max 500 characters)"
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition resize-y"
            maxLength={500}
          />

          <div data-color-mode="dark">
            <MDEditor
              value={form.content}
              onChange={(val) => setForm(prev => ({ ...prev, content: val || '' }))}
              height={400}
              preview="edit"
              style={{ borderRadius: '0.5rem', overflow: 'hidden' }}
            />
          </div>

          <input
            type="text"
            name="coverImage"
            value={form.coverImage}
            onChange={handleChange}
            placeholder="Cover image URL"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <select
              name="tags"
              multiple
              value={form.tags}
              onChange={handleTagsChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition min-h-[100px]"
            >
              {tags.map(tag => (
                <option key={tag._id} value={tag._id}>{tag.name}</option>
              ))}
            </select>
            <p className="text-xs text-text-secondary mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              id="featured"
              className="w-4 h-4 rounded border-border accent-blue-600"
            />
            <label htmlFor="featured" className="text-sm">Feature this post</label>
          </div>

          <hr className="border-border" />

          <div>
            <label className="block text-sm font-medium mb-1">SEO Title</label>
            <input
              type="text"
              name="seoTitle"
              value={form.seoTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">SEO Description</label>
            <textarea
              name="seoDescription"
              value={form.seoDescription}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition text-sm resize-y"
              maxLength={160}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">OG Image URL</label>
            <input
              type="text"
              name="ogImage"
              value={form.ogImage}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : id ? 'Update Post' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/posts')}
          className="px-6 py-2.5 rounded-lg border border-border hover:bg-background/50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PostForm;