import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-md border transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30',
  {
    variants: {
      variant: {
        default: 'border-input bg-background text-foreground placeholder:text-muted-foreground hover:border-primary/50 focus-visible:border-primary focus:border-primary focus-visible:shadow-gold-sm',
        error: 'border-destructive bg-destructive-light/20 text-foreground placeholder:text-muted-foreground focus-visible:border-destructive focus:border-destructive',
        success: 'border-success bg-success-light/20 text-foreground placeholder:text-muted-foreground focus-visible:border-success focus:border-success',
        warning: 'border-warning bg-warning-light/20 text-foreground placeholder:text-muted-foreground focus-visible:border-warning focus:border-warning',
      },
      size: {
        sm: 'h-8 px-2 py-1 text-sm',
        md: 'h-10 px-3 py-2 text-sm',
        lg: 'h-12 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  hasError?: boolean;
  hasSuccess?: boolean;
  hasWarning?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', variant, size, hasError = false, hasSuccess = false, hasWarning = false, ...props }, ref) => {
    // Determine variant based on state flags
    const resolvedVariant = 
      hasError ? 'error' :
      hasSuccess ? 'success' :
      hasWarning ? 'warning' :
      variant || 'default';

    return (
      <input
        type={type}
        className={cn(
          inputVariants({ 
            variant: resolvedVariant,
            size,
            className 
          })
        )}
        ref={ref}
        aria-invalid={hasError}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };