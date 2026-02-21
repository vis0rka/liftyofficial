import { ErrorCard } from '@/components/error/ErrorCard'
import { AddToCartBtnWithFloating } from '@/components/products/card/AddToCartBtnWithFloating'
import { CarrierFeatureVideo } from '@/components/products/carrier/CarrierFeatureVideo'
import { CarrierFeatures } from '@/components/products/carrier/descriptions/features/CarrierFeatures'
import { CarrierLongDescription } from '@/components/products/carrier/descriptions/long/CarrierLongDescription'
import { CarrierShortDescription } from '@/components/products/carrier/descriptions/short/CarrierShortDescription'
import { ProductCarrierChooser } from '@/components/products/carrier/ProductCarrierChooser'
import { ProductCarrierRate } from '@/components/products/carrier/ProductCarrierRate'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageSection } from '@/components/ui/page-section'
import { ProductPrice } from '@/hooks/useGetProductPrice'
import { getCachedProduct } from '@/lib/api/woo/products/getProducts'
import { buildAlternates } from '@/lib/seo/alternates'
import { BestSellersProducts } from '@/moduls/products/BestSellersProducts'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
    params: Promise<{ slug: string; locale: string }>
}

type components = {
    name: (t: any) => string
    features: React.ReactNode
    shortDescription: React.ReactNode
    longDescription: React.ReactNode
    carrierChooser: () => Promise<React.ReactNode>
    carrierRate: () => Promise<React.ReactNode>
    featureVideo: React.ReactNode
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
        featureVideo: <CarrierFeatureVideo key="carrier-feature-video" />,
        carrierChooser: async () => <ProductCarrierChooser />,
        carrierRate: async () => <ProductCarrierRate />,
    },
}

const metadataBase = new URL('https://liftyofficial.com')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params

    const t = await getTranslations({ locale })
    const siteTitle = t('Metadata.title')

    const data = await getCachedProduct(slug)
    const product = data?.[0]

    if (!product) {
        return {
            title: `${siteTitle} | ${t('Common.shop')}`,
            robots: { index: false, follow: false },
            alternates: buildAlternates(locale, `/shop/${slug}`),
        }
    }

    const title = `${product.name} | ${siteTitle}`
    const description = (product.short_description || product.description || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 300)

    const imageUrl = product.images?.[0]?.src || `/${locale}/opengraph-image`

    return {
        title,
        description,
        metadataBase,
        alternates: buildAlternates(locale, `/shop/${slug}`),
        openGraph: {
            title,
            description,
            type: 'article',
            url: `/${locale}/shop/${slug}`,
            images: [{ url: imageUrl }],
        },
        twitter: {
            title,
            description,
            images: [imageUrl],
        },
    }
}

export default async function ProductDetailsPage({ params }: Props) {
    const { slug, locale } = await params

    const data = await getCachedProduct(slug)

    const t = await getTranslations()

    const product = data?.[0]

    if (!product) {
        return <ErrorCard />
    }

    const inStock = product?.stock_quantity > 0 || product.backorders_allowed

    const productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: (product.images || []).map(i => i.src).filter(Boolean),
        description: (product.short_description || product.description || '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim(),
        sku: product.sku || undefined,
        brand: { '@type': 'Brand', name: 'Lifty' },
        offers: {
            '@type': 'Offer',
            url: `${metadataBase.origin}/${locale}/shop/${slug}`,
            price: product.price,
            priceCurrency: 'EUR',
            availability: `https://schema.org/${inStock ? 'InStock' : 'OutOfStock'}`,
        },
    }

    const components = product.tags?.reduce((acc, item) => {
        acc = tagsToComponents[item.name as keyof typeof tagsToComponents]
        return acc
    }, {} as components)

    return (
        <PageSection className="space-y-6">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
            <Breadcrumb />
            <div className="flex flex-col lg:flex-row gap-4">
                <ProductImageGallery images={product.images} className="w-full lg:w-1/2" />
                <Card className="w-full lg:w-1/2 grow-0 shrink-0">
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
                            {await components.carrierRate()}
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
                        {await components.carrierChooser()}
                    </CardContent>
                </Card>
            </div>
            <section className="space-y-4">
                <h2 className="heading-2">{t('Product.description')}</h2>
                <article>{components.longDescription}</article>
            </section>

            <BestSellersProducts />
        </PageSection>
    )
}
