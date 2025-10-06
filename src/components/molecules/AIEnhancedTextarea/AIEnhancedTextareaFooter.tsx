import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation(['common']);
  return (
    <div className="flex flex-col gap-3">
      {/* Top Row: Error message (left) and Character count (right) */}
      <div className="flex items-start justify-between text-xs leading-snug min-h-[1.25rem]">
        {/* Left: Validation/Error message */}
        <div className="flex-1">
          {error && (
            <span className="font-medium text-destructive" role="alert">
              {error}
            </span>
          )}
        </div>

        {/* Right: Character count */}
        {showCharacterCount && (
          <div className={cn('text-right font-medium flex-shrink-0', isValidLength ? 'text-muted-foreground' : 'text-destructive')}>
            {characterCount}/{maxLength}
            {minLength > 0 && characterCount < minLength && (
              <span className="ml-1 text-destructive">(min: {minLength})</span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Row: AI Assist button */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={onOpenAssist}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
          title="Get AI writing assistance"
        >
          <span>✨</span>
          <span>{t('ai_assist', 'AI Assist')}</span>
        </button>
      </div>
    </div>
  );
}

