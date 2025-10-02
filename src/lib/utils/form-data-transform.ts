import type { FormStepData, Step1FormData, Step2FormData, Step3FormData } from '@/types/form.types';

// =============================================================================
// FORM DATA TRANSFORMATION UTILITIES
// =============================================================================

/**
 * Transform form data for localStorage storage
 * Ensures all data is JSON-serializable
 */
export function transformForStorage(data: FormStepData): FormStepData {
  return {
    step1: data.step1 ? transformStep1ForStorage(data.step1) : undefined,
    step2: data.step2 ? transformStep2ForStorage(data.step2) : undefined,
    step3: data.step3 ? transformStep3ForStorage(data.step3) : undefined,
  };
}

/**
 * Transform form data when loading from localStorage
 * Ensures compatibility with form field expectations
 */
export function transformFromStorage(data: FormStepData): FormStepData {
  return {
    step1: data.step1 ? transformStep1FromStorage(data.step1) : undefined,
    step2: data.step2 ? transformStep2FromStorage(data.step2) : undefined,
    step3: data.step3 ? transformStep3FromStorage(data.step3) : undefined,
  };
}

// =============================================================================
// STEP-SPECIFIC TRANSFORMATIONS
// =============================================================================

function transformStep1ForStorage(data: Partial<Step1FormData>): Partial<Step1FormData> {
  // Step 1 only has string fields, no transformation needed
  return { ...data };
}

function transformStep1FromStorage(data: Partial<Step1FormData>): Partial<Step1FormData> {
  // Step 1 only has string fields, no transformation needed
  return { ...data };
}

function transformStep2ForStorage(data: Partial<Step2FormData>): Partial<Step2FormData> {
  // Ensure numeric fields are stored properly
  return {
    ...data,
    numberOfDependents: data.numberOfDependents,
    monthlyIncome: data.monthlyIncome,
    monthlyExpenses: data.monthlyExpenses,
    totalSavings: data.totalSavings,
    totalDebt: data.totalDebt,
    monthlyRent: data.monthlyRent,
  };
}

function transformStep2FromStorage(data: Partial<Step2FormData>): Partial<Step2FormData> {
  const transformed = { ...data } as any;
  
  // Convert numeric fields to strings for form compatibility
  // This ensures the form inputs receive string values initially
  if (typeof transformed.numberOfDependents === 'number') {
    transformed.numberOfDependents = transformed.numberOfDependents.toString();
  }
  if (typeof transformed.monthlyIncome === 'number') {
    transformed.monthlyIncome = transformed.monthlyIncome.toString();
  }
  if (typeof transformed.monthlyExpenses === 'number') {
    transformed.monthlyExpenses = transformed.monthlyExpenses.toString();
  }
  if (typeof transformed.totalSavings === 'number') {
    transformed.totalSavings = transformed.totalSavings.toString();
  }
  if (typeof transformed.totalDebt === 'number') {
    transformed.totalDebt = transformed.totalDebt.toString();
  }
  if (typeof transformed.monthlyRent === 'number') {
    transformed.monthlyRent = transformed.monthlyRent.toString();
  }
  
  // Convert boolean fields from strings if needed
  if (typeof transformed.receivingBenefits === 'string') {
    transformed.receivingBenefits = transformed.receivingBenefits === 'true';
  }
  if (typeof transformed.previouslyApplied === 'string') {
    transformed.previouslyApplied = transformed.previouslyApplied === 'true';
  }
  
  return transformed;
}

function transformStep3ForStorage(data: Partial<Step3FormData>): Partial<Step3FormData> {
  // Step 3 has mostly string fields, but handle booleans properly
  return { ...data };
}

function transformStep3FromStorage(data: Partial<Step3FormData>): Partial<Step3FormData> {
  const transformed = { ...data } as any;
  
  // Ensure boolean fields are properly typed
  if (typeof transformed.agreeToTerms === 'string') {
    transformed.agreeToTerms = transformed.agreeToTerms === 'true';
  }
  if (typeof transformed.consentToDataProcessing === 'string') {
    transformed.consentToDataProcessing = transformed.consentToDataProcessing === 'true';
  }
  if (typeof transformed.allowContactForClarification === 'string') {
    transformed.allowContactForClarification = transformed.allowContactForClarification === 'true';
  }
  
  return transformed;
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Validate that form data is properly typed for storage
 */
export function validateStorageData(data: FormStepData): boolean {
  try {
    JSON.stringify(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely parse localStorage data with fallback
 */
export function safeParseStorageData(jsonString: string): FormStepData | null {
  try {
    const parsed = JSON.parse(jsonString);
    return transformFromStorage(parsed.formData || {});
  } catch (error) {
    console.error('Failed to parse form data from localStorage:', error);
    return null;
  }
}