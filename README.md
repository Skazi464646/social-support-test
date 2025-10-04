# Social Support Portal

> A government-grade financial assistance application with AI-powered writing assistance. Built with React, TypeScript, and modern web technologies.

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Building](#-building)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Functionality
- **Multi-Step Form Wizard**: 3-step application process with validation
- **AI Writing Assistance**: OpenAI GPT integration for text field suggestions
- **Form Persistence**: Auto-save to localStorage every 30 seconds
- **Bilingual Support**: Full English and Arabic support with RTL
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation

### Technical Features
- ⚡ **Lightning Fast**: Built with Vite for optimal performance
- 🎨 **Modern UI**: shadcn/ui components with Tailwind CSS
- 🔒 **Type-Safe**: Strict TypeScript with Zod validation
- ♿ **Accessible**: Screen reader friendly with ARIA support
- 🌍 **i18n Ready**: react-i18next for internationalization
- 🧪 **Well Tested**: Comprehensive test coverage with Vitest

## 🎯 Demo

[Insert screenshots or GIF demo here]

### Step 1: Personal Information
![Step 1 Screenshot](docs/screenshots/step1.png)

### Step 2: Family & Financial Info
![Step 2 Screenshot](docs/screenshots/step2.png)

### Step 3: AI-Assisted Writing
![Step 3 Screenshot](docs/screenshots/step3.png)

## 🛠 Tech Stack

### Frontend Framework
- **React 18.3+** - UI library with concurrent features
- **TypeScript 5.x** - Type-safe JavaScript
- **Vite 5.x** - Next-generation build tool

### UI & Styling
- **shadcn/ui** - Re-usable components built with Radix UI
- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Form Management
- **React Hook Form 7.x** - Performant form library
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Validation resolvers

### State Management
- **Context API** - Built-in React state management

### API & Data
- **Axios 1.6+** - HTTP client with interceptors
- **OpenAI API** - GPT-3.5 Turbo for text generation

### Internationalization
- **react-i18next** - React integration
- **i18next** - i18n framework
- **i18next-browser-languagedetector** - Auto language detection

### Testing
- **Vitest** - Vite-native unit testing
- **React Testing Library** - Component testing

### Code Quality
- **ESLint** - Linting with TypeScript support
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting

## 🏗 Architecture // move 

### Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        User Entry Point                      │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Landing / Language Select                 │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Form Wizard Container                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            FormWizardContext (State)                  │  │
│  │  - Current Step                                       │  │
│  │  - Form Data (Step 1, 2, 3)                          │  │
│  │  - Navigation Functions                              │  │
│  │  - Validation State                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Progress Bar Component                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  Current Step View                    │  │
│  │                                                        │  │
│  │  Step 1: Personal Info    (No AI)                    │  │
│  │  Step 2: Financial Info   (No AI)                    │  │
│  │  Step 3: Descriptions     (AI Assisted)              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Navigation Buttons                         │  │
│  │           [Back]  [Save]  [Next]                     │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Review & Submit                           │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Confirmation Page                         │
└─────────────────────────────────────────────────────────────┘
```

### AI Assistance Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 Step 3: Situation Descriptions               │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │  Textarea: Financial Situation                 │         │
│  │  [Help Me Write] ◄─── User clicks             │         │
│  └────────────────────────────────────────────────┘         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI Assist Modal Opens                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🔄 Generating suggestion...                         │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────┐    │  │
│  │  │  1. Build context from user data             │    │  │
│  │  │  2. Create prompt with instructions          │    │  │
│  │  │  3. Call OpenAI API (with retry logic)       │    │  │
│  │  │  4. Parse and display response               │    │  │
│  │  └──────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Suggestion Displayed                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Generated Text:                                      │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │ "I am currently facing financial challenges     │ │  │
│  │  │  due to unexpected medical expenses that have   │ │  │
│  │  │  exceeded my monthly income..."                 │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │  [Accept]  [Edit]  [Discard]  [Regenerate]          │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┬─────────────┐
              │             │             │             │
              ▼             ▼             ▼             ▼
          Accept         Edit        Discard      Regenerate
              │             │             │             │
              │             ▼             │             │
              │      ┌──────────┐         │             │
              │      │  Modify  │         │             │
              │      │   Text   │         │             │
              │      └─────┬────┘         │             │
              │            │              │             │
              ▼            ▼              ▼             │
      ┌──────────────────────────────────────┐         │
      │    Populate Original Textarea        │         │
      │         Close Modal                  │◄────────┘
      └──────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── I18nProvider
│   └── ThemeProvider
│       └── FormWizardProvider
│           └── FormWizardLayout
│               ├── Header
│               │   └── LanguageToggle
│               ├── ProgressBar
│               ├── StepContent
│               │   ├── FormStep1 (Personal Info)
│               │   │   ├── FormField (Name)
│               │   │   ├── FormField (Email)
│               │   │   ├── FormField (Phone)
│               │   │   └── ...
│               │   ├── FormStep2 (Financial Info)
│               │   │   ├── FormField (Marital Status)
│               │   │   ├── FormField (Income)
│               │   │   └── ...
│               │   └── FormStep3 (AI-Assisted)
│               │       ├── AITextarea (Financial Situation)
│               │       │   └── AIAssistButton
│               │       ├── AITextarea (Employment)
│               │       │   └── AIAssistButton
│               │       └── AITextarea (Reason)
│               │           └── AIAssistButton
│               └── Navigation
│                   ├── BackButton
│                   ├── SaveButton
│                   └── NextButton
│
└── AIAssistModal (Portal)
    ├── LoadingState
    ├── SuggestionDisplay
    ├── EditMode
    ├── ErrorDisplay
    └── ActionButtons
```

### Data Flow

```
┌────────────────────────────────────────────────────────────┐
│                         User Input                          │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│                    React Hook Form                          │
│                   (Field Registration)                      │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│                      Zod Validation                         │
│                   (Schema Validation)                       │
└────────────────────────────┬───────────────────────────────┘
                             │
                      ┌──────┴──────┐
                      │             │
                Valid │             │ Invalid
                      │             │
                      ▼             ▼
              ┌──────────┐    ┌──────────┐
              │  Update  │    │  Display │
              │  Context │    │  Errors  │
              └─────┬────┘    └──────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │  FormWizardContext   │
        │   (Application State) │
        └──────────┬────────────┘
                   │
          ┌────────┼────────┐
          │                 │
          ▼                 ▼
    ┌──────────┐      ┌──────────┐
    │ localStorage│    │ Step     │
    │ (Auto-save)│     │ Components│
    └──────────┘      └──────────┘
```

### API Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      React Component                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Custom Hook Layer                         │
│                  (useAIAssist, useSubmit)                    │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
│              (openAIService, formService)                    │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Axios Client                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Request Interceptor                                  │  │
│  │  - Add headers                                        │  │
│  │  - Add request ID                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Response Interceptor                                 │  │
│  │  - Error handling                                     │  │
│  │  - Retry logic                                        │  │
│  │  - Response normalization                             │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │                             │
              ▼                             ▼
    ┌──────────────────┐        ┌──────────────────┐
    │  OpenAI API      │        │  Mock SW API     │
    │  (GPT-3.5 Turbo) │        │  (Form Submit)   │
    └──────────────────┘        └──────────────────┘
```

### Form Submission Api Architecure
```
  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
  │   FormWizard    │───▶│  Axios Service   │───▶│  Mock Service Worker│
  │                 │    │  + Interceptors  │    │  (MSW)              │
  └─────────────────┘    └──────────────────┘    └─────────────────────┘
           │                       │                       │
           ▼                       ▼                       ▼
  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
  │ Success Modal   │    │ Error Handling   │    │  Generated App ID   │
  │ - Start New     │    │ - 404 Not Found  │    │  APP-2024-XXXXX     │
  │ - Continue      │    │ - 500 Server Err │    └─────────────────────┘
  └─────────────────┘    │ - Network Errors │
                         └──────────────────┘

```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)

```bash
# Check your versions
node --version
npm --version
```

### Quick Start

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
VITE_OPENAI_API_KEY=sk-proj-your-key-here
VITE_AI_ENABLED=true
```

Get your OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)

