import { useEffect, useState } from 'react';

/**
 * Cuenta regresiva del hold. Soporta duraciones largas (horas) mostrando
 * el formato HH:MM:SS, y cambia a rojo durante la última hora.
 */
export default function CountdownTimer({ seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onExpire]);

  const hh = Math.floor(remaining / 3600);
  const mm = Math.floor((remaining % 3600) / 60);
  const ss = remaining % 60;
  const isLow = remaining <= 3600; // última hora

  const pad = (n) => String(n).padStart(2, '0');
  const label = hh > 0 ? `${pad(hh)}:${pad(mm)}:${pad(ss)}` : `${pad(mm)}:${pad(ss)}`;

  return (
    <span className={`font-ticket font-bold text-lg ${isLow ? 'text-red-400' : 'text-[var(--color-gold-bright)]'}`}>
      {label}
    </span>
  );
}
