import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';

// Generate/retrieve a persistent conversation ID
const getConversationId = () => {
  let id = localStorage.getItem('jakochia_conversation_id');
  if (!id) {
    id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('jakochia_conversation_id', id);
  }
  return id;
};

const ChatWidget = () => {
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

  // --- Human Chat State ---
  const [humanMessages, setHumanMessages] = useState([]);
  const [humanInput, setHumanInput] = useState('');
  const [humanLoading, setHumanLoading] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [hasIntroduced, setHasIntroduced] = useState(false);

  const messagesEndRef = useRef(null);
  const conversationId = getConversationId();

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, humanMessages, tab]);

  // Load AI history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jakochia_ai_chat');
    if (saved) {
      try {
        setAiMessages(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (aiMessages.length > 1) {
      localStorage.setItem('jakochia_ai_chat', JSON.stringify(aiMessages.slice(-20)));
    }
  }, [aiMessages]);

  // Load human chat messages from server when the human tab is opened
  useEffect(() => {
    if (isOpen && tab === 'human') {
      loadHumanConversation();
      // Poll for new messages every 15 seconds while open
      const interval = setInterval(loadHumanConversation, 15000);
      return () => clearInterval(interval);
    }
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

  // Send message to AI
  const handleAiSend = async (e) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userMessage = { role: 'user', content: aiInput.trim() };
    const newMessages = [...aiMessages, userMessage];
    setAiMessages(newMessages);
    setAiInput('');
    setAiLoading(true);

    try {
      const history = newMessages.slice(0, -1).map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      const res = await api.post('/chat', {
        message: userMessage.content,
        history,
      });

      setAiMessages([...newMessages, { role: 'assistant', content: res.data.reply }]);
    } catch (error) {
      setAiMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: "Sorry, I'm having trouble. Try again or leave a message in the 'Leave a message' tab.",
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Send message to human
  const handleHumanSend = async (e) => {
    e.preventDefault();
    if (!humanInput.trim() || humanLoading) return;

    // Require name and email on first message
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

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-premium transition-all duration-300 ${
          isOpen
            ? 'bg-rose-600 hover:bg-rose-700 rotate-90'
            : 'bg-primary-600 hover:bg-primary-700 hover:scale-110 shadow-glow-strong'
        }`}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl overflow-hidden glass shadow-premium border border-primary-500/20">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary-600 to-primary-800 border-b border-primary-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-xl">
                {tab === 'ai' ? '🤖' : '💬'}
              </div>
              <div>
                <h3 className="font-display font-semibold text-white">
                  {tab === 'ai' ? 'Jakochia AI' : 'Contact Newton'}
                </h3>
                <p className="text-xs text-primary-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  {tab === 'ai' ? 'AI Assistant' : 'Replies via email'}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-black/20 rounded-lg p-1">
              <button
                onClick={() => setTab('ai')}
                className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  tab === 'ai' ? 'bg-white/20 text-white' : 'text-primary-200 hover:text-white'
                }`}
              >
                🤖 Ask AI
              </button>
              <button
                onClick={() => setTab('human')}
                className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  tab === 'human' ? 'bg-white/20 text-white' : 'text-primary-200 hover:text-white'
                }`}
              >
                💬 Leave a message
              </button>
            </div>
          </div>

          {/* ============ AI TAB ============ */}
          {tab === 'ai' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white rounded-br-sm'
                          : 'bg-background-secondary border border-border/50 text-text rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-background-secondary border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleAiSend} className="p-3 border-t border-border/50 bg-background-secondary/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2.5 rounded-full bg-background border border-border/50 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition text-sm"
                    disabled={aiLoading}
                  />
                  <button
                    type="submit"
                    disabled={aiLoading || !aiInput.trim()}
                    className="p-2.5 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ============ HUMAN TAB ============ */}
          {tab === 'human' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
                {/* First-time intro */}
                {!hasIntroduced && humanMessages.length === 0 && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-primary-500/10 border border-primary-500/20 text-sm">
                      <p className="text-text font-medium mb-1">👋 Hi there!</p>
                      <p className="text-text-secondary text-xs">
                        Leave a message and Newton will reply via email. Please enter your details below.
                      </p>
                    </div>
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 focus:ring-2 focus:ring-primary-500/50 outline-none transition text-sm"
                    />
                    <input
                      type="email"
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      placeholder="Your email"
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 focus:ring-2 focus:ring-primary-500/50 outline-none transition text-sm"
                    />
                  </div>
                )}

                {/* Chat messages */}
                {humanMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[85%]">
                      {msg.sender === 'admin' && (
                        <p className="text-[10px] text-text-secondary mb-1 ml-1">
                          {msg.adminName || 'Newton Asha'}
                        </p>
                      )}
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.sender === 'visitor'
                            ? 'bg-primary-600 text-white rounded-br-sm'
                            : 'bg-background-secondary border border-border/50 text-text rounded-bl-sm'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  </div>
                ))}

                {humanLoading && (
                  <div className="text-center text-xs text-text-secondary">Sending...</div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleHumanSend} className="p-3 border-t border-border/50 bg-background-secondary/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={humanInput}
                    onChange={(e) => setHumanInput(e.target.value)}
                    placeholder={hasIntroduced ? 'Type your message...' : 'Enter message after your details'}
                    className="flex-1 px-4 py-2.5 rounded-full bg-background border border-border/50 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition text-sm"
                    disabled={humanLoading || (!hasIntroduced && (!visitorName || !visitorEmail))}
                  />
                  <button
                    type="submit"
                    disabled={humanLoading || !humanInput.trim() || (!hasIntroduced && (!visitorName || !visitorEmail))}
                    className="p-2.5 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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