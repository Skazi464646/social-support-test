import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEY } from '@/constants/internationalization';

export interface ModalHeaderProps {
  title: string;
  description?: string;
  onClose: () => void;
  closeAriaLabel?: string;
  className?: string;
}

export function ModalHeader({
  title,
  description,
  onClose,
  closeAriaLabel,
  className
}: ModalHeaderProps) {
  const { t } = useTranslation(['common']);
  
  // Use translated close aria label if not provided
  const ariaLabel = closeAriaLabel || t(TRANSLATION_KEY.modalHeader.close_aria_label, 'Close modal');
  return (
    <div className={cn('border-b border-border px-6 py-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 id="modal-title" className="text-xl font-semibold text-text-primary">
            {title}
          </h2>
          {description && (
            <p id="modal-description" className="text-sm text-text-secondary mt-1">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-text-tertiary hover:text-text-secondary transition-colors"
          aria-label={ariaLabel}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
