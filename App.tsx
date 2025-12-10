import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { History } from './pages/History';
import { Plans } from './pages/Plans';
import { PdfViewer } from './pages/PdfViewer';
import { AppRoute } from './types';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path={AppRoute.SPLASH} element={<Splash />} />
          <Route path={AppRoute.LOGIN} element={<Login />} />
          <Route path={AppRoute.REGISTER} element={<Register />} />

          {/* Protected Pages with Bottom Navigation */}
          <Route
            path={AppRoute.DASHBOARD}
            element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={AppRoute.HISTORY}
            element={
              <ProtectedRoute>
                <Layout><History /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Protected Pages without Bottom Navigation */}
          <Route
            path={AppRoute.CHAT}
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path={AppRoute.PLANS}
            element={
              <ProtectedRoute>
                <Plans />
              </ProtectedRoute>
            }
          />
          <Route
            path={AppRoute.PDF_VIEWER}
            element={
              <ProtectedRoute>
                <PdfViewer />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={AppRoute.SPLASH} replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;