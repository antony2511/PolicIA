import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PdfViewer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-background-dark text-white">
      <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-background-dark sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-800">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="font-bold text-lg">Informe Policial</h1>
        <button className="p-2 rounded-full hover:bg-gray-800">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 bg-gray-900/50">
        <div className="w-full h-full max-w-lg bg-surface-light rounded shadow-2xl flex flex-col items-center justify-center text-gray-800 relative overflow-hidden">
           {/* Mock PDF Content */}
           <div className="p-8 text-center space-y-4 opacity-50">
             <span className="material-symbols-outlined text-6xl text-gray-300">picture_as_pdf</span>
             <p>Visualización del documento simulada.</p>
             <div className="w-full h-2 bg-gray-200 rounded"></div>
             <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
             <div className="w-full h-2 bg-gray-200 rounded"></div>
             <div className="w-5/6 h-2 bg-gray-200 rounded"></div>
           </div>
        </div>
      </main>

      <footer className="bg-background-dark border-t border-gray-800 p-4 pb-6">
        <div className="text-center text-sm text-gray-400 mb-4">Página 1 de 3</div>
        <div className="flex justify-around items-center">
            {['navigate_before', 'navigate_next', 'zoom_in', 'zoom_out', 'share'].map((icon, idx) => (
                <button key={idx} className="flex flex-col items-center gap-1 group">
                    <div className="h-10 w-10 rounded-full bg-gray-800 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                        <span className={`material-symbols-outlined text-xl ${icon === 'share' ? 'text-primary' : 'text-gray-300'} group-hover:text-primary`}>
                            {icon}
                        </span>
                    </div>
                </button>
            ))}
        </div>
      </footer>
    </div>
  );
};