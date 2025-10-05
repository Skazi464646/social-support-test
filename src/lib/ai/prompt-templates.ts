/**
 * Field-Specific Prompt Templates
 * Module 5 - Step 3: Create Field-Specific Prompt Templates
 * Enhanced for Context-Aware AI (Phase 3)
 */

import type { AIFormContext } from '@/hooks/useAIFormContext';
import { 
  analyzeFieldIntelligence, 
  detectFieldContext,
  type FieldIntelligence 
} from './field-intelligence';

export interface PromptContext {
  userContext: {
    step1?: Record<string, any>;
    step2?: Record<string, any>;
    step3?: Record<string, any>;
  };
  currentValue: string;
  language: 'en' | 'ar';
  fieldConstraints?: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  };
}

export interface EnhancedPromptContext extends PromptContext {
  fieldIntelligence?: FieldIntelligence;
  intelligentContext?: AIFormContext;
}

export interface PromptTemplate {
  systemPrompt: string;
  userPrompt: (context: PromptContext) => string;
  examples: string[];
  constraints: string[];
}

/**
 * Field-specific prompt templates for social support applications
 */
export const FIELD_PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
  financialSituation: {
    systemPrompt: `You are a helpful assistant that helps people write clear, professional descriptions of their financial circumstances for social support applications. 

Your role is to:
- Help users articulate their financial challenges clearly and respectfully
- Maintain dignity while communicating genuine need
- Use appropriate tone for government/social service contexts
- Focus on facts and circumstances rather than emotions
- Ensure descriptions are specific enough to be useful for case workers

Guidelines:
- Keep responses 2-4 sentences (50-200 words)
- Use professional but accessible language
- Focus on circumstances, not blame
- Include specific impacts when possible
- Maintain respectful, factual tone`,
    
    userPrompt: (context: PromptContext) => {
      const { userContext, currentValue, fieldConstraints } = context;
      
      let prompt = `Help improve this description of financial circumstances for a social support application.`;
      
      // Add context from other form fields
      if (userContext.step2?.employmentStatus) {
        prompt += `\nEmployment status: ${userContext.step2.employmentStatus}`;
      }
      if (userContext.step2?.monthlyIncome) {
        prompt += `\nMonthly income: ${userContext.step2.monthlyIncome} AED`;
      }
      if (userContext.step2?.housingStatus) {
        prompt += `\nHousing situation: ${userContext.step2.housingStatus}`;
      }
      if (userContext.step2?.dependents) {
        prompt += `\nNumber of dependents: ${userContext.step2.dependents}`;
      }
      
      prompt += `\n\nCurrent description: "${currentValue || '[empty]'}"`;
      
      if (fieldConstraints?.minLength) {
        prompt += `\n\nMinimum length required: ${fieldConstraints.minLength} characters`;
      }
      if (fieldConstraints?.maxLength) {
        prompt += `\nMaximum length allowed: ${fieldConstraints.maxLength} characters`;
      }
      
      prompt += `\n\nPlease provide an improved version that clearly explains the financial challenges and circumstances. Focus on specific situations that led to the need for assistance.`;
      
      return prompt;
    },
    
    examples: [
      "Due to unexpected medical expenses from a family emergency, my monthly budget has been severely impacted. These costs have depleted my savings, making it difficult to cover essential expenses like rent and utilities while maintaining my family's basic needs.",
      "Recent reduction in work hours has significantly decreased my monthly income, creating a gap between my earnings and essential living expenses. I am actively seeking additional employment opportunities while managing current financial obligations.",
      "Following a period of unemployment, I am working to rebuild financial stability but currently face challenges meeting all monthly expenses. The temporary assistance would help bridge this gap while I establish more secure employment."
    ],
    
    constraints: [
      "Must be specific about circumstances",
      "Should explain the cause of financial difficulty",
      "Must maintain professional tone",
      "Should indicate temporary nature if applicable",
      "Must not include personal blame or negative language about others"
    ]
  },

  employmentCircumstances: {
    systemPrompt: `You are a helpful assistant that helps people describe their employment situation for social support applications.

Your role is to:
- Help users clearly explain their current work status and job search efforts
- Present employment challenges professionally
- Highlight any efforts being made to improve the situation
- Focus on factual circumstances rather than personal opinions
- Use language appropriate for case workers and administrators

Guidelines:
- Keep responses 2-3 sentences (40-150 words)
- Be specific about current employment status
- Mention job search efforts if applicable
- Include any skills development or training
- Maintain optimistic but realistic tone`,
    
    userPrompt: (context: PromptContext) => {
      const { userContext, currentValue, fieldConstraints } = context;
      
      let prompt = `Help improve this description of employment circumstances for a social support application.`;
      
      if (userContext.step2?.employmentStatus) {
        prompt += `\nCurrent employment status: ${userContext.step2.employmentStatus}`;
      }
      if (userContext.step2?.monthlyIncome) {
        prompt += `\nCurrent monthly income: ${userContext.step2.monthlyIncome} AED`;
      }
      if (userContext.step1?.education) {
        prompt += `\nEducation level: ${userContext.step1.education}`;
      }
      
      prompt += `\n\nCurrent description: "${currentValue || '[empty]'}"`;
      
      if (fieldConstraints?.minLength) {
        prompt += `\n\nMinimum length required: ${fieldConstraints.minLength} characters`;
      }
      
      prompt += `\n\nPlease provide an improved version that clearly describes the employment situation, any challenges faced, and efforts being made to improve employment prospects.`;
      
      return prompt;
    },
    
    examples: [
      "Currently employed part-time but seeking full-time opportunities to achieve better financial stability. I am actively applying for positions in my field and attending skills development workshops to enhance my qualifications.",
      "Recently completed a period of unemployment and am now working temporary positions while searching for permanent employment. I am utilizing job placement services and networking to secure stable, long-term work.",
      "Working in a position with irregular hours that makes it challenging to meet consistent monthly expenses. I am exploring additional training opportunities to qualify for more stable employment with regular hours."
    ],
    
    constraints: [
      "Must clearly state current employment status",
      "Should mention any job search or improvement efforts",
      "Must maintain professional, forward-looking tone",
      "Should be specific about challenges without being negative",
      "Must not criticize employers or express frustration"
    ]
  },

  reasonForApplying: {
    systemPrompt: `You are a helpful assistant that helps people articulate why they need social support assistance.

Your role is to:
- Help users clearly explain the purpose and impact of requested assistance
- Connect financial need to specific outcomes and goals
- Demonstrate understanding of temporary vs. long-term support
- Show how assistance will help improve the overall situation
- Use language that shows responsibility and forward planning

Guidelines:
- Keep responses 2-4 sentences (60-200 words)
- Be specific about how assistance will be used
- Connect assistance to improving stability
- Show forward-thinking and responsibility
- Maintain grateful but not desperate tone`,
    
    userPrompt: (context: PromptContext) => {
      const { userContext, currentValue, fieldConstraints } = context;
      
      let prompt = `Help improve this explanation of why social support assistance is needed.`;
      
      // Add relevant context
      if (userContext.step2?.housingStatus) {
        prompt += `\nHousing situation: ${userContext.step2.housingStatus}`;
      }
      if (userContext.step2?.dependents) {
        prompt += `\nFamily size: ${userContext.step2.dependents} dependents`;
      }
      if (userContext.step2?.employmentStatus) {
        prompt += `\nEmployment: ${userContext.step2.employmentStatus}`;
      }
      
      prompt += `\n\nCurrent explanation: "${currentValue || '[empty]'}"`;
      
      if (fieldConstraints?.minLength) {
        prompt += `\n\nMinimum length required: ${fieldConstraints.minLength} characters`;
      }
      
      prompt += `\n\nPlease provide an improved version that clearly explains:
1. What specific assistance is needed
2. How this assistance will help improve the situation
3. Any steps being taken toward self-sufficiency
4. The expected timeframe for needing support`;
      
      return prompt;
    },
    
    examples: [
      "I am seeking temporary financial assistance to help maintain stable housing while I transition to full-time employment. This support would ensure my family remains in our current home during this period of rebuilding financial stability, allowing me to focus on securing better employment without the stress of potential displacement.",
      "Financial assistance would help cover essential living expenses during my job search period, enabling me to pursue appropriate employment opportunities without compromising my family's basic needs. This temporary support would bridge the gap until I secure stable income and can again be financially independent.",
      "I am requesting assistance to help manage monthly expenses while recovering from unexpected medical costs that depleted my emergency savings. This support would allow me to rebuild financial stability gradually while maintaining my current employment and meeting my family's ongoing needs."
    ],
    
    constraints: [
      "Must specify what type of assistance is needed",
      "Should explain how assistance will improve the situation",
      "Must show forward-thinking and planning",
      "Should indicate timeframe expectations",
      "Must demonstrate responsibility and effort toward self-sufficiency"
    ]
  },

  additionalComments: {
    systemPrompt: `You are a helpful assistant that helps people provide additional relevant information for social support applications.

Your role is to:
- Help users share relevant supplementary information
- Ensure information is appropriate and helpful for case evaluation
- Maintain respectful, professional tone
- Focus on facts that support the application
- Avoid redundant information already covered elsewhere

Guidelines:
- Keep responses 1-3 sentences (30-150 words)
- Focus on unique, relevant information
- Use professional but personal tone
- Include specific details when helpful
- Maintain dignity and respect`,
    
    userPrompt: (context: PromptContext) => {
      const { userContext, currentValue, fieldConstraints } = context;
      
      let prompt = `Help improve this additional information for a social support application.`;
      
      // Add context to avoid redundancy
      if (userContext.step2?.dependents) {
        prompt += `\nFamily size: ${userContext.step2.dependents} dependents`;
      }
      
      prompt += `\n\nCurrent additional information: "${currentValue || '[empty]'}"`;
      
      if (fieldConstraints?.maxLength) {
        prompt += `\nMaximum length allowed: ${fieldConstraints.maxLength} characters`;
      }
      
      prompt += `\n\nPlease provide improved additional information that:
1. Adds value to the application without repeating other sections
2. Includes relevant personal circumstances (health, family, etc.)
3. Maintains professional tone while being personal
4. Provides context that helps evaluators understand the situation better`;
      
      return prompt;
    },
    
    examples: [
      "I am the primary caregiver for my elderly mother who requires daily assistance, which limits my ability to work full-time. Additionally, I am managing a chronic health condition that affects my energy levels and work capacity.",
      "My spouse was recently diagnosed with a serious illness, requiring frequent medical appointments and treatments. This has created both emotional and financial stress while affecting our household's earning capacity.",
      "I am currently enrolled in a vocational training program to improve my job prospects, which demonstrates my commitment to becoming self-sufficient. The program ends in three months, after which I expect to secure better employment."
    ],
    
    constraints: [
      "Should add unique value not covered in other sections",
      "Must be relevant to the support request",
      "Should maintain appropriate level of personal detail",
      "Must not include overly sensitive medical/personal information",
      "Should demonstrate how circumstances affect the application"
    ]
  }
};

