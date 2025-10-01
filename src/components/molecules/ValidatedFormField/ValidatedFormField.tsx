import { FieldPath, FieldValues, Control, RegisterOptions } from 'react-hook-form';
import { FormField, type FormFieldProps } from '@/components/molecules/FormField';
import { useController } from 'react-hook-form';

// =============================================================================
// TYPES
// =============================================================================

export interface ValidatedFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<FormFieldProps, 'hasError' | 'aria-invalid' | 'aria-describedby'> {
  name: TName;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, TName>;
  shouldUnregister?: boolean;
  label: string;
  required?: boolean;
  helperText?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ValidatedFormField - A FormField component integrated with React Hook Form
 * 
 * This component automatically handles:
 * - Field registration with React Hook Form
 * - Error state management
 * - Validation feedback
 * - ARIA attributes for accessibility
 * 
 * @example
 * <ValidatedFormField
 *   name="fullName"
 *   control={control}
 *   label="Full Name"
 *   required
 *   placeholder="Enter your full name"
 *   helperText="Enter your full legal name as it appears on your ID"
 * />
 */
export function ValidatedFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  rules,
  shouldUnregister,
  label,
  required = false,
  helperText,
  ...fieldProps
}: ValidatedFormFieldProps<TFieldValues, TName>) {
  
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error, isDirty, isTouched },
  } = useController({
    name,
    control,
    rules,
    shouldUnregister,
  });

  const hasError = !!error;
  const errorMessage = error?.message;

  return (
    <FormField
      {...fieldProps}
      ref={ref}
      label={label}
      required={required}
      error={errorMessage}
      helperText={!hasError ? helperText : undefined}
      hasError={hasError}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      aria-invalid={hasError}
      data-dirty={isDirty}
      data-touched={isTouched}
    />
  );
}

// =============================================================================
// SPECIALIZED FORM FIELDS
// =============================================================================

/**
 * NumberFormField - Specialized field for number inputs
 */
export interface NumberFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ValidatedFormFieldProps<TFieldValues, TName>, 'type'> {
  min?: number;
  max?: number;
  step?: number;
}

export function NumberFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  min,
  max,
  step,
  ...props
}: NumberFormFieldProps<TFieldValues, TName>) {
  return (
    <ValidatedFormField
      {...props}
      type="number"
      min={min}
      max={max}
      step={step}
    />
  );
}

/**
 * EmailFormField - Specialized field for email inputs
 */
export function EmailFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: Omit<ValidatedFormFieldProps<TFieldValues, TName>, 'type'>) {
  return (
    <ValidatedFormField
      {...props}
      type="email"
    />
  );
}

/**
 * PhoneFormField - Specialized field for phone inputs
 */
export function PhoneFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: Omit<ValidatedFormFieldProps<TFieldValues, TName>, 'type'>) {
  return (
    <ValidatedFormField
      {...props}
      type="tel"
    />
  );
}

/**
 * DateFormField - Specialized field for date inputs
 */
export interface DateFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ValidatedFormFieldProps<TFieldValues, TName>, 'type'> {
  min?: string;
  max?: string;
}

export function DateFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  min,
  max,
  ...props
}: DateFormFieldProps<TFieldValues, TName>) {
  return (
    <ValidatedFormField
      {...props}
      type="date"
      min={min}
      max={max}
    />
  );
}

/**
 * TextAreaFormField - Specialized field for textarea inputs
 */
export interface TextAreaFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ValidatedFormFieldProps<TFieldValues, TName>, 'type'> {
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

export function TextAreaFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  rows = 4,
  maxLength,
  showCharCount = false,
  helperText,
  ...props
}: TextAreaFormFieldProps<TFieldValues, TName>) {
  
  const {
    field: { value },
  } = useController({
    name: props.name,
    control: props.control,
  });

  const charCount = typeof value === 'string' ? value.length : 0;
  const charCountText = maxLength 
    ? `${charCount}/${maxLength}`
    : `${charCount} characters`;

  const enhancedHelperText = showCharCount 
    ? `${helperText || ''} ${charCountText}`.trim()
    : helperText;

  return (
    <ValidatedFormField
      {...props}
      helperText={enhancedHelperText}
      // Note: We would need to extend FormField to support textarea
      // For now, this serves as a template for future implementation
    />
  );
}