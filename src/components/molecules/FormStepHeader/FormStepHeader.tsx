import { useTranslation } from 'react-i18next';

export type FormStepHeaderProps = {
  titleKey: string;
  descriptionKey: string;
  fallbacks: {
    title: string;
    description: string;
  };
  className?: string;
};

export function FormStepHeader({ titleKey, descriptionKey, fallbacks, className }: FormStepHeaderProps) {
  const { t } = useTranslation(['form', 'common']);

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {t(titleKey, fallbacks.title)}
      </h2>
      <p className="text-muted-foreground">
        {t(descriptionKey, fallbacks.description)}
      </p>
    </div>
  );
}


