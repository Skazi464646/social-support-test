/**
 * Field Intelligence & Content Analysis System
 * Phase 2: Context-Aware AI Enhancement
 * 
 * Provides intelligent field type detection and content analysis to understand
 * user situations and provide targeted AI suggestions.
 */

import type { AIFormContext } from '@/hooks/useAIFormContext';

// =============================================================================
// TYPES
// =============================================================================

export type FieldCategory = 'personal' | 'financial' | 'employment' | 'housing' | 'family' | 'legal' | 'descriptive';

export type SituationType = 
  | 'unemployment' 
  | 'medical_emergency' 
  | 'housing_crisis' 
  | 'family_hardship'
  | 'financial_instability'
  | 'employment_transition'
  | 'education_costs'
  | 'disability_support'
  | 'elderly_care'
  | 'general_support';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface FieldContext {
  fieldName: string;
  category: FieldCategory;
  subcategory?: string;
  relatedFields: string[];
  suggestedPromptType: string;
}

export interface ContentAnalysis {
  situationType: SituationType;
  urgencyLevel: UrgencyLevel;
  keyIndicators: string[];
  suggestedApproach: string;
  contextualInsights: string[];
}

export interface FieldIntelligence {
  fieldContext: FieldContext;
  contentAnalysis: ContentAnalysis | null;
  crossFieldRelationships: Record<string, any>;
  completenessScore: number;
}

// =============================================================================
// FIELD CLASSIFICATION SYSTEM
// =============================================================================

/**
 * Master field classification mapping
 */
