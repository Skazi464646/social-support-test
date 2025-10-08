/**
 * Field-Specific Prompt Templates
 * Module 5 - Step 3: Create Field-Specific Prompt Templates
 * Enhanced for Context-Aware AI (Phase 3)
 */

import type { AIFormContext } from '@/hooks/useAIFormContext';
import { AI_FIELD_DEFAULTS } from '@/constants';
// import { PROMPT_TEMPLATE_SHARED, PROMPT_TEMPLATE_FIELDS, PROMPT_TEMPLATE_MODAL_CONFIG, PROMPT_TEMPLATE_FIELD_LABELS, PROMPT_TEMPLATE_MESSAGES, PROMPT_TEMPLATE_CONTEXT_HINTS, PROMPT_TEMPLATE_EXAMPLE_GENERATION, PROMPT_TEMPLATE_RELEVANCY } from '@/constants/promptTemplates';
import { 
  analyzeFieldIntelligence, 
  detectFieldContext,
  type FieldIntelligence 
} from './field-intelligence';
import { analyzeContentRelevance, type ContentAnalysis } from './content-analysis';

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
  contentAnalysis?: ContentAnalysis;
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
    systemPrompt: `You are a rewriting engine that helps people write clear, professional descriptions of their financial circumstances for social support applications. 

Your role is to:
- Help users articulate their financial challenges clearly and respectfully
- Use appropriate tone for government/social service contexts
- Focus on facts and circumstances rather than emotions
- Ensure rewrite without adding any introductory or explanatory text.

Guidelines:
- Do not include you words/thoughts in the response
- Do not add any word which you say only spit the response
-and NO additional commentary, analysis, or explanation. 
- Keep responses 2-4 sentences (50-200 words)
- Use professional but accessible language
- Focus on circumstances, not blame
- Include specific impacts when possible
- Maintain respectful, factual tone
You are a rewriting engine.

Rules:
- Never add explanations, introductions, or commentary before or after the rewritten text.
- Return ONLY the final rewritten text. No greetings. No meta statements.
- Do not describe what you are doing.
- Do not explain why the text is rewritten.
- Never say phrases like "here's the refined version", "this version", "I can help", or similar.`,
    
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
      "Must not include personal blame or negative language about others",
      "and NO additional commentary, analysis, or explanation. ",
         "Do not include you words/thoughts in the response",
      "Do not add any word which you say only spit the response"
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
-Ensure guidance without adding any introductory or explanatory text.

