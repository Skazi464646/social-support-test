import { cn } from '@/lib/utils';

interface TextareaFooterProps {
  disabled: boolean;
  error?: string;
  characterCount: number;
  maxLength: number;
  minLength: number;
  isValidLength: boolean;
  showCharacterCount: boolean;
  onOpenAssist: () => void;
}

export function AIEnhancedTextareaFooter({
  disabled,
  error,
  characterCount,
  maxLength,
  minLength,
  isValidLength,
  showCharacterCount,
  onOpenAssist,
}: TextareaFooterProps) {
  return (
    <div className="flex flex-col gap-2 text-xs leading-snug sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <button
          type="button"
          onClick={onOpenAssist}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
          title="Get AI writing assistance"
        >
          <span>✨</span>
          <span>AI Assist</span>
        </button>
        {error && (
          <span className="font-medium text-destructive" role="alert">
            {error}
          </span>
        )}
      </div>

      {showCharacterCount && (
        <div className={cn('text-right font-medium', isValidLength ? 'text-text-secondary' : 'text-destructive')}>
          {characterCount}/{maxLength}
          {minLength > 0 && characterCount < minLength && (
            <span className="ml-1 text-destructive">(min: {minLength})</span>
          )}
        </div>
      )}
    </div>
  );
}

