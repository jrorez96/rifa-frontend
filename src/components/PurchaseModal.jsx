import { useState } from 'react';
import TermsModal from './TermsModal';
import CountdownTimer from './CountdownTimer';
import { createOrder, uploadProof } from '../api/api';

function buildWhatsappMessage({ name, email, numbers, total }) {
  const now = new Date().toLocaleString('es-CR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  return [
    '🎟️ NUEVA COMPRA DE RIFA 🎟️',
    `👤 Nombre: ${name}`,
    `📧 Correo: ${email}`,
    `🔢 Número comprado: ${numbers.join(', ')}`,
    `💰 Monto pagado: ₡${total.toLocaleString('es-CR')}`,
    '📎 Comprobante SINPE: adjunto en este chat',
    `📅 Fecha y hora: ${now}`,
    '✅ Estado: Pendiente de verificación'
  ].join('\n');
}

export default function PurchaseModal({ selected, pricePerNumber, adminWhatsapp, onClose, onExpired }) {
  // form -> pedimos datos y creamos la orden
  // proof -> pedimos el comprobante (aún no se abre WhatsApp)
  // sent -> ya se subió el comprobante y se abrió WhatsApp
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [proofFile, setProofFile] = useState(null);

  const numbers = [...selected];
  const total = numbers.length * pricePerNumber;
  const canSubmit = acceptedTerms && form.name && form.phone && form.email && !loading;

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const data = await createOrder({ ...form, numbers });
      setOrder(data);
      setStep('proof');
    } catch (err) {
      if (err.response?.status === 409) {
        setError(
          `Algunos números ya no están disponibles: ${err.response.data.numbers.join(', ')}. Por favor cierra esta ventana y ajusta tu selección.`
        );
      } else {
        setError('No se pudo crear la orden. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }

  // El mensaje de WhatsApp solo se envía DESPUÉS de subir el comprobante,
  // como pidió Joel — así el admin recibe el aviso ya con el pago adjunto.
  async function handleUploadProof() {
    if (!proofFile || !order) return;
    setLoading(true);
    setError(null);
    try {
      await uploadProof(order.orderId, proofFile);

      const message = buildWhatsappMessage({ name: form.name, email: form.email, numbers, total: order.total });
      const url = `https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');

      setStep('sent');
    } catch {
      setError('No se pudo subir el comprobante. Intenta de nuevo antes de continuar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[var(--color-card)] border border-[var(--color-gold-dim)] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6">

        {step === 'form' && (
          <>
            <h2 className="font-display text-2xl text-gold-gradient mb-1">Confirmar compra</h2>
            <p className="text-xs text-[var(--color-ink-muted)] mb-4 font-ticket">
              {numbers.join(' · ')}
            </p>
            <p className="text-lg font-semibold mb-4">
              Total: <span className="text-gold-gradient font-display text-xl">₡{total.toLocaleString('es-CR')}</span>
            </p>

            <div className="space-y-3">
              <input
                placeholder="Nombre completo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2.5 rounded-md bg-[var(--color-void)] border border-[var(--color-available-border)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-gold)] outline-none"
              />
              <input
                placeholder="Teléfono (WhatsApp)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-2.5 rounded-md bg-[var(--color-void)] border border-[var(--color-available-border)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-gold)] outline-none"
              />
              <input
                placeholder="Correo electrónico"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-2.5 rounded-md bg-[var(--color-void)] border border-[var(--color-available-border)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-gold)] outline-none"
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-[var(--color-ink-muted)] mt-4">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1"
              />
              <span>
                Acepto los{' '}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="underline text-[var(--color-gold-bright)]"
                >
                  términos y condiciones
                </button>{' '}
                de la rifa.
              </span>
            </label>

            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-md border border-[var(--color-available-border)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="flex-1 bg-[var(--color-gold-bright)] text-[var(--color-void)] font-display text-lg tracking-wide py-2.5 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
              >
                {loading ? 'Procesando…' : 'Aceptar y continuar'}
              </button>
            </div>
          </>
        )}

        {step === 'proof' && order && (
          <>
            <h2 className="font-display text-2xl text-gold-gradient mb-2">Sube tu comprobante SINPE</h2>
            <p className="text-sm text-[var(--color-ink-muted)] mb-4">
              Tus números quedaron apartados. Sube la captura del SINPE Móvil para continuar —
              en cuanto la subas se abrirá WhatsApp con tu pedido listo para enviar.
            </p>

            <div className="text-center mb-4">
              <p className="text-xs text-[var(--color-ink-muted)] mb-1">Tiempo restante de tu reserva</p>
              <CountdownTimer seconds={order.holdExpiresInSeconds} onExpire={onExpired} />
            </div>

            <div className="space-y-3">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setProofFile(e.target.files[0])}
                className="w-full text-sm text-[var(--color-ink-muted)] file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-[var(--color-gold-dim)] file:text-[var(--color-ink)]"
              />
              <button
                type="button"
                disabled={!proofFile || loading}
                onClick={handleUploadProof}
                className="w-full bg-[var(--color-gold-bright)] text-[var(--color-void)] font-display text-lg tracking-wide py-2.5 rounded-md disabled:opacity-40"
              >
                {loading ? 'Subiendo…' : 'Subir comprobante y enviar por WhatsApp'}
              </button>
            </div>

            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full py-2.5 rounded-md border border-[var(--color-available-border)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            >
              Cerrar (tus números siguen apartados hasta que expire el tiempo)
            </button>
          </>
        )}

        {step === 'sent' && order && (
          <>
            <h2 className="font-display text-2xl text-gold-gradient mb-2">¡Listo!</h2>
            <p className="text-sm text-[var(--color-ink-muted)] mb-4">
              Tu comprobante fue recibido y se abrió WhatsApp con tu pedido. Envía ese mensaje
              para que el administrador confirme tu compra.
            </p>

            <div className="text-center mb-4">
              <p className="text-xs text-[var(--color-ink-muted)] mb-1">Tiempo restante mientras se confirma</p>
              <CountdownTimer seconds={order.holdExpiresInSeconds} onExpire={onExpired} />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-md bg-[var(--color-gold)] text-[var(--color-void)] font-semibold"
            >
              Cerrar
            </button>
          </>
        )}
      </div>

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </div>
  );
}