Guidelines:
-Do not add introductory or explanatory text. Just raw output without your thoughts and user greeting
- Do not include you words/thoughts in the response
- Do not add any word which you say only spit the response
-and NO additional commentary, analysis, or explanation. 
- Keep responses 2-3 sentences (40-150 words)
- Be specific about current employment status
- Mention job search efforts if applicable
- Include any skills development or training
- Maintain optimistic but realistic tone
- Do not add any of your own thoughts in the response only help to craft the suggestion.
- Do not add any of your words.`,
    
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
      "Must not criticize employers or express frustration",
      "and NO additional commentary, analysis, or explanation.",
         "Do not include you words/thoughts in the response",
      "Do not add any word which you say only spit the response",
      "Do not add any of your own thoughts in the response only help to craft the suggestion",
"Do not add any of your words."
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
- Do not include you words/thoughts in the response
- Do not add any word which you say only spit the response
-and NO additional commentary, analysis, or explanation. 
- Keep responses 2-4 sentences (60-200 words)
- Be specific about how assistance will be used
- Connect assistance to improving stability
- Show forward-thinking and responsibility
- Maintain grateful but not desperate tone
- Do not add any of your own thoughts in the response only help to craft the suggestion.
- Do not add any of your words.`,
    
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
4. The expected timeframe for needing support
- Do not add any of your own thoughts in the response only help to craft the suggestion.
- Do not add any of your words.
`;
      
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
      "Must demonstrate responsibility and effort toward self-sufficiency",
      "Do not include you words/thoughts in the response",
      "Do not add any word which you say only spit the response",
      "Do not add any of your own thoughts in the response only help to craft the suggestion",
"Do not add any of your words."
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
- Do not include you words/thoughts in the response
- Do not add any word which you say only spit the response
-and NO additional commentary, analysis, or explanation. 
- Keep responses 1-3 sentences (30-150 words)
- Focus on unique, relevant information
- Use professional but personal tone
- Include specific details when helpful
- Maintain dignity and respect
- Do not add any of your own thoughts in the response only help to craft the suggestion.
- Do not add any of your words.
`,
    
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
4. Provides context that helps evaluators understand the situation better
5. Do not add any of your own thoughts in the response only help to craft the suggestion.
6. Do not add any of your words.
`;
      
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
      "Should demonstrate how circumstances affect the application",
      "Do not add any of your own thoughts in the response only help to craft the suggestion",
  "Do not add any of your words."
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
  // Get field label for content analysis
  const fieldLabel = getFieldLabel(fieldName);
  
  // Analyze content relevance and determine strategy
  const contentAnalysis = analyzeContentRelevance(fieldName, context.currentValue, fieldLabel);
  
  // Handle redirect strategy (irrelevant/vague content)
  // if (contentAnalysis.promptStrategy === 'redirect') {
  //   return buildRedirectPrompt(fieldName, fieldLabel, contentAnalysis.redirectReason!);
  // }

  // Analyze field intelligence if intelligent context is provided
  const fieldIntelligence = intelligentContext 
    ? analyzeFieldIntelligence(fieldName, context.currentValue, intelligentContext)
    : null;

  // Build enhanced context with content analysis
  const enhancedContext: EnhancedPromptContext = {
    ...context,
    fieldIntelligence: fieldIntelligence || undefined,
    contentAnalysis,
    intelligentContext,
  };

  // Use intelligent template based on strategy
  if (fieldIntelligence && intelligentContext) {
    if (contentAnalysis.promptStrategy === 'enhance') {
      return buildEnhancementPrompt(fieldName, enhancedContext);
    } else if (contentAnalysis.promptStrategy === 'generate') {
      return buildGenerationPrompt(fieldName, enhancedContext);
    }
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
  
  return `You are a You are a rewriting engine that helps people improve their writing for social support applications. Provide clear, professional, and respectful suggestions.If User provided a value, use it to improve the prompt.Please only respond with the value, do not reply with extra words.-Do not add any of your own thoughts in the response only help to craft the suggestion. Do not add any of your words.`;
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
  
  let prompt = `You are a rewriting engine. Help improve this ${fieldName} field for a social support application.`;
  prompt += `\n\nCurrent content: "${currentValue || '[empty]'}"`;
  
  if (fieldConstraints?.minLength) {
    prompt += `\nMinimum length: ${fieldConstraints.minLength} characters`;
  }
  if (fieldConstraints?.maxLength) {
    prompt += `\nMaximum length: ${fieldConstraints.maxLength} characters`;
  }
  
  prompt += `\n\nPlease provide an improved version adding to the Current content  that is clear, professional, and appropriate for a social support application.
  - Do not add any of your own thoughts in the response only help to craft the suggestion.
- Do not add any of your words.

