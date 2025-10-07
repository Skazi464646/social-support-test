import { useTranslation } from 'react-i18next';
import { Globe, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import type { LanguageSwitcherProps } from './LanguageSwitcher.types';

export function LanguageSwitcher({ 
  className = '', 
  showLabel = true, 
  variant = 'button' 
}: LanguageSwitcherProps) {
  const { t } = useTranslation();
  const { 
    currentConfig, 
    getOtherLanguage, 
    toggleLanguage, 
    isChanging 
  } = useLanguage();

  const otherLanguage = getOtherLanguage();

  const handleLanguageChange = async () => {
    if (isChanging) return;
    await toggleLanguage();
  };

  const buttonContent = (
    <>
      {isChanging ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Globe className="h-4 w-4" />
      )}
      {showLabel && (
        <span className="hidden sm:inline">
          {currentConfig.nativeName}
        </span>
      )}
    </>
  );

  if (variant === 'dropdown') {
    // Future: Can be enhanced with a proper dropdown
    return (
      <div className="relative">
        <button
          onClick={handleLanguageChange}
          disabled={isChanging}
          className={cn(
            'inline-flex items-center gap-2 ps-3 pe-3 py-2',
            'text-sm font-medium text-foreground/70',
            'hover:bg-primary/15 hover:text-primary hover:shadow-gold-sm hover:scale-105 hover:border-primary/40',
            'rounded-md transition-all duration-300 border border-primary/20 bg-primary/5',
            'focus-visible:outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:scale-105',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          aria-label={t('language.switch_to', {
            language: otherLanguage.nativeName,
          })}
          title={t('language.switch_to', { 
            language: otherLanguage.nativeName 
          })}
        >
          {buttonContent}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLanguageChange}
      disabled={isChanging}
      className={cn(
        'inline-flex items-center gap-2 ps-3 pe-3 py-2',
        'text-sm font-medium text-foreground/70',
        'hover:bg-primary/15 hover:text-primary hover:shadow-gold-sm hover:scale-105 hover:border-primary/40',
        'rounded-md transition-all duration-300 border border-primary/20 bg-primary/5',
        'focus-visible:outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:scale-105',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'group relative',
        className
      )}
      aria-label={t('language.switch_to', {
        language: otherLanguage.nativeName,
      })}
      title={t('language.switch_to', { 
        language: otherLanguage.nativeName 
      })}
      aria-busy={isChanging}
    >
      {buttonContent}
      
      {/* Tooltip for better UX */}
      <span className="absolute -top-10 start-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs ps-2 pe-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {t('language.switch_to', { language: otherLanguage.nativeName })}
      </span>
    </button>
  );
}
