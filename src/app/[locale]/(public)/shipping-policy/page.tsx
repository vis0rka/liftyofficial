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
    const title = `${siteTitle} | ${t('Common.shipping')}`
    const description = t('Metadata.description')

    return {
        title,
        description,
        alternates: buildAlternates(locale, '/shipping-policy'),
        openGraph: {
            title,
            description,
            type: 'article',
            url: `/${locale}/shipping-policy`,
        },
        twitter: {
            title,
            description,
        },
    }
}

export default async function ShippingPage() {
    const t = await getTranslations('Shipping')
    return (
        <PageSection className="space-y-8 items-center min-h-[600px]">
            <h1 className="text-4xl font-semibold">{t('policy')}</h1>
            <div className="space-y-4 max-w-4xl">
                <p>{t('first')}</p>
                <p>{t('first-b')}</p>
                <p dangerouslySetInnerHTML={{ __html: t.raw('second') }} />
                <p>{t('third')}</p>
                <p dangerouslySetInnerHTML={{ __html: t.raw('fourth') }} />
                <p>{t('fifth')}</p>
            </div>
            <RecentlyViewed />
        </PageSection>
    )
}
