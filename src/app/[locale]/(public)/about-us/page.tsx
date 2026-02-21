import { PageSection } from '@/components/ui/page-section'
import { buildAlternates } from '@/lib/seo/alternates'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale })

    const siteTitle = t('Metadata.title')
    const title = `${siteTitle} | ${t('Common.about_us')}`
    const description = t('Metadata.description')

    return {
        title,
        description,
        alternates: buildAlternates(locale, '/about-us'),
        openGraph: {
            title,
            description,
            type: 'article',
            url: `/${locale}/about-us`,
        },
        twitter: {
            title,
            description,
        },
    }
}

export default async function AboutUsPage() {
    const t = await getTranslations('AboutUs')
    return (
        <PageSection className="max-w-[600px]">
            <div dangerouslySetInnerHTML={{ __html: t.raw('description') }} />
        </PageSection>
    )
}
