// export const PROMPT_TEMPLATE_SHARED = {
//   placeholders: {
//     empty: '[empty]',
//   },
//   metrics: {
//     minLengthPrefix: 'Minimum length required: ',
//     maxLengthPrefix: 'Maximum length allowed: ',
//     minLengthLabel: 'Minimum length: ',
//     maxLengthLabel: 'Maximum length: ',
//     charactersSuffix: ' characters',
//   },
//   defaultPrompt: {
//     introTemplate: 'Help improve this {fieldName} field for a social support application.',
//     currentContentLabel: 'Current content: "',
//     closing: 'Please provide an improved version that is clear, professional, and appropriate for a social support application.',
//   },
//   englishGuidanceBase: 'Please provide an improved version that is clear, professional, and appropriate for a social support application',
//   arabicSystemPrompt:
//     'أنت مساعد مفيد يساعد الأشخاص في كتابة أوصاف واضحة ومهنية لطلبات الدعم الاجتماعي. قدم اقتراحات مفيدة ومحترمة تحافظ على الكرامة مع التواصل الواضح للاحتياجات.',
//   modalFallback: {
//     title: '✨ AI Writing Assistant',
//     descriptionTemplate: 'Get help writing your {fieldLabel} with AI assistance.',
//     placeholderTemplate: 'Describe your {fieldLabel} in detail...',
//     guidance: [
//       'Be specific and detailed in your description',
//       'Include relevant background information',
//       'Explain your current situation clearly',
//       'Mention any important context or circumstances',
//     ],
//   },
// } as const;

// export const PROMPT_TEMPLATE_FIELDS = {
//   financialSituation: {
//     systemPrompt: `You are a helpful assistant that helps people write clear, professional descriptions of their financial circumstances for social support applications. 

// Your role is to:
// - Help users articulate their financial challenges clearly and respectfully
// - Maintain dignity while communicating genuine need
// - Use appropriate tone for government/social service contexts
// - Focus on facts and circumstances rather than emotions
// - Ensure descriptions are specific enough to be useful for case workers

// Guidelines:
// - Do not include you words/thoughts in the response
// - Do not add any word which you say only spit the response
// -and NO additional commentary, analysis, or explanation. 
// - Keep responses 2-4 sentences (50-200 words)
// - Use professional but accessible language
// - Focus on circumstances, not blame
// - Include specific impacts when possible
// - Maintain respectful, factual tone`,
//     userPrompt: {
//       intro: 'Help improve this description of financial circumstances for a social support application.',
//       contextLabels: {
//         employmentStatus: 'Employment status: ',
//         monthlyIncomePrefix: 'Monthly income: ',
//         monthlyIncomeSuffix: ' AED',
//         housingStatus: 'Housing situation: ',
//         dependentsPrefix: 'Number of dependents: ',
//       },
//       currentLabel: 'Current description: "',
//       closing:
//         'Please provide an improved version that clearly explains the financial challenges and circumstances. Focus on specific situations that led to the need for assistance.',
//     },
//     examples: [
//       'Due to unexpected medical expenses from a family emergency, my monthly budget has been severely impacted. These costs have depleted my savings, making it difficult to cover essential expenses like rent and utilities while maintaining my family\'s basic needs.',
//       'Recent reduction in work hours has significantly decreased my monthly income, creating a gap between my earnings and essential living expenses. I am actively seeking additional employment opportunities while managing current financial obligations.',
//       'Following a period of unemployment, I am working to rebuild financial stability but currently face challenges meeting all monthly expenses. The temporary assistance would help bridge this gap while I establish more secure employment.',
//     ],
//     constraints: [
//       'Must be specific about circumstances',
//       'Should explain the cause of financial difficulty',
//       'Must maintain professional tone',
//       'Should indicate temporary nature if applicable',
//       'Must not include personal blame or negative language about others',
//       'and NO additional commentary, analysis, or explanation. ',
//       'Do not include you words/thoughts in the response',
//       'Do not add any word which you say only spit the response',
//     ],
//   },
//   employmentCircumstances: {
//     systemPrompt: `You are a helpful assistant that helps people describe their employment situation for social support applications.

