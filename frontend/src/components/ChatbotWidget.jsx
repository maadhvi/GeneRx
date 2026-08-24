import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am GeneRx AI. How can I assist you with clinical insights or genomic data today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      if (!res.ok) throw new Error('API Error');
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I am having trouble connecting to my servers right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end'
    }}>
      {/* Chat Window */}
      {isOpen && (
        <div className="glass-panel animate-reveal" style={{
          width: '350px',
          height: '500px',
          maxHeight: '80vh',
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-soft)',
          border: '1px solid var(--border-focus)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} color="var(--accent-emerald)" />
              <span style={{ fontWeight: '600', fontSize: '1rem' }}>GeneRx AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px'
            }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '12px',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: msg.role === 'user' ? 'var(--accent-arctic-glow)' : 'var(--accent-emerald-glow)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0
                }}>
                  {msg.role === 'user' ? <User size={14} color="var(--accent-arctic)" /> : <Bot size={14} color="var(--accent-emerald)" />}
                </div>
                <div style={{
                  background: msg.role === 'user' ? 'var(--accent-arctic-glow)' : 'var(--bg-surface)',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                  borderTopLeftRadius: msg.role === 'ai' ? '4px' : '16px',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  color: 'var(--text-primary)',
                  maxWidth: '80%',
                  border: msg.role === 'user' ? '1px solid var(--border-focus)' : '1px solid var(--border-glass)'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-emerald-glow)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                  <Bot size={14} color="var(--accent-emerald)" />
                </div>
                <div style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                  <Loader2 size={16} className="spin-animation" style={{ animation: 'spin 2s linear infinite' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{
            padding: '16px',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            gap: '8px',
            backgroundColor: 'var(--bg-surface)'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '24px',
                border: '1px solid var(--border-glass)',
                background: 'rgba(0,0,0,0.2)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                background: 'var(--accent-emerald)',
                color: '#000',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: (isLoading || !input.trim()) ? 'not-allowed' : 'pointer',
                opacity: (isLoading || !input.trim()) ? 0.5 : 1,
                transition: 'transform 0.2s'
              }}
            >
              <Send size={18} style={{ transform: 'translateX(-1px)' }} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          className="animate-reveal"
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-arctic), var(--accent-emerald))',
            border: 'none',
            color: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(45, 212, 191, 0.4)',
            transition: 'transform 0.3s ease',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
        >
          <MessageSquare size={28} />
        </button>
      )}
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ChatbotWidget;
