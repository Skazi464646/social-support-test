import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ValidatedFormField } from '@/components/molecules/ValidatedFormField';
import { AIFormField } from '@/components/molecules/AIFormField';
import { Card } from '@/components/molecules/Card';
import { 
  FORM_STEP3_FALLBACKS, 
  FORM_STEP3_FIELD_NAMES, 
  FORM_STEP3_VALIDATION 
} from '@/constants/formStep3';
import { useAIUserContext } from '@/hooks/useAIFormContext';
import { CARD_PADDING, SPACING, ICON_SIZE, FORM_FIELD_MARGIN } from '@/constants/ui';
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
    <div className={SPACING.FIELD_GROUP}>
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
        <Card.Content className={CARD_PADDING.SMALL}>
          <AIFormField
            name={FORM_STEP3_FIELD_NAMES.financialSituation}
            control={control}
            label={t('financialSituation', FORM_STEP3_FALLBACKS.financialSituation.label)}
            required
            helperText={t('financialSituation_help', FORM_STEP3_FALLBACKS.financialSituation.helperText)}
            placeholder={t('financialSituation_placeholder', FORM_STEP3_FALLBACKS.financialSituation.placeholder)}
            fieldName={FORM_STEP3_FIELD_NAMES.financialSituation}
            rows={FORM_STEP3_VALIDATION.financialSituation.ROWS}
            maxLength={FORM_STEP3_VALIDATION.financialSituation.MAX_LENGTH}
            minLength={FORM_STEP3_VALIDATION.financialSituation.MIN_LENGTH}
            userContext={userContext}
          />
        </Card.Content>
      </Card>

      {/* Employment Circumstances Section */}
      <Card>
        <Card.Content className={CARD_PADDING.SMALL}>
          <AIFormField
            name={FORM_STEP3_FIELD_NAMES.employmentCircumstances}
            control={control}
            label={t('employmentCircumstances', FORM_STEP3_FALLBACKS.employmentCircumstances.label)}
            required
            helperText={t('employmentCircumstances_help', FORM_STEP3_FALLBACKS.employmentCircumstances.helperText)}
            placeholder={t('employmentCircumstances_placeholder', FORM_STEP3_FALLBACKS.employmentCircumstances.placeholder)}
            fieldName={FORM_STEP3_FIELD_NAMES.employmentCircumstances}
            rows={FORM_STEP3_VALIDATION.employmentCircumstances.ROWS}
            maxLength={FORM_STEP3_VALIDATION.employmentCircumstances.MAX_LENGTH}
            minLength={FORM_STEP3_VALIDATION.employmentCircumstances.MIN_LENGTH}
            userContext={userContext}
          />
        </Card.Content>
      </Card>

      {/* Reason for Applying Section */}
      <Card>
        <Card.Content className={CARD_PADDING.SMALL}>
          <AIFormField
            name={FORM_STEP3_FIELD_NAMES.reasonForApplying}
            control={control}
            label={t('reasonForApplying', FORM_STEP3_FALLBACKS.reasonForApplying.label)}
            required
            helperText={t('reasonForApplying_help', FORM_STEP3_FALLBACKS.reasonForApplying.helperText)}
            placeholder={t('reasonForApplying_placeholder', FORM_STEP3_FALLBACKS.reasonForApplying.placeholder)}
            fieldName={FORM_STEP3_FIELD_NAMES.reasonForApplying}
            rows={FORM_STEP3_VALIDATION.reasonForApplying.ROWS}
            maxLength={FORM_STEP3_VALIDATION.reasonForApplying.MAX_LENGTH}
            minLength={FORM_STEP3_VALIDATION.reasonForApplying.MIN_LENGTH}
            userContext={userContext}
          />
        </Card.Content>
      </Card>

      {/* Additional Comments Section */}
      <Card>
        <Card.Content className={CARD_PADDING.SMALL}>
          <AIFormField
            name={FORM_STEP3_FIELD_NAMES.additionalComments}
            control={control}
            label={t('additionalComments', FORM_STEP3_FALLBACKS.additionalComments.label)}
            helperText={t('additionalComments_help', FORM_STEP3_FALLBACKS.additionalComments.helperText)}
            placeholder={t('additionalComments_placeholder', FORM_STEP3_FALLBACKS.additionalComments.placeholder)}
            fieldName={FORM_STEP3_FIELD_NAMES.additionalComments}
            rows={FORM_STEP3_VALIDATION.additionalComments.ROWS}
            maxLength={FORM_STEP3_VALIDATION.additionalComments.MAX_LENGTH}
            minLength={FORM_STEP3_VALIDATION.additionalComments.MIN_LENGTH}
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
          <div className={SPACING.CHECKBOX_GROUP}>
            {/* Terms Agreement */}
            <div className="flex items-start space-x-3">
              <ValidatedFormField
                name={FORM_STEP3_FIELD_NAMES.agreeToTerms}
                control={control}
                label=""
                type="checkbox"
                required
                className={FORM_FIELD_MARGIN.TOP_DEFAULT}
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
                name={FORM_STEP3_FIELD_NAMES.consentToDataProcessing}
                control={control}
                label=""
                type="checkbox"
                required
                className={FORM_FIELD_MARGIN.TOP_DEFAULT}
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
                name={FORM_STEP3_FIELD_NAMES.allowContactForClarification}
                control={control}
                label=""
                type="checkbox"
                className={FORM_FIELD_MARGIN.TOP_DEFAULT}
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
            <svg className={ICON_SIZE.DEFAULT} fill="currentColor" viewBox="0 0 20 20">
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
