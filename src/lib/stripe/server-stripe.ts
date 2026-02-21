'use server'

import { cookies, headers } from 'next/headers'
import Stripe from 'stripe'
import { ValidatedItem } from '../actions/checkout'

const serverStripe = new Stripe(process.env.STRIPE_API_SECRET!, {
    // https://github.com/stripe/stripe-node#configuration
})

export async function getCheckoutSession(sessionId: string) {
    const session = await serverStripe.checkout.sessions.retrieve(sessionId)

    return session as Stripe.Checkout.Session
}

export async function createCheckoutSession(products: ValidatedItem[], id: string) {
    const headersList = await headers()

    const cookieStore = await cookies()
    const locale = cookieStore.get('NEXT_LOCALE')?.value

    const session = await serverStripe.checkout.sessions.create({
        mode: 'payment',
        line_items: products,
        client_reference_id: String(id),
        metadata: { wooOrderId: String(id) },
        success_url: `${headersList.get('origin')}/${locale}/payment-success?session_id={CHECKOUT_SESSION_ID}&orderId=${id}`,
        cancel_url: `${headersList.get('origin')}/${locale}/`,
    })

    return session
}
