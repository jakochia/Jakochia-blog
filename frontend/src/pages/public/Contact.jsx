import React, { useState } from 'react';
import { api } from '../../services/api';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const res = await api.post('/contact', form);
      setStatus({ type: 'success', text: res.data.message || 'Message sent successfully!' });
      // Clear form on success
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        'Something went wrong. Please try again later.';
      setStatus({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2 text-gradient-blue">Contact</h1>
      <p className="text-text-secondary mb-8">
        Have a question or want to connect? Fill out the form below and I'll get back to you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Status message */}
        {status.text && (
          <div
            className={`p-3 rounded-lg text-sm ${
              status.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}
          >
            {status.text}
          </div>
        )}

        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border/50 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border/50 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition"
              required
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium mb-1 text-text-secondary">
            Subject (optional)
          </label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border/50 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-1 text-text-secondary">
            Message *
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border/50 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition resize-y"
            required
          />
        </div>

        {/* Submit Button – now using a bold blue‑to‑cyan gradient */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-400/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default Contact;