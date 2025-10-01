import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    common: {
      navigation: {
        home: 'Home',
        about: 'About',
        contact: 'Contact',
      },
      language: {
        english: 'English',
        arabic: 'العربية',
        switch_to: 'Switch to {{language}}',
      },
      actions: {
        loading: 'Loading...',
        error: 'Error',
        retry: 'Retry',
        cancel: 'Cancel',
        submit: 'Submit',
        save: 'Save',
        close: 'Close',
      },
      header: {
        title: 'Social Support Portal',
        subtitle: 'Government Services',
      },
      welcome: {
        title: 'Welcome to Social Support Portal',
        subtitle: 'AI-powered assistance for your needs',
      },
    },
  },
  ar: {
    common: {
      navigation: {
        home: 'الرئيسية',
        about: 'حول',
        contact: 'اتصل',
      },
      language: {
        english: 'English',
        arabic: 'العربية',
        switch_to: 'التبديل إلى {{language}}',
      },
      actions: {
        loading: 'جاري التحميل...',
        error: 'خطأ',
        retry: 'إعادة المحاولة',
        cancel: 'إلغاء',
        submit: 'إرسال',
        save: 'حفظ',
        close: 'إغلاق',
      },
      header: {
        title: 'بوابة الدعم الاجتماعي',
        subtitle: 'الخدمات الحكومية',
      },
      welcome: {
        title: 'مرحباً بك في بوابة الدعم الاجتماعي',
        subtitle: 'مساعدة ذكية مدعومة بالذكاء الاصطناعي لاحتياجاتك',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en', // Set English as default
    debug: import.meta.env.DEV,

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'preferred-language',
    },

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Resource loading
    resources,

    // Namespace configuration
    ns: ['common'],
    defaultNS: 'common',
  });

export default i18n;
