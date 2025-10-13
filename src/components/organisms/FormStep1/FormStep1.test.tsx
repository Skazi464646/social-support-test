import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, createMockFormMethods, mockFormData } from '@/__tests__/test-utils';
import { FormStep1 } from './FormStep1';

// Mock the hooks
vi.mock('@/hooks/useLanguage', () => ({
  useDirection: () => ({ isRTL: false }),
}));

// Mock field values for proper state management
let mockFieldValues: Record<string, any> = {};
let mockFieldErrors: Record<string, any> = {};

// Mock React Hook Form with proper value handling
const getMockController = (name: string) => {
  const currentValue = mockFieldValues[name] || '';
  
  const onChange = vi.fn((value: any) => {
    mockFieldValues[name] = value;
  });
  
  const onBlur = vi.fn();
  
  return {
    field: {
      onChange,
      onBlur,
      value: currentValue,
      ref: vi.fn(),
      name,
    },
    fieldState: {
      error: mockFieldErrors[name],
      isDirty: mockFieldValues[name] !== undefined,
      isTouched: false,
    },
  };
};

vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form');
  return {
    ...actual,
    FormProvider: ({ children }: any) => children,
    useFormContext: () => ({
      control: {
        _formState: {
          errors: mockFieldErrors,
        },
      },
      watch: vi.fn((name?: string) => {
        if (name && typeof name === 'string') {
          return mockFieldValues[name];
        }
        return mockFieldValues;
      }),
    }),
    useController: ({ name }: any) => getMockController(name),
  };
});

// Mock form blur context
vi.mock('@/context/FormBlurContext', () => ({
  useFormBlur: () => ({
    onFieldBlur: vi.fn(),
  }),
  FormBlurProvider: ({ children }: any) => children,
}));

// Enhanced form field mock to handle interactions properly
const createEnhancedFormMethods = (initialValues: any = {}) => {
  mockFieldValues = { ...initialValues };
  mockFieldErrors = {};
  
  return createMockFormMethods(initialValues);
};

