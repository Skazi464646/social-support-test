# Code Conventions & Standards

## File & Folder Naming

### Components
- **Files**: PascalCase (e.g., `Button.tsx`, `LanguageSwitcher.tsx`)
- **Folders**: PascalCase for component folders (e.g., `Button/`, `LanguageSwitcher/`)
- **Index files**: Always use `index.ts` for barrel exports

### Utilities & Hooks
- **Files**: camelCase (e.g., `useDirection.ts`, `utils.ts`)
- **Folders**: camelCase (e.g., `hooks/`, `lib/`, `types/`)

### Constants & Types
- **Files**: camelCase (e.g., `index.ts`, `api.types.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `APP_CONFIG`, `Z_INDEX`)
- **Types**: PascalCase (e.g., `ButtonProps`, `ThemeContextType`)

## Component Structure

### Atomic Design Hierarchy
```
components/
├── atoms/          # Basic building blocks (Button, Input, Label)
├── molecules/      # Simple combinations (FormField, LanguageSwitcher)
├── organisms/      # Complex components (Header, FormWizard)
├── templates/      # Page layouts (PageLayout, FormLayout)
└── ui/            # Utility components (ThemeToggle)
```

### Component File Structure
```typescript
// 1. External imports
import React from 'react';
import { useTranslation } from 'react-i18next';

// 2. Internal imports (types first, then components/hooks)
import type { BaseComponentProps } from '@/types';
import { cn } from '@/lib/utils';

// 3. Interface definition
interface ComponentProps extends BaseComponentProps {
  variant?: 'default' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

// 4. Component implementation
export function ComponentName({ 
  className = '', 
  variant = 'default',
  ...props 
}: ComponentProps) {
  return (
    <div className={cn('base-classes', variantClasses[variant], className)}>
      {/* Component content */}
    </div>
  );
}
```

## Import/Export Patterns

### Imports
```typescript
// ✅ Good: Use path aliases
import { Button } from '@/components/atoms';
import { useDirection } from '@/hooks';
import type { BaseComponentProps } from '@/types';

// ❌ Bad: Relative imports for distant files
import { Button } from '../../../components/atoms/Button';
```

### Exports
```typescript
// ✅ Good: Named exports
export function Button() { }
export type ButtonProps = { };

// ❌ Bad: Default exports for components
export default function Button() { }
```

### Barrel Exports
```typescript
// index.ts files should use named exports
export { Button } from './Button';
export { Input } from './Input';
export type { ButtonProps, InputProps } from './types';
```

## TypeScript Conventions

### Props Interfaces
```typescript
// Always extend BaseComponentProps
interface ButtonProps extends BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  loading?: boolean;
}

// Use descriptive names
interface LanguageSwitcherProps extends BaseComponentProps {
  onLanguageChange?: (language: Language) => void;
}
```

### Type Definitions
```typescript
// Use union types for variants
type ComponentVariant = 'default' | 'primary' | 'secondary';

// Use const assertions for constants
const THEMES = ['light', 'dark', 'system'] as const;
type Theme = typeof THEMES[number];
```

## Styling Conventions

### CSS Classes
```typescript
// ✅ Good: Use cn() utility for conditional classes
className={cn(
  'base-classes',
  variant === 'primary' && 'primary-classes',
  size === 'lg' && 'large-classes',
  className
)}

// ✅ Good: Group related classes
className="flex items-center justify-between gap-4"

// ❌ Bad: Long single-line classes
className="flex items-center justify-between gap-4 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
```

### Component Variants
```typescript
// Use class-variance-authority for complex variants
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
```

## Documentation Standards

### Component Documentation
```typescript
/**
 * LanguageSwitcher component for toggling between supported languages
 * 
 * Features:
 * - Automatic language detection
 * - RTL/LTR direction switching
 * - Persistent language preference
 * 
 * @example
 * <LanguageSwitcher className="mr-4" />
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  // Implementation
}
```

### Hook Documentation
```typescript
/**
 * Custom hook for managing text direction based on current language
 * 
 * Automatically updates document direction and provides utilities
 * for RTL/LTR detection
 * 
 * @returns Object with direction utilities
 * @example
 * const { isRTL, direction } = useDirection();
 */
export function useDirection() {
  // Implementation
}
```

## Best Practices

### Performance
- Use React.memo for expensive components
- Implement proper dependency arrays in useEffect
- Avoid creating objects/functions in render

### Accessibility
- Always include proper ARIA attributes
- Use semantic HTML elements
- Ensure keyboard navigation works
- Include screen reader support

### Internationalization
- All user-facing text must use translation keys
- Support RTL languages properly
- Use proper locale formatting for dates/numbers

### Error Handling
- Always handle loading and error states
- Use proper TypeScript error types
- Implement graceful fallbacks