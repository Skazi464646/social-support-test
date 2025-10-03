import { FieldPath, FieldValues, Control, RegisterOptions } from 'react-hook-form';
import { FormField, type FormFieldProps } from '@/components/molecules/FormField';
import { useController } from 'react-hook-form';
import { useFormBlur } from '@/context/FormBlurContext';
import { useDirection } from '@/hooks/useLanguage';

// =============================================================================
// TYPES
// =============================================================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

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
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'select' | 'checkbox' | 'checkbox-group' | 'textarea';
  options?: SelectOption[];
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
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
  type = 'text',
  options,
  rows = 4,
  maxLength,
  showCharCount = false,
  ...fieldProps
}: ValidatedFormFieldProps<TFieldValues, TName>) {
  
  const { onFieldBlur } = useFormBlur();
  const { isRTL: _ } = useDirection(); // RTL support available but not used in this component
  
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error, isDirty, isTouched },
  } = useController({
    name,
    control,
    rules,
    shouldUnregister,
  });

  const wrappedOnChange = (val: any) => {
    // Convert string numbers to actual numbers for number inputs
    if (type === 'number') {
      if (typeof val === 'string') {
        if (val === '') {
          // For number fields, send empty string to let schema handle it
          onChange('');
        } else {
          const numericValue = parseFloat(val);
          if (isNaN(numericValue)) {
            // Keep invalid values as strings so validation can catch them
            onChange(val);
          } else {
            // Always send the string value - let the schema handle the conversion
            // This ensures the schema's transform function gets the raw input
            onChange(val);
          }
        }
      } else {
        onChange(val);
      }
    } else {
      onChange(val);
    }
  };

  const wrappedOnBlur = () => {
    // Call the form's onBlur first
    onBlur();
    // Then call our custom onFieldBlur for auto-save
    onFieldBlur();
  };

  const hasError = !!error;
  const errorMessage = error?.message;
  
  // Determine field direction based on type
  const getFieldDir = () => {
    // These field types should always be LTR regardless of page direction
    const ltrFields = ['email', 'tel', 'number', 'date'];
    if (ltrFields.includes(type)) {
      return 'ltr';
    }
    // For other fields, use auto to let the browser decide based on content
    return 'auto';
  };
  
  const fieldDir = getFieldDir();

  // Render checkbox field
  if (type === 'checkbox') {
    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="checkbox"
          checked={!!value}
          onChange={(e) => wrappedOnChange(e.target.checked)}
          onBlur={wrappedOnBlur}
          aria-invalid={hasError}
          data-dirty={isDirty}
          data-touched={isTouched}
          dir={fieldDir}
          className="rounded border-input text-primary focus:ring-ring focus:ring-2"
        />
      </div>
    );
  }

  // Render checkbox group field
  if (type === 'checkbox-group' && options) {
    const currentValue: string[] = Array.isArray(value) ? value : [];
    
    const handleCheckboxChange = (optionValue: string, isChecked: boolean) => {
      let newValue: string[];
      
      if (isChecked) {
        // Add the value if it's not already in the array
        newValue = currentValue.includes(optionValue) 
          ? currentValue 
          : [...currentValue, optionValue];
      } else {
        // Remove the value from the array
        newValue = currentValue.filter((v: string) => v !== optionValue);
      }
      
      wrappedOnChange(newValue);
    };

    return (
      <FormField
        {...fieldProps}
        label={label}
        required={required}
        error={errorMessage}
        helperText={!hasError ? helperText : undefined}
        hasError={hasError}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((option) => {
            const isChecked = currentValue.includes(option.value);
            const checkboxId = `${name}-${option.value}`;
            
            return (
              <label 
                key={option.value} 
                htmlFor={checkboxId}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  id={checkboxId}
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                  onBlur={wrappedOnBlur}
                  disabled={option.disabled}
                  aria-invalid={hasError}
                  data-dirty={isDirty}
                  data-touched={isTouched}
                  dir={fieldDir}
                  className="rounded border-input text-primary focus:ring-ring focus:ring-2 disabled:opacity-50 disabled:pointer-events-none"
                />
                <span className="text-sm text-foreground select-none">
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </FormField>
    );
  }

  // Render select field
  if (type === 'select' && options) {
    return (
      <FormField
        {...fieldProps}
        label={label}
        required={required}
        error={errorMessage}
        helperText={!hasError ? helperText : undefined}
        hasError={hasError}
      >
        <select
          ref={ref}
          value={value || ''}
          onChange={(e) => wrappedOnChange(e.target.value)}
          onBlur={wrappedOnBlur}
          aria-invalid={hasError}
          data-dirty={isDirty}
          data-touched={isTouched}
          dir={fieldDir}
          className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:pointer-events-none"
        >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </FormField>
    );
  }

  // Render textarea field
  if (type === 'textarea') {
    const charCount = typeof value === 'string' ? value.length : 0;
    const charCountText = maxLength 
      ? `${charCount}/${maxLength}`
      : `${charCount} characters`;

    const enhancedHelperText = showCharCount 
      ? `${helperText || ''} ${charCountText}`.trim()
      : helperText;

    return (
      <FormField
        {...fieldProps}
        label={label}
        required={required}
        error={errorMessage}
        helperText={!hasError ? enhancedHelperText : undefined}
        hasError={hasError}
      >
        <textarea
          ref={ref}
          value={value || ''}
          onChange={(e) => wrappedOnChange(e.target.value)}
          onBlur={wrappedOnBlur}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={hasError}
          data-dirty={isDirty}
          data-touched={isTouched}
          dir={fieldDir}
          className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:pointer-events-none resize-none"
        />
      </FormField>
    );
  }

  // Render regular input field
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
      onChange={wrappedOnChange}
      onBlur={wrappedOnBlur}
      type={type}
      aria-invalid={hasError}
      data-dirty={isDirty}
      data-touched={isTouched}
      dir={fieldDir}
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
  ...props
}: TextAreaFormFieldProps<TFieldValues, TName>) {
  return (
    <ValidatedFormField
      {...props}
      type="textarea"
      rows={rows}
      maxLength={maxLength}
      showCharCount={showCharCount}
    />
  );
}