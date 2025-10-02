/**
 * Field-Specific Prompt Templates
 * Module 5 - Step 3: Create Field-Specific Prompt Templates
 */

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
 */
export function buildUserPrompt(fieldName: string, context: PromptContext): string {
  const template = FIELD_PROMPT_TEMPLATES[fieldName];
  if (!template) {
    return buildDefaultPrompt(fieldName, context);
  }
  
  return template.userPrompt(context);
}

/**
 * Get examples for a specific field
 */
export function getFieldExamples(fieldName: string): string[] {
  const template = FIELD_PROMPT_TEMPLATES[fieldName];
  return template?.examples || [];
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