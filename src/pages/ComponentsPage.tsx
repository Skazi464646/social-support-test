import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Card } from '@/components/molecules/Card';
import { COMPONENTS_PAGE_CONSTANTS } from '@/constants/componentsPage';
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

  const sampleUserContext = COMPONENTS_PAGE_CONSTANTS.sampleUserContext;
  const {
    hero,
    buttons,
    formControls,
    progress,
    aiComponents,
    themeControls,
    cards,
    developmentStatus,
  } = COMPONENTS_PAGE_CONSTANTS;

  return (
      <div className="container py-8 space-y-10">
        <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center mb-16">
          <h1 className="text-display-md font-bold text-foreground mb-4">
            {t('components.title', hero.title)}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed text-center">
            {hero.description}
          </p>
        </div>

        {/* Button Variants */}
        <Card className="p-8 space-y-8">
          <div className="text-center mb-6">
            <h2 className="text-display-sm font-bold text-foreground mb-2">{buttons.heading}</h2>
            <p className="text-base text-muted-foreground">{buttons.description}</p>
          </div>
          
          {/* Solid/Primary Buttons */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold text-foreground">{buttons.primary.title}</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="primary" size="lg">{buttons.primary.labels[0]}</Button>
              <Button variant="primary" size="base">{buttons.primary.labels[1]}</Button>
              <Button variant="primary" size="sm">{buttons.primary.labels[2]}</Button>
              <Button variant="primary" size="xs">{buttons.primary.labels[3]}</Button>
            </div>
          </div>

          {/* Outline/Secondary Buttons */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold text-foreground">{buttons.outline.title}</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="lg">{buttons.outline.labels[0]}</Button>
              <Button variant="outline" size="base">{buttons.outline.labels[1]}</Button>
              <Button variant="outline" size="sm">{buttons.outline.labels[2]}</Button>
              <Button variant="outline" size="xs">{buttons.outline.labels[3]}</Button>
            </div>
          </div>

          {/* Soft/Ghost Buttons */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold text-foreground">{buttons.ghost.title}</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="ghost" size="lg">{buttons.ghost.labels[0]}</Button>
              <Button variant="ghost" size="base">{buttons.ghost.labels[1]}</Button>
              <Button variant="ghost" size="sm">{buttons.ghost.labels[2]}</Button>
              <Button variant="ghost" size="xs">{buttons.ghost.labels[3]}</Button>
            </div>
          </div>

          {/* Semantic Variants */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold text-foreground">{buttons.semantic.title}</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="destructive">{buttons.semantic.buttons.destructive}</Button>
              <Button
                variant="success"
                onClick={() => success({ title: buttons.semantic.successToast.title, description: buttons.semantic.successToast.description })}
              >
                {buttons.semantic.buttons.success}
              </Button>
              <Button variant="warning">{buttons.semantic.buttons.warning}</Button>
              <Button variant="info">{buttons.semantic.buttons.info}</Button>
              <Button variant="link">{buttons.semantic.buttons.link}</Button>
            </div>
          </div>

          {/* Interactive Examples */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold text-foreground">{buttons.interactive.title}</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                variant="primary"
                onClick={() => success({ title: buttons.interactive.successToast.title, description: buttons.interactive.successToast.description })}
              >
                {buttons.interactive.buttons.showSuccess}
              </Button>
              <Button 
                variant="destructive"
                onClick={() => error({ title: buttons.interactive.errorToast.title, description: buttons.interactive.errorToast.description })}
              >
                {buttons.interactive.buttons.showError}
              </Button>
              <Button variant="outline" isLoading>{buttons.interactive.buttons.loading}</Button>
            </div>
          </div>
        </Card>

        {/* Form Controls */}
        <Card className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-display-sm font-bold text-foreground mb-2">{formControls.heading}</h2>
            <p className="text-base text-muted-foreground">{formControls.description}</p>
          </div>
          <div className="space-y-6 max-w-lg mx-auto">
            <div>
              <Label htmlFor="sample-input">{formControls.fields.sampleInput.label}</Label>
              <Input id="sample-input" placeholder={formControls.fields.sampleInput.placeholder} />
            </div>
            <div>
              <Label htmlFor="email-input">{formControls.fields.emailInput.label}</Label>
              <Input id="email-input" type="email" placeholder={formControls.fields.emailInput.placeholder} />
            </div>
            <div>
              <Label htmlFor="password-input">{formControls.fields.passwordInput.label}</Label>
              <Input id="password-input" type="password" placeholder={formControls.fields.passwordInput.placeholder} />
            </div>
          </div>
        </Card>

        {/* Progress Bar */}
        <Card className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-display-sm font-bold text-foreground mb-2">{progress.heading}</h2>
            <p className="text-base text-muted-foreground">{progress.description}</p>
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
            <h2 className="text-display-sm font-bold text-foreground mb-2">{aiComponents.heading}</h2>
            <p className="text-base text-muted-foreground">{aiComponents.description}</p>
          </div>
          <div className="space-y-8 max-w-3xl mx-auto">
            <div>
              <Label htmlFor="ai-textarea">{aiComponents.textarea.label}</Label>
              <AIEnhancedTextarea
                fieldName="sample"
                fieldLabel={aiComponents.textarea.fieldLabel}
                value={textValue}
                onChange={setTextValue}
                placeholder={aiComponents.textarea.placeholder}
                userContext={sampleUserContext}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="ai-input">{aiComponents.input.label}</Label>
              <AIEnhancedInput
                fieldName="sampleInput"
                fieldLabel={aiComponents.input.fieldLabel}
                value={inputValue}
                onChange={setInputValue}
                placeholder={aiComponents.input.placeholder}
                userContext={sampleUserContext}
              />
            </div>
          </div>
        </Card>

        {/* Theme Controls */}
        <Card className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-display-sm font-bold text-foreground mb-2">{themeControls.heading}</h2>
            <p className="text-base text-muted-foreground">{themeControls.description}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </Card>

        {/* Cards Showcase */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-display-sm font-bold text-foreground mb-2">{cards.heading}</h2>
            <p className="text-base text-muted-foreground">{cards.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-3">{cards.variants.default.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {cards.variants.default.description}
              </p>
            </Card>
            <Card className="p-6 text-center bg-primary/5 border-primary/20">
              <h3 className="text-lg font-semibold mb-3">{cards.variants.accent.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {cards.variants.accent.description}
              </p>
            </Card>
            <Card className="p-6 text-center bg-muted/50">
              <h3 className="text-lg font-semibold mb-3">{cards.variants.muted.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {cards.variants.muted.description}
              </p>
            </Card>
          </div>
        </div>

        {/* Development Status */}
      </div>
    </div>
  );
}