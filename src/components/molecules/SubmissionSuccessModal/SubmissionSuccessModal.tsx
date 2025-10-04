import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';
import { Check, Copy, X, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

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
  /** Callback for continuing with current application */
  onContinue: () => void;
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
  onContinue,
  isLoading = false,
}: SubmissionSuccessModalProps) {
  const { t } = useTranslation(['form', 'common']);
  const [copied, setCopied] = React.useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Focus management for accessibility
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
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

  const handleContinue = () => {
    onContinue();
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" 
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
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-green-500)] text-white shadow-sm">
                <Check className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  {t('submission_success')}
                </Dialog.Title>
                <p className="text-sm text-gray-600 mt-1 max-w-sm">
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
                className="h-9 w-9 text-gray-400 hover:text-gray-900"
                aria-label={t('common:actions.close')}
              >
                <X className="h-5 w-5" />
              </Button>
            </Dialog.Close>
          </div>

          <Dialog.Description id="submission-success-description" className="sr-only">
            Your application has been successfully submitted. Your application ID is {submissionDetails.applicationId}. 
            You can either start a new application or continue with other tasks.
          </Dialog.Description>

          {/* Application Details */}
          <div className="px-6 space-y-6">
            {/* Application ID */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {t('application_id')}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyApplicationId}
                    className="gap-2 flex-shrink-0 px-3 py-2 h-auto min-w-fit"
                    aria-label={`Copy application ID ${submissionDetails.applicationId}`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 text-sm">{t('common:actions.copied', 'Copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="text-sm">{t('common:actions.copy', 'Copy')}</span>
                      </>
                    )}
                  </Button>
                </div>
                <div className="w-full">
                  <p className="font-mono text-sm font-semibold text-blue-600 break-all leading-relaxed">
                    {submissionDetails.applicationId}
                  </p>
                </div>
              </div>
            </div>

            {/* Submission Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <Clock className="h-5 w-5 text-gray-500" aria-hidden="true" />
                <div>
                  <span className="font-medium text-gray-900">{t('common:submitted_at', 'Submitted at')}: </span>
                  <span className="text-gray-600">
                    {formatSubmissionDate(submissionDetails.submittedAt)}
                  </span>
                </div>
              </div>
              
              {submissionDetails.estimatedProcessingTime && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <FileText className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-gray-900">{t('processing_time', 'Processing time')}: </span>
                    <span className="text-gray-600">
                      {submissionDetails.estimatedProcessingTime}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Next Steps */}
            {submissionDetails.nextSteps && submissionDetails.nextSteps.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900">
                  {t('next_steps', 'Next Steps')}:
                </p>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <ul className="space-y-2 text-sm">
                    {submissionDetails.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                        <span className="text-gray-600">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Confirmation Email Notice */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                <strong>A confirmation email has been sent to your registered email address.</strong>
              </p>
            </div>

          </div>

          {/* Spacer */}
          <div className="h-6"></div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 p-6 bg-gray-50 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleContinue}
              disabled={isLoading}
              className="flex-1 h-11"
            >
              <span>{t('common:actions.continue', 'Continue')}</span>
            </Button>
            
            <Button
            variant={'outline'}
              onClick={handleStartNew}
              disabled={isLoading}
              isLoading={isLoading}
              className="flex-1 gap-2 h-11"
            >
              {t('start_new_application', 'Start New Application')}
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center px-6 pb-6 bg-gray-50">
            <p className="text-xs text-gray-500">
              {t('application_reference_note', 'Please save your application ID for future reference')}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SubmissionSuccessModal;