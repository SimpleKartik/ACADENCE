import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 dark:bg-gray-800 text-gray-300 dark:text-gray-400 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-white dark:text-primary-200 mb-4">Acadence</h3>
            <p className="text-sm leading-relaxed">
              The Rhythm of Smart Campus Life
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white dark:text-primary-200 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="hover:text-white dark:hover:text-primary-200 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#why-acadence" className="hover:text-white dark:hover:text-primary-200 transition-colors">
                  Why Acadence
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-white dark:hover:text-primary-200 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white dark:text-primary-200 font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white dark:hover:text-primary-200 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white dark:hover:text-primary-200 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-800 dark:border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Acadence. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
