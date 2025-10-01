# Components Documentation

This directory contains all UI components organized using Atomic Design principles.

## Structure

```
components/
├── atoms/          # Basic building blocks
│   ├── Button/
│   ├── Input/
│   └── ...
├── molecules/      # Simple combinations of atoms
│   ├── LanguageSwitcher/
│   ├── FeatureCard/
│   └── ...
├── organisms/      # Complex components
│   ├── Header/
│   ├── WelcomeSection/
│   └── ...
├── templates/      # Page layouts
│   ├── PageLayout/
│   └── ...
└── ui/            # Utility components
    ├── ThemeToggle/
    └── ...
```

## Component Guidelines

### Creating New Components

1. **Choose the right level**: 
   - **Atom**: Cannot be broken down further (Button, Input)
   - **Molecule**: Simple combination of atoms (FormField, Card)
   - **Organism**: Complex component with business logic (Header, Navigation)
   - **Template**: Page-level layout components

2. **Follow naming conventions**:
   - Use PascalCase for component names
   - Use descriptive, clear names
   - Avoid abbreviations

3. **Use TypeScript strictly**:
   - Extend `BaseComponentProps` for common props
   - Define clear interfaces for all props
   - Use union types for variants

4. **Implement accessibility**:
   - Use semantic HTML
   - Include ARIA attributes where needed
   - Ensure keyboard navigation works
   - Test with screen readers

5. **Support internationalization**:
   - Use translation keys for all text
   - Support RTL layouts
   - Handle different text lengths

### Example Component Structure

```typescript
// components/atoms/Button/Button.tsx
import type { BaseComponentProps, ButtonProps } from '@/types';
import { cn } from '@/lib/utils';

export function Button({ 
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Component Documentation Template

Each component should include:

1. **JSDoc comments** with description and examples
2. **Props interface** with clear types
3. **Usage examples** in comments
4. **Accessibility notes** if applicable

## Current Components

### Molecules
- **LanguageSwitcher**: Toggle between English and Arabic
- **FeatureCard**: Display feature information with title and description

### Organisms  
- **Header**: Main application header with navigation and controls
- **WelcomeSection**: Welcome message and call-to-action buttons
- **RTLDemo**: Demonstration of RTL layout capabilities

### UI Utilities
- **ThemeToggle**: Switch between light and dark themes
- **DirectionToggle**: Toggle text direction for testing

## Import Patterns

```typescript
// Import specific components
import { Button } from '@/components/atoms';
import { LanguageSwitcher } from '@/components/molecules';
import { Header } from '@/components/organisms';

// Import multiple components from same level
import { Header, WelcomeSection } from '@/components/organisms';

// Import all components (use sparingly)
import * from '@/components';
```

## Testing Components

Each component should have corresponding tests:

```
components/atoms/Button/
├── Button.tsx
├── Button.test.tsx
├── Button.stories.tsx (Storybook)
└── index.ts
```

Follow the testing conventions in `/src/CONVENTIONS.md` for writing component tests.