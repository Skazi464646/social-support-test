import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ValidatedFormField } from '@/components/molecules/ValidatedFormField';
import { AIFormField } from '@/components/molecules/AIFormField';
import { Card } from '@/components/molecules/Card';
import { FORM_STEP3_FALLBACKS } from '@/constants/formStep3';
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
          {t('step3.title', FORM_STEP3_FALLBACKS.header.title)}
        </h2>
        <p className="text-muted-foreground">
          {t('step3.description', FORM_STEP3_FALLBACKS.header.description)}
        </p>
      </div>

      {/* Financial Situation Section */}
      <Card>
        <Card.Content className="p-1">
          <AIFormField
            name="financialSituation"
            control={control}
            label={t('financialSituation', FORM_STEP3_FALLBACKS.financialSituation.label)}
            required
            helperText={t('financialSituation_help', FORM_STEP3_FALLBACKS.financialSituation.helperText)}
            placeholder={t('financialSituation_placeholder', FORM_STEP3_FALLBACKS.financialSituation.placeholder)}
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
            label={t('employmentCircumstances', FORM_STEP3_FALLBACKS.employmentCircumstances.label)}
            required
            helperText={t('employmentCircumstances_help', FORM_STEP3_FALLBACKS.employmentCircumstances.helperText)}
            placeholder={t('employmentCircumstances_placeholder', FORM_STEP3_FALLBACKS.employmentCircumstances.placeholder)}
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
            label={t('reasonForApplying', FORM_STEP3_FALLBACKS.reasonForApplying.label)}
            required
            helperText={t('reasonForApplying_help', FORM_STEP3_FALLBACKS.reasonForApplying.helperText)}
            placeholder={t('reasonForApplying_placeholder', FORM_STEP3_FALLBACKS.reasonForApplying.placeholder)}
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
            label={t('additionalComments', FORM_STEP3_FALLBACKS.additionalComments.label)}
            helperText={t('additionalComments_help', FORM_STEP3_FALLBACKS.additionalComments.helperText)}
            placeholder={t('additionalComments_placeholder', FORM_STEP3_FALLBACKS.additionalComments.placeholder)}
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
            {t('consent_section', FORM_STEP3_FALLBACKS.consent.sectionTitle)}
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
                  {t('agreeToTerms', FORM_STEP3_FALLBACKS.consent.agreeToTerms.label)}
                  <span className="text-destructive ml-1">*</span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('agreeToTerms_help', FORM_STEP3_FALLBACKS.consent.agreeToTerms.helperText)}
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
                  {t('consentToDataProcessing', FORM_STEP3_FALLBACKS.consent.consentToDataProcessing.label)}
                  <span className="text-destructive ml-1">*</span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('consentToDataProcessing_help', FORM_STEP3_FALLBACKS.consent.consentToDataProcessing.helperText)}
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
                  {t('allowContactForClarification', FORM_STEP3_FALLBACKS.consent.allowContactForClarification.label)}
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('allowContactForClarification_help', FORM_STEP3_FALLBACKS.consent.allowContactForClarification.helperText)}
                </p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Final Notice */}
      <div className="border border-success-border bg-success-light rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-success mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-success-light-foreground mb-1">
              {t('final_notice_title', FORM_STEP3_FALLBACKS.finalNotice.title)}
            </h4>
            <p className="text-sm text-success-light-foreground/90">
              {t('final_notice_text', FORM_STEP3_FALLBACKS.finalNotice.text)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
