import { wooApi } from '@/lib/api/woo/woo'
import { getCheckoutSession } from '@/lib/stripe/server-stripe'
import { Smile } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const dynamic = 'force-dynamic'

export default async function PaymentSuccessPage({ searchParams }: Props) {
    const t = await getTranslations()
    const { session_id, orderId } = await searchParams

    const session = await getCheckoutSession(session_id as string)

    if (!orderId) {
        return (
            <section className="container mx-auto flex flex-col my-10 space-y-4">
                <div className="">
                    <h1 className="~text-xl/4xl">{t('Order.cant_find_your_order')}</h1>
                    <h2 className="~text-base/xl">
                        {t('Order.your_payment_status', { status: session.payment_status })}
                    </h2>
                </div>
            </section>
        )
    }

    const wooResult = await wooApi.put(
        `orders`,
        {
            status: 'processing',
            transaction_id: session.payment_intent,
            set_paid: true,
        },
        { id: parseInt(orderId as string) },
    )

    return (
        <section className="container mx-auto flex flex-col my-10 space-y-4 justify-center items-center">
            <Smile size="5em" />
            <h1 className="~text-xl/4xl text-center">
                {t('Order.thank_you_order', { name: session?.customer_details?.name })}
            </h1>
            <h2 className="~text-xl/2xl text-center">
                {t.rich('Order.your_order_id', {
                    important: chunks => <b>{chunks}</b>,
                    orderId: wooResult?.data?.id,
                })}
            </h2>
            <h2 className="~text-xl/2xl text-center">
                {t.rich('Order.your_order_status', {
                    important: chunks => <b>{chunks}</b>,
                    status: t('Order.paid'),
                })}
            </h2>
            <p className="~text-base/xl text-center"> {t('Order.confirmation_email_sent')}</p>
        </section>
    )
}
