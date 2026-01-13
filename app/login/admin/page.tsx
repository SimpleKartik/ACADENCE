'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import LogoBackground from '@/components/LogoBackground';

export default function AdminLoginPage() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(adminId, password, 'admin');
      if (success) {
        router.push('/dashboard/admin');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-background to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-200">
      <LogoBackground opacity={7} />
      <div className="max-w-md w-full bg-background-light dark:bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 relative z-10 backdrop-blur-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary-800 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-200 transition-colors inline-block mb-4">
            Acadence
          </Link>
          <div className="text-5xl mb-4">🛠</div>
          <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-2">
            Login as Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            System administration access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="adminId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Admin ID
            </label>
            <input
              type="text"
              id="adminId"
              name="adminId"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 outline-none transition-all duration-200 shadow-sm focus:shadow-md"
              placeholder="ADMIN001"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 outline-none transition-all duration-200 shadow-sm focus:shadow-md"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/select-role"
            className="text-sm text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
          >
            ← Back to Role Selection
          </Link>
        </div>
      </div>
    </div>
  );
}
