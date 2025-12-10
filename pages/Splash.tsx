import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';

export const Splash: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setTimeout(() => navigate(AppRoute.LOGIN), 500);
          return 100;
        }
        const diff = Math.random() * 20;
        return Math.min(oldProgress + diff, 100);
      });
    }, 300);

    return () => {
      clearInterval(timer);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen w-full bg-background-light dark:bg-background-light items-center justify-between py-12 px-6">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="w-64 h-64 bg-center bg-no-repeat bg-contain mb-8 animate-pulse" 
             style={{ backgroundImage: 'url("https://cdn-icons-png.flaticon.com/512/2502/2502123.png")' }}>
           {/* Placeholder for cartoon police officer, using a generic icon if url fails or just the style */}
        </div>
        
        <h1 className="text-gray-900 text-4xl font-extrabold tracking-tight mb-2">PolicIA</h1>
        <p className="text-gray-500 text-lg">Asistencia legal a su alcance.</p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <div className="flex justify-between text-sm font-medium text-gray-700">
          <span>Cargando recursos...</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};