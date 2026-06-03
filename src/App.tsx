import React, { useState, useEffect } from 'react';
import { PublicPortal } from './pages/PublicPortal';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
// Imports cleaned up for demo delivery
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

type PageType = 'portal' | 'login' | 'dashboard';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const App: React.FC = () => {
  // Navigation / Auth States
  const [currentPage, setCurrentPage] = useState<PageType>('portal');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Theme states
  const [isLightTheme, setIsLightTheme] = useState(false);

  // API mode state initialized in local storage instead of component state for demo.

  // Toast System
  const [toasts, setToasts] = useState<Toast[]>([]);

  // System-wide notification trigger
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto remove after 3.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Synchronize Session on boot
  useEffect(() => {
    const token = sessionStorage.getItem('epustaka_token');
    const user = sessionStorage.getItem('epustaka_user');
    
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      setCurrentPage('dashboard');
    }

    // Set dark theme by default (dark theme is root default in CSS)
    document.body.className = isLightTheme ? 'light-theme' : '';
  }, [isLightTheme]);

  // Auth Expired handler (Fires when Axios client intercepts a 401 response)
  useEffect(() => {
    const handleAuthExpired = () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setCurrentPage('login');
      addToast('error', 'Sesi login Anda telah kedaluwarsa. Silakan masuk kembali.');
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  const handleLoginSuccess = (username: string, _token: string) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
    setCurrentPage('dashboard');
    addToast('success', `Selamat datang kembali, Petugas ${username}!`);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('epustaka_token');
    sessionStorage.removeItem('epustaka_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('portal');
    addToast('info', 'Sesi login Anda berhasil diakhiri.');
  };

  // toggleApiMode commented out for demo delivery to prevent TS unused variable warnings.
  // const toggleApiMode = () => { ... }

  return (
    <div>
      {/* View Router */}
      {currentPage === 'portal' && (
        <PublicPortal
          onNavigateToLogin={() => {
            if (isAuthenticated) {
              setCurrentPage('dashboard');
            } else {
              setCurrentPage('login');
            }
          }}
          isLightTheme={isLightTheme}
          onToggleTheme={() => setIsLightTheme(!isLightTheme)}
        />
      )}

      {currentPage === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onNavigateHome={() => setCurrentPage('portal')}
        />
      )}

      {currentPage === 'dashboard' && isAuthenticated && (
        <Dashboard
          username={currentUser || 'Petugas'}
          onLogout={handleLogout}
          isLightTheme={isLightTheme}
          onToggleTheme={() => setIsLightTheme(!isLightTheme)}
          showNotification={addToast}
        />
      )}



      {/* Dynamic Toast Notifications System */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`toast toast-${toast.type}`}
          >
            {toast.type === 'success' && <CheckCircle size={18} />}
            {toast.type === 'error' && <AlertCircle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
