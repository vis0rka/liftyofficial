import { wooApi } from '@/lib/api/woo/woo'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_SECRET!)

export type AbandonReason = 'stripe_session_expired' | 'user_cancelled'

function isSessionPaid(session: Stripe.Checkout.Session): boolean {
    return session.payment_status === 'paid' && session.status === 'complete'
}

/**
 * Sets Woo order to `cancelled` with `_abandoned_checkout` meta only if still `pending`
 * and Stripe does not show a completed paid Checkout session. Reduces races with `checkout.session.completed`.
 */
export async function markOrderAbandonedIfStillPending(
    wooOrderId: number,
    stripeSessionId: string | undefined,
    reason: AbandonReason,
): Promise<'updated' | 'skipped' | 'error'> {
    try {
        if (stripeSessionId) {
            const s = await stripe.checkout.sessions.retrieve(stripeSessionId)
            if (isSessionPaid(s)) return 'skipped'
        }

        const order = await wooApi.getOrder(wooOrderId)
        if (!order || order.status !== 'pending') return 'skipped'

        if (stripeSessionId) {
            const s2 = await stripe.checkout.sessions.retrieve(stripeSessionId)
            if (isSessionPaid(s2)) return 'skipped'
        }

        const order2 = await wooApi.getOrder(wooOrderId)
        if (!order2 || order2.status !== 'pending') return 'skipped'

        const mergedMeta: Array<{ id?: number; key: string; value: string }> = (order2.meta_data ?? [])
            .filter(m => m.key !== '_abandoned_checkout')
            .map(m => ({ id: m.id, key: m.key, value: String(m.value) }))
        mergedMeta.push({ key: '_abandoned_checkout', value: reason })

        await wooApi.putOrder(wooOrderId, {
            status: 'cancelled',
            meta_data: mergedMeta,
        })
        return 'updated'
    } catch (e) {
        console.error('markOrderAbandonedIfStillPending', wooOrderId, e)
        return 'error'
    }
}

export function getStripeCheckoutSessionIdFromOrder(order: {
    meta_data?: Array<{ key: string; value: string }>
}): string | undefined {
    const entry = order.meta_data?.find(m => m.key === 'stripe_checkout_session_id')
    return entry?.value
}
