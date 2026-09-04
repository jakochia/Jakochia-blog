// ============================================================
// FRONTEND src/pages/public/Article.jsx
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { api } from '../../services/api';
import ShareButtons from '../../components/blog/ShareButtons';
import AuthorCard from '../../components/blog/AuthorCard';
import RelatedArticles from '../../components/blog/RelatedArticles';
import CommentList from '../../components/blog/CommentList';
import CommentForm from '../../components/blog/CommentForm';
import TableOfContents from '../../components/blog/TableOfContents';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReadingProgress from '../../components/common/ReadingProgress';

// Inside the component, after the header or before the content:
<ReadingProgress />

const Article = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [comments, setComments] = useState([]);
  const [reactions, setReactions] = useState({ counts: {}, userReactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const postRes = await api.get(`/posts/${slug}`);
        const postData = postRes.data;
        setPost(postData);

        // Fetch related articles
        if (postData.category) {
          const relatedRes = await api.get(`/posts?category=${postData.category.slug}&limit=3`);
          setRelated(relatedRes.data.posts?.filter(p => p._id !== postData._id) || []);
        }

        // Fetch comments
        const commentsRes = await api.get(`/comments/post/${postData._id}`);
        setComments(commentsRes.data || []);

        // Fetch reactions
        const reactionsRes = await api.get(`/reactions/post/${postData._id}`);
        setReactions(reactionsRes.data);
      } catch (error) {
        console.error('Error fetching article:', error);
        if (error.response?.status === 404) {
          navigate('/404');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link to="/blog" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block">
          ← Back to blog
        </Link>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleReact = async (type) => {
    try {
      const res = await api.post('/reactions', { postId: post._id, type });
      setReactions({
        counts: res.data.counts,
        userReactions: res.data.action === 'added'
          ? [...reactions.userReactions, type]
          : reactions.userReactions.filter(t => t !== type),
      });
    } catch (error) {
      console.error('Error reacting:', error);
    }
  };

  const handleCommentSubmit = async (data) => {
    try {
      await api.post('/comments', { ...data, post: post._id });
      // Refresh comments
      const res = await api.get(`/comments/post/${post._id}`);
      setComments(res.data);
    } catch (error) {
      console.error('Error submitting comment:', error);
      throw error;
    }
  };

  const reactionTypes = [
    { id: 'like', label: '❤️', count: reactions.counts.like || 0 },
    { id: 'fire', label: '🔥', count: reactions.counts.fire || 0 },
    { id: 'helpful', label: '💡', count: reactions.counts.helpful || 0 },
    { id: 'applause', label: '👏', count: reactions.counts.applause || 0 },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
          <Link to="/blog" className="hover:text-text transition-colors">← Blog</Link>
          <span>·</span>
          {post.category && (
            <Link
              to={`/categories/${post.category.slug}`}
              className="hover:text-text transition-colors"
              style={{ color: post.category.color }}
            >
              {post.category.name}
            </Link>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-secondary">
          <span>By {post.author}</span>
          <span>·</span>
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          <span>·</span>
          <span>{post.readingTime} min read</span>
          <span>·</span>
          <span>👁️ {post.viewCount} views</span>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Link
                key={tag._id}
                to={`/tags/${tag.slug}`}
                className="text-xs px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-text-secondary hover:text-text transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Reactions */}
      <div className="flex flex-wrap items-center gap-2 mb-8 p-4 bg-background-secondary rounded-xl border border-border">
        <span className="text-sm text-text-secondary mr-2">React:</span>
        {reactionTypes.map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => handleReact(id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
              reactions.userReactions.includes(id)
                ? 'bg-blue-500/20 border border-blue-500/30'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <span className="text-lg">{label}</span>
            <span className="text-xs text-text-secondary">{count}</span>
          </button>
        ))}
      </div>

      {/* Table of Contents */}
      {post.content && <TableOfContents content={post.content} />}

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Share */}
      <div className="mt-8 p-4 bg-background-secondary rounded-xl border border-border">
        <ShareButtons url={`${window.location.origin}/blog/${post.slug}`} title={post.title} />
      </div>

      {/* Author */}
      <AuthorCard />

      {/* Related */}
      {related.length > 0 && <RelatedArticles posts={related} />}

      {/* Comments */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
        <CommentList comments={comments} />
        <CommentForm postId={post._id} onSubmit={handleCommentSubmit} />
      </section>
    </article>
  );
};

export default Article;