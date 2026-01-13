import FeatureCard from './FeatureCard';

// Icons using simple emoji/unicode for now (can be replaced with icon library)
const features = [
  {
    icon: '🔐',
    title: 'Role-Based Secure Access',
    description: 'Granular permissions ensure students, teachers, and admins access only what they need, maintaining security and data integrity.',
  },
  {
    icon: '📱',
    title: 'QR-Based Attendance',
    description: 'Quick and accurate attendance tracking using QR codes, eliminating manual roll calls and reducing errors.',
  },
  {
    icon: '📊',
    title: 'Attendance Analytics',
    description: 'Comprehensive analytics and reports to track attendance patterns, identify trends, and support data-driven decisions.',
  },
  {
    icon: '📢',
    title: 'Broadcast Announcements',
    description: 'Send announcements instantly via in-app notifications and email, ensuring important information reaches everyone on time.',
  },
  {
    icon: '📅',
    title: 'Live Timetable Management',
    description: 'Real-time timetable updates with instant notifications for schedule changes, room assignments, and class modifications.',
  },
  {
    icon: '📚',
    title: 'Library Services',
    description: 'Track issued and returned books with automated due date counters, reminders, and fine management.',
  },
  {
    icon: '💬',
    title: 'Student–Teacher Messaging',
    description: 'Direct communication channel between students and teachers for queries, assignments, and academic discussions.',
  },
  {
    icon: '🚪',
    title: 'Faculty Cabin Status',
    description: 'Real-time visibility into faculty availability with status indicators: Available, Busy, or Offline.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-background dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Features
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to manage your campus efficiently
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