Rules:
- Never add explanations, introductions, or commentary before or after the rewritten text.
- Return ONLY the final rewritten text. No greetings. No meta statements.
- Do not describe what you are doing.
- Do not explain why the text is rewritten.
- Never say phrases like "here's the refined version", "this version", "I can help", or similar.`;
  
  return prompt;
}

/**
 * Field-specific modal configuration for titles and descriptions
 */
interface FieldModalConfig {
  title: string;
  description: string;
  placeholder: string;
  guidance: string[];
}

const FIELD_MODAL_CONFIG: Record<string, FieldModalConfig> = {
  financialSituation: {
    title: "💰 Describe Your Financial Situation",
    description: "Help us understand your current financial circumstances and challenges you're facing.",
    placeholder: "Describe your income, expenses, debts, and any financial difficulties you're experiencing...",
    guidance: [
      "Include details about your income sources and amounts",
      "Mention any significant expenses or debts",
      "Explain how your situation has changed recently",
      "Describe specific financial challenges you're facing"
    ]
  },
  employmentCircumstances: {
    title: "💼 Describe Your Employment Circumstances", 
    description: "Share details about your work situation, job search, or employment challenges.",
    placeholder: "Describe your current employment status, work history, and any barriers to employment...",
    guidance: [
      "Explain your current employment status and work history",
      "Mention any job search efforts or applications",
      "Describe skills, experience, or qualifications you have",
      "Include any barriers to finding or maintaining employment"
    ]
  },
  reasonForApplying: {
    title: "📋 Explain Your Reason for Applying",
    description: "Tell us why you need social support and how it will help your situation.",
    placeholder: "Explain why you're applying for assistance and how it will help your specific situation...",
    guidance: [
      "Be specific about what type of help you need",
      "Explain the urgency or timeline of your need",
      "Describe how this assistance will improve your situation",
      "Mention any steps you're taking to address your challenges"
    ]
  },
  currentFinancialNeed: {
    title: "💸 Describe Your Current Financial Need",
    description: "Specify the immediate financial assistance you require.",
    placeholder: "Detail your urgent financial needs and specific amounts if known...",
    guidance: [
      "Specify exact amounts needed if possible",
      "Explain the urgency of these financial needs",
      "Describe what expenses this will cover",
      "Mention consequences if assistance isn't received"
    ]
  },
  monthlyExpenses: {
    title: "📊 Detail Your Monthly Expenses",
    description: "Break down your regular monthly costs and financial obligations.",
    placeholder: "List your monthly expenses including rent, utilities, food, transportation...",
    guidance: [
      "Include all major monthly expenses (rent, utilities, food)",
      "Mention any debt payments or loan obligations",
      "Note expenses that have increased recently",
      "Specify which expenses are most challenging to meet"
    ]
  },
  emergencyDescription: {
    title: "🚨 Describe Your Emergency Situation",
    description: "Explain the urgent circumstances that require immediate assistance.",
    placeholder: "Describe the emergency situation and why immediate help is needed...",
    guidance: [
      "Clearly explain the nature of the emergency",
      "Describe the timeline and urgency",
      "Mention immediate consequences if help isn't provided", 
      "Include any steps you've already taken to address it"
    ]
  }
};

/**
 * Get field-specific modal configuration
 */
export function getFieldModalConfig(fieldName: string): FieldModalConfig {
  return FIELD_MODAL_CONFIG[fieldName] || {
    title: `✨ AI Writing Assistant`,
    description: `Get help writing your ${getFieldLabel(fieldName)} with AI assistance.`,
    placeholder: `Describe your ${getFieldLabel(fieldName)} in detail...`,
    guidance: [
      "Be specific and detailed in your description",
      "Include relevant background information",
      "Explain your current situation clearly",
      "Mention any important context or circumstances"
    ]
  };
}

/**
 * Get field label for content analysis
 */
function getFieldLabel(fieldName: string): string {
  const labels: Record<string, string> = {
    financialSituation: 'financial situation',
    employmentCircumstances: 'employment circumstances', 
    reasonForApplying: 'reason for applying',
    currentFinancialNeed: 'current financial need',
    monthlyExpenses: 'monthly expenses',
    emergencyDescription: 'emergency description'
  };
  
  return labels[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
}

/**
 * Build redirect prompt for irrelevant content
 */
function buildRedirectPrompt(fieldName: string, fieldLabel: string, reason: string): string {
  return `I understand you're looking for help, but ${reason}

Instead, please describe your specific ${fieldLabel}. For example, you could share:
- What challenges or difficulties you're currently facing
- How your circumstances have changed recently  
- What specific support you need and why
- Any relevant background information about your situation

This will help me provide much better, more relevant assistance for your ${fieldLabel}.

Rules:
- Never add explanations, introductions, or commentary before or after the rewritten text.
- Return ONLY the final rewritten text. No greetings. No meta statements.
- Do not describe what you are doing.
- Do not explain why the text is rewritten.
- Never say phrases like "here's the refined version", "this version", "I can help", or similar.`;
}

/**
 * Build enhancement prompt for relevant content
 */
function buildEnhancementPrompt(fieldName: string, context: EnhancedPromptContext): string {
  const { currentValue, fieldIntelligence, intelligentContext } = context;
  const fieldLabel = getFieldLabel(fieldName);
  
  let prompt = `I'll help enhance your ${fieldLabel} description. Here's what you've written:

