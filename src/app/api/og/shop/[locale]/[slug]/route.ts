import { getCachedProduct } from '@/lib/api/woo/products/getProducts'
import { NextResponse } from 'next/server'

export const revalidate = 3600

type RouteContext = {
    params: Promise<{ locale: string; slug: string }>
}

export async function GET(_request: Request, { params }: RouteContext) {
    const { slug } = await params
    const product = await getCachedProduct(slug)
    const imageUrl = product?.[0]?.images?.[0]?.src

    if (!imageUrl) {
        return new NextResponse('Not found', { status: 404 })
    }

    const imageResponse = await fetch(imageUrl, { next: { revalidate: 3600 } })

    if (!imageResponse.ok) {
        return new NextResponse('Not found', { status: 404 })
    }

    const contentType = imageResponse.headers.get('content-type') ?? 'image/jpeg'
    const body = await imageResponse.arrayBuffer()

    return new NextResponse(body, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
    })
}