// Your role is to:
// - Help users clearly explain their current work status and job search efforts
// - Present employment challenges professionally
// - Highlight any efforts being made to improve the situation
// - Focus on factual circumstances rather than personal opinions
// - Use language appropriate for case workers and administrators

// Guidelines:
// - Do not include you words/thoughts in the response
// - Do not add any word which you say only spit the response
// -and NO additional commentary, analysis, or explanation. 
// - Keep responses 2-3 sentences (40-150 words)
// - Be specific about current employment status
// - Mention job search efforts if applicable
// - Include any skills development or training
// - Maintain optimistic but realistic tone
// - Do not add any of your own thoughts.
// - Do not add any of your words 
// `,
//     userPrompt: {
//       intro: 'Help improve this description of employment circumstances for a social support application.',
//       contextLabels: {
//         employmentStatus: 'Current employment status: ',
//         monthlyIncomePrefix: 'Current monthly income: ',
//         monthlyIncomeSuffix: ' AED',
//         education: 'Education level: ',
//       },
//       currentLabel: 'Current description: "',
//       closing:
//         'Please provide an improved version that clearly describes the employment situation, any challenges faced, and efforts being made to improve employment prospects.',
//     },
//     examples: [
//       'Currently employed part-time but seeking full-time opportunities to achieve better financial stability. I am actively applying for positions in my field and attending skills development workshops to enhance my qualifications.',
//       'Recently completed a period of unemployment and am now working temporary positions while searching for permanent employment. I am utilizing job placement services and networking to secure stable, long-term work.',
//       'Working in a position with irregular hours that makes it challenging to meet consistent monthly expenses. I am exploring additional training opportunities to qualify for more stable employment with regular hours.',
//     ],
//     constraints: [
//       'Must clearly state current employment status',
//       'Should mention any job search or improvement efforts',
//       'Must maintain professional, forward-looking tone',
//       'Should be specific about challenges without being negative',
//       'Must not criticize employers or express frustration',
//       'and NO additional commentary, analysis, or explanation.',
//       'Do not include you words/thoughts in the response',
//       'Do not add any word which you say only spit the response',
//     ],
//   },
//   reasonForApplying: {
//     systemPrompt: `You are a helpful assistant that helps people articulate why they need social support assistance.

// Your role is to:
// - Help users clearly explain the purpose and impact of requested assistance
// - Connect financial need to specific outcomes and goals
// - Demonstrate understanding of temporary vs. long-term support
// - Show how assistance will help improve the overall situation
// - Use language that shows responsibility and forward planning

// Guidelines:
// - Do not include you words/thoughts in the response
// - Do not add any word which you say only spit the response
// -and NO additional commentary, analysis, or explanation. 
// - Keep responses 2-4 sentences (60-200 words)
// - Be specific about how assistance will be used
// - Connect assistance to improving stability
// - Show forward-thinking and responsibility
// - Maintain grateful but not desperate tone`,
//     userPrompt: {
//       intro: 'Help improve this explanation of why social support assistance is needed.',
//       contextLabels: {
//         housingStatus: 'Housing situation: ',
//         dependentsPrefix: 'Family size: ',
//         dependentsSuffix: ' dependents',
//         employmentStatus: 'Employment: ',
//       },
//       currentLabel: 'Current explanation: "',
//       closing: `Please provide an improved version that clearly explains:
// 1. What specific assistance is needed
// 2. How this assistance will help improve the situation
// 3. Any steps being taken toward self-sufficiency
// 4. The expected timeframe for needing support`,
//     },
//     examples: [
//       'I am seeking temporary financial assistance to help maintain stable housing while I transition to full-time employment. This support would ensure my family remains in our current home during this period of rebuilding financial stability, allowing me to focus on securing better employment without the stress of potential displacement.',
//       'Financial assistance would help cover essential living expenses during my job search period, enabling me to pursue appropriate employment opportunities without compromising my family\'s basic needs. This temporary support would bridge the gap until I secure stable income and can again be financially independent.',
//       'I am requesting assistance to help manage monthly expenses while recovering from unexpected medical costs that depleted my emergency savings. This support would allow me to rebuild financial stability gradually while maintaining my current employment and meeting my family\'s ongoing needs.',
//     ],
//     constraints: [
//       'Must specify what type of assistance is needed',
//       'Should explain how assistance will improve the situation',
//       'Must show forward-thinking and planning',
//       'Should indicate timeframe expectations',
//       'Must demonstrate responsibility and effort toward self-sufficiency',
//       'Do not include you words/thoughts in the response',
//       'Do not add any word which you say only spit the response',
//     ],
//   },
//   additionalComments: {
//     systemPrompt: `You are a helpful assistant that helps people provide additional relevant information for social support applications.