const FIELD_CLASSIFICATIONS: Record<string, FieldContext> = {
  // Personal Information Fields
  fullName: {
    fieldName: 'fullName',
    category: 'personal',
    subcategory: 'identity',
    relatedFields: ['nationalId', 'dateOfBirth'],
    suggestedPromptType: 'personal_identity',
  },
  nationalId: {
    fieldName: 'nationalId',
    category: 'personal',
    subcategory: 'identity',
    relatedFields: ['fullName', 'country'],
    suggestedPromptType: 'personal_identity',
  },
  dateOfBirth: {
    fieldName: 'dateOfBirth',
    category: 'personal',
    subcategory: 'demographics',
    relatedFields: ['numberOfDependents'],
    suggestedPromptType: 'demographic_info',
  },
  gender: {
    fieldName: 'gender',
    category: 'personal',
    subcategory: 'demographics',
    relatedFields: ['maritalStatus'],
    suggestedPromptType: 'demographic_info',
  },
  email: {
    fieldName: 'email',
    category: 'personal',
    subcategory: 'contact',
    relatedFields: ['phone', 'address'],
    suggestedPromptType: 'contact_info',
  },
  phone: {
    fieldName: 'phone',
    category: 'personal',
    subcategory: 'contact',
    relatedFields: ['email', 'address'],
    suggestedPromptType: 'contact_info',
  },
  address: {
    fieldName: 'address',
    category: 'housing',
    subcategory: 'location',
    relatedFields: ['city', 'state', 'country', 'housingStatus'],
    suggestedPromptType: 'housing_situation',
  },

  // Family Information Fields
  maritalStatus: {
    fieldName: 'maritalStatus',
    category: 'family',
    subcategory: 'status',
    relatedFields: ['numberOfDependents', 'monthlyExpenses'],
    suggestedPromptType: 'family_situation',
  },
  numberOfDependents: {
    fieldName: 'numberOfDependents',
    category: 'family',
    subcategory: 'composition',
    relatedFields: ['maritalStatus', 'monthlyExpenses', 'housingStatus'],
    suggestedPromptType: 'family_situation',
  },

  // Employment Fields
  employmentStatus: {
    fieldName: 'employmentStatus',
    category: 'employment',
    subcategory: 'status',
    relatedFields: ['occupation', 'employer', 'monthlyIncome'],
    suggestedPromptType: 'employment_situation',
  },
  occupation: {
    fieldName: 'occupation',
    category: 'employment',
    subcategory: 'details',
    relatedFields: ['employmentStatus', 'employer', 'monthlyIncome'],
    suggestedPromptType: 'employment_situation',
  },
  employer: {
    fieldName: 'employer',
    category: 'employment',
    subcategory: 'details',
    relatedFields: ['occupation', 'employmentStatus', 'monthlyIncome'],
    suggestedPromptType: 'employment_situation',
  },

  // Financial Fields
  monthlyIncome: {
    fieldName: 'monthlyIncome',
    category: 'financial',
    subcategory: 'income',
    relatedFields: ['employmentStatus', 'monthlyExpenses', 'totalSavings'],
    suggestedPromptType: 'financial_situation',
  },
  monthlyExpenses: {
    fieldName: 'monthlyExpenses',
    category: 'financial',
    subcategory: 'expenses',
    relatedFields: ['monthlyIncome', 'monthlyRent', 'numberOfDependents'],
    suggestedPromptType: 'financial_situation',
  },
  totalSavings: {
    fieldName: 'totalSavings',
    category: 'financial',
    subcategory: 'assets',
    relatedFields: ['monthlyIncome', 'totalDebt'],
    suggestedPromptType: 'financial_situation',
  },
  totalDebt: {
    fieldName: 'totalDebt',
    category: 'financial',
    subcategory: 'liabilities',
    relatedFields: ['totalSavings', 'monthlyIncome'],
    suggestedPromptType: 'financial_situation',
  },

  // Housing Fields
  housingStatus: {
    fieldName: 'housingStatus',
    category: 'housing',
    subcategory: 'status',
    relatedFields: ['monthlyRent', 'address', 'numberOfDependents'],
    suggestedPromptType: 'housing_situation',
  },
  monthlyRent: {
    fieldName: 'monthlyRent',
    category: 'housing',
    subcategory: 'costs',
    relatedFields: ['housingStatus', 'monthlyIncome', 'monthlyExpenses'],
    suggestedPromptType: 'housing_situation',
  },

  // Benefits & Support Fields
  receivingBenefits: {
    fieldName: 'receivingBenefits',
    category: 'financial',
    subcategory: 'support',
    relatedFields: ['benefitTypes', 'previouslyApplied'],
    suggestedPromptType: 'benefits_support',
  },
  benefitTypes: {
    fieldName: 'benefitTypes',
    category: 'financial',
    subcategory: 'support',
    relatedFields: ['receivingBenefits', 'monthlyIncome'],
    suggestedPromptType: 'benefits_support',
  },
  previouslyApplied: {
    fieldName: 'previouslyApplied',
    category: 'legal',
    subcategory: 'history',
    relatedFields: ['receivingBenefits'],
    suggestedPromptType: 'application_history',
  },

  // Descriptive Fields (Step 3)
  financialSituation: {
    fieldName: 'financialSituation',
    category: 'descriptive',
    subcategory: 'financial_narrative',
    relatedFields: ['monthlyIncome', 'monthlyExpenses', 'employmentStatus'],
    suggestedPromptType: 'financial_narrative',
  },
  employmentCircumstances: {
    fieldName: 'employmentCircumstances',
    category: 'descriptive',
    subcategory: 'employment_narrative',
    relatedFields: ['employmentStatus', 'occupation', 'financialSituation'],
    suggestedPromptType: 'employment_narrative',
  },
  reasonForApplying: {
    fieldName: 'reasonForApplying',
    category: 'descriptive',
    subcategory: 'support_narrative',
    relatedFields: ['financialSituation', 'employmentCircumstances'],
    suggestedPromptType: 'support_narrative',
  },
  additionalComments: {
    fieldName: 'additionalComments',
    category: 'descriptive',
    subcategory: 'supplementary',
    relatedFields: ['reasonForApplying'],
    suggestedPromptType: 'additional_context',
  },

  // Legal/Consent Fields
  agreeToTerms: {
    fieldName: 'agreeToTerms',
    category: 'legal',
    subcategory: 'consent',
    relatedFields: ['consentToDataProcessing'],
    suggestedPromptType: 'legal_consent',
  },
  consentToDataProcessing: {
    fieldName: 'consentToDataProcessing',
    category: 'legal',
    subcategory: 'consent',
    relatedFields: ['agreeToTerms'],
    suggestedPromptType: 'legal_consent',
  },
  allowContactForClarification: {
    fieldName: 'allowContactForClarification',
    category: 'legal',
    subcategory: 'permissions',
    relatedFields: ['email', 'phone'],
    suggestedPromptType: 'contact_permissions',
  },
};

