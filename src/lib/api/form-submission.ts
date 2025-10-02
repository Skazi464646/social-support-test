import axiosClient from './axios-client';
import type { CompleteFormData } from '@/lib/validation/schemas';
import { z } from 'zod';

// =============================================================================
// TYPES
// =============================================================================

export interface SubmissionResponse {
  success: boolean;
  applicationId: string;
  message: string;
  submittedAt: string;
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

function validateCompleteForm(data: unknown): CompleteFormData {
  try {
    // Import schemas dynamically to avoid circular imports
    const { completeFormSchema } = require('@/lib/validation/schemas');
    return completeFormSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      throw new FormSubmissionError(
        'VALIDATION_ERROR',
        `Validation failed: ${firstError?.message || 'Invalid form data'}`,
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
  private readonly baseURL = '/api/applications';

  /**
   * Submit complete form application
   */
  async submitApplication(formData: CompleteFormData): Promise<SubmissionResponse> {
    try {
      // Validate complete form data
      const validatedData = validateCompleteForm(formData);

      // Submit to API
      const response = await axiosClient.post<SubmissionResponse>(
        `${this.baseURL}/submit`,
        {
          formData: validatedData,
          submittedAt: new Date().toISOString(),
          metadata: {
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            version: '1.0.0',
          },
        },
        {
          timeout: 30000, // 30 second timeout for submission
        }
      );

      if (!response.data.success) {
        const errorDetails: Record<string, unknown> = { ...response.data };

        throw new FormSubmissionError(
          'SUBMISSION_FAILED',
          response.data.message || 'Application submission failed',
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
            'Submission was cancelled'
          );
        }

        if (error.message.includes('timeout')) {
          throw new FormSubmissionError(
            'SUBMISSION_TIMEOUT',
            'Submission timed out. Please try again.'
          );
        }

        if (error.message.includes('Network Error')) {
          throw new FormSubmissionError(
            'NETWORK_ERROR',
            'Network error. Please check your connection and try again.'
          );
        }
      }

      // Generic error fallback
      throw new FormSubmissionError(
        'UNKNOWN_ERROR',
        'An unexpected error occurred during submission. Please try again.',
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
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate occasional failures for testing
    if (Math.random() < 0.1) {
      throw new FormSubmissionError(
        'SERVER_ERROR',
        'Server temporarily unavailable. Please try again.'
      );
    }

    // Generate mock response
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    
    return {
      success: true,
      applicationId,
      message: 'Application submitted successfully. You will receive a confirmation email shortly.',
      submittedAt: new Date().toISOString(),
    };
  }

  /**
   * Check submission status
   */
  async checkSubmissionStatus(applicationId: string): Promise<{
    status: 'pending' | 'processing' | 'approved' | 'rejected';
    message: string;
    updatedAt: string;
  }> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/${applicationId}/status`);
      return response.data;
    } catch (error) {
      throw new FormSubmissionError(
        'STATUS_CHECK_FAILED',
        'Failed to check application status'
      );
    }
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
      title: 'Form Validation Error',
      message: 'Please check your form data and try again.',
      action: 'Review Form',
    },
    SUBMISSION_TIMEOUT: {
      title: 'Submission Timeout',
      message: 'Your submission is taking longer than expected. Please try again.',
      action: 'Retry Submission',
    },
    NETWORK_ERROR: {
      title: 'Network Error',
      message: 'Please check your internet connection and try again.',
      action: 'Retry Submission',
    },
    SERVER_ERROR: {
      title: 'Server Error',
      message: 'Our servers are temporarily unavailable. Please try again later.',
      action: 'Retry Later',
    },
    SUBMISSION_CANCELLED: {
      title: 'Submission Cancelled',
      message: 'Your submission was cancelled.',
    },
    UNKNOWN_ERROR: {
      title: 'Unexpected Error',
      message: 'An unexpected error occurred. Please try again or contact support.',
      action: 'Contact Support',
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
