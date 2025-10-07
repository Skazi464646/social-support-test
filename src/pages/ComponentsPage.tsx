import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Card } from '@/components/molecules/Card';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useToast } from '@/context/ToastContext';
import { AIEnhancedTextarea } from '@/components/molecules/AIEnhancedTextarea';
import { AIEnhancedInput } from '@/components/molecules/AIEnhancedInput';

export function ComponentsPage() {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const [textValue, setTextValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  const sampleUserContext = {
    step1: { fullName: 'John Doe', email: 'john@example.com' },
    step2: { employmentStatus: 'unemployed', monthlyIncome: 0 },
  };

  return (
      <div className="container py-8 space-y-10">
        <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center mb-16">
          <h1 className="text-display-md font-bold text-foreground mb-4">
            {t('components.title', 'Component Showcase')}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed text-center">
            Explore our comprehensive UI component library built with the UAE government design system
          </p>
        </div>

        {/* Button Variants */}
        <Card className="p-8 space-y-8">
          <div className="text-center mb-6">
            <h2 className="text-display-sm font-bold text-foreground mb-2">Button Variants</h2>
            <p className="text-base text-muted-foreground">UAE Government Design System</p>
          </div>
          
          {/* Solid/Primary Buttons */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold text-foreground">Solid (Primary) - Main Actions</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="primary" size="lg">Large button</Button>
              <Button variant="primary" size="base">Base button</Button>
              <Button variant="primary" size="sm">Small button</Button>
              <Button variant="primary" size="xs">Extra small button</Button>
            </div>
          </div>

          {/* Outline/Secondary Buttons */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold text-foreground">Outline (Secondary) - Alternative Actions</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="lg">Large button</Button>
              <Button variant="outline" size="base">Base button</Button>
              <Button variant="outline" size="sm">Small button</Button>
              <Button variant="outline" size="xs">Extra small button</Button>
            </div>
          </div>

          {/* Soft/Ghost Buttons */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold text-foreground">Soft (Ghost) - Subtle Actions</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="ghost" size="lg">Large button</Button>
              <Button variant="ghost" size="base">Base button</Button>
              <Button variant="ghost" size="sm">Small button</Button>
              <Button variant="ghost" size="xs">Extra small button</Button>
            </div>
          </div>

          {/* Semantic Variants */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold text-foreground">Semantic Variants</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="destructive">Destructive</Button>
              <Button variant="success" onClick={() => success({ title: 'Success!', description: 'Action completed.' })}>
                Success
              </Button>
              <Button variant="warning">Warning</Button>
              <Button variant="info">Info</Button>
              <Button variant="link">Link Button</Button>
            </div>
          </div>

          {/* Interactive Examples */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold text-foreground">Interactive Examples</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                variant="primary"
                onClick={() => success({ title: 'Success!', description: 'This is a success toast.' })}
              >
                Show Success Toast
              </Button>
              <Button 
                variant="destructive"
                onClick={() => error({ title: 'Error!', description: 'This is an error toast.' })}
              >
                Show Error Toast
              </Button>
              <Button variant="outline" isLoading>Loading...</Button>
            </div>
          </div>
        </Card>

        {/* Form Controls */}
        <Card className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-display-sm font-bold text-foreground mb-2">Form Controls</h2>
            <p className="text-base text-muted-foreground">Input fields and form elements</p>
          </div>
          <div className="space-y-6 max-w-lg mx-auto">
            <div>
              <Label htmlFor="sample-input">Sample Input</Label>
              <Input id="sample-input" placeholder="Enter some text..." />
            </div>
            <div>
              <Label htmlFor="email-input">Email Input</Label>
              <Input id="email-input" type="email" placeholder="your@email.com" />
            </div>
            <div>
              <Label htmlFor="password-input">Password Input</Label>
              <Input id="password-input" type="password" placeholder="••••••••" />
            </div>
          </div>
        </Card>

        {/* Progress Bar */}
        <Card className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-display-sm font-bold text-foreground mb-2">Progress Indicator</h2>
            <p className="text-base text-muted-foreground">Multi-step form progress visualization</p>
          </div>
          <div className="space-y-8 max-w-2xl mx-auto">
            <ProgressBar currentStep={1} totalSteps={3} completedSteps={new Set()} />
            <ProgressBar currentStep={2} totalSteps={3} completedSteps={new Set([1])} />
            <ProgressBar currentStep={3} totalSteps={3} completedSteps={new Set([1, 2])} />
          </div>
        </Card>

        {/* AI Enhanced Components */}
        <Card className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-display-sm font-bold text-foreground mb-2">AI Enhanced Components</h2>
            <p className="text-base text-muted-foreground">Intelligent form assistance with AI-powered suggestions</p>
          </div>
          <div className="space-y-8 max-w-3xl mx-auto">
            <div>
              <Label htmlFor="ai-textarea">AI Enhanced Textarea</Label>
              <AIEnhancedTextarea
                fieldName="sample"
                fieldLabel="Sample Field"
                value={textValue}
                onChange={setTextValue}
                placeholder="Start typing and click the AI button for assistance..."
                userContext={sampleUserContext}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="ai-input">AI Enhanced Input</Label>
              <AIEnhancedInput
                fieldName="sampleInput"
                fieldLabel="Sample Input"
                value={inputValue}
                onChange={setInputValue}
                placeholder="Type here and try AI assistance..."
                userContext={sampleUserContext}
              />
            </div>
          </div>
        </Card>

        {/* Theme Controls */}
        <Card className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-display-sm font-bold text-foreground mb-2">Theme & Language Controls</h2>
            <p className="text-base text-muted-foreground">Accessibility and internationalization options</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </Card>

        {/* Cards Showcase */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-display-sm font-bold text-foreground mb-2">Card Variants</h2>
            <p className="text-base text-muted-foreground">Different card styles and layouts</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-3">Default Card</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is a default card with some content and proper typography.
              </p>
            </Card>
            <Card className="p-6 text-center bg-primary/5 border-primary/20">
              <h3 className="text-lg font-semibold mb-3">Accent Card</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This card has accent styling with golden theme.
              </p>
            </Card>
            <Card className="p-6 text-center bg-muted/50">
              <h3 className="text-lg font-semibold mb-3">Muted Card</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This card has muted background styling.
              </p>
            </Card>
          </div>
        </div>

        {/* Development Status */}
        {import.meta.env.DEV && (
          <Card className="p-8 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <div className="text-center mb-6">
              <h2 className="text-display-sm font-bold mb-2 text-green-800 dark:text-green-200">
                Development Status
              </h2>
              <p className="text-base text-green-600 dark:text-green-400">Project progress and completed features</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-green-700 dark:text-green-300 mb-2">Completed Modules:</h3>
                <ul className="space-y-1 text-green-600 dark:text-green-400">
                  <li>✅ Module 1: Project Foundation & Setup</li>
                  <li>✅ Module 2: Core UI Components (Atoms & Molecules)</li>
                  <li>✅ Module 3: Form Management & Validation</li>
                  <li>✅ Module 4: Multi-Step Form Wizard</li>
                  <li>✅ Module 5: AI Integration & Modal System</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-green-700 dark:text-green-300 mb-2">Key Features:</h3>
                <ul className="space-y-1 text-green-600 dark:text-green-400">
                  <li>• Real OpenAI API integration</li>
                  <li>• Streaming AI responses</li>
                  <li>• Rate limiting & security</li>
                  <li>• Multi-language support (EN/AR)</li>
                  <li>• RTL layout support</li>
                  <li>• Auto-save functionality</li>
                  <li>• Comprehensive form validation</li>
                  <li>• Accessible design (ARIA)</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}