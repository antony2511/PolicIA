import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppRoute } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('patrullero@policia.gov.co');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate(AppRoute.DASHBOARD);
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(AppRoute.DASHBOARD);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
          ? 'Credenciales incorrectas'
          : 'Error al iniciar sesión. Intenta de nuevo.'
      );
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
          <h1 className="text-3xl font-bold">Bienvenido a PolicIA</h1>
          <p className="text-gray-400">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 mt-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Correo Electrónico / No. Placa</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-500">person</span>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-surface-dark/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Introduce tu correo"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-500">lock</span>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-lg bg-surface-dark/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="••••••••"
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

          <div className="flex justify-end">
            <a href="#" className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">¿Olvidaste tu contraseña?</a>
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
            ) : "Ingresar"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background-dark text-gray-500">O</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-700 rounded-lg shadow-sm bg-surface-dark text-white hover:bg-gray-800 transition-all font-medium">
            {/* Simple colored SVG for SIJIN logo representation */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 22L22 7L12 2Z" fill="#135bec" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M12 6V18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 10H17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Ingresar con SIJIN
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => navigate(AppRoute.REGISTER)}
              className="text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Regístrate aquí
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