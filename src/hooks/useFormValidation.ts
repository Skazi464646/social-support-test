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
 *   onSubmit: (data) => {},
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
          onError?.(error);
        }
      },
      (errors) => {
        onError?.(errors);
      }
    ),
    [handleSubmit, onSubmitCallback, onError]
  );

  // Helper functions for field error management
  const getFieldError = useCallback((field: Path<T>): string | undefined => {
    const error = errors[field];
    if (!error) return undefined;
    
    // Return the error message directly - it should already be translated
    // by the i18n-aware Zod schemas
    if (typeof error.message === 'string') {
      return error.message;
    }
    
    return t('validation.invalid_type');
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
  Step1FormData,
  Step2FormData,
  Step3FormData
} from '@/lib/validation/schemas';

import { 
  useValidationSchemas,
  getStepDefaults as getI18nStepDefaults
} from '@/lib/validation/i18n-schemas';

/**
 * Hook for Step 1 form validation (Personal Information) - Now with i18n support
 */
export function useStep1Form(options?: Omit<FormValidationOptions<Step1FormData>, 'schema'>) {
  const { defaultValues, ...restOptions } = options ?? {};
  const schemas = useValidationSchemas();
  
  return useFormValidation({
    schema: schemas.step1Schema,
    defaultValues: {
      ...getI18nStepDefaults(1).step1,
      ...(defaultValues ?? {}),
    },
    ...restOptions,
  });
}

/**
 * Hook for Step 2 form validation (Financial Information) - Now with i18n support
 */
export function useStep2Form(options?: Omit<FormValidationOptions<Step2FormData>, 'schema'>) {
  const { defaultValues, ...restOptions } = options ?? {};
  const schemas = useValidationSchemas();
  
  // Merge defaults with provided values, ensuring proper typing
  const mergedDefaults = {
    ...getI18nStepDefaults(2).step2,
    ...(defaultValues ?? {}),
  };
  
  return useFormValidation({
    schema: schemas.step2Schema,
    defaultValues: mergedDefaults,
    ...restOptions,
  });
}

/**
 * Hook for Step 3 form validation (Descriptive Information) - Now with i18n support
 */
export function useStep3Form(options?: Omit<FormValidationOptions<Step3FormData>, 'schema'>) {
  const { defaultValues, ...restOptions } = options ?? {};
  const schemas = useValidationSchemas();
  
  return useFormValidation({
    schema: schemas.step3Schema,
    defaultValues: {
      ...getI18nStepDefaults(3).step3,
      ...(defaultValues ?? {}),
    },
    ...restOptions,
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
 * Note: This function should be used with the i18n validation utilities for proper localized error messages
 */
export function validateStepData(step: number, data: any, t?: (key: string, options?: any) => string) {
  // Import here to avoid circular dependencies
  const { validateFormStep } = require('@/lib/validation/i18n-schemas');
  
  if (t) {
    return validateFormStep(step, data, t);
  }
  
  // Fallback to hardcoded schemas if no translation function provided
  const { step1Schema, step2Schema, step3Schema } = require('@/lib/validation/schemas');
  const schemas = [step1Schema, step2Schema, step3Schema];
  const schema = schemas[step - 1];
  
  if (!schema) {
    throw new Error(`Invalid step: ${step}`);
  }
  
  return schema.safeParse(data);
}
