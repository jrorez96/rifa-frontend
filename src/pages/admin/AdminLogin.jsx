import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../api/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await adminLogin(username, password);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', data.admin.username);
      navigate('/admin');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrectos');
      } else if (err.response) {
        setError(`Error del servidor (${err.response.status}). Intenta de nuevo.`);
      } else {
        setError('No se pudo contactar al servidor. Revisa tu conexión o inténtalo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--color-card)] border border-[var(--color-gold-dim)] rounded-lg p-8 w-full max-w-sm"
      >
        <h1 className="font-display text-3xl text-gold-gradient mb-6 text-center">
          Panel administrativo
        </h1>

        <div className="space-y-3">
          <input
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2.5 rounded-md bg-[var(--color-void)] border border-[var(--color-available-border)] text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
          />
          <input
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 rounded-md bg-[var(--color-void)] border border-[var(--color-available-border)] text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
          />
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-5 bg-[var(--color-gold-bright)] text-[var(--color-void)] font-display text-lg tracking-wide py-2.5 rounded-md disabled:opacity-50"
        >
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
