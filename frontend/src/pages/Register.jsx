import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Eye, EyeOff, Wallet, ArrowRight, Check } from 'lucide-react';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Contains uppercase', pass: /[A-Z]/.test(password) },
  ];
  if (!password) return null;
  return (
    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
      {checks.map((c, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            background: c.pass ? 'var(--accent)' : 'var(--bg3)',
            border: `1px solid ${c.pass ? 'var(--accent)' : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease', flexShrink: 0
          }}>
            {c.pass && <Check size={9} color="#0a0c0f" strokeWidth={3} />}
          </div>
          <span style={{ color: c.pass ? 'var(--accent)' : 'var(--muted)' }}>{c.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError("Passwords don't match");
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (key) => ({
    width: '100%', padding: '13px 16px',
    background: '#0d1117',
    border: `1px solid ${focused[key] ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 12, color: 'var(--text)',
    fontFamily: 'Syne', fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s ease',
  });

  const focus = (key) => setFocused(f => ({ ...f, [key]: true }));
  const blur = (key) => setFocused(f => ({ ...f, [key]: false }));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-start', padding: '60px',
        background: 'linear-gradient(135deg, #0d1117 0%, #111820 100%)',
        borderRight: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', width: 500, height: 500,
          borderRadius: '50%', top: -150, right: -100,
          background: 'radial-gradient(circle, #4da6ff0e 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', width: 350, height: 350,
          borderRadius: '50%', bottom: -80, left: -60,
          background: 'radial-gradient(circle, #00e5a010 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Wallet size={22} color="#0a0c0f" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>FinTrack</span>
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 20 }}>
            Start your journey<br />
            <span style={{
              background: 'linear-gradient(90deg, var(--accent3), var(--accent))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>to financial clarity</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, maxWidth: 360 }}>
            Join FinTrack today. Your data is private, secure, and only visible to you.
          </p>

          {/* Stats */}
          <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { value: 'Free', label: 'Always free tier' },
              { value: 'Grok AI', label: 'Smart insights' },
              { value: 'Instant', label: 'Setup in seconds' },
              { value: 'Private', label: 'Your data only' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '16px', borderRadius: 12,
                background: '#ffffff06', border: '1px solid var(--border)',
              }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--accent)', marginBottom: 3 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        width: 480, display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-start', padding: '2px 48px',
        overflowY: 'auto'
      }}>
        <div className="fade-up">
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
            Create your account
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 36 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Full Name</label>
              <input
                type="text" required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                onFocus={() => focus('name')} onBlur={() => blur('name')}
                style={inputStyle('name')}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={() => focus('email')} onBlur={() => blur('email')}
                style={inputStyle('email')}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => focus('pass')} onBlur={() => blur('pass')}
                  style={{ ...inputStyle('pass'), paddingRight: 48 }}
                  placeholder="Create a strong password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', padding: 0
                }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Confirm Password</label>
              <input
                type="password" required
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                onFocus={() => focus('confirm')} onBlur={() => blur('confirm')}
                style={{
                  ...inputStyle('confirm'),
                  borderColor: form.confirm && form.confirm !== form.password
                    ? 'var(--expense)'
                    : form.confirm && form.confirm === form.password
                    ? 'var(--income)'
                    : focused.confirm ? 'var(--accent)' : 'var(--border)'
                }}
                placeholder="Repeat your password"
              />
              {form.confirm && form.confirm !== form.password && (
                <p style={{ fontSize: 12, color: 'var(--expense)', marginTop: 6 }}>Passwords don't match</p>
              )}
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
                fontFamily: 'Syne', fontWeight: 800, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <span style={{ animation: 'pulse 1s ease infinite' }}>Creating account...</span>
              ) : (
                <> Create Account <ArrowRight size={18} /> </>
              )}
            </button>

            <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
              By signing up, you agree that your data is stored securely and never shared.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
