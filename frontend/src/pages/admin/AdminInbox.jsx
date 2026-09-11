import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';

const AdminInbox = () => {
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
    if (!confirm('Delete this conversation? This cannot be undone.')) return;
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

  return (
    <AdminLayout title="Inbox">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
        {/* Conversations list */}
        <div className="lg:col-span-1 bg-background-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border/50">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
              Conversations ({conversations.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-text-secondary">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm">No messages yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => setSelected(conv)}
                  className={`w-full text-left p-3 border-b border-border/30 hover:bg-background/50 transition-colors ${
                    selected?._id === conv._id ? 'bg-primary-500/10 border-l-2 border-l-primary-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm truncate">
                      {conv.visitorName || 'Anonymous'}
                    </span>
                    <div className="flex items-center gap-1">
                      {conv.unreadCount > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary-600 text-white">
                          {conv.unreadCount}
                        </span>
                      )}
                      <span className="text-xs text-text-secondary">
                        {formatTime(conv.lastMessageAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary truncate">
                    {conv.lastSender === 'admin' ? 'You: ' : ''}
                    {conv.lastMessage}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Conversation view */}
        <div className="lg:col-span-2 bg-background-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-text-secondary">
              <div className="text-center">
                <p className="text-4xl mb-2">💬</p>
                <p>Select a conversation to view</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selected.visitorName || 'Anonymous'}</h3>
                  <p className="text-xs text-text-secondary">{selected.visitorEmail || 'No email provided'}</p>
                </div>
                <button
                  onClick={() => handleDelete(selected._id)}
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
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
                        <p className="text-[10px] text-text-secondary mb-1 mr-1 text-right">You</p>
                      )}
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm ${
                          msg.sender === 'admin'
                            ? 'bg-primary-600 text-white rounded-br-sm'
                            : 'bg-background border border-border/50 text-text rounded-bl-sm'
                        }`}
                      >
                        {msg.message}
                      </div>
                      <p className="text-[10px] text-text-secondary mt-1 ml-1">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleReply} className="p-3 border-t border-border/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2.5 rounded-full bg-background border border-border/50 focus:ring-2 focus:ring-primary-500/50 outline-none transition text-sm"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="px-5 py-2.5 rounded-full bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
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