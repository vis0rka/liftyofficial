declare global {
    interface Window {
        fbq?: (...args: unknown[]) => void
    }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ''

const FBQ_POLL_MS = 32
const FBQ_READY_TIMEOUT_MS = 10_000

/** Wait until the Meta pixel script is loaded (e.g. after cookie consent). */
export function whenFbqReady(callback: () => void, timeoutMs = FBQ_READY_TIMEOUT_MS): () => void {
    if (typeof window === 'undefined' || !FB_PIXEL_ID) return () => {}
    if (window.fbq) {
        callback()
        return () => {}
    }
    const interval = window.setInterval(() => {
        if (window.fbq) {
            callback()
            window.clearInterval(interval)
            window.clearTimeout(timeout)
        }
    }, FBQ_POLL_MS)
    const timeout = window.setTimeout(() => window.clearInterval(interval), timeoutMs)
    return () => {
        window.clearInterval(interval)
        window.clearTimeout(timeout)
    }
}

function stripeMinorUnitsToDecimal(amount: number | null, currency: string): number {
    if (amount == null) return 0
    const zeroDecimal = new Set([
        'bif',
        'clp',
        'djf',
        'gnf',
        'jpy',
        'kmf',
        'krw',
        'mga',
        'pyg',
        'rwf',
        'ugx',
        'vnd',
        'vuv',
        'xaf',
        'xof',
        'xpf',
    ])
    if (zeroDecimal.has(currency.toLowerCase())) return amount
    return amount / 100
}

export function pageview() {
    if (typeof window === 'undefined' || !window.fbq || !FB_PIXEL_ID) return
    window.fbq('track', 'PageView')
}

export type AddToCartPayload = {
    content_ids: string[]
    content_name?: string
    value: number
    currency: string
    quantity?: number
}

export function trackAddToCart(payload: AddToCartPayload) {
    if (typeof window === 'undefined' || !window.fbq || !FB_PIXEL_ID) return
    const quantity = payload.quantity ?? 1
    window.fbq('track', 'AddToCart', {
        content_ids: payload.content_ids,
        content_type: 'product',
        value: payload.value * quantity,
        currency: payload.currency,
    })
}

export type PurchasePayload = {
    value: number
    currency: string
    content_ids?: string[]
    num_items?: number
}

export function trackPurchase(payload: PurchasePayload) {
    if (typeof window === 'undefined' || !window.fbq || !FB_PIXEL_ID) return
    window.fbq('track', 'Purchase', {
        value: payload.value,
        currency: payload.currency,
        content_ids: payload.content_ids,
        num_items: payload.num_items,
    })
}

/** Hírlevél / lead feliratkozás — Meta standard `Lead` esemény */
export function trackNewsletterSubscribe() {
    if (typeof window === 'undefined' || !window.fbq || !FB_PIXEL_ID) return
    window.fbq('track', 'Lead')
}

export { stripeMinorUnitsToDecimal }
