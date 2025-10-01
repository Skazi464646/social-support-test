/**
 * Prompt Optimization Utilities
 * Module 5 - Step 3: Prompt Templates Enhancement
 */

import type { PromptContext } from './prompt-templates';

/**
 * Token estimation utility (rough approximation)
 */
export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English
  // This is a simplified approximation for planning purposes
  return Math.ceil(text.length / 4);
}

/**
 * Optimize prompt length to stay within token limits
 */
export function optimizePromptLength(prompt: string, maxTokens: number = 400): string {
  const estimatedTokens = estimateTokens(prompt);
  
  if (estimatedTokens <= maxTokens) {
    return prompt;
  }
  
  // Calculate target length (with some buffer)
  const targetLength = Math.floor(maxTokens * 3.5); // ~3.5 chars per token
  
  // Split into sections and prioritize
  const sections = prompt.split('\n\n');
  let optimized = '';
  let currentLength = 0;
  
  // Prioritize sections by importance
  const prioritizedSections = prioritizeSections(sections);
  
  for (const section of prioritizedSections) {
    if (currentLength + section.length <= targetLength) {
      optimized += (optimized ? '\n\n' : '') + section;
      currentLength += section.length;
    } else {
      // Try to fit a truncated version of the section
      const remainingSpace = targetLength - currentLength;
      if (remainingSpace > 50) { // Only if there's meaningful space left
        const truncated = truncateSection(section, remainingSpace);
        optimized += (optimized ? '\n\n' : '') + truncated;
      }
      break;
    }
  }
  
  return optimized;
}

/**
 * Prioritize prompt sections by importance
 */
function prioritizeSections(sections: string[]): string[] {
  const priority = (section: string): number => {
    const lower = section.toLowerCase();
    
    // High priority: core instructions and current content
    if (lower.includes('current description') || lower.includes('current content')) return 10;
    if (lower.includes('help improve') || lower.includes('please provide')) return 9;
    if (lower.includes('employment status') || lower.includes('monthly income')) return 8;
    
    // Medium priority: context and constraints
    if (lower.includes('minimum length') || lower.includes('maximum length')) return 7;
    if (lower.includes('housing') || lower.includes('dependents')) return 6;
    
    // Lower priority: examples and detailed instructions
    if (lower.includes('examples') || lower.includes('for example')) return 3;
    
    return 5; // Default priority
  };
  
  return sections.sort((a, b) => priority(b) - priority(a));
}

/**
 * Truncate a section while preserving meaning
 */
function truncateSection(section: string, maxLength: number): string {
  if (section.length <= maxLength) {
    return section;
  }
  
  // Try to truncate at sentence boundaries
  const sentences = section.split('. ');
  let truncated = '';
  
  for (const sentence of sentences) {
    const potentialLength = truncated.length + sentence.length + (truncated ? 2 : 0); // +2 for '. '
    
    if (potentialLength <= maxLength - 3) { // -3 for '...'
      truncated += (truncated ? '. ' : '') + sentence;
    } else {
      break;
    }
  }
  
  // If no complete sentences fit, truncate at word boundaries
  if (!truncated && maxLength > 10) {
    const words = section.split(' ');
    truncated = '';
    
    for (const word of words) {
      const potentialLength = truncated.length + word.length + (truncated ? 1 : 0);
      
      if (potentialLength <= maxLength - 3) {
        truncated += (truncated ? ' ' : '') + word;
      } else {
        break;
      }
    }
  }
  
  return truncated + (truncated ? '...' : section.substring(0, maxLength - 3) + '...');
}

/**
 * Validate prompt context for completeness
 */
export function validatePromptContext(context: PromptContext): {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Check for empty current value
  if (!context.currentValue || context.currentValue.trim().length === 0) {
    suggestions.push('Consider providing some initial text for better AI suggestions');
  }
  
  // Check for missing relevant context
  if (!context.userContext.step2?.employmentStatus) {
    warnings.push('Employment status not available - may result in less targeted suggestions');
  }
  
  if (!context.userContext.step2?.monthlyIncome) {
    suggestions.push('Monthly income information would help provide more relevant suggestions');
  }
  
  // Check field constraints
  if (context.fieldConstraints?.minLength && context.currentValue.length < context.fieldConstraints.minLength) {
    suggestions.push(`Current text is shorter than minimum required (${context.fieldConstraints.minLength} characters)`);
  }
  
  if (context.fieldConstraints?.maxLength && context.currentValue.length > context.fieldConstraints.maxLength) {
    warnings.push(`Current text exceeds maximum length (${context.fieldConstraints.maxLength} characters)`);
  }
  
  // Check language support
  if (context.language === 'ar') {
    warnings.push('Arabic language support is basic - suggestions may be in English');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions,
  };
}

/**
 * Generate prompt variations for A/B testing
 */
export function generatePromptVariations(basePrompt: string, fieldName: string): string[] {
  const variations: string[] = [basePrompt];
  
  // Variation 1: More concise
  const concisePrompt = basePrompt
    .replace(/Please provide an improved version that/g, 'Provide')
    .replace(/\n\nMinimum length.*?\n/g, '\n')
    .replace(/\n\nMaximum length.*?\n/g, '\n');
  
  if (concisePrompt !== basePrompt) {
    variations.push(concisePrompt);
  }
  
  // Variation 2: More specific for field type
  if (fieldName === 'financialSituation') {
    variations.push(basePrompt + '\n\nFocus on specific circumstances and avoid general statements.');
  } else if (fieldName === 'employmentCircumstances') {
    variations.push(basePrompt + '\n\nEmphasize current efforts and future planning.');
  } else if (fieldName === 'reasonForApplying') {
    variations.push(basePrompt + '\n\nClearly connect the requested assistance to specific outcomes.');
  }
  
  return variations;
}

/**
 * Calculate prompt efficiency score
 */
export function calculatePromptEfficiency(prompt: string, expectedOutputLength: number = 150): {
  score: number;
  metrics: {
    tokenEfficiency: number;
    clarityScore: number;
    contextRatio: number;
  };
} {
  const tokens = estimateTokens(prompt);
  const outputTokens = estimateTokens(''.padEnd(expectedOutputLength, 'x')); // Estimated output
  
  // Token efficiency: lower input-to-output ratio is better
  const tokenEfficiency = Math.max(0, 1 - (tokens / (tokens + outputTokens)));
  
  // Clarity score: based on clear instructions and structure
  const clarityIndicators = [
    /help improve/i,
    /provide.*version/i,
    /current.*description/i,
    /\d+\s*(characters|words)/i,
  ];
  
  const clarityScore = clarityIndicators.reduce((score, regex) => {
    return score + (regex.test(prompt) ? 0.25 : 0);
  }, 0);
  
  // Context ratio: balance between context and instructions
  const contextLines = prompt.split('\n').filter(line => 
    line.includes(':') && !line.includes('?')
  ).length;
  
  const instructionLines = prompt.split('\n').filter(line =>
    /please|provide|help|improve/i.test(line)
  ).length;
  
  const contextRatio = Math.min(1, contextLines / Math.max(1, contextLines + instructionLines));
  
  const overallScore = (tokenEfficiency * 0.4) + (clarityScore * 0.4) + (contextRatio * 0.2);
  
  return {
    score: Math.round(overallScore * 100) / 100,
    metrics: {
      tokenEfficiency: Math.round(tokenEfficiency * 100) / 100,
      clarityScore: Math.round(clarityScore * 100) / 100,
      contextRatio: Math.round(contextRatio * 100) / 100,
    },
  };
}