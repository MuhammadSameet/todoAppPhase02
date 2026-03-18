'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/globals.css';

/**
 * Professional Signup Page - Clean, Modern Design
 * Functionality: Exactly as per constitution
 */
export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Validation - as per constitution
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const usersStr = localStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      const existingUser = users.find((u: any) => u.email === email);

      if (existingUser) {
        setError('Email already registered. Please login instead.');
        setLoading(false);
        return;
      }

      // Create user - as per constitution
      const userId = 'user_' + Date.now().toString();
      const newUser = {
        id: userId,
        email: email,
        password: password,
        name: name,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('token', userId);
      localStorage.setItem('user_id', userId);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_name', name);

      window.location.href = '/dashboard';
    } catch (err) {
      setError('Signup failed. Please try again.');
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
      {/* Signup Card */}
      <div className="card slide-up signup-card" style={{
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
            ✍️
          </div>
          <h1 style={{
            fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#111827',
          }}>
            Create account
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem',
          }}>
            Start managing your tasks
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

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
            }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              style={{
                width: '100%',
                fontSize: '0.875rem',
              }}
            />
          </div>

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
          <div style={{ marginBottom: '1.25rem' }}>
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
              placeholder="Min 8 characters"
              required
              minLength={8}
              style={{
                width: '100%',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength={8}
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
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider" style={{ margin: '1.5rem 0' }} />

        {/* Login Link */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#6b7280',
        }}>
          Already have an account?{' '}
          <a href="/login" style={{
            color: '#2563eb',
            fontWeight: '500',
          }}>
            Sign in
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
