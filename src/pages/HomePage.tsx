import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Sparkles, Globe, Shield, Clock, Users } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import { HOME_PAGE_FALLBACKS } from '@/constants/homePage';
import { TRANSLATION_KEY } from '@/constants/internationalization';

export function HomePage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Sparkles,
      title: t(TRANSLATION_KEY.home.features.ai_assistance.title, HOME_PAGE_FALLBACKS.featuresSection.items.aiAssistance.title),
      description: t(TRANSLATION_KEY.home.features.ai_assistance.desc, HOME_PAGE_FALLBACKS.featuresSection.items.aiAssistance.description),
    },
    {
      icon: Globe,
      title: t(TRANSLATION_KEY.home.features.multilingual.title, HOME_PAGE_FALLBACKS.featuresSection.items.multilingual.title),
      description: t(TRANSLATION_KEY.home.features.multilingual.desc, HOME_PAGE_FALLBACKS.featuresSection.items.multilingual.description),
    },
    {
      icon: Shield,
      title: t(TRANSLATION_KEY.home.features.secure.title, HOME_PAGE_FALLBACKS.featuresSection.items.secure.title),
      description: t(TRANSLATION_KEY.home.features.secure.desc, HOME_PAGE_FALLBACKS.featuresSection.items.secure.description),
    },
    {
      icon: Clock,
      title: t(TRANSLATION_KEY.home.features.auto_save.title, HOME_PAGE_FALLBACKS.featuresSection.items.autoSave.title),
      description: t(TRANSLATION_KEY.home.features.auto_save.desc, HOME_PAGE_FALLBACKS.featuresSection.items.autoSave.description),
    },
    {
      icon: Users,
      title: t(TRANSLATION_KEY.home.features.accessible.title, HOME_PAGE_FALLBACKS.featuresSection.items.accessible.title),
      description: t(TRANSLATION_KEY.home.features.accessible.desc, HOME_PAGE_FALLBACKS.featuresSection.items.accessible.description),
    },
    {
      icon: FileText,
      title: t(TRANSLATION_KEY.home.features.guided.title, HOME_PAGE_FALLBACKS.featuresSection.items.guided.title),
      description: t(TRANSLATION_KEY.home.features.guided.desc, HOME_PAGE_FALLBACKS.featuresSection.items.guided.description),
    },
  ];

  return (
    <div className="w-full px-4 py-8 sm:px-6 md:py-12 lg:px-8 lg:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 lg:gap-24">
        {/* Hero Section */}
        <section className="mx-auto w-full max-w-3xl text-center">
          <h1 className="text-display-lg font-bold tracking-tight text-foreground sm:text-display-2xl">
            {t(TRANSLATION_KEY.home.hero.title, HOME_PAGE_FALLBACKS.hero.title)}
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            {t(TRANSLATION_KEY.home.hero.description, HOME_PAGE_FALLBACKS.hero.description)}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Button asChild size="lg">
              <Link to="/wizard">
                {t(TRANSLATION_KEY.home.hero.start_application, HOME_PAGE_FALLBACKS.hero.startApplication)}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/components">
                {t(TRANSLATION_KEY.home.hero.view_components, HOME_PAGE_FALLBACKS.hero.viewComponents)}
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full">
          <h2 className="mb-12 text-center text-display-md font-bold tracking-tight text-foreground">
            {t(TRANSLATION_KEY.home.features.title, HOME_PAGE_FALLBACKS.featuresSection.title)}
          </h2>
          <dl className="grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full p-6">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-relaxed text-foreground">
                  <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-relaxed text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </Card>
            ))}
          </dl>
        </section>

        {/* CTA Section */}
        <section className="mx-auto w-full max-w-3xl text-center">
          <Card className="border-primary/20 bg-primary/5 p-8">
            <h2 className="text-display-sm font-bold tracking-tight text-foreground">
              {t(TRANSLATION_KEY.home.cta.title, HOME_PAGE_FALLBACKS.cta.title)}
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
              {t(TRANSLATION_KEY.home.cta.description, HOME_PAGE_FALLBACKS.cta.description)}
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link to="/wizard">
                  {t(TRANSLATION_KEY.home.cta.button, HOME_PAGE_FALLBACKS.cta.button)}
                </Link>
              </Button>
            </div>
          </Card>
        </section>

        {/* Development Info */}
        {import.meta.env.DEV && (
          <section className="mx-auto w-full max-w-3xl">
            <Card className="bg-muted/50 p-6">
              <h3 className="mb-4 text-lg font-semibold">{HOME_PAGE_FALLBACKS.devInfo.title}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                {HOME_PAGE_FALLBACKS.devInfo.items.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
