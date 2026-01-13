export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-background-light dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-6">
            About Acadence
          </h2>
          <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Acadence is a comprehensive campus management platform designed to streamline academic operations
              and enhance institutional efficiency. Our platform brings together unified academic workflows,
              enabling seamless coordination across all aspects of campus life.
            </p>
            <p>
              Built with role-based secure access, Acadence ensures that students, teachers, and administrators
              have appropriate permissions and access to the tools they need. The platform is designed for modern
              institutions seeking to reduce manual work, improve communication, and maintain real-time visibility
              into campus operations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
