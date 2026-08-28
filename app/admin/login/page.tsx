'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

function AdminLoginForm() {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin/pricing';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase }),
      });

      if (res.ok) {
        router.push(redirect);
      } else {
        const data = await res.json();
        setError(data.error || 'Authentication failed.');
      }
    } catch {
      setError('Network error. Please try again.');
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
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #c9a96e, #b8860b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(201,169,110,0.3)',
          }}>
            <Shield size={32} color="#0a0a0a" />
          </div>
          <h1 style={{
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: 700,
            margin: '0 0 8px 0',
          }}>
            Admin Access
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '14px',
            margin: 0,
          }}>
            Enter your passphrase to access the admin dashboard
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px',
            marginBottom: '20px',
          }}>
            <AlertTriangle size={16} color="#ef4444" />
            <span style={{ color: '#ef4444', fontSize: '14px' }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <Lock
              size={18}
              color="rgba(255,255,255,0.3)"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              id="admin-passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter passphrase"
              autoFocus
              required
              style={{
                width: '100%',
                padding: '14px 14px 14px 44px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !passphrase}
            style={{
              width: '100%',
              padding: '14px',
              background: loading
                ? 'rgba(201,169,110,0.4)'
                : 'linear-gradient(135deg, #c9a96e, #b8860b)',
              border: 'none',
              borderRadius: '10px',
              color: '#0a0a0a',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: !passphrase ? 0.5 : 1,
            }}
          >
            {loading ? 'Authenticating...' : 'Unlock Dashboard'}
          </button>
        </form>

        <p style={{
          color: 'rgba(255,255,255,0.25)',
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '24px',
        }}>
          SK Limousine — Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        Loading...
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