/**
 * Get system prompt for a specific field and language
 */
export function getSystemPrompt(fieldName: string, language: 'en' | 'ar'): string {
  const template = FIELD_PROMPT_TEMPLATES[fieldName];
  if (!template) {
    return getDefaultSystemPrompt(language);
  }
  
  if (language === 'ar') {
    // Arabic system prompts (simplified for now)
    return `أنت مساعد مفيد يساعد الأشخاص في كتابة أوصاف واضحة ومهنية لطلبات الدعم الاجتماعي. قدم اقتراحات مفيدة ومحترمة تحافظ على الكرامة مع التواصل الواضح للاحتياجات.`;
  }
  
  return template.systemPrompt;
}

/**
 * Build user prompt for a specific field with context
 * Legacy function for backward compatibility
 */
export function buildUserPrompt(fieldName: string, context: PromptContext): string {
  const template = FIELD_PROMPT_TEMPLATES[fieldName];
  if (!template) {
    return buildDefaultPrompt(fieldName, context);
  }
  
  return template.userPrompt(context);
}

/**
 * Enhanced context-aware prompt builder with field intelligence
 * This is the new smart prompt builder that leverages field intelligence
 */
export function buildSmartUserPrompt(
  fieldName: string, 
  context: PromptContext,
  intelligentContext?: AIFormContext
): string {
  // Analyze field intelligence if intelligent context is provided
  const fieldIntelligence = intelligentContext 
    ? analyzeFieldIntelligence(fieldName, context.currentValue, intelligentContext)
    : null;

  // Build enhanced context
  const enhancedContext: EnhancedPromptContext = {
    ...context,
    fieldIntelligence: fieldIntelligence || undefined,
    intelligentContext,
  };

  // Use intelligent template if available, otherwise fall back to standard template
  if (fieldIntelligence && intelligentContext) {
    return buildIntelligentPrompt(fieldName, enhancedContext);
  }

  // Fallback to standard template
  const template = FIELD_PROMPT_TEMPLATES[fieldName];
  if (!template) {
    return buildDefaultPrompt(fieldName, context);
  }
  
  return template.userPrompt(context);
}

