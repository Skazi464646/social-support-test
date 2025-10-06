import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ValidatedFormField } from '@/components/molecules/ValidatedFormField';
import { AIFormField } from '@/components/molecules/AIFormField';
import { Card } from '@/components/molecules/Card';
import { useAIUserContext } from '@/hooks/useAIFormContext';
import type { Step3FormData } from '@/lib/validation/schemas';

// =============================================================================
// COMPONENT
// =============================================================================

export function FormStep3() {
  const { t } = useTranslation(['form', 'common']);
  const { control } = useFormContext<Step3FormData>();

  // Context-aware AI: Extract real form data for intelligent suggestions
  const userContext = useAIUserContext();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('step3.title', 'Detailed Information')}
        </h2>
        <p className="text-muted-foreground">
          {t('step3.description', 'Please provide detailed information about your situation to help us better understand your needs.')}
        </p>
      </div>

      {/* Financial Situation Section */}
      <Card>
        <Card.Content className="p-1">
          <AIFormField
            name="financialSituation"
            control={control}
            label={t('financialSituation', 'Financial Situation')}
            required
            helperText={t('financialSituation_help', 'Describe your current financial challenges and circumstances. Include details about income, expenses, and any financial hardships.')}
            placeholder={t('financialSituation_placeholder', 'Example: I am facing difficulty paying rent due to reduced income after losing my job...')}
            fieldName="financialSituation"
            rows={5}
            maxLength={2000}
            minLength={50}
            userContext={userContext}
          />
        </Card.Content>
      </Card>

      {/* Employment Circumstances Section */}
      <Card>
        <Card.Content className="p-1">
          <AIFormField
            name="employmentCircumstances"
            control={control}
            label={t('employmentCircumstances', 'Employment Circumstances')}
            required
            helperText={t('employmentCircumstances_help', 'Explain your current work situation, recent changes, and any challenges finding employment.')}
            placeholder={t('employmentCircumstances_placeholder', 'Example: I was laid off due to company downsizing and have been searching for employment...')}
            fieldName="employmentCircumstances"
            rows={5}
            maxLength={2000}
            minLength={50}
            userContext={userContext}
          />
        </Card.Content>
      </Card>

      {/* Reason for Applying Section */}
      <Card>
        <Card.Content className="p-1">
          <AIFormField
            name="reasonForApplying"
            control={control}
            label={t('reasonForApplying', 'Why Are You Applying for Social Support?')}
            required
            helperText={t('reasonForApplying_help', 'Explain why you need assistance, what type of support you need, and how it will help you.')}
            placeholder={t('reasonForApplying_placeholder', 'Example: I need help covering basic living expenses while I search for stable employment...')}
            fieldName="reasonForApplying"
            rows={5}
            maxLength={2000}
            minLength={50}
            userContext={userContext}
          />
        </Card.Content>
      </Card>

      {/* Additional Comments Section */}
      <Card>
        <Card.Content className="p-1">
          <AIFormField
            name="additionalComments"
            control={control}
            label={t('additionalComments', 'Additional Information (Optional)')}
            helperText={t('additionalComments_help', 'Share any other relevant information about your circumstances.')}
            placeholder={t('additionalComments_placeholder', 'Any additional information about family situation, health issues, or other relevant factors...')}
            fieldName="additionalComments"
            rows={4}
            maxLength={1000}
            minLength={0}
            required={false}
            userContext={userContext}
          />
        </Card.Content>
      </Card>

      {/* Terms and Consent Section */}
      <Card>
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('consent_section', 'Terms and Consent')}
          </Card.Title>
        </Card.Header>

        <Card.Content>
          <div className="space-y-4">
            {/* Terms Agreement */}
            <div className="flex items-start space-x-3">
              <ValidatedFormField
                name="agreeToTerms"
                control={control}
                label=""
                type="checkbox"
                required
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm text-foreground font-medium">
                  {t('agreeToTerms', 'I agree to the terms and conditions')}
                  <span className="text-destructive ml-1">*</span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('agreeToTerms_help', 'All information provided is true and accurate to the best of your knowledge.')}
                </p>
              </div>
            </div>

            {/* Data Processing Consent */}
            <div className="flex items-start space-x-3">
              <ValidatedFormField
                name="consentToDataProcessing"
                control={control}
                label=""
                type="checkbox"
                required
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm text-foreground font-medium">
                  {t('consentToDataProcessing', 'I consent to data processing')}
                  <span className="text-destructive ml-1">*</span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('consentToDataProcessing_help', 'Processing of personal data for evaluating your social support application.')}
                </p>
              </div>
            </div>

            {/* Contact Permission */}
            <div className="flex items-start space-x-3">
              <ValidatedFormField
                name="allowContactForClarification"
                control={control}
                label=""
                type="checkbox"
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm text-foreground font-medium">
                  {t('allowContactForClarification', 'Allow contact for clarification')}
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('allowContactForClarification_help', 'Permission to contact you if additional information is needed.')}
                </p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Final Notice */}
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-green-600 dark:text-green-400 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
              {t('final_notice_title', 'Application Review')}
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              {t('final_notice_text', 'Your application will be reviewed by our support team. We may contact you if additional information is needed. Processing typically takes 5-10 business days.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}