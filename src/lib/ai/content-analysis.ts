/**
 * Content Analysis for AI Input Relevance Detection
 * Determines if user input is relevant to the specific field and form context
 */

export interface ContentAnalysis {
  hasContent: boolean;
  isRelevant: boolean;
  relevanceScore: number;
  promptStrategy: 'enhance' | 'redirect' | 'generate';
  redirectReason?: string;
  contentType: 'empty' | 'relevant' | 'vague' | 'unrelated';
}

// Field-specific keywords and patterns for strict relevance detection
const FIELD_RELEVANCE_PATTERNS = {
  financialSituation: {
    required: [
      'money', 'income', 'salary', 'wage', 'financial', 'debt', 'loan', 'expense', 'cost',
      'budget', 'savings', 'bank', 'credit', 'payment', 'bill', 'rent', 'mortgage',
      'unemployed', 'job loss', 'laid off', 'fired', 'employment', 'work', 'career',
      'medical', 'hospital', 'surgery', 'treatment', 'medication', 'health',
      'family', 'child', 'dependent', 'support', 'help', 'assistance', 'need',
      'emergency', 'crisis', 'urgent', 'desperate', 'struggling', 'difficulty',
      'housing', 'eviction', 'homeless', 'shelter', 'apartment', 'house'
    ],
    forbidden: [
      'what is your name', 'who are you', 'how old are you', 'where do you live',
      'what time is it', 'weather', 'sports', 'politics', 'entertainment',
      'hello', 'hi', 'good morning', 'goodbye', 'thanks', 'thank you'
    ]
  },
  employmentCircumstances: {
    required: [
      'job', 'work', 'employment', 'unemployed', 'career', 'profession', 'occupation',
      'fired', 'laid off', 'terminated', 'quit', 'resign', 'company', 'employer',
      'salary', 'wage', 'income', 'hours', 'schedule', 'shift', 'overtime',
      'skills', 'experience', 'education', 'training', 'certification',
      'interview', 'application', 'resume', 'cv', 'looking for work', 'job search',
      'disability', 'injury', 'health', 'medical', 'unable to work',
      'family', 'childcare', 'dependent', 'caregiver', 'personal', 'circumstances'
    ],
    forbidden: [
      'what is your name', 'who are you', 'how old are you', 'where do you live',
      'what time is it', 'weather', 'sports', 'politics', 'entertainment',
      'hello', 'hi', 'good morning', 'goodbye', 'thanks', 'thank you'
    ]
  },
  reasonForApplying: {
    required: [
      'need', 'help', 'assistance', 'support', 'crisis', 'emergency', 'urgent',
      'struggling', 'difficulty', 'problem', 'issue', 'situation', 'circumstances',
      'financial', 'money', 'income', 'job', 'employment', 'medical', 'health',
      'housing', 'family', 'child', 'dependent', 'disability', 'injury',
      'eviction', 'homeless', 'bills', 'debt', 'expenses', 'cost', 'afford',
      'temporary', 'permanent', 'short term', 'long term', 'immediate'
    ],
    forbidden: [
      'what is your name', 'who are you', 'how old are you', 'where do you live',
      'what time is it', 'weather', 'sports', 'politics', 'entertainment',
      'hello', 'hi', 'good morning', 'goodbye', 'thanks', 'thank you'
    ]
  }
};