// Your role is to:
// - Help users share relevant supplementary information
// - Ensure information is appropriate and helpful for case evaluation
// - Maintain respectful, professional tone
// - Focus on facts that support the application
// - Avoid redundant information already covered elsewhere

// Guidelines:
// - Do not include you words/thoughts in the response
// - Do not add any word which you say only spit the response
// -and NO additional commentary, analysis, or explanation. 
// - Keep responses 1-3 sentences (30-150 words)
// - Focus on unique, relevant information
// - Use professional but personal tone
// - Include specific details when helpful
// - Maintain dignity and respect`,
//     userPrompt: {
//       intro: 'Help improve this additional information for a social support application.',
//       contextLabels: {
//         dependentsPrefix: 'Family size: ',
//         dependentsSuffix: ' dependents',
//       },
//       currentLabel: 'Current additional information: "',
//       closing: `Please provide improved additional information that:
// 1. Adds value to the application without repeating other sections
// 2. Includes relevant personal circumstances (health, family, etc.)
// 3. Maintains professional tone while being personal
// 4. Provides context that helps evaluators understand the situation better`,
//     },
//     examples: [
//       'I am the primary caregiver for my elderly mother who requires daily assistance, which limits my ability to work full-time. Additionally, I am managing a chronic health condition that affects my energy levels and work capacity.',
//       'My spouse was recently diagnosed with a serious illness, requiring frequent medical appointments and treatments. This has created both emotional and financial stress while affecting our household\'s earning capacity.',
//       'I am currently enrolled in a vocational training program to improve my job prospects, which demonstrates my commitment to becoming self-sufficient. The program ends in three months, after which I expect to secure better employment.',
//     ],
//     constraints: [
//       'Should add unique value not covered in other sections',
//       'Must be relevant to the support request',
//       'Should maintain appropriate level of personal detail',
//       'Must not include overly sensitive medical/personal information',
//       'Should demonstrate how circumstances affect the application',
//     ],
//   },
// } as const;

// export const PROMPT_TEMPLATE_MODAL_CONFIG = {
//   financialSituation: {
//     title: '💰 Describe Your Financial Situation',
//     description: "Help us understand your current financial circumstances and challenges you're facing.",
//     placeholder: "Describe your income, expenses, debts, and any financial difficulties you're experiencing...",
//     guidance: [
//       'Include details about your income sources and amounts',
//       'Mention any significant expenses or debts',
//       'Explain how your situation has changed recently',
//       'Describe specific financial challenges you\'re facing',
//     ],
//   },
//   employmentCircumstances: {
//     title: '💼 Describe Your Employment Circumstances',
//     description: 'Share details about your work situation, job search, or employment challenges.',
//     placeholder: 'Describe your current employment status, work history, and any barriers to employment...',
//     guidance: [
//       'Explain your current employment status and work history',
//       'Mention any job search efforts or applications',
//       'Describe skills, experience, or qualifications you have',
//       'Include any barriers to finding or maintaining employment',
//     ],
//   },
//   reasonForApplying: {
//     title: '📋 Explain Your Reason for Applying',
//     description: 'Tell us why you need social support and how it will help your situation.',
//     placeholder: "Explain why you're applying for assistance and how it will help your specific situation...",
//     guidance: [
//       'Be specific about what type of help you need',
//       'Explain the urgency or timeline of your need',
//       'Describe how this assistance will improve your situation',
//       'Mention any steps you\'re taking to address your challenges',
//     ],
//   },
//   currentFinancialNeed: {
//     title: '💸 Describe Your Current Financial Need',
//     description: 'Specify the immediate financial assistance you require.',
//     placeholder: 'Detail your urgent financial needs and specific amounts if known...',
//     guidance: [
//       'Specify exact amounts needed if possible',
//       'Explain the urgency of these financial needs',
//       'Describe what expenses this will cover',
//       'Mention consequences if assistance isn\'t received',
//     ],
//   },
//   monthlyExpenses: {
//     title: '📊 Detail Your Monthly Expenses',
//     description: 'Break down your regular monthly costs and financial obligations.',
//     placeholder: 'List your monthly expenses including rent, utilities, food, transportation...',
//     guidance: [
//       'Include all major monthly expenses (rent, utilities, food)',
//       'Mention any debt payments or loan obligations',
//       'Note expenses that have increased recently',
//       'Specify which expenses are most challenging to meet',
//     ],
//   },
//   emergencyDescription: {
//     title: '🚨 Describe Your Emergency Situation',
//     description: 'Explain the urgent circumstances that require immediate assistance.',
//     placeholder: 'Describe the emergency situation and why immediate help is needed...',
//     guidance: [
//       'Clearly explain the nature of the emergency',
//       'Describe the timeline and urgency',
//       "Mention immediate consequences if help isn't provided",
//       'Include any steps you\'ve already taken to address it',
//     ],
//   },
// } as const;

