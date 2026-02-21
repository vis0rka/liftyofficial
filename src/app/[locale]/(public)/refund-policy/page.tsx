import { RecentlyViewed } from '@/components/products/recently-viewed/RecentlyViewed'
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
    const title = `${siteTitle} | ${t('Common.refund')}`
    const description = t('Metadata.description')

    return {
        title,
        description,
        alternates: buildAlternates(locale, '/refund-policy'),
        openGraph: {
            title,
            description,
            type: 'article',
            url: `/${locale}/refund-policy`,
        },
        twitter: {
            title,
            description,
        },
    }
}

export default async function RefundPage() {
    const t = await getTranslations('Refund')
    return (
        <PageSection className="space-y-8 items-center min-h-[600px]">
            <h1 className="heading-1">{t('policy')}</h1>
            <div className="space-y-4 max-w-4xl">
                <p dangerouslySetInnerHTML={{ __html: t.raw('first') }} />

                <p dangerouslySetInnerHTML={{ __html: t.raw('second') }} />
                <p dangerouslySetInnerHTML={{ __html: t.raw('third') }} />

                <p dangerouslySetInnerHTML={{ __html: t.raw('fourth') }} />
                <p dangerouslySetInnerHTML={{ __html: t.raw('fifth') }} />
            </div>
            <RecentlyViewed />
        </PageSection>
    )
}
