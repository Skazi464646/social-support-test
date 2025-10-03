import { z } from 'zod';

// =============================================================================
// STEP 1 VALIDATION SCHEMA - Code Split
// =============================================================================

export const step1Schema = z.object({
  // Personal Identity
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, 'Name can only contain letters and spaces'),
  
  nationalId: z
    .string()
    .regex(/^[0-9]{10}$/, 'National ID must be exactly 10 digits'),
  
  dateOfBirth: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }, 'You must be at least 18 years old'),
  
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
    message: 'Please select a gender',
  }),
  
  // Contact Information
  email: z
    .string()
    .email('Invalid email address')
    .min(5, 'Email is too short')
    .max(100, 'Email is too long'),
  
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{8,14}$/, 'Invalid phone number format'),
  
  // Address Information
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must not exceed 200 characters'),
  
  city: z
    .string()
    .min(2, 'City name is too short')
    .max(50, 'City name is too long'),
  
  state: z
    .string()
    .min(2, 'State name is too short')
    .max(50, 'State name is too long'),
  
  country: z.string().min(1, 'Please select a country'),
  
  postalCode: z.string().optional(),
});

export type Step1FormData = z.infer<typeof step1Schema>;

// Export default for easier imports
export default step1Schema;