3. **Start the development server**

```bash
npm run dev
```

4. **Test the application**

Navigate to [http://localhost:5173](http://localhost:5173)

### 🎯 Testing the Full Application

Once the dev server is running, you can test all features:

**1. Navigation & UI**
- Visit `/` - Landing page with feature showcase
- Visit `/wizard` - Main form wizard application
- Visit `/components` - Interactive component library

**2. Form Wizard Flow**
- Start at Step 1: Personal Information (10+ fields)
- Continue to Step 2: Financial Information (family/employment)
- Complete Step 3: AI-Enhanced Descriptions (try the AI assistance!)

**3. AI Assistance Features**
- Click "✨ Help me write" buttons on any textarea in Step 3
- Test the AI modal with streaming responses
- Try editing and regenerating suggestions

**4. Language & Theme Testing**
- Toggle between English and Arabic (RTL support)
- Switch between light and dark themes
- Test keyboard navigation (Tab, Enter, Escape)

**5. Form Persistence**
- Fill out forms and refresh the page (auto-save)
- Test validation by submitting with empty required fields
- Complete the full submission flow

### 🔍 Development Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Type checking and linting  
npm run typecheck    # Check TypeScript types
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues

# Testing
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode

# Building
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# OpenAI Configuration (Required for AI features)
VITE_OPENAI_API_KEY=sk-your-api-key-here

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_MOCK_API=true
VITE_ENABLE_AI_ASSIST=true

# Analytics (Optional)
VITE_ANALYTICS_ID=

# Environment
VITE_APP_ENV=development
```

### Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key and add it to your `.env` file

⚠️ **Security Note**: Never commit your `.env` file or expose your API key in client-side code. In production, use a backend proxy.

## 📁 Project Structure

```
social-support-portal/
│
├── public/                      # Static assets
│   ├── locales/                # Translation files
│   │   ├── en/
│   │   │   └── translation.json
│   │   └── ar/
│   │       └── translation.json
│   └── favicon.ico
│
├── src/
│   ├── components/             # React components (Atomic Design)
│   │   ├── atoms/             # Basic UI elements
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Label/
│   │   │   ├── Spinner/
│   │   │   └── ErrorMessage/
│   │   │
│   │   ├── molecules/         # Composed components
│   │   │   ├── FormField/
│   │   │   ├── ProgressBar/
│   │   │   ├── LanguageToggle/
│   │   │   └── LoadingOverlay/
│   │   │
│   │   ├── organisms/         # Complex components
│   │   │   ├── FormStep1/
│   │   │   ├── FormStep2/
│   │   │   ├── FormStep3/
│   │   │   ├── AIAssistModal/
│   │   │   └── Header/
│   │   │
│   │   └── templates/         # Page layouts
│   │       └── FormWizardLayout/
│   │
│   ├── lib/                   # Utilities and core logic
│   │   ├── api/              # API integration
│   │   │   ├── axios-client.ts
│   │   │   ├── openai-service.ts
│   │   │   └── form-service.ts
│   │   │
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useFormWizard.ts
│   │   │   ├── useAIAssist.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   └── useKeyboardShortcuts.ts
│   │   │
│   │   ├── utils/            # Utility functions
│   │   │   ├── validation.ts
│   │   │   ├── storage.ts
│   │   │   ├── formatting.ts
│   │   │   └── cn.ts
│   │   │
│   │   └── constants/        # Constants and configuration
│   │       ├── form-fields.ts
│   │       ├── api-config.ts
│   │       └── routes.ts
│   │
│   ├── context/              # React Context providers
│   │   ├── FormWizardContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── I18nProvider.tsx
│   │
│   ├── types/                # TypeScript type definitions
│   │   ├── form.types.ts
│   │   ├── api.types.ts
│   │   ├── common.types.ts
│   │   └── index.ts
│   │
│   ├── styles/               # Global styles
│   │   ├── globals.css
│   │   └── themes.css
│   │
│   ├── __tests__/            # Test files
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── setup.ts
│   │
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   ├── i18n.ts               # i18n configuration
│   └── vite-env.d.ts         # Vite type declarations
│
├── .env.example              # Environment variables template
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── .gitignore                # Git ignore rules
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # TypeScript for Node
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── vite.config.ts            # Vite configuration
├── vitest.config.ts          # Vitest configuration
├── package.json              # Project dependencies
├── package-lock.json         # Dependency lock file
├── README.md                 # This file
└── LICENSE                   # MIT License
```

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)
npm run dev:host     # Start dev server with network access

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Open Vitest UI
npm run test:coverage # Generate coverage report

# Linting & Formatting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types

# Pre-commit
npm run pre-commit   # Run lint-staged (automatic with Husky)
```

### Development Guidelines

#### Code Style

- **TypeScript Strict Mode**: All code must pass strict type checking
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code is auto-formatted on commit
- **Naming Conventions**:
  - Components: PascalCase (`FormStep1.tsx`)
  - Hooks: camelCase with `use` prefix (`useFormWizard.ts`)
  - Utilities: camelCase (`formatDate.ts`)
  - Types: PascalCase (`FormData`)
  - Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

#### Component Structure

```typescript
// ComponentName.tsx
import { ComponentProps } from './types';

/**
 * Component description
 * @param props - Component props
 */
export const ComponentName = ({ prop1, prop2 }: ComponentProps) => {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Event handlers
  const handleEvent = () => {
    // ...
  };
  
  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

#### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add AI writing assistance for step 3
fix: correct RTL layout issues in Arabic mode
docs: update README with API setup instructions
style: format code with Prettier
refactor: extract form validation logic
test: add tests for useFormWizard hook
chore: update dependencies
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Structure

```
src/__tests__/
├── components/
│   ├── FormStep1.test.tsx
│   ├── AIAssistModal.test.tsx
│   └── ...
├── hooks/
│   ├── useFormWizard.test.ts
│   ├── useAIAssist.test.ts
│   └── ...
├── utils/
│   ├── validation.test.ts
│   ├── storage.test.ts
│   └── ...
└── setup.ts
```

### Writing Tests

```typescript
// Example test
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormStep1 } from './FormStep1';

