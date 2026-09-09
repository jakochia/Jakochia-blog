import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email');
  const [email, setEmail] = useState(emailParam || '');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailParam) {
      handleUnsubscribe(emailParam);
    }
  }, [emailParam]);

  const handleUnsubscribe = async (emailToUnsubscribe) => {
    setLoading(true);
    setStatus({ type: '', text: '' });
    try {
      const res = await api.post('/newsletter/unsubscribe', { email: emailToUnsubscribe });
      setStatus({ type: 'success', text: res.data.message || 'You have been unsubscribed.' });
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to unsubscribe. Please try again.';
      setStatus({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus({ type: 'error', text: 'Please enter your email address.' });
      return;
    }
    handleUnsubscribe(email);
  };

  // Success state – no Layout wrapper
  if (status.type === 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">Unsubscribed Successfully</h1>
        <p className="text-text-secondary mb-4">{status.text}</p>
        <p className="text-text-secondary text-sm">
          You will no longer receive emails from Jakochia Blog.
        </p>
        <Link to="/" className="inline-block mt-6 text-primary-400 hover:underline">
          ← Return to Blog
        </Link>
      </div>
    );
  }

  // Form state – no Layout wrapper
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-2">Unsubscribe</h1>
      <p className="text-text-secondary mb-6">
        Enter your email address to unsubscribe from the Jakochia Blog newsletter.
      </p>

      {status.text && (
        <div className={`p-3 rounded-lg mb-4 text-sm ${
          status.type === 'success'
            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
            : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
        }`}>
          {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-2 rounded-lg bg-background border border-border/50 focus:ring-2 focus:ring-primary-500/50 outline-none transition"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Unsubscribe'}
        </button>
      </form>

      <p className="mt-4 text-xs text-text-secondary text-center">
        <Link to="/" className="hover:text-primary-400 transition-colors">← Return to Blog</Link>
      </p>
    </div>
  );
};

export default Unsubscribe;