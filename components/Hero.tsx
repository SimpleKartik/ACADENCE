import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-primary-50 to-background dark:from-gray-800 dark:to-gray-900 py-20 md:py-32 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 dark:text-primary-100 mb-6 text-balance">
            Acadence — The Rhythm of Smart Campus Life
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 text-balance leading-relaxed">
            Centralized platform for attendance, scheduling, communication, and academic operations.
          </p>
          <Link
            href="/select-role"
            className="inline-block bg-primary-700 dark:bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-800 dark:hover:bg-primary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Login to Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