// export const PROMPT_TEMPLATE_FIELD_LABELS = {
//   financialSituation: 'financial situation',
//   employmentCircumstances: 'employment circumstances',
//   reasonForApplying: 'reason for applying',
//   currentFinancialNeed: 'current financial need',
//   monthlyExpenses: 'monthly expenses',
//   emergencyDescription: 'emergency description',
// } as const;

// export const PROMPT_TEMPLATE_MESSAGES = {
//   redirectTemplate: `I understand you're looking for help, but {reason}
// Instead, please describe your specific {fieldLabel}. For example, you could share:
// - What challenges or difficulties you're currently facing
// - How your circumstances have changed recently  
// - What specific support you need and why
// - Any relevant background information about your situation
// This will help me provide much better, more relevant assistance for your {fieldLabel}.`,
//   enhancement: {
//     intro: "I'll help enhance your {fieldLabel} description. Here's what you've written:\n\n\"{currentValue}\"\n\nI'll improve this by:",
//     incorporateSituation: '- Incorporating your {situation} situation more effectively',
//     emphasizeUrgency: '- Emphasizing the urgent nature of your circumstances',
//     connectFormDetails: '- Connecting it to your other form details for a complete picture',
//     contextIntro: '- Using your background information to make it more specific and compelling',
//     contextHeader: 'Relevant context from your application:',
//     closing: '\n\nPlease provide an enhanced version that is:\n- More detailed and specific\n- Professional yet personal\n- Clear about your needs and circumstances\n- Appropriate for a social support application',
//   },
//   generation: {
//     intro: "I'll help you write your {fieldLabel} based on the information you've provided in your application.",
//     contextHeader: 'Based on your application details:',
//     situationalFocus: "I'll focus on your {situation} situation",
//     urgentSuffix: ' and emphasize the urgent nature of your circumstances',
//     closing: '\n\nI'll create a description that is:\n- Specific to your situation\n- Professional and compelling\n- Appropriate length and detail\n- Focused on your needs and circumstances',
//   },
//   guidance: {
//     base: 'Please provide an improved version that is clear, professional, and appropriate for a social support application',
//     urgency: ', emphasizing the urgent nature of your situation',
//     situations: {
//       unemployment: ', highlighting your job search efforts and immediate financial needs',
//       medical_emergency: ', detailing the medical situation and its impact on your finances',
//       housing_crisis: ', focusing on your housing needs and timeline',
//     },
//     categories: {
//       financial: '. Include specific amounts when helpful and explain the timeline of difficulties',
//       employment: '. Include work history, barriers to employment, and any active job search efforts',
//       descriptive: '. Use the contextual information above to make your description more specific and compelling',
//     },
//     limitedContext: '. Note: Limited form context available - consider providing more background information',
//     terminator: '.',
//     arabic: 'يرجى تقديم نسخة محسنة واضحة ومهنية ومناسبة لطلب الدعم الاجتماعي، مع مراعاة السياق والظروف المذكورة أعلاه.',
//   },
//   enhancementStrategies: {
//     contextLead: '- Using your background information to make it more specific and compelling',
//     contextualHeader: 'Relevant context from your application:',
//   },
//   enhancedPromptExtra: '- Using your background information to make it more specific and compelling',
// } as const;

