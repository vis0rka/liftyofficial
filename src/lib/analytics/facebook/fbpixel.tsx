declare global {
    interface Window {
        fbq?: (...args: unknown[]) => void
    }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ''

const FBQ_POLL_MS = 32
const FBQ_READY_TIMEOUT_MS = 10_000

/** Meta standard event `contents` item — id and quantity are required by Meta. */
export type FacebookPixelContent = {
    id: string
    quantity: number
}

/** Meta standard event parameters shared across pixel events. */
export type FacebookPixelEventPayload = {
    content_category?: string
    content_ids?: (string | number)[]
    content_name?: string
    content_type?: 'product' | 'product_group'
    contents?: FacebookPixelContent[]
    currency?: string
    num_items?: number
    predicted_ltv?: number
    search_string?: string
    status?: boolean
    value?: number
}

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

function toFacebookPixelParams(payload: FacebookPixelEventPayload): Record<string, unknown> {
    return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined))
}

function trackEvent(event: string, payload?: FacebookPixelEventPayload) {
    if (typeof window === 'undefined' || !window.fbq || !FB_PIXEL_ID) return
    const params = payload ? toFacebookPixelParams(payload) : {}
    if (Object.keys(params).length > 0) {
        window.fbq('track', event, params)
    } else {
        window.fbq('track', event)
    }
}

export function pageview() {
    trackEvent('PageView')
}

export type ViewContentPayload = Pick<
    FacebookPixelEventPayload,
    'content_category' | 'content_ids' | 'content_name' | 'content_type' | 'contents' | 'currency' | 'value'
>

export function trackViewContent(payload?: ViewContentPayload) {
    trackEvent('ViewContent', {
        content_category: payload?.content_category,
        content_ids: payload?.content_ids,
        content_name: payload?.content_name,
        content_type: payload?.content_type ?? (payload?.content_ids ? 'product' : undefined),
        contents: payload?.contents,
        currency: payload?.currency,
        value: payload?.value,
    })
}

export type InitiateCheckoutPayload = Pick<
    FacebookPixelEventPayload,
    'content_ids' | 'content_type' | 'contents' | 'currency' | 'num_items' | 'value'
> & {
    value: number
    currency: string
}

export function trackInitiateCheckout(payload: InitiateCheckoutPayload) {
    trackEvent('InitiateCheckout', {
        content_ids: payload.content_ids,
        content_type: payload.content_type ?? 'product',
        contents: payload.contents,
        currency: payload.currency,
        num_items: payload.num_items,
        value: payload.value,
    })
}

type CheckoutLineItem = {
    id: string
    quantity: number
}

export function buildInitiateCheckoutPayload(
    items: CheckoutLineItem[],
    totalValue: number,
    currency: string,
): InitiateCheckoutPayload {
    const contents = items.map(item => ({ id: item.id, quantity: item.quantity }))
    const num_items = items.reduce((sum, item) => sum + item.quantity, 0)

    return {
        content_ids: items.map(item => item.id),
        content_type: 'product',
        contents,
        currency,
        num_items,
        value: totalValue,
    }
}

export type AddPaymentInfoPayload = Pick<
    FacebookPixelEventPayload,
    'content_ids' | 'content_type' | 'contents' | 'currency' | 'value'
> & {
    value: number
    currency: string
}

export function trackAddPaymentInfo(payload: AddPaymentInfoPayload) {
    trackEvent('AddPaymentInfo', {
        content_ids: payload.content_ids,
        content_type: payload.content_type ?? 'product',
        contents: payload.contents,
        currency: payload.currency,
        value: payload.value,
    })
}

export function buildAddPaymentInfoPayload(
    items: CheckoutLineItem[],
    totalValue: number,
    currency: string,
): AddPaymentInfoPayload {
    const {
        content_ids,
        content_type,
        contents,
        currency: resolvedCurrency,
        value,
    } = buildInitiateCheckoutPayload(items, totalValue, currency)

    return {
        content_ids,
        content_type,
        contents,
        currency: resolvedCurrency,
        value,
    }
}

export type AddToCartPayload = FacebookPixelEventPayload & {
    content_ids: NonNullable<FacebookPixelEventPayload['content_ids']>
    value: number
    currency: string
    /** Shorthand for a single product add; builds `contents` when omitted. */
    quantity?: number
}

export function trackAddToCart(payload: AddToCartPayload) {
    const quantity = payload.quantity ?? 1
    const contents =
        payload.contents ??
        payload.content_ids.map(id => ({
            id: String(id),
            quantity,
        }))
    const value = payload.contents != null || payload.quantity == null ? payload.value : payload.value * quantity

    trackEvent('AddToCart', {
        content_category: payload.content_category,
        content_ids: payload.content_ids,
        content_name: payload.content_name,
        content_type: payload.content_type ?? 'product',
        contents,
        currency: payload.currency,
        value,
    })
}

export type PurchasePayload = FacebookPixelEventPayload & {
    value: number
    currency: string
}

export function trackPurchase(payload: PurchasePayload) {
    trackEvent('Purchase', {
        content_category: payload.content_category,
        content_ids: payload.content_ids,
        content_name: payload.content_name,
        content_type: payload.content_type ?? 'product',
        contents: payload.contents,
        currency: payload.currency,
        num_items: payload.num_items,
        value: payload.value,
    })
}

export type LeadPayload = Pick<FacebookPixelEventPayload, 'content_category' | 'content_name' | 'status' | 'value'>

/** Hírlevél / lead feliratkozás — Meta standard `Lead` esemény */
export function trackNewsletterSubscribe(payload?: LeadPayload) {
    trackEvent('Lead', {
        status: true,
        ...payload,
    })
}

export { stripeMinorUnitsToDecimal }
