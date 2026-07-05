import { useEffect, useState, useCallback, useMemo } from 'react';
import HeroBanner from '../components/HeroBanner';
import NumberGrid from '../components/NumberGrid';
import GridLegend from '../components/GridLegend';
import SelectedBar from '../components/SelectedBar';
import PurchaseModal from '../components/PurchaseModal';
import { getNumbers, getSettings } from '../api/api';
import { useNumbersSocket } from '../hooks/useNumbersSocket';

export default function Home() {
  const [numbers, setNumbers] = useState({}); // { '0001': 'available' | 'reserved' | 'sold' }
  const [settings, setSettings] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [numsData, settingsData] = await Promise.all([getNumbers(), getSettings()]);
        const map = {};
        numsData.forEach((n) => { map[n.number_value] = n.status; });
        setNumbers(map);
        setSettings(settingsData);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Tiempo real: cuando otro cliente toma/libera/compra números,
  // se actualiza el grid sin recargar los 10,000 registros completos.
  const handleSocketUpdate = useCallback((changes) => {
    setNumbers((prev) => {
      const next = { ...prev };
      changes.forEach((c) => { next[c.number_value] = c.status; });
      return next;
    });
    // Si alguno de mis números seleccionados ya no está disponible
    // (otro cliente lo tomó primero), lo quito de mi selección local.
    setSelected((prev) => {
      let changed = false;
      const next = new Set(prev);
      changes.forEach((c) => {
        if (c.status !== 'available' && next.has(c.number_value)) {
          next.delete(c.number_value);
          changed = true;
        }
      });
      return changed ? next : prev;
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

  const availableCount = useMemo(
    () => Object.values(numbers).filter((s) => s === 'available').length || (10000 - Object.keys(numbers).length),
    [numbers]
  );

  function handleQuickJump(e) {
    e.preventDefault();
    const clean = search.padStart(4, '0').slice(-4);
    if (!/^\d{4}$/.test(clean)) return;
    if (numbers[clean] === 'available') {
      toggle(clean);
    }
    setSearch('');
  }

  return (
    <div className="min-h-screen pb-24">
      <HeroBanner
        settings={settings}
        availableCount={availableCount}
      />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-display text-2xl text-[var(--color-ink)]">Elige tus números</h2>
          <form onSubmit={handleQuickJump} className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value.replace(/\D/g, ''))}
              placeholder="Buscar número (ej. 1523)"
              maxLength={4}
              className="font-ticket px-3 py-2 rounded-md bg-[var(--color-card)] border border-[var(--color-available-border)] text-sm w-44 focus:border-[var(--color-gold)] outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-md border border-[var(--color-gold-dim)] text-sm text-[var(--color-gold-bright)] hover:border-[var(--color-gold)]"
            >
              Ir
            </button>
          </form>
        </div>

        <div className="mb-4">
          <GridLegend />
        </div>

        {loading ? (
          <p className="text-center text-[var(--color-ink-muted)] py-20">Cargando números…</p>
        ) : (
          <NumberGrid numbers={numbers} selected={selected} toggle={toggle} />
        )}
      </main>

      <SelectedBar
        selected={selected}
        pricePerNumber={settings?.price_per_number ?? 1000}
        onOpen={() => setModalOpen(true)}
        onClear={() => setSelected(new Set())}
      />

      {modalOpen && (
        <PurchaseModal
          selected={selected}
          pricePerNumber={settings?.price_per_number ?? 1000}
          adminWhatsapp={settings?.admin_whatsapp ?? ''}
          onClose={() => setModalOpen(false)}
          onExpired={() => {
            setSelected(new Set());
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
