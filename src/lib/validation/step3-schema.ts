import { z } from 'zod';

// =============================================================================
// STEP 3 VALIDATION SCHEMA - Code Split
// =============================================================================

export const step3Schema = z.object({
  // Financial Situation (AI Enhanced)
  financialSituation: z
    .string()
    .min(50, 'Please provide at least 50 characters describing your financial situation')
    .max(2000, 'Description must not exceed 2000 characters')
    .refine((value) => {
      // Basic validation for meaningful content
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      return words.length >= 10;
    }, 'Please provide a more detailed description (at least 10 words)'),
  
  // Employment Circumstances (AI Enhanced)
  employmentCircumstances: z
    .string()
    .min(50, 'Please provide at least 50 characters describing your employment circumstances')
    .max(2000, 'Description must not exceed 2000 characters')
    .refine((value) => {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      return words.length >= 10;
    }, 'Please provide a more detailed description (at least 10 words)'),
  
  // Reason for Applying (AI Enhanced)
  reasonForApplying: z
    .string()
    .min(50, 'Please provide at least 50 characters explaining why you are applying')
    .max(2000, 'Description must not exceed 2000 characters')
    .refine((value) => {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      return words.length >= 10;
    }, 'Please provide a more detailed explanation (at least 10 words)'),
  
  // Consent and Acknowledgment
  consentDataProcessing: z
    .boolean()
    .refine((value) => value === true, {
      message: 'You must consent to data processing to continue',
    }),
  
  acknowledgeTerms: z
    .boolean()
    .refine((value) => value === true, {
      message: 'You must acknowledge the terms and conditions to continue',
    }),
  
  confirmInformationAccuracy: z
    .boolean()
    .refine((value) => value === true, {
      message: 'You must confirm that all information provided is accurate',
    }),
});

export type Step3FormData = z.infer<typeof step3Schema>;

// Export default for easier imports
export default step3Schema;