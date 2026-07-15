'use client'

import { PurchasePayload, trackPurchase, whenFbqReady } from '@/lib/analytics/facebook/fbpixel'
import { useEffect, useRef } from 'react'

type Props = PurchasePayload

/** Egyszeri Purchase esemény sikeres Stripe fizetés után */
export function PaymentSuccessPixel(props: Props) {
    const fired = useRef(false)

    useEffect(() => {
        if (fired.current || props.value <= 0) return

        return whenFbqReady(() => {
            if (fired.current) return
            fired.current = true
            trackPurchase(props)
        })
    }, [props])

    return null
}
