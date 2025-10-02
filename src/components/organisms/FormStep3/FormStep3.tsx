import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ValidatedFormField } from '@/components/molecules/ValidatedFormField';
import { AIFormField } from '@/components/molecules/AIFormField';
import { Card } from '@/components/molecules/Card';
import type { Step3FormData } from '@/lib/validation/schemas';

// =============================================================================
// COMPONENT
// =============================================================================

export function FormStep3() {
  const { t } = useTranslation();
  const { control } = useFormContext<Step3FormData>();

  // For now, we'll simplify the AI context - this can be improved later
  const userContext = {
    step1: {},
    step2: {},
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('form.title', 'Detailed Information')}
        </h2>
        <p className="text-muted-foreground">
          {t('form.description', 'Please provide detailed information about your situation to help us better understand your needs.')}
        </p>
      </div>

      {/* Financial Situation Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('form.financial_section', 'Financial Situation')}
          </Card.Title>
          <Card.Description>
            {t('form.financial_description', 'Describe your current financial challenges and circumstances')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <AIFormField
            name="financialSituation"
            control={control}
            label={t('form.financialSituation', 'Describe Your Financial Situation')}
            helperText={t('form.financialSituation_help', 'Please describe your current financial challenges, including specific difficulties you are facing. Minimum 50 characters required.')}
            placeholder={t('form.financialSituation_placeholder', 'Example: I am facing difficulty paying rent due to reduced income after losing my job. My savings are depleted and I have outstanding bills that I cannot afford...')}
            fieldName="financialSituation"
            rows={6}
            maxLength={2000}
            minLength={50}
            required
            userContext={userContext}
          />
        </Card.Content>
      </Card>

      {/* Employment Circumstances Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('form.employment_section', 'Employment Circumstances')}
          </Card.Title>
          <Card.Description>
            {t('form.employment_description', 'Explain your current employment situation and any related challenges')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <AIFormField
            name="employmentCircumstances"
            control={control}
            label={t('form.employmentCircumstances', 'Describe Your Employment Circumstances')}
            helperText={t('form.employmentCircumstances_help', 'Please explain your current work situation, including any recent changes, challenges in finding employment, or barriers you face. Minimum 50 characters required.')}
            placeholder={t('form.employmentCircumstances_placeholder', 'Example: I was employed as a retail associate for 3 years but was laid off due to company downsizing. I have been actively searching for employment for 6 months but have faced challenges due to limited opportunities in my field...')}
            fieldName="employmentCircumstances"
            rows={6}
            maxLength={2000}
            minLength={50}
            required
            userContext={userContext}
          />
        </Card.Content>
      </Card>

      {/* Reason for Applying Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('form.reason_section', 'Reason for Applying')}
          </Card.Title>
          <Card.Description>
            {t('form.reason_description', 'Explain why you are seeking social support and how it will help you')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <AIFormField
            name="reasonForApplying"
            control={control}
            label={t('form.reasonForApplying', 'Why Are You Applying for Social Support?')}
            helperText={t('form.reasonForApplying_help', 'Please explain why you need social support, what specific assistance you are seeking, and how this support will help improve your situation. Minimum 50 characters required.')}
            placeholder={t('form.reasonForApplying_placeholder', 'Example: I am applying for social support to help cover basic living expenses including rent, utilities, and groceries while I search for stable employment. This assistance would provide me with the stability I need to focus on job searching and skills development...')}
            fieldName="reasonForApplying"
            rows={6}
            maxLength={2000}
            minLength={50}
            required
            userContext={userContext}
          />
        </Card.Content>
      </Card>

      {/* Additional Comments Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('form.additional_section', 'Additional Information')}
          </Card.Title>
          <Card.Description>
            {t('form.additional_description', 'Any additional information you would like to share (optional)')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <AIFormField
            name="additionalComments"
            control={control}
            label={t('form.additionalComments', 'Additional Comments')}
            helperText={t('form.additionalComments_help', 'Share any other relevant information that might help us understand your situation better. This field is optional.')}
            placeholder={t('form.additionalComments_placeholder', 'Any additional information about your circumstances, family situation, health issues, or other factors that might be relevant to your application...')}
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
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('form.consent_section', 'Terms and Consent')}
          </Card.Title>
          <Card.Description>
            {t('form.consent_description', 'Please review and agree to the following terms')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="space-y-6">
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
                <label className="text-sm text-foreground">
                  {t('form.agreeToTerms', 'I agree to the terms and conditions')}
                  <span className="text-destructive ml-1">*</span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('form.agreeToTerms_help', 'By checking this box, you confirm that all information provided is true and accurate to the best of your knowledge.')}
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
                <label className="text-sm text-foreground">
                  {t('form.consentToDataProcessing', 'I consent to data processing')}
                  <span className="text-destructive ml-1">*</span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('form.consentToDataProcessing_help', 'You consent to the processing of your personal data for the purpose of evaluating your social support application.')}
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
                <label className="text-sm text-foreground">
                  {t('form.allowContactForClarification', 'Allow contact for clarification')}
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('form.allowContactForClarification_help', 'You give permission to be contacted if additional information or clarification is needed for your application.')}
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
              {t('form.final_notice_title', 'Application Review')}
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              {t('form.final_notice_text', 'Your application will be reviewed by our support team. We may contact you if additional information is needed. Processing typically takes 5-10 business days.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}