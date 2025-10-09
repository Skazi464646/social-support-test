import { TRANSLATION_KEY } from "@/constants/internationalization";
import { AiAssistModalFooterProps } from "./AIAssistModal.types";
import { useTranslation } from "react-i18next";

export default function AiAssistModalFooter({onClose,acceptSuggestion,editedText,isValidLength}:AiAssistModalFooterProps) {
      const { t } = useTranslation(['common']);
    
    return (
        <div className="sticky bottom-0 border-t border-border px-5 py-1.5 sm:px-5 sm:py-2 bg-white shadow-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-border rounded-md text-text-primary hover:bg-muted transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
                    >
                        {t(TRANSLATION_KEY.aiModal.cancel, TRANSLATION_KEY.translation_values.cancel)}
                    </button>
                    <button
                        type="button"
                        onClick={acceptSuggestion}
                        disabled={!editedText.trim() || !isValidLength}
                        className="px-4 py-2 border border-primary rounded-md bg-primary text-primary-foreground hover:bg-primary-hover hover:border-primary-hover hover:shadow-gold-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none font-semibold w-full sm:w-auto shadow-sm"
                    >
                        {t(TRANSLATION_KEY.aiModal.use_this_text, TRANSLATION_KEY.translation_values.use_this_text)}
                    </button>
                </div>
            </div>
        </div>
    )
}
