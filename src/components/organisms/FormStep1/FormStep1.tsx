import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ValidatedFormField } from '@/components/molecules/ValidatedFormField';
import { Card } from '@/components/molecules/Card';
import { FormStepHeader } from '@/components/molecules/FormStepHeader';
import { FORM_STEP1_FALLBACKS, FORM_STEP1_FIELD_NAMES, FORM_STEP1_VALUES } from '@/constants/formStep1';
import type { Step1FormData } from '@/lib/validation/schemas';
import { TRANSLATION_KEY } from '@/constants/internationalization';
import { CARD_PADDING, GRID_LAYOUTS, SPACING, ICON_SIZE } from '@/constants/ui';

// =============================================================================
// COMPONENT
// =============================================================================

export function FormStep1() {
  const { t } = useTranslation(['form', 'common', 'validation']);
  const { control, watch } = useFormContext<Step1FormData>();

  

  // Watch for country selection to show conditional fields
  const selectedCountry = watch(FORM_STEP1_FIELD_NAMES.country);
  
  return (
    <div className={SPACING.SECTION}>
      {/* Header */}
      <FormStepHeader
        titleKey={TRANSLATION_KEY.step1.title}
        descriptionKey={TRANSLATION_KEY.step1.description}
        fallbacks={FORM_STEP1_FALLBACKS.header}
      />

      {/* Personal Identity Section */}
      <Card className={CARD_PADDING.DEFAULT}>
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t(TRANSLATION_KEY.identity_section, FORM_STEP1_FALLBACKS.identity.title)}
          </Card.Title>
          <Card.Description>
            {t(TRANSLATION_KEY.identity_description, FORM_STEP1_FALLBACKS.identity.description)}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className={GRID_LAYOUTS.TWO_COLUMNS}>
            {/* Full Name */}
            <ValidatedFormField
              name={FORM_STEP1_FIELD_NAMES.fullName}
              control={control}
              label={t(TRANSLATION_KEY.fullName, FORM_STEP1_FALLBACKS.fields.fullName.label)}
              placeholder={t(TRANSLATION_KEY.fullName_placeholder, FORM_STEP1_FALLBACKS.fields.fullName.placeholder)}
              required
              className="md:col-span-2"
            />

            {/* National ID */}
            <ValidatedFormField
              name={FORM_STEP1_FIELD_NAMES.nationalId}
              control={control}
              label={t(TRANSLATION_KEY.nationalId, FORM_STEP1_FALLBACKS.fields.nationalId.label)}
              placeholder={t(TRANSLATION_KEY.nationalId_placeholder, FORM_STEP1_FALLBACKS.fields.nationalId.placeholder)}
              maxLength={10}
              required
            />

            {/* Date of Birth */}
            <ValidatedFormField
              name={FORM_STEP1_FIELD_NAMES.dateOfBirth}
              control={control}
              label={t(TRANSLATION_KEY.dateOfBirth, FORM_STEP1_FALLBACKS.fields.dateOfBirth.label)}
              type="date"
              required
            />

            {/* Gender */}
            <ValidatedFormField
              name={FORM_STEP1_FIELD_NAMES.gender}
              control={control}
              label={t(TRANSLATION_KEY.gender, FORM_STEP1_FALLBACKS.fields.gender.label)}
              type="select"
              required
              options={[
                { value: FORM_STEP1_VALUES.gender.EMPTY, label: t(TRANSLATION_KEY.gender_select, FORM_STEP1_FALLBACKS.fields.gender.selectLabel) },
                { value: FORM_STEP1_VALUES.gender.MALE, label: t(TRANSLATION_KEY.gender_options.male, FORM_STEP1_FALLBACKS.fields.gender.options.male) },
                { value: FORM_STEP1_VALUES.gender.FEMALE, label: t(TRANSLATION_KEY.gender_options.female, FORM_STEP1_FALLBACKS.fields.gender.options.female) },
                { value: FORM_STEP1_VALUES.gender.OTHER, label: t(TRANSLATION_KEY.gender_options.other, FORM_STEP1_FALLBACKS.fields.gender.options.other) },
                { value: FORM_STEP1_VALUES.gender.PREFER_NOT_TO_SAY, label: t(TRANSLATION_KEY.gender_options.prefer_not_to_say, FORM_STEP1_FALLBACKS.fields.gender.options.preferNotToSay) },
              ]}
            />
          </div>
        </Card.Content>
      </Card>

      {/* Contact Information Section */}
      <Card className={CARD_PADDING.DEFAULT}>
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t(TRANSLATION_KEY.contact_section, FORM_STEP1_FALLBACKS.contact.title)}
          </Card.Title>
          <Card.Description>
            {t(TRANSLATION_KEY.contact_description, FORM_STEP1_FALLBACKS.contact.description)}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className={GRID_LAYOUTS.TWO_COLUMNS}>
            {/* Email */}
            <ValidatedFormField
              name={FORM_STEP1_FIELD_NAMES.email}
              control={control}
              label={t(TRANSLATION_KEY.email, FORM_STEP1_FALLBACKS.fields.email.label)}
              placeholder={t(TRANSLATION_KEY.email_placeholder, FORM_STEP1_FALLBACKS.fields.email.placeholder)}
              type="email"
              required
              className={GRID_LAYOUTS.FULL_WIDTH_IN_GRID}
            />

            {/* Phone */}
            <ValidatedFormField
              name={FORM_STEP1_FIELD_NAMES.phone}
              control={control}
              label={t(TRANSLATION_KEY.phone, FORM_STEP1_FALLBACKS.fields.phone.label)}
              placeholder={t(TRANSLATION_KEY.phone_placeholder, FORM_STEP1_FALLBACKS.fields.phone.placeholder)}
              type="tel"
              required
            />
          </div>
        </Card.Content>
      </Card>

      {/* Address Information Section */}
      <Card className={CARD_PADDING.DEFAULT}>
        <Card.Header>
          <Card.Title className="text-lg font-semibold">
            {t(TRANSLATION_KEY.address_section, FORM_STEP1_FALLBACKS.address.title)}
          </Card.Title>
          <Card.Description>
            {t(TRANSLATION_KEY.address_description, FORM_STEP1_FALLBACKS.address.description)}
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Street Address */}
            <ValidatedFormField
              name={FORM_STEP1_FIELD_NAMES.address}
              control={control}
              label={t(TRANSLATION_KEY.address, FORM_STEP1_FALLBACKS.fields.streetAddress.label)}
              placeholder={t(TRANSLATION_KEY.address_placeholder, FORM_STEP1_FALLBACKS.fields.streetAddress.placeholder)}
              required
              className="md:col-span-2 lg:col-span-3"
            />

            {/* City */}
            <ValidatedFormField
              name={FORM_STEP1_FIELD_NAMES.city}
              control={control}
              label={t(TRANSLATION_KEY.city, FORM_STEP1_FALLBACKS.fields.city.label)}
              placeholder={t(TRANSLATION_KEY.city_placeholder, FORM_STEP1_FALLBACKS.fields.city.placeholder)}
              required
            />

            {/* State/Emirate */}
            <ValidatedFormField
              name={FORM_STEP1_FIELD_NAMES.state}
              control={control}
              label={t(TRANSLATION_KEY.state, FORM_STEP1_FALLBACKS.fields.state.label)}
              placeholder={t(TRANSLATION_KEY.state_placeholder, FORM_STEP1_FALLBACKS.fields.state.placeholder)}
              required
            />

            {/* Country */}
            <ValidatedFormField
              name={FORM_STEP1_FIELD_NAMES.country}
              control={control}
              label={t(TRANSLATION_KEY.country, FORM_STEP1_FALLBACKS.fields.country.label)}
              type="select"
              required
              options={[
                { value: FORM_STEP1_VALUES.country.EMPTY, label: t(TRANSLATION_KEY.country_select, FORM_STEP1_FALLBACKS.fields.country.selectLabel) },
                { value: FORM_STEP1_VALUES.country.AE, label: t('common:countries.ae', FORM_STEP1_FALLBACKS.countries.AE) },
                { value: FORM_STEP1_VALUES.country.SA, label: t('common:countries.sa', FORM_STEP1_FALLBACKS.countries.SA) },
                { value: FORM_STEP1_VALUES.country.QA, label: t('common:countries.qa', FORM_STEP1_FALLBACKS.countries.QA) },
                { value: FORM_STEP1_VALUES.country.KW, label: t('common:countries.kw', FORM_STEP1_FALLBACKS.countries.KW) },
                { value: FORM_STEP1_VALUES.country.BH, label: t('common:countries.bh', FORM_STEP1_FALLBACKS.countries.BH) },
                { value: FORM_STEP1_VALUES.country.OM, label: t('common:countries.om', FORM_STEP1_FALLBACKS.countries.OM) },
                { value: FORM_STEP1_VALUES.country.JO, label: t('common:countries.jo', FORM_STEP1_FALLBACKS.countries.JO) },
                { value: FORM_STEP1_VALUES.country.LB, label: t('common:countries.lb', FORM_STEP1_FALLBACKS.countries.LB) },
                { value: FORM_STEP1_VALUES.country.EG, label: t('common:countries.eg', FORM_STEP1_FALLBACKS.countries.EG) },
                { value: FORM_STEP1_VALUES.country.OTHER, label: t('common:countries.other', FORM_STEP1_FALLBACKS.countries.OTHER) },
              ]}
            />

            {/* Postal Code - Show conditionally based on country */}
            {selectedCountry && selectedCountry !== FORM_STEP1_VALUES.country.AE && (
              <ValidatedFormField
                name={FORM_STEP1_FIELD_NAMES.postalCode}
                control={control}
                label={t(TRANSLATION_KEY.postalCode, FORM_STEP1_FALLBACKS.fields.postalCode.label)}
                placeholder={t(TRANSLATION_KEY.postalCode_placeholder, FORM_STEP1_FALLBACKS.fields.postalCode.placeholder)}
                className="lg:col-start-1"
              />
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Important Notice */}
      <div className="border border-info-border bg-info-light rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-info mt-0.5">
            <svg className={ICON_SIZE.DEFAULT} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-info-foreground mb-1">
              {t(TRANSLATION_KEY.notice_title, FORM_STEP1_FALLBACKS.notice.title)}
            </h4>
            <p className="text-sm text-info-light-foreground">
              {t(TRANSLATION_KEY.notice_text, FORM_STEP1_FALLBACKS.notice.text)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
