interface AIAssistModalHeaderProps {
  title: string;
  description: string;
  onClose: () => void;
}

export function AIAssistModalHeader({ title, description, onClose }: AIAssistModalHeaderProps) {
  return (
    <div className="border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="ai-modal-title" className="text-xl font-semibold text-text-primary">
            {title}
          </h2>
          <p id="ai-modal-description" className="text-sm text-text-secondary mt-1">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-text-tertiary hover:text-text-secondary transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

