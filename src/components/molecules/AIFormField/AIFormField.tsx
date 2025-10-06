/**
 * AI-Enhanced Form Field Component
 * Module 5 - Step 5: Integrate AI Assistance with Form Fields
 */

import { forwardRef } from 'react';
import { Control, useController } from 'react-hook-form';
import { AIEnhancedTextarea } from '@/components/molecules/AIEnhancedTextarea';

interface AIFormFieldProps {
  name: string;
  control: Control<any>;
  label?: string;
  helperText?: string;
  placeholder?: string;
  fieldName?: string;
  rows?: number;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  userContext?: any;
  className?: string;
}

export const AIFormField = forwardRef<HTMLTextAreaElement, AIFormFieldProps>(
  ({
    name,
    control,
    label,
    helperText,
    placeholder,
    fieldName,
    rows = 6,
    maxLength = 2000,
    minLength = 50,
    required = false,
    userContext = {},
    className = '',
  }, ref) => {
    const {
      field: { value, onChange },
      fieldState: { error },
    } = useController({
      name,
      control,
      rules: { required: required ? 'This field is required' : false },
    });

    return (
      <div className={className}>
        <label className="block text-sm font-medium text-text-primary mb-1">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        
        {helperText && (
          <p className="text-xs text-text-secondary mb-2">{helperText}</p>
        )}
        
        <AIEnhancedTextarea
          ref={ref}
          fieldName={fieldName|| ''}
          fieldLabel={label || ''}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          minLength={minLength}
          required={required}
          userContext={userContext}
          error={error?.message}
        />
      </div>
    );
  }
);

AIFormField.displayName = 'AIFormField';
