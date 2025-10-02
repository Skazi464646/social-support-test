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
    <div className="container py-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {t('components.title', 'Component Showcase')}
        </h1>

        {/* Buttons */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button 
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
          </div>
        </Card>

        {/* Form Controls */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Form Controls</h2>
          <div className="space-y-4 max-w-md">
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
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Progress Bar</h2>
          <div className="space-y-4">
            <ProgressBar currentStep={1} totalSteps={3} completedSteps={new Set()} />
            <ProgressBar currentStep={2} totalSteps={3} completedSteps={new Set([1])} />
            <ProgressBar currentStep={3} totalSteps={3} completedSteps={new Set([1, 2])} />
          </div>
        </Card>

        {/* AI Enhanced Components */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">AI Enhanced Components</h2>
          <div className="space-y-6 max-w-2xl">
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
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Theme & Language Controls</h2>
          <div className="flex flex-wrap gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </Card>

        {/* Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Default Card</h3>
            <p className="text-muted-foreground">
              This is a default card with some content.
            </p>
          </Card>
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold mb-2">Accent Card</h3>
            <p className="text-muted-foreground">
              This card has accent styling.
            </p>
          </Card>
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-2">Muted Card</h3>
            <p className="text-muted-foreground">
              This card has muted background.
            </p>
          </Card>
        </div>

        {/* Development Status */}
        {import.meta.env.DEV && (
          <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <h2 className="text-xl font-semibold mb-4 text-green-800 dark:text-green-200">
              Development Status
            </h2>
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