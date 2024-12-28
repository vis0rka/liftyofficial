import { ProductListWithFilters } from '@/components/moduls/products/ProductListWithFilters'
import { productQueryOption } from '@/lib/api/woo/products/productQueries'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '../get-query-client'

export default async function ShopPage() {
    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(productQueryOption)

    return (
        <main className="container mx-auto flex flex-col my-10">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProductListWithFilters />
            </HydrationBoundary>
        </main>
    )
}
