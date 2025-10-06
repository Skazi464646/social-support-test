import { cn } from '@/lib/utils';
import type { Suggestion } from './useAIAssistModalState';

interface SuggestionColumnProps {
  fieldLabel: string;
  suggestions: Suggestion[];
  activeSuggestionId: string | null;
  error: string | null;
  isLoading: boolean;
  showExamples: boolean;
  canRequestExamples: boolean;
  examples: string[];
  dynamicExamples: string[];
  loadingExamples: boolean;
  examplesError: string | null;
  onGenerate: () => void;
  onRegenerate: () => void;
  onToggleExamples: () => void;
  onSelectSuggestion: (suggestion: Suggestion) => void;
  onUseExample: (example: string) => void;
}

export function SuggestionColumn({
  fieldLabel,
  suggestions,
  activeSuggestionId,
  error,
  isLoading,
  showExamples,
  canRequestExamples,
  examples,
  dynamicExamples,
  loadingExamples,
  examplesError,
  onGenerate,
  onRegenerate,
  onToggleExamples,
  onSelectSuggestion,
  onUseExample,
}: SuggestionColumnProps) {
  return (
    <div className="w-full lg:w-1/3 flex flex-col border-border border-b lg:border-b-0 lg:border-r">
      <SuggestionActions
        isLoading={isLoading}
        hasSuggestions={suggestions.length > 0}
        canRequestExamples={canRequestExamples}
        showExamples={showExamples}
        loadingExamples={loadingExamples}
        dynamicCount={dynamicExamples.length}
        staticCount={examples.length}
        onGenerate={onGenerate}
        onRegenerate={onRegenerate}
        onToggleExamples={onToggleExamples}
      />
      <SuggestionExamples
        error={error}
        showExamples={showExamples}
        examplesError={examplesError}
        dynamicExamples={dynamicExamples}
        staticExamples={examples}
        onUseExample={onUseExample}
      />
      <SuggestionListSection
        suggestions={suggestions}
        activeSuggestionId={activeSuggestionId}
        fieldLabel={fieldLabel}
        hasExamples={examples.length > 0 || dynamicExamples.length > 0}
        onSelectSuggestion={onSelectSuggestion}
      />
    </div>
  );
}

interface SuggestionActionsProps {
  isLoading: boolean;
  hasSuggestions: boolean;
  canRequestExamples: boolean;
  showExamples: boolean;
  loadingExamples: boolean;
  dynamicCount: number;
  staticCount: number;
  onGenerate: () => void;
  onRegenerate: () => void;
  onToggleExamples: () => void;
}

function SuggestionActions({
  isLoading,
  hasSuggestions,
  canRequestExamples,
  showExamples,
  loadingExamples,
  dynamicCount,
  staticCount,
  onGenerate,
  onRegenerate,
  onToggleExamples,
}: SuggestionActionsProps) {
  return (
    <div className="p-4 border-b border-muted-border space-y-2">
      <GenerateButtons
        isLoading={isLoading}
        hasSuggestions={hasSuggestions}
        onGenerate={onGenerate}
        onRegenerate={onRegenerate}
      />
      {canRequestExamples && (
        <ExamplesToggleButton
          showExamples={showExamples}
          loadingExamples={loadingExamples}
          dynamicCount={dynamicCount}
          staticCount={staticCount}
          onToggleExamples={onToggleExamples}
        />
      )}
    </div>
  );
}

interface GenerateButtonsProps {
  isLoading: boolean;
  hasSuggestions: boolean;
  onGenerate: () => void;
  onRegenerate: () => void;
}

function GenerateButtons({ isLoading, hasSuggestions, onGenerate, onRegenerate }: GenerateButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        type="button"
        onClick={onGenerate}
        disabled={isLoading}
        className="flex-1 px-3 py-2 text-sm font-medium rounded bg-primary text-primary-foreground hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border border-current border-t-transparent rounded-full mr-2" />
            Generating...
          </>
        ) : (
          '✨ Generate'
        )}
      </button>
      {hasSuggestions && (
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isLoading}
          className="px-3 py-2 text-sm font-medium rounded border border-border hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50"
          title="Generate another suggestion"
        >
          🔄
        </button>
      )}
    </div>
  );
}

interface ExamplesToggleButtonProps {
  showExamples: boolean;
  loadingExamples: boolean;
  dynamicCount: number;
  staticCount: number;
  onToggleExamples: () => void;
}

