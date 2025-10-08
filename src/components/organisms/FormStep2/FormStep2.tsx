import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ValidatedFormField } from '@/components/molecules/ValidatedFormField';
import { Card } from '@/components/molecules/Card';
import { FormStepHeader } from '@/components/molecules/FormStepHeader';
import { 
  FORM_STEP2_FALLBACKS, 
  FORM_STEP2_FIELD_NAMES, 
  FORM_STEP2_VALUES, 
  FORM_STEP2_VALIDATION 
} from '@/constants/formStep2';
import { TRANSLATION_KEY } from '@/constants/internationalization';
import { CARD_PADDING, GRID_LAYOUTS, SPACING, ICON_SIZE } from '@/constants/ui';
import type { Step2FormData } from '@/lib/validation/schemas';

// =============================================================================
// COMPONENT
// =============================================================================

export function FormStep2() {
  const { t } = useTranslation(['form', 'common', 'validation']);
  const { control, watch } = useFormContext<Step2FormData>();

  // Watch for conditional fields
  const employmentStatus = watch(FORM_STEP2_FIELD_NAMES.employmentStatus);
  const housingStatus = watch(FORM_STEP2_FIELD_NAMES.housingStatus);
  const receivingBenefits = watch(FORM_STEP2_FIELD_NAMES.receivingBenefits);
  
  // Helper function to check boolean values that might be strings
  const isTruthy = (value: any) => value === true || value === 'true';

  return (
    <div className={SPACING.SECTION}>
      {/* Header */}
      <FormStepHeader
        titleKey={TRANSLATION_KEY.step2.title}
        descriptionKey={TRANSLATION_KEY.step2.description}
        fallbacks={FORM_STEP2_FALLBACKS.header}
      />

      {/* Family Information Section */}
      <Card className={CARD_PADDING.DEFAULT}>
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t(TRANSLATION_KEY.family_section, FORM_STEP2_FALLBACKS.family.title)}
          </Card.Title>
          <Card.Description>
            {t(TRANSLATION_KEY.family_description, FORM_STEP2_FALLBACKS.family.description)}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className={GRID_LAYOUTS.TWO_COLUMNS}>
            {/* Marital Status */}
            <ValidatedFormField
              name={FORM_STEP2_FIELD_NAMES.maritalStatus}
              control={control}
              label={t(TRANSLATION_KEY.maritalStatus, FORM_STEP2_FALLBACKS.fields.maritalStatus.label)}
              // helperText={t(TRANSLATION_KEY.maritalStatus_help, 'Your current marital status')}
              type="select"
              required
              options={[
                { value: FORM_STEP2_VALUES.maritalStatus.EMPTY, label: t(TRANSLATION_KEY.maritalStatus_select, FORM_STEP2_FALLBACKS.fields.maritalStatus.selectLabel) },
                { value: FORM_STEP2_VALUES.maritalStatus.SINGLE, label: t(TRANSLATION_KEY.maritalStatus_options.single, FORM_STEP2_FALLBACKS.fields.maritalStatus.options.single) },
                { value: FORM_STEP2_VALUES.maritalStatus.MARRIED, label: t(TRANSLATION_KEY.maritalStatus_options.married, FORM_STEP2_FALLBACKS.fields.maritalStatus.options.married) },
                { value: FORM_STEP2_VALUES.maritalStatus.DIVORCED, label: t(TRANSLATION_KEY.maritalStatus_options.divorced, FORM_STEP2_FALLBACKS.fields.maritalStatus.options.divorced) },
                { value: FORM_STEP2_VALUES.maritalStatus.WIDOWED, label: t(TRANSLATION_KEY.maritalStatus_options.widowed, FORM_STEP2_FALLBACKS.fields.maritalStatus.options.widowed) },
                { value: FORM_STEP2_VALUES.maritalStatus.SEPARATED, label: t(TRANSLATION_KEY.maritalStatus_options.separated, FORM_STEP2_FALLBACKS.fields.maritalStatus.options.separated) },
              ]}
            />

            {/* Number of Dependents */}
            <ValidatedFormField
              name={FORM_STEP2_FIELD_NAMES.numberOfDependents}
              control={control}
              label={t(TRANSLATION_KEY.numberOfDependents, FORM_STEP2_FALLBACKS.fields.numberOfDependents.label)}
              // helperText={t(TRANSLATION_KEY.numberOfDependents_help, 'Children or family members you financially support')}
              type="number"
              min={FORM_STEP2_VALIDATION.numberOfDependents.MIN}
              max={FORM_STEP2_VALIDATION.numberOfDependents.MAX}
              placeholder={t(TRANSLATION_KEY.numberOfDependents_placeholder, '0')}
              required
            />
          </div>
        </Card.Content>
      </Card>

      {/* Employment Information Section */}
      <Card className={CARD_PADDING.DEFAULT}>
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t(TRANSLATION_KEY.employment_section, FORM_STEP2_FALLBACKS.employment.title)}
          </Card.Title>
          <Card.Description>
            {t(TRANSLATION_KEY.employment_description, FORM_STEP2_FALLBACKS.employment.description)}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className={GRID_LAYOUTS.TWO_COLUMNS}>
            {/* Employment Status */}
            <ValidatedFormField
              name={FORM_STEP2_FIELD_NAMES.employmentStatus}
              control={control}
              label={t(TRANSLATION_KEY.employmentStatus, FORM_STEP2_FALLBACKS.fields.employmentStatus.label)}
              // helperText={t(TRANSLATION_KEY.employmentStatus_help, 'Your current work situation')}
              type="select"
              required
              className={GRID_LAYOUTS.FULL_WIDTH_IN_GRID}
              options={[
                { value: FORM_STEP2_VALUES.employmentStatus.EMPTY, label: t(TRANSLATION_KEY.employmentStatus_select, FORM_STEP2_FALLBACKS.fields.employmentStatus.selectLabel) },
                { value: FORM_STEP2_VALUES.employmentStatus.EMPLOYED_FULL_TIME, label: t(TRANSLATION_KEY.employmentStatus_options.employed, FORM_STEP2_FALLBACKS.fields.employmentStatus.options.employedFullTime) },
                { value: FORM_STEP2_VALUES.employmentStatus.EMPLOYED_PART_TIME, label: t(TRANSLATION_KEY.employmentStatus_options.part_time, FORM_STEP2_FALLBACKS.fields.employmentStatus.options.employedPartTime) },
                { value: FORM_STEP2_VALUES.employmentStatus.SELF_EMPLOYED, label: t(TRANSLATION_KEY.employmentStatus_options.self_employed, FORM_STEP2_FALLBACKS.fields.employmentStatus.options.selfEmployed) },
                { value: FORM_STEP2_VALUES.employmentStatus.UNEMPLOYED, label: t(TRANSLATION_KEY.employmentStatus_options.unemployed, FORM_STEP2_FALLBACKS.fields.employmentStatus.options.unemployed) },
                { value: FORM_STEP2_VALUES.employmentStatus.RETIRED, label: t(TRANSLATION_KEY.employmentStatus_options.retired, FORM_STEP2_FALLBACKS.fields.employmentStatus.options.retired) },
                { value: FORM_STEP2_VALUES.employmentStatus.STUDENT, label: t(TRANSLATION_KEY.employmentStatus_options.student, FORM_STEP2_FALLBACKS.fields.employmentStatus.options.student) },
                { value: FORM_STEP2_VALUES.employmentStatus.DISABLED, label: t(TRANSLATION_KEY.employmentStatus_options.disabled, FORM_STEP2_FALLBACKS.fields.employmentStatus.options.disabled) },
              ]}
            />

            {/* Occupation - Show if employed or self-employed */}
            {(employmentStatus === FORM_STEP2_VALUES.employmentStatus.EMPLOYED_FULL_TIME || 
              employmentStatus === FORM_STEP2_VALUES.employmentStatus.EMPLOYED_PART_TIME || 
              employmentStatus === FORM_STEP2_VALUES.employmentStatus.SELF_EMPLOYED) && (
              <ValidatedFormField
                name={FORM_STEP2_FIELD_NAMES.occupation}
                control={control}
                label={t(TRANSLATION_KEY.occupation, FORM_STEP2_FALLBACKS.fields.occupation.label)}
                placeholder={t(TRANSLATION_KEY.occupation_placeholder, FORM_STEP2_FALLBACKS.fields.occupation.placeholder)}
                // helperText={t(TRANSLATION_KEY.occupation_help, 'Your current job title or type of business')}
                required
              />
            )}

            {/* Employer - Show if employed */}
            {(employmentStatus === FORM_STEP2_VALUES.employmentStatus.EMPLOYED_FULL_TIME || 
              employmentStatus === FORM_STEP2_VALUES.employmentStatus.EMPLOYED_PART_TIME) && (
              <ValidatedFormField
                name={FORM_STEP2_FIELD_NAMES.employer}
                control={control}
                label={t(TRANSLATION_KEY.employer, FORM_STEP2_FALLBACKS.fields.employer.label)}
                placeholder={t(TRANSLATION_KEY.employer_placeholder, FORM_STEP2_FALLBACKS.fields.employer.placeholder)}
                // helperText={t(TRANSLATION_KEY.employer_help, 'The company or organization you work for')}
                required
              />
            )}

            {/* Monthly Income */}
            <ValidatedFormField
              name={FORM_STEP2_FIELD_NAMES.monthlyIncome}
              control={control}
              label={t(TRANSLATION_KEY.monthlyIncome, FORM_STEP2_FALLBACKS.fields.monthlyIncome.label)}
              // helperText={t(TRANSLATION_KEY.monthlyIncome_help, 'Your total monthly income from all sources')}
              type="number"
              required
            />

            {/* Monthly Expenses */}
            <ValidatedFormField
              name={FORM_STEP2_FIELD_NAMES.monthlyExpenses}
              control={control}
              label={t(TRANSLATION_KEY.monthlyExpenses, FORM_STEP2_FALLBACKS.fields.monthlyExpenses.label)}
              // helperText={t(TRANSLATION_KEY.monthlyExpenses_help, 'Your total monthly living expenses')}
              type="number"
              required
            />

            {/* Total Savings */}
            <ValidatedFormField
              name={FORM_STEP2_FIELD_NAMES.totalSavings}
              control={control}
              label={t(TRANSLATION_KEY.totalSavings, FORM_STEP2_FALLBACKS.fields.totalSavings.label)}
              // helperText={t(TRANSLATION_KEY.totalSavings_help, 'Your current savings and bank deposits')}
              type="number"
              required
            />

            {/* Total Debt */}
            <ValidatedFormField
              name={FORM_STEP2_FIELD_NAMES.totalDebt}
              control={control}
              label={t(TRANSLATION_KEY.totalDebt, FORM_STEP2_FALLBACKS.fields.totalDebt.label)}
              // helperText={t(TRANSLATION_KEY.totalDebt_help, 'Your current total debt including loans and credit cards')}
              type="number"
              required
            />
          </div>
        </Card.Content>
      </Card>

      {/* Housing Information Section */}
      <Card className={CARD_PADDING.DEFAULT}>
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t(TRANSLATION_KEY.housing_section, FORM_STEP2_FALLBACKS.housing.title)}
          </Card.Title>
          <Card.Description>
            {t(TRANSLATION_KEY.housing_description, FORM_STEP2_FALLBACKS.housing.description)}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className={GRID_LAYOUTS.TWO_COLUMNS}>
            {/* Housing Status */}
            <ValidatedFormField
              name={FORM_STEP2_FIELD_NAMES.housingStatus}
              control={control}
              label={t(TRANSLATION_KEY.housingStatus, FORM_STEP2_FALLBACKS.fields.housingStatus.label)}
              // helperText={t(TRANSLATION_KEY.housingStatus_help, 'Your current housing arrangement')}
              type="select"
              required
              className={GRID_LAYOUTS.FULL_WIDTH_IN_GRID}
              options={[
                { value: FORM_STEP2_VALUES.housingStatus.EMPTY, label: t(TRANSLATION_KEY.housingStatus_select, FORM_STEP2_FALLBACKS.fields.housingStatus.selectLabel) },
                { value: FORM_STEP2_VALUES.housingStatus.OWN, label: t(TRANSLATION_KEY.housingStatus_options.own, FORM_STEP2_FALLBACKS.fields.housingStatus.options.own) },
                { value: FORM_STEP2_VALUES.housingStatus.RENT, label: t(TRANSLATION_KEY.housingStatus_options.rent, FORM_STEP2_FALLBACKS.fields.housingStatus.options.rent) },
                { value: FORM_STEP2_VALUES.housingStatus.LIVING_WITH_FAMILY, label: t(TRANSLATION_KEY.housingStatus_options.living_with_family, FORM_STEP2_FALLBACKS.fields.housingStatus.options.livingWithFamily) },
                { value: FORM_STEP2_VALUES.housingStatus.HOMELESS, label: t(TRANSLATION_KEY.housingStatus_options.homeless, FORM_STEP2_FALLBACKS.fields.housingStatus.options.homeless) },
                { value: FORM_STEP2_VALUES.housingStatus.OTHER, label: t(TRANSLATION_KEY.housingStatus_options.other, FORM_STEP2_FALLBACKS.fields.housingStatus.options.other) },
              ]}
            />

            {/* Monthly Rent - Show if renting */}
            {housingStatus === FORM_STEP2_VALUES.housingStatus.RENT && (
              <ValidatedFormField
                name={FORM_STEP2_FIELD_NAMES.monthlyRent}
                control={control}
                label={t(TRANSLATION_KEY.monthlyRent, FORM_STEP2_FALLBACKS.fields.monthlyRent.label)}
                // helperText={t(TRANSLATION_KEY.monthlyRent_help, 'Your monthly rent payment')}
                type="number"
                required
              />
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Benefits Information Section */}
      <Card className={CARD_PADDING.DEFAULT}>
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t(TRANSLATION_KEY.benefits_section, FORM_STEP2_FALLBACKS.benefits.title)}
          </Card.Title>
          <Card.Description>
            {t(TRANSLATION_KEY.benefits_description, FORM_STEP2_FALLBACKS.benefits.description)}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className={SPACING.FIELD_GROUP}>
            {/* Receiving Benefits */}
            <ValidatedFormField
              name={FORM_STEP2_FIELD_NAMES.receivingBenefits}
              control={control}
              label={t(TRANSLATION_KEY.receivingBenefits, FORM_STEP2_FALLBACKS.fields.receivingBenefits.label)}
              // helperText={t(TRANSLATION_KEY.receivingBenefits_help, 'Are you currently receiving any form of government assistance?')}
              type="select"
              options={[
                { value: FORM_STEP2_VALUES.boolean.EMPTY, label: t(TRANSLATION_KEY.receivingBenefits_select, FORM_STEP2_FALLBACKS.fields.receivingBenefits.selectLabel) },
                { value: FORM_STEP2_VALUES.boolean.TRUE, label: t('common.yes', FORM_STEP2_FALLBACKS.common.yes) },
                { value: FORM_STEP2_VALUES.boolean.FALSE, label: t('common.no', FORM_STEP2_FALLBACKS.common.no) },
              ]}
            />

            {/* Benefit Types - Show if receiving benefits */}
            {isTruthy(receivingBenefits) && (
              <ValidatedFormField
                name={FORM_STEP2_FIELD_NAMES.benefitTypes}
                control={control}
                label={t(TRANSLATION_KEY.benefitTypes, FORM_STEP2_FALLBACKS.fields.benefitTypes.label)}
                // helperText={t(TRANSLATION_KEY.benefitTypes_help, 'Select all types of government benefits you currently receive')}
                type="checkbox-group"
                options={[
                  { value: FORM_STEP2_VALUES.benefitTypes.UNEMPLOYMENT, label: t(TRANSLATION_KEY.benefitTypes_options.unemployment, FORM_STEP2_FALLBACKS.fields.benefitTypes.options.unemployment) },
                  { value: FORM_STEP2_VALUES.benefitTypes.DISABILITY, label: t(TRANSLATION_KEY.benefitTypes_options.disability, FORM_STEP2_FALLBACKS.fields.benefitTypes.options.disability) },
                  { value: FORM_STEP2_VALUES.benefitTypes.HOUSING, label: t(TRANSLATION_KEY.benefitTypes_options.housing, FORM_STEP2_FALLBACKS.fields.benefitTypes.options.housing) },
                  { value: FORM_STEP2_VALUES.benefitTypes.FOOD, label: t(TRANSLATION_KEY.benefitTypes_options.food, FORM_STEP2_FALLBACKS.fields.benefitTypes.options.food) },
                  { value: FORM_STEP2_VALUES.benefitTypes.MEDICAL, label: t(TRANSLATION_KEY.benefitTypes_options.medical, FORM_STEP2_FALLBACKS.fields.benefitTypes.options.medical) },
                  { value: FORM_STEP2_VALUES.benefitTypes.ELDERLY, label: t(TRANSLATION_KEY.benefitTypes_options.elderly, FORM_STEP2_FALLBACKS.fields.benefitTypes.options.elderly) },
                  { value: FORM_STEP2_VALUES.benefitTypes.FAMILY, label: t(TRANSLATION_KEY.benefitTypes_options.family, FORM_STEP2_FALLBACKS.fields.benefitTypes.options.family) },
                  { value: FORM_STEP2_VALUES.benefitTypes.OTHER, label: t(TRANSLATION_KEY.benefitTypes_options.other, FORM_STEP2_FALLBACKS.fields.benefitTypes.options.other) },
                ]}
              />
            )}

            {/* Previously Applied */}
            <ValidatedFormField
              name={FORM_STEP2_FIELD_NAMES.previouslyApplied}
              control={control}
              label={t(TRANSLATION_KEY.previouslyApplied, FORM_STEP2_FALLBACKS.fields.previouslyApplied.label)}
              // helperText={t(TRANSLATION_KEY.previouslyApplied_help, 'Have you applied for social support from this program before?')}
              type="select"
              options={[
                { value: FORM_STEP2_VALUES.boolean.EMPTY, label: t(TRANSLATION_KEY.previouslyApplied_select, FORM_STEP2_FALLBACKS.fields.previouslyApplied.selectLabel) },
                { value: FORM_STEP2_VALUES.boolean.TRUE, label: t('common.yes', FORM_STEP2_FALLBACKS.common.yes) },
                { value: FORM_STEP2_VALUES.boolean.FALSE, label: t('common.no', FORM_STEP2_FALLBACKS.common.no) },
              ]}
            />
          </div>
        </Card.Content>
      </Card>

      {/* Financial Summary Notice */}
      <div className="border border-warning-border bg-warning-light rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-warning mt-0.5">
            <svg className={ICON_SIZE.DEFAULT} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-warning-foreground mb-1">
              {t(TRANSLATION_KEY.financial_notice_title, FORM_STEP2_FALLBACKS.notice.title)}
            </h4>
            <p className="text-sm text-warning-light-foreground">
              {t(TRANSLATION_KEY.financial_notice_text, FORM_STEP2_FALLBACKS.notice.text)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
