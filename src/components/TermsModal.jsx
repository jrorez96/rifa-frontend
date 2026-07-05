export default function TermsModal({ onClose, drawDateLabel }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--color-card)] border border-[var(--color-gold-dim)] rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
      >
        <h3 className="font-display text-2xl text-gold-gradient mb-4">Términos y condiciones</h3>
        <ol className="space-y-3 text-sm text-[var(--color-ink-muted)] list-decimal list-inside">
          <li>El número ganador del 1er premio (Hyundai Accent 2016) se obtiene combinando el primer y segundo número de la Lotería Nacional en la fecha del sorteo.</li>
          <li>El 2do premio (iPhone 17 Pro Max) corresponde al número contrario del ganador del 1er premio.</li>
          <li>{drawDateLabel ? `El sorteo se realiza el ${drawDateLabel} con la Lotería del Domingo.` : 'El sorteo se realiza con la Lotería del Domingo en la fecha indicada.'}</li>
          <li>Si todos los números se venden antes de la fecha indicada, el sorteo se adelanta a la lotería más cercana disponible.</li>
          <li>Si para la fecha indicada aún quedan números disponibles, el sorteo se aplaza hasta agotar existencias o hasta nueva fecha anunciada por el organizador.</li>
          <li>La reserva de un número no es definitiva hasta que el organizador confirme el pago mediante el comprobante SINPE enviado.</li>
          <li>Si el pago no se confirma dentro del tiempo indicado, el número queda libre nuevamente para la venta.</li>
          <li>El premio debe reclamarse contactando al organizador por WhatsApp con el número ganador y el comprobante de compra.</li>
        </ol>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full bg-[var(--color-gold)] text-[var(--color-void)] font-semibold py-2 rounded-md hover:brightness-110"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
