import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppRoute } from '../types';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    rank: 'Patrullero'
  });

  useEffect(() => {
    if (currentUser) {
      navigate(AppRoute.DASHBOARD);
    }
  }, [currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.displayName,
        formData.rank
      );
      navigate(AppRoute.DASHBOARD);
    } catch (err: any) {
      console.error('Register error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado');
      } else if (err.code === 'auth/invalid-email') {
        setError('Correo electrónico inválido');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es muy débil');
      } else {
        setError('Error al crear la cuenta. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background-dark text-white">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-20 w-20 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-5xl text-white">local_police</span>
          </div>
          <h1 className="text-3xl font-bold">Crear Cuenta</h1>
          <p className="text-gray-400">Regístrate en PolicIA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {/* Nombre Completo */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nombre Completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-500">badge</span>
              </div>
              <input
                type="text"
                name="displayName"
                required
                value={formData.displayName}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-surface-dark/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Tu nombre completo"
              />
            </div>
          </div>

          {/* Rango */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Rango</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-500">military_tech</span>
              </div>
              <select
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-surface-dark/50 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
              >
                <option value="Patrullero">Patrullero</option>
                <option value="Agente">Agente</option>
                <option value="Subintendente">Subintendente</option>
                <option value="Intendente">Intendente</option>
                <option value="Intendente Jefe">Intendente Jefe</option>
                <option value="Subcomisario">Subcomisario</option>
                <option value="Comisario">Comisario</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-500">mail</span>
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-surface-dark/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-500">lock</span>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-lg bg-surface-dark/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Mínimo 6 caracteres"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-gray-500">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Confirmar Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-500">lock</span>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-surface-dark/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Confirma tu contraseña"
              />
            </div>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/30 rounded-lg p-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-danger text-sm">error</span>
              <span className="text-sm text-danger">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : "Crear Cuenta"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigate(AppRoute.LOGIN)}
              className="text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © 2024 Dirección General de la Policía Nacional de Colombia
        </p>
      </div>
    </div>
  );
};
