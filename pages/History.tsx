import React from 'react';
import { useNavigate } from 'react-router-dom';

export const History: React.FC = () => {
  const navigate = useNavigate();

  const historySections = [
    {
      label: 'Hoy',
      items: [
        {
          title: 'Procedimiento para riña en espacio público',
          subtitle: '¿Cuál es el procedimiento para una riña en espacio público...?',
          type: 'chat',
          icon: 'chat',
          color: 'text-primary'
        },
        {
          title: 'Generación de Comparendo',
          subtitle: 'Comparendo generado para Juan Pérez, CC 12345678.',
          type: 'doc',
          icon: 'description',
          color: 'text-success'
        }
      ]
    },
    {
      label: 'Ayer',
      items: [
        {
          title: 'Código Nacional de Policía, Artículo 140',
          subtitle: 'Por favor, explícame el Artículo 140, numeral 8 del CNPC.',
          type: 'chat',
          icon: 'chat',
          color: 'text-primary'
        }
      ]
    },
    {
      label: '25 de Julio, 2024',
      items: [
        {
          title: 'Redacción de Informe de Incidente',
          subtitle: 'Informe sobre el incidente ocurrido en la Calle 10 con Carrera 5.',
          type: 'doc',
          icon: 'edit_document',
          color: 'text-warning'
        },
        {
          title: 'Uso de la fuerza letal',
          subtitle: '¿En qué circunstancias está justificado el uso de la fuerza letal?',
          type: 'chat',
          icon: 'chat',
          color: 'text-primary'
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white pb-24">
      {/* Search Header */}
      <div className="sticky top-0 bg-background-dark z-10 pt-4 px-4 pb-2 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
             <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="text-lg font-bold">Mis Consultas</h1>
          <button className="p-1">
             <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>

        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500">search</span>
          <input 
            type="text" 
            placeholder="Buscar consultas..." 
            className="w-full bg-surface-dark border-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button className="flex items-center gap-1 bg-primary/20 text-primary border border-primary px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">
            <span className="material-symbols-outlined text-sm">tune</span>
            Todos
          </button>
          {['Hoy', 'Ayer', 'Documentos', 'Asesorías'].map(filter => (
            <button key={filter} className="bg-surface-dark border border-gray-700 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap text-gray-300">
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-6 p-4">
        {historySections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">{section.label}</h2>
            <div className="flex flex-col bg-surface-dark rounded-2xl overflow-hidden border border-gray-800">
              {section.items.map((item, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 hover:bg-gray-800 transition-colors cursor-pointer ${i !== section.items.length -1 ? 'border-b border-gray-800' : ''}`}>
                  <div className={`h-10 w-10 rounded-full bg-opacity-10 flex items-center justify-center shrink-0 ${item.color.replace('text-', 'bg-')}`}>
                    <span className={`material-symbols-outlined ${item.color} text-xl`}>{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                    <p className="text-xs text-gray-400 truncate">{item.subtitle}</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-600 text-lg">chevron_right</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};