describe('FormStep1', () => {
  it('should render all fields', () => {
    render(<FormStep1 />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    render(<FormStep1 />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab();
    
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

### Coverage Requirements

- **Overall Coverage**: > 80%
- **Critical Paths**: 100%
  - Form validation
  - API service functions
  - Custom hooks

## 🏗 Building

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder:

```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── locales/
│   ├── en/
│   └── ar/
└── index.html
```

### Preview Production Build

```bash
npm run preview
```

Navigate to [http://localhost:4173](http://localhost:4173)

### Build Optimization

The production build includes:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Asset optimization
- ✅ Source maps (for debugging)

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Environment Variables for Production

Make sure to set these in your hosting provider:

```
VITE_OPENAI_API_KEY=sk-your-production-key
VITE_API_BASE_URL=https://your-api.com/api
VITE_ENABLE_MOCK_API=false
VITE_APP_ENV=production
```

⚠️ **Security Warning**: For production, implement a backend proxy for OpenAI API calls to avoid exposing your API key.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Contribution Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Run tests and linting (`npm run test && npm run lint`)
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Pull Request Guidelines

- Use a clear and descriptive title
- Include relevant issue numbers
- Provide a detailed description of changes
- Ensure all tests pass
- Update documentation if needed
- Follow the code style guidelines

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [OpenAI](https://openai.com/) - GPT-3.5 Turbo API
- [React Hook Form](https://react-hook-form.com/) - Performant forms
- [Zod](https://zod.dev/) - TypeScript-first validation

## 📞 Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/social-support-portal/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-org/social-support-portal/discussions)

## 🗺 Roadmap

### v1.0.0 (Current)
- [x] Multi-step form wizard
- [x] AI writing assistance
- [x] Bilingual support (EN/AR)
- [x] Form persistence
- [x] Responsive design
- [x] Accessibility (WCAG AA)

### v1.1.0 (Q2 2025)
- [ ] Document upload
- [ ] Application status tracking
- [ ] Email notifications
- [ ] PDF export
- [ ] Print functionality

### v2.0.0 (Q3 2025)
- [ ] User authentication
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Multi-language expansion
- [ ] Mobile app (React Native)

---

Made with ❤️ by [Your Team Name]