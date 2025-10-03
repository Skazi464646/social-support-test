import { z } from 'zod';

// =============================================================================
// STEP 2 VALIDATION SCHEMA - Code Split
// =============================================================================

export const step2Schema = z.object({
  // Family Information
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'separated'], {
    message: 'Please select marital status',
  }),
  
  numberOfDependents: z
    .number({
      message: 'Must be a number',
    })
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .max(20, 'Please enter a reasonable number'),
  
  // Employment Information
  employmentStatus: z.enum([
    'employed_full_time',
    'employed_part_time', 
    'self_employed',
    'unemployed',
    'retired',
    'student',
    'disabled'
  ], {
    message: 'Please select employment status',
  }),
  
  occupation: z.string().optional(),
  employer: z.string().optional(),
  
  // Financial Information
  monthlyIncome: z
    .number({
      message: 'Must be a number',
    })
    .min(0, 'Income cannot be negative')
    .max(1000000, 'Please enter a reasonable amount'),
  
  monthlyExpenses: z
    .number({
      message: 'Must be a number',
    })
    .min(0, 'Expenses cannot be negative')
    .max(1000000, 'Please enter a reasonable amount'),
  
  totalSavings: z
    .number({
      message: 'Must be a number',
    })
    .min(0, 'Savings cannot be negative')
    .max(10000000, 'Please enter a reasonable amount'),
  
  totalDebt: z
    .number({
      message: 'Must be a number',
    })
    .min(0, 'Debt cannot be negative')
    .max(10000000, 'Please enter a reasonable amount'),
  
  // Housing Information
  housingStatus: z.enum(['own', 'rent', 'living_with_family', 'homeless', 'other'], {
    message: 'Please select housing status',
  }),
  
  monthlyRent: z
    .number({
      message: 'Must be a number',
    })
    .min(0, 'Rent cannot be negative')
    .max(100000, 'Please enter a reasonable amount')
    .optional(),
  
  // Benefits Information
  receivingBenefits: z.enum(['true', 'false'], {
    message: 'Please select if you are receiving benefits',
  }),
  
  benefitTypes: z.array(z.enum([
    'unemployment',
    'disability', 
    'housing',
    'food',
    'medical',
    'elderly',
    'family',
    'other'
  ])).optional(),
  
  previouslyApplied: z.enum(['true', 'false'], {
    message: 'Please select if you have previously applied',
  }),
});

export type Step2FormData = z.infer<typeof step2Schema>;

// Export default for easier imports
export default step2Schema;