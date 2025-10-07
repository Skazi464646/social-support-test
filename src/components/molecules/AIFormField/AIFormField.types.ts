/**
 * AI Form Field Component Types
 */

import type { Control } from 'react-hook-form';

export interface AIFormFieldProps {
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

