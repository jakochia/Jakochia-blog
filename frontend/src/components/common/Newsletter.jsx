// ============================================================
// FRONTEND src/components/common/Newsletter.jsx
// ============================================================

import React, { useState } from 'react';
import { api } from '../../services/api';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await api.post('/newsletter/subscribe', { email });
      setStatus('success');
      setMessage('🎉 Subscribed successfully! Check your email.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-background-secondary border border-border rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold">Subscribe to the Newsletter</h2>
        <p className="text-text-secondary mt-2 max-w-lg mx-auto">
          Get the latest articles, tutorials, and projects delivered to your inbox.
          No spam, unsubscribe anytime.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </form>

        {message && (
          <p className={`mt-4 text-sm ${
            status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;