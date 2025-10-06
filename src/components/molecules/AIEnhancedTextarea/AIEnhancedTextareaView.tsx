import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { AIEnhancedTextareaFooter } from './AIEnhancedTextareaFooter';

interface AIEnhancedTextareaViewProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows: number;
  maxLength: number;
  disabled: boolean;
  className?: string;
  error?: string;
  characterCount: number;
  minLength: number;
  isValidLength: boolean;
  showCharacterCount: boolean;
  onOpenAssist: () => void;
}

export const AIEnhancedTextareaView = forwardRef<HTMLTextAreaElement, AIEnhancedTextareaViewProps>(
  (props, ref) => <TextareaViewContent {...props} innerRef={ref} />,
);

AIEnhancedTextareaView.displayName = 'AIEnhancedTextareaView';

interface TextareaViewContentProps extends AIEnhancedTextareaViewProps {
  innerRef: React.Ref<HTMLTextAreaElement>;
}

function TextareaViewContent({
  innerRef,
  value,
  onChange,
  placeholder,
  rows,
  maxLength,
  disabled,
  className,
  error,
  characterCount,
  minLength,
  isValidLength,
  showCharacterCount,
  onOpenAssist,
}: TextareaViewContentProps) {
  return (
    <div className="flex flex-col gap-3">
      <textarea
        ref={innerRef}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary',
          error ? 'border-destructive-border' : 'border-input',
          disabled ? 'bg-muted cursor-not-allowed text-text-tertiary' : 'bg-card',
          className,
        )}
      />

      <AIEnhancedTextareaFooter
        disabled={disabled}
        error={error}
        characterCount={characterCount}
        maxLength={maxLength}
        minLength={minLength}
        isValidLength={isValidLength}
        showCharacterCount={showCharacterCount}
        onOpenAssist={onOpenAssist}
      />
    </div>
  );
}
