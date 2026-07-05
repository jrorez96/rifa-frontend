export default function HeroBanner({ settings, availableCount }) {
  const drawDate = settings?.draw_date
    ? new Date(settings.draw_date).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <header className="border-b border-[var(--color-gold-dim)]">
      {/* Flyer oficial de la rifa */}
      <img
        src="/flyer-rifa.jpg"
        alt="Rifa Gran Premio - Hyundai Accent 2016 y iPhone 17 Pro Max"
        className="w-full max-w-2xl mx-auto block"
      />

      {/* Barra de estado dinámico: lo único que cambia en vivo y el flyer no puede mostrar */}
      <div className="max-w-2xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-6 bg-[var(--color-card)]">
        <div className="text-center">
          <p className="font-display text-2xl text-[var(--color-gold-bright)] leading-none">
            ₡{settings?.price_per_number ?? '1000'}
          </p>
          <p className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-wide">por número</p>
        </div>
        <div className="text-center">
          <p className="font-display text-2xl text-[var(--color-gold-bright)] leading-none">
            {availableCount.toLocaleString('es-CR')}
          </p>
          <p className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-wide">disponibles ahora</p>
        </div>
        {drawDate && (
          <div className="text-center">
            <p className="font-display text-2xl text-[var(--color-gold-bright)] leading-none capitalize">
              {drawDate}
            </p>
            <p className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-wide">fecha de sorteo</p>
          </div>
        )}
      </div>
    </header>
  );
}
