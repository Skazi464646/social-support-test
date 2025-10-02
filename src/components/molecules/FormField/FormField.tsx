import * as React from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';
import { Label, type LabelProps } from '@/components/atoms/Label';
import { Input, type InputProps } from '@/components/atoms/Input';

interface UseFormFieldMetaParams {
  id?: string;
  error?: string;
  helperText?: string;
  hasError?: boolean;
}

interface FormFieldMeta {
  fieldId: string;
  describedBy?: string;
  fieldHasError: boolean;
}

function useFormFieldMeta({ id, error, helperText, hasError }: UseFormFieldMetaParams): FormFieldMeta {
  const generatedId = React.useId();
  const fieldId = id || generatedId;
  const fieldHasError = Boolean(error) || Boolean(hasError);
  const errorId = error ? `${fieldId}-error` : undefined;
  const helperTextId = helperText ? `${fieldId}-helper` : undefined;
  const describedBy = [errorId, helperTextId].filter(Boolean).join(' ') || undefined;

  return { fieldId, describedBy, fieldHasError };
}
export interface FormFieldProps extends Omit<InputProps, 'id' | 'children'> {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  labelProps?: Omit<LabelProps, 'htmlFor' | 'required'>;
  containerClassName?: string;
  children?: ReactNode;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>((props, ref) => {
  const { id, label, error, helperText, required = false, labelProps, containerClassName, className, hasError, children, ...inputProps } = props;
  const { isRTL } = useDirection();
  const { fieldId, describedBy, fieldHasError } = useFormFieldMeta({ id, error, helperText, hasError });

  const isRequired = Boolean(required);

  return (
    <FormFieldContent
      containerClassName={containerClassName}
      label={label}
      labelProps={labelProps}
      isRequired={isRequired}
      fieldId={fieldId}
      fieldHasError={fieldHasError}
      control={
        <FormFieldControl
          ref={ref}
          fieldId={fieldId}
          fieldHasError={fieldHasError}
          required={isRequired}
          className={className}
          describedBy={describedBy}
          inputProps={inputProps}
        >
          {children}
        </FormFieldControl>
      }
      error={error}
      helperText={helperText}
      isRTL={isRTL}
    />
  );
});
interface FormFieldControlProps {
  children?: ReactNode;
  fieldId: string;
  fieldHasError: boolean;
  required: boolean;
  className?: string;
  describedBy?: string;
  inputProps: Omit<InputProps, 'id' | 'hasError' | 'aria-describedby' | 'aria-invalid' | 'aria-required' | 'className'>;
}

const FormFieldControl = React.forwardRef<HTMLInputElement, FormFieldControlProps>(({
  children,
  fieldId,
  fieldHasError,
  required,
  className,
  describedBy,
  inputProps,
}, ref) => {
  if (children) {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        id: children.props.id ?? fieldId,
        'aria-invalid': fieldHasError,
        'aria-required': required,
        'aria-describedby': describedBy,
      });
    }
    return <>{children}</>;
  }
  return (
    <FormFieldInput
      fieldId={fieldId}
      ref={ref}
      fieldHasError={fieldHasError}
      required={required}
      className={className}
      inputProps={inputProps}
      describedBy={describedBy}
    />
  );
});

FormFieldControl.displayName = 'FormFieldControl';
interface FormFieldContentProps {
  containerClassName?: string;
  label?: string;
  labelProps?: Omit<LabelProps, 'htmlFor' | 'required'>;
  isRequired: boolean;
  fieldId: string;
  fieldHasError: boolean;
  control: ReactNode;
  error?: string;
  helperText?: string;
  isRTL: boolean;
}

const FormFieldContent = ({
  containerClassName,
  label,
  labelProps,
  isRequired,
  fieldId,
  fieldHasError,
  control,
  error,
  helperText,
  isRTL,
}: FormFieldContentProps) => (
  <div className={cn('space-y-2', containerClassName)}>
    <FormFieldLabel
      label={label}
      fieldId={fieldId}
      required={isRequired}
      fieldHasError={fieldHasError}
      labelProps={labelProps}
    />

    {control}

    <FormFieldMessages
      error={error}
      helperText={helperText}
      fieldId={fieldId}
      isRTL={isRTL}
    />
  </div>
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
  className?: string;
  inputProps: Omit<InputProps, 'id' | 'hasError' | 'aria-describedby' | 'aria-invalid' | 'aria-required' | 'className'>;
  describedBy?: string;
}>(({ fieldId, fieldHasError, required, className, inputProps, describedBy }, ref) => (
  <Input
    id={fieldId}
    ref={ref}
    hasError={fieldHasError}
    aria-describedby={describedBy}
    aria-invalid={fieldHasError}
    aria-required={required}
    className={className}
    {...inputProps}
  />
));
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
  return error ? (
    <p
      id={`${fieldId}-error`}
      className={cn('text-sm text-destructive text-red-600 dark:text-red-400', textAlignment)}
      role="alert"
      aria-live="polite"
    >
      {error}
    </p>
  ) : helperText ? (
    <p
      id={`${fieldId}-helper`}
      className={cn('text-sm text-muted-foreground', textAlignment)}
    >
      {helperText}
    </p>
  ) : null;
};

FormFieldInput.displayName = 'FormFieldInput';

FormField.displayName = 'FormField';

export { FormField };
