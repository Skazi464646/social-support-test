// =============================================================================
// FIELD NAMES
// =============================================================================

export const FORM_STEP2_FIELD_NAMES = {
  maritalStatus: 'maritalStatus',
  numberOfDependents: 'numberOfDependents',
  employmentStatus: 'employmentStatus',
  occupation: 'occupation',
  employer: 'employer',
  monthlyIncome: 'monthlyIncome',
  monthlyExpenses: 'monthlyExpenses',
  totalSavings: 'totalSavings',
  totalDebt: 'totalDebt',
  housingStatus: 'housingStatus',
  monthlyRent: 'monthlyRent',
  receivingBenefits: 'receivingBenefits',
  benefitTypes: 'benefitTypes',
  previouslyApplied: 'previouslyApplied',
} as const;

// =============================================================================
// FIELD VALUES
// =============================================================================

export const FORM_STEP2_VALUES = {
  maritalStatus: {
    SINGLE: 'single',
    MARRIED: 'married',
    DIVORCED: 'divorced',
    WIDOWED: 'widowed',
    SEPARATED: 'separated',
    EMPTY: '',
  },
  employmentStatus: {
    EMPLOYED_FULL_TIME: 'employed_full_time',
    EMPLOYED_PART_TIME: 'employed_part_time',
    SELF_EMPLOYED: 'self_employed',
    UNEMPLOYED: 'unemployed',
    RETIRED: 'retired',
    STUDENT: 'student',
    DISABLED: 'disabled',
    EMPTY: '',
  },
  housingStatus: {
    OWN: 'own',
    RENT: 'rent',
    LIVING_WITH_FAMILY: 'living_with_family',
    HOMELESS: 'homeless',
    OTHER: 'other',
    EMPTY: '',
  },
  benefitTypes: {
    UNEMPLOYMENT: 'unemployment',
    DISABILITY: 'disability',
    HOUSING: 'housing',
    FOOD: 'food',
    MEDICAL: 'medical',
    ELDERLY: 'elderly',
    FAMILY: 'family',
    OTHER: 'other',
  },
  boolean: {
    TRUE: 'true',
    FALSE: 'false',
    EMPTY: '',
  },
} as const;

// =============================================================================
// VALIDATION CONSTRAINTS
// =============================================================================

export const FORM_STEP2_VALIDATION = {
  numberOfDependents: {
    MIN: 0,
    MAX: 20,
  },
} as const;

// =============================================================================
// FALLBACK TRANSLATIONS
// =============================================================================

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
