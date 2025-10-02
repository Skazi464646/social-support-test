import { useCallback, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFormWizard } from '@/context/FormWizardContext';
import { useStep1Form, useStep2Form, useStep3Form } from '@/hooks/useFormValidation';
import { Button } from '@/components/atoms/Button';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { Card } from '@/components/molecules/Card';
import { useToast } from '@/context/ToastContext';
import { formSubmissionService, formatSubmissionError, FormSubmissionError } from '@/lib/api/form-submission';
import { FormStep1 } from '@/components/organisms/FormStep1';
import { FormStep2 } from '@/components/organisms/FormStep2';
import { FormStep3 } from '@/components/organisms/FormStep3';
import { cn } from '@/lib/utils';
import type { Step1FormData, Step2FormData, Step3FormData, CompleteFormData, FormStepData } from '@/lib/validation/schemas';

// =============================================================================
// COMPONENT
// =============================================================================

export function FormWizard() {
  const { t } = useTranslation();
  const { state, nextStep, previousStep, updateFormData, markStepComplete, dispatch } = useFormWizard();
  const { success: showSuccess, error: showError } = useToast();
  const [submissionState, setSubmissionState] = useState<{
    isSubmitting: boolean;
    applicationId?: string;
    error?: FormSubmissionError;
  }>({ isSubmitting: false });

  // Step-specific form hooks
  const step1Form = useStep1Form({
    defaultValues: state.formData.step1,
  });

  const step2Form = useStep2Form({
    defaultValues: state.formData.step2,
  });

  const step3Form = useStep3Form({
    defaultValues: state.formData.step3,
  });

  // Get current form based on step
  const getCurrentForm = () => {
    switch (state.currentStep) {
      case 1: return step1Form;
      case 2: return step2Form;
      case 3: return step3Form;
      default: return step1Form;
    }
  };

  const currentForm = getCurrentForm();

  // Auto-save on form data change
  const handleAutoSave = useCallback((data: any) => {
    const stepKey = `step${state.currentStep}` as keyof FormStepData;
    updateFormData({ [stepKey]: data });
  }, [state.currentStep, updateFormData]);

  // Watch form changes for auto-save
  useEffect(() => {
    const subscription = currentForm.watch((data) => {
      if (data && Object.keys(data).length > 0) {
        handleAutoSave(data);
      }
    });
    return () => {
      if (typeof subscription === 'object' && subscription && 'unsubscribe' in subscription) {
        subscription.unsubscribe();
      }
    };
  }, [currentForm, handleAutoSave]);

  // Handle step submission
  const handleStepSubmit = async (data: Step1FormData | Step2FormData | Step3FormData) => {
    try {
      const stepKey = `step${state.currentStep}` as keyof FormStepData;
      
      // Update form data
      updateFormData({ [stepKey]: data });
      
      // Mark step as complete
      markStepComplete(state.currentStep);
      
      // If this is the final step, submit the complete form
      if (state.currentStep === 3) {
        await handleFinalSubmission({ [stepKey]: data });
      } else {
        // Show success message and navigate to next step
        showSuccess({
          title: t('form.step_completed'),
          description: t('form.step_saved_successfully'),
        });
        nextStep();
      }
    } catch (error) {
      console.error('Step submission error:', error);
      showError({
        title: t('form.error'),
        description: t('form.step_save_error'),
      });
    }
  };

  // Handle final form submission
  const handleFinalSubmission = async (finalStepData: Partial<FormStepData>) => {
    setSubmissionState({ isSubmitting: true });
    dispatch({ type: 'SET_SUBMITTING', payload: true });

    try {
      // Combine all form data
      const completeFormData: CompleteFormData = {
        ...state.formData,
        ...finalStepData,
      } as CompleteFormData;

      // Submit to service (using mock in development)
      const response = import.meta.env.DEV 
        ? await formSubmissionService.submitApplicationMock(completeFormData)
        : await formSubmissionService.submitApplication(completeFormData);

      // Success handling
      setSubmissionState({
        isSubmitting: false,
        applicationId: response.applicationId,
      });

      showSuccess({
        title: t('form.submission_success'),
        description: t('form.submission_success_message', { applicationId: response.applicationId }),
        duration: 10000,
      });

      // Clear form data from localStorage after successful submission
      localStorage.removeItem('formWizardData');

    } catch (error) {
      const submissionError = error instanceof FormSubmissionError 
        ? error 
        : new FormSubmissionError('UNKNOWN_ERROR', 'An unexpected error occurred');

      setSubmissionState({
        isSubmitting: false,
        error: submissionError,
      });

      const errorInfo = formatSubmissionError(submissionError);
      
      showError({
        title: errorInfo.title,
        description: errorInfo.message,
        duration: 8000,
      });

      console.error('Form submission error:', submissionError);
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  // Retry submission
  const handleRetrySubmission = () => {
    if (state.currentStep === 3) {
      currentForm.handleSubmit(handleStepSubmit)();
    }
  };

  // Handle back navigation
  const handlePrevious = () => {
    if (state.currentStep > 1) {
      previousStep();
    }
  };

  // Auto-save indicator
  const AutoSaveIndicator = () => {
    if (!state.lastSaved) return null;
    
    const lastSavedDate = new Date(state.lastSaved);
    const timeAgo = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((lastSavedDate.getTime() - Date.now()) / 60000),
      'minute'
    );

    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        {t('form.auto_saved')} {timeAgo}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('form.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('form.description')}
        </p>
      </div>

      {/* Progress Bar */}
      <ProgressBar 
        currentStep={state.currentStep} 
        totalSteps={3}
        completedSteps={state.completedSteps}
        className="mb-8"
      />

      {/* Auto-save indicator */}
      <div className="mb-4 flex justify-end">
        <AutoSaveIndicator />
      </div>

      {/* Form Card */}
      <Card className="p-6 mb-6">
        <FormProvider {...(currentForm as any)}>
          <form onSubmit={currentForm.handleSubmit(handleStepSubmit)}>
            {/* Step Content */}
            <div className="space-y-6">
              {state.currentStep === 1 && <FormStep1 />}
              {state.currentStep === 2 && <FormStep2 />}
              {state.currentStep === 3 && <FormStep3 />}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={state.currentStep === 1}
                className="min-w-[100px]"
              >
                {t('common.back')}
              </Button>

              <div className="flex items-center gap-4">
                {/* Step indicators */}
                <div className="flex gap-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                        step === state.currentStep && 'bg-primary text-primary-foreground',
                        step < state.currentStep && 'bg-green-500 text-white',
                        step > state.currentStep && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {state.completedSteps.has(step) ? '✓' : step}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {submissionState.error && state.currentStep === 3 && (
                    <Button
                    asChild
                      type="button"
                      variant="outline"
                      onClick={handleRetrySubmission}
                      disabled={submissionState.isSubmitting}
                      className="min-w-[100px]"
                    >
                      {t('common.retry')}
                    </Button>
                  )}
                  
                  <Button
                  
                    type="submit"
                    disabled={submissionState.isSubmitting || Boolean(submissionState.applicationId && state.currentStep === 3)}
                    isLoading={submissionState.isSubmitting}
                    className="min-w-[100px]"
                  >
                    {submissionState.applicationId && state.currentStep === 3
                      ? t('form.submitted')
                      : state.currentStep === 3 
                        ? t('common.submit') 
                        : t('common.next')
                    }
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </Card>

      {/* Submission Success */}
      {submissionState.applicationId && (
        <Card className="p-6 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <div className="text-center">
            <div className="text-green-600 dark:text-green-400 text-2xl mb-2">✓</div>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              {t('form.submission_success')}
            </h3>
            <p className="text-green-700 dark:text-green-300 mb-4">
              {t('form.application_id')}: <strong>{submissionState.applicationId}</strong>
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              {t('form.confirmation_email_sent')}
            </p>
          </div>
        </Card>
      )}

      {/* Submission Error */}
      {submissionState.error && (
        <Card className="p-6 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 text-2xl mb-2">✕</div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              {formatSubmissionError(submissionState.error).title}
            </h3>
            <p className="text-red-700 dark:text-red-300 mb-4">
              {formatSubmissionError(submissionState.error).message}
            </p>
            {formatSubmissionError(submissionState.error).action && (
              <Button
                variant="outline"
                onClick={handleRetrySubmission}
                disabled={submissionState.isSubmitting}
                className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
              >
                {formatSubmissionError(submissionState.error).action}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Debug Info (Development only) */}
      {import.meta.env.DEV && (
        <details className="mt-8">
          <summary className="text-sm text-muted-foreground cursor-pointer">
            Debug Info (Development Only)
          </summary>
          <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto">
            {JSON.stringify({
              currentStep: state.currentStep,
              completedSteps: Array.from(state.completedSteps),
              formDataKeys: Object.keys(state.formData),
              lastSaved: state.lastSaved,
              submissionState: {
                isSubmitting: submissionState.isSubmitting,
                applicationId: submissionState.applicationId,
                errorCode: submissionState.error?.code,
              },
            }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}