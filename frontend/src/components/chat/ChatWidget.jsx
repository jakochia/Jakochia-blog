import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

// Persistent conversation ID for the human contact channel
const getConversationId = () => {
  let id = localStorage.getItem('jakochia_conversation_id');
  if (!id) {
    id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('jakochia_conversation_id', id);
  }
  return id;
};

// Persistent AI session ID (used to group AI conversations server-side)
const getSessionId = () => {
  let id = localStorage.getItem('jakochia_session_id');
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('jakochia_session_id', id);
  }
  return id;
};

const ChatWidget = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState('ai'); // 'ai' | 'human'

  // --- AI Chat State ---
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm Jakochia AI. Ask me anything about the blog, projects, or tech topics!",
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // --- Human Chat State ---
  const [humanMessages, setHumanMessages] = useState([]);
  const [humanInput, setHumanInput] = useState('');
  const [humanLoading, setHumanLoading] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [hasIntroduced, setHasIntroduced] = useState(false);

  const messagesEndRef = useRef(null);
  const conversationId = getConversationId();
  const sessionId = getSessionId();

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, humanMessages, tab]);

  // Load saved AI history
  useEffect(() => {
    const saved = localStorage.getItem('jakochia_ai_chat');
    if (saved) {
      try {
        setAiMessages(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Persist AI messages
  useEffect(() => {
    if (aiMessages.length > 1) {
      localStorage.setItem('jakochia_ai_chat', JSON.stringify(aiMessages.slice(-30)));
    }
  }, [aiMessages]);

  // Load AI suggestions when widget opens
  useEffect(() => {
    if (isOpen && tab === 'ai' && suggestions.length === 0) {
      api
        .get('/ai/chat/suggestions')
        .then((res) => setSuggestions(res.data.suggestions || []))
        .catch(() => {});
    }
  }, [isOpen, tab, suggestions.length]);

  // Load human conversation when tab is active
  useEffect(() => {
    if (isOpen && tab === 'human') {
      loadHumanConversation();
      const interval = setInterval(loadHumanConversation, 15000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [isOpen, tab]);

  const loadHumanConversation = async () => {
    try {
      const res = await api.get(`/chat-messages/${conversationId}`);
      setHumanMessages(res.data || []);
      if (res.data.length > 0) setHasIntroduced(true);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  // ------------------------------------------------------------
  // Send AI message with streaming
  // ------------------------------------------------------------
  const handleAiSend = async (e, directMessage) => {
    e?.preventDefault?.();
    const raw = directMessage || aiInput;
    if (!raw.trim() || aiLoading) return;

    const userMessage = { role: 'user', content: raw.trim() };
    const newMessages = [...aiMessages, userMessage];
    setAiMessages(newMessages);
    setAiInput('');
    setAiLoading(true);

    // Placeholder for streaming reply
    const placeholderIndex = newMessages.length;
    setAiMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const history = newMessages.slice(0, -1).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content,
      }));

      const res = await fetch(
        `${api.defaults?.baseURL || ''}/ai/chat/stream`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.content,
            history,
            sessionId,
          }),
        }
      );

      if (!res.body) throw new Error('No stream body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullReply = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split('\n\n');
        buffer = parts.pop();
        for (const part of parts) {
          if (!part.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(part.slice(6));
            if (data.delta) {
              fullReply += data.delta;
              setAiMessages((prev) => {
                const next = [...prev];
                next[placeholderIndex] = { role: 'assistant', content: fullReply };
                return next;
              });
            }
            if (data.done && data.reply) {
              fullReply = data.reply;
              setAiMessages((prev) => {
                const next = [...prev];
                next[placeholderIndex] = { role: 'assistant', content: fullReply };
                return next;
              });
            }
            if (data.error) throw new Error(data.error);
          } catch (err) {
            console.warn('Stream parse error', err);
          }
        }
      }
    } catch (error) {
      // Fallback: remove empty placeholder and try non-stream endpoint
      setAiMessages((prev) => prev.filter((_, i) => i !== placeholderIndex));
      try {
        const history = newMessages.slice(0, -1).map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.content,
        }));
        const res = await api.post('/ai/chat', {
          message: userMessage.content,
          history,
          sessionId,
        });
        setAiMessages([...newMessages, { role: 'assistant', content: res.data.reply }]);
      } catch (err) {
        setAiMessages([
          ...newMessages,
          {
            role: 'assistant',
            content:
              "Sorry, I'm having trouble. Try again or leave a message in the 'Leave a message' tab.",
          },
        ]);
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleSuggestionClick = (text) => {
    handleAiSend(null, text);
  };

  // ------------------------------------------------------------
  // Send human message
  // ------------------------------------------------------------
  const handleHumanSend = async (e) => {
    e.preventDefault();
    if (!humanInput.trim() || humanLoading) return;

    if (!hasIntroduced && (!visitorName.trim() || !visitorEmail.trim())) {
      alert('Please enter your name and email so we can get back to you.');
      return;
    }

    setHumanLoading(true);

    try {
      await api.post('/chat-messages', {
        conversationId,
        message: humanInput.trim(),
        visitorName: visitorName.trim(),
        visitorEmail: visitorEmail.trim(),
      });

      setHumanInput('');
      setHasIntroduced(true);
      await loadHumanConversation();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send message.');
    } finally {
      setHumanLoading(false);
    }
  };

  // ------------------------------------------------------------
  // Theme-aware class helpers
  // ------------------------------------------------------------
  const shell = isDark ? 'bg-[#0D0D0D] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#334155]';
  const panel = isDark ? 'bg-[#1E1B4B]/60 border-[#2563EB]/20' : 'bg-white border-[#2563EB]/15';
  const subtleText = isDark ? 'text-[#F8FAFC]/60' : 'text-[#334155]/60';
  const bubbleBot = isDark
    ? 'bg-[#1E1B4B] border border-[#2563EB]/20 text-[#F8FAFC]'
    : 'bg-[#F1F5F9] border border-[#2563EB]/10 text-[#334155]';
  const bubbleUser = isDark
    ? 'bg-[#EA580C] text-[#0D0D0D]'
    : 'bg-[#2563EB] text-white';
  const inputCls = isDark
    ? 'bg-[#1E1B4B] border-[#2563EB]/30 text-[#F8FAFC] placeholder-[#F8FAFC]/40 focus:border-[#EA580C] focus:ring-[#EA580C]/30'
    : 'bg-[#F8FAFC] border-[#2563EB]/20 text-[#334155] placeholder-[#334155]/40 focus:border-[#EA580C] focus:ring-[#EA580C]/20';
  const sendBtn = isDark
    ? 'bg-[#EA580C] hover:bg-[#2563EB] text-[#0D0D0D] shadow-[0_4px_20px_rgba(234,88,12,0.35)]'
    : 'bg-[#2563EB] hover:bg-[#EA580C] text-white shadow-[0_4px_20px_rgba(37,99,235,0.25)]';

  return (
    <>
      {/* ============ FLOATING BUTTON ============ */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full transition-all duration-300 ${
          isOpen
            ? 'bg-[#EA580C] hover:bg-[#2563EB] rotate-90 shadow-[0_8px_30px_rgba(234,88,12,0.4)]'
            : 'bg-[#2563EB] hover:bg-[#1E1B4B] hover:scale-110 shadow-[0_8px_30px_rgba(37,99,235,0.4)]'
        }`}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* ============ CHAT WINDOW ============ */}
      {isOpen && (
        <div
          className={`
            fixed z-50 flex flex-col overflow-hidden border shadow-[0_20px_60px_rgba(30,27,75,0.25)]
            ${shell}
            ${isDark ? 'border-[#2563EB]/20' : 'border-[#2563EB]/15'}
            inset-0 w-full h-full rounded-none
            sm:inset-auto sm:bottom-24 sm:right-6 sm:w-96 sm:h-[620px] sm:max-h-[calc(100vh-8rem)] sm:rounded-2xl
          `}
        >
          {/* ============ HEADER ============ */}
          <div className="p-4 bg-gradient-to-r from-[#2563EB] to-[#1E1B4B] border-b-2 border-[#EA580C] flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EA580C] flex items-center justify-center text-xl shadow-[0_0_20px_rgba(234,88,12,0.5)]">
                  {tab === 'ai' ? '🤖' : '💬'}
                </div>
                <div>
                  <h3 className="font-semibold text-[#F8FAFC]">
                    {tab === 'ai' ? 'Jakochia AI' : 'Contact Newton'}
                  </h3>
                  <p className="text-xs text-[#F8FAFC]/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#EA580C] rounded-full animate-pulse"></span>
                    {tab === 'ai' ? 'AI Assistant' : 'Replies via email'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden text-[#F8FAFC]/80 hover:text-[#EA580C] p-1"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-black/25 rounded-lg p-1">
              <button
                onClick={() => setTab('ai')}
                className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                  tab === 'ai'
                    ? 'bg-[#EA580C] text-[#0D0D0D]'
                    : 'text-[#F8FAFC]/70 hover:text-[#F8FAFC]'
                }`}
              >
                🤖 Ask AI
              </button>
              <button
                onClick={() => setTab('human')}
                className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                  tab === 'human'
                    ? 'bg-[#EA580C] text-[#0D0D0D]'
                    : 'text-[#F8FAFC]/70 hover:text-[#F8FAFC]'
                }`}
              >
                💬 Leave a message
              </button>
            </div>
          </div>

          {/* ============ AI TAB ============ */}
          {tab === 'ai' && (
            <>
              <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${shell}`}>
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? `${bubbleUser} rounded-br-sm`
                          : `${bubbleBot} rounded-bl-sm`
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {aiLoading && aiMessages[aiMessages.length - 1]?.content === '' && (
                  <div className="flex justify-start">
                    <div className={`${bubbleBot} rounded-2xl rounded-bl-sm px-4 py-3`}>
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

              {/* Suggestions */}
              {aiMessages.length <= 1 && suggestions.length > 0 && (
                <div className={`px-3 pb-2 flex flex-wrap gap-2 ${shell}`}>
                  {suggestions.slice(0, 4).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-300 ${
                        isDark
                          ? 'border-[#2563EB]/30 text-[#F8FAFC]/80 hover:border-[#EA580C] hover:text-[#EA580C]'
                          : 'border-[#2563EB]/20 text-[#334155]/80 hover:border-[#EA580C] hover:text-[#EA580C]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={handleAiSend}
                className={`p-3 border-t flex-shrink-0 ${
                  isDark ? 'border-[#2563EB]/20 bg-[#1E1B4B]/40' : 'border-[#2563EB]/10 bg-white'
                }`}
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className={`flex-1 px-4 py-2.5 rounded-full border outline-none transition text-sm focus:ring-2 ${inputCls}`}
                    disabled={aiLoading}
                  />
                  <button
                    type="submit"
                    disabled={aiLoading || !aiInput.trim()}
                    className={`p-2.5 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${sendBtn}`}
                    aria-label="Send message"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
                <p className={`text-[10px] text-center mt-2 ${subtleText}`}>
                  Powered by Jakochia AI
                </p>
              </form>
            </>
          )}

          {/* ============ HUMAN TAB ============ */}
          {tab === 'human' && (
            <>
              <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${shell}`}>
                {!hasIntroduced && humanMessages.length === 0 && (
                  <div className="space-y-3">
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        isDark
                          ? 'bg-[#2563EB]/15 border border-[#2563EB]/30'
                          : 'bg-[#2563EB]/5 border border-[#2563EB]/15'
                      }`}
                    >
                      <p className={`font-medium mb-1 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1E1B4B]'}`}>
                        👋 Hi there!
                      </p>
                      <p className={`text-xs ${subtleText}`}>
                        Leave a message and Newton will reply via email. Please enter your details below.
                      </p>
                    </div>
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Your name"
                      className={`w-full px-3 py-2 rounded-lg border outline-none transition text-sm focus:ring-2 ${inputCls}`}
                    />
                    <input
                      type="email"
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      placeholder="Your email"
                      className={`w-full px-3 py-2 rounded-lg border outline-none transition text-sm focus:ring-2 ${inputCls}`}
                    />
                  </div>
                )}

                {humanMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[85%]">
                      {msg.sender === 'admin' && (
                        <p className={`text-[10px] mb-1 ml-1 ${subtleText}`}>
                          {msg.adminName || 'Newton Asha'}
                        </p>
                      )}
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.sender === 'visitor'
                            ? `${bubbleUser} rounded-br-sm`
                            : `${bubbleBot} rounded-bl-sm`
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  </div>
                ))}

                {humanLoading && (
                  <div className={`text-center text-xs ${subtleText}`}>Sending...</div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleHumanSend}
                className={`p-3 border-t flex-shrink-0 ${
                  isDark ? 'border-[#2563EB]/20 bg-[#1E1B4B]/40' : 'border-[#2563EB]/10 bg-white'
                }`}
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={humanInput}
                    onChange={(e) => setHumanInput(e.target.value)}
                    placeholder={
                      hasIntroduced ? 'Type your message...' : 'Enter message after your details'
                    }
                    className={`flex-1 px-4 py-2.5 rounded-full border outline-none transition text-sm focus:ring-2 ${inputCls}`}
                    disabled={humanLoading || (!hasIntroduced && (!visitorName || !visitorEmail))}
                  />
                  <button
                    type="submit"
                    disabled={
                      humanLoading ||
                      !humanInput.trim() ||
                      (!hasIntroduced && (!visitorName || !visitorEmail))
                    }
                    className={`p-2.5 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${sendBtn}`}
                    aria-label="Send message"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;