/**
 * Get examples for a specific field
 * Legacy function for backward compatibility
 */
export function getFieldExamples(fieldName: string): string[] {
  const template = FIELD_PROMPT_TEMPLATES[fieldName];
  return template?.examples || [];
}

/**
 * Get dynamic, context-aware examples based on user's situation
 */
export function getDynamicFieldExamples(
  fieldName: string, 
  intelligentContext?: AIFormContext,
  fieldIntelligence?: FieldIntelligence
): string[] {
  // Get base examples
  const baseExamples = getFieldExamples(fieldName);
  
  // If no intelligent context, return base examples
  if (!intelligentContext || !fieldIntelligence) {
    return baseExamples;
  }
  
  // Generate situation-specific examples
  const situationExamples = generateSituationSpecificExamples(fieldName, fieldIntelligence, intelligentContext);
  
  // Combine and prioritize situation-specific examples
  if (situationExamples.length > 0) {
    // Return situation-specific examples first, then base examples
    return [...situationExamples, ...baseExamples].slice(0, 3); // Limit to 3 total examples
  }
  
  return baseExamples;
}

/**
 * Generate examples based on detected situation and form context
 */
function generateSituationSpecificExamples(
  fieldName: string,
  fieldIntelligence: FieldIntelligence,
  intelligentContext: AIFormContext
): string[] {
  const examples: string[] = [];
  const contentAnalysis = fieldIntelligence.contentAnalysis;
  
  if (!contentAnalysis) {
    return examples;
  }
  
  const situationType = contentAnalysis.situationType;
  const urgencyLevel = contentAnalysis.urgencyLevel;
  
  // Get form context for personalization
  const employmentStatus = intelligentContext.step2?.employmentStatus;
  const housingStatus = intelligentContext.step2?.housingStatus;
  const maritalStatus = intelligentContext.step2?.maritalStatus;
  const numberOfDependents = intelligentContext.step2?.numberOfDependents;
  
  // Generate field-specific situational examples
  if (fieldName === 'financialSituation') {
    examples.push(...generateFinancialSituationExamples(situationType, urgencyLevel, {
      employmentStatus,
      housingStatus,
      numberOfDependents
    }));
  } else if (fieldName === 'employmentCircumstances') {
    examples.push(...generateEmploymentCircumstancesExamples(situationType, urgencyLevel, {
      employmentStatus,
      maritalStatus,
      numberOfDependents
    }));
  } else if (fieldName === 'reasonForApplying') {
    examples.push(...generateReasonForApplyingExamples(situationType, urgencyLevel, {
      employmentStatus,
      housingStatus,
      numberOfDependents
    }));
  }
  
  return examples;
}

