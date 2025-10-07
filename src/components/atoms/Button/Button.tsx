import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

const buttonVariants = cva(
        // Base styles - UAE Government Design System
        'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none text-base leading-tight',
  {
    variants: {
      variant: {
        // Solid (Primary): Golden background with white text - Main CTAs
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-gold-md active:bg-primary-active focus-visible:ring-primary/30 shadow-sm',
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-gold-md active:bg-primary-active focus-visible:ring-primary/30 shadow-sm',
        solid: 'bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-gold-md active:bg-primary-active focus-visible:ring-primary/30 shadow-sm',
        
        // Outline (Secondary): White background with golden border - Secondary actions
        outline: 'border-2 border-primary bg-background text-primary hover:bg-accent hover:border-primary-hover hover:shadow-gold-sm active:bg-accent/80 focus-visible:ring-primary/30',
        secondary: 'border-2 border-primary bg-background text-primary hover:bg-accent hover:border-primary-hover hover:shadow-gold-sm active:bg-accent/80 focus-visible:ring-primary/30',
        
        // Soft (Ghost/Tertiary): Light beige background with golden text - Subtle actions
        ghost: 'bg-primary-light text-primary hover:bg-primary-light/80 hover:shadow-sm active:bg-primary-light/60 focus-visible:ring-primary/30',
        soft: 'bg-primary-light text-primary hover:bg-primary-light/80 hover:shadow-sm active:bg-primary-light/60 focus-visible:ring-primary/30',
        tertiary: 'bg-primary-light text-primary hover:bg-primary-light/80 hover:shadow-sm active:bg-primary-light/60 focus-visible:ring-primary/30',
        
        // Semantic variants
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md active:bg-destructive/80 shadow-sm focus-visible:ring-destructive/30',
        success: 'bg-success text-success-foreground hover:bg-success/90 hover:shadow-md active:bg-success/80 shadow-sm focus-visible:ring-success/30',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90 hover:shadow-md active:bg-warning/80 shadow-sm focus-visible:ring-warning/30',
        info: 'bg-info text-info-foreground hover:bg-info/90 hover:shadow-md active:bg-info/80 shadow-sm focus-visible:ring-info/30',
        
        // Link variant for text-only buttons
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary-hover focus-visible:ring-primary/30',
      },
      size: {
            // Extra small: Very compact buttons
            xs: 'h-7 rounded-md px-3 py-1 text-xs font-medium gap-1',

            // Small: Compact buttons
            sm: 'h-9 rounded-md px-4 py-2 text-sm font-medium gap-1.5',

            // Base (Medium): Default size - most common
            base: 'h-11 rounded-lg px-5 py-2.5 text-base font-medium gap-2',
            md: 'h-11 rounded-lg px-5 py-2.5 text-base font-medium gap-2',

            // Large: Prominent buttons for primary actions
            lg: 'h-12 rounded-lg px-6 py-3 text-lg font-semibold gap-2.5',

            // Extra large: Hero/Featured buttons
            xl: 'h-14 rounded-xl px-8 py-4 text-xl font-semibold gap-3',

            // Icon: Square buttons for icons only
            icon: 'h-10 w-10 rounded-md p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'base',
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
