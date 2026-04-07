'use server'

import { routing } from '@/i18n/routing'
import { signCheckoutCancelToken } from '@/lib/checkout-cancel-token'
import { cookies, headers } from 'next/headers'
import Stripe from 'stripe'
import { ValidatedItem } from '../actions/checkout'

function resolveCheckoutLocale(explicitLocale: string | undefined, cookieLocale: string | undefined): string {
    const fallback = routing.defaultLocale
    const candidate = (explicitLocale ?? cookieLocale ?? fallback).trim() || fallback
    return routing.locales.includes(candidate as (typeof routing.locales)[number]) ? candidate : fallback
}

const serverStripe = new Stripe(process.env.STRIPE_API_SECRET!, {
    // https://github.com/stripe/stripe-node#configuration
})

type CheckoutSessionRetrieveParams = NonNullable<Parameters<Stripe['checkout']['sessions']['retrieve']>[1]>

/** Shorter expiry so `checkout.session.expired` fires sooner than the 24h maximum */
const CHECKOUT_SESSION_EXPIRES_SEC = 30 * 60

export async function getCheckoutSession(sessionId: string, params?: CheckoutSessionRetrieveParams) {
    const session = await serverStripe.checkout.sessions.retrieve(sessionId, params)

    return session as Stripe.Checkout.Session
}

export async function createCheckoutSession(products: ValidatedItem[], id: string, localeHint?: string) {
    const headersList = await headers()

    const cookieStore = await cookies()
    const locale = resolveCheckoutLocale(localeHint, cookieStore.get('NEXT_LOCALE')?.value)

    const cancelToken = signCheckoutCancelToken(String(id))

    const session = await serverStripe.checkout.sessions.create({
        mode: 'payment',
        line_items: products,
        client_reference_id: String(id),
        metadata: { wooOrderId: String(id) },
        success_url: `${headersList.get('origin')}/${locale}/payment-success?session_id={CHECKOUT_SESSION_ID}&orderId=${id}`,
        cancel_url: `${headersList.get('origin')}/${locale}/payment-cancelled?orderId=${id}&t=${encodeURIComponent(cancelToken)}`,
        expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_SESSION_EXPIRES_SEC,
    })

    return session
}
