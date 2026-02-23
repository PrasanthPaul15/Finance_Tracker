import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Eye, EyeOff, Wallet, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (focused) => ({
    width: '100%', padding: '13px 16px',
    background: '#0d1117',
    border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 12, color: 'var(--text)',
    fontFamily: 'Syne', fontSize: 19, outline: 'none',
    transition: 'border-color 0.2s ease',
  });

  const [focused, setFocused] = useState({});

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg)',
    }}>
      {/* Left panel - branding */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '40px',
        background: 'linear-gradient(135deg, #0d1117 0%, #111820 100%)',
        borderRight: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', width: 400, height: 400,
          borderRadius: '50%', top: -100, left: -100,
          background: 'radial-gradient(circle, #00e5a012 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300,
          borderRadius: '50%', bottom: 50, right: -80,
          background: 'radial-gradient(circle, #4da6ff10 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--accent)', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <Wallet size={22} color="#0a0c0f" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 30, letterSpacing: '-0.7px' }}>FinTrack</span>
          </div>

          <h1 style={{
            fontSize: 42, fontWeight: 700, lineHeight: 1.15,
            letterSpacing: '-1px', marginBottom: 20
          }}>
            Take control of<br />
            <span style={{
              background: 'linear-gradient(90deg, var(--accent), var(--accent3))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>your finances</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, maxWidth: 360 }}>
            Track income, expenses, and get AI-powered insights to make smarter money decisions.
          </p>

          {/* Feature pills */}
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '📊', text: 'Real-time spending analytics' },
              { icon: '🤖', text: 'Grok AI financial advisor' },
              { icon: '🔒', text: 'Secure, private & yours only' },
            ].map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 12,
                background: '#ffffff08', border: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 18 }}>{f.icon}</span>
                <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{
        width: 440, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 48px',
      }}>
        <div className="fade-up">
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.3px', marginBottom: 8 }}>
            Welcome back
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 36 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              Sign up free
            </Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocused(f => ({ ...f, email: true }))}
                onBlur={() => setFocused(f => ({ ...f, email: false }))}
                style={inputStyle(focused.email)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused(f => ({ ...f, pass: true }))}
                  onBlur={() => setFocused(f => ({ ...f, pass: false }))}
                  style={{ ...inputStyle(focused.pass), paddingRight: 48 }}
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
                  display: 'flex', padding: 0
                }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '12px 16px', borderRadius: 10,
                background: '#ff5c5c15', border: '1px solid #ff5c5c40',
                color: 'var(--expense)', fontSize: 13
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                padding: '14px 24px', borderRadius: 12,
                background: loading ? 'var(--bg3)' : 'var(--accent)',
                border: 'none', cursor: loading ? 'default' : 'pointer',
                color: loading ? 'var(--muted)' : '#0a0c0f',
                fontFamily: 'Syne', fontWeight: 800, fontSize: 19,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s ease',
                letterSpacing: '-0.2px',
              }}
            >
              {loading ? (
                <span style={{ animation: 'pulse 1s ease infinite' }}>Signing in...</span>
              ) : (
                <> Sign In <ArrowRight size={18} /> </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
