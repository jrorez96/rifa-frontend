import { useEffect, useState } from 'react';
import { listOrders, confirmOrder, rejectOrder, API_BASE } from '../../api/api';

const STATUS_TABS = [
  { key: 'pending', label: 'Pendientes' },
  { key: 'confirmed', label: 'Confirmadas' },
  { key: 'rejected', label: 'Rechazadas' },
  { key: 'expired', label: 'Vencidas' }
];

export default function PendingOrders() {
  const [status, setStatus] = useState('pending');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await listOrders(status);
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [status]);

  async function handleConfirm(id) {
    setBusyId(id);
    try {
      await confirmOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch {
      alert('No se pudo confirmar la orden');
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id) {
    if (!confirm('¿Rechazar esta orden? Los números volverán a estar disponibles.')) return;
    setBusyId(id);
    try {
      await rejectOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch {
      alert('No se pudo rechazar la orden');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatus(tab.key)}
            className={`px-3 py-1.5 rounded-md text-sm border ${
              status === tab.key
                ? 'bg-[var(--color-gold-bright)] text-[var(--color-void)] border-transparent font-semibold'
                : 'border-[var(--color-available-border)] text-[var(--color-ink-muted)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[var(--color-ink-muted)]">Cargando órdenes…</p>
      ) : orders.length === 0 ? (
        <p className="text-[var(--color-ink-muted)]">No hay órdenes en este estado.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[var(--color-card)] border border-[var(--color-gold-dim)] rounded-lg p-4 flex flex-col sm:flex-row gap-4 justify-between"
            >
              <div>
                <p className="font-semibold text-[var(--color-ink)]">{order.name}</p>
                <p className="text-sm text-[var(--color-ink-muted)]">{order.phone} · {order.email}</p>
                <p className="font-ticket text-sm text-[var(--color-gold-bright)] mt-1">{order.numbers}</p>
                <p className="text-sm text-[var(--color-ink-muted)]">
                  Total: ₡{Number(order.total_amount).toLocaleString('es-CR')}
                </p>
                <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                  {new Date(order.created_at).toLocaleString('es-CR')}
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                {order.payment_proof_url ? (
                  <a
                    href={`${API_BASE}${order.payment_proof_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline text-[var(--color-gold-bright)]"
                  >
                    Ver comprobante
                  </a>
                ) : (
                  <span className="text-xs text-[var(--color-ink-muted)]">Sin comprobante</span>
                )}

                {status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(order.id)}
                      disabled={busyId === order.id}
                      className="px-3 py-1.5 rounded-md border border-red-800 text-red-400 text-sm disabled:opacity-40"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleConfirm(order.id)}
                      disabled={busyId === order.id}
                      className="px-3 py-1.5 rounded-md bg-[var(--color-gold-bright)] text-[var(--color-void)] font-semibold text-sm disabled:opacity-40"
                    >
                      Confirmar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