/**
 * Generate financial situation examples based on context
 */
function generateFinancialSituationExamples(
  situationType: string,
  urgencyLevel: string,
  context: { employmentStatus?: string; housingStatus?: string; numberOfDependents?: number }
): string[] {
  const examples: string[] = [];
  const { employmentStatus, housingStatus, numberOfDependents } = context;
  
  if (situationType === 'unemployment') {
    if (urgencyLevel === 'critical' || urgencyLevel === 'high') {
      examples.push(
        `I lost my job three months ago and my unemployment benefits have ended. My savings are completely depleted, and I'm facing immediate risk of ${housingStatus === 'rent' ? 'eviction' : 'foreclosure'}. ${numberOfDependents ? `With ${numberOfDependents} family members depending on me, ` : ''}I desperately need assistance to cover basic living expenses while I continue my intensive job search.`
      );
    } else {
      examples.push(
        `Due to company downsizing, I became unemployed six months ago. While I have some savings remaining, they are quickly diminishing as I cover ${housingStatus === 'rent' ? 'rent' : 'mortgage payments'} and daily expenses. ${numberOfDependents ? `Supporting ${numberOfDependents} dependents makes ` : ''}The financial strain is increasing each month as I actively search for new employment opportunities.`
      );
    }
  } else if (situationType === 'medical_emergency') {
    examples.push(
      `Unexpected medical expenses from a recent ${urgencyLevel === 'critical' ? 'emergency surgery' : 'serious illness'} have completely overwhelmed my budget. The medical bills exceeded my insurance coverage by thousands of dollars, forcing me to drain my emergency savings. ${employmentStatus === 'unemployed' ? 'Being unemployed compounds the crisis as' : 'Even while employed,'} I cannot keep up with both medical debt payments and basic living expenses.`
    );
  } else if (situationType === 'housing_crisis') {
    examples.push(
      `${urgencyLevel === 'critical' ? 'I received an eviction notice and have less than 30 days to' : 'I am struggling to'} maintain stable housing due to financial hardship. ${employmentStatus === 'unemployed' ? 'Since losing my job, I' : 'Despite being employed, I'} cannot afford the ${housingStatus === 'rent' ? 'monthly rent' : 'mortgage payments'} while covering other essential expenses. ${numberOfDependents ? `With ${numberOfDependents} family members, finding alternative housing is extremely challenging.` : 'Finding affordable alternative housing has proven extremely difficult.'}`
    );
  }
  
  return examples;
}

