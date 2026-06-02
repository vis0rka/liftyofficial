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

    const imageSrc = product[0].images?.[0]?.src
    if (!imageSrc) {
        return new ImageResponse(<div>Product not found</div>, { ...size })
    }

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fafaf9',
                }}
            >
                <img
                    src={imageSrc}
                    width={1200}
                    height={630}
                    alt={t('Metadata.title')}
                    style={{ objectFit: 'cover' }}
                />
            </div>
        ),
        {
            ...size,
        },
    )
}
