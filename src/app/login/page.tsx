'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/globals.css';

/**
 * Professional Login Page - Clean, Modern Design
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const usersStr = localStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (!user) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', user.id);
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('user_name', user.name);

      window.location.href = '/dashboard';
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fade-in" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      backgroundColor: '#f9fafb',
    }}>
      {/* Login Card */}
      <div className="card slide-up login-card" style={{
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 1rem',
            backgroundColor: '#2563eb',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}>
            📋
          </div>
          <h1 style={{
            fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#111827',
          }}>
            Welcome back
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem',
          }}>
            Sign in to your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error" style={{
            marginBottom: '1.5rem',
            fontSize: '0.8125rem',
          }}>
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginTop: '0.5rem',
            }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: '16px', height: '16px' }} />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider" style={{ margin: '1.5rem 0' }} />

        {/* Sign Up Link */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#6b7280',
        }}>
          Don't have an account?{' '}
          <a href="/signup" style={{
            color: '#2563eb',
            fontWeight: '500',
          }}>
            Create account
          </a>
        </p>

        {/* Footer */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#9ca3af',
        }}>
          <p>🔒 Secure authentication</p>
        </div>
      </div>
    </div>
  );
}
