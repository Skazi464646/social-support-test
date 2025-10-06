export interface AIAssistConstraints {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
}

export interface UseAIAssistProps {
  fieldName: string;
  fieldLabel: string;
  initialValue?: string;
  userContext?: any;
  fieldConstraints?: AIAssistConstraints;
  onValueChange?: (value: string) => void;
}

export interface UseAIAssistReturn {
  isModalOpen: boolean;
  currentValue: string;
  openModal: () => void;
  closeModal: () => void;
  handleAccept: (value: string) => void;
  updateValue: (value: string) => void;
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
    fieldName: string;
    fieldLabel: string;
    currentValue: string;
    onAccept: (value: string) => void;
    userContext?: any;
    intelligentContext?: any;
    fieldConstraints?: AIAssistConstraints;
  };
}

