import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        flat: 'border-border shadow-none hover:shadow-sm',
        elevated: 'border-card-border shadow-sm hover:shadow-md',
        outlined: 'border-2 border-border shadow-none hover:border-primary/20',
        interactive: 'border-card-border shadow-sm hover:shadow-lg hover:border-primary/30 cursor-pointer',
        success: 'border-success-border bg-success-light text-success-light-foreground shadow-sm',
        warning: 'border-warning-border bg-warning-light text-warning-light-foreground shadow-sm',
        destructive: 'border-destructive-border bg-destructive-light text-destructive-light-foreground shadow-sm',
        info: 'border-info-border bg-info-light text-info-light-foreground shadow-sm',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'elevated',
      size: 'md',
    },
  }
);

const cardHeaderVariants = cva(
  'flex flex-col space-y-1.5 pb-6',
  {
    variants: {
      size: {
        sm: 'pb-4',
        md: 'pb-6',
        lg: 'pb-8',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const cardContentVariants = cva('', {
  variants: {
    size: {
      sm: 'space-y-3',
      md: 'space-y-4',
      lg: 'space-y-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const cardFooterVariants = cva(
  'flex items-center pt-6',
  {
    variants: {
      size: {
        sm: 'pt-4',
        md: 'pt-6',
        lg: 'pt-8',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * Card - Flexible container component for content grouping
 * 
 * @example
 * <Card variant="elevated" size="md">
 *   <Card.Header>
 *     <Card.Title>Card Title</Card.Title>
 *     <Card.Description>Card description</Card.Description>
 *   </Card.Header>
 *   <Card.Content>
 *     Content goes here
 *   </Card.Content>
 *   <Card.Footer>
 *     Footer content
 *   </Card.Footer>
 * </Card>
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'div' : 'div';
    
    return (
      <Comp
        ref={ref}
        className={cn(cardVariants({ variant, size, className }))}
        role="region"
        {...props}
      />
    );
  }
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardHeaderVariants({ size, className }))}
      {...props}
    />
  )
);

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight text-text-primary',
        className
      )}
      {...props}
    />
  )
);

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-text-secondary leading-relaxed', className)}
      {...props}
    />
  )
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardContentVariants({ size, className }))}
      {...props}
    />
  )
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFooterVariants({ size, className }))}
      {...props}
    />
  )
);

Card.displayName = 'Card';
CardHeader.displayName = 'Card.Header';
CardTitle.displayName = 'Card.Title';
CardDescription.displayName = 'Card.Description';
CardContent.displayName = 'Card.Content';
CardFooter.displayName = 'Card.Footer';

// Compound component pattern
const CardComponent = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

export { 
  CardComponent as Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  cardVariants 
};