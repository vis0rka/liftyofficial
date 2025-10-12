'use server'
import { ProductCard } from '@/components/products/card/ProductCard'
import { getCachedProducts } from '@/lib/api/woo/products/getProducts'
import { getTranslations } from 'next-intl/server'

export const BestSellersProducts = async () => {
    const allProduct = await getCachedProducts()
    const t = await getTranslations()

    if (!allProduct) return null

    const sortedProducts = [...allProduct].sort((a, b) => b.total_sales - a.total_sales).splice(0, 4)

    return (
        <div className="flex w-full flex-col space-y-4">
            <h1 className="heading-1">{t('HomePage.bestsellers')}:</h1>
            <div className="flex flex-nowrap w-full overflow-hidden overflow-x-auto py-4 lg:grid lg:grid-cols-4 lg:overflow-visible gap-4 [&_a]:min-w-[60vw] lg:[&_a]:min-w-auto">
                {sortedProducts.map(product => (
                    <ProductCard key={product.id} product={product} hideViewButton />
                ))}
            </div>
        </div>
    )
}
