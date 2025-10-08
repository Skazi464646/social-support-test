import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ValidatedFormField } from '@/components/molecules/ValidatedFormField';
import { AIFormField } from '@/components/molecules/AIFormField';
import { Card } from '@/components/molecules/Card';
import { FormStepHeader } from '@/components/molecules/FormStepHeader';
import { 
  FORM_STEP3_FALLBACKS, 
  FORM_STEP3_FIELD_NAMES, 
  FORM_STEP3_VALIDATION 
} from '@/constants/formStep3';
import { TRANSLATION_KEY } from '@/constants/internationalization';
import { useAIUserContext } from '@/hooks/useAIFormContext';
import { CARD_PADDING, SPACING, FORM_FIELD_MARGIN } from '@/constants/ui';
import { FormStepNotice } from '@/components/molecules/FormStepNotice';
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
      <FormStepHeader
        titleKey={TRANSLATION_KEY.step3.title}
        descriptionKey={TRANSLATION_KEY.step3.description}
        fallbacks={FORM_STEP3_FALLBACKS.header}
      />

      {/* Financial Situation Section */}
      <Card>
        <Card.Content className={CARD_PADDING.SMALL}>
          <AIFormField
            name={FORM_STEP3_FIELD_NAMES.financialSituation}
            control={control}
            label={t(TRANSLATION_KEY.financialSituation, FORM_STEP3_FALLBACKS.financialSituation.label)}
            required
            helperText={t(TRANSLATION_KEY.financialSituation_help, FORM_STEP3_FALLBACKS.financialSituation.helperText)}
            placeholder={t(TRANSLATION_KEY.financialSituation_placeholder, FORM_STEP3_FALLBACKS.financialSituation.placeholder)}
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
            label={t(TRANSLATION_KEY.employmentCircumstances, FORM_STEP3_FALLBACKS.employmentCircumstances.label)}
            required
            helperText={t(TRANSLATION_KEY.employmentCircumstances_help, FORM_STEP3_FALLBACKS.employmentCircumstances.helperText)}
            placeholder={t(TRANSLATION_KEY.employmentCircumstances_placeholder, FORM_STEP3_FALLBACKS.employmentCircumstances.placeholder)}
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
            label={t(TRANSLATION_KEY.reasonForApplying, FORM_STEP3_FALLBACKS.reasonForApplying.label)}
            required
            helperText={t(TRANSLATION_KEY.reasonForApplying_help, FORM_STEP3_FALLBACKS.reasonForApplying.helperText)}
            placeholder={t(TRANSLATION_KEY.reasonForApplying_placeholder, FORM_STEP3_FALLBACKS.reasonForApplying.placeholder)}
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
            label={t(TRANSLATION_KEY.additionalComments, FORM_STEP3_FALLBACKS.additionalComments.label)}
            helperText={t(TRANSLATION_KEY.additionalComments_help, FORM_STEP3_FALLBACKS.additionalComments.helperText)}
            placeholder={t(TRANSLATION_KEY.additionalComments_placeholder, FORM_STEP3_FALLBACKS.additionalComments.placeholder)}
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
            {t(TRANSLATION_KEY.consent_section, FORM_STEP3_FALLBACKS.consent.sectionTitle)}
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
                  {t(TRANSLATION_KEY.agreeToTerms, FORM_STEP3_FALLBACKS.consent.agreeToTerms.label)}
                  <span className="text-destructive ml-1">*</span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t(TRANSLATION_KEY.agreeToTerms_help, FORM_STEP3_FALLBACKS.consent.agreeToTerms.helperText)}
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
                  {t(TRANSLATION_KEY.consentToDataProcessing, FORM_STEP3_FALLBACKS.consent.consentToDataProcessing.label)}
                  <span className="text-destructive ml-1">*</span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t(TRANSLATION_KEY.consentToDataProcessing_help, FORM_STEP3_FALLBACKS.consent.consentToDataProcessing.helperText)}
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
                  {t(TRANSLATION_KEY.allowContactForClarification, FORM_STEP3_FALLBACKS.consent.allowContactForClarification.label)}
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t(TRANSLATION_KEY.allowContactForClarification_help, FORM_STEP3_FALLBACKS.consent.allowContactForClarification.helperText)}
                </p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Final Notice */}
      <FormStepNotice
        variant="success"
        titleKey={TRANSLATION_KEY.final_notice_title}
        descriptionKey={TRANSLATION_KEY.final_notice_text}
        fallbacks={FORM_STEP3_FALLBACKS.finalNotice}
      />
    </div>
  );
}
