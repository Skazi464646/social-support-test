import { FormWizard } from '@/components/organisms/FormWizard';
import { FormWizardProvider } from '@/context/FormWizardContext';

export function WizardPage() {
  return (
    <FormWizardProvider>
      <FormWizard />
    </FormWizardProvider>
  );
}
