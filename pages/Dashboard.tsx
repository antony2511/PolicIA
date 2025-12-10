import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppRoute } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, userProfile } = useAuth();

  const menuItems = [
    { title: 'Crear Informe de Comparendo', icon: 'receipt_long', color: 'text-warning' },
    { title: 'Crear Acta', icon: 'description', color: 'text-warning' },
    { title: 'Primer Respondiente', icon: 'local_hospital', color: 'text-warning' },
    { title: 'Derechos del Capturado', icon: 'gavel', color: 'text-warning' },
  ];

  const recentDocs = [
    { title: 'Acta de Incautación', date: '15 de Agosto, 2023', icon: 'description' },
    { title: 'Comparendo - XYZ 123', date: '14 de Agosto, 2023', icon: 'receipt_long' },
    { title: 'Derechos del Capturado', date: '12 de Agosto, 2023', icon: 'gavel' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white">
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between sticky top-0 bg-background-dark z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-600 bg-center bg-cover border-2 border-primary"
               style={{backgroundImage: 'url("https://randomuser.me/api/portraits/men/32.jpg")'}}></div>
          <div>
            <h2 className="text-sm font-bold leading-tight">{userProfile?.rank || 'Patrullero'}</h2>
            <p className="text-xs text-gray-400">{userProfile?.displayName || 'Usuario'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(AppRoute.PLANS)}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-surface-dark transition-colors"
          >
            <span className="material-symbols-outlined text-gray-400">settings</span>
          </button>
          <button
            onClick={async () => {
              await logout();
              navigate(AppRoute.LOGIN);
            }}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-surface-dark transition-colors"
            title="Cerrar Sesión"
          >
            <span className="material-symbols-outlined text-gray-400">logout</span>
          </button>
        </div>
      </header>

      <div className="px-5 pb-2">
        <h1 className="text-3xl font-bold mb-4">PolicIA Dashboard</h1>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-2 gap-3 px-5 mb-6">
        {menuItems.map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => navigate(AppRoute.PDF_VIEWER)} // Placeholder link
            className="flex flex-col gap-3 p-4 rounded-xl bg-surface-dark border border-gray-800 hover:border-primary/50 transition-all active:scale-95 text-left"
          >
            <span className={`material-symbols-outlined text-3xl ${item.color}`}>{item.icon}</span>
            <span className="font-bold text-sm leading-tight">{item.title}</span>
          </button>
        ))}
      </div>

      {/* CTA Button */}
      <div className="px-5 mb-8">
        <button 
          onClick={() => navigate(AppRoute.CHAT)}
          className="w-full flex items-center justify-center gap-3 h-14 bg-primary hover:bg-primary-dark rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl">smart_toy</span>
          <span className="font-bold text-base">Consultar Procedimiento con IA</span>
        </button>
      </div>

      {/* Recent Docs */}
      <div className="px-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">Documentos Recientes</h3>
          <button className="text-primary text-sm font-medium hover:underline">Ver Todos</button>
        </div>

        <div className="flex flex-col gap-3 pb-8">
          {recentDocs.map((doc, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-surface-dark border border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-gray-300">{doc.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{doc.title}</h4>
                <p className="text-sm text-gray-400">{doc.date}</p>
              </div>
              <span className="material-symbols-outlined text-gray-500">chevron_right</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};