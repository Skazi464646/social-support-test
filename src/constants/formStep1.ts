export const FORM_STEP1_FALLBACKS = {
  header: {
    title: 'Personal Information',
    description: 'Please provide your personal details for verification.',
  },
  identity: {
    title: 'Identity Information',
    description: 'Basic identification details',
  },
  contact: {
    title: 'Contact Information',
    description: 'How we can reach you',
  },
  address: {
    title: 'Address Information',
    description: 'Your current residential address',
  },
  notice: {
    title: 'Important Information',
    text: 'Please ensure all information is accurate and matches your official documents. This information will be used for verification purposes.',
  },
  fields: {
    fullName: {
      label: 'Full Name',
      placeholder: 'Enter your full legal name',
    },
    nationalId: {
      label: 'National ID',
      placeholder: 'Enter your 10-digit national ID',
    },
    dateOfBirth: {
      label: 'Date of Birth',
    },
    gender: {
      label: 'Gender',
      selectLabel: 'Select gender',
      options: {
        male: 'Male',
        female: 'Female',
        other: 'Other',
        preferNotToSay: 'Prefer not to say',
      },
    },
    email: {
      label: 'Email Address',
      placeholder: 'your.email@example.com',
    },
    phone: {
      label: 'Phone Number',
      placeholder: '+971 50 123 4567',
    },
    streetAddress: {
      label: 'Street Address',
      placeholder: 'Building name, street number, street name',
    },
    city: {
      label: 'City',
      placeholder: 'Enter your city',
    },
    state: {
      label: 'State/Emirate',
      placeholder: 'Enter your state or emirate',
    },
    country: {
      label: 'Country',
      selectLabel: 'Select country',
    },
    postalCode: {
      label: 'Postal Code',
      placeholder: 'Enter postal code',
    },
  },
  countries: {
    AE: 'United Arab Emirates',
    SA: 'Saudi Arabia',
    QA: 'Qatar',
    KW: 'Kuwait',
    BH: 'Bahrain',
    OM: 'Oman',
    JO: 'Jordan',
    LB: 'Lebanon',
    EG: 'Egypt',
    OTHER: 'Other',
  },
} as const;
