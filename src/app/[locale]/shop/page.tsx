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
        <section className="container mx-auto flex flex-col my-10 space-y-4">
            <h1 className="text-center ~text-2xl/4xl">
                Lifty {t('Common.premium')} - {t('Common.toddler_carrier', { count: 2 })}
            </h1>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProductListWithFilters />
            </HydrationBoundary>
            <p>{t('ShopPage.description')}</p>
            <KeyFeatures />
        </section>
    )
}
