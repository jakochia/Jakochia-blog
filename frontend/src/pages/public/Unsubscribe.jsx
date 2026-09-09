import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Layout from '../../components/common/Layout';
import { api } from '../../services/api';

const Unsubscribe = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email');
  const [email, setEmail] = useState(emailParam || '');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // If email is provided in URL (from email link), auto-unsubscribe
  useEffect(() => {
    if (emailParam) {
      handleUnsubscribe(emailParam);
    }
    // eslint-disable-next-line
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

  // If success, show success message
  if (status.type === 'success') {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1E1B4B]'}`}>
            Unsubscribed Successfully
          </h1>
          <p className={`mb-4 ${isDark ? 'text-[#F8FAFC]/70' : 'text-[#334155]/80'}`}>
            {status.text}
          </p>
          <p className={`text-sm ${isDark ? 'text-[#F8FAFC]/50' : 'text-[#334155]/60'}`}>
            You will no longer receive emails from Jakochia Blog.
          </p>
          <Link
            to="/"
            className={`inline-block mt-6 font-medium transition-colors duration-300 ${
              isDark ? 'text-[#EA580C] hover:text-[#F8FAFC]' : 'text-[#2563EB] hover:text-[#EA580C]'
            }`}
          >
            ← Return to Blog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-16">
        <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1E1B4B]'}`}>
          Unsubscribe
        </h1>
        <p className={`mb-6 ${isDark ? 'text-[#F8FAFC]/70' : 'text-[#334155]/80'}`}>
          Enter your email address to unsubscribe from the Jakochia Blog newsletter.
        </p>

        {status.text && (
          <div
            className={`p-3 rounded-lg mb-4 text-sm ${
              status.type === 'success'
                ? isDark
                  ? 'bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#F8FAFC]'
                  : 'bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#1E1B4B]'
                : isDark
                ? 'bg-[#EA580C]/20 border border-[#EA580C]/40 text-[#F8FAFC]'
                : 'bg-[#EA580C]/10 border border-[#EA580C]/30 text-[#1E1B4B]'
            }`}
          >
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={`w-full px-4 py-2 rounded-lg border transition-colors duration-300 outline-none ${
              isDark
                ? 'bg-[#1E1B4B] border-[#2563EB]/30 text-[#F8FAFC] placeholder-[#F8FAFC]/40 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/30'
                : 'bg-[#F8FAFC] border-[#2563EB]/20 text-[#334155] placeholder-[#334155]/40 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20'
            }`}
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2.5 rounded-lg font-medium text-[#F8FAFC] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-[#EA580C] hover:bg-[#2563EB] shadow-[0_4px_20px_rgba(234,88,12,0.3)]'
                : 'bg-[#2563EB] hover:bg-[#EA580C] shadow-[0_4px_20px_rgba(37,99,235,0.25)]'
            }`}
          >
            {loading ? 'Processing...' : 'Unsubscribe'}
          </button>
        </form>

        <p className={`mt-4 text-xs text-center ${isDark ? 'text-[#F8FAFC]/40' : 'text-[#334155]/50'}`}>
          <Link
            to="/"
            className={`transition-colors duration-300 ${
              isDark ? 'hover:text-[#EA580C]' : 'hover:text-[#2563EB]'
            }`}
          >
            ← Return to Blog
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default Unsubscribe;