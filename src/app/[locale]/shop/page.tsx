import { KeyFeatures } from '@/components/moduls/key-features/KeyFeatures'
import { ProductListWithFilters } from '@/components/moduls/products/ProductListWithFilters'
import { productQueryOption } from '@/lib/api/woo/products/productQueries'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getTranslations } from 'next-intl/server'
import { getQueryClient } from '../get-query-client'

export default async function ShopPage() {
    const queryClient = getQueryClient()
    const t = await getTranslations()

    void queryClient.prefetchQuery(productQueryOption)

    return (
        <section className="container mx-auto flex flex-col my-10 space-y-4">
            <h1 className="text-center ~text-2xl/4xl">
                Lifty {t('Common.premium')} - {t('Common.toddler_carrier', { count: 2 })}
            </h1>
            <p>{t('ShopPage.description')}</p>
            <KeyFeatures />

            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProductListWithFilters />
            </HydrationBoundary>
        </section>
    )
}
