'use client'

import { useGetProductPrice } from '@/hooks/useGetProductPrice'
import { useCountryStore } from '@/lib/store/useCountryStore'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'

import { trackViewContent, whenFbqReady, type ViewContentPayload } from './fbpixel'

type ViewContentRegistry = {
    setPayload: (payload: ViewContentPayload | undefined) => void
}

const ViewContentContext = createContext<ViewContentRegistry | null>(null)

export function ViewContentProvider({ children }: { children: ReactNode }) {
    const payloadRef = useRef<ViewContentPayload | undefined>(undefined)
    const pathname = usePathname()

    const registry = useMemo<ViewContentRegistry>(
        () => ({
            setPayload: payload => {
                payloadRef.current = payload
            },
        }),
        [],
    )

    useEffect(() => {
        return whenFbqReady(() => {
            queueMicrotask(() => trackViewContent(payloadRef.current))
        })
    }, [pathname])

    return <ViewContentContext.Provider value={registry}>{children}</ViewContentContext.Provider>
}

type ViewContentProductProps = {
    productId: number
    productName: string
    contentCategory?: string
    price: string
    customPrices?: string
}

/** Registers product data for the current page's ViewContent event. */
export function ViewContentProduct({
    productId,
    productName,
    contentCategory,
    price,
    customPrices,
}: ViewContentProductProps) {
    const registry = useContext(ViewContentContext)
    const { country } = useCountryStore(state => state)
    const { price: resolvedPrice } = useGetProductPrice({ prices: customPrices, price })
    const currency = country?.currency ?? 'EUR'
    const productIdStr = productId.toString()

    useLayoutEffect(() => {
        if (!registry) return

        registry.setPayload({
            content_ids: [productIdStr],
            content_name: productName,
            content_category: contentCategory,
            content_type: 'product',
            contents: [{ id: productIdStr, quantity: 1 }],
            currency,
            value: resolvedPrice,
        })

        return () => registry.setPayload(undefined)
    }, [registry, productIdStr, productName, contentCategory, currency, resolvedPrice])

    return null
}