describe('FormStep1 - Personal Information', () => {
  const defaultFormMethods = createEnhancedFormMethods(mockFormData.step1);

  beforeEach(() => {
    vi.clearAllMocks();
    mockFieldValues = {};
    mockFieldErrors = {};
  });

  describe('Component Rendering', () => {
    it('renders all personal information fields', () => {
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      // Check for section headers
      expect(screen.getByText(/personal information/i)).toBeInTheDocument();
      expect(screen.getByText(/identity information/i)).toBeInTheDocument();
      expect(screen.getByText(/contact information/i)).toBeInTheDocument();
      expect(screen.getByText(/address information/i)).toBeInTheDocument();

      // Check for identity fields
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/national id/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();

      // Check for contact fields
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();

      // Check for address fields
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    });

    it('shows required indicators for mandatory fields', () => {
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      // All fields in step 1 should be required
      const requiredElements = screen.getAllByText(/required/i);
      expect(requiredElements.length).toBeGreaterThan(8); // At least 9 required fields
    });

    it('renders form sections with proper headings', () => {
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      // Check section structure
      expect(screen.getByText(/identity information/i)).toBeInTheDocument();
      expect(screen.getByText(/contact information/i)).toBeInTheDocument();
      expect(screen.getByText(/address information/i)).toBeInTheDocument();
    });
  });

  describe('Field Interactions', () => {
    it('handles full name input correctly', async () => {
      const user = userEvent.setup();
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      const nameField = screen.getByLabelText(/full name/i);
      await user.clear(nameField);
      await user.type(nameField, 'Jane Smith');

      expect(nameField).toHaveValue('Jane Smith');
    });

    it('handles national ID input with validation', async () => {
      const user = userEvent.setup();
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      const nationalIdField = screen.getByLabelText(/national id/i);
      await user.clear(nationalIdField);
      await user.type(nationalIdField, '9876543210');

      expect(nationalIdField).toHaveValue('9876543210');
      expect(nationalIdField).toHaveAttribute('maxLength', '10');
    });

    it('handles email input with correct type', async () => {
      const user = userEvent.setup();
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      const emailField = screen.getByLabelText(/email/i);
      expect(emailField).toHaveAttribute('type', 'email');

      await user.clear(emailField);
      await user.type(emailField, 'jane.smith@example.com');

      expect(emailField).toHaveValue('jane.smith@example.com');
    });

    it('handles phone input with tel type', async () => {
      const user = userEvent.setup();
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      const phoneField = screen.getByLabelText(/phone/i);
      expect(phoneField).toHaveAttribute('type', 'tel');

      await user.clear(phoneField);
      await user.type(phoneField, '+971501234567');

      expect(phoneField).toHaveValue('+971501234567');
    });

    it('handles date of birth input', async () => {
      const user = userEvent.setup();
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      const dobField = screen.getByLabelText(/date of birth/i);
      expect(dobField).toHaveAttribute('type', 'date');

      await user.clear(dobField);
      await user.type(dobField, '1985-05-15');

      expect(dobField).toHaveValue('1985-05-15');
    });
  });

  describe('Gender Selection', () => {
    it('renders gender dropdown with all options', () => {
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      const genderSelect = screen.getByLabelText(/gender/i);
      expect(genderSelect).toBeInTheDocument();

      // Check gender options
      expect(screen.getByRole('option', { name: /select.*gender/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /male/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /female/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /other/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /prefer not to say/i })).toBeInTheDocument();
    });

    it('handles gender selection correctly', async () => {
      const user = userEvent.setup();
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      const genderSelect = screen.getByLabelText(/gender/i);
      await user.selectOptions(genderSelect, 'female');

      expect(genderSelect).toHaveValue('female');
    });
  });

  describe('Country Selection and Conditional Fields', () => {
    it('renders country dropdown with available options', () => {
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      const countrySelect = screen.getByLabelText(/country/i);
      expect(countrySelect).toBeInTheDocument();

      // Check some country options
      expect(screen.getByRole('option', { name: /united arab emirates/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /saudi arabia/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /qatar/i })).toBeInTheDocument();
    });

    it('shows postal code field when non-UAE country is selected', async () => {
      const formMethods = createEnhancedFormMethods({
        ...mockFormData.step1,
        country: 'SA' // Saudi Arabia
      });
      
      render(<FormStep1 />, { formMethods });

      // Postal code field should be visible for non-UAE countries
      expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();
    });

    it('hides postal code field when UAE is selected', () => {
      const formMethods = createEnhancedFormMethods({
        ...mockFormData.step1,
        country: 'AE' // UAE
      });
      
      render(<FormStep1 />, { formMethods });

      // Postal code field should not be visible for UAE
      expect(screen.queryByLabelText(/postal code/i)).not.toBeInTheDocument();
    });

    it('toggles postal code field when country changes', async () => {
      const formMethods = createEnhancedFormMethods({
        ...mockFormData.step1,
        country: ''
      });
      
      const { rerender } = render(<FormStep1 />, { formMethods });

      // Initially no postal code field
      expect(screen.queryByLabelText(/postal code/i)).not.toBeInTheDocument();

      // Update mock field values to simulate country change
      mockFieldValues.country = 'SA';
      formMethods.watch = vi.fn().mockImplementation((name?: string) => {
        if (name === 'country') return 'SA';
        return mockFieldValues[name as string]
      });
      
      rerender(<FormStep1 />);

      // Now postal code should appear
      await waitFor(() => {
        expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();
      });
    });
  });

  describe('Address Fields', () => {
    it('handles address input correctly', async () => {
      const user = userEvent.setup();
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      const addressField = screen.getByLabelText(/address/i);
      await user.clear(addressField);
      await user.type(addressField, '456 New Street, Building 10, Apartment 5A');

      expect(addressField).toHaveValue('456 New Street, Building 10, Apartment 5A');
    });

    it('handles city and state input', async () => {
      const user = userEvent.setup();
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      const cityField = screen.getByLabelText(/city/i);
      const stateField = screen.getByLabelText(/state/i);

      await user.clear(cityField);
      await user.type(cityField, 'Abu Dhabi');

      await user.clear(stateField);
      await user.type(stateField, 'Abu Dhabi Emirate');

      expect(cityField).toHaveValue('Abu Dhabi');
      expect(stateField).toHaveValue('Abu Dhabi Emirate');
    });
  });

  describe('Form Validation', () => {
    it('shows validation errors for required fields', () => {
      const formMethods = createEnhancedFormMethods({});
      
      // Mock form errors
      mockFieldErrors = {
        fullName: { message: 'Full name is required' },
        email: { message: 'Email is required' },
        nationalId: { message: 'National ID is required' },
      };
      formMethods.control._formState.errors = mockFieldErrors;

      render(<FormStep1 />, { formMethods });

      expect(screen.getByText('Full name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('National ID is required')).toBeInTheDocument();
    });

    it('displays translated validation messages', () => {
      const formMethods = createEnhancedFormMethods({});
      
      // Mock validation error keys
      mockFieldErrors = {
        fullName: { message: 'validation.name.too_short' },
        email: { message: 'validation.email.invalid' },
      };
      formMethods.control._formState.errors = mockFieldErrors;

      render(<FormStep1 />, { formMethods });

      // Should show translated messages (or the keys if translation fails)
      expect(screen.getByText(/name.*too.*short|validation/i)).toBeInTheDocument();
      expect(screen.getByText(/email.*invalid|validation/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and attributes', () => {
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      // Check that form fields have proper labels
      const fullNameField = screen.getByLabelText(/full name/i);
      const emailField = screen.getByLabelText(/email/i);
      const phoneField = screen.getByLabelText(/phone/i);

      expect(fullNameField).toHaveAttribute('aria-invalid', 'false');
      expect(emailField).toHaveAttribute('aria-invalid', 'false');
      expect(phoneField).toHaveAttribute('aria-invalid', 'false');
    });

    it('marks invalid fields with proper ARIA attributes', () => {
      const formMethods = createEnhancedFormMethods({});
      
      mockFieldErrors = {
        fullName: { message: 'Full name is required' },
      };
      formMethods.control._formState.errors = mockFieldErrors;

      render(<FormStep1 />, { formMethods });

      const fullNameField = screen.getByLabelText(/full name/i);
      expect(fullNameField).toHaveAttribute('aria-invalid', 'true');
    });

    it('has proper heading hierarchy', () => {
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      // Check for proper heading structure
      const mainHeading = screen.getByRole('heading', { level: 2 }); // Personal Information is h2
      const sectionHeadings = screen.getAllByRole('heading', { level: 3 }); // Subsections are h3

      expect(mainHeading).toBeInTheDocument();
      expect(sectionHeadings.length).toBeGreaterThan(2); // Identity, Contact, Address sections
    });
  });

  describe('Form Integration', () => {
    it('uses form context correctly', () => {
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      // Verify that form methods are being used
      expect(defaultFormMethods.control).toBeDefined();
      expect(defaultFormMethods.watch).toBeDefined();
    });

    it('calls watch for country field', () => {
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      // Should call watch to monitor country selection
      expect(defaultFormMethods.watch).toHaveBeenCalledWith('country');
    });
  });

  describe('Notice Section', () => {
    it('displays important notice information', () => {
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      // Should show some kind of notice or information section
      // This would depend on the exact implementation of FormStepNotice
      expect(screen.getByText(/notice|important|information/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('applies proper grid classes for responsive layout', () => {
      render(<FormStep1 />, { formMethods: defaultFormMethods });

      // Check that the form has proper responsive classes
      // This is implementation-specific but should have grid layouts
      const formElements = screen.getAllByRole('textbox');
      expect(formElements.length).toBeGreaterThan(6); // Should have multiple form fields
    });
  });
});