export default function SelectedBar({ selected, pricePerNumber, onOpen, onClear }) {
  if (selected.size === 0) return null;

  const total = selected.size * pricePerNumber;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--color-gold-dim)] bg-[var(--color-void)]/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--color-ink-muted)]">
            {selected.size} número{selected.size !== 1 ? 's' : ''} seleccionado{selected.size !== 1 ? 's' : ''}
          </p>
          <p className="font-display text-2xl text-gold-gradient leading-none">
            ₡{total.toLocaleString('es-CR')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] underline"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={onOpen}
            className="bg-[var(--color-gold-bright)] text-[var(--color-void)] font-display text-lg tracking-wide px-6 py-2.5 rounded-md hover:brightness-110 transition"
          >
            Tomar números
          </button>
        </div>
      </div>
    </div>
  );
}
