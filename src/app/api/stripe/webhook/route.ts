import { wooApi } from '@/lib/api/woo/woo'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_SECRET!)

export async function POST(req: NextRequest) {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error('Stripe webhook signature verification failed:', message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.payment_status !== 'paid') {
            return NextResponse.json({ received: true })
        }

        const wooOrderId = session.client_reference_id ?? session.metadata?.wooOrderId
        if (!wooOrderId) {
            console.error('Stripe webhook: no wooOrderId found on session', session.id)
            return NextResponse.json({ error: 'No order reference' }, { status: 400 })
        }

        try {
            await wooApi.putOrder(parseInt(wooOrderId), {
                status: 'processing',
                transaction_id: session.payment_intent as string,
                set_paid: true,
            })
        } catch (err) {
            console.error('Stripe webhook: failed to update WooCommerce order', wooOrderId, err)
            return NextResponse.json({ error: 'Order update failed' }, { status: 500 })
        }
    }

    return NextResponse.json({ received: true })
}
