'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    // Redirect if already authenticated
    const checkAuth = async () => {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        router.push('/dashboard');
      }
    };
    checkAuth();
  }, [router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName: email.split('@')[0],
          country: 'Not Set',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send code');
      }

      setShowVerifyForm(true);
      setMessage('Verification code sent to your email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Verification failed');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 py-12">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🍽️</div>
          <h1 className="text-3xl font-bold text-gray-900">Digital Menu</h1>
          <p className="text-gray-600 mt-2">Sign in to manage your restaurant</p>
        </div>

        {!showVerifyForm ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">📧 Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition"
                placeholder="your@email.com"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="p-4 bg-green-100 border-l-4 border-green-600 text-green-700 rounded-lg text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-700 disabled:opacity-50 transition"
            >
              {loading ? 'Sending...' : 'Send Verification Code →'}
            </button>

            <p className="text-center text-sm text-gray-600">
              New user?{' '}
              <a href="/auth/register" className="text-pink-600 font-semibold hover:underline">
                Create an account →
              </a>
            </p>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <p className="text-gray-600 text-sm">
              Verification code sent to <strong className="text-gray-900">{email}</strong>
            </p>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">✉️ Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition text-center text-3xl tracking-widest font-bold"
                maxLength={6}
                placeholder="000000"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In →'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowVerifyForm(false);
                setCode('');
                setError('');
              }}
              className="w-full text-pink-600 py-3 rounded-lg font-semibold hover:bg-pink-50 transition"
            >
              ← Back to Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
