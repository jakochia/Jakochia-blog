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
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[#F8FAFC]">
      {/* Gradient border wrapper – Primary to Secondary */}
      <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#1E1B4B] to-[#2563EB] shadow-[0_8px_32px_rgba(37,99,235,0.25)]">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
          {/* Decorative icon – Primary Blue */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#2563EB]/10 mb-4 border border-[#2563EB]/20">
            <svg
              className="w-7 h-7 text-[#2563EB]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2563EB] to-[#1E1B4B] bg-clip-text text-transparent">
            Subscribe to the Newsletter
          </h2>
          <p className="text-[#334155]/70 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
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
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#2563EB]/20 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 outline-none transition-all duration-300 text-[#334155] placeholder-[#334155]/40"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-2.5 rounded-lg font-medium text-white transition-all duration-300 bg-[#2563EB] hover:bg-[#1E1B4B] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </span>
                {/* Shine overlay */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </button>
            </div>
          </form>

          {message && (
            <p
              className={`mt-4 text-sm font-medium ${
                status === 'success'
                  ? 'text-[#EA580C]'
                  : 'text-rose-500'
              } animate-fadeIn`}
            >
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Newsletter;