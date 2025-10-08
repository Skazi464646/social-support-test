export const COMPONENTS_PAGE_CONSTANTS = {
  hero: {
    title: 'Component Showcase',
    description: 'Explore our comprehensive UI component library built with the UAE government design system',
  },
  buttons: {
    heading: 'Button Variants',
    description: 'UAE Government Design System',
    primary: {
      title: 'Solid (Primary) - Main Actions',
      labels: ['Large button', 'Base button', 'Small button', 'Extra small button'],
    },
    outline: {
      title: 'Outline (Secondary) - Alternative Actions',
      labels: ['Large button', 'Base button', 'Small button', 'Extra small button'],
    },
    ghost: {
      title: 'Soft (Ghost) - Subtle Actions',
      labels: ['Large button', 'Base button', 'Small button', 'Extra small button'],
    },
    semantic: {
      title: 'Semantic Variants',
      buttons: {
        destructive: 'Destructive',
        success: 'Success',
        warning: 'Warning',
        info: 'Info',
        link: 'Link Button',
      },
      successToast: {
        title: 'Success!',
        description: 'Action completed.',
      },
    },
    interactive: {
      title: 'Interactive Examples',
      successToast: {
        title: 'Success!',
        description: 'This is a success toast.',
      },
      errorToast: {
        title: 'Error!',
        description: 'This is an error toast.',
      },
      buttons: {
        showSuccess: 'Show Success Toast',
        showError: 'Show Error Toast',
        loading: 'Loading...',
      },
    },
  },
  formControls: {
    heading: 'Form Controls',
    description: 'Input fields and form elements',
    fields: {
      sampleInput: {
        label: 'Sample Input',
        placeholder: 'Enter some text...',
      },
      emailInput: {
        label: 'Email Input',
        placeholder: 'your@email.com',
      },
      passwordInput: {
        label: 'Password Input',
        placeholder: '••••••••',
      },
    },
  },
  progress: {
    heading: 'Progress Indicator',
    description: 'Multi-step form progress visualization',
  },
  aiComponents: {
    heading: 'AI Enhanced Components',
    description: 'Intelligent form assistance with AI-powered suggestions',
    textarea: {
      label: 'AI Enhanced Textarea',
      fieldLabel: 'Sample Field',
      placeholder: 'Start typing and click the AI button for assistance...',
    },
    input: {
      label: 'AI Enhanced Input',
      fieldLabel: 'Sample Input',
      placeholder: 'Type here and try AI assistance...',
    },
  },
  themeControls: {
    heading: 'Theme & Language Controls',
    description: 'Accessibility and internationalization options',
  },
  cards: {
    heading: 'Card Variants',
    description: 'Different card styles and layouts',
    variants: {
      default: {
        title: 'Default Card',
        description: 'This is a default card with some content and proper typography.',
      },
      accent: {
        title: 'Accent Card',
        description: 'This card has accent styling with golden theme.',
      },
      muted: {
        title: 'Muted Card',
        description: 'This card has muted background styling.',
      },
    },
  },
  developmentStatus: {
    heading: 'Development Status',
    description: 'Project progress and completed features',
    modulesHeading: 'Completed Modules:',
    modules: [
      '✅ Module 1: Project Foundation & Setup',
      '✅ Module 2: Core UI Components (Atoms & Molecules)',
      '✅ Module 3: Form Management & Validation',
      '✅ Module 4: Multi-Step Form Wizard',
      '✅ Module 5: AI Integration & Modal System',
    ],
    featuresHeading: 'Key Features:',
    features: [
      '• Real OpenAI API integration',
      '• Streaming AI responses',
      '• Rate limiting & security',
      '• Multi-language support (EN/AR)',
      '• RTL layout support',
      '• Auto-save functionality',
      '• Comprehensive form validation',
      '• Accessible design (ARIA)',
    ],
  },
  sampleUserContext: {
    step1: { fullName: 'John Doe', email: 'john@example.com' },
    step2: { employmentStatus: 'unemployed', monthlyIncome: 0 },
  },
} as const;
