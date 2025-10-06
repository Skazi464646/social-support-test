import { cn } from '@/lib/utils';

interface EditorColumnProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  editedText: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  hasActiveSuggestion: boolean;
  isValidLength: boolean;
  characterCount: number;
  minLength: number;
  maxLength: number;
  guidance: string[];
  placeholder: string;
}

export function EditorColumn({
  textareaRef,
  editedText,
  onChange,
  isEditing,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  hasActiveSuggestion,
  isValidLength,
  characterCount,
  minLength,
  maxLength,
  guidance,
  placeholder,
}: EditorColumnProps) {
  return (
    <div className="flex-1 w-full flex flex-col">
      <EditorToolbar
        isEditing={isEditing}
        hasActiveSuggestion={hasActiveSuggestion}
        onEdit={onEdit}
        onCancelEdit={onCancelEdit}
        onSaveEdit={onSaveEdit}
      />
      <EditorBody
        textareaRef={textareaRef}
        editedText={editedText}
        onChange={onChange}
        isEditing={isEditing}
        isValidLength={isValidLength}
        characterCount={characterCount}
        minLength={minLength}
        maxLength={maxLength}
        guidance={guidance}
        placeholder={placeholder}
        hasActiveSuggestion={hasActiveSuggestion}
      />
    </div>
  );
}

interface EditorToolbarProps {
  isEditing: boolean;
  hasActiveSuggestion: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
}

function EditorToolbar({ isEditing, hasActiveSuggestion, onEdit, onCancelEdit, onSaveEdit }: EditorToolbarProps) {
  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-text-primary">Edit Your Response</h3>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={onEdit}
              disabled={!hasActiveSuggestion}
              className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50"
            >
              ✏️ Edit
            </button>
          ) : (
            <EditingActions onCancelEdit={onCancelEdit} onSaveEdit={onSaveEdit} />
          )}
        </div>
      </div>
    </div>
  );
}

interface EditingActionsProps {
  onCancelEdit: () => void;
  onSaveEdit: () => void;
}

function EditingActions({ onCancelEdit, onSaveEdit }: EditingActionsProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onCancelEdit}
        className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSaveEdit}
        className="px-3 py-1 text-sm rounded bg-primary text-primary-foreground hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
      >
        Save
      </button>
    </div>
  );
}

interface EditorBodyProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  editedText: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  isValidLength: boolean;
  characterCount: number;
  minLength: number;
  maxLength: number;
  guidance: string[];
  placeholder: string;
  hasActiveSuggestion: boolean;
}

function EditorBody({
  textareaRef,
  editedText,
  onChange,
  isEditing,
  isValidLength,
  characterCount,
  minLength,
  maxLength,
  guidance,
  placeholder,
  hasActiveSuggestion,
}: EditorBodyProps) {
  const resolvedPlaceholder = editedText
    ? 'Edit your text here or generate AI suggestions for improvements...'
    : hasActiveSuggestion
    ? 'Select a suggestion to edit it here...'
    : placeholder;

  return (
    <div className="flex-1 p-4">
      <div className="h-full flex flex-col">
        <textarea
          ref={textareaRef}
          value={editedText}
          onChange={event => onChange(event.target.value)}
          readOnly={!isEditing}
          placeholder={resolvedPlaceholder}
          className={cn(
            'w-full flex-1 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary',
            isEditing ? 'bg-card' : 'bg-muted',
          )}
        />

        <CharacterCount
          characterCount={characterCount}
          maxLength={maxLength}
          minLength={minLength}
          isValidLength={isValidLength}
        />

        <GuidanceTips guidance={guidance} showTips={!editedText} />
      </div>
    </div>
  );
}

interface CharacterCountProps {
  characterCount: number;
  maxLength: number;
  minLength: number;
  isValidLength: boolean;
}

function CharacterCount({ characterCount, maxLength, minLength, isValidLength }: CharacterCountProps) {
  return (
    <div className="mt-2 flex justify-end">
      <div
        className={cn('text-xs font-medium', isValidLength ? 'text-text-secondary' : 'text-destructive')}
      >
        {characterCount}/{maxLength}
        {minLength > 0 && characterCount < minLength && (
          <span className="ml-2 text-destructive">(min: {minLength})</span>
        )}
      </div>
    </div>
  );
}

interface GuidanceTipsProps {
  guidance: string[];
  showTips: boolean;
}

function GuidanceTips({ guidance, showTips }: GuidanceTipsProps) {
  if (!showTips || guidance.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-3 border rounded-md border-info-border bg-info-light">
      <h4 className="text-sm font-medium text-info-foreground mb-1">💡 Tips:</h4>
      <div className="text-xs text-info-light-foreground">
        {guidance.slice(0, 2).map((tip, index) => (
          <div key={index} className="mb-1">
            • {tip}
          </div>
        ))}
      </div>
    </div>
  );
}

