import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms/Button';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-card text-card-foreground',
        success: 'border-success-border bg-success-light text-success-light-foreground',
        error: 'border-destructive-border bg-destructive-light text-destructive-light-foreground',
        warning: 'border-warning-border bg-warning-light text-warning-light-foreground',
        info: 'border-info-border bg-info-light text-info-light-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const toastIconVariants = cva('h-5 w-5 flex-shrink-0', {
  variants: {
    variant: {
      default: 'text-foreground',
      success: 'text-success',
      error: 'text-destructive',
      warning: 'text-warning',
      info: 'text-info',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: React.ReactNode;
}

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  duration?: number;
}

const iconMap = {
  default: null as React.ComponentType<{ className?: string }> | null,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

/**
 * Toast - Notification component with auto-dismiss and variants
 * 
 * @example
 * <Toast
 *   id="toast-1"
 *   variant="success"
 *   title="Success"
 *   description="Your action was completed successfully"
 *   onClose={() => removeToast('toast-1')}
 * />
 */
const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ 
    className, 
    variant = 'default', 
    id, 
    title, 
    description, 
    action, 
    onClose,
    duration = 5000,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    const Icon = iconMap[variant|| 'default'];
    const ariaLive = variant === 'error' ? 'assertive' : 'polite';

    const handleClose = React.useCallback(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 150); // Allow exit animation
    }, [onClose]);

    // Auto-dismiss logic
    React.useEffect(() => {
      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          handleClose();
        }, duration);

        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }
      return undefined;
    }, [duration, handleClose]);

    const handleMouseEnter = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    const handleMouseLeave = () => {
      if (duration > 0) {
        timeoutRef.current = setTimeout(handleClose, 1000); // Shorter timeout after hover
      }
    };

    if (!isVisible) {
      return null;
    }

    return (
      <div
        ref={ref}
        id={id}
        className={cn(toastVariants({ variant }), className)}
        role="alert"
        aria-live={ariaLive}
        aria-atomic="true"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-state="open"
        {...props}
      >
        <div className="flex items-start space-x-3">
          {Icon && (
            <Icon className={cn(toastIconVariants({ variant }))} />
          )}
          <div className="grid gap-1">
            {title && (
              <div className="text-sm font-semibold">
                {title}
              </div>
            )}
            {description && (
              <div className="text-sm opacity-90">
                {description}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {action}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-70 hover:opacity-100"
            onClick={handleClose}
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export { Toast, toastVariants };
