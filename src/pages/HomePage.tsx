import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Sparkles, Globe, Shield, Clock, Users } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';

export function HomePage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Sparkles,
      title: t('home.features.ai_assistance.title', 'AI-Powered Writing Assistance'),
      description: t('home.features.ai_assistance.desc', 'Get intelligent suggestions to help you complete your application with confidence.'),
    },
    {
      icon: Globe,
      title: t('home.features.multilingual.title', 'Multilingual Support'),
      description: t('home.features.multilingual.desc', 'Available in English and Arabic with full RTL support.'),
    },
    {
      icon: Shield,
      title: t('home.features.secure.title', 'Secure & Private'),
      description: t('home.features.secure.desc', 'Your data is protected with enterprise-grade security measures.'),
    },
    {
      icon: Clock,
      title: t('home.features.auto_save.title', 'Auto-Save Progress'),
      description: t('home.features.auto_save.desc', 'Never lose your progress with automatic form saving.'),
    },
    {
      icon: Users,
      title: t('home.features.accessible.title', 'Accessible Design'),
      description: t('home.features.accessible.desc', 'Built with accessibility standards for all users.'),
    },
    {
      icon: FileText,
      title: t('home.features.guided.title', 'Guided Process'),
      description: t('home.features.guided.desc', 'Step-by-step wizard to guide you through the application.'),
    },
  ];

  return (
    <div className="w-full px-4 py-8 sm:px-6 md:py-12 lg:px-8 lg:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 lg:gap-24">
        {/* Hero Section */}
        <section className="mx-auto w-full max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            {t('home.hero.title', 'Social Support Portal')}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t('home.hero.description', 'Apply for financial assistance through our secure, AI-enhanced portal. Get intelligent writing assistance and guidance throughout your application process.')}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Button asChild size="lg">
              <Link to="/wizard">
                {t('home.hero.start_application', 'Start Application')}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/components">
                {t('home.hero.view_components', 'View Components')}
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
            {t('home.features.title', 'Why Choose Our Portal?')}
          </h2>
          <dl className="grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full p-6">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </Card>
            ))}
          </dl>
        </section>

        {/* CTA Section */}
        <section className="mx-auto w-full max-w-3xl text-center">
          <Card className="border-primary/20 bg-primary/5 p-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {t('home.cta.title', 'Ready to Apply?')}
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {t('home.cta.description', 'Start your application today with our AI-powered assistance to help you every step of the way.')}
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link to="/wizard">
                  {t('home.cta.button', 'Begin Application')}
                </Link>
              </Button>
            </div>
          </Card>
        </section>

        {/* Development Info */}
        {import.meta.env.DEV && (
          <section className="mx-auto w-full max-w-3xl">
            <Card className="bg-muted/50 p-6">
              <h3 className="mb-4 text-lg font-semibold">Development Information</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• All 5 modules completed successfully</p>
                <p>• Real OpenAI integration with streaming & security</p>
                <p>• Multi-step form with React Hook Form + Zod validation</p>
                <p>• Complete i18n support with Arabic RTL</p>
                <p>• Accessible design with ARIA attributes</p>
                <p>• Auto-save functionality with localStorage</p>
              </div>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
