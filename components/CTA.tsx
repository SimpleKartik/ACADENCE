import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-16 md:py-24 bg-primary-800 dark:bg-gray-800 text-white transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
          Ready to experience a smarter campus?
        </h2>
        <Link
          href="/select-role"
          className="inline-block bg-white dark:bg-gray-700 text-primary-800 dark:text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800 dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Login to Acadence
        </Link>
      </div>
    </section>
  );
}
