'use client';

import Link from 'next/link';
import LogoBackground from '@/components/LogoBackground';

const roles = [
  {
    id: 'student',
    title: 'Student',
    icon: '🎓',
    description: 'Access your attendance, timetable, library, and messages',
    route: '/login/student',
    color: 'from-blue-500 to-blue-600',
    hoverColor: 'hover:from-blue-600 hover:to-blue-700',
  },
  {
    id: 'teacher',
    title: 'Teacher',
    icon: '👨‍🏫',
    description: 'Manage classes, attendance, announcements, and student communication',
    route: '/login/teacher',
    color: 'from-purple-500 to-purple-600',
    hoverColor: 'hover:from-purple-600 hover:to-purple-700',
  },
  {
    id: 'admin',
    title: 'Admin',
    icon: '🛠',
    description: 'System administration and institutional management',
    route: '/login/admin',
    color: 'from-indigo-500 to-indigo-600',
    hoverColor: 'hover:from-indigo-600 hover:to-indigo-700',
  },
];

export default function SelectRolePage() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-200">
      <LogoBackground opacity={5} />
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          <Link href="/" className="text-3xl font-bold text-primary-800 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-200 transition-colors inline-block mb-4">
            Acadence
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Select Your Role
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Choose your role to continue to login
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Link
              key={role.id}
              href={role.route}
              className="group relative bg-background-light dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-8 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {role.icon}
                </div>
                <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-3">
                  {role.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {role.description}
                </p>
                <div className="mt-6">
                  <span className={`inline-block bg-gradient-to-r ${role.color} ${role.hoverColor} text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300`}>
                    Continue →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