/**
 * Generate employment circumstances examples based on context
 */
function generateEmploymentCircumstancesExamples(
  situationType: string,
  urgencyLevel: string,
  context: { employmentStatus?: string; maritalStatus?: string; numberOfDependents?: number }
): string[] {
  const examples: string[] = [];
  const { employmentStatus, maritalStatus, numberOfDependents } = context;
  
  if (situationType === 'unemployment') {
    if (employmentStatus === 'unemployed') {
      examples.push(
        `I was laid off from my position as a ${urgencyLevel === 'critical' ? 'manufacturing worker when the plant closed suddenly' : 'retail manager due to company restructuring'}. For the past ${urgencyLevel === 'critical' ? 'eight' : 'four'} months, I have been actively searching for employment, submitting applications daily and attending job fairs. ${numberOfDependents ? `As a ${maritalStatus === 'single' ? 'single parent' : 'parent'} of ${numberOfDependents}, the pressure to find stable work is immense.` : 'Despite my efforts and experience, suitable opportunities in my field have been limited.'}`
      );
    } else if (employmentStatus === 'employed_part_time') {
      examples.push(
        `I currently work part-time but my hours were significantly reduced due to business slowdown. My current income only covers about ${urgencyLevel === 'critical' ? '40%' : '60%'} of my monthly expenses. I am actively seeking additional employment or full-time opportunities while maintaining my current position. ${numberOfDependents ? `Supporting ${numberOfDependents} dependents on reduced income has created substantial financial stress.` : 'The income reduction has made it impossible to meet all my financial obligations.'}`
      );
    }
  } else if (situationType === 'medical_emergency') {
    examples.push(
      `My employment has been significantly impacted by a recent medical condition that requires ${urgencyLevel === 'critical' ? 'immediate and ongoing treatment' : 'regular medical care and therapy'}. I have had to reduce my work hours and take unpaid medical leave, resulting in substantial income loss. ${employmentStatus === 'unemployed' ? 'I am currently unable to work full-time' : 'While I hope to return to full capacity'}, my current situation makes it difficult to maintain financial stability while focusing on recovery.`
    );
  }
  
  return examples;
}

