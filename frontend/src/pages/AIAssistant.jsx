import { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, RefreshCw, Lightbulb } from 'lucide-react';
import { aiAPI } from '../utils/api';

export default function AIAssistant() {
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm your AI financial advisor powered by Grok. I can analyze your spending patterns and answer questions about your finances. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    aiAPI.getInsights()
      .then(r => setInsights(r.data))
      .catch(() => setInsights({ insights: ['Connect your Grok API key to get personalized insights.'] }))
      .finally(() => setLoadingInsights(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const q = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', text: q }]);
    setSending(true);
    try {
      const r = await aiAPI.ask(q);
      setMessages(m => [...m, { role: 'ai', text: r.data.answer }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'Sorry, I could not connect to the AI service. Please check your Grok API key.' }]);
    }
    setSending(false);
  };

  const refreshInsights = () => {
    setLoadingInsights(true);
    aiAPI.getInsights()
      .then(r => setInsights(r.data))
      .finally(() => setLoadingInsights(false));
  };

  const SUGGESTIONS = [
    "Where am I spending the most?",
    "How can I improve my savings rate?",
    "What's my biggest expense category?",
    "Am I on track financially?",
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, height: 'calc(100vh - 64px)' }}>
      {/* Chat */}
      <div className="fade-up" style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #00e5a0, #4da6ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Sparkles size={18} color="#0a0c0f" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Grok Financial Advisor</div>
              <div style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'DM Mono' }}>● Online</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '80%', padding: '12px 16px', borderRadius: 14,
                background: m.role === 'user' ? 'var(--accent)' : 'var(--bg3)',
                color: m.role === 'user' ? '#0a0c0f' : 'var(--text)',
                fontSize: 14, lineHeight: 1.6,
                borderBottomRightRadius: m.role === 'user' ? 4 : 14,
                borderBottomLeftRadius: m.role === 'ai' ? 4 : 14,
              }}>
                {m.text}
              </div>
            </div>
          ))}
          {sending && (
            <div style={{ display: 'flex' }}>
              <div style={{
                padding: '12px 16px', borderRadius: 14, borderBottomLeftRadius: 4,
                background: 'var(--bg3)', display: 'flex', gap: 6, alignItems: 'center'
              }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)',
                    animation: 'pulse 1.2s ease infinite',
                    animationDelay: `${i * 0.2}s`
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div style={{ padding: '0 24px 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => setInput(s)} style={{
              padding: '6px 12px', borderRadius: 20, fontSize: 12,
              background: 'var(--bg3)', border: '1px solid var(--border)',
              color: 'var(--muted)', cursor: 'pointer', fontFamily: 'Syne'
            }}>{s}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your finances..."
            style={{
              flex: 1, padding: '12px 16px',
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 12, color: 'var(--text)', fontFamily: 'Syne', fontSize: 14, outline: 'none'
            }}
          />
          <button onClick={handleSend} disabled={sending} style={{
            width: 46, height: 46, borderRadius: 12,
            background: sending ? 'var(--bg3)' : 'var(--accent)',
            border: 'none', cursor: sending ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Send size={18} color={sending ? 'var(--muted)' : '#0a0c0f'} />
          </button>
        </div>
      </div>

      {/* Insights panel */}
      <div className="fade-up-1" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 24
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lightbulb size={16} color="var(--accent)" />
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>AI Insights</h2>
            </div>
            <button onClick={refreshInsights} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
              <RefreshCw size={15} style={{ animation: loadingInsights ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          </div>
          {loadingInsights ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 60 }} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(insights?.insights || []).map((insight, i) => (
                <div key={i} style={{
                  padding: 14, borderRadius: 12,
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  fontSize: 13, lineHeight: 1.6, color: 'var(--text)'
                }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, marginRight: 6 }}>{i+1}.</span>
                  {insight}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #00e5a010, #4da6ff10)',
          border: '1px solid var(--accent)',
          borderRadius: 16, padding: 20
        }}>
          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>💡 How it works</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
            Grok AI analyzes your transaction history to identify spending patterns, flag unusual activity, and suggest personalized ways to improve your financial health.
          </div>
        </div>
      </div>
    </div>
  );
}
