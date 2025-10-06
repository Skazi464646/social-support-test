import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { AIEnhancedInputFooter } from './AIEnhancedInputFooter';

interface AIEnhancedInputViewProps {
  type: 'text' | 'email' | 'tel';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength: number;
  disabled: boolean;
  className?: string;
  error?: string;
  characterCount: number;
  showCharacterCount: boolean;
  onOpenAssist: () => void;
  showAssistButton: boolean;
}

export const AIEnhancedInputView = forwardRef<HTMLInputElement, AIEnhancedInputViewProps>(
  (props, ref) => <InputViewContent {...props} innerRef={ref} />,
);

AIEnhancedInputView.displayName = 'AIEnhancedInputView';

interface InputViewContentProps extends AIEnhancedInputViewProps {
  innerRef: React.Ref<HTMLInputElement>;
}

function InputViewContent({
  innerRef,
  type,
  value,
  onChange,
  placeholder,
  maxLength,
  disabled,
  className,
  error,
  characterCount,
  showCharacterCount,
  onOpenAssist,
  showAssistButton,
}: InputViewContentProps) {
  return (
    <div className="space-y-1">
      <input
        ref={innerRef}
        type={type}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary',
          error ? 'border-destructive-border' : 'border-input',
          disabled ? 'bg-muted cursor-not-allowed text-text-tertiary' : 'bg-card',
          className,
        )}
      />

      {(showAssistButton || showCharacterCount || error) && (
        <AIEnhancedInputFooter
          disabled={disabled}
          error={error}
          characterCount={characterCount}
          maxLength={maxLength}
          showCharacterCount={showCharacterCount}
          onOpenAssist={onOpenAssist}
          showAssistButton={showAssistButton}
        />
      )}
    </div>
  );
}
