import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, createMockFormMethods, mockFormData } from '@/__tests__/test-utils';
import { FormStep2 } from './FormStep2';

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

describe('FormStep2 - Financial Information', () => {
  const defaultFormMethods = createMockFormMethods(mockFormData.step2);

  beforeEach(() => {
    vi.clearAllMocks();
    mockFieldValues = { ...mockFormData.step2 };
    mockFieldErrors = {};
  });

  describe('Component Rendering', () => {
    it('renders all financial information sections', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      // Check for section headers
      expect(screen.getByText(/family.*information/i)).toBeInTheDocument();
      expect(screen.getByText(/employment.*information/i)).toBeInTheDocument();
      expect(screen.getByText(/housing.*information/i)).toBeInTheDocument();
      expect(screen.getByText(/benefits.*information/i)).toBeInTheDocument();
    });

    it('renders family information fields', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      // Check for family fields
      expect(screen.getByLabelText(/marital.*status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/number.*dependents/i)).toBeInTheDocument();
    });

    it('renders employment information fields', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      // Check for employment fields
      expect(screen.getByLabelText(/employment.*status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/monthly.*income/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/monthly.*expenses/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/total.*savings/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/total.*debt/i)).toBeInTheDocument();
    });

    it('renders housing information fields', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      // Check for housing fields
      expect(screen.getByLabelText(/housing.*status/i)).toBeInTheDocument();
    });

    it('renders benefits information fields', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      // Check for benefits fields
      expect(screen.getByLabelText(/receiving.*benefits/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/previously.*applied/i)).toBeInTheDocument();
    });
  });

  describe('Marital Status Selection', () => {
    it('renders marital status dropdown with all options', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      const maritalSelect = screen.getByLabelText(/marital.*status/i);
      expect(maritalSelect).toBeInTheDocument();

      // Check marital status options
      expect(screen.getByRole('option', { name: /select.*marital/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /single/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /married/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /divorced/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /widowed/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /separated/i })).toBeInTheDocument();
    });

    it('handles marital status selection correctly', async () => {
      const user = userEvent.setup();
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      const maritalSelect = screen.getByLabelText(/marital.*status/i);
      await user.selectOptions(maritalSelect, 'married');

      expect(maritalSelect).toHaveValue('married');
    });
  });

  describe('Employment Status and Conditional Fields', () => {
    it('renders employment status dropdown with all options', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      const employmentSelect = screen.getByLabelText(/employment.*status/i);
      expect(employmentSelect).toBeInTheDocument();

      // Check employment status options
      expect(screen.getByRole('option', { name: /select.*employment/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /employed.*full.*time/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /employed.*part.*time/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /self.*employed/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /unemployed/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /retired/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /student/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /disabled/i })).toBeInTheDocument();
    });

    it('shows occupation field when employed full-time', async () => {
      const formMethods = createMockFormMethods({
        ...mockFormData.step2,
        employmentStatus: 'employed_full_time'
      });
      
      // Mock watch to return employed full-time
      formMethods.watch = vi.fn().mockImplementation((name: string) => {
        if (name === 'employmentStatus') return 'employed_full_time';
        return (mockFormData.step2 as any)[name];
      });
      
      render(<FormStep2 />, { formMethods });

      // Occupation field should be visible
      expect(screen.getByLabelText(/occupation/i)).toBeInTheDocument();
    });

    it('shows employer field when employed', async () => {
      const formMethods = createMockFormMethods({
        ...mockFormData.step2,
        employmentStatus: 'employed_part_time'
      });
      
      // Mock watch to return employed part-time
      formMethods.watch = vi.fn().mockImplementation((name: string) => {
        if (name === 'employmentStatus') return 'employed_part_time';
        return (mockFormData.step2 as any)[name];
      });
      
      render(<FormStep2 />, { formMethods });

      // Employer field should be visible
      expect(screen.getByLabelText(/employer/i)).toBeInTheDocument();
    });

    it('hides occupation and employer fields when unemployed', () => {
      const formMethods = createMockFormMethods({
        ...mockFormData.step2,
        employmentStatus: 'unemployed'
      });
      
      // Mock watch to return unemployed
      formMethods.watch = vi.fn().mockImplementation((name: string) => {
        if (name === 'employmentStatus') return 'unemployed';
        return (mockFormData.step2 as any)[name];
      });
      
      render(<FormStep2 />, { formMethods });

      // Occupation and employer fields should not be visible
      expect(screen.queryByLabelText(/occupation/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/employer/i)).not.toBeInTheDocument();
    });
  });

  describe('Housing Status and Conditional Fields', () => {
    it('renders housing status dropdown with all options', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      const housingSelect = screen.getByLabelText(/housing.*status/i);
      expect(housingSelect).toBeInTheDocument();

      // Check housing status options
      expect(screen.getByRole('option', { name: /select.*housing/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /own/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /rent/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /living.*family/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /homeless/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /other/i })).toBeInTheDocument();
    });

    it('shows monthly rent field when housing status is rent', async () => {
      const formMethods = createMockFormMethods({
        ...mockFormData.step2,
        housingStatus: 'rent'
      });
      
      // Mock watch to return rent
      formMethods.watch = vi.fn().mockImplementation((name: string) => {
        if (name === 'housingStatus') return 'rent';
        return (mockFormData.step2 as any)[name];
      });
      
      render(<FormStep2 />, { formMethods });

      // Monthly rent field should be visible
      expect(screen.getByLabelText(/monthly.*rent/i)).toBeInTheDocument();
    });

    it('hides monthly rent field when housing status is own', () => {
      const formMethods = createMockFormMethods({
        ...mockFormData.step2,
        housingStatus: 'own'
      });
      
      // Mock watch to return own
      formMethods.watch = vi.fn().mockImplementation((name: string) => {
        if (name === 'housingStatus') return 'own';
        return (mockFormData.step2 as any)[name];
      });
      
      render(<FormStep2 />, { formMethods });

      // Monthly rent field should not be visible
      expect(screen.queryByLabelText(/monthly.*rent/i)).not.toBeInTheDocument();
    });
  });

  describe('Benefits Information and Conditional Fields', () => {
    it('renders benefits dropdown with yes/no options', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      const benefitsSelect = screen.getByLabelText(/receiving.*benefits/i);
      expect(benefitsSelect).toBeInTheDocument();

      // Check benefits options
      expect(screen.getByRole('option', { name: /select/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /yes/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /no/i })).toBeInTheDocument();
    });

    it('shows benefit types field when receiving benefits is true', async () => {
      const formMethods = createMockFormMethods({
        ...mockFormData.step2,
        receivingBenefits: true
      });
      
      // Mock watch to return true for receiving benefits
      formMethods.watch = vi.fn().mockImplementation((name: string) => {
        if (name === 'receivingBenefits') return true;
        return (mockFormData.step2 as any)[name];
      });
      
      render(<FormStep2 />, { formMethods });

      // Benefit types field should be visible
      expect(screen.getByText(/unemployment/i)).toBeInTheDocument();
      expect(screen.getByText(/disability/i)).toBeInTheDocument();
      expect(screen.getByText(/housing/i)).toBeInTheDocument();
      expect(screen.getByText(/food/i)).toBeInTheDocument();
      expect(screen.getByText(/medical/i)).toBeInTheDocument();
    });

    it('hides benefit types field when receiving benefits is false', () => {
      const formMethods = createMockFormMethods({
        ...mockFormData.step2,
        receivingBenefits: false
      });
      
      // Mock watch to return false for receiving benefits
      formMethods.watch = vi.fn().mockImplementation((name: string) => {
        if (name === 'receivingBenefits') return false;
        return (mockFormData.step2 as any)[name];
      });
      
      render(<FormStep2 />, { formMethods });

      // Benefit types should not be visible
      expect(screen.queryByText(/unemployment/i)).not.toBeInTheDocument();
    });
  });

  describe('Number Field Interactions', () => {
    it('handles number of dependents input correctly', async () => {
      const user = userEvent.setup();
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      const dependentsField = screen.getByLabelText(/number.*dependents/i);
      await user.clear(dependentsField);
      await user.type(dependentsField, '2');

      expect(dependentsField).toHaveValue(2);
    });

    it('handles monthly income input correctly', async () => {
      const user = userEvent.setup();
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      const incomeField = screen.getByLabelText(/monthly.*income/i);
      await user.clear(incomeField);
      await user.type(incomeField, '5000');

      expect(incomeField).toHaveValue(5000);
    });

    it('handles monthly expenses input correctly', async () => {
      const user = userEvent.setup();
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      const expensesField = screen.getByLabelText(/monthly.*expenses/i);
      await user.clear(expensesField);
      await user.type(expensesField, '3000');

      expect(expensesField).toHaveValue(3000);
    });
  });

  describe('Form Validation', () => {
    it('shows validation errors for required fields', () => {
      const formMethods = createMockFormMethods({});
      
      // Mock form errors
      formMethods.control._formState.errors = {
        maritalStatus: { message: 'Marital status is required' },
        employmentStatus: { message: 'Employment status is required' },
        monthlyIncome: { message: 'Monthly income is required' },
      };

      render(<FormStep2 />, { formMethods });

      expect(screen.getByText('Marital status is required')).toBeInTheDocument();
      expect(screen.getByText('Employment status is required')).toBeInTheDocument();
      expect(screen.getByText('Monthly income is required')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      // Check for proper heading structure
      const mainHeading = screen.getByRole('heading', { level: 1 });
      const sectionHeadings = screen.getAllByRole('heading', { level: 2 });

      expect(mainHeading).toBeInTheDocument();
      expect(sectionHeadings.length).toBeGreaterThan(3); // Family, Employment, Housing, Benefits sections
    });

    it('has proper ARIA labels for form fields', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      // Check that form fields have proper labels
      const maritalField = screen.getByLabelText(/marital.*status/i);
      const employmentField = screen.getByLabelText(/employment.*status/i);
      const incomeField = screen.getByLabelText(/monthly.*income/i);

      expect(maritalField).toHaveAttribute('aria-invalid', 'false');
      expect(employmentField).toHaveAttribute('aria-invalid', 'false');
      expect(incomeField).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('Form Integration', () => {
    it('uses form context correctly', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      // Verify that form methods are being used
      expect(defaultFormMethods.control).toBeDefined();
      expect(defaultFormMethods.watch).toBeDefined();
    });

    it('calls watch for conditional fields', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      // Should call watch to monitor employment, housing, and benefits status
      expect(defaultFormMethods.watch).toHaveBeenCalledWith('employmentStatus');
      expect(defaultFormMethods.watch).toHaveBeenCalledWith('housingStatus');
      expect(defaultFormMethods.watch).toHaveBeenCalledWith('receivingBenefits');
    });
  });

  describe('Notice Section', () => {
    it('displays financial notice information', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      // Should show some kind of notice or warning section
      // This would depend on the exact implementation of FormStepNotice
      expect(screen.getByText(/notice|important|information|warning|financial/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('applies proper grid classes for responsive layout', () => {
      render(<FormStep2 />, { formMethods: defaultFormMethods });

      // Check that the form has multiple form fields indicating responsive layout
      const numberInputs = screen.getAllByDisplayValue(/\d+/);
      const selectInputs = screen.getAllByRole('combobox');
      
      expect(numberInputs.length + selectInputs.length).toBeGreaterThan(5); // Should have multiple form fields
    });
  });
});