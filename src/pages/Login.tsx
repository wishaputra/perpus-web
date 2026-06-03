import React, { useState } from 'react';
import { KeyRound, User, Lock, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { apiService } from '../api/service';
import { Input } from '../components/FormFields';

interface LoginProps {
  onLoginSuccess: (username: string, token: string) => void;
  onNavigateHome: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  onNavigateHome
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!username.trim()) {
      setError('Username wajib diisi');
      return;
    }
    if (!password.trim()) {
      setError('Password wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.login(username, password);
      if (!res.error) {
        // Save to session storage
        sessionStorage.setItem('epustaka_token', res.data.token);
        sessionStorage.setItem('epustaka_user', res.data.username);
        
        // Notify parent
        onLoginSuccess(res.data.username, res.data.token);
      } else {
        setError(res.msg || 'Terjadi kesalahan sistem.');
      }
    } catch (err: any) {
      setError(err.message || 'Username atau password salah!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative'
    }}>
      {/* Back button */}
      <button 
        onClick={onNavigateHome}
        className="btn btn-secondary"
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          padding: '8px 16px',
          fontSize: '0.85rem'
        }}
      >
        <ArrowLeft size={16} />
        Kembali ke Katalog
      </button>

      {/* Login Card */}
      <div 
        className="glass-panel animate-scale"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '6px',
          border: '2px solid var(--border-card)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ 
            background: 'var(--text-primary)', 
            padding: '12px', 
            borderRadius: '6px', 
            color: 'var(--bg-app)',
            border: '2px solid var(--text-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <KeyRound size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-title)', fontWeight: 900, letterSpacing: '-0.04em' }}>
            Librarian Area
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Masuk untuk mengakses Dashboard Perpustakaan
          </p>
        </div>

        {/* Credentials Info Alert Box */}
        <div style={{
          background: 'var(--color-info-bg)',
          border: '2px solid var(--color-info-border)',
          borderRadius: '6px',
          padding: '12px 16px',
          marginBottom: '20px',
          fontSize: '0.825rem',
          color: 'var(--color-info-text)',
          display: 'flex',
          gap: '10px'
        }}>
          <AlertCircle size={16} style={{ color: 'var(--color-info-text)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--color-info-text)', display: 'block', marginBottom: '2px' }}>
              Petunjuk Demo & Reviewer:
            </strong>
            Gunakan akun bawaan dari data seeder: <br />
            Username: <code style={{ color: 'var(--color-info-text)', fontWeight: 700 }}>admin</code> <br />
            Password: <code style={{ color: 'var(--color-info-text)', fontWeight: 700 }}>admin</code>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{
            background: 'var(--color-danger-bg)',
            border: '2px solid var(--color-danger-border)',
            color: 'var(--color-danger-text)',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative' }}>
            <Input
              label="Username"
              type="text"
              placeholder="Masukkan username anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              style={{ paddingLeft: '44px' }}
            />
            <User 
              size={16} 
              style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '42px', 
                color: 'var(--text-secondary)' 
              }} 
            />
          </div>

          <div style={{ position: 'relative', marginTop: '8px' }}>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{ paddingLeft: '44px' }}
            />
            <Lock 
              size={16} 
              style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '42px', 
                color: 'var(--text-secondary)' 
              }} 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '16px' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spinner" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>
      </div>
      
      {/* Spinner rotation styles */}
      <style>{`
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
