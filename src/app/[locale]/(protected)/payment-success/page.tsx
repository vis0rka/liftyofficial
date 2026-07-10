import { PageSection } from '@/components/ui/page-section'
import { PaymentSuccessPixel } from '@/lib/analytics/facebook/PaymentSuccessPixel'
import { stripeMinorUnitsToDecimal } from '@/lib/analytics/facebook/fbpixel'
import { wooApi } from '@/lib/api/woo/woo'
import { getCheckoutSession } from '@/lib/stripe/server-stripe'
import { Smile } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type Stripe from 'stripe'

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function purchasePixelPropsFromSession(session: Stripe.Checkout.Session) {
    const currency = (session.currency ?? 'eur').toUpperCase()
    const value = stripeMinorUnitsToDecimal(session.amount_total, session.currency ?? 'eur')
    const lineItems = session.line_items?.data ?? []
    const num_items = lineItems.reduce((sum, li) => sum + (li.quantity ?? 0), 0)
    const content_ids = lineItems
        .map(li => {
            const price = li.price
            if (typeof price === 'string' || price == null) return undefined
            const product = price.product
            if (typeof product === 'string') return product
            if (product && typeof product === 'object' && 'metadata' in product && !product.deleted) {
                const metaId = (product as Stripe.Product).metadata?.id
                if (metaId) return String(metaId)
            }
            return undefined
        })
        .filter((id): id is string => Boolean(id))

    return {
        value,
        currency,
        num_items: num_items > 0 ? num_items : undefined,
        content_ids: content_ids.length > 0 ? content_ids : undefined,
    }
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
    const t = await getTranslations()
    const { session_id, orderId } = await searchParams

    if (!session_id || !orderId) {
        return (
            <section className="mx-auto flex flex-col my-10 space-y-4">
                <div>
                    <h1 className="~text-xl/4xl">{t('Order.cant_find_your_order')}</h1>
                </div>
            </section>
        )
    }

    const session = await getCheckoutSession(session_id as string, {
        expand: ['line_items.data.price.product'],
    })

    const sessionOrderId = session.client_reference_id ?? session.metadata?.wooOrderId
    if (sessionOrderId !== String(orderId)) {
        return (
            <section className="mx-auto flex flex-col my-10 space-y-4">
                <div>
                    <h1 className="~text-xl/4xl">{t('Order.cant_find_your_order')}</h1>
                </div>
            </section>
        )
    }

    if (session.payment_status !== 'paid' || session.status !== 'complete') {
        return (
            <section className="mx-auto flex flex-col my-10 space-y-4">
                <div>
                    <h1 className="~text-xl/4xl">{t('Order.cant_find_your_order')}</h1>
                    <h2 className="~text-base/xl">
                        {t('Order.your_payment_status', { status: session.payment_status })}
                    </h2>
                </div>
            </section>
        )
    }

    const wooResult = await wooApi.putOrder(parseInt(orderId as string), {
        status: 'processing',
        transaction_id: session.payment_intent as string,
        set_paid: true,
    })
    return (
        <PageSection className="space-y-4 justify-center items-center">
            {session.amount_total != null && session.amount_total > 0 && (
                <PaymentSuccessPixel {...purchasePixelPropsFromSession(session)} />
            )}
            <Smile size="5em" />
            <h1 className="heading-1 text-center">
                {t('Order.thank_you_order', { name: session?.customer_details?.name ?? '' })}
            </h1>
            <h2 className="heading-2 text-center">
                {t.rich('Order.your_order_id', {
                    important: chunks => <b>{chunks}</b>,
                    orderId: wooResult?.data?.id,
                })}
            </h2>
            <h2 className="heading-2 text-center">
                {t.rich('Order.your_order_status', {
                    important: chunks => <b>{chunks}</b>,
                    status: t('Order.paid'),
                })}
            </h2>
            <p className="~text-base/xl text-center"> {t('Order.confirmation_email_sent')}</p>
        </PageSection>
    )
}
