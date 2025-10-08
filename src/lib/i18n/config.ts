import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import IntervalPlural from 'i18next-intervalplural-postprocessor';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export type SupportedLanguage = 'en' | 'ar';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  locale: string;
}

// =============================================================================
// LANGUAGE CONFIGURATION
// =============================================================================

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    locale: 'en-US',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    locale: 'ar-AE', // UAE Arabic as government context
  },
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const DEFAULT_NAMESPACE = 'common';

// =============================================================================
// PLURALIZATION RULES
// =============================================================================

/**
 * Arabic pluralization rules following Arabic grammar
 * Arabic has 6 forms: zero, one, two, few, many, other
 */
const arabicPluralRule = (count: number, ordinal: boolean): string => {
  if (ordinal) return 'other';
  
  const mod100 = count % 100;
  
  if (count === 0) return 'zero';
  if (count === 1) return 'one';
  if (count === 2) return 'two';
  if (count >= 3 && count <= 10) return 'few';
  if (mod100 >= 11 && mod100 <= 99) return 'many';
  return 'other';
};

// English uses default i18next pluralization rules (one vs other)

// Note: Pluralization rules will be added after i18n initialization

// =============================================================================
// NAMESPACE CONFIGURATION
// =============================================================================

export const NAMESPACES = [
  'common',      // Common UI elements, buttons, etc.
  'navigation',  // Navigation, menu items
  'form',        // Form-related translations
  'validation',  // Validation messages
  'ai',          // AI assistance related
  'errors',      // Error messages
  'success',     // Success messages
  'admin'        // Admin interface (future)
] as const;

export type Namespace = typeof NAMESPACES[number];

// =============================================================================
// RESOURCE LOADER (Dynamic Import Support)
// =============================================================================

/**
 * Lazy load a specific namespace for a language
 */