/**
 * Generate reason for applying examples based on context
 */
function generateReasonForApplyingExamples(
  situationType: string,
  urgencyLevel: string,
  context: { employmentStatus?: string; housingStatus?: string; numberOfDependents?: number }
): string[] {
  const examples: string[] = [];
  const { employmentStatus, housingStatus, numberOfDependents } = context;
  
  if (situationType === 'unemployment' || situationType === 'financial_instability') {
    examples.push(
      `I am applying for social support to help bridge the gap between my current ${employmentStatus === 'unemployed' ? 'unemployment' : 'reduced income'} and my essential living expenses. This assistance would enable me to maintain ${housingStatus === 'rent' ? 'my rental housing' : 'my home'} and provide ${numberOfDependents ? `for my ${numberOfDependents} dependents` : 'for my basic needs'} while I ${employmentStatus === 'unemployed' ? 'secure new employment' : 'work toward financial stability'}. ${urgencyLevel === 'critical' ? 'Without immediate assistance, I face the risk of homelessness and inability to meet basic survival needs.' : 'This temporary support would provide the stability needed to focus on long-term solutions without the stress of immediate financial crisis.'}`
    );
  } else if (situationType === 'medical_emergency') {
    examples.push(
      `I am seeking assistance to help manage the financial impact of unexpected medical expenses while I ${employmentStatus === 'unemployed' ? 'recover and search for employment' : 'maintain my current work capacity'}. The medical costs have created an overwhelming burden that affects my ability to ${housingStatus === 'rent' ? 'pay rent' : 'maintain my housing'} and cover daily necessities. ${numberOfDependents ? `With ${numberOfDependents} family members depending on me, ` : ''}This support would allow me to focus on recovery and rebuilding financial stability without compromising ${numberOfDependents ? 'my family\'s' : 'my'} basic needs.`
    );
  } else if (situationType === 'housing_crisis') {
    examples.push(
      `I am applying for assistance to prevent homelessness and maintain stable housing for ${numberOfDependents ? `myself and ${numberOfDependents} dependents` : 'myself'}. ${urgencyLevel === 'critical' ? 'With an immediate eviction threat,' : 'Due to mounting housing costs,'} I need support to ${housingStatus === 'rent' ? 'catch up on rent payments' : 'prevent foreclosure'} while I ${employmentStatus === 'unemployed' ? 'secure employment' : 'stabilize my financial situation'}. Stable housing is essential for ${numberOfDependents ? 'maintaining my family\'s welfare and my children\'s schooling, as well as' : ''} providing the foundation I need to focus on employment and long-term financial recovery.`
    );
  }
  
  return examples;
}

/**
 * Get constraints for a specific field
 */
export function getFieldConstraints(fieldName: string): string[] {
  const template = FIELD_PROMPT_TEMPLATES[fieldName];
  return template?.constraints || [];
}

/**
 * Default system prompt for unknown fields
 */
function getDefaultSystemPrompt(language: 'en' | 'ar'): string {
  if (language === 'ar') {
    return `أنت مساعد مفيد يساعد الأشخاص في تحسين كتابتهم لطلبات الدعم الاجتماعي. قدم اقتراحات واضحة ومهنية ومحترمة.`;
  }
  
  return `You are a helpful assistant that helps people improve their writing for social support applications. Provide clear, professional, and respectful suggestions.`;
}

/**
 * Build intelligent prompt using field intelligence and context awareness
 */
function buildIntelligentPrompt(fieldName: string, context: EnhancedPromptContext): string {
  const { currentValue, fieldConstraints, fieldIntelligence, intelligentContext, language } = context;
  
  if (!fieldIntelligence || !intelligentContext) {
    return buildDefaultPrompt(fieldName, context);
  }

  let prompt = `Help improve this ${fieldName} description for a social support application.`;
  
  // Add field category context
  const category = fieldIntelligence.fieldContext.category;
  prompt += `\n\nField Type: ${category} information`;
  
  // Add situation-specific context if content analysis is available
  if (fieldIntelligence.contentAnalysis) {
    const analysis = fieldIntelligence.contentAnalysis;
    
    prompt += `\n\nDetected Situation: ${analysis.situationType.replace('_', ' ')}`;
    prompt += `\nUrgency Level: ${analysis.urgencyLevel}`;
    
    if (analysis.keyIndicators.length > 0) {
      prompt += `\nKey Indicators: ${analysis.keyIndicators.slice(0, 3).join(', ')}`;
    }
    
    prompt += `\n\nSuggested Approach: ${analysis.suggestedApproach}`;
    
    if (analysis.contextualInsights.length > 0) {
      prompt += `\n\nContextual Insights:`;
      analysis.contextualInsights.forEach(insight => {
        prompt += `\n- ${insight}`;
      });
    }
  }
  
  // Add cross-field relationship insights
  if (fieldIntelligence.crossFieldRelationships.derivedInsights?.length > 0) {
    prompt += `\n\nRelated Information Insights:`;
    fieldIntelligence.crossFieldRelationships.derivedInsights.forEach((insight: string) => {
      prompt += `\n- ${insight}`;
    });
  }
  
  // Add relevant form data context (privacy-safe)
  const relevantContext = buildRelevantFormContext(fieldName, intelligentContext);
  if (relevantContext) {
    prompt += `\n\nRelevant Form Context:\n${relevantContext}`;
  }
  
  // Add current content
  prompt += `\n\nCurrent content: "${currentValue || '[empty]'}"`;
  
  // Add field constraints
  if (fieldConstraints?.minLength) {
    prompt += `\nMinimum length: ${fieldConstraints.minLength} characters`;
  }
  if (fieldConstraints?.maxLength) {
    prompt += `\nMaximum length: ${fieldConstraints.maxLength} characters`;
  }
  
  // Add completeness score context
  const completeness = Math.round(fieldIntelligence.completenessScore * 100);
  prompt += `\nForm completeness: ${completeness}% (${completeness >= 70 ? 'good context available' : 'limited context'})`;
  
  // Add intelligent guidance based on field type and situation
  prompt += `\n\n${getIntelligentGuidance(fieldName, fieldIntelligence, language)}`;
  
  return prompt;
}

/**
 * Build relevant form context for the prompt (privacy-safe)
 */
function buildRelevantFormContext(fieldName: string, intelligentContext: AIFormContext): string {
  const fieldContext = detectFieldContext(fieldName);
  const relatedFields = fieldContext.relatedFields;
  
  const contextParts: string[] = [];
  
  // Check for relevant context from related fields
  relatedFields.forEach(relatedField => {
    const step1Value = intelligentContext.step1?.[relatedField as keyof typeof intelligentContext.step1];
    const step2Value = intelligentContext.step2?.[relatedField as keyof typeof intelligentContext.step2];
    const step3Value = intelligentContext.step3?.[relatedField as keyof typeof intelligentContext.step3];
    
    const value = step1Value || step2Value || step3Value;
    
    if (value !== undefined && value !== null && value !== '') {
      // Format the context appropriately
      if (relatedField === 'employmentStatus') {
        contextParts.push(`Employment: ${value}`);
      } else if (relatedField === 'housingStatus') {
        contextParts.push(`Housing: ${value}`);
      } else if (relatedField === 'maritalStatus') {
        contextParts.push(`Marital status: ${value}`);
      } else if (relatedField === 'numberOfDependents' && typeof value === 'number' && value > 0) {
        contextParts.push(`Family: ${value} dependents`);
      } else if (relatedField === 'incomeLevel') {
        contextParts.push(`Income level: ${value}`);
      } else if (relatedField === 'financialBalance') {
        contextParts.push(`Financial situation: ${value}`);
      }
    }
  });
  
  return contextParts.length > 0 ? contextParts.join(', ') : '';
}

/**
 * Get intelligent guidance based on field analysis
 */
function getIntelligentGuidance(
  _fieldName: string, 
  fieldIntelligence: FieldIntelligence, 
  language: 'en' | 'ar'
): string {
  if (language === 'ar') {
    return 'يرجى تقديم نسخة محسنة واضحة ومهنية ومناسبة لطلب الدعم الاجتماعي، مع مراعاة السياق والظروف المذكورة أعلاه.';
  }
  
  const category = fieldIntelligence.fieldContext.category;
  const hasContentAnalysis = fieldIntelligence.contentAnalysis !== null;
  const completeness = fieldIntelligence.completenessScore;
  
  let guidance = 'Please provide an improved version that is clear, professional, and appropriate for a social support application';
  
  if (hasContentAnalysis && fieldIntelligence.contentAnalysis) {
    const urgency = fieldIntelligence.contentAnalysis.urgencyLevel;
    const situation = fieldIntelligence.contentAnalysis.situationType;
    
    if (urgency === 'critical' || urgency === 'high') {
      guidance += ', emphasizing the urgent nature of your situation';
    }
    
    if (situation === 'unemployment') {
      guidance += ', highlighting your job search efforts and immediate financial needs';
    } else if (situation === 'medical_emergency') {
      guidance += ', detailing the medical situation and its impact on your finances';
    } else if (situation === 'housing_crisis') {
      guidance += ', focusing on your housing needs and timeline';
    }
  }
  
  if (category === 'financial') {
    guidance += '. Include specific amounts when helpful and explain the timeline of difficulties';
  } else if (category === 'employment') {
    guidance += '. Include work history, barriers to employment, and any active job search efforts';
  } else if (category === 'descriptive') {
    guidance += '. Use the contextual information above to make your description more specific and compelling';
  }
  
  if (completeness < 0.5) {
    guidance += '. Note: Limited form context available - consider providing more background information';
  }
  
  guidance += '.';
  
  return guidance;
}

/**
 * Default prompt builder for unknown fields
 */
function buildDefaultPrompt(fieldName: string, context: PromptContext): string {
  const { currentValue, fieldConstraints } = context;
  
  let prompt = `Help improve this ${fieldName} field for a social support application.`;
  prompt += `\n\nCurrent content: "${currentValue || '[empty]'}"`;
  
  if (fieldConstraints?.minLength) {
    prompt += `\nMinimum length: ${fieldConstraints.minLength} characters`;
  }
  if (fieldConstraints?.maxLength) {
    prompt += `\nMaximum length: ${fieldConstraints.maxLength} characters`;
  }
  
  prompt += `\n\nPlease provide an improved version that is clear, professional, and appropriate for a social support application.`;
  
  return prompt;
}