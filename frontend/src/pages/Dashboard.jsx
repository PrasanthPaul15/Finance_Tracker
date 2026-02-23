import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, Percent } from 'lucide-react';
import { analyticsAPI, transactionAPI } from '../utils/api';
import { format } from 'date-fns';

const COLORS = { income: 'var(--income)', expense: 'var(--expense)' };

function StatCard({ label, value, icon: Icon, color, delay = 0 }) {
  return (
    <div className={`fade-up-${delay}`} style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: color
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <div style={{ fontFamily: 'DM Mono', fontSize: 28, fontWeight: 500, color: 'var(--text)' }}>
        {value}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsAPI.getSummary(), transactionAPI.getAll({ limit: 5 })])
      .then(([s, t]) => {
        setSummary(s.data);
        setRecent(t.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n) => `$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: 32, width: 200, marginBottom: 32 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 110 }} />)}
      </div>
    </div>
  );

  return (
    <div>
      <div className="fade-up" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>Dashboard</h1>
        <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>Your financial overview at a glance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Income" value={fmt(summary?.total_income || 0)} icon={TrendingUp} color="var(--income)" delay={1} />
        <StatCard label="Total Expenses" value={fmt(summary?.total_expenses || 0)} icon={TrendingDown} color="var(--expense)" delay={2} />
        <StatCard label="Net Balance" value={fmt(summary?.net_balance || 0)} icon={Wallet} color="var(--accent3)" delay={3} />
        <StatCard label="Savings Rate" value={`${summary?.savings_rate || 0}%`} icon={Percent} color="#a78bfa" delay={3} />
      </div>

      <div className="fade-up-2" style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 24
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Recent Transactions</h2>
        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
            No transactions yet. Add your first transaction!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recent.map(t => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: 12, background: 'var(--bg3)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: t.type === 'income' ? 'var(--income)' : 'var(--expense)'
                  }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.category} · {format(new Date(t.date), 'MMM d, yyyy')}</div>
                  </div>
                </div>
                <div style={{
                  fontFamily: 'DM Mono', fontWeight: 500,
                  color: t.type === 'income' ? 'var(--income)' : 'var(--expense)'
                }}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
