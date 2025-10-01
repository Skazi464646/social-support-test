import { Header, WelcomeSection, RTLDemo } from '@/components/organisms';
import { FeatureCard } from '@/components/molecules';
import { useDirection } from '@/hooks';

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
