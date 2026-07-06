const RANGES = Array.from({ length: 10 }, (_, i) => ({
  label: `${String(i * 1000).padStart(4, '0')}–${String(i * 1000 + 999).padStart(4, '0')}`,
  start: i * 1000
}));

export default function RangeButtons({ onJump }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {RANGES.map((r) => (
        <button
          key={r.start}
          type="button"
          onClick={() => onJump(r.start)}
          className="font-ticket text-xs px-2.5 py-1.5 rounded-md border border-[var(--color-available-border)] text-[var(--color-ink-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition"
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
