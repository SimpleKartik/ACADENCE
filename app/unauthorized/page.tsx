'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const required = searchParams.get('required');
  const actual = searchParams.get('actual');

  const getRoleDisplay = (role: string | null) => {
    if (!role) return 'Unknown';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-200">
      <div className="max-w-md w-full bg-background-light dark:bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 text-center">
        <div className="text-6xl mb-6">🚫</div>
        <h1 className="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You don't have permission to access this page.
        </p>

        {required && actual && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>Required Role:</strong> {getRoleDisplay(required)}
            </p>
            <p className="text-sm text-red-800 dark:text-red-300 mt-1">
              <strong>Your Role:</strong> {getRoleDisplay(actual)}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/select-role"
            className="block w-full bg-primary-700 dark:bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-800 dark:hover:bg-primary-700 transition-colors"
          >
            Go to Login
          </Link>
          <button
            onClick={() => router.back()}
            className="block w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
