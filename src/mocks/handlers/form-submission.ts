import { http, HttpResponse } from 'msw';
import type { CompleteFormData } from '@/lib/validation/schemas';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate realistic application ID
 */
const generateApplicationId = (): string => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `APP-${year}${month}-${timestamp}-${random}`;
};

/**
 * Simulate network delay
 */
const simulateDelay = (min = 800, max = 2000): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Validate required fields in form data
 */
const validateFormData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check step1 required fields
  if (!data.step1?.fullName) errors.push('Full name is required');
  if (!data.step1?.email) errors.push('Email is required');
  if (!data.step1?.nationalId) errors.push('National ID is required');
  
  // Check step2 required fields  
  if (!data.step2?.maritalStatus) errors.push('Marital status is required');
  if (data.step2?.monthlyIncome === undefined || data.step2?.monthlyIncome < 0) {
    errors.push('Valid monthly income is required');
  }
  
  // Check step3 required fields
  if (!data.step3?.financialSituation || data.step3.financialSituation.length < 50) {
    errors.push('Financial situation description must be at least 50 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// =============================================================================
// MSW HANDLERS
// =============================================================================

export const formSubmissionHandlers = [
  // Successful form submission
  http.post('/api/applications/submit', async ({ request }) => {
    await simulateDelay(1200, 2500);
    
    try {
      const body = await request.json() as {
        formData: CompleteFormData;
        submittedAt: string;
        metadata: Record<string, any>;
      };
      
      console.log('📋 [MSW] Form submission received:', {
        timestamp: new Date().toISOString(),
        formData: Object.keys(body.formData),
        metadata: body.metadata
      });
      
      // Validate form data
      const validation = validateFormData(body.formData);
      if (!validation.isValid) {
        return HttpResponse.json(
          {
            success: false,
            code: 'VALIDATION_ERROR',
            message: 'Form validation failed',
            errors: validation.errors,
            field: 'form'
          },
          { status: 422 }
        );
      }
      
      // Check for test scenario in URL params for development testing
      const url = new URL(request.url);
      const testScenario = url.searchParams.get('test');
      
      if (testScenario && import.meta.env.DEV) {
        console.log(`🧪 [MSW] Testing scenario: ${testScenario}`);
        return handleTestScenario(testScenario);
      }
      
      // Simulate different response scenarios for testing
      const random = Math.random();
      
      // 5% chance of server error
      if (random < 0.05) {
        console.log('❌ [MSW] Simulating server error');
        return HttpResponse.json(
          {
            success: false,
            code: 'SERVER_ERROR',
            message: 'Internal server error occurred'
          },
          { status: 500 }
        );
      }
      
      // 3% chance of service unavailable
      if (random < 0.08) {
        console.log('⚠️ [MSW] Simulating service unavailable');
        return HttpResponse.json(
          {
            success: false,
            code: 'SERVICE_UNAVAILABLE', 
            message: 'Service temporarily unavailable'
          },
          { status: 503 }
        );
      }
      
      // 2% chance of rate limiting
      if (random < 0.10) {
        console.log('🚦 [MSW] Simulating rate limit');
        return HttpResponse.json(
          {
            success: false,
            code: 'RATE_LIMITED',
            message: 'Too many requests. Please try again later.'
          },
          { 
            status: 429,
            headers: {
              'Retry-After': '60'
            }
          }
        );
      }
      
      // Generate successful response
      const applicationId = generateApplicationId();
      const submittedAt = new Date().toISOString();
      
      console.log('✅ [MSW] Form submission successful:', { applicationId });
      
      return HttpResponse.json({
        success: true,
        applicationId,
        message: 'Application submitted successfully. You will receive a confirmation email shortly.',
        submittedAt,
        processingTime: '5-7 business days',
        nextSteps: [
          'You will receive a confirmation email within 24 hours',
          'Our team will review your application within 5-10 business days',
          'You may be contacted for additional information if needed'
        ]
      });
      
    } catch (error) {
      console.error('❌ [MSW] Error processing submission:', error);
      return HttpResponse.json(
        {
          success: false,
          code: 'PROCESSING_ERROR',
          message: 'Failed to process submission'
        },
        { status: 500 }
      );
    }
  }),

  // Application status check
  http.get('/api/applications/:applicationId/status', async ({ params }) => {
    await simulateDelay(300, 800);
    
    const { applicationId } = params;
    
    console.log('📊 [MSW] Status check for:', applicationId);
    
    // Simulate different statuses based on application ID
    const statuses = ['pending', 'processing', 'approved', 'rejected'] as const;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    const statusMessages = {
      pending: 'Your application is in queue for review',
      processing: 'Your application is currently being reviewed',
      approved: 'Your application has been approved',
      rejected: 'Your application requires additional information'
    };
    
    return HttpResponse.json({
      status: randomStatus,
      message: statusMessages[randomStatus || 'rejected'],
      updatedAt: new Date().toISOString(),
      applicationId
    });
  }),

  // Test error endpoints for development
  http.post('/api/test/error/:errorType', async ({ params }) => {
    await simulateDelay(500, 1000);
    
    const { errorType } = params;
    
    console.log(`🧪 [MSW] Testing error type: ${errorType}`);
    
    switch (errorType) {
      case '404':
        return HttpResponse.json(
          {
            success: false,
            code: 'NOT_FOUND',
            message: 'Endpoint not found'
          },
          { status: 404 }
        );
        
      case '500':
        return HttpResponse.json(
          {
            success: false,
            code: 'SERVER_ERROR',
            message: 'Internal server error'
          },
          { status: 500 }
        );
        
      case 'timeout':
        // Simulate timeout by delaying longer than axios timeout
        await new Promise(resolve => setTimeout(resolve, 35000));
        return HttpResponse.json({ success: true });
        
      case 'network':
        // Simulate network error by returning malformed response
        return HttpResponse.text('Network Error', { status: 0 });
        
      default:
        return HttpResponse.json(
          {
            success: false,
            code: 'UNKNOWN_ERROR',
            message: 'Unknown error type'
          },
          { status: 400 }
        );
    }
  })
];

// =============================================================================
// TEST SCENARIO HANDLER
// =============================================================================

function handleTestScenario(scenario: string) {
  const applicationId = `TEST-${Date.now().toString().slice(-6)}`;
  const submittedAt = new Date().toISOString();

  const testResponses = {
    success: () => ({
      success: true,
      applicationId,
      message: 'Test submission successful - this is a test scenario',
      submittedAt,
      processingTime: '2-3 business days',
    }),
    
    validation: () => ({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Test validation error - some fields are invalid',
      errors: [
        { field: 'step1.email', message: 'Invalid email format for testing' },
        { field: 'step2.monthlyIncome', message: 'Income value seems unrealistic' }
      ],
    }),
    
    server: () => ({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Test server error - simulated internal server error',
    }),

    network: () => {
      // Simulate network error by returning malformed response
      return new Response('Network Error - Test Scenario', { 
        status: 0,
        statusText: 'Network Error' 
      });
    },

    unauthorized: () => ({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Test unauthorized access - authentication required',
    }),

    ratelimit: () => ({
      success: false,
      code: 'RATE_LIMITED',
      message: 'Test rate limit exceeded - too many requests',
      retryAfter: '60',
    }),

    conflict: () => ({
      success: false,
      code: 'CONFLICT',
      message: 'Test conflict - application with this ID already exists',
      field: 'nationalId',
    }),

    slow: () => {
      // Simulate slow response (5 seconds)
      return new Promise(resolve => 
        setTimeout(() => resolve({
          success: true,
          applicationId,
          message: 'Test slow response - this took 5 seconds',
          submittedAt,
          processingTime: '1-2 business days',
        }), 5000)
      );
    },
    
    timeout: () => {
      // Simulate request timeout - never resolves
      return new Promise(() => {}); 
    },
  };

  const responseHandler = testResponses[scenario as keyof typeof testResponses];
  if (!responseHandler) {
    return HttpResponse.json(
      {
        success: false,
        code: 'UNKNOWN_TEST',
        message: `Unknown test scenario: ${scenario}. Available: ${Object.keys(testResponses).join(', ')}`,
      },
      { status: 400 }
    );
  }

  const result = responseHandler();
  
  // Handle async responses
  if (result instanceof Promise) {
    return result.then(data => {
      if (data instanceof Response) return data;
      const statusCode = getStatusCodeForScenario(scenario);
      return HttpResponse.json(data as any, { status: statusCode });
    });
  }

  // Handle direct Response objects (like network scenario)
  if (result instanceof Response) {
    return result;
  }

  const statusCode = getStatusCodeForScenario(scenario);
  return HttpResponse.json(result, { status: statusCode });
}

function getStatusCodeForScenario(scenario: string): number {
  const statusMap: Record<string, number> = {
    success: 200,
    slow: 200,
    validation: 422,
    server: 500,
    unauthorized: 401,
    ratelimit: 429,
    conflict: 409,
    network: 0,
    timeout: 0,
  };
  return statusMap[scenario] || 400;
}