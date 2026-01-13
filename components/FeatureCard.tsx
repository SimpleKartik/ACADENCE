import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-background-light dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 h-full transform hover:-translate-y-1">
      <div className="flex flex-col items-start">
        <div className="text-primary-700 dark:text-primary-400 mb-4 text-4xl">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
          {title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
