import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-lg border-t border-subtle-light/50 dark:border-subtle-dark/50 z-50">
      <div className="flex h-full justify-around items-start pt-3">
        <button 
          onClick={() => navigate(AppRoute.DASHBOARD)}
          className={`flex flex-col items-center gap-1 w-20 ${isActive(AppRoute.DASHBOARD) ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <span className={`material-symbols-outlined text-[28px] ${isActive(AppRoute.DASHBOARD) ? 'material-symbols-filled' : ''}`}>home</span>
          <span className="text-[11px] font-medium">Inicio</span>
        </button>

        <button 
          onClick={() => navigate(AppRoute.CHAT)}
          className={`flex flex-col items-center gap-1 w-20 ${isActive(AppRoute.CHAT) ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <span className={`material-symbols-outlined text-[28px] ${isActive(AppRoute.CHAT) ? 'material-symbols-filled' : ''}`}>smart_toy</span>
          <span className="text-[11px] font-medium">Asesor IA</span>
        </button>

        <button 
          onClick={() => navigate(AppRoute.HISTORY)}
          className={`flex flex-col items-center gap-1 w-20 ${isActive(AppRoute.HISTORY) ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <span className={`material-symbols-outlined text-[28px] ${isActive(AppRoute.HISTORY) ? 'material-symbols-filled' : ''}`}>history</span>
          <span className="text-[11px] font-medium">Historial</span>
        </button>
      </div>
    </nav>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const showNav = [AppRoute.DASHBOARD, AppRoute.HISTORY].includes(location.pathname as AppRoute);

  // Chat has its own specific input bar, but usually bottom nav is hidden on chat to make space for keyboard
  // However, mockups might vary. The dashboard mockup shows bottom nav. 
  // The Chat mockup shows a mic button and input, effectively replacing the nav.
  
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white flex flex-col">
      <div className={`flex-1 ${showNav ? 'pb-24' : ''}`}>
        {children}
      </div>
      {showNav && <BottomNav />}
    </div>
  );
};