/**
 * AI Enhanced Input Component Types
 */

export interface AIEnhancedInputProps {
  fieldName: string;
  fieldLabel: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  type?: 'text' | 'email' | 'tel';
  required?: boolean;
  disabled?: boolean;
  className?: string;
  userContext?: any;
  error?: string;
  showAIAssist?: boolean; // Option to show/hide AI assist for specific fields
}

