import { forwardRef } from 'react';
import { AIAssistModal } from '@/components/organisms/AIAssistModal';
import { useAIAssist } from '@/hooks/useAIAssist';
import { AIEnhancedInputView } from './AIEnhancedInputView';

interface AIEnhancedInputProps {
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
  showAIAssist?: boolean;
}

export const AIEnhancedInput = forwardRef<HTMLInputElement, AIEnhancedInputProps>(
  ({
    fieldName,
    fieldLabel,
    value,
    onChange,
    placeholder,
    maxLength = 100,
    type = 'text',
    required = false,
    disabled = false,
    className,
    userContext,
    error,
    showAIAssist = true,
  }, ref) => {
    const { modalProps, openModal, updateValue } = useAIAssist({
      fieldName,
      fieldLabel,
      initialValue: value,
      userContext,
      fieldConstraints: { minLength: 0, maxLength, required },
      onValueChange: onChange,
    });

    const metrics = getInputMetrics(value, maxLength);
    const viewProps = {
      type,
      value,
      onChange: updateValue,
      placeholder,
      maxLength,
      disabled,
      className,
      error,
      characterCount: metrics.characterCount,
      showCharacterCount: metrics.showCharacterCount,
      onOpenAssist: openModal,
      showAssistButton: showAIAssist && ['text', 'email'].includes(type) && !disabled,
    };

    return (
      <div className="space-y-1">
        <AIEnhancedInputView ref={ref} {...viewProps} />
        {modalProps.isOpen && <AIAssistModal {...modalProps} />}
      </div>
    );
  },
);

AIEnhancedInput.displayName = 'AIEnhancedInput';

function getInputMetrics(value: string, maxLength: number) {
  const characterCount = value.length;
  const showCharacterCount = maxLength > 0 && maxLength <= 200;
  return { characterCount, showCharacterCount };
}
