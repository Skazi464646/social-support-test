import * as React from 'react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';
import { Label, type LabelProps } from '@/components/atoms/Label';
import { Input, type InputProps } from '@/components/atoms/Input';

export interface FormFieldProps extends Omit<InputProps, 'id'> {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  labelProps?: Omit<LabelProps, 'htmlFor' | 'required'>;
  containerClassName?: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (props, ref) => {
    const { 
      id,
      label,
      error,
      helperText,
      required = false,
      labelProps,
      containerClassName,
      className,
      hasError,
      ...inputProps 
    } = props;

    const { isRTL } = useDirection();
    const generatedId = React.useId();
    
    // Use provided ID or generate one
    const fieldId = id || generatedId;
    const fieldHasError = Boolean(error) || Boolean(hasError);
    
    return (
      <div className={cn('space-y-2', containerClassName)}>
        <FormFieldLabel 
          label={label}
          fieldId={fieldId}
          required={Boolean(required)}
          fieldHasError={fieldHasError}
          labelProps={labelProps}
        />
        
        <FormFieldInput
          fieldId={fieldId}
          ref={ref}
          fieldHasError={fieldHasError}
          required={Boolean(required)}
          error={error}
          helperText={helperText}
          className={className}
          inputProps={inputProps}
        />
        
        <FormFieldMessages
          error={error}
          helperText={helperText}
          fieldId={fieldId}
          isRTL={isRTL}
        />
      </div>
    );
  }
);

// Helper component for label
const FormFieldLabel = ({ 
  label, 
  fieldId, 
  required, 
  fieldHasError, 
  labelProps 
}: {
  label?: string;
  fieldId: string;
  required: boolean;
  fieldHasError: boolean;
  labelProps?: Omit<LabelProps, 'htmlFor' | 'required'>;
}) => {
  if (!label) {
    return null;
  }
  
  return (
    <Label
      htmlFor={fieldId}
      required={required}
      variant={fieldHasError ? 'error' : 'default'}
      {...labelProps}
    >
      {label}
    </Label>
  );
};

// Helper component for input
const FormFieldInput = React.forwardRef<HTMLInputElement, {
  fieldId: string;
  fieldHasError: boolean;
  required: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  inputProps: Omit<InputProps, 'id' | 'hasError' | 'aria-describedby' | 'aria-invalid' | 'aria-required' | 'className'>;
}>(({ fieldId, fieldHasError, required, error, helperText, className, inputProps }, ref) => {
  const errorId = error ? `${fieldId}-error` : undefined;
  const helperTextId = helperText ? `${fieldId}-helper` : undefined;
  const ariaDescribedBy = [errorId, helperTextId].filter(Boolean).join(' ') || undefined;
  
  return (
    <Input
      id={fieldId}
      ref={ref}
      hasError={fieldHasError}
      aria-describedby={ariaDescribedBy}
      aria-invalid={fieldHasError}
      aria-required={required}
      className={className}
      {...inputProps}
    />
  );
});

// Helper component for messages
const FormFieldMessages = ({ 
  error, 
  helperText, 
  fieldId, 
  isRTL 
}: {
  error?: string;
  helperText?: string;
  fieldId: string;
  isRTL: boolean;
}) => {
  const textAlignment = isRTL ? 'text-right' : 'text-left';
  
  if (error) {
    return (
      <p
        id={`${fieldId}-error`}
        className={cn('text-sm text-destructive', textAlignment)}
        role="alert"
        aria-live="polite"
      >
        {error}
      </p>
    );
  }
  
  if (helperText) {
    return (
      <p
        id={`${fieldId}-helper`}
        className={cn('text-sm text-muted-foreground', textAlignment)}
      >
        {helperText}
      </p>
    );
  }
  
  return null;
};

FormFieldInput.displayName = 'FormFieldInput';

FormField.displayName = 'FormField';

export { FormField };