import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ValidatedFormField, NumberFormField } from '@/components/molecules/ValidatedFormField';
import { Card } from '@/components/molecules/Card';
import type { Step2FormData } from '@/lib/validation/schemas';

// =============================================================================
// COMPONENT
// =============================================================================

export function FormStep2() {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<{ step2: Step2FormData }>();

  // Watch for conditional fields
  const employmentStatus = watch('step2.employmentStatus');
  const housingStatus = watch('step2.housingStatus');
  const receivingBenefits = watch('step2.receivingBenefits');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('form.step2.title', 'Financial Information')}
        </h2>
        <p className="text-muted-foreground">
          {t('form.step2.description', 'Please provide details about your financial situation and housing status.')}
        </p>
      </div>

      {/* Family Information Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('form.step2.family_section', 'Family Information')}
          </Card.Title>
          <Card.Description>
            {t('form.step2.family_description', 'Information about your family status')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Marital Status */}
            <ValidatedFormField
              name="step2.maritalStatus"
              control={control}
              label={t('form.step2.maritalStatus', 'Marital Status')}
              helperText={t('form.step2.maritalStatus_help', 'Your current marital status')}
              type="select"
              required
              options={[
                { value: '', label: t('form.step2.maritalStatus_select', 'Select marital status') },
                { value: 'single', label: t('form.step2.maritalStatus_options.single', 'Single') },
                { value: 'married', label: t('form.step2.maritalStatus_options.married', 'Married') },
                { value: 'divorced', label: t('form.step2.maritalStatus_options.divorced', 'Divorced') },
                { value: 'widowed', label: t('form.step2.maritalStatus_options.widowed', 'Widowed') },
                { value: 'separated', label: t('form.step2.maritalStatus_options.separated', 'Separated') },
              ]}
            />

            {/* Number of Dependents */}
            <NumberFormField
              name="step2.numberOfDependents"
              control={control}
              label={t('form.step2.numberOfDependents', 'Number of Dependents')}
              helperText={t('form.step2.numberOfDependents_help', 'Children or family members you financially support')}
              min={0}
              max={20}
              required
            />
          </div>
        </Card.Content>
      </Card>

      {/* Employment Information Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('form.step2.employment_section', 'Employment Information')}
          </Card.Title>
          <Card.Description>
            {t('form.step2.employment_description', 'Your current employment and income details')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employment Status */}
            <ValidatedFormField
              name="step2.employmentStatus"
              control={control}
              label={t('form.step2.employmentStatus', 'Employment Status')}
              helperText={t('form.step2.employmentStatus_help', 'Your current work situation')}
              type="select"
              required
              className="md:col-span-2"
              options={[
                { value: '', label: t('form.step2.employmentStatus_select', 'Select employment status') },
                { value: 'employed_full_time', label: t('form.step2.employmentStatus_options.employed', 'Employed (Full-time)') },
                { value: 'employed_part_time', label: t('form.step2.employmentStatus_options.part_time', 'Employed (Part-time)') },
                { value: 'self_employed', label: t('form.step2.employmentStatus_options.self_employed', 'Self-employed') },
                { value: 'unemployed', label: t('form.step2.employmentStatus_options.unemployed', 'Unemployed') },
                { value: 'retired', label: t('form.step2.employmentStatus_options.retired', 'Retired') },
                { value: 'student', label: t('form.step2.employmentStatus_options.student', 'Student') },
                { value: 'disabled', label: t('form.step2.employmentStatus_options.disabled', 'Unable to work (Disability)') },
              ]}
            />

            {/* Occupation - Show if employed or self-employed */}
            {(employmentStatus === 'employed_full_time' || employmentStatus === 'employed_part_time' || employmentStatus === 'self_employed') && (
              <ValidatedFormField
                name="step2.occupation"
                control={control}
                label={t('form.step2.occupation', 'Occupation')}
                placeholder={t('form.step2.occupation_placeholder', 'Enter your job title or profession')}
                helperText={t('form.step2.occupation_help', 'Your current job title or type of business')}
                required
              />
            )}

            {/* Employer - Show if employed */}
            {(employmentStatus === 'employed_full_time' || employmentStatus === 'employed_part_time') && (
              <ValidatedFormField
                name="step2.employer"
                control={control}
                label={t('form.step2.employer', 'Employer Name')}
                placeholder={t('form.step2.employer_placeholder', 'Enter your employer name')}
                helperText={t('form.step2.employer_help', 'The company or organization you work for')}
                required
              />
            )}

            {/* Monthly Income */}
            <NumberFormField
              name="step2.monthlyIncome"
              control={control}
              label={t('form.step2.monthlyIncome', 'Monthly Income (AED)')}
              helperText={t('form.step2.monthlyIncome_help', 'Your total monthly income from all sources')}
              min={0}
              max={1000000}
              step={100}
              required
            />

            {/* Monthly Expenses */}
            <NumberFormField
              name="step2.monthlyExpenses"
              control={control}
              label={t('form.step2.monthlyExpenses', 'Monthly Expenses (AED)')}
              helperText={t('form.step2.monthlyExpenses_help', 'Your total monthly living expenses')}
              min={0}
              max={1000000}
              step={100}
              required
            />

            {/* Total Savings */}
            <NumberFormField
              name="step2.totalSavings"
              control={control}
              label={t('form.step2.totalSavings', 'Total Savings (AED)')}
              helperText={t('form.step2.totalSavings_help', 'Your current savings and bank deposits')}
              min={0}
              max={10000000}
              step={500}
              required
            />

            {/* Total Debt */}
            <NumberFormField
              name="step2.totalDebt"
              control={control}
              label={t('form.step2.totalDebt', 'Total Debt (AED)')}
              helperText={t('form.step2.totalDebt_help', 'Your current total debt including loans and credit cards')}
              min={0}
              max={10000000}
              step={500}
              required
            />
          </div>
        </Card.Content>
      </Card>

      {/* Housing Information Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('form.step2.housing_section', 'Housing Information')}
          </Card.Title>
          <Card.Description>
            {t('form.step2.housing_description', 'Your current housing situation')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Housing Status */}
            <ValidatedFormField
              name="step2.housingStatus"
              control={control}
              label={t('form.step2.housingStatus', 'Housing Status')}
              helperText={t('form.step2.housingStatus_help', 'Your current housing arrangement')}
              type="select"
              required
              className="md:col-span-2"
              options={[
                { value: '', label: t('form.step2.housingStatus_select', 'Select housing status') },
                { value: 'own', label: t('form.step2.housingStatus_options.own', 'Own my home') },
                { value: 'rent', label: t('form.step2.housingStatus_options.rent', 'Rent') },
                { value: 'living_with_family', label: t('form.step2.housingStatus_options.living_with_family', 'Living with family/friends') },
                { value: 'homeless', label: t('form.step2.housingStatus_options.homeless', 'Homeless/Temporary shelter') },
                { value: 'other', label: t('form.step2.housingStatus_options.other', 'Other') },
              ]}
            />

            {/* Monthly Rent - Show if renting */}
            {housingStatus === 'rent' && (
              <NumberFormField
                name="step2.monthlyRent"
                control={control}
                label={t('form.step2.monthlyRent', 'Monthly Rent (AED)')}
                helperText={t('form.step2.monthlyRent_help', 'Your monthly rent payment')}
                min={0}
                max={50000}
                step={100}
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
            {t('form.step2.benefits_section', 'Government Benefits')}
          </Card.Title>
          <Card.Description>
            {t('form.step2.benefits_description', 'Information about any government assistance you receive')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="space-y-6">
            {/* Receiving Benefits */}
            <ValidatedFormField
              name="step2.receivingBenefits"
              control={control}
              label={t('form.step2.receivingBenefits', 'Currently Receiving Government Benefits')}
              helperText={t('form.step2.receivingBenefits_help', 'Are you currently receiving any form of government assistance?')}
              type="select"
              required
              options={[
                { value: '', label: t('form.step2.receivingBenefits_select', 'Select an option') },
                { value: 'true', label: t('common.yes', 'Yes') },
                { value: 'false', label: t('common.no', 'No') },
              ]}
            />

            {/* Benefit Types - Show if receiving benefits */}
            {receivingBenefits === true && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  {t('form.step2.benefitTypes', 'Types of Benefits Received')}
                  <span className="text-destructive ml-1">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: 'unemployment', label: t('form.step2.benefitTypes_options.unemployment', 'Unemployment Benefits') },
                    { value: 'disability', label: t('form.step2.benefitTypes_options.disability', 'Disability Benefits') },
                    { value: 'housing', label: t('form.step2.benefitTypes_options.housing', 'Housing Assistance') },
                    { value: 'food', label: t('form.step2.benefitTypes_options.food', 'Food Assistance') },
                    { value: 'medical', label: t('form.step2.benefitTypes_options.medical', 'Medical Assistance') },
                    { value: 'elderly', label: t('form.step2.benefitTypes_options.elderly', 'Elderly Support') },
                    { value: 'family', label: t('form.step2.benefitTypes_options.family', 'Family Support') },
                    { value: 'other', label: t('form.step2.benefitTypes_options.other', 'Other') },
                  ].map((benefit) => (
                    <label key={benefit.value} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        value={benefit.value}
                        className="rounded border-input text-primary focus:ring-ring focus:ring-2"
                      />
                      <span className="text-sm text-foreground">{benefit.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Previously Applied */}
            <ValidatedFormField
              name="step2.previouslyApplied"
              control={control}
              label={t('form.step2.previouslyApplied', 'Previously Applied for Social Support')}
              helperText={t('form.step2.previouslyApplied_help', 'Have you applied for social support from this program before?')}
              type="select"
              required
              options={[
                { value: '', label: t('form.step2.previouslyApplied_select', 'Select an option') },
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
              {t('form.step2.financial_notice_title', 'Financial Information')}
            </h4>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {t('form.step2.financial_notice_text', 'All financial information will be verified. Please ensure accuracy as false information may result in application rejection and potential legal consequences.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}