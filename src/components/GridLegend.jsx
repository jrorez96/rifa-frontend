const items = [
  { label: 'Disponible', className: 'border border-dashed border-[var(--color-available-border)]' },
  { label: 'Seleccionado', className: 'bg-[var(--color-gold-bright)]' },
  { label: 'Reservado', className: 'bg-[var(--color-reserved)]' },
  { label: 'Vendido', className: 'bg-[var(--color-sold)]' }
];

export default function GridLegend() {
  return (
    <div className="flex flex-wrap gap-4 justify-center text-xs text-[var(--color-ink-muted)]">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className={`w-4 h-4 rounded-sm ${item.className}`} />
          {item.label}
        </div>
      ))}
    </div>
  );
}
