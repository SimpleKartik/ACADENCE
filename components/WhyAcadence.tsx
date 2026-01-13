const benefits = [
  {
    title: 'Centralized Operations',
    description: 'All campus operations in one unified platform, eliminating the need for multiple disconnected systems.',
  },
  {
    title: 'Reduced Manual Work',
    description: 'Automate routine tasks and workflows, freeing up time for more important academic activities.',
  },
  {
    title: 'Real-time Updates',
    description: 'Stay informed with instant notifications and live updates across all modules and services.',
  },
  {
    title: 'Secure & Scalable',
    description: 'Enterprise-grade security with role-based access control, built to scale with your institution.',
  },
];

export default function WhyAcadence() {
  return (
    <section id="why-acadence" className="py-16 md:py-24 bg-background-light dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Why Acadence?
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Built for institutions that value efficiency and excellence
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-background dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
