import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ValidatedFormField } from '@/components/molecules/ValidatedFormField';
import { Card } from '@/components/molecules/Card';
import { FORM_STEP2_FALLBACKS } from '@/constants/formStep2';
import type { Step2FormData } from '@/lib/validation/schemas';

// =============================================================================
// COMPONENT
// =============================================================================

export function FormStep2() {
  const { t } = useTranslation(['form', 'common', 'validation']);
  const { control, watch } = useFormContext<Step2FormData>();

  // Watch for conditional fields
  const employmentStatus = watch('employmentStatus');
  const housingStatus = watch('housingStatus');
  const receivingBenefits = watch('receivingBenefits');
  
  // Helper function to check boolean values that might be strings
  const isTruthy = (value: any) => value === true || value === 'true';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('step2.title', FORM_STEP2_FALLBACKS.header.title)}
        </h2>
        <p className="text-muted-foreground">
          {t('step2.description', FORM_STEP2_FALLBACKS.header.description)}
        </p>
      </div>

      {/* Family Information Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('family_section', FORM_STEP2_FALLBACKS.family.title)}
          </Card.Title>
          <Card.Description>
            {t('family_description', FORM_STEP2_FALLBACKS.family.description)}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Marital Status */}
            <ValidatedFormField
              name="maritalStatus"
              control={control}
              label={t('maritalStatus', FORM_STEP2_FALLBACKS.fields.maritalStatus.label)}
              // helperText={t('maritalStatus_help', 'Your current marital status')}
              type="select"
              required
              options={[
                { value: '', label: t('maritalStatus_select', FORM_STEP2_FALLBACKS.fields.maritalStatus.selectLabel) },
                { value: 'single', label: t('maritalStatus_options.single', FORM_STEP2_FALLBACKS.fields.maritalStatus.options.single) },
                { value: 'married', label: t('maritalStatus_options.married', FORM_STEP2_FALLBACKS.fields.maritalStatus.options.married) },
                { value: 'divorced', label: t('maritalStatus_options.divorced', FORM_STEP2_FALLBACKS.fields.maritalStatus.options.divorced) },
                { value: 'widowed', label: t('maritalStatus_options.widowed', FORM_STEP2_FALLBACKS.fields.maritalStatus.options.widowed) },
                { value: 'separated', label: t('maritalStatus_options.separated', FORM_STEP2_FALLBACKS.fields.maritalStatus.options.separated) },
              ]}
            />

            {/* Number of Dependents */}
            <ValidatedFormField
              name="numberOfDependents"
              control={control}
              label={t('numberOfDependents', FORM_STEP2_FALLBACKS.fields.numberOfDependents.label)}
              // helperText={t('numberOfDependents_help', 'Children or family members you financially support')}
              type="number"
              min={0}
              max={20}
              placeholder="0"
              required
            />
          </div>
        </Card.Content>
      </Card>

      {/* Employment Information Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('employment_section', FORM_STEP2_FALLBACKS.employment.title)}
          </Card.Title>
          <Card.Description>
            {t('employment_description', FORM_STEP2_FALLBACKS.employment.description)}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employment Status */}
            <ValidatedFormField
              name="employmentStatus"
              control={control}
              label={t('employmentStatus', FORM_STEP2_FALLBACKS.fields.employmentStatus.label)}
              // helperText={t('employmentStatus_help', 'Your current work situation')}
              type="select"
              required
              className="md:col-span-2"
              options={[
                { value: '', label: t('employmentStatus_select', FORM_STEP2_FALLBACKS.fields.employmentStatus.selectLabel) },
                { value: 'employed_full_time', label: t('employmentStatus_options.employed', FORM_STEP2_FALLBACKS.fields.employmentStatus.options.employedFullTime) },
                { value: 'employed_part_time', label: t('employmentStatus_options.part_time', FORM_STEP2_FALLBACKS.fields.employmentStatus.options.employedPartTime) },
                { value: 'self_employed', label: t('employmentStatus_options.self_employed', FORM_STEP2_FALLBACKS.fields.employmentStatus.options.selfEmployed) },
                { value: 'unemployed', label: t('employmentStatus_options.unemployed', FORM_STEP2_FALLBACKS.fields.employmentStatus.options.unemployed) },
                { value: 'retired', label: t('employmentStatus_options.retired', FORM_STEP2_FALLBACKS.fields.employmentStatus.options.retired) },
                { value: 'student', label: t('employmentStatus_options.student', FORM_STEP2_FALLBACKS.fields.employmentStatus.options.student) },
                { value: 'disabled', label: t('employmentStatus_options.disabled', FORM_STEP2_FALLBACKS.fields.employmentStatus.options.disabled) },
              ]}
            />

            {/* Occupation - Show if employed or self-employed */}
            {(employmentStatus === 'employed_full_time' || employmentStatus === 'employed_part_time' || employmentStatus === 'self_employed') && (
              <ValidatedFormField
                name="occupation"
                control={control}
                label={t('occupation', FORM_STEP2_FALLBACKS.fields.occupation.label)}
                placeholder={t('occupation_placeholder', FORM_STEP2_FALLBACKS.fields.occupation.placeholder)}
                // helperText={t('occupation_help', 'Your current job title or type of business')}
                required
              />
            )}

            {/* Employer - Show if employed */}
            {(employmentStatus === 'employed_full_time' || employmentStatus === 'employed_part_time') && (
              <ValidatedFormField
                name="employer"
                control={control}
                label={t('employer', FORM_STEP2_FALLBACKS.fields.employer.label)}
                placeholder={t('employer_placeholder', FORM_STEP2_FALLBACKS.fields.employer.placeholder)}
                // helperText={t('employer_help', 'The company or organization you work for')}
                required
              />
            )}

            {/* Monthly Income */}
            <ValidatedFormField
              name="monthlyIncome"
              control={control}
              label={t('monthlyIncome', FORM_STEP2_FALLBACKS.fields.monthlyIncome.label)}
              // helperText={t('monthlyIncome_help', 'Your total monthly income from all sources')}
              type="number"
              required
            />

            {/* Monthly Expenses */}
            <ValidatedFormField
              name="monthlyExpenses"
              control={control}
              label={t('monthlyExpenses', FORM_STEP2_FALLBACKS.fields.monthlyExpenses.label)}
              // helperText={t('monthlyExpenses_help', 'Your total monthly living expenses')}
              type="number"
              required
            />

            {/* Total Savings */}
            <ValidatedFormField
              name="totalSavings"
              control={control}
              label={t('totalSavings', FORM_STEP2_FALLBACKS.fields.totalSavings.label)}
              // helperText={t('totalSavings_help', 'Your current savings and bank deposits')}
              type="number"
              required
            />

            {/* Total Debt */}
            <ValidatedFormField
              name="totalDebt"
              control={control}
              label={t('totalDebt', FORM_STEP2_FALLBACKS.fields.totalDebt.label)}
              // helperText={t('totalDebt_help', 'Your current total debt including loans and credit cards')}
              type="number"
              required
            />
          </div>
        </Card.Content>
      </Card>

      {/* Housing Information Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('housing_section', FORM_STEP2_FALLBACKS.housing.title)}
          </Card.Title>
          <Card.Description>
            {t('housing_description', FORM_STEP2_FALLBACKS.housing.description)}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Housing Status */}
            <ValidatedFormField
              name="housingStatus"
              control={control}
              label={t('housingStatus', FORM_STEP2_FALLBACKS.fields.housingStatus.label)}
              // helperText={t('housingStatus_help', 'Your current housing arrangement')}
              type="select"
              required
              className="md:col-span-2"
              options={[
                { value: '', label: t('housingStatus_select', FORM_STEP2_FALLBACKS.fields.housingStatus.selectLabel) },
                { value: 'own', label: t('housingStatus_options.own', FORM_STEP2_FALLBACKS.fields.housingStatus.options.own) },
                { value: 'rent', label: t('housingStatus_options.rent', FORM_STEP2_FALLBACKS.fields.housingStatus.options.rent) },
                { value: 'living_with_family', label: t('housingStatus_options.living_with_family', FORM_STEP2_FALLBACKS.fields.housingStatus.options.livingWithFamily) },
                { value: 'homeless', label: t('housingStatus_options.homeless', FORM_STEP2_FALLBACKS.fields.housingStatus.options.homeless) },
                { value: 'other', label: t('housingStatus_options.other', FORM_STEP2_FALLBACKS.fields.housingStatus.options.other) },
              ]}
            />

            {/* Monthly Rent - Show if renting */}
            {housingStatus === 'rent' && (
              <ValidatedFormField
                name="monthlyRent"
                control={control}
                label={t('monthlyRent', FORM_STEP2_FALLBACKS.fields.monthlyRent.label)}
                // helperText={t('monthlyRent_help', 'Your monthly rent payment')}
                type="number"
                required
              />
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Benefits Information Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('benefits_section', FORM_STEP2_FALLBACKS.benefits.title)}
          </Card.Title>
          <Card.Description>
            {t('benefits_description', FORM_STEP2_FALLBACKS.benefits.description)}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="space-y-6">
            {/* Receiving Benefits */}
            <ValidatedFormField
              name="receivingBenefits"
              control={control}
              label={t('receivingBenefits', FORM_STEP2_FALLBACKS.fields.receivingBenefits.label)}
              // helperText={t('receivingBenefits_help', 'Are you currently receiving any form of government assistance?')}
              type="select"
              options={[
                { value: '', label: t('receivingBenefits_select', FORM_STEP2_FALLBACKS.fields.receivingBenefits.selectLabel) },
                { value: 'true', label: t('common.yes', FORM_STEP2_FALLBACKS.common.yes) },
                { value: 'false', label: t('common.no', FORM_STEP2_FALLBACKS.common.no) },
              ]}
            />

            {/* Benefit Types - Show if receiving benefits */}
            {isTruthy(receivingBenefits) && (
              <ValidatedFormField
                name="benefitTypes"
                control={control}
                label={t('benefitTypes', FORM_STEP2_FALLBACKS.fields.benefitTypes.label)}
                // helperText={t('benefitTypes_help', 'Select all types of government benefits you currently receive')}
                type="checkbox-group"
                options={[
                  { value: 'unemployment', label: t('benefitTypes_options.unemployment', FORM_STEP2_FALLBACKS.fields.benefitTypes.options.unemployment) },
                  { value: 'disability', label: t('benefitTypes_options.disability', FORM_STEP2_FALLBACKS.fields.benefitTypes.options.disability) },
                  { value: 'housing', label: t('benefitTypes_options.housing', FORM_STEP2_FALLBACKS.fields.benefitTypes.options.housing) },
                  { value: 'food', label: t('benefitTypes_options.food', FORM_STEP2_FALLBACKS.fields.benefitTypes.options.food) },
                  { value: 'medical', label: t('benefitTypes_options.medical', FORM_STEP2_FALLBACKS.fields.benefitTypes.options.medical) },
                  { value: 'elderly', label: t('benefitTypes_options.elderly', FORM_STEP2_FALLBACKS.fields.benefitTypes.options.elderly) },
                  { value: 'family', label: t('benefitTypes_options.family', FORM_STEP2_FALLBACKS.fields.benefitTypes.options.family) },
                  { value: 'other', label: t('benefitTypes_options.other', FORM_STEP2_FALLBACKS.fields.benefitTypes.options.other) },
                ]}
              />
            )}

            {/* Previously Applied */}
            <ValidatedFormField
              name="previouslyApplied"
              control={control}
              label={t('previouslyApplied', FORM_STEP2_FALLBACKS.fields.previouslyApplied.label)}
              // helperText={t('previouslyApplied_help', 'Have you applied for social support from this program before?')}
              type="select"
              options={[
                { value: '', label: t('previouslyApplied_select', FORM_STEP2_FALLBACKS.fields.previouslyApplied.selectLabel) },
                { value: 'true', label: t('common.yes', FORM_STEP2_FALLBACKS.common.yes) },
                { value: 'false', label: t('common.no', FORM_STEP2_FALLBACKS.common.no) },
              ]}
            />
          </div>
        </Card.Content>
      </Card>

      {/* Financial Summary Notice */}
      <div className="border border-warning-border bg-warning-light rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-warning mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-warning-foreground mb-1">
              {t('financial_notice_title', FORM_STEP2_FALLBACKS.notice.title)}
            </h4>
            <p className="text-sm text-warning-light-foreground">
              {t('financial_notice_text', FORM_STEP2_FALLBACKS.notice.text)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
