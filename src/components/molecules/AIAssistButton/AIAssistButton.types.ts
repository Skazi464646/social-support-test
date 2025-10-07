/**
 * AI Assist Button Component Types
 */

export interface AIAssistButtonProps {
  fieldName: string;
  currentValue: string;
  onSuggestionAccept: (suggestion: string) => void;
  userContext?: any;
  className?: string;
}

