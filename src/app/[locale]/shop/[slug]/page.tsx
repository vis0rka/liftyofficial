import { ErrorCard } from '@/components/error/ErrorCard'
import { AddToCartBtnWithFloating } from '@/components/products/card/AddToCartBtnWithFloating'
import { CarrierFeatures } from '@/components/products/descriptions/features/CarrierFeatures'
import { CarrierLongDescription } from '@/components/products/descriptions/long/CarrierLongDescription'
import { CarrierShortDescription } from '@/components/products/descriptions/short/CarrierShortDescription'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import { AddToRecentlyViewed } from '@/components/products/recently-viewed/AddToRecentlyViewed'
import { RecentlyViewed } from '@/components/products/recently-viewed/RecentlyViewed'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageSection } from '@/components/ui/page-section'
import { ProductPrice } from '@/hooks/useGetProductPrice'
import { getCachedProduct } from '@/lib/api/woo/products/getProducts'
import { BestSellersProducts } from '@/moduls/products/BestSellersProducts'
import { getTranslations } from 'next-intl/server'

type Props = {
    params: Promise<{ slug: string }>
}

type components = {
    name: (t: any) => string
    features: React.ReactNode
    shortDescription: React.ReactNode
    longDescription: React.ReactNode
}

type tagsToComponents = {
    [key: string]: components
}

const tagsToComponents: tagsToComponents = {
    carrier: {
        name: t => `Lifty - ${t('Common.toddler_carrier', { count: 1 })}`,
        features: <CarrierFeatures key="carrier-features" />,
        shortDescription: <CarrierShortDescription key="carrier-short-desc" />,
        longDescription: <CarrierLongDescription key="carrier-long-desc" />,
    },
}

export default async function ProductDetailsPage({ params }: Props) {
    const { slug } = await params

    const data = await getCachedProduct(slug)

    const t = await getTranslations()

    const product = data?.[0]

    if (!product) {
        return <ErrorCard />
    }

    const inStock = product?.stock_quantity > 0 || product.backorders_allowed

    const components = product.tags?.reduce((acc, item) => {
        acc = tagsToComponents[item.name as keyof typeof tagsToComponents]
        return acc
    }, {} as components)

    return (
        <PageSection className="space-y-6">
            <Breadcrumb />
            <div className="flex flex-col lg:flex-row gap-4">
                <ProductImageGallery images={product.images} />
                <Card className="basis-1/2">
                    <CardHeader>
                        <CardTitle>
                            <h1 className="heading-1">{components.name(t)}</h1>
                            <span className="font-sans heading-2">
                                <ProductPrice prices={product.custom_prices} price={product.price} />
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 flex flex-col items-start">
                            {components.features}

                            {components.shortDescription}
                            {inStock ? (
                                <Badge variant="success">{t('Product.in_stock')}</Badge>
                            ) : (
                                <Badge variant="outline">{t('Product.out_stock')}</Badge>
                            )}
                            {
                                <AddToCartBtnWithFloating
                                    name={components.name(t)}
                                    product={product}
                                    buttonProps={{ disabled: !inStock }}
                                />
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>
            <section className="space-y-4">
                <h2 className="heading-2">{t('Product.description')}</h2>
                <article>{components.longDescription}</article>
            </section>

            <BestSellersProducts />
            <AddToRecentlyViewed product={product} />
            <RecentlyViewed />
        </PageSection>
    )
}