// Common vague patterns that should be redirected
const VAGUE_PATTERNS = [
  /^(what|who|when|where|why|how)\s+.*/i,
  /^(hello|hi|hey|good\s+(morning|afternoon|evening))/i,
  /^(thanks?|thank\s+you|goodbye|bye)/i,
  /^(tell\s+me|can\s+you|do\s+you)/i,
  /^(i\s+don't\s+know|not\s+sure|maybe|perhaps)/i,
  /^(test|testing|sample|example)/i,
  /^.{1,5}$/,  // Very short inputs
];

// Question patterns that are clearly unrelated
const UNRELATED_QUESTION_PATTERNS = [
  /what\s+is\s+your\s+name/i,
  /who\s+are\s+you/i,
  /how\s+old\s+are\s+you/i,
  /what\s+time\s+is\s+it/i,
  /what\s+day\s+is\s+it/i,
  /where\s+do\s+you\s+live/i,
  /what\s+is\s+the\s+weather/i,
  /how\s+are\s+you/i,
];

export function analyzeContentRelevance(
  fieldName: string,
  currentValue: string,
  fieldLabel: string
): ContentAnalysis {
  const trimmedValue = currentValue.trim();
  
  // Step 1: Check if content exists
  if (!trimmedValue) {
    return {
      hasContent: false,
      isRelevant: true, // Empty is always "relevant" for generation
      relevanceScore: 1.0,
      promptStrategy: 'generate',
      contentType: 'empty'
    };
  }

  // Step 2: Check for clearly unrelated questions
  for (const pattern of UNRELATED_QUESTION_PATTERNS) {
    if (pattern.test(trimmedValue)) {
      return {
        hasContent: true,
        isRelevant: false,
        relevanceScore: 0.0,
        promptStrategy: 'redirect',
        redirectReason: `I can only help you describe your ${fieldLabel.toLowerCase()}. Please share details about your specific situation instead of asking unrelated questions.`,
        contentType: 'unrelated'
      };
    }
  }

  // Step 3: Check for vague patterns
  for (const pattern of VAGUE_PATTERNS) {
    if (pattern.test(trimmedValue)) {
      return {
        hasContent: true,
        isRelevant: false,
        relevanceScore: 0.1,
        promptStrategy: 'redirect',
        redirectReason: `I need more specific information about your ${fieldLabel.toLowerCase()}. Please describe your actual situation, circumstances, or challenges you're facing.`,
        contentType: 'vague'
      };
    }
  }

  // Step 4: Field-specific relevance analysis
  const fieldPatterns = FIELD_RELEVANCE_PATTERNS[fieldName as keyof typeof FIELD_RELEVANCE_PATTERNS];
  
  if (!fieldPatterns) {
    // For unknown fields, use general content analysis
    return analyzeGeneralContent(trimmedValue, fieldLabel);
  }

  // Check for forbidden content
  const lowerValue = trimmedValue.toLowerCase();
  for (const forbidden of fieldPatterns.forbidden) {
    if (lowerValue.includes(forbidden)) {
      return {
        hasContent: true,
        isRelevant: false,
        relevanceScore: 0.0,
        promptStrategy: 'redirect',
        redirectReason: `I can only help you describe your ${fieldLabel.toLowerCase()}. Please focus on sharing details about your specific situation.`,
        contentType: 'unrelated'
      };
    }
  }

  // Calculate relevance score based on required keywords
  let matchedKeywords = 0;
  let totalKeywords = fieldPatterns.required.length;
  
  for (const keyword of fieldPatterns.required) {
    if (lowerValue.includes(keyword)) {
      matchedKeywords++;
    }
  }

  const relevanceScore = matchedKeywords / totalKeywords;
  
  // Strict relevance threshold (at least 1 keyword match and minimum length)
  const isRelevant = matchedKeywords > 0 && trimmedValue.length >= 10;
  
  if (!isRelevant) {
    return {
      hasContent: true,
      isRelevant: false,
      relevanceScore,
      promptStrategy: 'redirect',
      redirectReason: `I can only help you describe your ${fieldLabel.toLowerCase()}. Please share specific details about your situation, challenges, or circumstances related to this topic.`,
      contentType: relevanceScore < 0.1 ? 'unrelated' : 'vague'
    };
  }

  return {
    hasContent: true,
    isRelevant: true,
    relevanceScore,
    promptStrategy: 'enhance',
    contentType: 'relevant'
  };
}

function analyzeGeneralContent(value: string, fieldLabel: string): ContentAnalysis {
  // For fields without specific patterns, use length and basic checks
  const isSubstantial = value.length >= 15;
  const hasQuestionWords = /^(what|who|when|where|why|how)\s+/i.test(value);
  
  if (hasQuestionWords || !isSubstantial) {
    return {
      hasContent: true,
      isRelevant: false,
      relevanceScore: 0.2,
      promptStrategy: 'redirect',
      redirectReason: `I can only help you describe your ${fieldLabel.toLowerCase()}. Please provide specific details about your situation.`,
      contentType: 'vague'
    };
  }

  return {
    hasContent: true,
    isRelevant: true,
    relevanceScore: 0.7,
    promptStrategy: 'enhance',
    contentType: 'relevant'
  };
}