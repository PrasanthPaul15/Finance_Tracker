import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts';
import { analyticsAPI } from '../utils/api';

const PIE_COLORS = ['#00e5a0','#4da6ff','#a78bfa','#ff5c5c','#fbbf24','#f472b6','#34d399','#fb923c'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px', fontFamily: 'DM Mono', fontSize: 13
    }}>
      <div style={{ color: 'var(--muted)', marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: ${p.value?.toLocaleString()}</div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [monthly, setMonthly] = useState([]);
  const [byCategory, setByCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsAPI.getMonthly(), analyticsAPI.getByCategory()])
      .then(([m, c]) => {
        setMonthly(m.data);
        setByCategory(c.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const expenseByCategory = byCategory
    .filter(d => d.type === 'expense')
    .map(d => ({ name: d.category, value: d.total }));

  const incomeByCategory = byCategory
    .filter(d => d.type === 'income')
    .map(d => ({ name: d.category, value: d.total }));

  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: 32, width: 180, marginBottom: 32 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 300 }} />)}
      </div>
    </div>
  );

  return (
    <div>
      <div className="fade-up" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.5px' }}>Analytics</h1>
        <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>Visualize your financial patterns</p>
      </div>

      {monthly.length > 0 && (
        <div className="fade-up-1" style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 24, marginBottom: 24
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Monthly Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 12, fontFamily: 'DM Mono' }} />
              <YAxis tick={{ fill: 'var(--muted)', fontSize: 12, fontFamily: 'DM Mono' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="var(--income)" radius={[6,6,0,0]} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--expense)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {expenseByCategory.length > 0 && (
          <div className="fade-up-2" style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 16, padding: 24
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Expenses by Category</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {expenseByCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {incomeByCategory.length > 0 && (
          <div className="fade-up-2" style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 16, padding: 24
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Income by Source</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={incomeByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {incomeByCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {monthly.length > 0 && (
          <div className="fade-up-3" style={{
            gridColumn: expenseByCategory.length > 0 && incomeByCategory.length > 0 ? '1 / -1' : 'auto',
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 16, padding: 24
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Net Balance Trend</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthly.map(m => ({ ...m, net: m.income - m.expenses }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 12, fontFamily: 'DM Mono' }} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 12, fontFamily: 'DM Mono' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="net" name="Net" stroke="var(--accent3)" strokeWidth={2.5} dot={{ r: 5, fill: 'var(--accent3)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {expenseByCategory.length === 0 && incomeByCategory.length === 0 && (
          <div style={{
            gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0',
            color: 'var(--muted)', background: 'var(--card)',
            borderRadius: 16, border: '1px solid var(--border)'
          }}>
            No data yet. Add some transactions to see charts!
          </div>
        )}
      </div>
    </div>
  );
}
