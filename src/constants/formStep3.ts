export const FORM_STEP3_FALLBACKS = {
  header: {
    title: 'Detailed Information',
    description: 'Please provide detailed information about your situation to help us better understand your needs.',
  },
  financialSituation: {
    label: 'Financial Situation',
    helperText: 'Describe your current financial challenges and circumstances. Include details about income, expenses, and any financial hardships.',
    placeholder: 'Example: I am facing difficulty paying rent due to reduced income after losing my job...'
  },
  employmentCircumstances: {
    label: 'Employment Circumstances',
    helperText: 'Explain your current work situation, recent changes, and any challenges finding employment.',
    placeholder: 'Example: I was laid off due to company downsizing and have been searching for employment...'
  },
  reasonForApplying: {
    label: 'Why Are You Applying for Social Support?',
    helperText: 'Explain why you need assistance, what type of support you need, and how it will help you.',
    placeholder: 'Example: I need help covering basic living expenses while I search for stable employment...'
  },
  additionalComments: {
    label: 'Additional Information (Optional)',
    helperText: 'Share any other relevant information about your circumstances.',
    placeholder: 'Any additional information about family situation, health issues, or other relevant factors...'
  },
  consent: {
    sectionTitle: 'Terms and Consent',
    agreeToTerms: {
      label: 'I agree to the terms and conditions',
      helperText: 'All information provided is true and accurate to the best of your knowledge.',
    },
    consentToDataProcessing: {
      label: 'I consent to data processing',
      helperText: 'Processing of personal data for evaluating your social support application.',
    },
    allowContactForClarification: {
      label: 'Allow contact for clarification',
      helperText: 'Permission to contact you if additional information is needed.',
    },
  },
  finalNotice: {
    title: 'Application Review',
    text: 'Your application will be reviewed by our support team. We may contact you if additional information is needed. Processing typically takes 5-10 business days.',
  },
} as const;
