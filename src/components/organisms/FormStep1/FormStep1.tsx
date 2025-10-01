import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ValidatedFormField, EmailFormField, PhoneFormField, DateFormField } from '@/components/molecules/ValidatedFormField';
import { Card } from '@/components/molecules/Card';
import type { Step1FormData } from '@/lib/validation/schemas';

// =============================================================================
// COMPONENT
// =============================================================================

export function FormStep1() {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<{ step1: Step1FormData }>();

  // Watch for country selection to show conditional fields
  const selectedCountry = watch('step1.country');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('form.step1.title', 'Personal Information')}
        </h2>
        <p className="text-muted-foreground">
          {t('form.step1.description', 'Please provide your personal details for verification.')}
        </p>
      </div>

      {/* Personal Identity Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('form.step1.identity_section', 'Identity Information')}
          </Card.Title>
          <Card.Description>
            {t('form.step1.identity_description', 'Basic identification details')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <ValidatedFormField
              name="step1.fullName"
              control={control}
              label={t('form.step1.fullName', 'Full Name')}
              placeholder={t('form.step1.fullName_placeholder', 'Enter your full legal name')}
              helperText={t('form.step1.fullName_help', 'Enter your full name as it appears on your official ID')}
              required
              className="md:col-span-2"
            />

            {/* National ID */}
            <ValidatedFormField
              name="step1.nationalId"
              control={control}
              label={t('form.step1.nationalId', 'National ID')}
              placeholder={t('form.step1.nationalId_placeholder', 'Enter your 10-digit national ID')}
              helperText={t('form.step1.nationalId_help', 'Your official government-issued ID number')}
              maxLength={10}
              required
            />

            {/* Date of Birth */}
            <DateFormField
              name="step1.dateOfBirth"
              control={control}
              label={t('form.step1.dateOfBirth', 'Date of Birth')}
              helperText={t('form.step1.dateOfBirth_help', 'You must be at least 18 years old')}
              max={new Date().toISOString().split('T')[0]}
              required
            />

            {/* Gender */}
            <ValidatedFormField
              name="step1.gender"
              control={control}
              label={t('form.step1.gender', 'Gender')}
              helperText={t('form.step1.gender_help', 'Select your gender')}
              type="select"
              required
              options={[
                { value: '', label: t('form.step1.gender_select', 'Select gender') },
                { value: 'male', label: t('form.step1.gender_options.male', 'Male') },
                { value: 'female', label: t('form.step1.gender_options.female', 'Female') },
                { value: 'other', label: t('form.step1.gender_options.other', 'Other') },
                { value: 'prefer_not_to_say', label: t('form.step1.gender_options.prefer_not_to_say', 'Prefer not to say') },
              ]}
            />
          </div>
        </Card.Content>
      </Card>

      {/* Contact Information Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('form.step1.contact_section', 'Contact Information')}
          </Card.Title>
          <Card.Description>
            {t('form.step1.contact_description', 'How we can reach you')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <EmailFormField
              name="step1.email"
              control={control}
              label={t('form.step1.email', 'Email Address')}
              placeholder={t('form.step1.email_placeholder', 'your.email@example.com')}
              helperText={t('form.step1.email_help', 'We will send important updates to this email')}
              required
              className="md:col-span-2"
            />

            {/* Phone */}
            <PhoneFormField
              name="step1.phone"
              control={control}
              label={t('form.step1.phone', 'Phone Number')}
              placeholder={t('form.step1.phone_placeholder', '+971 50 123 4567')}
              helperText={t('form.step1.phone_help', 'Include country code for international numbers')}
              required
            />
          </div>
        </Card.Content>
      </Card>

      {/* Address Information Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('form.step1.address_section', 'Address Information')}
          </Card.Title>
          <Card.Description>
            {t('form.step1.address_description', 'Your current residential address')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Street Address */}
            <ValidatedFormField
              name="step1.address"
              control={control}
              label={t('form.step1.address', 'Street Address')}
              placeholder={t('form.step1.address_placeholder', 'Building name, street number, street name')}
              helperText={t('form.step1.address_help', 'Your complete street address')}
              required
              className="md:col-span-2 lg:col-span-3"
            />

            {/* City */}
            <ValidatedFormField
              name="step1.city"
              control={control}
              label={t('form.step1.city', 'City')}
              placeholder={t('form.step1.city_placeholder', 'Enter your city')}
              required
            />

            {/* State/Emirate */}
            <ValidatedFormField
              name="step1.state"
              control={control}
              label={t('form.step1.state', 'State/Emirate')}
              placeholder={t('form.step1.state_placeholder', 'Enter your state or emirate')}
              required
            />

            {/* Country */}
            <ValidatedFormField
              name="step1.country"
              control={control}
              label={t('form.step1.country', 'Country')}
              helperText={t('form.step1.country_help', 'Select your country of residence')}
              type="select"
              required
              options={[
                { value: '', label: t('form.step1.country_select', 'Select country') },
                { value: 'AE', label: t('countries.ae', 'United Arab Emirates') },
                { value: 'SA', label: t('countries.sa', 'Saudi Arabia') },
                { value: 'QA', label: t('countries.qa', 'Qatar') },
                { value: 'KW', label: t('countries.kw', 'Kuwait') },
                { value: 'BH', label: t('countries.bh', 'Bahrain') },
                { value: 'OM', label: t('countries.om', 'Oman') },
                { value: 'JO', label: t('countries.jo', 'Jordan') },
                { value: 'LB', label: t('countries.lb', 'Lebanon') },
                { value: 'EG', label: t('countries.eg', 'Egypt') },
                { value: 'OTHER', label: t('countries.other', 'Other') },
              ]}
            />

            {/* Postal Code - Show conditionally based on country */}
            {selectedCountry && selectedCountry !== 'AE' && (
              <ValidatedFormField
                name="step1.postalCode"
                control={control}
                label={t('form.step1.postalCode', 'Postal Code')}
                placeholder={t('form.step1.postalCode_placeholder', 'Enter postal code')}
                helperText={t('form.step1.postalCode_help', 'Optional for some countries')}
                className="lg:col-start-1"
              />
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Important Notice */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 dark:text-blue-400 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              {t('form.step1.notice_title', 'Important Information')}
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {t('form.step1.notice_text', 'Please ensure all information is accurate and matches your official documents. This information will be used for verification purposes.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}