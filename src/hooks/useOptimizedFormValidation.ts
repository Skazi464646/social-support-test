import { useForm, UseFormProps, UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// =============================================================================
// TYPES
// =============================================================================

export interface FormValidationOptions<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
  schema?: z.ZodType<T>;
  schemaLoader?: () => Promise<z.ZodType<T>>;
  onSubmit?: (data: T) => void | Promise<void>;
  onError?: (errors: any) => void;
}

export interface FormValidationReturn<T extends FieldValues> extends UseFormReturn<T> {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitted: boolean;
  submitCount: number;
  getFieldError: (field: Path<T>) => string | undefined;
  hasFieldError: (field: Path<T>) => boolean;
  clearFieldError: (field: Path<T>) => void;
  setFieldError: (field: Path<T>, error: string) => void;
  isSchemaLoading: boolean;
  schemaError: Error | null;
}

// =============================================================================
// OPTIMIZED HOOK WITH LAZY SCHEMA LOADING
// =============================================================================

/**
 * Optimized form validation hook with lazy schema loading for better performance
 */
export function useOptimizedFormValidation<T extends FieldValues>({
  schema,
  schemaLoader,
  onSubmit: onSubmitCallback,
  onError,
  ...formOptions
}: FormValidationOptions<T>): FormValidationReturn<T> {
  const { t } = useTranslation(['validation', 'common']);
  
  const [loadedSchema, setLoadedSchema] = useState<z.ZodType<T> | null>(schema || null);
  const [isSchemaLoading, setIsSchemaLoading] = useState(false);
  const [schemaError, setSchemaError] = useState<Error | null>(null);

  // Load schema dynamically if schemaLoader is provided
  useEffect(() => {
    if (!schema && schemaLoader && !loadedSchema && !isSchemaLoading) {
      setIsSchemaLoading(true);
      setSchemaError(null);
      
      schemaLoader()
        .then((loadedSchema) => {
          setLoadedSchema(loadedSchema);
          setIsSchemaLoading(false);
        })
        .catch((error) => {
          console.error('Failed to load schema:', error);
          setSchemaError(error);
          setIsSchemaLoading(false);
        });
    }
  }, [schema, schemaLoader, loadedSchema, isSchemaLoading]);
  
  // Setup form with Zod resolver - only when schema is available
  const form = useForm<T>({
    resolver: loadedSchema ? zodResolver(loadedSchema as any) : undefined,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    ...formOptions,
  });

  const {
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitted, submitCount },
    clearErrors,
    setError,
  } = form;

  // Enhanced submit handler
  const onSubmit = useCallback(
    handleSubmit(
      async (data) => {
        try {
          await onSubmitCallback?.(data);
        } catch (error) {
          console.error('Form submission error:', error);
          onError?.(error);
        }
      },
      (errors) => {
        console.log('Form validation errors:', errors);
        onError?.(errors);
      }
    ),
    [handleSubmit, onSubmitCallback, onError]
  );

  // Helper functions for field error management
  const getFieldError = useCallback((field: Path<T>): string | undefined => {
    const error = errors[field];
    if (!error) return undefined;
    
    // If it's a message string, try to translate it
    if (typeof error.message === 'string') {
      // Check if it's a translation key
      if (error.message.includes('.')) {
        return t(error.message, error.message);
      }
      return error.message;
    }
    
    return t('generic.invalid', 'Invalid value');
  }, [errors, t]);

  const hasFieldError = useCallback((field: Path<T>): boolean => {
    return !!errors[field];
  }, [errors]);

  const clearFieldError = useCallback((field: Path<T>) => {
    clearErrors(field);
  }, [clearErrors]);

  const setFieldError = useCallback((field: Path<T>, error: string) => {
    setError(field, { type: 'manual', message: error });
  }, [setError]);

  return useMemo(() => ({
    ...form,
    onSubmit,
    isValid,
    isDirty,
    isSubmitted,
    submitCount,
    getFieldError,
    hasFieldError,
    clearFieldError,
    setFieldError,
    isSchemaLoading,
    schemaError,
  }), [
    form,
    onSubmit,
    isValid,
    isDirty,
    isSubmitted,
    submitCount,
    getFieldError,
    hasFieldError,
    clearFieldError,
    setFieldError,
    isSchemaLoading,
    schemaError,
  ]);
}

// =============================================================================
// OPTIMIZED STEP-SPECIFIC HOOKS WITH LAZY LOADING
// =============================================================================

/**
 * Step 1 form hook with lazy schema loading
 */
export function useOptimizedStep1Form(options?: Omit<FormValidationOptions<any>, 'schema' | 'schemaLoader'>) {
  return useOptimizedFormValidation({
    schemaLoader: async () => {
      const { step1Schema } = await import('@/lib/validation/step1-schema');
      return step1Schema;
    },
    defaultValues: {
      fullName: '',
      nationalId: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
    ...options,
  });
}

/**
 * Step 2 form hook with lazy schema loading
 */
export function useOptimizedStep2Form(options?: Omit<FormValidationOptions<any>, 'schema' | 'schemaLoader'>) {
  return useOptimizedFormValidation({
    schemaLoader: async () => {
      const { step2Schema } = await import('@/lib/validation/step2-schema');
      return step2Schema;
    },
    defaultValues: {
      maritalStatus: '',
      numberOfDependents: 0,
      employmentStatus: '',
      occupation: '',
      employer: '',
      monthlyIncome: 0,
      monthlyExpenses: 0,
      totalSavings: 0,
      totalDebt: 0,
      housingStatus: '',
      monthlyRent: 0,
      receivingBenefits: '',
      benefitTypes: [],
      previouslyApplied: '',
    },
    ...options,
  });
}

/**
 * Step 3 form hook with lazy schema loading
 */
export function useOptimizedStep3Form(options?: Omit<FormValidationOptions<any>, 'schema' | 'schemaLoader'>) {
  return useOptimizedFormValidation({
    schemaLoader: async () => {
      const { step3Schema } = await import('@/lib/validation/step3-schema');
      return step3Schema;
    },
    defaultValues: {
      financialSituation: '',
      employmentCircumstances: '',
      reasonForApplying: '',
      consentDataProcessing: false,
      acknowledgeTerms: false,
      confirmInformationAccuracy: false,
    },
    ...options,
  });
}

// =============================================================================
// OPTIMIZED UTILITIES
// =============================================================================

/**
 * Get the appropriate optimized form hook for a given step
 */
export function getOptimizedFormHookForStep(step: number) {
  switch (step) {
    case 1:
      return useOptimizedStep1Form;
    case 2:
      return useOptimizedStep2Form;
    case 3:
      return useOptimizedStep3Form;
    default:
      throw new Error(`Invalid step: ${step}`);
  }
}

/**
 * Preload validation schemas for better performance
 */
export async function preloadValidationSchemas() {
  try {
    const [step1, step2, step3] = await Promise.all([
      import('@/lib/validation/step1-schema'),
      import('@/lib/validation/step2-schema'),
      import('@/lib/validation/step3-schema'),
    ]);
    
    console.log('[Performance] Validation schemas preloaded successfully');
    return { step1: step1.step1Schema, step2: step2.step2Schema, step3: step3.step3Schema };
  } catch (error) {
    console.error('[Performance] Failed to preload validation schemas:', error);
    throw error;
  }
}