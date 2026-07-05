import { useEffect, useState, useCallback } from 'react';
import NumberGrid from '../../components/NumberGrid';
import GridLegend from '../../components/GridLegend';
import { getNumbers, manualReserve } from '../../api/api';
import { useNumbersSocket } from '../../hooks/useNumbersSocket';

export default function ManualReserve() {
  const [numbers, setNumbers] = useState({});
  const [selected, setSelected] = useState(new Set());
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getNumbers().then((data) => {
      const map = {};
      data.forEach((n) => { map[n.number_value] = n.status; });
      setNumbers(map);
    });
  }, []);

  const handleSocketUpdate = useCallback((changes) => {
    setNumbers((prev) => {
      const next = { ...prev };
      changes.forEach((c) => { next[c.number_value] = c.status; });
      return next;
    });
  }, []);
  useNumbersSocket(handleSocketUpdate);

  const toggle = useCallback((num) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  }, []);

  async function handleReserve() {
    if (selected.size === 0 || !form.name) return;
    setLoading(true);
    setMessage(null);
    try {
      await manualReserve({ ...form, numbers: [...selected] });
      setMessage({ type: 'ok', text: `${selected.size} número(s) vendido(s) a ${form.name}.` });
      setSelected(new Set());
      setForm({ name: '', phone: '', email: '' });
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage({ type: 'error', text: `Algunos números ya no están disponibles: ${err.response.data.numbers.join(', ')}` });
      } else {
        setMessage({ type: 'error', text: 'No se pudo completar la reserva.' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="text-sm text-[var(--color-ink-muted)] mb-4">
        Selecciona números en el grid para venderlos directamente a un cliente que compró
        en persona o por otro medio. Se marcan como vendidos de inmediato, sin pasar por WhatsApp.
      </p>

      <div className="bg-[var(--color-card)] border border-[var(--color-gold-dim)] rounded-lg p-4 mb-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <input
            placeholder="Nombre del cliente"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 rounded-md bg-[var(--color-void)] border border-[var(--color-available-border)] text-sm outline-none focus:border-[var(--color-gold)]"
          />
          <input
            placeholder="Teléfono (opcional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="p-2 rounded-md bg-[var(--color-void)] border border-[var(--color-available-border)] text-sm outline-none focus:border-[var(--color-gold)]"
          />
          <input
            placeholder="Correo (opcional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="p-2 rounded-md bg-[var(--color-void)] border border-[var(--color-available-border)] text-sm outline-none focus:border-[var(--color-gold)]"
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="font-ticket text-sm text-[var(--color-gold-bright)]">
            {selected.size > 0 ? [...selected].join(', ') : 'Ningún número seleccionado'}
          </p>
          <button
            onClick={handleReserve}
            disabled={loading || selected.size === 0 || !form.name}
            className="px-4 py-2 rounded-md bg-[var(--color-gold-bright)] text-[var(--color-void)] font-semibold text-sm disabled:opacity-40"
          >
            {loading ? 'Guardando…' : `Vender ${selected.size || ''} número(s)`}
          </button>
        </div>

        {message && (
          <p className={`text-sm mt-2 ${message.type === 'ok' ? 'text-green-400' : 'text-red-400'}`}>
            {message.text}
          </p>
        )}
      </div>

      <div className="mb-3"><GridLegend /></div>
      <NumberGrid numbers={numbers} selected={selected} toggle={toggle} />
    </div>
  );
}