// =============================================================================
// CONTENT ANALYSIS PATTERNS
// =============================================================================

/**
 * Keyword patterns for situation detection
 */
const SITUATION_KEYWORDS = {
  unemployment: [
    'unemployed', 'job loss', 'laid off', 'fired', 'terminated', 'no job', 'seeking employment',
    'job search', 'benefits expired', 'unemployment benefits', 'looking for work', 'jobless',
    'lost job', 'downsized', 'company closed', 'redundant', 'furloughed'
  ],
  medical_emergency: [
    'medical', 'hospital', 'surgery', 'illness', 'injury', 'doctor', 'treatment', 'medication',
    'health crisis', 'emergency room', 'cancer', 'chronic', 'disability', 'accident',
    'medical bills', 'insurance', 'therapy', 'rehabilitation', 'urgent care'
  ],
  housing_crisis: [
    'eviction', 'homeless', 'rent', 'mortgage', 'foreclosure', 'housing', 'shelter',
    'nowhere to live', 'kicked out', 'cant afford rent', 'behind on payments',
    'housing assistance', 'temporary housing', 'staying with friends', 'couch surfing'
  ],
  family_hardship: [
    'divorce', 'separation', 'death', 'funeral', 'family emergency', 'custody', 'childcare',
    'eldercare', 'family crisis', 'domestic violence', 'single parent', 'widow', 'widower',
    'caring for', 'family member sick', 'dependent', 'guardian'
  ],
  financial_instability: [
    'debt', 'bankrupt', 'financial crisis', 'cant pay bills', 'overdue', 'collections',
    'credit card debt', 'loan default', 'financial hardship', 'money problems',
    'struggling financially', 'behind on payments', 'garnishment', 'poverty'
  ],
  employment_transition: [
    'career change', 'training', 'education', 'student', 'retraining', 'skills development',
    'internship', 'apprenticeship', 'certification', 'degree', 'part-time', 'temporary work',
    'seasonal work', 'gig economy', 'freelance'
  ],
  education_costs: [
    'tuition', 'student loan', 'school fees', 'education expenses', 'college costs',
    'university', 'training program', 'certification costs', 'books', 'supplies'
  ],
  disability_support: [
    'disabled', 'disability', 'unable to work', 'impaired', 'assistance needed',
    'mobility issues', 'mental health', 'depression', 'anxiety', 'PTSD', 'cognitive',
    'physical limitations', 'chronic pain', 'wheelchair', 'blind', 'deaf'
  ],
  elderly_care: [
    'elderly', 'senior', 'aging', 'retirement', 'pension', 'social security',
    'medicare', 'nursing home', 'assisted living', 'caregiver', 'elderly parent'
  ]
};

/**
 * Urgency level keywords
 */
const URGENCY_KEYWORDS = {
  critical: [
    'immediate', 'urgent', 'emergency', 'crisis', 'desperate', 'eviction notice',
    'shut off notice', 'foreclosure', 'homeless', 'no money', 'cant eat', 'starving',
    'critical condition', 'life threatening', 'suicidal', 'danger'
  ],
  high: [
    'soon', 'quickly', 'asap', 'running out', 'deadline', 'overdue', 'behind',
    'struggling', 'difficulty', 'hard time', 'stressed', 'worried', 'anxious',
    'limited time', 'urgent need', 'pressing'
  ],
  medium: [
    'challenging', 'difficult', 'concern', 'issue', 'problem', 'need help',
    'support needed', 'assistance required', 'hoping for', 'looking for help'
  ]
};

// =============================================================================
// FIELD INTELLIGENCE FUNCTIONS
// =============================================================================

/**
 * Get field classification and context
 */
export function detectFieldContext(fieldName: string): FieldContext {
  const classification = FIELD_CLASSIFICATIONS[fieldName];
  
  if (classification) {
    return classification;
  }

  // Fallback classification for unknown fields
  return {
    fieldName,
    category: 'personal',
    subcategory: 'other',
    relatedFields: [],
    suggestedPromptType: 'general',
  };
}

