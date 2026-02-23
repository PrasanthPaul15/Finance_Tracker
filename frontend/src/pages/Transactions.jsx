import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import { transactionAPI } from '../utils/api';
import { format } from 'date-fns';

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Rental', 'Gifts', 'Other'],
  expense: ['Food', 'Housing', 'Transport', 'Entertainment', 'Healthcare', 'Shopping', 'Utilities', 'Education', 'Other']
};

const inputStyle = {
  width: '100%', padding: '10px 14px', background: 'var(--bg3)',
  border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)',
  fontFamily: 'Syne', fontSize: 14, outline: 'none'
};

const EMPTY = { title: '', amount: '', category: '', type: 'expense', note: '', date: '' };

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = () => {
    const params = filter !== 'all' ? { type: filter } : {};
    transactionAPI.getAll(params).then(r => setTransactions(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.category) return;
    const data = { ...form, amount: parseFloat(form.amount) };
    if (editId) {
      await transactionAPI.update(editId, data);
    } else {
      await transactionAPI.create(data);
    }
    setForm(EMPTY);
    setShowForm(false);
    setEditId(null);
    load();
  };

  const handleEdit = (t) => {
    setForm({ ...t, amount: String(t.amount), date: t.date.split('T')[0] });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await transactionAPI.delete(id);
    load();
  };

  const fmt = (n) => `$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div>
      <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>Transactions</h1>
          <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>Manage your income and expenses</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); }} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 10,
          background: 'var(--accent)', border: 'none', cursor: 'pointer',
          color: '#0a0c0f', fontFamily: 'Syne', fontWeight: 700, fontSize: 14
        }}>
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      {/* Filter */}
      <div className="fade-up-1" style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'income', 'expense'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 18px', borderRadius: 8, border: '1px solid var(--border)',
            background: filter === f ? 'var(--accent)' : 'var(--bg3)',
            color: filter === f ? '#0a0c0f' : 'var(--muted)',
            fontFamily: 'Syne', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            textTransform: 'capitalize'
          }}>{f}</button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="fade-up" style={{
          background: 'var(--card)', border: '1px solid var(--accent)',
          borderRadius: 16, padding: 24, marginBottom: 24
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700 }}>{editId ? 'Edit' : 'Add'} Transaction</h3>
            <button onClick={() => { setShowForm(false); setEditId(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
              <X size={18} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>TITLE</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Netflix Subscription" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>AMOUNT</label>
              <input style={inputStyle} type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>TYPE</label>
              <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value, category: '' })}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>CATEGORY</label>
              <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">Select category</option>
                {CATEGORIES[form.type].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>DATE</label>
              <input style={inputStyle} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>NOTE (optional)</label>
              <input style={inputStyle} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Any additional notes..." />
            </div>
          </div>
          <button onClick={handleSubmit} style={{
            marginTop: 20, display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 24px', borderRadius: 10,
            background: 'var(--accent)', border: 'none', cursor: 'pointer',
            color: '#0a0c0f', fontFamily: 'Syne', fontWeight: 700, fontSize: 14
          }}>
            <Check size={16} /> {editId ? 'Update' : 'Save'} Transaction
          </button>
        </div>
      )}

      {/* Transactions list */}
      <div className="fade-up-2" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 70 }} />)
        ) : transactions.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 0', color: 'var(--muted)',
            background: 'var(--card)', borderRadius: 16, border: '1px solid var(--border)'
          }}>
            No transactions found. Add one to get started!
          </div>
        ) : transactions.map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderRadius: 14,
            background: 'var(--card)', border: '1px solid var(--border)',
            transition: 'border-color 0.15s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 10,
                fontWeight: 700, letterSpacing: 0.5,
                background: t.type === 'income' ? '#00e5a018' : '#ff5c5c18',
                color: t.type === 'income' ? 'var(--income)' : 'var(--expense)',
              }}>
                {t.category.slice(0, 3).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  {t.category} · {format(new Date(t.date), 'MMM d, yyyy')}
                  {t.note && ` · ${t.note}`}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                fontFamily: 'DM Mono', fontSize: 16, fontWeight: 500,
                color: t.type === 'income' ? 'var(--income)' : 'var(--expense)'
              }}>
                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleEdit(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--expense)' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
