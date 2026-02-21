import { RecentlyViewed } from '@/components/products/recently-viewed/RecentlyViewed'
import { PageSection } from '@/components/ui/page-section'
import { buildAlternates } from '@/lib/seo/alternates'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { englishPrivacyPolicy, germanPrivacyPolicy, polishPrivacyPolicy } from '../../privacy-policy/content'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale })

    const siteTitle = t('Metadata.title')
    const title = `${siteTitle} | ${t('Common.privacy_policy')}`
    const description = t('Metadata.description')

    return {
        title,
        description,
        alternates: buildAlternates(locale, '/privacy-policy'),
        openGraph: {
            title,
            description,
            type: 'article',
            url: `/${locale}/privacy-policy`,
        },
        twitter: {
            title,
            description,
        },
    }
}

const PrivacyPolicy = ({ locale }: { locale: string }) => {
    switch (locale) {
        case 'en':
            return <div dangerouslySetInnerHTML={{ __html: englishPrivacyPolicy }} />
        case 'pl':
            return <div dangerouslySetInnerHTML={{ __html: polishPrivacyPolicy }} />
        case 'de':
            return <div dangerouslySetInnerHTML={{ __html: germanPrivacyPolicy }} />
        default:
            return <div dangerouslySetInnerHTML={{ __html: englishPrivacyPolicy }} />
    }
}

export default async function PrivacyPolicyPage({ params }: { params: { locale: string } }) {
    const { locale } = await params
    const t = await getTranslations('Privacy')
    return (
        <PageSection className="space-y-8 items-center min-h-[600px]">
            <h1 className="text-4xl font-semibold">{t('policy')}</h1>
            <PrivacyPolicy locale={locale} />
            <RecentlyViewed />
        </PageSection>
    )
}