/**
 * Analyze content to detect situation type and urgency
 */
export function analyzeFieldContent(content: string, fieldName: string): ContentAnalysis {
  const normalizedContent = content.toLowerCase();
  
  // Detect situation type
  let situationType: SituationType = 'general_support';
  let maxMatches = 0;
  
  Object.entries(SITUATION_KEYWORDS).forEach(([situation, keywords]) => {
    const matches = keywords.filter(keyword => 
      normalizedContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      situationType = situation as SituationType;
    }
  });

  // Detect urgency level
  let urgencyLevel: UrgencyLevel = 'low';
  
  if (URGENCY_KEYWORDS.critical.some(keyword => 
    normalizedContent.includes(keyword.toLowerCase())
  )) {
    urgencyLevel = 'critical';
  } else if (URGENCY_KEYWORDS.high.some(keyword => 
    normalizedContent.includes(keyword.toLowerCase())
  )) {
    urgencyLevel = 'high';
  } else if (URGENCY_KEYWORDS.medium.some(keyword => 
    normalizedContent.includes(keyword.toLowerCase())
  )) {
    urgencyLevel = 'medium';
  }

  // Extract key indicators (matched keywords)
  const keyIndicators: string[] = [];
  Object.values(SITUATION_KEYWORDS).flat().forEach(keyword => {
    if (normalizedContent.includes(keyword.toLowerCase())) {
      keyIndicators.push(keyword);
    }
  });

  // Generate suggested approach based on analysis
  const suggestedApproach = generateSuggestedApproach(situationType, urgencyLevel, fieldName);
  
  // Generate contextual insights
  const contextualInsights = generateContextualInsights(situationType, urgencyLevel, fieldName, content);

  return {
    situationType,
    urgencyLevel,
    keyIndicators: keyIndicators.slice(0, 5), // Limit to top 5
    suggestedApproach,
    contextualInsights,
  };
}

/**
 * Generate suggested approach based on analysis
 */
function generateSuggestedApproach(
  situationType: SituationType, 
  urgencyLevel: UrgencyLevel, 
  _fieldName: string
): string {
  const approaches: Record<SituationType, Record<UrgencyLevel, string>> = {
    unemployment: {
      critical: 'Focus on immediate financial needs and emergency assistance programs',
      high: 'Emphasize job search efforts and temporary support requirements',
      medium: 'Highlight career transition plans and skill development',
      low: 'Present employment goals and long-term stability plans'
    },
    medical_emergency: {
      critical: 'Prioritize urgent medical needs and associated financial burden',
      high: 'Detail medical situation and impact on work/finances',
      medium: 'Explain ongoing treatment needs and support requirements',
      low: 'Describe preventive care needs and health maintenance'
    },
    housing_crisis: {
      critical: 'Address immediate housing needs and homelessness prevention',
      high: 'Focus on urgent housing assistance and temporary solutions',
      medium: 'Explain housing challenges and stability needs',
      low: 'Describe housing goals and improvement plans'
    },
    family_hardship: {
      critical: 'Prioritize family safety and immediate crisis intervention',
      high: 'Address urgent family needs and support systems',
      medium: 'Explain family challenges and care responsibilities',
      low: 'Describe family situation and support needs'
    },
    financial_instability: {
      critical: 'Focus on immediate debt relief and emergency assistance',
      high: 'Address urgent financial obligations and payment plans',
      medium: 'Explain financial challenges and budgeting needs',
      low: 'Describe financial goals and stability plans'
    },
    employment_transition: {
      critical: 'Focus on immediate income needs during career transition',
      high: 'Address urgent training and transition support requirements',
      medium: 'Highlight skill development and career planning',
      low: 'Present career goals and professional development plans'
    },
    education_costs: {
      critical: 'Prioritize immediate educational funding needs',
      high: 'Address urgent tuition and educational expense support',
      medium: 'Explain educational goals and funding challenges',
      low: 'Describe long-term educational and career objectives'
    },
    disability_support: {
      critical: 'Focus on immediate accessibility and support needs',
      high: 'Address urgent disability-related expenses and care',
      medium: 'Explain ongoing support and accommodation needs',
      low: 'Describe long-term independence and support goals'
    },
    elderly_care: {
      critical: 'Prioritize immediate elderly care and safety needs',
      high: 'Address urgent caregiving and support requirements',
      medium: 'Explain ongoing care responsibilities and challenges',
      low: 'Describe long-term care planning and support needs'
    },
    general_support: {
      critical: 'Focus on immediate basic needs and emergency assistance',
      high: 'Address urgent support requirements and challenges',
      medium: 'Explain current difficulties and support needs',
      low: 'Describe circumstances and assistance goals'
    }
  };

  return approaches[situationType]?.[urgencyLevel] || 
         'Provide clear, factual description of circumstances and support needs';
}

