import { openAIService } from '@/lib/ai';
import { useBodyScrollLock } from '@/hooks';
import { AIAssistModalFooter } from './AIAssistModalFooter';
import { AIAssistModalHeader } from './AIAssistModalHeader';
import { EditorColumn } from './EditorColumn';
import { SuggestionColumn } from './SuggestionColumn';
import { useAIAssistModalState } from './useAIAssistModalState';
import type { Suggestion } from './useAIAssistModalState';

export interface AIAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string;
  fieldLabel: string;
  currentValue: string;
  onAccept: (value: string) => void;
  userContext?: any;
  intelligentContext?: any;
  fieldConstraints?: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  };
}

export function AIAssistModal(props: AIAssistModalProps) {
  const { isOpen, onClose, onAccept, fieldLabel } = props;
  const { state, actions } = useAIAssistModalState(props);

  // Prevent background scrolling when modal is open
  useBodyScrollLock(isOpen);

  if (!isOpen) {
    return null;
  }

  const rateLimitStatus = openAIService.getRateLimitStatus();

  const handleAccept = () => {
    if (!state.editedText.trim()) {
      return;
    }

    onAccept(state.editedText.trim());
    onClose();
  };

  const handleGenerate = () => {
    void actions.generateSuggestion();
  };

  const handleRegenerate = () => {
    actions.regenerateSuggestion();
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    actions.selectSuggestion(suggestion);
  };

  const guidance = state.fieldConfig.guidance ?? [];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        ref={state.modalRef}
        className="bg-white text-gray-900 border border-gray-200 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden focus:outline-none"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="ai-modal-title"
        aria-describedby="ai-modal-description"
      >
        <AIAssistModalHeader
          title={state.fieldConfig.title}
          description={state.fieldConfig.description}
          onClose={onClose}
        />

        <div className="flex flex-col lg:flex-row lg:h-[60vh] max-h-[80vh]">
          <SuggestionColumn
            fieldLabel={fieldLabel}
            suggestions={state.suggestions}
            activeSuggestionId={state.activeSuggestionId}
            error={state.error}
            isLoading={state.isLoading}
            showExamples={state.showExamples}
            examples={state.examples}
            dynamicExamples={state.dynamicExamples}
            loadingExamples={state.loadingExamples}
            examplesError={state.examplesError}
            canRequestExamples={state.canRequestExamples}
            onGenerate={handleGenerate}
            onRegenerate={handleRegenerate}
            onToggleExamples={actions.toggleExamples}
            onSelectSuggestion={handleSelectSuggestion}
            onUseExample={actions.useExample}
          />

          <EditorColumn
            textareaRef={state.textareaRef}
            editedText={state.editedText}
            onChange={actions.setEditedText}
            isEditing={state.isEditing}
            onEdit={actions.editSuggestion}
            onCancelEdit={actions.cancelEdit}
            onSaveEdit={actions.saveEdit}
            hasActiveSuggestion={Boolean(state.activeSuggestionId)}
            isValidLength={state.isValidLength}
            characterCount={state.characterCount}
            minLength={state.minLength}
            maxLength={state.maxLength}
            guidance={guidance}
            placeholder={state.fieldConfig.placeholder}
          />
        </div>

        <AIAssistModalFooter
          onClose={onClose}
          onAccept={handleAccept}
          disableAccept={!state.editedText.trim() || !state.isValidLength}
          tokensRemaining={rateLimitStatus.tokensAvailable}
        />
      </div>
    </div>
  );
}

