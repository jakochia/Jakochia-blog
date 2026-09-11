import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { useSocket } from '../../context/SocketContext';

const AdminInbox = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { socket } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [visitorTyping, setVisitorTyping] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ============================================================
  // Helpers
  // ============================================================
  const getDisplayName = (conv) => {
    if (!conv) return 'Anonymous';
    if (conv.visitorName && conv.visitorName.trim()) return conv.visitorName;
    if (conv.visitorEmail && conv.visitorEmail.trim())
      return conv.visitorEmail.split('@')[0];
    return 'Anonymous';
  };

  const getInitials = (conv) => {
    const name = getDisplayName(conv);
    return name.slice(0, 1).toUpperCase();
  };

  // ============================================================
  // Fetch data
  // ============================================================
  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selected) fetchMessages(selected._id);
    // eslint-disable-next-line
  }, [selected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, visitorTyping]);

  const fetchConversations = async () => {
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
      const res = await api.get(
        `/admin/chat-messages/conversation/${conversationId}`
      );
      setMessages(res.data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  // ============================================================
  // Socket events
  // ============================================================
  useEffect(() => {
    if (!socket) return;

    socket.emit('admin:join');

    const handleNewMessage = (msg) => {
      setConversations((prev) => {
        const exists = prev.find((c) => c._id === msg.conversationId);
        if (exists) {
          return prev
            .map((c) =>
              c._id === msg.conversationId
                ? {
                    ...c,
                    lastMessage: msg.message,
                    lastSender: msg.sender,
                    lastMessageAt: msg.createdAt,
                    visitorName: msg.visitorName || c.visitorName,
                    visitorEmail: msg.visitorEmail || c.visitorEmail,
                    unreadCount:
                      msg.sender === 'visitor'
                        ? c.unreadCount + 1
                        : c.unreadCount,
                  }
                : c
            )
            .sort(
              (a, b) =>
                new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
            );
        }

        return [
          {
            _id: msg.conversationId,
            lastMessage: msg.message,
            lastSender: msg.sender,
            lastMessageAt: msg.createdAt,
            visitorName: msg.visitorName,
            visitorEmail: msg.visitorEmail,
            unreadCount: 1,
            totalMessages: 1,
          },
          ...prev,
        ];
      });

      if (selected && msg.conversationId === selected._id) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }

      if (msg.sender === 'visitor') {
        setVisitorTyping((prev) => ({
          ...prev,
          [msg.conversationId]: false,
        }));
      }
    };

    const handleVisitorTyping = ({ conversationId, isTyping }) => {
      setVisitorTyping((prev) => ({ ...prev, [conversationId]: isTyping }));
    };

    socket.on('message:new', handleNewMessage);
    socket.on('visitor:typing', handleVisitorTyping);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('visitor:typing', handleVisitorTyping);
    };
  }, [socket, selected]);

  // Join/leave conversation room
  useEffect(() => {
    if (!socket || !selected) return;
    socket.emit('admin:join_conversation', { conversationId: selected._id });
    return () => {
      socket.emit('admin:leave_conversation', {
        conversationId: selected._id,
      });
    };
  }, [socket, selected]);

  // ============================================================
  // Handlers
  // ============================================================
  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selected || sending) return;

    const msgText = reply.trim();
    setSending(true);

    try {
      const res = await api.post('/admin/chat-messages/reply', {
        conversationId: selected._id,
        message: msgText,
      });

      setMessages((prev) => {
        if (prev.some((m) => m._id === res.data._id)) return prev;
        return [...prev, res.data];
      });

      setReply('');
      if (socket) {
        socket.emit('admin:typing', {
          conversationId: selected._id,
          isTyping: false,
        });
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (conversationId) => {
    if (!window.confirm('Delete this conversation?')) return;
    try {
      await api.delete(
        `/admin/chat-messages/conversation/${conversationId}`
      );
      setSelected(null);
      setMessages([]);
      fetchConversations();
    } catch (error) {
      alert('Failed to delete conversation');
    }
  };

  const handleReplyChange = (e) => {
    setReply(e.target.value);
    if (!socket || !selected) return;

    socket.emit('admin:typing', {
      conversationId: selected._id,
      isTyping: true,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('admin:typing', {
        conversationId: selected._id,
        isTyping: false,
      });
    }, 2000);
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const diff = Date.now() - d;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  // ============================================================
  // Theme-aware class helpers
  // ============================================================
  const panel = isDark
    ? 'bg-[#1E1B4B]/50 border-[#2563EB]/20 backdrop-blur-sm'
    : 'bg-white border-[#2563EB]/15 backdrop-blur-sm';
  const panelHeader = isDark ? 'border-[#2563EB]/20' : 'border-[#2563EB]/10';
  const subtleText = isDark ? 'text-[#F8FAFC]/50' : 'text-[#334155]/60';
  const primaryText = isDark ? 'text-[#F8FAFC]' : 'text-[#1E1B4B]';
  const inputCls = isDark
    ? 'bg-[#1E1B4B] border-[#2563EB]/30 text-[#F8FAFC] placeholder-[#F8FAFC]/40 focus:border-[#EA580C] focus:ring-[#EA580C]/30'
    : 'bg-[#F8FAFC] border-[#2563EB]/20 text-[#334155] placeholder-[#334155]/40 focus:border-[#EA580C] focus:ring-[#EA580C]/20';
  const sendBtn = isDark
    ? 'bg-[#EA580C] hover:bg-[#2563EB] text-[#0D0D0D] shadow-[0_4px_20px_rgba(234,88,12,0.35)]'
    : 'bg-[#2563EB] hover:bg-[#EA580C] text-white shadow-[0_4px_20px_rgba(37,99,235,0.25)]';

  const bubbleAdmin = isDark ? 'bg-[#EA580C] text-[#0D0D0D]' : 'bg-[#2563EB] text-white';
  const bubbleVisitor = isDark
    ? 'bg-[#1E1B4B] border border-[#2563EB]/30 text-[#F8FAFC]'
    : 'bg-[#F1F5F9] border border-[#2563EB]/15 text-[#334155]';

  // ============================================================
  // Render
  // ============================================================
  return (
    <AdminLayout title="Inbox">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
        {/* ============ CONVERSATION LIST ============ */}
        <div className={`lg:col-span-1 border rounded-xl overflow-hidden flex flex-col ${panel}`}>
          <div className={`p-3 border-b flex items-center justify-between ${panelHeader}`}>
            <h3 className={`font-semibold text-sm uppercase tracking-wider ${subtleText}`}>
              Conversations ({conversations.length})
            </h3>
            <span
              className={`w-2 h-2 rounded-full ${
                socket
                  ? 'bg-[#EA580C] animate-pulse'
                  : isDark
                  ? 'bg-[#F8FAFC]/40'
                  : 'bg-[#334155]/40'
              }`}
            ></span>
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
                      isDark
                        ? 'border-[#2563EB]/10 hover:bg-[#2563EB]/10'
                        : 'border-[#2563EB]/5 hover:bg-[#2563EB]/5'
                    } ${
                      isActive
                        ? `border-l-2 border-l-[#EA580C] ${
                            isDark ? 'bg-[#2563EB]/15' : 'bg-[#2563EB]/10'
                          }`
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1E1B4B] flex items-center justify-center text-[#F8FAFC] font-semibold text-sm flex-shrink-0 border border-[#EA580C]/20">
                        {getInitials(conv)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`font-medium text-sm truncate ${primaryText}`}>
                            {getDisplayName(conv)}
                          </span>
                          <div className="flex items-center gap-1 flex-shrink-0">
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
                        {visitorTyping[conv._id] && (
                          <p className="text-xs text-[#EA580C] italic mt-0.5">
                            typing...
                          </p>
                        )}
                      </div>
                    </div>
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
                <p>Select a conversation</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className={`p-4 border-b flex items-center justify-between ${panelHeader}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1E1B4B] flex items-center justify-center text-[#F8FAFC] font-semibold border border-[#EA580C]/20">
                    {getInitials(selected)}
                  </div>
                  <div>
                    <h3 className={`font-semibold flex items-center gap-2 ${primaryText}`}>
                      {getDisplayName(selected)}
                      {visitorTyping[selected._id] && (
                        <span className="text-xs text-[#EA580C] italic">
                          typing...
                        </span>
                      )}
                    </h3>
                    <p className={`text-xs ${subtleText}`}>
                      {selected.visitorEmail || 'No email'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(selected._id)}
                  className="text-xs font-medium text-[#EA580C] hover:text-[#2563EB] transition-colors duration-300"
                >
                  Delete
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.sender === 'admin' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className="max-w-[75%]">
                      {msg.sender === 'admin' && (
                        <p className={`text-[10px] mb-1 mr-1 text-right ${subtleText}`}>
                          You
                        </p>
                      )}
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
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

                {visitorTyping[selected._id] && (
                  <div className="flex justify-start">
                    <div className={`${bubbleVisitor} rounded-2xl rounded-bl-sm px-4 py-3`}>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce"></span>
                        <span
                          className="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Reply form */}
              <form onSubmit={handleReply} className={`p-3 border-t ${panelHeader}`}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reply}
                    onChange={handleReplyChange}
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