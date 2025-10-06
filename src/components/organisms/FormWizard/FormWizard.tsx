import { useCallback, useEffect, useState, useRef, Suspense, lazy } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { useFormWizard } from '@/context/FormWizardContext';
import { FormBlurProvider } from '@/context/FormBlurContext';
import { useStep1Form, useStep2Form, useStep3Form } from '@/hooks/useFormValidation';
import { Button } from '@/components/atoms/Button';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { Card } from '@/components/molecules/Card';
import { FormNavigation } from '@/components/molecules/FormNavigation';
import { SubmissionSuccessModal } from '@/components/molecules/SubmissionSuccessModal';
import type { SubmissionDetails } from '@/components/molecules/SubmissionSuccessModal';
import { formSubmissionService, formatSubmissionError, FormSubmissionError } from '@/lib/api/form-submission';
import type { Step1FormData, Step2FormData, Step3FormData, CompleteFormData, FormStepData } from '@/lib/validation/schemas';

// =============================================================================
// LAZY IMPORTS - Code Splitting for Form Steps
// =============================================================================

// Lazy load form steps for better performance
const FormStep1 = lazy(() => 
  import('@/components/organisms/FormStep1').then(module => ({ default: module.FormStep1 }))
);

const FormStep2 = lazy(() => 
  import('@/components/organisms/FormStep2').then(module => ({ default: module.FormStep2 }))
);

const FormStep3 = lazy(() => 
  import('@/components/organisms/FormStep3').then(module => ({ default: module.FormStep3 }))
);

// =============================================================================
// LOADING AND ERROR COMPONENTS
// =============================================================================

const FormStepSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-2">
      <div className="h-8 bg-muted rounded w-1/3"></div>
      <div className="h-4 bg-muted rounded w-2/3"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      ))}
    </div>
    
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const FormStepErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const { t } = useTranslation(['form', 'common']);
  
  return (
    <div className="text-center py-12 space-y-4">
      <div className="text-destructive text-4xl">⚠️</div>
      <h3 className="text-lg font-semibold text-foreground">
        {t('common.error_loading_step', 'Error Loading Form Step')}
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        {t('common.error_loading_step_description', 'There was an error loading this form step. Please try again.')}
      </p>
      <div className="space-x-2">
        <Button variant="outline" onClick={resetErrorBoundary}>
          {t('common.retry', 'Try Again')}
        </Button>
        <Button variant="ghost" onClick={() => window.location.reload()}>
          {t('common.reload_page', 'Reload Page')}
        </Button>
      </div>
      {import.meta.env.DEV && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-muted-foreground">
            Debug Info (Development)
          </summary>
          <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto">
            {error.message}
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
};

// =============================================================================
// PREFETCHING LOGIC
// =============================================================================

const usePrefetchNextStep = (currentStep: number) => {
  useEffect(() => {
    const prefetchTimer = setTimeout(() => {
      if (currentStep === 1) {
        // Prefetch FormStep2 when on step 1
        import('@/components/organisms/FormStep2');
      } else if (currentStep === 2) {
        // Prefetch FormStep3 when on step 2
        import('@/components/organisms/FormStep3');
      }
    }, 1000); // 1 second delay

    return () => clearTimeout(prefetchTimer);
  }, [currentStep]);
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function FormWizard() {
  const { t, i18n } = useTranslation(['form', 'common']);
  const { state, nextStep, previousStep, updateFormData, markStepComplete, resetForm, dispatch } = useFormWizard();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState<SubmissionDetails | null>(null);
  const [testMode, setTestMode] = useState<string | null>(null);
  const [submissionState, setSubmissionState] = useState<{
    isSubmitting: boolean;
    applicationId?: string;
    error?: FormSubmissionError;
  }>({ isSubmitting: false });

  const hasLoadedFromStorageRef = useRef<boolean>(false);
  const [formsInitialized, setFormsInitialized] = useState(false);

  usePrefetchNextStep(state.currentStep);

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
        // Navigate to next step with force parameter since we just validated
        nextStep(true);
      }
    } catch (error) {
      console.error('Step submission error:', error);
      // Handle step submission errors (could add specific error handling here)
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
      let response;
      if (import.meta.env.DEV) {
        // In development, check if test mode is enabled
        if (testMode) {
          const testUrl = `/api/submit?test=${testMode}`;
          response = await formSubmissionService.submitApplicationWithUrl(completeFormData, testUrl);
        } else {
          response = await formSubmissionService.submitApplicationMock(completeFormData);
        }
      } else {
        response = await formSubmissionService.submitApplication(completeFormData);
      }

      // Success handling - prepare modal data
      const submissionDetails: SubmissionDetails = {
        applicationId: response.applicationId,
        submittedAt: new Date().toISOString(),
        estimatedProcessingTime: response.processingTime || '5-7 business days',
        nextSteps: [
          'We will review your application within 2 business days',
          'You will receive email updates on your application status',
          'Keep your application ID for future reference'
        ],
        message: t('submission_success_message', { applicationId: response.applicationId })
      };

      setSubmissionDetails(submissionDetails);
      setSubmissionState({
        isSubmitting: false,
        applicationId: response.applicationId,
      });
      setShowSuccessModal(true);

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

      console.error('Form submission error:', submissionError);
      // Error handling - keep existing error cards for now
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

  // Handle starting a new application
  const handleStartNewApplication = () => {
    setShowSuccessModal(false);
    setSubmissionDetails(null);
    setSubmissionState({ isSubmitting: false });
    
    // Reset all form state and localStorage
    resetForm();
    
    // Reset all individual form states with empty default values
    step1Form.reset({
      fullName: '',
      nationalId: '',
      dateOfBirth: '',
      gender: undefined,
      address: '',
      city: '',
      state: '',
      country: '',
      phone: '',
      email: ''
    });
    step2Form.reset({
      maritalStatus: undefined,
      numberOfDependents: 0,
      employmentStatus: undefined,
      monthlyIncome: 0,
      housingStatus: undefined
    });
    
    step3Form.reset({
      financialSituation: '',
      employmentCircumstances: '',
      reasonForApplying: ''
    });
    
    // Navigate back to step 1
    dispatch({ type: 'SET_STEP', payload: 1 });
    
    // Smooth scroll to top for better UX
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle continue action (close modal and stay on current page)
  const handleContinue = () => {
    setShowSuccessModal(false);
    // Keep current state - user can view their submission details
  };

  // Auto-save indicator
  const AutoSaveIndicator = () => {
    if (!state.lastSaved) return null;
    
    const lastSavedDate = new Date(state.lastSaved);
    const timeAgo = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' }).format(
      Math.round((lastSavedDate.getTime() - Date.now()) / 60000),
      'minute'
    );

    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        {t('auto_saved')} {timeAgo}
      </div>
    );
  };

  // Render current step with error boundaries and suspense
  const renderCurrentStep = () => {
    const stepKey = `step${state.currentStep}-${i18n.language}`;
    
    return (
      <ErrorBoundary
        FallbackComponent={FormStepErrorFallback}
        resetKeys={[state.currentStep, i18n.language]}
        onError={(error) => {
          console.error(`Error in FormStep${state.currentStep}:`, error);
          // Track error in production for monitoring
          if (!import.meta.env.DEV) {
            // Add your error tracking service here
            // trackError(error, { step: state.currentStep, language: i18n.language });
          }
        }}
      >
        <Suspense fallback={<FormStepSkeleton />}>
          {state.currentStep === 1 && <FormStep1 key={stepKey} />}
          {state.currentStep === 2 && <FormStep2 key={stepKey} />}
          {state.currentStep === 3 && <FormStep3 key={stepKey} />}
        </Suspense>
      </ErrorBoundary>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">
          {t('description')}
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
        <FormProvider key={`form-${i18n.language}-${state.currentStep}`} {...(currentForm as any)}>
          <FormBlurProvider onFieldBlur={handleFieldBlur}>
            <form onSubmit={currentForm.handleSubmit(handleStepSubmit)}>
              {/* Step Content with Lazy Loading */}
              <div className="space-y-6">
                {renderCurrentStep()}
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

      {/* Submission Success Modal */}
      {submissionDetails && (
        <SubmissionSuccessModal
          open={showSuccessModal}
          onOpenChange={setShowSuccessModal}
          submissionDetails={submissionDetails}
          onStartNewApplication={handleStartNewApplication}
          onContinue={handleContinue}
          isLoading={false}
        />
      )}

      {/* Submission Error */}
      {submissionState.error && (
        <Card className="p-6 border border-destructive-border bg-destructive-light text-destructive-light-foreground">
          <div className="text-center">
            <div className="text-destructive text-2xl mb-2">✕</div>
            <h3 className="text-lg font-semibold text-destructive mb-2">
              {formatSubmissionError(submissionState.error).title}
            </h3>
            <p className="text-destructive mb-4 opacity-80">
              {formatSubmissionError(submissionState.error).message}
            </p>
            {formatSubmissionError(submissionState.error).action && (
              <Button
                variant="outline"
                onClick={handleRetrySubmission}
                disabled={submissionState.isSubmitting}
                className="border-destructive-border text-destructive hover:bg-destructive-light focus-visible:ring-destructive/30"
              >
                {formatSubmissionError(submissionState.error).action}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Test Mode Panel (Development only) */}
      {import.meta.env.DEV && (
        <div className="mt-8 space-y-4">
          <details>
            <summary className="text-sm text-muted-foreground cursor-pointer">
              🧪 Test Mode Panel (Development Only)
            </summary>
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-dashed space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Test Submission Scenarios:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { key: 'success', label: '✅ Success', desc: 'Normal success' },
                    { key: 'validation', label: '⚠️ Validation', desc: 'Validation error' },
                    { key: 'server', label: '❌ Server Error', desc: '500 error' },
                    { key: 'network', label: '🌐 Network', desc: 'Network failure' },
                    { key: 'unauthorized', label: '🔒 Unauthorized', desc: '401 error' },
                    { key: 'ratelimit', label: '⏱️ Rate Limit', desc: '429 error' },
                    { key: 'conflict', label: '⚡ Conflict', desc: '409 error' },
                    { key: 'slow', label: '🐌 Slow (5s)', desc: 'Slow response' },
                  ].map(({ key, label, desc }) => (
                    <Button
                      key={key}
                      variant={testMode === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTestMode(testMode === key ? null : key)}
                      title={desc}
                      className="text-xs h-auto py-2 px-3"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
                {testMode && (
                  <div className="mt-2 p-2 border border-warning-border bg-warning-light rounded text-sm text-warning-foreground">
                    <strong>Active Test Mode:</strong> {testMode} - The next form submission will use this test scenario
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Quick Actions:</h4>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Fill form with test data
                      const testData = {
                        fullName: 'John Doe Test',
                        nationalId: '1234567890',
                        email: 'test@example.com',
                        phone: '+971501234567',
                        address: '123 Test Street',
                        city: 'Dubai',
                        state: 'Dubai',
                        country: 'AE',
                        dateOfBirth: '1990-01-01',
                        gender: 'male' as const,
                      };
                      step1Form.reset(testData);
                      updateFormData({ step1: testData });
                      markStepComplete(1);
                    }}
                  >
                    Fill Step 1
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const testData = {
                        maritalStatus: 'single' as const,
                        numberOfDependents: 0,
                        employmentStatus: 'employed_full_time' as const,
                        occupation: 'Software Engineer',
                        employer: 'Tech Company',
                        monthlyIncome: 15000,
                        monthlyExpenses: 8000,
                        totalSavings: 50000,
                        totalDebt: 0,
                        housingStatus: 'rent' as const,
                        monthlyRent: 4000,
                        receivingBenefits: false,
                        previouslyApplied: false,
                      };
                      step2Form.reset(testData);
                      updateFormData({ step2: testData });
                      markStepComplete(2);
                    }}
                  >
                    Fill Step 2
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const testData = {
                        financialSituation: 'I am experiencing temporary financial difficulty due to unexpected medical expenses that have depleted my savings.',
                        employmentCircumstances: 'I am currently employed full-time as a software engineer, but recent medical bills have created financial strain.',
                        reasonForApplying: 'I am applying for social support to help cover basic living expenses while I recover from recent medical issues and rebuild my savings.',
                        additionalComments: 'I have documentation for medical expenses if needed.',
                        agreeToTerms: true,
                        consentToDataProcessing: true,
                        allowContactForClarification: true,
                      };
                      step3Form.reset(testData);
                      updateFormData({ step3: testData });
                      markStepComplete(3);
                    }}
                  >
                    Fill Step 3
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setTestMode(null);
                      resetForm();
                      step1Form.reset();
                      step2Form.reset();
                      step3Form.reset();
                    }}
                  >
                    Reset All
                  </Button>
                </div>
              </div>
            </div>
          </details>

          <details>
            <summary className="text-sm text-muted-foreground cursor-pointer">
              Debug Info (Development Only)
            </summary>
            <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify({
                currentStep: state.currentStep,
                completedSteps: Array.from(state.completedSteps),
                formDataKeys: Object.keys(state.formData),
                lastSaved: state.lastSaved,
                testMode,
                submissionState: {
                  isSubmitting: submissionState.isSubmitting,
                  applicationId: submissionState.applicationId,
                  errorCode: submissionState.error?.code,
                },
              }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
