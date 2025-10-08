import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';
import { Check, Copy, X, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { useNoScrollBody } from '@/hooks';
import { cn } from '@/lib/utils';
import { SUBMISSION_SUCCESS_MODAL_COPY } from '@/constants/submissionSuccessModal';

// =============================================================================
// TYPES
// =============================================================================

export interface SubmissionDetails {
  applicationId: string;
  submittedAt: string;
  estimatedProcessingTime?: string;
  nextSteps?: string[];
  message?: string;
}

export interface SubmissionSuccessModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Submission details to display */
  submissionDetails: SubmissionDetails;
  /** Callback for starting a new application */
  onStartNewApplication: () => void;
  /** Whether actions are loading */
  isLoading?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SubmissionSuccessModal({
  open,
  onOpenChange,
  submissionDetails,
  onStartNewApplication,
  isLoading = false,
}: SubmissionSuccessModalProps) {
  const { t } = useTranslation(['form', 'common']);
  const [copied, setCopied] = React.useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Focus management for accessibility
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Prevent background scrolling when modal is open
  useNoScrollBody(open);
  
  useEffect(() => {
    if (open && closeButtonRef.current) {
      // Focus the close button when modal opens
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [open]);

  // Cleanup copy timeout
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyApplicationId = async () => {
    try {
      await navigator.clipboard.writeText(submissionDetails.applicationId);
      setCopied(true);
      
      // Reset copied state after 3 seconds
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback: select text for manual copy
      const textArea = document.createElement('textarea');
      textArea.value = submissionDetails.applicationId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 3000);
    }
  };

  const formatSubmissionDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const handleStartNew = () => {
    onStartNewApplication();
    onOpenChange(false);
  };


  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay 
          className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" 
        />
        <Dialog.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-white border border-gray-200 text-gray-900 shadow-2xl duration-200',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'rounded-xl overflow-hidden'
          )}
          aria-describedby="submission-success-description"
        >
          {/* Header with Close Button */}
          <div className="flex items-start justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-success-foreground shadow-sm">
                <Check className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-semibold text-text-primary">
                  {t('submission_success')}
                </Dialog.Title>
                <p className="text-sm text-text-secondary mt-1 max-w-sm">
                  {submissionDetails.message || t('submission_success_message', { 
                    applicationId: submissionDetails.applicationId 
                  })}
                </p>
              </div>
            </div>
            
            <Dialog.Close asChild>
              <Button
                ref={closeButtonRef}
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-text-tertiary hover:text-text-primary"
                aria-label={t('common:actions.close')}
              >
                <X className="h-5 w-5" />
              </Button>
            </Dialog.Close>
          </div>

          <Dialog.Description id="submission-success-description" className="sr-only">
            {SUBMISSION_SUCCESS_MODAL_COPY.description.prefix} {submissionDetails.applicationId}. {SUBMISSION_SUCCESS_MODAL_COPY.description.suffix}
          </Dialog.Description>

          {/* Application Details */}
          <div className="px-6 space-y-6">
            {/* Application ID */}
            <div className="rounded-lg border border-border bg-muted p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text-primary">
                    {t('application_id')}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyApplicationId}
                    className="gap-2 flex-shrink-0 px-3 py-2 h-auto min-w-fit"
                    aria-label={`${SUBMISSION_SUCCESS_MODAL_COPY.labels.copyAriaLabel} ${submissionDetails.applicationId}`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-black" />
                        <span className="text-black text-sm">{t('common:actions.copied', SUBMISSION_SUCCESS_MODAL_COPY.labels.copied)}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="text-sm">{t('common:actions.copy', SUBMISSION_SUCCESS_MODAL_COPY.labels.copy)}</span>
                      </>
                    )}
                  </Button>
                </div>
                <div className="w-full">
                  <p className="font-mono text-sm font-semibold text-primary break-all leading-relaxed">
                    {submissionDetails.applicationId}
                  </p>
                </div>
              </div>
            </div>

            {/* Submission Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                <Clock className="h-5 w-5 text-text-secondary" aria-hidden="true" />
                <div>
                  <span className="font-medium text-text-primary">{t('common:submitted_at', SUBMISSION_SUCCESS_MODAL_COPY.labels.submittedAt)}: </span>
                  <span className="text-text-secondary">
                    {formatSubmissionDate(submissionDetails.submittedAt)}
                  </span>
                </div>
              </div>
              
              {submissionDetails.estimatedProcessingTime && (
                <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                  <FileText className="h-5 w-5 text-text-secondary" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-text-primary">{t('processing_time', SUBMISSION_SUCCESS_MODAL_COPY.labels.processingTime)}: </span>
                    <span className="text-text-secondary">
                      {submissionDetails.estimatedProcessingTime}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Next Steps */}
            {submissionDetails.nextSteps && submissionDetails.nextSteps.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-text-primary">
                  {t('next_steps', SUBMISSION_SUCCESS_MODAL_COPY.labels.nextSteps)}:
                </p>
                <div className="bg-card rounded-lg border border-border p-4">
                  <ul className="space-y-2 text-sm">
                    {submissionDetails.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-text-secondary">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Confirmation Email Notice */}
            <div className="rounded-lg border border-info-border bg-info-light p-4">
              <p className="text-sm text-info-foreground">
                <strong>{SUBMISSION_SUCCESS_MODAL_COPY.labels.confirmationEmail}</strong>
              </p>
            </div>

          </div>

          {/* Spacer */}
          <div className="h-6"></div>
          
          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 p-6 bg-muted border-t border-border">  
            <Button
            variant={'outline'}
              onClick={handleStartNew}
              disabled={isLoading}
              isLoading={isLoading}
              className="flex-1 gap-2 h-11"
            >
              {t('start_new_application', SUBMISSION_SUCCESS_MODAL_COPY.actions.startNewApplication)}
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center px-6 pb-6 bg-muted">
            <p className="text-xs text-text-secondary">
              {t('application_reference_note', SUBMISSION_SUCCESS_MODAL_COPY.labels.referenceNote)}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SubmissionSuccessModal;