import { Card } from '@/components/molecules/Card';
import { Button } from '@/components/atoms/Button';

export type SubmissionErrorCardProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
  className?: string;
};

export function SubmissionErrorCard({ title, message, actionLabel, onAction, isLoading, className }: SubmissionErrorCardProps) {
  return (
    <Card className={className ? `${className} p-6 border border-destructive-border bg-destructive-light text-destructive-light-foreground` : 'p-6 border border-destructive-border bg-destructive-light text-destructive-light-foreground'}>
      <div className="text-center">
        <div className="text-destructive text-2xl mb-2">✕</div>
        <h3 className="text-lg font-semibold text-destructive mb-2">
          {title}
        </h3>
        <p className="text-destructive mb-4 opacity-80">
          {message}
        </p>
        {actionLabel && onAction && (
          <Button
            variant="outline"
            onClick={onAction}
            disabled={Boolean(isLoading)}
            className="border-destructive-border text-destructive hover:bg-destructive-light focus-visible:ring-destructive/30"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}