export const loadNamespace = async (language: SupportedLanguage, namespace: Namespace): Promise<any> => {
  try {
    const response = await fetch(`/locales/${language}/${namespace}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${language}/${namespace}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return {};
  }
};

/**
 * Load initial core namespaces (common, navigation, form, validation)
 */
const loadCoreResources = async (): Promise<any> => {
  try {
    const coreNamespaces = ['common', 'navigation', 'form', 'validation'] as const;
    
    
    
    // Load core namespaces for both languages
    const loadPromises = [];
    for (const lang of ['en', 'ar'] as const) {
      for (const ns of coreNamespaces) {
        loadPromises.push(
          loadNamespace(lang, ns).then(data => ({ lang, ns, data }))
        );
      }
    }
    
    const results = await Promise.all(loadPromises);
    
    // Organize results by language and namespace
    const resources: any = { en: {}, ar: {} };
    results.forEach(({ lang, ns, data }) => {
      resources[lang][ns] = data;
    });
    
    return resources;
  } catch (error) {
    
    
    // Enhanced fallback with namespaced resources (including form and validation)
    return {
      en: {
        form: {
          step1: {
            title: "Personal Information",
            description: "Please provide your personal details and contact information."
          },
          step2: {
            title: "Financial Information",
            description: "Please provide details about your financial situation and housing status."
          },
          step3: {
            title: "Detailed Information",
            description: "Please provide detailed information about your situation to help us better understand your needs."
          },
          fullName: "Full Name",
          fullName_placeholder: "Enter your full legal name",
          fullName_help: "Enter your full legal name as it appears on your official ID",
          nationalId: "National ID",
          nationalId_placeholder: "Enter your 10-digit National ID",
          nationalId_help: "Your Emirates ID or National ID number (10 digits)",
          dateOfBirth: "Date of Birth",
          dateOfBirth_help: "You must be at least 18 years old to apply",
          gender: "Gender",
          gender_help: "Your gender as it appears on official documents",
          gender_select: "Select your gender",
          gender_options: {
            male: "Male",
            female: "Female",
            other: "Other",
            prefer_not_to_say: "Prefer not to say"
          },
          email: "Email Address",
          email_placeholder: "Enter your email address",
          email_help: "We'll use this email to contact you about your application",
          phone: "Phone Number",
          phone_placeholder: "Enter your phone number",
          phone_help: "Include country code (e.g., +971 for UAE)",
          address: "Address",
          address_placeholder: "Enter your full address",
          address_help: "Your current residential address",
          city: "City",
          city_placeholder: "Enter your city",
          state: "State/Emirate",
          state_placeholder: "Enter your state or emirate",
          country: "Country",
          country_help: "Your country of residence",
          country_select: "Select your country",
          postalCode: "Postal Code",
          postalCode_placeholder: "Enter postal code",
          identity_section: "Identity Information",
          identity_description: "Basic identification details",
          contact_section: "Contact Information",
          contact_description: "How we can reach you",
          address_section: "Address Information",
          address_description: "Your current location details",
          notice_title: "Important Information",
          notice_text: "Please ensure all information is accurate and matches your official documents. This information will be used for verification purposes.",
          
          // Step 2 - Financial Information
          family_section: "Family Information",
          family_description: "Information about your family status",
          maritalStatus: "Marital Status",
          maritalStatus_help: "Your current marital status",
          maritalStatus_select: "Select marital status",
          maritalStatus_options: {
            single: "Single",
            married: "Married",
            divorced: "Divorced",
            widowed: "Widowed",
            separated: "Separated"
          },
          numberOfDependents: "Number of Dependents",
          numberOfDependents_help: "Children or family members you financially support",
          
          employment_section: "Employment Information",
          employment_description: "Your current employment and income details",
          employmentStatus: "Employment Status",
          employmentStatus_help: "Your current work situation",
          employmentStatus_select: "Select employment status",
          employmentStatus_options: {
            employed: "Employed (Full-time)",
            part_time: "Employed (Part-time)",
            self_employed: "Self-employed",
            unemployed: "Unemployed",
            retired: "Retired",
            student: "Student",
            disabled: "Unable to work (Disability)"
          },
          occupation: "Occupation",
          occupation_placeholder: "Enter your job title or profession",
          occupation_help: "Your current job title or type of business",
          employer: "Employer Name",
          employer_placeholder: "Enter your employer name",
          employer_help: "The company or organization you work for",
          monthlyIncome: "Monthly Income (AED)",
          monthlyIncome_help: "Your total monthly income from all sources",
          monthlyExpenses: "Monthly Expenses (AED)",
          monthlyExpenses_help: "Your total monthly living expenses",
          totalSavings: "Total Savings (AED)",
          totalSavings_help: "Your current savings and bank deposits",
          totalDebt: "Total Debt (AED)",
          totalDebt_help: "Your current total debt including loans and credit cards",
          
          housing_section: "Housing Information",
          housing_description: "Your current housing situation",
          housingStatus: "Housing Status",
          housingStatus_help: "Your current housing arrangement",
          housingStatus_select: "Select housing status",
          housingStatus_options: {
            own: "Own my home",
            rent: "Rent",
            living_with_family: "Living with family/friends",
            homeless: "Homeless/Temporary shelter",
            other: "Other"
          },
          monthlyRent: "Monthly Rent (AED)",
          monthlyRent_help: "Your monthly rent payment",
          
          benefits_section: "Government Benefits",
          benefits_description: "Information about any government assistance you receive",
          receivingBenefits: "Currently Receiving Government Benefits",
          receivingBenefits_help: "Are you currently receiving any form of government assistance?",
          receivingBenefits_select: "Select an option",
          benefitTypes: "Types of Benefits Received",
          benefitTypes_help: "Select all types of government benefits you currently receive",
          benefitTypes_options: {
            unemployment: "Unemployment Benefits",
            disability: "Disability Benefits",
            housing: "Housing Assistance",
            food: "Food Assistance",
            medical: "Medical Assistance",
            elderly: "Elderly Support",
            family: "Family Support",
            other: "Other"
          },
          previouslyApplied: "Previously Applied for Social Support",
          previouslyApplied_help: "Have you applied for social support from this program before?",
          previouslyApplied_select: "Select an option",
          financial_notice_title: "Financial Information",
          financial_notice_text: "All financial information will be verified. Please ensure accuracy as false information may result in application rejection and potential legal consequences.",
          
          // Step 3 - Detailed Information
          financial_section: "Financial Situation",
          financial_description: "Describe your current financial challenges and circumstances",
          financialSituation: "Describe Your Financial Situation",
          financialSituation_help: "Please describe your current financial challenges, including specific difficulties you are facing. Minimum 50 characters required.",
          financialSituation_placeholder: "Example: I am facing difficulty paying rent due to reduced income after losing my job. My savings are depleted and I have outstanding bills that I cannot afford...",
          
          employmentCircumstances: "Describe Your Employment Circumstances",
          employmentCircumstances_help: "Please explain your current work situation, including any recent changes, challenges in finding employment, or barriers you face. Minimum 50 characters required.",
          employmentCircumstances_placeholder: "Example: I was employed as a retail associate for 3 years but was laid off due to company downsizing. I have been actively searching for employment for 6 months but have faced challenges due to limited opportunities in my field...",
          
          reason_section: "Reason for Applying",
          reason_description: "Explain why you are seeking social support and how it will help you",
          reasonForApplying: "Why Are You Applying for Social Support?",
          reasonForApplying_help: "Please explain why you need social support, what specific assistance you are seeking, and how this support will help improve your situation. Minimum 50 characters required.",
          reasonForApplying_placeholder: "Example: I am applying for social support to help cover basic living expenses including rent, utilities, and groceries while I search for stable employment. This assistance would provide me with the stability I need to focus on job searching and skills development...",
          
          additional_section: "Additional Information",
          additional_description: "Any additional information you would like to share (optional)",
          additionalComments: "Additional Comments",
          additionalComments_help: "Share any other relevant information that might help us understand your situation better. This field is optional.",
          additionalComments_placeholder: "Any additional information about your circumstances, family situation, health issues, or other factors that might be relevant to your application...",
          
          consent_section: "Terms and Consent",
          consent_description: "Please review and agree to the following terms",
          agreeToTerms: "I agree to the terms and conditions",
          agreeToTerms_help: "By checking this box, you confirm that all information provided is true and accurate to the best of your knowledge.",
          consentToDataProcessing: "I consent to data processing",
          consentToDataProcessing_help: "You consent to the processing of your personal data for the purpose of evaluating your social support application.",
          allowContactForClarification: "Allow contact for clarification",
          allowContactForClarification_help: "You give permission to be contacted if additional information or clarification is needed for your application.",
          final_notice_title: "Application Review",
          final_notice_text: "Your application will be reviewed by our support team. We may contact you if additional information is needed. Processing typically takes 5-10 business days.",
          
          // General form messages
          title: "Social Support Application",
          description: "Complete this form to apply for social support assistance",
          step_completed: "Step Completed",
          step_saved_successfully: "Step saved successfully",
          error: "Error",
          step_save_error: "Failed to save step data",
          submission_success: "Application Submitted Successfully",
          submission_success_message: "Your application has been submitted with ID: {{applicationId}}",
          application_id: "Application ID",
          confirmation_email_sent: "A confirmation email has been sent to your registered email address",
          auto_saved: "Auto-saved",
        },
        validation: {
          required: "This field is required",
          name: {
            too_short: "Name must be at least 2 characters",
            too_long: "Name must not exceed 100 characters",
            invalid_format: "Name can only contain letters, spaces, hyphens, and apostrophes"
          },
          email: {
            invalid: "Please enter a valid email address"
          },
          financialSituation: {
            too_short: "Please provide at least 50 characters describing your financial situation"
          },
          employmentCircumstances: {
            too_short: "Please provide at least 50 characters describing your employment circumstances"
          },
          reasonForApplying: {
            too_short: "Please provide at least 50 characters explaining why you are applying"
          },
          invalid_string_min: "Must be at least {{minimum}} characters",
          invalid_string_max: "Must not exceed {{maximum}} characters"
        },
        common: {
          language: { 
            english: 'English', 
            arabic: 'العربية', 
            switch_to: 'Switch to {{language}}',
            current: 'Current language: {{language}}'
          },
          actions: { 
            loading: 'Loading...', 
            error: 'Error', 
            retry: 'Retry', 
            cancel: 'Cancel', 
            submit: 'Submit', 
            save: 'Save', 
            close: 'Close', 
            back: 'Back', 
            next: 'Next',
            accept: 'Accept',
            edit: 'Edit',
            discard: 'Discard'
          },
          common: {
            yes: 'Yes',
            no: 'No'
          },
          progress: {
            status_current: 'Current step',
            status_complete: 'Completed step',
            status_upcoming: 'Upcoming step',
            step_indicator: 'Step {{step}} of {{total}} – {{status}}',
            step_label: 'Step {{step}}',
            nav_label: 'Application progress'
          },
          status: {
            success: 'Success',
            failed: 'Failed',
            pending: 'Pending',
            complete: 'Complete'
          },
          plurals: {
            item_zero: 'No items',
            item_one: '{{count}} item',
            item_other: '{{count}} items',
            file_zero: 'No files',
            file_one: '{{count}} file', 
            file_other: '{{count}} files',
            step_one: 'Step {{count}}',
            step_other: 'Step {{count}}'
          },
          countries: {
            ae: 'United Arab Emirates',
            sa: 'Saudi Arabia',
            qa: 'Qatar',
            kw: 'Kuwait',
            bh: 'Bahrain',
            om: 'Oman',
            jo: 'Jordan',
            lb: 'Lebanon',
            eg: 'Egypt',
            other: 'Other'
          }
        },
        navigation: {
          home: 'Home',
          about: 'About', 
          contact: 'Contact',
          wizard: 'Application Form',
          components: 'Components',
          step1: 'Personal Information',
          step2: 'Financial Information', 
          step3: 'Situation Description'
        }
      },
      ar: {
        form: {
          step1: {
            title: "المعلومات الشخصية",
            description: "يرجى تقديم بياناتك الشخصية ومعلومات الاتصال."
          },
          step2: {
            title: "المعلومات المالية",
            description: "يرجى تقديم تفاصيل حول وضعك المالي وحالة السكن."
          },
          step3: {
            title: "معلومات مفصلة",
            description: "يرجى تقديم معلومات مفصلة حول وضعك لمساعدتنا على فهم احتياجاتك بشكل أفضل."
          },
          fullName: "الاسم الكامل",
          fullName_placeholder: "أدخل اسمك القانوني الكامل",
          fullName_help: "أدخل اسمك القانوني الكامل كما يظهر في هويتك الرسمية",
          nationalId: "رقم الهوية الوطنية",
          nationalId_placeholder: "أدخل رقم الهوية الوطنية المكون من 10 أرقام",
          nationalId_help: "رقم الهوية الإماراتية أو الهوية الوطنية (10 أرقام)",
          dateOfBirth: "تاريخ الميلاد",
          dateOfBirth_help: "يجب أن تكون 18 سنة على الأقل للتقدم بالطلب",
          gender: "الجنس",
          gender_help: "جنسك كما يظهر في الوثائق الرسمية",
          gender_select: "اختر جنسك",
          gender_options: {
            male: "ذكر",
            female: "أنثى",
            other: "آخر",
            prefer_not_to_say: "أفضل عدم الإفصاح"
          },
          email: "عنوان البريد الإلكتروني",
          email_placeholder: "أدخل عنوان بريدك الإلكتروني",
          email_help: "سنستخدم هذا البريد الإلكتروني للتواصل معك بشأن طلبك",
          phone: "رقم الهاتف",
          phone_placeholder: "أدخل رقم هاتفك",
          phone_help: "أدرج رمز البلد (مثال: +971 للإمارات)",
          address: "العنوان",
          address_placeholder: "أدخل عنوانك الكامل",
          address_help: "عنوان إقامتك الحالي",
          city: "المدينة",
          city_placeholder: "أدخل مدينتك",
          state: "الولاية/الإمارة",
          state_placeholder: "أدخل ولايتك أو إمارتك",
          country: "البلد",
          country_help: "بلد إقامتك",
          country_select: "اختر بلدك",
          postalCode: "الرمز البريدي",
          postalCode_placeholder: "أدخل الرمز البريدي",
          identity_section: "معلومات الهوية",
          identity_description: "تفاصيل الهوية الأساسية",
          contact_section: "معلومات الاتصال",
          contact_description: "كيف يمكننا التواصل معك",
          address_section: "معلومات العنوان",
          address_description: "تفاصيل موقعك الحالي",
          notice_title: "معلومات مهمة",
          notice_text: "يرجى التأكد من أن جميع المعلومات دقيقة وتتطابق مع وثائقك الرسمية. سيتم استخدام هذه المعلومات لأغراض التحقق.",
          
          // Step 2 - Financial Information
          family_section: "معلومات العائلة",
          family_description: "معلومات حول حالتك العائلية",
          maritalStatus: "الحالة الاجتماعية",
          maritalStatus_help: "حالتك الاجتماعية الحالية",
          maritalStatus_select: "اختر الحالة الاجتماعية",
          maritalStatus_options: {
            single: "أعزب/عزباء",
            married: "متزوج/متزوجة",
            divorced: "مطلق/مطلقة",
            widowed: "أرمل/أرملة",
            separated: "منفصل/منفصلة"
          },
          numberOfDependents: "عدد المعالين",
          numberOfDependents_help: "الأطفال أو أفراد الأسرة الذين تعولهم مالياً",
          
          employment_section: "معلومات العمل",
          employment_description: "تفاصيل وضعك الوظيفي والدخل الحالي",
          employmentStatus: "حالة العمل",
          employmentStatus_help: "وضعك الوظيفي الحالي",
          employmentStatus_select: "اختر حالة العمل",
          employmentStatus_options: {
            employed: "موظف (دوام كامل)",
            part_time: "موظف (دوام جزئي)",
            self_employed: "عمل حر",
            unemployed: "عاطل عن العمل",
            retired: "متقاعد",
            student: "طالب",
            disabled: "غير قادر على العمل (إعاقة)"
          },
          occupation: "المهنة",
          occupation_placeholder: "أدخل مسمى وظيفتك أو مهنتك",
          occupation_help: "مسمى وظيفتك الحالي أو نوع عملك",
          employer: "اسم جهة العمل",
          employer_placeholder: "أدخل اسم جهة عملك",
          employer_help: "الشركة أو المؤسسة التي تعمل بها",
          monthlyIncome: "الدخل الشهري (درهم)",
          monthlyIncome_help: "إجمالي دخلك الشهري من جميع المصادر",
          monthlyExpenses: "المصروفات الشهرية (درهم)",
          monthlyExpenses_help: "إجمالي مصروفات المعيشة الشهرية",
          totalSavings: "إجمالي المدخرات (درهم)",
          totalSavings_help: "مدخراتك الحالية والودائع البنكية",
          totalDebt: "إجمالي الديون (درهم)",
          totalDebt_help: "إجمالي ديونك الحالية بما في ذلك القروض وبطاقات الائتمان",
          
          housing_section: "معلومات السكن",
          housing_description: "وضعك السكني الحالي",
          housingStatus: "حالة السكن",
          housingStatus_help: "ترتيب السكن الحالي",
          housingStatus_select: "اختر حالة السكن",
          housingStatus_options: {
            own: "أملك منزلي",
            rent: "أستأجر",
            living_with_family: "أعيش مع العائلة/الأصدقاء",
            homeless: "بلا مأوى/مأوى مؤقت",
            other: "أخرى"
          },
          monthlyRent: "الإيجار الشهري (درهم)",
          monthlyRent_help: "دفعة الإيجار الشهرية",
          
          benefits_section: "الإعانات الحكومية",
          benefits_description: "معلومات حول أي مساعدة حكومية تتلقاها",
          receivingBenefits: "أتلقى حالياً إعانات حكومية",
          receivingBenefits_help: "هل تتلقى حالياً أي شكل من أشكال المساعدة الحكومية؟",
          receivingBenefits_select: "اختر خياراً",
          benefitTypes: "أنواع الإعانات المستلمة",
          benefitTypes_help: "اختر جميع أنواع الإعانات الحكومية التي تتلقاها حالياً",
          benefitTypes_options: {
            unemployment: "إعانة البطالة",
            disability: "إعانة الإعاقة",
            housing: "مساعدة السكن",
            food: "مساعدة غذائية",
            medical: "مساعدة طبية",
            elderly: "دعم كبار السن",
            family: "دعم الأسرة",
            other: "أخرى"
          },
          previouslyApplied: "تقدمت سابقاً للحصول على الدعم الاجتماعي",
          previouslyApplied_help: "هل تقدمت للحصول على دعم اجتماعي من هذا البرنامج من قبل؟",
          previouslyApplied_select: "اختر خياراً",
          financial_notice_title: "المعلومات المالية",
          financial_notice_text: "سيتم التحقق من جميع المعلومات المالية. يرجى التأكد من الدقة حيث أن المعلومات الخاطئة قد تؤدي إلى رفض الطلب وعواقب قانونية محتملة.",
          
          // Step 3 - Detailed Information
          financial_section: "الوضع المالي",
          financial_description: "اوصف التحديات والظروف المالية الحالية",
          financialSituation: "اوصف وضعك المالي",
          financialSituation_help: "يرجى وصف التحديات المالية الحالية، بما في ذلك الصعوبات المحددة التي تواجهها. مطلوب 50 حرفاً كحد أدنى.",
          financialSituation_placeholder: "مثال: أواجه صعوبة في دفع الإيجار بسبب انخفاض الدخل بعد فقدان وظيفتي. نفدت مدخراتي ولدي فواتير معلقة لا أستطيع تحملها...",
          
          employmentCircumstances: "اوصف ظروف عملك",
          employmentCircumstances_help: "يرجى توضيح وضع عملك الحالي، بما في ذلك أي تغييرات حديثة أو تحديات في العثور على عمل أو العوائق التي تواجهها. مطلوب 50 حرفاً كحد أدنى.",
          employmentCircumstances_placeholder: "مثال: كنت أعمل كمندوب مبيعات لمدة 3 سنوات ولكن تم تسريحي بسبب تقليص الشركة. أبحث بنشاط عن عمل لمدة 6 أشهر ولكن واجهت تحديات بسبب محدودية الفرص في مجالي...",
          
          reason_section: "سبب التقديم",
          reason_description: "اشرح لماذا تسعى للحصول على الدعم الاجتماعي وكيف سيساعدك",
          reasonForApplying: "لماذا تتقدم للحصول على الدعم الاجتماعي؟",
          reasonForApplying_help: "يرجى توضيح سبب حاجتك للدعم الاجتماعي، وما هي المساعدة المحددة التي تسعى إليها، وكيف سيساعد هذا الدعم في تحسين وضعك. مطلوب 50 حرفاً كحد أدنى.",
          reasonForApplying_placeholder: "مثال: أتقدم للحصول على الدعم الاجتماعي للمساعدة في تغطية نفقات المعيشة الأساسية بما في ذلك الإيجار والمرافق والبقالة أثناء بحثي عن عمل مستقر. ستوفر لي هذه المساعدة الاستقرار الذي أحتاجه للتركيز على البحث عن عمل وتطوير المهارات...",
          
          additional_section: "معلومات إضافية",
          additional_description: "أي معلومات إضافية تود مشاركتها (اختياري)",
          additionalComments: "تعليقات إضافية",
          additionalComments_help: "شارك أي معلومات أخرى ذات صلة قد تساعدنا على فهم وضعك بشكل أفضل. هذا الحقل اختياري.",
          additionalComments_placeholder: "أي معلومات إضافية حول ظروفك أو وضع الأسرة أو المشاكل الصحية أو عوامل أخرى قد تكون ذات صلة بطلبك...",
          
          consent_section: "الشروط والموافقة",
          consent_description: "يرجى مراجعة الشروط التالية والموافقة عليها",
          agreeToTerms: "أوافق على الشروط والأحكام",
          agreeToTerms_help: "بوضع علامة في هذا المربع، تؤكد أن جميع المعلومات المقدمة صحيحة ودقيقة على حد علمك.",
          consentToDataProcessing: "أوافق على معالجة البيانات",
          consentToDataProcessing_help: "أنت توافق على معالجة بياناتك الشخصية لغرض تقييم طلب الدعم الاجتماعي الخاص بك.",
          allowContactForClarification: "السماح بالاتصال للتوضيح",
          allowContactForClarification_help: "تمنح الإذن بالاتصال بك إذا كانت هناك حاجة لمعلومات إضافية أو توضيح لطلبك.",
          final_notice_title: "مراجعة الطلب",
          final_notice_text: "سيتم مراجعة طلبك من قبل فريق الدعم لدينا. قد نتواصل معك إذا كانت هناك حاجة لمعلومات إضافية. تستغرق المعالجة عادة 5-10 أيام عمل.",
          
          // General form messages
          title: "طلب الدعم الاجتماعي",
          description: "أكمل هذا النموذج للتقدم بطلب للحصول على مساعدة الدعم الاجتماعي",
          step_completed: "تم إكمال الخطوة",
          step_saved_successfully: "تم حفظ الخطوة بنجاح",
          error: "خطأ",
          step_save_error: "فشل في حفظ بيانات الخطوة",
          submission_success: "تم إرسال الطلب بنجاح",
          submission_success_message: "تم إرسال طلبك برقم: {{applicationId}}",
          application_id: "رقم الطلب",
          confirmation_email_sent: "تم إرسال رسالة تأكيد إلى عنوان بريدك الإلكتروني المسجل",
          auto_saved: "حفظ تلقائي"
        },
        validation: {
          required: "هذا الحقل مطلوب",
          name: {
            too_short: "يجب أن يكون الاسم 2 أحرف على الأقل",
            too_long: "يجب ألا يتجاوز الاسم 100 حرف",
            invalid_format: "يمكن أن يحتوي الاسم على أحرف ومسافات وشرطات وفواصل عليا فقط"
          },
          email: {
            invalid: "يرجى إدخال عنوان بريد إلكتروني صحيح"
          },
          financialSituation: {
            too_short: "يرجى تقديم 50 حرفاً على الأقل لوصف وضعك المالي"
          },
          employmentCircumstances: {
            too_short: "يرجى تقديم 50 حرفاً على الأقل لوصف ظروف عملك"
          },
          reasonForApplying: {
            too_short: "يرجى تقديم 50 حرفاً على الأقل لتوضيح سبب تقديم الطلب"
          },
          invalid_string_min: "يجب أن يكون {{minimum}} أحرف على الأقل",
          invalid_string_max: "يجب ألا يتجاوز {{maximum}} حرف"
        },
        common: {
          language: { 
            english: 'English', 
            arabic: 'العربية', 
            switch_to: 'التبديل إلى {{language}}',
            current: 'اللغة الحالية: {{language}}'
          },
          actions: { 
            loading: 'جاري التحميل...', 
            error: 'خطأ', 
            retry: 'إعادة المحاولة', 
            cancel: 'إلغاء', 
            submit: 'إرسال', 
            save: 'حفظ', 
            close: 'إغلاق', 
            back: 'السابق', 
            next: 'التالي',
            accept: 'قبول',
            edit: 'تحرير',
            discard: 'تجاهل'
          },
          common: {
            yes: 'نعم',
            no: 'لا'
          },
          progress: {
            status_current: 'الخطوة الحالية',
            status_complete: 'خطوة مكتملة',
            status_upcoming: 'خطوة قادمة',
            step_indicator: 'الخطوة {{step}} من {{total}} – {{status}}',
            step_label: 'الخطوة {{step}}',
            nav_label: 'تقدم الطلب'
          },
          status: {
            success: 'نجح',
            failed: 'فشل',
            pending: 'في الانتظار',
            complete: 'مكتمل'
          },
          plurals: {
            item_zero: 'لا توجد عناصر',
            item_one: 'عنصر واحد',
            item_two: 'عنصران',
            item_few: '{{count}} عناصر',
            item_many: '{{count}} عنصراً',
            item_other: '{{count}} عنصر',
            file_zero: 'لا توجد ملفات',
            file_one: 'ملف واحد',
            file_two: 'ملفان',
            file_few: '{{count}} ملفات',
            file_many: '{{count}} ملفاً',
            file_other: '{{count}} ملف',
            step_one: 'الخطوة {{count}}',
            step_other: 'الخطوة {{count}}'
          },
          countries: {
            ae: 'دولة الإمارات العربية المتحدة',
            sa: 'المملكة العربية السعودية',
            qa: 'دولة قطر',
            kw: 'دولة الكويت',
            bh: 'مملكة البحرين',
            om: 'سلطنة عمان',
            jo: 'المملكة الأردنية الهاشمية',
            lb: 'الجمهورية اللبنانية',
            eg: 'جمهورية مصر العربية',
            other: 'أخرى'
          },
          toast:{
           step_completed:"الترجمة: اكتملت الخطوة",
           step_saved_successfully:"الترجمة: تم حفظ الخطوة بنجاح"
          }
        },
        navigation: {
          home: 'الرئيسية',
          about: 'حول', 
          contact: 'اتصل',
          wizard: 'نموذج الطلب',
          components: 'المكونات',
          step1: 'المعلومات الشخصية',
          step2: 'المعلومات المالية',
          step3: 'وصف الحالة'
        }
      },
    };
  }
};

// =============================================================================
// ENHANCED LANGUAGE DETECTION
// =============================================================================

// Future enhancement: Custom language detector with advanced detection logic
// Currently using simpler browser detection via i18next-browser-languagedetector

// =============================================================================
// I18N INITIALIZATION
// =============================================================================

export const initializeI18n = async (): Promise<typeof i18n> => {
  try {
    // Load translation resources
    const resources = await loadCoreResources();

    // Enhanced initialization with pluralization and namespaces
    const initOptions = {
      fallbackLng: DEFAULT_LANGUAGE,
      lng: DEFAULT_LANGUAGE,
      supportedLngs: ['en', 'ar'],
      debug: import.meta.env.DEV,
      
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18n-language',
        lookupFromPathIndex: 0,
        lookupFromSubdomainIndex: 0,
        checkWhitelist: true,
      },

      interpolation: {
        escapeValue: false,
        formatSeparator: ',',
      },

      // Pluralization support
      pluralSeparator: '_',
      keySeparator: '.',
      nsSeparator: ':',

      resources,
      ns: ['common', 'navigation', 'form', 'validation'],
      defaultNS: DEFAULT_NAMESPACE,
    };

    await i18n
      .use(IntervalPlural)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init(initOptions);
      
    


    // Add Arabic pluralization rules after initialization
    try {
      if (i18n.services?.pluralResolver && !i18n.services.pluralResolver.getRule('ar')) {
        i18n.services.pluralResolver.addRule('ar', {
          numbers: [0, 1, 2, 3, 11],
          plurals: arabicPluralRule
        });
      }
    } catch (error) {
      console.warn('Failed to add Arabic pluralization rules:', error);
    }

    // Set up language change handler
    i18n.on('languageChanged', (lng: string) => {
      localStorage.setItem('i18n-language', lng);
      document.documentElement.lang = lng;
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    });

    // Set initial document attributes
    const currentLang = i18n.language || 'en';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    return i18n;
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    
    // Minimal fallback
    await i18n.init({
      fallbackLng: 'en',
      lng: 'en',
      resources: {
        en: { common: { loading: 'Loading...' } },
        ar: { common: { loading: 'جاري التحميل...' } }
      },
      interpolation: { escapeValue: false },
    });
    
    return i18n;
  }
};

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Get language configuration for a specific language code
 */
export const getLanguageConfig = (code: string): LanguageConfig | null => {
  return SUPPORTED_LANGUAGES[code as SupportedLanguage] || null;
};

/**
 * Get current language configuration
 */
export const getCurrentLanguageConfig = (): LanguageConfig => {
  const currentLang = i18n.language as SupportedLanguage;
  return SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE];
};

/**
 * Check if a language code is supported
 */
export const isLanguageSupported = (code: string): code is SupportedLanguage => {
  return code in SUPPORTED_LANGUAGES;
};

/**
 * Get all supported languages as array
 */
export const getSupportedLanguages = (): LanguageConfig[] => {
  return Object.values(SUPPORTED_LANGUAGES);
};

/**
 * Format number according to current locale
 */
export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
  const config = getCurrentLanguageConfig();
  return new Intl.NumberFormat(config.locale, options).format(value);
};

/**
 * Format date according to current locale
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const config = getCurrentLanguageConfig();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(config.locale, options).format(dateObj);
};

/**
 * Format currency according to current locale
 */
export const formatCurrency = (amount: number, currency?: string): string => {
  const config = getCurrentLanguageConfig();
  const currencyCode = currency || (config.code === 'ar' ? 'AED' : 'USD');
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

export default i18n;