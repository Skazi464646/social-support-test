import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        error: 'text-destructive',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
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
          'text-destructive',
          isRTL ? 'mr-1' : 'ml-1'
        )}
        aria-label="required"
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