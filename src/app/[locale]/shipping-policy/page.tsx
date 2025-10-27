import { RecentlyViewed } from '@/components/products/recently-viewed/RecentlyViewed'
import { PageSection } from '@/components/ui/page-section'
import { getTranslations } from 'next-intl/server'

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
