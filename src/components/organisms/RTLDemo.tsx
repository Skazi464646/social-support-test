import type { BaseComponentProps } from '@/types';

interface RTLDemoProps extends BaseComponentProps {}

export function RTLDemo({ className = '' }: RTLDemoProps) {
  return (
    <div className={`form-section dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <h3 className="form-title dark:text-white">RTL Layout Demo</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-900 dark:text-white">
            English Text (LTR)
          </span>
          <span className="text-blue-600 dark:text-blue-400">→</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-900 dark:text-white">
            نص عربي (يمين إلى يسار)
          </span>
          <span className="text-blue-600 dark:text-blue-400">←</span>
        </div>
        <div className="form-grid">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name / الاسم الكامل
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your name / أدخل اسمك"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              National ID / الهوية الوطنية
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="1234567890"
            />
          </div>
        </div>
      </div>
    </div>
  );
}