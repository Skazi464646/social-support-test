import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';

const labelVariants = cva(
  'font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'text-text-primary',
        muted: 'text-text-secondary',
        error: 'text-destructive',
        success: 'text-success',
        warning: 'text-warning',
        info: 'text-info',
      },
      size: {
        xs: 'text-xs font-normal',
        sm: 'text-xs font-medium',
        md: 'text-sm font-medium',
        lg: 'text-base font-semibold',
        xl: 'text-lg font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  requiredIndicator?: React.ReactNode;
  asChild?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ 
    className, 
    variant, 
    size,
    required = false,
    requiredIndicator,
    asChild = false,
    children,
    ...props 
  }, ref) => {
    const { isRTL } = useDirection();
    
    const Comp = asChild ? 'span' : 'label';
    
    const defaultRequiredIndicator = (
      <span 
        className={cn(
          'text-destructive font-semibold',
          isRTL ? 'me-1' : 'ms-1'
        )}
        aria-label="required"
        role="img"
      >
        *
      </span>
    );
    
    return (
      <Comp
        className={cn(labelVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
        {required && (requiredIndicator ?? defaultRequiredIndicator)}
      </Comp>
    );
  }
);

Label.displayName = 'Label';

export { Label, labelVariants };