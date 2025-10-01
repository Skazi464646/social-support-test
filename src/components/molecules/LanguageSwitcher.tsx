import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', nativeName: t('language.english') },
    { code: 'ar', name: 'Arabic', nativeName: t('language.arabic') },
  ];

  const resolvedLanguage = i18n.resolvedLanguage ?? i18n.language ?? 'en';
  const normalizedLanguage = resolvedLanguage.split('-')[0];

  const currentLanguage =
    languages.find((lang) => lang.code === normalizedLanguage) ?? languages[0];
  const otherLanguage =
    languages.find((lang) => lang.code !== currentLanguage?.code) ??
    currentLanguage;

  const handleLanguageChange = async () => {
    const newLang = otherLanguage?.code;
    await i18n.changeLanguage(newLang);

    // Update document direction for RTL support
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang || 'en';
  };

  return (
    <button
      onClick={handleLanguageChange}
      className={`
        inline-flex items-center gap-2 px-3 py-2 
        text-sm font-medium text-foreground 
        hover:bg-accent hover:text-accent-foreground 
        rounded-md transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${className}
      `}
      aria-label={t('language.switch_to', {
        language: otherLanguage?.nativeName,
      })}
      title={t('language.switch_to', { language: otherLanguage?.nativeName })}
    >
      <Globe className="h-4 w-4" />
      <span>{currentLanguage?.nativeName}</span>
    </button>
  );
}
