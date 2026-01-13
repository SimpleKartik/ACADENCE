'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background-light dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary-800 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-200 transition-colors">
              Acadence
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="#features"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-800 dark:hover:text-primary-300 transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="#why-acadence"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-800 dark:hover:text-primary-300 transition-colors font-medium"
            >
              Why Acadence
            </Link>
            <Link
              href="#about"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-800 dark:hover:text-primary-300 transition-colors font-medium"
            >
              About
            </Link>
            <ThemeToggle />
            <Link
              href="/select-role"
              className="bg-primary-700 dark:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-800 dark:hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-800 dark:hover:text-primary-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
              aria-label="Toggle menu"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background-light dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="#features"
            className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-800 dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#why-acadence"
            className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-800 dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Why Acadence
          </Link>
          <Link
            href="#about"
            className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-800 dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/select-role"
            className="block px-3 py-2 bg-primary-700 dark:bg-primary-600 text-white rounded-md font-medium hover:bg-primary-800 dark:hover:bg-primary-700 text-center transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
