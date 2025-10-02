import { useCallback, useEffect, useState, useRef } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFormWizard } from '@/context/FormWizardContext';
import { FormBlurProvider } from '@/context/FormBlurContext';
import { useStep1Form, useStep2Form, useStep3Form } from '@/hooks/useFormValidation';
import { Button } from '@/components/atoms/Button';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { Card } from '@/components/molecules/Card';
import { FormNavigation } from '@/components/molecules/FormNavigation';
import { useToast } from '@/context/ToastContext';
import { formSubmissionService, formatSubmissionError, FormSubmissionError } from '@/lib/api/form-submission';
import { FormStep1 } from '@/components/organisms/FormStep1';
import { FormStep2 } from '@/components/organisms/FormStep2';
import { FormStep3 } from '@/components/organisms/FormStep3';
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

  // Track if we've loaded data from localStorage
  const hasLoadedFromStorageRef = useRef<boolean>(false);
  const [formsInitialized, setFormsInitialized] = useState(false);

  // Step-specific form hooks - initialize with empty defaults first
  const step1Form = useStep1Form();
  const step2Form = useStep2Form();
  const step3Form = useStep3Form();

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

  // Initialize forms with localStorage data once it's loaded
  useEffect(() => {
    // Wait for localStorage data to be loaded (using the isLoaded flag)
    if (!hasLoadedFromStorageRef.current && state.isLoaded) {
      hasLoadedFromStorageRef.current = true;
      
      if (import.meta.env.DEV) {
        console.log('[FormWizard] Initializing forms with localStorage data:', state.formData);
      }
      
      // Reset all forms with their respective data (only if data exists)
      if (state.formData.step1 && Object.keys(state.formData.step1).length > 0) {
        step1Form.reset(state.formData.step1);
      }
      if (state.formData.step2 && Object.keys(state.formData.step2).length > 0) {
        step2Form.reset(state.formData.step2);
      }
      if (state.formData.step3 && Object.keys(state.formData.step3).length > 0) {
        step3Form.reset(state.formData.step3);
      }
      
      setFormsInitialized(true);
    }
  }, [state.isLoaded, state.formData]); // Watch for isLoaded flag

  // Pre-fill when switching steps (if data exists for that step and forms are initialized)
  useEffect(() => {
    if (formsInitialized) {
      const stepKey = `step${state.currentStep}` as keyof FormStepData;
      const stepData = state.formData[stepKey];
      
      if (stepData && Object.keys(stepData).length > 0) {
        if (import.meta.env.DEV) {
          console.log(`[FormWizard] Pre-filling Step ${state.currentStep} on step change`);
        }
        currentForm.reset(stepData);
      }
    }
  }, [state.currentStep, formsInitialized]); // Watch for step changes after forms are initialized

  // Save form data on blur (simple and clean)
  const handleFieldBlur = useCallback(() => {
    const currentData = currentForm.getValues();
    if (currentData && Object.keys(currentData).length > 0) {
      const stepKey = `step${state.currentStep}` as keyof FormStepData;
      
      if (import.meta.env.DEV) {
        console.log(`[FormWizard] Auto-saving Step ${state.currentStep} on field blur`);
      }
      
      updateFormData({ [stepKey]: currentData });
    }
  }, [state.currentStep, updateFormData, currentForm]);

  // Handle step submission
  const handleStepSubmit = async (data: Step1FormData | Step2FormData | Step3FormData) => {
    try {
      console.log('=== STEP SUBMISSION ===');
      console.log('Current step:', state.currentStep);
      console.log('Form submission data:', data);
      console.log('Form errors:', currentForm.formState.errors);
      console.log('Form isValid:', currentForm.formState.isValid);
      console.log('Form isDirty:', currentForm.formState.isDirty);
      console.log('Form values:', currentForm.getValues());
      
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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
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
      <div className="mb-4 flex justify-end text-end">
        <AutoSaveIndicator />
      </div>

      {/* Form Card */}
      <Card className="p-6 mb-6">
        <FormProvider {...(currentForm as any)}>
          <FormBlurProvider onFieldBlur={handleFieldBlur}>
            <form onSubmit={currentForm.handleSubmit(handleStepSubmit)}>
              {/* Step Content */}
              <div className="space-y-6">
                {state.currentStep === 1 && <FormStep1 />}
                {state.currentStep === 2 && <FormStep2 />}
                {state.currentStep === 3 && <FormStep3 />}
              </div>

            {/* Navigation */}
            <FormNavigation
              currentStep={state.currentStep}
              completedSteps={state.completedSteps}
              isSubmitting={submissionState.isSubmitting}
              isSubmitted={Boolean(submissionState.applicationId && state.currentStep === 3)}
              hasError={Boolean(submissionState.error && state.currentStep === 3)}
              onPrevious={handlePrevious}
              onRetry={handleRetrySubmission}
              onDebug={import.meta.env.DEV ? () => {
                console.log('=== DEBUG INFO ===');
                console.log('Current step:', state.currentStep);
                console.log('Form data:', currentForm.getValues());
                console.log('Form errors:', currentForm.formState.errors);
                console.log('Form isValid:', currentForm.formState.isValid);
                console.log('Form isDirty:', currentForm.formState.isDirty);
                console.log('Form touchedFields:', currentForm.formState.touchedFields);
                
                if (state.currentStep === 2) {
                  const values = currentForm.getValues() as any;
                  console.log('--- STEP 2 SPECIFIC DEBUG ---');
                  console.log('numberOfDependents:', values.numberOfDependents, typeof values.numberOfDependents);
                  console.log('monthlyIncome:', values.monthlyIncome, typeof values.monthlyIncome);
                  console.log('receivingBenefits:', values.receivingBenefits, typeof values.receivingBenefits);
                  console.log('maritalStatus:', values.maritalStatus);
                  console.log('employmentStatus:', values.employmentStatus);
                }
              } : undefined}
            />
          </form>
          </FormBlurProvider>
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