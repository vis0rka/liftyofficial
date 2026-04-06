'use client'

import { trackPurchase } from '@/lib/analytics/facebook/fbpixel'
import { useEffect, useRef } from 'react'

type Props = {
    value: number
    currency: string
    content_ids?: string[]
    num_items?: number
}

/** Egyszeri Purchase esemény sikeres Stripe fizetés után */
export function PaymentSuccessPixel({ value, currency, content_ids, num_items }: Props) {
    const fired = useRef(false)

    useEffect(() => {
        if (fired.current || value <= 0) return
        fired.current = true
        trackPurchase({ value, currency, content_ids, num_items })
    }, [value, currency, content_ids, num_items])

    return null
}
