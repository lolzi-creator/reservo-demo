'use client';

import { useState } from 'react';
import Section from './Section';
import ElectricBorder from './ElectricBorder';
import ClickSpark from './ClickSpark';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Simple admin password - in production, this would be more secure
  const ADMIN_PASSWORD = 'reservo2024';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    if (password === ADMIN_PASSWORD) {
      // Store admin session
      sessionStorage.setItem('adminAuth', 'true');
      onLogin(true);
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
    
    setIsLoading(false);
  };

  return (
    <Section className="py-20">
      <div className="max-w-md mx-auto">
        <ElectricBorder color="#60a5fa" speed={0.1} chaos={0.3}>
          <div className="card text-center">
            {/* Lock Icon */}
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h1 className="text-3xl font-light text-white mb-4">
              Admin Access
            </h1>
            <p className="text-white/70 mb-8">
              Enter the admin password to access the reservation dashboard
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin Password"
                  className="input-field text-center text-lg tracking-wider"
                  disabled={isLoading}
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-red-400 text-sm animate-pulse">
                    {error}
                  </p>
                )}
              </div>

              <ClickSpark sparkColor="#60a5fa" sparkCount={6} sparkRadius={15}>
                <button
                  type="submit"
                  disabled={!password || isLoading}
                  className="btn-primary w-full relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </div>
                  ) : (
                    'Access Admin Panel'
                  )}
                </button>
              </ClickSpark>
            </form>

            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/60 text-xs">
                🔒 Secure admin access for reservation management
              </p>
            </div>
          </div>
        </ElectricBorder>
      </div>
    </Section>
  );
}