/**
 * Generate contextual insights for AI prompts
 */
function generateContextualInsights(
  situationType: SituationType,
  urgencyLevel: UrgencyLevel,
  fieldName: string,
  content: string
): string[] {
  const insights: string[] = [];

  // Situation-specific insights
  switch (situationType) {
    case 'unemployment':
      insights.push('Consider mentioning job search efforts and timeline');
      insights.push('Include any training or skills development activities');
      if (urgencyLevel === 'critical' || urgencyLevel === 'high') {
        insights.push('Emphasize immediate financial impact on family');
      }
      break;

    case 'medical_emergency':
      insights.push('Include how medical situation affects work capacity');
      insights.push('Mention any ongoing treatment or recovery timeline');
      if (content.includes('insurance') || content.includes('bills')) {
        insights.push('Detail specific medical expenses and insurance coverage');
      }
      break;

    case 'housing_crisis':
      insights.push('Specify current housing situation and timeline');
      insights.push('Include any efforts made to secure housing');
      if (urgencyLevel === 'critical') {
        insights.push('Emphasize immediate risk of homelessness');
      }
      break;

    case 'family_hardship':
      insights.push('Explain family composition and dependent care needs');
      insights.push('Include impact on work and financial stability');
      break;

    case 'financial_instability':
      insights.push('Provide specific examples of financial challenges');
      insights.push('Include steps taken to address financial issues');
      break;
  }

  // Field-specific insights
  if (fieldName === 'financialSituation') {
    insights.push('Use specific amounts when helpful (rent, bills, income)');
    insights.push('Explain the timeline of financial difficulties');
  } else if (fieldName === 'employmentCircumstances') {
    insights.push('Include work history and any barriers to employment');
    insights.push('Mention any job search activities or training');
  } else if (fieldName === 'reasonForApplying') {
    insights.push('Connect your situation to specific support outcomes');
    insights.push('Explain how assistance will improve your circumstances');
  }

  return insights.slice(0, 4); // Limit to top 4 insights
}

/**
 * Analyze cross-field relationships for comprehensive context
 */
export function analyzeCrossFieldRelationships(
  fieldName: string, 
  content: string, 
  formContext: AIFormContext
): Record<string, any> {
  const fieldContext = detectFieldContext(fieldName);
  const relationships: Record<string, any> = {};

  // Check related fields for context
  fieldContext.relatedFields.forEach(relatedField => {
    const step1Data = formContext.step1?.[relatedField as keyof typeof formContext.step1];
    const step2Data = formContext.step2?.[relatedField as keyof typeof formContext.step2];
    const step3Data = formContext.step3?.[relatedField as keyof typeof formContext.step3];

    const relatedValue = step1Data || step2Data || step3Data;
    
    if (relatedValue !== undefined && relatedValue !== null && relatedValue !== '') {
      relationships[relatedField] = {
        value: relatedValue,
        category: detectFieldContext(relatedField).category,
        relevance: calculateFieldRelevance(fieldName, relatedField, content, relatedValue)
      };
    }
  });

  // Add derived insights based on relationships
  relationships.derivedInsights = generateDerivedInsights(fieldName, relationships, formContext);

  return relationships;
}

/**
 * Calculate relevance score between fields
 */
