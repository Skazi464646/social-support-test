
import { useTranslation } from 'react-i18next';

interface InputFooterProps {
  disabled: boolean;
  error?: string;
  characterCount: number;
  maxLength: number;
  showCharacterCount: boolean;
  onOpenAssist: () => void;
  showAssistButton: boolean;
}

export function AIEnhancedInputFooter({
  disabled,
  error,
  characterCount,
  maxLength,
  showCharacterCount,
  onOpenAssist,
  showAssistButton,
}: InputFooterProps) {
  const { t } = useTranslation(['common']);
  return (
    <div className="flex flex-col gap-2 text-xs leading-snug sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        {showAssistButton && (
          <button
            type="button"
            onClick={onOpenAssist}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm transition-all duration-200 w-fit bg-primary text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Get AI writing assistance"
          >
            <span className="text-sm">✨</span>
            <span>{t('ai_assist', 'AI Assist')}</span>
          </button>
        )}
        {error && (
          <span className="font-medium text-destructive" role="alert">
            {error}
          </span>
        )}
      </div>

      {showCharacterCount && (
        <div className="text-text-secondary sm:text-right font-medium">
          {characterCount}/{maxLength}
        </div>
      )}
    </div>
  );
}

