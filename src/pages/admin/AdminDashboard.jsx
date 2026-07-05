import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PendingOrders from './PendingOrders';
import ManualReserve from './ManualReserve';

export default function AdminDashboard() {
  const [tab, setTab] = useState('orders');
  const navigate = useNavigate();
  const username = localStorage.getItem('adminUser');

  function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-gold-dim)] px-4 py-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-gold-gradient">Panel — Rifa</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--color-ink-muted)]">{username}</span>
          <button onClick={logout} className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] underline">
            Salir
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('orders')}
            className={`px-4 py-2 rounded-md text-sm font-semibold ${
              tab === 'orders' ? 'bg-[var(--color-gold-bright)] text-[var(--color-void)]' : 'border border-[var(--color-available-border)] text-[var(--color-ink-muted)]'
            }`}
          >
            Órdenes
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`px-4 py-2 rounded-md text-sm font-semibold ${
              tab === 'manual' ? 'bg-[var(--color-gold-bright)] text-[var(--color-void)]' : 'border border-[var(--color-available-border)] text-[var(--color-ink-muted)]'
            }`}
          >
            Reserva manual
          </button>
        </div>

        {tab === 'orders' ? <PendingOrders /> : <ManualReserve />}
      </div>
    </div>
  );
}
