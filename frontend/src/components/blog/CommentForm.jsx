// ============================================================
// FRONTEND src/components/blog/CommentForm.jsx
// ============================================================

import React, { useState } from 'react';

const CommentForm = ({ postId, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      await onSubmit({ name, email, content });
      setName('');
      setEmail('');
      setContent('');
      setStatus('success');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
        ✅ Your comment has been submitted for approval.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name *"
          className="px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email *"
          className="px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
          required
        />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment... *"
        rows={4}
        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition resize-y"
        required
      />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Submitting...' : 'Submit Comment'}
      </button>

      <p className="text-xs text-text-secondary">Your email will not be published. Comments are moderated.</p>
    </form>
  );
};

export default CommentForm;