import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ValidatedFormField } from '@/components/molecules/ValidatedFormField';
import { Card } from '@/components/molecules/Card';
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
          {t('step2.title', 'Financial Information')}
        </h2>
        <p className="text-muted-foreground">
          {t('step2.description', 'Please provide details about your financial situation and housing status.')}
        </p>
      </div>

      {/* Family Information Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('family_section', 'Family Information')}
          </Card.Title>
          <Card.Description>
            {t('family_description', 'Information about your family status')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Marital Status */}
            <ValidatedFormField
              name="maritalStatus"
              control={control}
              label={t('maritalStatus', 'Marital Status')}
              helperText={t('maritalStatus_help', 'Your current marital status')}
              type="select"
              required
              options={[
                { value: '', label: t('maritalStatus_select', 'Select marital status') },
                { value: 'single', label: t('maritalStatus_options.single', 'Single') },
                { value: 'married', label: t('maritalStatus_options.married', 'Married') },
                { value: 'divorced', label: t('maritalStatus_options.divorced', 'Divorced') },
                { value: 'widowed', label: t('maritalStatus_options.widowed', 'Widowed') },
                { value: 'separated', label: t('maritalStatus_options.separated', 'Separated') },
              ]}
            />

            {/* Number of Dependents */}
            <ValidatedFormField
              name="numberOfDependents"
              control={control}
              label={t('numberOfDependents', 'Number of Dependents')}
              helperText={t('numberOfDependents_help', 'Children or family members you financially support')}
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
            {t('employment_section', 'Employment Information')}
          </Card.Title>
          <Card.Description>
            {t('employment_description', 'Your current employment and income details')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employment Status */}
            <ValidatedFormField
              name="employmentStatus"
              control={control}
              label={t('employmentStatus', 'Employment Status')}
              helperText={t('employmentStatus_help', 'Your current work situation')}
              type="select"
              required
              className="md:col-span-2"
              options={[
                { value: '', label: t('employmentStatus_select', 'Select employment status') },
                { value: 'employed_full_time', label: t('employmentStatus_options.employed', 'Employed (Full-time)') },
                { value: 'employed_part_time', label: t('employmentStatus_options.part_time', 'Employed (Part-time)') },
                { value: 'self_employed', label: t('employmentStatus_options.self_employed', 'Self-employed') },
                { value: 'unemployed', label: t('employmentStatus_options.unemployed', 'Unemployed') },
                { value: 'retired', label: t('employmentStatus_options.retired', 'Retired') },
                { value: 'student', label: t('employmentStatus_options.student', 'Student') },
                { value: 'disabled', label: t('employmentStatus_options.disabled', 'Unable to work (Disability)') },
              ]}
            />

            {/* Occupation - Show if employed or self-employed */}
            {(employmentStatus === 'employed_full_time' || employmentStatus === 'employed_part_time' || employmentStatus === 'self_employed') && (
              <ValidatedFormField
                name="occupation"
                control={control}
                label={t('occupation', 'Occupation')}
                placeholder={t('occupation_placeholder', 'Enter your job title or profession')}
                helperText={t('occupation_help', 'Your current job title or type of business')}
                required
              />
            )}

            {/* Employer - Show if employed */}
            {(employmentStatus === 'employed_full_time' || employmentStatus === 'employed_part_time') && (
              <ValidatedFormField
                name="employer"
                control={control}
                label={t('employer', 'Employer Name')}
                placeholder={t('employer_placeholder', 'Enter your employer name')}
                helperText={t('employer_help', 'The company or organization you work for')}
                required
              />
            )}

            {/* Monthly Income */}
            <ValidatedFormField
              name="monthlyIncome"
              control={control}
              label={t('monthlyIncome', 'Monthly Income (AED)')}
              helperText={t('monthlyIncome_help', 'Your total monthly income from all sources')}
              type="number"
              required
            />

            {/* Monthly Expenses */}
            <ValidatedFormField
              name="monthlyExpenses"
              control={control}
              label={t('monthlyExpenses', 'Monthly Expenses (AED)')}
              helperText={t('monthlyExpenses_help', 'Your total monthly living expenses')}
              type="number"
              required
            />

            {/* Total Savings */}
            <ValidatedFormField
              name="totalSavings"
              control={control}
              label={t('totalSavings', 'Total Savings (AED)')}
              helperText={t('totalSavings_help', 'Your current savings and bank deposits')}
              type="number"
              required
            />

            {/* Total Debt */}
            <ValidatedFormField
              name="totalDebt"
              control={control}
              label={t('totalDebt', 'Total Debt (AED)')}
              helperText={t('totalDebt_help', 'Your current total debt including loans and credit cards')}
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
            {t('housing_section', 'Housing Information')}
          </Card.Title>
          <Card.Description>
            {t('housing_description', 'Your current housing situation')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Housing Status */}
            <ValidatedFormField
              name="housingStatus"
              control={control}
              label={t('housingStatus', 'Housing Status')}
              helperText={t('housingStatus_help', 'Your current housing arrangement')}
              type="select"
              required
              className="md:col-span-2"
              options={[
                { value: '', label: t('housingStatus_select', 'Select housing status') },
                { value: 'own', label: t('housingStatus_options.own', 'Own my home') },
                { value: 'rent', label: t('housingStatus_options.rent', 'Rent') },
                { value: 'living_with_family', label: t('housingStatus_options.living_with_family', 'Living with family/friends') },
                { value: 'homeless', label: t('housingStatus_options.homeless', 'Homeless/Temporary shelter') },
                { value: 'other', label: t('housingStatus_options.other', 'Other') },
              ]}
            />

            {/* Monthly Rent - Show if renting */}
            {housingStatus === 'rent' && (
              <ValidatedFormField
                name="monthlyRent"
                control={control}
                label={t('monthlyRent', 'Monthly Rent (AED)')}
                helperText={t('monthlyRent_help', 'Your monthly rent payment')}
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
            {t('benefits_section', 'Government Benefits')}
          </Card.Title>
          <Card.Description>
            {t('benefits_description', 'Information about any government assistance you receive')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="space-y-6">
            {/* Receiving Benefits */}
            <ValidatedFormField
              name="receivingBenefits"
              control={control}
              label={t('receivingBenefits', 'Currently Receiving Government Benefits')}
              helperText={t('receivingBenefits_help', 'Are you currently receiving any form of government assistance?')}
              type="select"
              required
              options={[
                { value: '', label: t('receivingBenefits_select', 'Select an option') },
                { value: 'true', label: t('common.yes', 'Yes') },
                { value: 'false', label: t('common.no', 'No') },
              ]}
            />

            {/* Benefit Types - Show if receiving benefits */}
            {isTruthy(receivingBenefits) && (
              <ValidatedFormField
                name="benefitTypes"
                control={control}
                label={t('benefitTypes', 'Types of Benefits Received')}
                helperText={t('benefitTypes_help', 'Select all types of government benefits you currently receive')}
                type="checkbox-group"
                required
                options={[
                  { value: 'unemployment', label: t('benefitTypes_options.unemployment', 'Unemployment Benefits') },
                  { value: 'disability', label: t('benefitTypes_options.disability', 'Disability Benefits') },
                  { value: 'housing', label: t('benefitTypes_options.housing', 'Housing Assistance') },
                  { value: 'food', label: t('benefitTypes_options.food', 'Food Assistance') },
                  { value: 'medical', label: t('benefitTypes_options.medical', 'Medical Assistance') },
                  { value: 'elderly', label: t('benefitTypes_options.elderly', 'Elderly Support') },
                  { value: 'family', label: t('benefitTypes_options.family', 'Family Support') },
                  { value: 'other', label: t('benefitTypes_options.other', 'Other') },
                ]}
              />
            )}

            {/* Previously Applied */}
            <ValidatedFormField
              name="previouslyApplied"
              control={control}
              label={t('previouslyApplied', 'Previously Applied for Social Support')}
              helperText={t('previouslyApplied_help', 'Have you applied for social support from this program before?')}
              type="select"
              required
              options={[
                { value: '', label: t('previouslyApplied_select', 'Select an option') },
                { value: 'true', label: t('common.yes', 'Yes') },
                { value: 'false', label: t('common.no', 'No') },
              ]}
            />
          </div>
        </Card.Content>
      </Card>

      {/* Financial Summary Notice */}
      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-amber-600 dark:text-amber-400 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
              {t('financial_notice_title', 'Financial Information')}
            </h4>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {t('financial_notice_text', 'All financial information will be verified. Please ensure accuracy as false information may result in application rejection and potential legal consequences.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}