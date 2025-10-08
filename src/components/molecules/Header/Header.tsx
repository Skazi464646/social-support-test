import { useTranslation } from 'react-i18next';


export function Header() {
    const { t } = useTranslation('form');
    return (
        <div className="mb-8" >
            <h1 className="text-3xl font-bold text-foreground mb-2" >
                {t('title')}
            </h1>
            < p className="text-muted-foreground" >
                {t('description')}
            </p>
        </div>
    )
}
