import type { CompleteFormData } from '@/lib/validation/schemas';
import { z } from 'zod';
import { apiClient, retryRequest } from './axios-config';
import { ERROR_MESSAGES, ERROR_TITLES, ERROR_ACTIONS, SUBMISSION_METADATA, MOCK_SUBMISSION, FORM_MESSAGES } from '@/constants';

// =============================================================================
// TYPES
// =============================================================================

export interface SubmissionResponse {
  success: boolean;
  applicationId: string;
  message: string;
  submittedAt: string;
  processingTime?: string;
}

export interface SubmissionError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

export class FormSubmissionError extends Error {
  constructor(
    public code: string,
    message: string,
    public field?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'FormSubmissionError';
  }
}

// =============================================================================
// VALIDATION
// =============================================================================

async function validateCompleteForm(data: unknown): Promise<CompleteFormData> {
  try {
    // Import schemas dynamically to avoid circular imports
    const { completeFormSchema } = await import('@/lib/validation/schemas');
    return completeFormSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      throw new FormSubmissionError(
        'VALIDATION_ERROR',
        ERROR_MESSAGES.validation.failed(firstError?.message || ERROR_MESSAGES.validation.invalidData),
        firstError?.path?.join('.'),
        { errors: error.issues }
      );
    }
    throw error;
  }
}

// =============================================================================
// SUBMISSION SERVICE
// =============================================================================

export class FormSubmissionService {
  /**
   * Submit complete form application
   */
  async submitApplication(formData: CompleteFormData): Promise<SubmissionResponse> {
    try {
      // Validate complete form data
      const validatedData = await validateCompleteForm(formData);

      // Submit to API with retry logic
      const response = await retryRequest(() =>
        apiClient.post<SubmissionResponse>(
          '/applications/submit',
          {
            formData: validatedData,
            submittedAt: new Date().toISOString(),
            metadata: {
              userAgent: navigator.userAgent,
              timestamp: Date.now(),
              version: SUBMISSION_METADATA.version,
            },
          }
        )
      );

      if (!response.data.success) {
        const errorDetails: Record<string, unknown> = { ...response.data };

        throw new FormSubmissionError(
          'SUBMISSION_FAILED',
          response.data.message || ERROR_MESSAGES.submission.failed,
          undefined,
          errorDetails
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof FormSubmissionError) {
        throw error;
      }

      if (error instanceof Error) {
        // Handle network errors
        if (error.name === 'AbortError') {
          throw new FormSubmissionError(
            'SUBMISSION_CANCELLED',
            ERROR_MESSAGES.submission.cancelled
          );
        }

        if (error.message.includes('timeout')) {
          throw new FormSubmissionError(
            'SUBMISSION_TIMEOUT',
            ERROR_MESSAGES.submission.timeout
          );
        }

        if (error.message.includes('Network Error')) {
          throw new FormSubmissionError(
            'NETWORK_ERROR',
            ERROR_MESSAGES.network.error
          );
        }
      }

      // Generic error fallback
      throw new FormSubmissionError(
        'UNKNOWN_ERROR',
        ERROR_MESSAGES.unknownDuringSubmission,
        undefined,
        { originalError: error }
      );
    }
  }

  /**
   * Mock submission for development/testing
   */
  async submitApplicationMock(formData: CompleteFormData): Promise<SubmissionResponse> {
    // Validate form data
    validateCompleteForm(formData);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, MOCK_SUBMISSION.networkDelay));

    // Simulate occasional failures for testing
    if (Math.random() < MOCK_SUBMISSION.failureRate) {
      throw new FormSubmissionError(
        'SERVER_ERROR',
        ERROR_MESSAGES.server.unavailable
      );
    }

    // Generate mock response
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    
    return {
      success: true,
      applicationId,
      message: FORM_MESSAGES.submission.success,
      submittedAt: new Date().toISOString(),
    };
  }

  /**
   * Submit application with custom URL (for testing scenarios)
   */
  async submitApplicationWithUrl(formData: CompleteFormData, url: string): Promise<SubmissionResponse> {
    try {
      // Validate form data
      const validatedData = await validateCompleteForm(formData);

      // Submit using custom URL
      const response = await retryRequest(() =>
        apiClient.post<SubmissionResponse>(url, {
          formData: validatedData,
          submittedAt: new Date().toISOString(),
            metadata: {
              userAgent: navigator.userAgent,
              timestamp: Date.now(),
              version: SUBMISSION_METADATA.version,
              testMode: SUBMISSION_METADATA.testMode,
            },
        })
      );

      return response.data;
    } catch (error) {
      throw error instanceof FormSubmissionError
        ? error
        : new FormSubmissionError(
            'SUBMISSION_ERROR',
            ERROR_MESSAGES.submission.failed,
            undefined,
            { originalError: error }
          );
    }
  }

  /**
   * Check submission status
   */
  async checkSubmissionStatus(applicationId: string): Promise<{
    status: 'pending' | 'processing' | 'approved' | 'rejected';
    message: string;
    updatedAt: string;
  }> {
    const response = await apiClient.get(`/applications/${applicationId}/status`);
    return response.data;
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const formSubmissionService = new FormSubmissionService();

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format submission error for user display
 */
export function formatSubmissionError(error: FormSubmissionError): {
  title: string;
  message: string;
  action?: string;
} {
  const errorMap = {
    VALIDATION_ERROR: {
      title: ERROR_TITLES.formValidation,
      message: ERROR_MESSAGES.validation.checkForm,
      action: ERROR_ACTIONS.reviewForm,
    },
    SUBMISSION_TIMEOUT: {
      title: ERROR_TITLES.submissionTimeout,
      message: ERROR_MESSAGES.submission.timeoutLong,
      action: ERROR_ACTIONS.retrySubmission,
    },
    NETWORK_ERROR: {
      title: ERROR_TITLES.networkError,
      message: ERROR_MESSAGES.network.errorShort,
      action: ERROR_ACTIONS.retrySubmission,
    },
    SERVER_ERROR: {
      title: ERROR_TITLES.serverError,
      message: ERROR_MESSAGES.server.temporarilyUnavailable,
      action: ERROR_ACTIONS.retryLater,
    },
    SUBMISSION_CANCELLED: {
      title: ERROR_TITLES.submissionCancelled,
      message: ERROR_MESSAGES.submission.cancelled,
    },
    UNKNOWN_ERROR: {
      title: ERROR_TITLES.unexpectedError,
      message: ERROR_MESSAGES.unknown,
      action: ERROR_ACTIONS.contactSupport,
    },
  } satisfies Record<
    'VALIDATION_ERROR'
    | 'SUBMISSION_TIMEOUT'
    | 'NETWORK_ERROR'
    | 'SERVER_ERROR'
    | 'SUBMISSION_CANCELLED'
    | 'UNKNOWN_ERROR',
    { title: string; message: string; action?: string }
  >;

  const mappedError = errorMap[error.code as keyof typeof errorMap];
  if (mappedError) {
    return mappedError;
  }

  return errorMap.UNKNOWN_ERROR;
}
