function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function WelcomeSection() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Welcome to the Portal</h2>
      <p className="text-gray-600 mb-6">
        This application uses Tailwind CSS with a complete design system
        including dark mode support, RTL layout capabilities, and accessibility
        features.
      </p>
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Get Started
        </button>
        <button className="bg-gray-100 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
          Learn More
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Social Support Portal
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Government-grade financial assistance application with AI assistance
          </p>

          <WelcomeSection />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Responsive Design"
              description="Mobile-first responsive grid system"
            />
            <FeatureCard
              title="Accessibility"
              description="WCAG 2.1 AA compliant components"
            />
            <FeatureCard
              title="RTL Support"
              description="Right-to-left layout ready"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
