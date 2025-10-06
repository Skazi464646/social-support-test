import { forwardRef, lazy, Suspense } from 'react';
import { useAIAssist } from '@/hooks/useAIAssist';
import { AIEnhancedTextareaView } from './AIEnhancedTextareaView';

const AIAssistModal = lazy(() =>
  import('@/components/organisms/AIAssistModal').then(module => ({
    default: module.AIAssistModal,
  })),
);

interface AIEnhancedTextareaProps {
  fieldName: string;
  fieldLabel: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  userContext?: any;
  error?: string;
}

export const AIEnhancedTextarea = forwardRef<HTMLTextAreaElement, AIEnhancedTextareaProps>(
  (props, ref) => {
    const { modalProps, openModal, updateValue } = useAIAssistTransform(props);
    const layoutProps = createLayoutProps(props, updateValue, openModal, modalProps);
    return <TextareaLayout ref={ref} {...layoutProps} />;
  },
);

AIEnhancedTextarea.displayName = 'AIEnhancedTextarea';

interface TextareaLayoutProps {
  viewProps: React.ComponentProps<typeof AIEnhancedTextareaView>;
  modalProps: React.ComponentProps<typeof AIAssistModal>;
}

const TextareaLayout = forwardRef<HTMLTextAreaElement, TextareaLayoutProps>(
  ({ viewProps, modalProps }, ref) => (
    <div className="relative">
      <AIEnhancedTextareaView ref={ref} {...viewProps} />
      <Suspense fallback={null}>
        <AIAssistModal {...modalProps} />
      </Suspense>
    </div>
  ),
);

TextareaLayout.displayName = 'TextareaLayout';

function useAIAssistTransform({
  fieldName,
  fieldLabel,
  value,
  onChange,
  userContext,
  minLength,
  maxLength,
  required,
}: AIEnhancedTextareaProps) {
  return useAIAssist({
    fieldName,
    fieldLabel,
    initialValue: value,
    userContext,
    fieldConstraints: { minLength, maxLength, required },
    onValueChange: onChange,
  });
}

function createLayoutProps(
  props: AIEnhancedTextareaProps,
  updateValue: (value: string) => void,
  openModal: () => void,
  modalProps: React.ComponentProps<typeof AIAssistModal>,
): TextareaLayoutProps {
  const {
    value,
    placeholder,
    rows = 4,
    maxLength = 1000,
    minLength = 50,
    disabled = false,
    className = '',
    error,
  } = props;

  const metrics = getTextareaMetrics(value, minLength, maxLength);

  return {
    viewProps: {
      value,
      onChange: updateValue,
      placeholder,
      rows,
      maxLength,
      disabled,
      className,
      error,
      characterCount: metrics.characterCount,
      minLength,
      isValidLength: metrics.isValidLength,
      showCharacterCount: metrics.showCharacterCount,
      onOpenAssist: openModal,
    },
    modalProps,
  };
}

function getTextareaMetrics(value: string, minLength: number, maxLength: number) {
  const characterCount = value.length;
  const isValidLength = characterCount >= minLength && characterCount <= maxLength;
  const showCharacterCount = maxLength > 0;

  return { characterCount, isValidLength, showCharacterCount };
}