"${currentValue}"

I'll improve this by:`;

  // Add specific enhancement strategies based on field intelligence
  if (fieldIntelligence && fieldIntelligence.contentAnalysis) {
    if (fieldIntelligence.contentAnalysis.situationType !== 'general_support') {
      prompt += `\n- Incorporating your ${fieldIntelligence.contentAnalysis.situationType.replace('_', ' ')} situation more effectively`;
    }
    
    if (fieldIntelligence.contentAnalysis.urgencyLevel === 'critical' || fieldIntelligence.contentAnalysis.urgencyLevel === 'high') {
      prompt += `\n- Emphasizing the urgent nature of your circumstances`;
    }
    
    if (Object.keys(fieldIntelligence.crossFieldRelationships).length > 0) {
      prompt += `\n- Connecting it to your other form details for a complete picture`;
    }
  }

  // Add context from other form steps  
  if (intelligentContext && (intelligentContext.step1 || intelligentContext.step2)) {
    prompt += `\n- Using your background information to make it more specific and compelling`;
    
    // Add relevant context hints
    const contextHints = buildContextualHints(intelligentContext, fieldIntelligence);
    if (contextHints) {
      prompt += `\n\nRelevant context from your application:\n${contextHints}`;
    }
  }

  prompt += `\n\nPlease provide an enhanced version that is:\n- More detailed and specific\n- Professional yet personal\n- Clear about your needs and circumstances\n- Appropriate for a social support application.
  Note:
  - Do not add any of your own thoughts in the response only help to craft the suggestion.
  - Do not add any of your words.

  Rules:
- Never add explanations, introductions, or commentary before or after the rewritten text.
- Return ONLY the final rewritten text. No greetings. No meta statements.
- Do not describe what you are doing.
- Do not explain why the text is rewritten.
- Never say phrases like "here's the refined version", "this version", "I can help", or similar.`;

  return prompt;
}

/**
 * Build generation prompt for empty content
 */
function buildGenerationPrompt(fieldName: string, context: EnhancedPromptContext): string {
  const { fieldIntelligence, intelligentContext } = context;
  const fieldLabel = getFieldLabel(fieldName);
  
  let prompt = `I'll help you write your ${fieldLabel} based on the information you've provided in your application.`;

  // Add context from other form steps
  if (intelligentContext && (intelligentContext.step1 || intelligentContext.step2)) {
    const contextHints = buildContextualHints(intelligentContext, fieldIntelligence);
    if (contextHints) {
      prompt += `\n\nBased on your application details:\n${contextHints}`;
    }
  }

  // Add field-specific guidance
  if (fieldIntelligence && fieldIntelligence.contentAnalysis) {
    if (fieldIntelligence.contentAnalysis.situationType !== 'general_support') {
      prompt += `\n\nI'll focus on your ${fieldIntelligence.contentAnalysis.situationType.replace('_', ' ')} situation`;
    }
    
    if (fieldIntelligence.contentAnalysis.urgencyLevel === 'critical' || fieldIntelligence.contentAnalysis.urgencyLevel === 'high') {
      prompt += ` and emphasize the urgent nature of your circumstances`;
    }
  }

  prompt += `\n\nI'll create a description that is:\n- Specific to your situation\n- Professional and compelling\n- Appropriate length and detail\n- Focused on your needs and circumstances.
    Note:
    - Do not add any of your own thoughts in the response only help to craft the suggestion.
    - Do not add any of your words.
  `;

  return prompt;
}

/**
 * Build contextual hints from form data
 */
