import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { FormProvider } from 'react-hook-form';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { vi } from 'vitest';
import { FormWizardProvider } from '@/context/FormWizardContext';
import { FormBlurProvider } from '@/context/FormBlurContext';
import { ToastProvider } from '@/context/ToastContext';

// Remove the global mock - we'll handle it per test file

// Initialize test i18n instance
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      form: {
        step1: {
          title: 'Personal Information',
          description: 'Please provide your personal details',
        },
        step2: {
          title: 'Financial Information',
          description: 'Please provide your financial details',
        },
        step3: {
          title: 'Additional Information',
          description: 'Please describe your situation',
        },
        fullName: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        nationalId: 'National ID',
        dateOfBirth: 'Date of Birth',
        gender: 'Gender',
        address: 'Address',
        city: 'City',
        state: 'State',
        country: 'Country',
        maritalStatus: 'Marital Status',
        employmentStatus: 'Employment Status',
        monthlyIncome: 'Monthly Income',
        housingStatus: 'Housing Status',
        financialSituation: 'Financial Situation',
        employmentCircumstances: 'Employment Circumstances',
        reasonForApplying: 'Reason for Applying',
      },
      common: {
        required: 'Required',
        loading: 'Loading...',
        error: 'Error',
        submit: 'Submit',
        next: 'Next',
        previous: 'Previous',
      },
    },
  },
});

// Mock form methods
const createMockFormMethods = (defaultValues: any = {}) => {
  const mockControl = {
    _formState: { 
      errors: {},
      isDirty: false,
      isValid: true,
      isSubmitting: false,
      touchedFields: {},
      dirtyFields: {},
      isValidating: false,
      defaultValues: defaultValues,
    },
    _defaultValues: defaultValues,
    _fields: {},
    _names: {
      array: new Set(),
      mount: new Set(),
      unMount: new Set(),
      watch: new Set(),
    },
    register: vi.fn(),
    unregister: vi.fn(),
    _subjects: {
      values: { next: vi.fn() },
      array: { next: vi.fn() },
      state: { next: vi.fn() },
    },
    _formValues: defaultValues,
    _options: {},
    _getWatch: vi.fn((name?: any) => {
      if (name && typeof name === 'string') {
        return (defaultValues as any)[name];
      }
      return defaultValues;
    }),
    _getDirty: vi.fn(() => false),
    _getFieldArray: vi.fn(() => []),
    _updateValid: vi.fn(),
    _removeUnmounted: vi.fn(),
    _subscribe: vi.fn(() => vi.fn()),
    _setDisabledField: vi.fn(),
    _proxyFormState: new Proxy({
      errors: {},
      isDirty: false,
      isValid: true,
      isSubmitting: false,
      touchedFields: {},
      dirtyFields: {},
      isValidating: false,
    }, {
      get: (target, prop) => target[prop as keyof typeof target]
    }),
  };

  return {
    register: vi.fn(),
    handleSubmit: vi.fn((fn: any) => (e?: any) => {
      e?.preventDefault?.();
      return fn(defaultValues);
    }),
    control: mockControl,
    formState: {
      errors: {},
      isSubmitting: false,
      isValid: true,
      isDirty: false,
      isValidating: false,
      touchedFields: {},
      dirtyFields: {},
    },
    watch: vi.fn((name?: any) => {
      if (name && typeof name === 'string') {
        return (defaultValues as any)[name];
      }
      return defaultValues;
    }),
    getValues: vi.fn(() => defaultValues),
    setValue: vi.fn(),
    reset: vi.fn(),
    trigger: vi.fn(),
    clearErrors: vi.fn(),
  };
};

// Test providers wrapper
interface TestProvidersProps {
  children: React.ReactNode;
  formMethods?: any;
  initialFormData?: any;
}

const TestProviders: React.FC<TestProvidersProps> = ({
  children,
  formMethods,
  initialFormData = {},
}) => {
  const mockFormMethods = formMethods || createMockFormMethods(initialFormData);
  const mockOnFieldBlur = vi.fn();

  return (
    <I18nextProvider i18n={i18n}>
      <ToastProvider>
        <FormWizardProvider>
          <FormProvider {...mockFormMethods}>
            <FormBlurProvider onFieldBlur={mockOnFieldBlur}>
              {children}
            </FormBlurProvider>
          </FormProvider>
        </FormWizardProvider>
      </ToastProvider>
    </I18nextProvider>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    formMethods?: any;
    initialFormData?: any;
  }
) => {
  const { formMethods, initialFormData, ...renderOptions } = options || {};

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestProviders formMethods={formMethods} initialFormData={initialFormData}>
      {children}
    </TestProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Test data fixtures
export const mockFormData = {
  step1: {
    fullName: 'John Doe',
    nationalId: '1234567890',
    dateOfBirth: '1990-01-01',
    gender: 'male' as const,
    email: 'john@example.com',
    phone: '+971501234567',
    address: '123 Test Street',
    city: 'Dubai',
    state: 'Dubai',
    country: 'AE',
  },
  step2: {
    maritalStatus: 'single' as const,
    numberOfDependents: 0,
    employmentStatus: 'employed_full_time' as const,
    monthlyIncome: 15000,
    monthlyExpenses: 8000,
    housingStatus: 'rent' as const,
  },
  step3: {
    financialSituation: 'I am experiencing temporary financial difficulties due to medical expenses.',
    employmentCircumstances: 'I am currently employed but facing reduced hours.',
    reasonForApplying: 'I need support to cover basic living expenses during this difficult time.',
    agreeToTerms: true,
    consentToDataProcessing: true,
    allowContactForClarification: true,
  },
};

// Export everything needed for tests
export * from '@testing-library/react';
export { customRender as render };
export { createMockFormMethods, TestProviders, i18n as testI18n };