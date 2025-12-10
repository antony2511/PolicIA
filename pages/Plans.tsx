import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Plans: React.FC = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col">
      <header className="p-4 flex items-center border-b border-gray-800 sticky top-0 bg-background-dark z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-8">Planes y Membresías</h1>
      </header>

      <div className="p-5 space-y-6 flex-1 overflow-y-auto">
        {/* Usage Stats */}
        <div className="bg-surface-dark rounded-xl p-4 border border-gray-800">
          <div className="flex justify-between items-end mb-2">
            <span className="font-medium">Tu Plan Actual: Freemium</span>
            <span className="text-sm text-gray-400">3 de 5 usados</span>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{width: '60%'}}></div>
          </div>
        </div>

        {/* Toggle */}
        <div className="bg-gray-800 p-1 rounded-xl flex">
          <button 
            onClick={() => setBilling('monthly')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${billing === 'monthly' ? 'bg-surface-dark text-white shadow-sm' : 'text-gray-400'}`}
          >
            Mensual
          </button>
          <button 
             onClick={() => setBilling('annual')}
             className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${billing === 'annual' ? 'bg-surface-dark text-white shadow-sm' : 'text-gray-400'}`}
          >
            Anual
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Free Tier */}
          <div className="border border-gray-700 rounded-2xl p-6 bg-surface-dark relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full">
              Plan Actual
            </div>
            <h2 className="text-xl font-bold mb-1">Freemium</h2>
            <div className="text-4xl font-black mb-6">Gratis</div>
            
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-3 items-center">
                <span className="material-symbols-outlined text-success text-lg">check_circle</span>
                5 generaciones de documentos
              </li>
              <li className="flex gap-3 items-center">
                <span className="material-symbols-outlined text-success text-lg">check_circle</span>
                Asesoría procesal básica
              </li>
              <li className="flex gap-3 items-center">
                <span className="material-symbols-outlined text-success text-lg">check_circle</span>
                Soporte estándar
              </li>
            </ul>
          </div>

          {/* Paid Tier */}
          <div className="border border-primary rounded-2xl p-6 bg-primary/10 relative overflow-hidden">
             <div className="absolute top-4 right-4 bg-success text-white text-xs font-bold px-2 py-1 rounded-full">
              Recomendado
            </div>
            <h2 className="text-xl font-bold mb-1">Plus</h2>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black">$29,900</span>
              <span className="text-sm text-gray-400">/mes</span>
            </div>
            
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-3 items-center">
                <span className="material-symbols-outlined text-success text-lg">check_circle</span>
                Generaciones ilimitadas
              </li>
              <li className="flex gap-3 items-center">
                <span className="material-symbols-outlined text-success text-lg">check_circle</span>
                Asesoría IA avanzada
              </li>
              <li className="flex gap-3 items-center">
                <span className="material-symbols-outlined text-success text-lg">check_circle</span>
                Soporte prioritario
              </li>
              <li className="flex gap-3 items-center">
                <span className="material-symbols-outlined text-success text-lg">check_circle</span>
                Acceso a nuevas funciones
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-5 border-t border-gray-800 bg-background-dark pb-8">
        <button className="w-full bg-primary hover:bg-primary-dark py-4 rounded-xl text-white font-bold text-base shadow-lg shadow-primary/25 transition-all active:scale-95">
          Actualizar a Plus
        </button>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
          <span className="material-symbols-outlined text-sm">lock</span>
          Pagos seguros a través de Epayco
        </div>
      </div>
    </div>
  );
};