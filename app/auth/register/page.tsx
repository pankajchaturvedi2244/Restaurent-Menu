'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1: User info
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');

  // Step 2: Verification
  const [verificationCode, setVerificationCode] = useState('');

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName, country }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError('An account with this email already exists. Please log in.');
          return;
        }
        setError(data.error || 'Registration failed');
        return;
      }

      setSuccess('Verification code sent to your email!');
      setStep(2);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Verification failed');
        return;
      }

      setSuccess('Email verified! Redirecting to dashboard...');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      setError('Verification failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🍽️</div>
            <h1 className="text-3xl font-bold text-gray-900">
              Digital Menu
            </h1>
            <p className="text-gray-600 mt-2">
              {step === 1 ? 'Create your restaurant account' : 'Verify your email'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-600 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👤 Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🌍 Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition"
                  placeholder="United States"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-700 disabled:opacity-50 transition"
              >
                {loading ? 'Sending...' : 'Continue →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ✉️ Verification Code
                </label>
                <p className="text-gray-600 text-sm mb-4">
                  Enter the code we sent to <span className="font-semibold">{email}</span>
                </p>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition text-center text-3xl tracking-widest font-bold"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition"
              >
                {loading ? 'Verifying...' : 'Verify & Continue →'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setVerificationCode('');
                }}
                className="w-full text-pink-600 py-3 rounded-lg font-semibold hover:bg-pink-50 transition"
              >
                ← Back to Step 1
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-pink-600 font-semibold hover:underline">
              Sign in here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
