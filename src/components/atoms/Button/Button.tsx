import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-9 rounded-md px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
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
        {isLoading && <Spinner className="mr-2 h-4 w-4" />}
        {!isLoading && leftIcon ? <span className="mr-2">{leftIcon}</span> : null}
        {content}
        {!isLoading && rightIcon ? <span className="ml-2">{rightIcon}</span> : null}
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