// export const PROMPT_TEMPLATE_CONTEXT_HINTS = {
//   employmentStatus: {
//     unemployed: 'You are currently unemployed',
//     employed_full_time: 'You are currently employed full-time',
//     employed_part_time: 'You are currently employed part-time',
//     self_employed: 'You are self-employed',
//   },
//   housingStatus: {
//     homeless: 'You are currently experiencing homelessness',
//     rent: 'You are renting your current housing',
//     own: 'You own your current housing',
//   },
//   income: {
//     none: 'You have no current income',
//     limited: 'You have limited income',
//   },
//   dependents: 'You have {count} dependents',
// } as const;

// export const PROMPT_TEMPLATE_EXAMPLE_GENERATION = {
//   systemPromptTemplate: `You are an AI assistant helping users fill out a financial assistance form.

// Your job is to generate 3 relevant examples for the "{fieldLabel}" section that will help the user write their response.

// The user is applying for government financial assistance and needs help describing their {fieldLabel}.

// Generate exactly 3 examples that:
// - Are realistic and appropriate for someone applying for financial assistance
// - Show different ways to describe {fieldLabel} circumstances
// - Use professional but personal tone
// - Are 2-4 sentences each
// - Help demonstrate genuine need for assistance

// Language: {language}`,
//   metadata: {
//     none: '- No form data available',
//     employment: '- Employment: {value}',
//     monthlyIncome: '- Monthly Income: ${value}',
//     dependents: '- Dependents: {value}',
//     housing: '- Housing: {value}',
//     maritalStatus: '- Marital Status: {value}',
//   },
//   userPrompt: {
//     withInput: `The user is filling out a financial assistance form and wrote this for their {fieldLabel}:

// "{userInput}"

// Their current situation from the form:
// {formMetadata}

// Based on what they wrote about "{userInput}" and their current situation ({employmentStatus}, {dependents} dependents, {housingStatus}), generate 3 examples that:

// - Build directly on their specific situation: "{userInput}"
// - Show how someone with their exact employment/family circumstances would describe similar experiences
// - Connect their input to their need for financial assistance
// - Use professional but personal tone
// - Be 2-4 sentences each

// Start each example with "Example:"`,
//     withoutInput: `The user is filling out a financial assistance form and needs help with the {fieldLabel} section.

// Their situation:
// {formMetadata}

// Generate 3 realistic examples for someone in their situation that show:
// - How their employment/income situation creates need for assistance
// - Impact on their family if applicable
// - Clear demonstration of financial hardship
// - Professional but personal tone

// Each example should be 2-4 sentences.
// Start each example with "Example:"`,
//   },
//   examplePrefix: 'Example:',
// } as const;

// export const PROMPT_TEMPLATE_RELEVANCY = {
//   systemPromptTemplate: `You are an AI assistant that evaluates if user input is relevant to a specific form field.

// Your job is to determine if the user's input- {userInput} is relevant to the "{fieldLabel}" field in a financial assistance application.

// Evaluate the input and respond with a JSON object:
// {
//   "isRelevant": true/false,
//   "relevancyScore": 0-100,
//   "reason": "Brief explanation of why it is or isn't relevant"
// }

// Consider relevant:
// - Content that describes {fieldLabel} circumstances
// - Personal experiences related to {fieldLabel}
// - Information that helps understand their {fieldLabel} situation

// Consider irrelevant:
// - Random text or gibberish
// - Content unrelated to {fieldLabel}
// - Very vague statements without context
// - Off-topic information

// Language: {language}`,
//   userPromptTemplate: `Field: {fieldLabel}
// Form context:
// {formMetadata}

// User input to evaluate:
// "{userInput}"

// Is this input relevant to the "{fieldLabel}" field? Consider their form context and evaluate if the input helps describe their {fieldLabel}.

// Respond with JSON only.`,
// } as const;

// export const PROMPT_TEMPLATE_RELEVANCY_FALLBACK = {
//   parseError: '[Relevancy] Failed to parse JSON response:',
//   noReason: 'No reason provided',
//   relevantReason: 'Content appears relevant',
//   irrelevantReason: 'Content appears irrelevant or unclear',
// } as const;
