export const HOME_PAGE_FALLBACKS = {
  hero: {
    title: 'Social Support Portal',
    description: 'Apply for financial assistance through our secure, AI-enhanced portal. Get intelligent writing assistance and guidance throughout your application process.',
    startApplication: 'Start Application',
    viewComponents: 'View Components',
  },
  featuresSection: {
    title: 'Why Choose Our Portal?',
    items: {
      aiAssistance: {
        title: 'AI-Powered Writing Assistance',
        description: 'Get intelligent suggestions to help you complete your application with confidence.',
      },
      multilingual: {
        title: 'Multilingual Support',
        description: 'Available in English and Arabic with full RTL support.',
      },
      secure: {
        title: 'Secure & Private',
        description: 'Your data is protected with enterprise-grade security measures.',
      },
      autoSave: {
        title: 'Auto-Save Progress',
        description: 'Never lose your progress with automatic form saving.',
      },
      accessible: {
        title: 'Accessible Design',
        description: 'Built with accessibility standards for all users.',
      },
      guided: {
        title: 'Guided Process',
        description: 'Step-by-step wizard to guide you through the application.',
      },
    },
  },
  cta: {
    title: 'Ready to Apply?',
    description: 'Start your application today with our AI-powered assistance to help you every step of the way.',
    button: 'Begin Application',
  },
  devInfo: {
    title: 'Development Information',
    items: [
      '• All 5 modules completed successfully',
      '• Real OpenAI integration with streaming & security',
      '• Multi-step form with React Hook Form + Zod validation',
      '• Complete i18n support with Arabic RTL',
      '• Accessible design with ARIA attributes',
      '• Auto-save functionality with localStorage',
    ],
  },
} as const;
