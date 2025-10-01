import type { BaseComponentProps } from '@/types';

interface FeatureCardProps extends BaseComponentProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description, className = '' }: FeatureCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${className}`}>
      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
}