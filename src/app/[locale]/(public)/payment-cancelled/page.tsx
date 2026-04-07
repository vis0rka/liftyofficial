import { PageSection } from '@/components/ui/page-section'
import { Link } from '@/i18n/navigation'
import { wooApi } from '@/lib/api/woo/woo'
import { verifyCheckoutCancelToken } from '@/lib/checkout-cancel-token'
import { getStripeCheckoutSessionIdFromOrder, markOrderAbandonedIfStillPending } from '@/lib/woo/mark-order-abandoned'
import { getTranslations } from 'next-intl/server'

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PaymentCancelledPage({ searchParams }: Props) {
    const t = await getTranslations()
    const params = await searchParams
    const orderIdRaw = params.orderId
    const tokenRaw = params.t

    const orderId = typeof orderIdRaw === 'string' ? orderIdRaw : undefined
    const token = typeof tokenRaw === 'string' ? tokenRaw : undefined

    if (!orderId || !token) {
        return (
            <PageSection className="space-y-4 justify-center items-center my-10">
                <h1 className="heading-1 text-center">{t('Order.payment_cancelled_invalid_link')}</h1>
                <Link href="/" className="underline underline-offset-4">
                    {t('Common.continue_shopping')}
                </Link>
            </PageSection>
        )
    }

    if (!verifyCheckoutCancelToken(orderId, token)) {
        return (
            <PageSection className="space-y-4 justify-center items-center my-10">
                <h1 className="heading-1 text-center">{t('Order.payment_cancelled_invalid_link')}</h1>
                <Link href="/" className="underline underline-offset-4">
                    {t('Common.continue_shopping')}
                </Link>
            </PageSection>
        )
    }

    const id = parseInt(orderId, 10)
    if (Number.isNaN(id)) {
        return (
            <PageSection className="space-y-4 justify-center items-center my-10">
                <h1 className="heading-1 text-center">{t('Order.payment_cancelled_invalid_link')}</h1>
                <Link href="/" className="underline underline-offset-4">
                    {t('Common.continue_shopping')}
                </Link>
            </PageSection>
        )
    }

    const orderBefore = await wooApi.getOrder(id)
    if (!orderBefore) {
        return (
            <PageSection className="space-y-4 justify-center items-center my-10">
                <h1 className="heading-1 text-center">{t('Order.cant_find_your_order')}</h1>
                <Link href="/" className="underline underline-offset-4">
                    {t('Common.continue_shopping')}
                </Link>
            </PageSection>
        )
    }

    const sessionId = getStripeCheckoutSessionIdFromOrder(orderBefore)

    const result = await markOrderAbandonedIfStillPending(id, sessionId, 'user_cancelled')
    const orderAfter = await wooApi.getOrder(id)

    if (result === 'error') {
        return (
            <PageSection className="space-y-4 justify-center items-center my-10">
                <h1 className="heading-1 text-center">{t('Order.payment_cancelled_error')}</h1>
                <Link href="/" className="underline underline-offset-4">
                    {t('Common.continue_shopping')}
                </Link>
            </PageSection>
        )
    }

    if (result === 'updated') {
        return (
            <PageSection className="space-y-4 justify-center items-center my-10">
                <h1 className="heading-1 text-center">{t('Order.payment_cancelled_title')}</h1>
                <p className="~text-base/xl text-center max-w-prose">{t('Order.payment_cancelled_body')}</p>
                <Link href="/shop" className="underline underline-offset-4">
                    {t('Common.continue_shopping')}
                </Link>
            </PageSection>
        )
    }

    const status = orderAfter?.status ?? orderBefore.status
    if (status === 'processing' || status === 'completed') {
        return (
            <PageSection className="space-y-4 justify-center items-center my-10">
                <h1 className="heading-1 text-center">{t('Order.payment_cancelled_already_paid')}</h1>
                <Link href="/shop" className="underline underline-offset-4">
                    {t('Common.continue_shopping')}
                </Link>
            </PageSection>
        )
    }

    if (status === 'cancelled') {
        return (
            <PageSection className="space-y-4 justify-center items-center my-10">
                <h1 className="heading-1 text-center">{t('Order.payment_cancelled_already_cancelled')}</h1>
                <Link href="/shop" className="underline underline-offset-4">
                    {t('Common.continue_shopping')}
                </Link>
            </PageSection>
        )
    }

    return (
        <PageSection className="space-y-4 justify-center items-center my-10">
            <h1 className="heading-1 text-center">{t('Order.payment_cancelled_error')}</h1>
            <Link href="/shop" className="underline underline-offset-4">
                {t('Common.continue_shopping')}
            </Link>
        </PageSection>
    )
}