function buildContextualHints(intelligentContext: AIFormContext, _fieldIntelligence?: FieldIntelligence): string {
  const hints: string[] = [];
  
  // Add employment and family context from step2
  if (intelligentContext.step2) {
    // Employment status
    if (intelligentContext.step2.employmentStatus === 'unemployed') {
      hints.push('You are currently unemployed');
    } else if (intelligentContext.step2.employmentStatus === 'employed_full_time') {
      hints.push('You are currently employed full-time');
    } else if (intelligentContext.step2.employmentStatus === 'employed_part_time') {
      hints.push('You are currently employed part-time');
    } else if (intelligentContext.step2.employmentStatus === 'self_employed') {
      hints.push('You are self-employed');
    }
    
    // Family size
    if (intelligentContext.step2.numberOfDependents && Number(intelligentContext.step2.numberOfDependents) > 0) {
      hints.push(`You have ${intelligentContext.step2.numberOfDependents} dependents`);
    }
    
    // Income level
    if (intelligentContext.step2.monthlyIncome) {
      const income = Number(intelligentContext.step2.monthlyIncome);
      if (income === 0) {
        hints.push('You have no current income');
      } else if (income < 2000) {
        hints.push('You have limited income');
      }
    }
    
    // Housing status  
    if (intelligentContext.step2.housingStatus === 'homeless') {
      hints.push('You are currently experiencing homelessness');
    } else if (intelligentContext.step2.housingStatus === 'rent') {
      hints.push('You are renting your current housing');
    } else if (intelligentContext.step2.housingStatus === 'own') {
      hints.push('You own your current housing');
    }
  }
  
  return hints.length > 0 ? `- ${hints.join('\n- ')}` : '';
}


/**
 * Build system prompt for example generation
 */
export function buildExampleGenerationSystemPrompt(fieldName: string, language: 'en' | 'ar'): string {
  const fieldLabel = getFieldLabel(fieldName);
  
  return `You are an AI assistant helping users fill out a financial assistance form.

Your job is to generate 3 relevant examples for the "${fieldLabel}" section that will help the user write their response.

The user is applying for government financial assistance and needs help describing their ${fieldLabel}.

Generate exactly 3 examples that:
- Are realistic and appropriate for someone applying for financial assistance
- Show different ways to describe ${fieldLabel} circumstances
- Use professional but personal tone
- Are 2-4 sentences each
- Help demonstrate genuine need for assistance

Language: ${language === 'ar' ? 'Arabic' : 'English'}`;
}

/**
 * Build user prompt for example generation based on user input
 * CORE JOURNEY: User Input + Step1 Context + Step2 Context = Contextual Examples
 */
/**
 * Extract simple form metadata from Step 2 for example generation
 */
function extractFormMetadata(intelligentContext: AIFormContext): string {
  if (!intelligentContext?.step2) {
    return '- No form data available';
  }

  const step2 = intelligentContext.step2;
  const metadata: string[] = [];
  
  // Employment
  if (step2.employmentStatus) {
    metadata.push(`- Employment: ${step2.employmentStatus}`);
  }
  
  // Income
  if (step2.monthlyIncome !== undefined) {
    const income = Number(step2.monthlyIncome);
    metadata.push(`- Monthly Income: $${income.toLocaleString()}`);
  }
  
  // Family
  if (step2.numberOfDependents !== undefined) {
    const dependents = Number(step2.numberOfDependents);
    metadata.push(`- Dependents: ${dependents}`);
  }
  
  // Housing
  if (step2.housingStatus) {
    metadata.push(`- Housing: ${step2.housingStatus}`);
  }
  
  // Marital status
  if (step2.maritalStatus) {
    metadata.push(`- Marital Status: ${step2.maritalStatus}`);
  }
  
  return metadata.length > 0 ? metadata.join('\n') : '- No form metadata available';
}

