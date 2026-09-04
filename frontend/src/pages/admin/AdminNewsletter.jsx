import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';

const AdminNewsletter = () => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState({ totalSubscribers: 0 });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [testEmail, setTestEmail] = useState('');

  // Fetch subscriber count on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/newsletter/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const handleSend = async (isTest = false) => {
    // Validate
    if (!subject.trim() || !content.trim()) {
      setMessage({ type: 'error', text: 'Please fill in both subject and content.' });
      return;
    }

    // Confirm
    const confirmMessage = isTest
      ? `Send test email to ${testEmail || 'your email'}?`
      : `Send newsletter to ${stats.totalSubscribers} subscribers? This cannot be undone.`;

    if (!window.confirm(confirmMessage)) return;

    setSending(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = { subject, content };
      if (isTest) {
        payload.testEmail = testEmail.trim() || 'ombuyanewton@gmail.com';
      }

      const res = await api.post('/admin/newsletter/send', payload);

      setMessage({
        type: 'success',
        text: isTest ? '✅ Test email sent successfully!' : res.data.message,
      });

      // If not a test, clear the form
      if (!isTest) {
        setSubject('');
        setContent('');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to send email.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout title="Newsletter">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose form */}
        <div className="lg:col-span-2 bg-background-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gradient-blue">📬 Compose Newsletter</h3>

          {message.text && (
            <div className={`p-3 rounded-lg mb-4 text-sm ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject line"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border/50 focus:ring-2 focus:ring-primary-500/50 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">
                Content (HTML)
                <span className="ml-2 text-xs text-text-secondary">– supports images, links, headings, etc.</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Example: <h2>Exciting News!</h2>
<p>We just published a new tutorial...</p>
<img src="https://example.com/image.jpg" alt="..." />
<a href="https://jakochia.com/blog">Read more →</a>`}
                rows={12}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border/50 focus:ring-2 focus:ring-primary-500/50 outline-none transition font-mono text-sm resize-y"
              />
              <p className="text-xs text-text-secondary mt-1">
                Use HTML tags like <code>{'<h2>'}</code>, <code>{'<p>'}</code>, <code>{'<img>'}</code>, <code>{'<a>'}</code>, <code>{'<ul>'}</code>, etc.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleSend(false)}
                disabled={sending || stats.totalSubscribers === 0}
                className="px-6 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
              >
                {sending ? 'Sending...' : `Send to ${stats.totalSubscribers} Subscribers`}
              </button>

              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@email.com"
                  className="px-3 py-2 rounded-lg bg-background border border-border/50 focus:ring-2 focus:ring-primary-500/50 outline-none transition text-sm w-48"
                />
                <button
                  onClick={() => handleSend(true)}
                  disabled={sending}
                  className="px-4 py-2.5 rounded-lg border border-border/50 hover:bg-background/50 transition-colors text-sm"
                >
                  Send Test
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Tips */}
        <div className="space-y-4">
          <div className="bg-background-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-text-secondary mb-3">📊 Subscriber Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Active</span>
                <span className="font-bold text-white">{stats.totalSubscribers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Gmail Daily Limit</span>
                <span className="text-amber-400">~500/day</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400">
              ⚠️ Gmail sends emails in batches of 10. Large lists will take time.
            </div>
          </div>

          <div className="bg-background-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-text-secondary mb-3">💡 Tips</h4>
            <ul className="text-xs text-text-secondary space-y-2">
              <li>• Use a clear, compelling subject line</li>
              <li>• Keep paragraphs short and scannable</li>
              <li>• Include a strong call‑to‑action</li>
              <li>• Always test before sending to all</li>
              <li>• Use absolute URLs for images</li>
            </ul>
          </div>

          <div className="bg-background-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-text-secondary mb-3">📎 Image Guide</h4>
            <p className="text-xs text-text-secondary">
              Use <code className="bg-background px-1 py-0.5 rounded">{'<img src="https://your-image-url.com/image.jpg" alt="..." />'}</code>
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Host images on a public CDN or your own server.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletter;