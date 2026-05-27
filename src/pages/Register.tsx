import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    nombre: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-fadeInUp">
        <div className="card p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-6xl block mb-4 animate-float">🍔</span>
            <h1 className="text-2xl font-bold text-white">Crear Cuenta</h1>
            <p className="text-gray-400 text-sm mt-1">Registrate en Burger House</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre completo</label>
              <input type="text" required value={form.nombre} onChange={handleChange('nombre')}
                className="input" placeholder="Juan Pérez" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Usuario</label>
              <input type="text" required minLength={3} value={form.username} onChange={handleChange('username')}
                className="input" placeholder="juanperez" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={handleChange('email')}
                className="input" placeholder="juan@ejemplo.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
              <input type="password" required minLength={6} value={form.password} onChange={handleChange('password')}
                className="input" placeholder="Mínimo 6 caracteres" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary justify-center text-base py-3">
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