export function buildExampleGenerationUserPrompt(request: any): string {
  const fieldLabel = getFieldLabel(request.fieldName);
  const hasUserInput = request.userInput && request.userInput.trim().length >= AI_FIELD_DEFAULTS.hasUserInputMinChars;
  
  let prompt = '';

  // Get key form metadata from Step 2
  const formMetadata = extractFormMetadata(request.intelligentContext);
  
  if (hasUserInput) {
    // SCENARIO 1: User has input - generate examples based on input + form metadata
    prompt = `The user is filling out a financial assistance form and wrote this for their ${fieldLabel}:

"${request.userInput}"

Their current situation from the form:
${formMetadata}

Based on what they wrote about "${request.userInput}" and their current situation (${request.intelligentContext?.step2?.employmentStatus || 'unemployed'}, ${request.intelligentContext?.step2?.numberOfDependents || '0'} dependents, ${request.intelligentContext?.step2?.housingStatus || 'housing situation'}), generate 3 examples that:

- Build directly on their specific situation: "${request.userInput}"
- Show how someone with their exact employment/family circumstances would describe similar experiences
- Connect their input to their need for financial assistance
- Use professional but personal tone
- Be 2-4 sentences each

Start each example with "Example:"`;
  } else {
    // SCENARIO 2: No input - generate examples based on form metadata only
    prompt = `The user is filling out a financial assistance form and needs help with the ${fieldLabel} section.

Their situation:
${formMetadata}

Generate 3 realistic examples for someone in their situation that show:
- How their employment/income situation creates need for assistance
- Impact on their family if applicable
- Clear demonstration of financial hardship
- Professional but personal tone

Each example should be 2-4 sentences.
Start each example with "Example:"`;
  }

  return prompt;
}

/**
 * Build system prompt for relevancy validation
 */
export function buildRelevancySystemPrompt(fieldName: string, language: 'en' | 'ar',userInput:string): string {
  const fieldLabel = getFieldLabel(fieldName);
  
  return `You are an AI assistant that evaluates if user input is relevant to a specific form field.

Your job is to determine if the user's input- ${userInput} is relevant to the "${fieldLabel}" field in a government financial assistance/support application. If You feel that more information should be provided then directly lower the relevancyScore

Evaluate the input and respond with a JSON object:
{
  "isRelevant": true/false,
  "relevancyScore": 0-100,
  "reason": "Brief explanation of why it is or isn't relevant"
}

Consider relevant:
- Content that describes ${fieldLabel} circumstances
- Personal experiences related to ${fieldLabel}
- Information that helps understand their ${fieldLabel} situation

Consider irrelevant:
- Random text or gibberish
- Content unrelated to ${fieldLabel}
- Very vague statements without context
- Off-topic information

Language: ${language === 'ar' ? 'Arabic' : 'English'}`;
}

/**
 * Build user prompt for relevancy validation
 */
export function buildRelevancyUserPrompt(request: any): string {
  const fieldLabel = getFieldLabel(request.fieldName);
  const formMetadata = extractFormMetadata(request.intelligentContext);
  
  return `Field: ${fieldLabel}
Form context:
${formMetadata}

User input to evaluate:
"${request.userInput}"

Is this input relevant to the "${fieldLabel}" field? Consider their form context and evaluate if the input helps describe their ${fieldLabel}.

Respond with JSON only.`;
}

/**
 * Parse relevancy response from OpenAI
 */
export function parseRelevancyResponse(content: string): {
  isRelevant: boolean;
  relevancyScore: number;
  reason: string;
} {
  try {
    // Try to parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        isRelevant: Boolean(parsed.isRelevant),
        relevancyScore: Math.min(100, Math.max(0, Number(parsed.relevancyScore) || 0)),
        reason: String(parsed.reason || 'No reason provided'),
      };
    }
  } catch (error) {
    console.warn('[Relevancy] Failed to parse JSON response:', error);
  }
  
  // Fallback parsing if JSON fails
  const isRelevant = /relevant.*true|true.*relevant/i.test(content) && !/not.*relevant|irrelevant/i.test(content);
  
  return {
    isRelevant,
    relevancyScore: isRelevant ? 70 : 30,
    reason: isRelevant ? 'Content appears relevant' : 'Content appears irrelevant or unclear',
  };
}

/**
 * Parse examples from OpenAI response
 */
export function parseExamplesFromResponse(content: string): string[] {
  // Split by "Example:" and clean up
  const parts = content.split(/Example:\s*/i);
  
  // Remove the first part (usually empty or contains instructions)
  const examples = parts.slice(1)
    .map(example => example.trim())
    .filter(example => example.length > 0)
    .map(example => {
      // Remove any trailing instructions or notes
      const firstPart = example.split('\n\n')[0];
      return firstPart ? firstPart.trim() : example.trim();
    })
    .slice(0, 3); // Limit to 3 examples
  
  return examples;
}