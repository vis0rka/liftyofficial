import { TrustWidget } from '@/components/products/TrustWidget'
import { PageSection } from '@/components/ui/page-section'
import { productQueryOption } from '@/lib/api/woo/products/productQueries'
import { KeyFeatures } from '@/moduls/key-features/KeyFeatures'
import { ProductListWithFilters } from '@/moduls/products/ProductListWithFilters'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getTranslations } from 'next-intl/server'
import { getQueryClient } from '../../../lib/query-client/get-query-client'

export default async function ShopPage() {
    const queryClient = getQueryClient()
    const t = await getTranslations()

    void queryClient.prefetchQuery(productQueryOption)

    return (
        <PageSection className="space-y-6">
            <h1 className="heading-1 text-center">
                Lifty {t('Common.premium')} - {t('Common.toddler_carrier', { count: 2 })}
            </h1>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProductListWithFilters />
            </HydrationBoundary>
            <KeyFeatures />
            <p>{t('ShopPage.description')}</p>
            <TrustWidget />
        </PageSection>
    )
}
