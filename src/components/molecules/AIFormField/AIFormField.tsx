/**
 * AI-Enhanced Form Field Component
 * Module 5 - Step 5: Integrate AI Assistance with Form Fields
 */

import { forwardRef } from 'react';
import { useController } from 'react-hook-form';
import { AIEnhancedTextarea } from '@/components/molecules/AIEnhancedTextarea';
import { FORM_MESSAGES } from '@/constants';
import type { AIFormFieldProps } from './AIFormField.types';

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
    minLength = 20,
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
      rules: { required: required ? FORM_MESSAGES.required : false },
    });

    return (
      <div className={className}>
        <label className="block text-sm font-medium text-text-primary mb-1">
          {label}
          {required && <span className="text-destructive ml-1">{FORM_MESSAGES.requiredStar}</span>}
        </label>
        
        {helperText && (
          <p className="text-xs text-text-tertiary mb-2 leading-snug">{helperText}</p>
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
