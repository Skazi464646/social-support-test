import { useForm, UseFormProps, UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// =============================================================================
// TYPES
// =============================================================================

export interface FormValidationOptions<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
  schema: z.ZodType<T>;
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
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Custom hook for form validation using React Hook Form with Zod
 * 
 * @example
 * const {
 *   register,
 *   formState: { errors },
 *   onSubmit,
 *   getFieldError,
 *   isValid
 * } = useFormValidation({
 *   schema: step1Schema,
 *   defaultValues: getStepDefaults(1).step1,
 *   onSubmit: (data) => console.log(data),
 *   mode: 'onChange'
 * });
 */
export function useFormValidation<T extends FieldValues>({
  schema,
  onSubmit: onSubmitCallback,
  onError,
  ...formOptions
}: FormValidationOptions<T>): FormValidationReturn<T> {
  const { t } = useTranslation();
  
  // Setup form with Zod resolver
  const form = useForm<T>({
    resolver: zodResolver(schema as any),
    mode: 'onChange',
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
      if (error.message.startsWith('validation.')) {
        return t(error.message);
      }
      return error.message;
    }
    
    return t('validation.generic.invalid');
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
  ]);
}

// =============================================================================
// STEP-SPECIFIC HOOKS
// =============================================================================

import { 
  step1Schema, 
  step2Schema, 
  step3Schema,
  Step1FormData,
  Step2FormData,
  Step3FormData,
  getStepDefaults
} from '@/lib/validation/schemas';

/**
 * Hook for Step 1 form validation (Personal Information)
 */
export function useStep1Form(options?: Omit<FormValidationOptions<Step1FormData>, 'schema'>) {
  return useFormValidation({
    schema: step1Schema,
    defaultValues: getStepDefaults(1).step1,
    ...options,
  });
}

/**
 * Hook for Step 2 form validation (Financial Information)
 */
export function useStep2Form(options?: Omit<FormValidationOptions<Step2FormData>, 'schema'>) {
  return useFormValidation({
    schema: step2Schema,
    defaultValues: getStepDefaults(2).step2,
    ...options,
  });
}

/**
 * Hook for Step 3 form validation (Descriptive Information)
 */
export function useStep3Form(options?: Omit<FormValidationOptions<Step3FormData>, 'schema'>) {
  return useFormValidation({
    schema: step3Schema,
    defaultValues: getStepDefaults(3).step3,
    ...options,
  });
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Get the appropriate form hook for a given step
 */
export function getFormHookForStep(step: number) {
  switch (step) {
    case 1:
      return useStep1Form;
    case 2:
      return useStep2Form;
    case 3:
      return useStep3Form;
    default:
      throw new Error(`Invalid step: ${step}`);
  }
}

/**
 * Validate form data for a specific step without using the hook
 */
export function validateStepData(step: number, data: any) {
  const schemas = [step1Schema, step2Schema, step3Schema];
  const schema = schemas[step - 1];
  
  if (!schema) {
    throw new Error(`Invalid step: ${step}`);
  }
  
  return schema.safeParse(data);
}