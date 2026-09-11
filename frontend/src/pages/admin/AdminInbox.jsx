import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';

const AdminInbox = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selected) {
      fetchMessages(selected._id);
    }
    // eslint-disable-next-line
  }, [selected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/chat-messages/conversations');
      setConversations(res.data.conversations || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await api.get(`/admin/chat-messages/conversation/${conversationId}`);
      setMessages(res.data || []);
      fetchConversations();
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selected || sending) return;

    setSending(true);
    try {
      await api.post('/admin/chat-messages/reply', {
        conversationId: selected._id,
        message: reply.trim(),
      });
      setReply('');
      await fetchMessages(selected._id);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (conversationId) => {
    if (!window.confirm('Delete this conversation? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/chat-messages/conversation/${conversationId}`);
      setSelected(null);
      setMessages([]);
      fetchConversations();
    } catch (error) {
      alert('Failed to delete conversation');
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  // ------------------------------------------------------------
  // Theme-aware helpers
  // ------------------------------------------------------------
  const panel = isDark
    ? 'bg-[#1E1B4B]/50 border-[#2563EB]/20 backdrop-blur-sm'
    : 'bg-white border-[#2563EB]/15 backdrop-blur-sm';
  const panelHeader = isDark
    ? 'border-[#2563EB]/20'
    : 'border-[#2563EB]/10';
  const subtleText = isDark ? 'text-[#F8FAFC]/50' : 'text-[#334155]/60';
  const primaryText = isDark ? 'text-[#F8FAFC]' : 'text-[#1E1B4B]';
  const inputCls = isDark
    ? 'bg-[#1E1B4B] border-[#2563EB]/30 text-[#F8FAFC] placeholder-[#F8FAFC]/40 focus:border-[#EA580C] focus:ring-[#EA580C]/30'
    : 'bg-[#F8FAFC] border-[#2563EB]/20 text-[#334155] placeholder-[#334155]/40 focus:border-[#EA580C] focus:ring-[#EA580C]/20';
  const sendBtn = isDark
    ? 'bg-[#EA580C] hover:bg-[#2563EB] text-[#0D0D0D] shadow-[0_4px_20px_rgba(234,88,12,0.35)]'
    : 'bg-[#2563EB] hover:bg-[#EA580C] text-white shadow-[0_4px_20px_rgba(37,99,235,0.25)]';

  const bubbleAdmin = isDark
    ? 'bg-[#EA580C] text-[#0D0D0D]'
    : 'bg-[#2563EB] text-white';
  const bubbleVisitor = isDark
    ? 'bg-[#1E1B4B] border border-[#2563EB]/30 text-[#F8FAFC]'
    : 'bg-[#F1F5F9] border border-[#2563EB]/15 text-[#334155]';

  return (
    <AdminLayout title="Inbox">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
        {/* ============ CONVERSATIONS LIST ============ */}
        <div className={`lg:col-span-1 border rounded-xl overflow-hidden flex flex-col ${panel}`}>
          <div className={`p-3 border-b ${panelHeader}`}>
            <h3 className={`font-semibold text-sm uppercase tracking-wider ${subtleText}`}>
              Conversations ({conversations.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : conversations.length === 0 ? (
              <div className={`p-8 text-center ${subtleText}`}>
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm">No messages yet</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = selected?._id === conv._id;
                return (
                  <button
                    key={conv._id}
                    onClick={() => setSelected(conv)}
                    className={`w-full text-left p-3 border-b transition-colors ${
                      isDark ? 'border-[#2563EB]/10 hover:bg-[#2563EB]/10' : 'border-[#2563EB]/5 hover:bg-[#2563EB]/5'
                    } ${
                      isActive
                        ? `border-l-2 border-l-[#EA580C] ${
                            isDark ? 'bg-[#2563EB]/15' : 'bg-[#2563EB]/10'
                          }`
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium text-sm truncate ${primaryText}`}>
                        {conv.visitorName || 'Anonymous'}
                      </span>
                      <div className="flex items-center gap-1">
                        {conv.unreadCount > 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#EA580C] text-[#0D0D0D] font-semibold">
                            {conv.unreadCount}
                          </span>
                        )}
                        <span className={`text-xs ${subtleText}`}>
                          {formatTime(conv.lastMessageAt)}
                        </span>
                      </div>
                    </div>
                    <p className={`text-xs truncate ${subtleText}`}>
                      {conv.lastSender === 'admin' ? 'You: ' : ''}
                      {conv.lastMessage}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ============ CONVERSATION VIEW ============ */}
        <div className={`lg:col-span-2 border rounded-xl overflow-hidden flex flex-col ${panel}`}>
          {!selected ? (
            <div className={`flex-1 flex items-center justify-center ${subtleText}`}>
              <div className="text-center">
                <p className="text-4xl mb-2">💬</p>
                <p>Select a conversation to view</p>
              </div>
            </div>
          ) : (
            <>
              <div className={`p-4 border-b flex items-center justify-between ${panelHeader}`}>
                <div>
                  <h3 className={`font-semibold ${primaryText}`}>
                    {selected.visitorName || 'Anonymous'}
                  </h3>
                  <p className={`text-xs ${subtleText}`}>
                    {selected.visitorEmail || 'No email provided'}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(selected._id)}
                  className="text-xs font-medium text-[#EA580C] hover:text-[#2563EB] transition-colors duration-300"
                >
                  Delete
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[75%]">
                      {msg.sender === 'admin' && (
                        <p className={`text-[10px] mb-1 mr-1 text-right ${subtleText}`}>You</p>
                      )}
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.sender === 'admin'
                            ? `${bubbleAdmin} rounded-br-sm`
                            : `${bubbleVisitor} rounded-bl-sm`
                        }`}
                      >
                        {msg.message}
                      </div>
                      <p className={`text-[10px] mt-1 ml-1 ${subtleText}`}>
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleReply} className={`p-3 border-t ${panelHeader}`}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    className={`flex-1 px-4 py-2.5 rounded-full border outline-none transition text-sm focus:ring-2 ${inputCls}`}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${sendBtn}`}
                  >
                    {sending ? '...' : 'Send'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInbox;