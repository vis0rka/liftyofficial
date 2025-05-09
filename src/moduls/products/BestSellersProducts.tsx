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
            <h1 className="~text-2xl/4xl">{t('HomePage.bestsellers')}:</h1>
            <div className="flex w-full overflow-x-auto py-4 lg:grid lg:grid-cols-4 lg:overflow-visible gap-4">
                {sortedProducts.map(product => (
                    <ProductCard key={product.id} product={product} hideViewButton />
                ))}
            </div>
        </div>
    )
}
