import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ValidatedFormField } from '@/components/molecules/ValidatedFormField';
import { Card } from '@/components/molecules/Card';
import type { Step1FormData } from '@/lib/validation/schemas';

// =============================================================================
// COMPONENT
// =============================================================================

export function FormStep1() {
  const { t, i18n } = useTranslation(['form', 'common', 'validation']);
  const { control, watch } = useFormContext<Step1FormData>();

  // Debug logging
  console.log('[FormStep1] Current language:', i18n.language);
  console.log('[FormStep1] Available resources:', i18n.hasResourceBundle(i18n.language, 'form'));
  console.log('[FormStep1] Test translation - fullName:', t('fullName', 'DEBUG_FALLBACK'));
  console.log('[FormStep1] Form namespace available:', i18n.getResourceBundle(i18n.language, 'form'));

  // Watch for country selection to show conditional fields
  const selectedCountry = watch('country');
  // throw new Error();
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('step1.title', 'Personal Information')}
        </h2>
        <p className="text-muted-foreground">
          {t('step1.description', 'Please provide your personal details for verification.')}
        </p>
      </div>

      {/* Personal Identity Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('identity_section', 'Identity Information')}
          </Card.Title>
          <Card.Description>
            {t('identity_description', 'Basic identification details')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <ValidatedFormField
              name="fullName"
              control={control}
              label={t('fullName', 'Full Name')}
              placeholder={t('fullName_placeholder', 'Enter your full legal name')}
              helperText={t('fullName_help', 'Enter your full name as it appears on your official ID')}
              required
              className="md:col-span-2"
            />

            {/* National ID */}
            <ValidatedFormField
              name="nationalId"
              control={control}
              label={t('nationalId', 'National ID')}
              placeholder={t('nationalId_placeholder', 'Enter your 10-digit national ID')}
              helperText={t('nationalId_help', 'Your official government-issued ID number')}
              maxLength={10}
              required
            />

            {/* Date of Birth */}
            <ValidatedFormField
              name="dateOfBirth"
              control={control}
              label={t('dateOfBirth', 'Date of Birth')}
              helperText={t('dateOfBirth_help', 'You must be at least 18 years old')}
              type="date"
              required
            />

            {/* Gender */}
            <ValidatedFormField
              name="gender"
              control={control}
              label={t('gender', 'Gender')}
              helperText={t('gender_help', 'Select your gender')}
              type="select"
              required
              options={[
                { value: '', label: t('gender_select', 'Select gender') },
                { value: 'male', label: t('gender_options.male', 'Male') },
                { value: 'female', label: t('gender_options.female', 'Female') },
                { value: 'other', label: t('gender_options.other', 'Other') },
                { value: 'prefer_not_to_say', label: t('gender_options.prefer_not_to_say', 'Prefer not to say') },
              ]}
            />
          </div>
        </Card.Content>
      </Card>

      {/* Contact Information Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('contact_section', 'Contact Information')}
          </Card.Title>
          <Card.Description>
            {t('contact_description', 'How we can reach you')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <ValidatedFormField
              name="email"
              control={control}
              label={t('email', 'Email Address')}
              placeholder={t('email_placeholder', 'your.email@example.com')}
              helperText={t('email_help', 'We will send important updates to this email')}
              type="email"
              required
              className="md:col-span-2"
            />

            {/* Phone */}
            <ValidatedFormField
              name="phone"
              control={control}
              label={t('phone', 'Phone Number')}
              placeholder={t('phone_placeholder', '+971 50 123 4567')}
              helperText={t('phone_help', 'Include country code for international numbers')}
              type="tel"
              required
            />
          </div>
        </Card.Content>
      </Card>

      {/* Address Information Section */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t('address_section', 'Address Information')}
          </Card.Title>
          <Card.Description>
            {t('address_description', 'Your current residential address')}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Street Address */}
            <ValidatedFormField
              name="address"
              control={control}
              label={t('address', 'Street Address')}
              placeholder={t('address_placeholder', 'Building name, street number, street name')}
              helperText={t('address_help', 'Your complete street address')}
              required
              className="md:col-span-2 lg:col-span-3"
            />

            {/* City */}
            <ValidatedFormField
              name="city"
              control={control}
              label={t('city', 'City')}
              placeholder={t('city_placeholder', 'Enter your city')}
              required
            />

            {/* State/Emirate */}
            <ValidatedFormField
              name="state"
              control={control}
              label={t('state', 'State/Emirate')}
              placeholder={t('state_placeholder', 'Enter your state or emirate')}
              required
            />

            {/* Country */}
            <ValidatedFormField
              name="country"
              control={control}
              label={t('country', 'Country')}
              helperText={t('country_help', 'Select your country of residence')}
              type="select"
              required
              options={[
                { value: '', label: t('country_select', 'Select country') },
                { value: 'AE', label: t('common:countries.ae', 'United Arab Emirates') },
                { value: 'SA', label: t('common:countries.sa', 'Saudi Arabia') },
                { value: 'QA', label: t('common:countries.qa', 'Qatar') },
                { value: 'KW', label: t('common:countries.kw', 'Kuwait') },
                { value: 'BH', label: t('common:countries.bh', 'Bahrain') },
                { value: 'OM', label: t('common:countries.om', 'Oman') },
                { value: 'JO', label: t('common:countries.jo', 'Jordan') },
                { value: 'LB', label: t('common:countries.lb', 'Lebanon') },
                { value: 'EG', label: t('common:countries.eg', 'Egypt') },
                { value: 'OTHER', label: t('common:countries.other', 'Other') },
              ]}
            />

            {/* Postal Code - Show conditionally based on country */}
            {selectedCountry && selectedCountry !== 'AE' && (
              <ValidatedFormField
                name="postalCode"
                control={control}
                label={t('postalCode', 'Postal Code')}
                placeholder={t('postalCode_placeholder', 'Enter postal code')}
                helperText={t('postalCode_help', 'Optional for some countries')}
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
              {t('notice_title', 'Important Information')}
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {t('notice_text', 'Please ensure all information is accurate and matches your official documents. This information will be used for verification purposes.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}