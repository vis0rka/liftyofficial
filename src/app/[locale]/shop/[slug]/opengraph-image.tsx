import { getCachedProduct } from '@/lib/api/woo/products/getProducts'
import { getTranslations } from 'next-intl/server'
import { ImageResponse } from 'next/og'

export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'
export const alt = 'Premium Hip Carrier for Toddlers'

export default async function Image({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params
    const product = await getCachedProduct(slug)
    const t = await getTranslations({ locale })

    if (!product?.[0]) {
        return new ImageResponse(<div>Product not found</div>, { ...size })
    }

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img src={product?.[0].images[0].src} height="100" alt={t('Metadata.title')} />
            </div>
        ),
        {
            ...size,
        },
    )
}