function ExamplesToggleButton({
  showExamples,
  loadingExamples,
  dynamicCount,
  staticCount,
  onToggleExamples,
}: ExamplesToggleButtonProps) {
  const renderLabel = () => {
    if (loadingExamples) {
      return (
        <>
          <span className="animate-spin inline-block w-3 h-3 border border-current border-t-transparent rounded-full mr-1" />
          Loading examples...
        </>
      );
    }

    if (dynamicCount > 0) {
      return `${showExamples ? 'Hide' : 'Show'} examples (${dynamicCount} personalized)`;
    }

    if (staticCount > 0) {
      return `${showExamples ? 'Hide' : 'Show'} examples (${staticCount})`;
    }

    return `${showExamples ? 'Hide' : 'Show'} examples (generating...)`;
  };

  return (
    <button
      type="button"
      onClick={onToggleExamples}
      disabled={loadingExamples}
      className="w-full py-1 text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
    >
      {renderLabel()}
    </button>
  );
}

interface SuggestionExamplesProps {
  error: string | null;
  showExamples: boolean;
  examplesError: string | null;
  dynamicExamples: string[];
  staticExamples: string[];
  onUseExample: (example: string) => void;
}

function SuggestionExamples({
  error,
  showExamples,
  examplesError,
  dynamicExamples,
  staticExamples,
  onUseExample,
}: SuggestionExamplesProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {error && (
        <div className="p-4 bg-destructive-light border-b border-destructive-border">
          <div className="text-destructive text-sm">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {showExamples && (
        <div className="border-b border-muted-border">
          <div className="p-3 bg-muted rounded-b-md lg:rounded-none space-y-2">
            {dynamicExamples.length > 0 && (
              <ExampleList
                variant="dynamic"
                examples={dynamicExamples}
                onUseExample={onUseExample}
              />
            )}
            {dynamicExamples.length === 0 && staticExamples.length > 0 && (
              <ExampleList
                variant="static"
                examples={staticExamples}
                onUseExample={onUseExample}
              />
            )}
            {dynamicExamples.length === 0 && staticExamples.length === 0 && examplesError && (
              <div className="text-sm text-destructive p-2">
                <div className="font-medium">Failed to load personalized examples</div>
                <div className="text-xs mt-1">{examplesError}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ExampleListProps {
  variant: 'dynamic' | 'static';
  examples: string[];
  onUseExample: (example: string) => void;
}

function ExampleList({ variant, examples, onUseExample }: ExampleListProps) {
  const heading = variant === 'dynamic' ? '✨ Examples Similar to Yours' : 'Sample Responses';

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-text-secondary mb-2">{heading}</h4>
      {examples.map((example, index) => (
        <button
          type="button"
          key={`${variant}-${index}`}
          onClick={() => onUseExample(example)}
          className={cn(
            'w-full text-left p-2 text-xs border rounded transition-colors',
            variant === 'dynamic'
              ? 'border-primary hover:border-primary-hover bg-primary-light text-primary-light-foreground'
              : 'border-border hover:bg-muted',
          )}
        >
          {variant === 'dynamic' && (
            <div className="font-medium text-primary-light-foreground mb-1">Example {index + 1}:</div>
          )}
          <div className={variant === 'dynamic' ? 'text-primary-light-foreground/90' : 'text-text-secondary'}>
            {example.length > 120 ? `${example.substring(0, 120)}...` : example}
          </div>
        </button>
      ))}
    </div>
  );
}

interface SuggestionListSectionProps {
  suggestions: Suggestion[];
  activeSuggestionId: string | null;
  fieldLabel: string;
  hasExamples: boolean;
  onSelectSuggestion: (suggestion: Suggestion) => void;
}

function SuggestionListSection({
  suggestions,
  activeSuggestionId,
  fieldLabel,
  hasExamples,
  onSelectSuggestion,
}: SuggestionListSectionProps) {
  if (suggestions.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center text-text-secondary text-sm py-8">
          <div className="mb-2">💡</div>
          <p className="font-medium">Click "Generate" for AI suggestions</p>
          <p className="text-xs mt-1 text-text-tertiary">
            AI will help you write about your {fieldLabel.toLowerCase()}
          </p>
          {hasExamples && <p className="text-xs mt-1">or use an example to get started</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {suggestions.map(suggestion => (
        <button
          type="button"
          key={suggestion.id}
          className={cn(
            'w-full text-left p-3 border rounded transition-colors',
            activeSuggestionId === suggestion.id
              ? 'border-primary bg-primary-light'
              : 'border-border hover:border-primary',
          )}
          onClick={() => onSelectSuggestion(suggestion)}
        >
          <div className="text-sm text-text-primary line-clamp-3">
            {suggestion.text.substring(0, 100)}...
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
            <span>
              {suggestion.isEdited ? '✏️ Edited' : suggestion.confidence ? '🤖 AI' : '📝 Example'}
            </span>
            <span>{suggestion.text.length} chars</span>
          </div>
        </button>
      ))}
    </div>
  );
}
