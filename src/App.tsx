import { useTranslation } from 'react-i18next';
import { ThemeToggle, DirectionToggle } from './components/ui/ThemeToggle';
import { LanguageSwitcher } from './components/molecules';
import { useDirection } from './hooks';

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
}

function WelcomeSection() {
  const { t } = useTranslation();

  return (
    <div className="form-section dark:bg-gray-800 dark:border-gray-700">
      <h2 className="form-title dark:text-white">{t('welcome.title')}</h2>
      <p className="form-description dark:text-gray-300">
        {t('welcome.subtitle')}
      </p>
      <div className="space-x-4-rtl flex">
        <button className="btn-primary">Get Started</button>
        <button className="btn-secondary dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
          Learn More
        </button>
      </div>
    </div>
  );
}

function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {t('header.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('header.subtitle')}
            </p>
          </div>
          <div className="space-x-4-rtl flex items-center">
            <LanguageSwitcher />
            <ThemeToggle />
            <DirectionToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

function RTLDemo() {
  return (
    <div className="form-section dark:bg-gray-800 dark:border-gray-700">
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

function App() {
  useDirection(); // Initialize direction management

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <WelcomeSection />
          <RTLDemo />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Dark Mode Support"
              description="Automatic dark mode with user preference detection and manual toggle"
            />
            <FeatureCard
              title="RTL Layout Ready"
              description="Full right-to-left layout support for Arabic and other RTL languages"
            />
            <FeatureCard
              title="Accessibility First"
              description="WCAG 2.1 AA compliant with skip links, focus management, and screen reader support"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
