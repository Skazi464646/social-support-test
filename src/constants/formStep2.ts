export const FORM_STEP2_FALLBACKS = {
  header: {
    title: 'Financial Information',
    description: 'Please provide details about your financial situation and housing status.',
  },
  family: {
    title: 'Family Information',
    description: 'Information about your family status',
  },
  employment: {
    title: 'Employment Information',
    description: 'Your current employment and income details',
  },
  housing: {
    title: 'Housing Information',
    description: 'Your current housing situation',
  },
  benefits: {
    title: 'Government Benefits',
    description: 'Information about any government assistance you receive',
  },
  notice: {
    title: 'Financial Information',
    text: 'All financial information will be verified. Please ensure accuracy as false information may result in application rejection and potential legal consequences.',
  },
  fields: {
    maritalStatus: {
      label: 'Marital Status',
      selectLabel: 'Select marital status',
      options: {
        single: 'Single',
        married: 'Married',
        divorced: 'Divorced',
        widowed: 'Widowed',
        separated: 'Separated',
      },
    },
    numberOfDependents: {
      label: 'Number of Dependents',
    },
    employmentStatus: {
      label: 'Employment Status',
      selectLabel: 'Select employment status',
      options: {
        employedFullTime: 'Employed (Full-time)',
        employedPartTime: 'Employed (Part-time)',
        selfEmployed: 'Self-employed',
        unemployed: 'Unemployed',
        retired: 'Retired',
        student: 'Student',
        disabled: 'Unable to work (Disability)',
      },
    },
    occupation: {
      label: 'Occupation',
      placeholder: 'Enter your job title or profession',
    },
    employer: {
      label: 'Employer Name',
      placeholder: 'Enter your employer name',
    },
    monthlyIncome: {
      label: 'Monthly Income (AED)',
    },
    monthlyExpenses: {
      label: 'Monthly Expenses (AED)',
    },
    totalSavings: {
      label: 'Total Savings (AED)',
    },
    totalDebt: {
      label: 'Total Debt (AED)',
    },
    housingStatus: {
      label: 'Housing Status',
      selectLabel: 'Select housing status',
      options: {
        own: 'Own my home',
        rent: 'Rent',
        livingWithFamily: 'Living with family/friends',
        homeless: 'Homeless/Temporary shelter',
        other: 'Other',
      },
    },
    monthlyRent: {
      label: 'Monthly Rent (AED)',
    },
    receivingBenefits: {
      label: 'Currently Receiving Government Benefits',
      selectLabel: 'Select an option',
    },
    benefitTypes: {
      label: 'Types of Benefits Received',
      options: {
        unemployment: 'Unemployment Benefits',
        disability: 'Disability Benefits',
        housing: 'Housing Assistance',
        food: 'Food Assistance',
        medical: 'Medical Assistance',
        elderly: 'Elderly Support',
        family: 'Family Support',
        other: 'Other',
      },
    },
    previouslyApplied: {
      label: 'Previously Applied for Social Support',
      selectLabel: 'Select an option',
    },
  },
  common: {
    yes: 'Yes',
    no: 'No',
  },
} as const;