function calculateFieldRelevance(
  primaryField: string, 
  relatedField: string, 
  _primaryContent: string, 
  _relatedValue: any
): number {
  // Base relevance based on field categories
  const primaryCategory = detectFieldContext(primaryField).category;
  const relatedCategory = detectFieldContext(relatedField).category;
  
  let relevance = primaryCategory === relatedCategory ? 0.8 : 0.4;

  // Boost relevance for specific field combinations
  const highRelevancePairs = [
    ['employmentStatus', 'monthlyIncome'],
    ['housingStatus', 'monthlyRent'],
    ['numberOfDependents', 'monthlyExpenses'],
    ['financialSituation', 'employmentCircumstances'],
  ];

  if (highRelevancePairs.some(pair => 
    (pair[0] === primaryField && pair[1] === relatedField) ||
    (pair[1] === primaryField && pair[0] === relatedField)
  )) {
    relevance = Math.min(relevance + 0.3, 1.0);
  }

  return relevance;
}

/**
 * Generate derived insights from cross-field analysis
 */
function generateDerivedInsights(
  _fieldName: string, 
  relationships: Record<string, any>, 
  _formContext: AIFormContext
): string[] {
  const insights: string[] = [];

  // Employment & Income insights
  if (relationships.employmentStatus && relationships.monthlyIncome) {
    const employment = relationships.employmentStatus.value;
    const income = relationships.monthlyIncome.value;
    
    if (employment === 'unemployed' && income > 0) {
      insights.push('Income despite unemployment status - consider mentioning other income sources');
    } else if (employment === 'employed_full_time' && income < 5000) {
      insights.push('Low income for full-time employment - may indicate underemployment');
    }
  }

  // Housing & Financial insights
  if (relationships.housingStatus && relationships.monthlyRent && relationships.monthlyIncome) {
    const housing = relationships.housingStatus.value;
    const rent = relationships.monthlyRent.value;
    const income = relationships.monthlyIncome.value;
    
    if (housing === 'rent' && rent > income * 0.5) {
      insights.push('High rent-to-income ratio indicates housing affordability stress');
    }
  }

  // Family & Financial insights
  if (relationships.numberOfDependents && relationships.monthlyIncome) {
    const dependents = relationships.numberOfDependents.value;
    const income = relationships.monthlyIncome.value;
    
    if (dependents > 2 && income < 10000) {
      insights.push('Large family with limited income - emphasize family support needs');
    }
  }

  return insights;
}

/**
 * Calculate overall completeness score for context quality
 */
export function calculateContextCompleteness(
  fieldName: string, 
  content: string, 
  formContext: AIFormContext
): number {
  const fieldContext = detectFieldContext(fieldName);
  let completeness = 0;

  // Base score for having content
  if (content && content.trim().length > 0) {
    completeness += 0.3;
  }

  // Score for content quality (length and detail)
  if (content.length > 100) completeness += 0.2;
  if (content.length > 300) completeness += 0.1;

  // Score for related field completion
  const relatedFieldsCompleted = fieldContext.relatedFields.filter(field => {
    const step1Value = formContext.step1?.[field as keyof typeof formContext.step1];
    const step2Value = formContext.step2?.[field as keyof typeof formContext.step2];
    const step3Value = formContext.step3?.[field as keyof typeof formContext.step3];
    
    const value = step1Value || step2Value || step3Value;
    return value !== undefined && value !== null && value !== '';
  }).length;

  const relatedFieldsScore = relatedFieldsCompleted / Math.max(fieldContext.relatedFields.length, 1);
  completeness += relatedFieldsScore * 0.4;

  return Math.min(completeness, 1.0);
}

// =============================================================================
// MAIN INTELLIGENCE FUNCTION
// =============================================================================

/**
 * Comprehensive field intelligence analysis
 */
export function analyzeFieldIntelligence(
  fieldName: string, 
  content: string, 
  formContext: AIFormContext
): FieldIntelligence {
  const fieldContext = detectFieldContext(fieldName);
  
  // Only analyze content for descriptive fields with substantial content
  const contentAnalysis = (content && content.length > 20) 
    ? analyzeFieldContent(content, fieldName) 
    : null;
  
  const crossFieldRelationships = analyzeCrossFieldRelationships(fieldName, content, formContext);
  const completenessScore = calculateContextCompleteness(fieldName, content, formContext);

  return {
    fieldContext,
    contentAnalysis,
    crossFieldRelationships,
    completenessScore,
  };
}