interface AIAssistModalFooterProps {
  onClose: () => void;
  onAccept: () => void;
  disableAccept: boolean;
  tokensRemaining: number;
}

export function AIAssistModalFooter({ onClose, onAccept, disableAccept, tokensRemaining }: AIAssistModalFooterProps) {
  return (
    <div className="border-t border-border px-6 py-4 bg-surface/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-text-secondary leading-snug">
          Rate limit: {tokensRemaining} requests remaining
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-md text-text-primary hover:bg-muted transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onAccept}
            disabled={disableAccept}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full sm:w-auto"
          >
            Use This Text
          </button>
        </div>
      </div>
    </div>
  );
}

