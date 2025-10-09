/**
 * AI Assist Modal Component Types
 */

export interface AIAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string;
  fieldLabel: string;
  currentValue: string;
  onAccept: (value: string) => void;
  userContext?: any;
  intelligentContext?: any;
  fieldConstraints?: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  };
}

export interface Suggestion {
  id: string;
  text: string;
  isEdited: boolean;
  confidence?: number;
}


export type AiAssistModalFooterProps = {
  onClose:()=>void,
  acceptSuggestion:()=>void
  editedText:string
  isValidLength:boolean
}
