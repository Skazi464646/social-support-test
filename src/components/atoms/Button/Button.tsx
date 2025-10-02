import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

const buttonVariants = cva(
  // Base styles using design tokens with enhanced accessibility and interaction states
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none',
  {
    variants: {
      variant: {
        // Primary: Main action button using primary design tokens
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-sm hover:shadow-md focus-visible:ring-primary/30',
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-sm hover:shadow-md focus-visible:ring-primary/30',
        
        // Secondary: Alternative action using secondary design tokens
        secondary: 'bg-secondary text-secondary-foreground border border-secondary-border hover:bg-secondary-hover active:bg-secondary-hover/80 shadow-sm hover:shadow focus-visible:ring-secondary/30',
        
        // Destructive: Dangerous actions using destructive design tokens
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90 active:opacity-95 shadow-sm hover:shadow-md focus-visible:ring-destructive/30',
        
        // Outline: Subtle action with border using design tokens
        outline: 'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent-hover active:bg-accent/80 focus-visible:ring-accent/30',
        
        // Ghost: Minimal styling for subtle actions
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80 focus-visible:ring-accent/30',
        
        // Success: Positive actions using success design tokens
        success: 'bg-success text-success-foreground hover:opacity-90 active:opacity-95 shadow-sm hover:shadow-md focus-visible:ring-success/30',
        
        // Warning: Caution actions using warning design tokens
        warning: 'bg-warning text-warning-foreground hover:opacity-90 active:opacity-95 shadow-sm hover:shadow-md focus-visible:ring-warning/30',
        
        // Info: Informational actions using info design tokens
        info: 'bg-info text-info-foreground hover:opacity-90 active:opacity-95 shadow-sm hover:shadow-md focus-visible:ring-info/30',
      },
      size: {
        // Small: Compact buttons using design token spacing
        sm: 'h-8 rounded-md px-3 text-sm gap-1.5',
        
        // Medium: Default size using design token spacing
        md: 'h-10 rounded-md px-4 py-2 text-sm gap-2',
        
        // Large: Prominent buttons using design token spacing
        lg: 'h-12 rounded-lg px-6 py-3 text-base gap-2.5',
        
        // Icon: Square buttons for icons using design token spacing
        icon: 'h-10 w-10 rounded-md p-0',
        
        // Extra small: Very compact buttons
        xs: 'h-7 rounded px-2 text-xs gap-1',
        
        // Extra large: Hero buttons
        xl: 'h-14 rounded-lg px-8 py-4 text-lg gap-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...rest
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled || isLoading);

    const renderContent = (content: React.ReactNode) => (
      <>
        {isLoading && <Spinner className="me-2 h-4 w-4 shrink-0" />}
        {!isLoading && leftIcon ? (
          <span className="me-2 shrink-0 flex items-center justify-center">
            {leftIcon}
          </span>
        ) : null}
        {content && <span className="flex-1 truncate">{content}</span>}
        {!isLoading && rightIcon ? (
          <span className="ms-2 shrink-0 flex items-center justify-center">
            {rightIcon}
          </span>
        ) : null}
      </>
    );

    if (asChild) {
      if (!React.isValidElement(children)) {
        if (import.meta.env.DEV) {
          throw new Error('Button with asChild expects a single React element child.');
        }
        return null;
      }

      const childElement = children as React.ReactElement<any>;
      const {
        className: childClassName,
        children: childContent,
        onClick: childOnClick,
        tabIndex: childTabIndex,
        ...childRest
      } = childElement.props;

      const {
        type: _type,
        onClick: restOnClick,
        tabIndex: restTabIndex,
        ...restWithoutType
      } = rest;

      const mergedClassName = cn(
        buttonVariants({ variant, size, className }),
        childClassName
      );

      const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (isDisabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        if (typeof childOnClick === 'function') {
          childOnClick(event);
        }

        if (typeof restOnClick === 'function') {
          restOnClick(event as unknown as React.MouseEvent<HTMLButtonElement>);
        }
      };

      const computedTabIndex = isDisabled
        ? -1
        : restTabIndex ?? childTabIndex;

      return React.cloneElement(childElement, {
        ...childRest,
        ...restWithoutType,
        className: mergedClassName,
        ref: ref as React.Ref<any>,
        onClick: handleClick,
        'aria-busy': isLoading,
        'data-loading': isLoading,
        'aria-disabled': isDisabled ? true : childRest['aria-disabled'],
        tabIndex: computedTabIndex,
        children: renderContent(childContent),
      });
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        data-loading={isLoading}
        {...rest}
      >
        {renderContent(children)}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
