import { PageSection } from '@/components/ui/page-section'
import { wooApi } from '@/lib/api/woo/woo'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { AccountMenu } from './components/AccountMenu'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Content params={params} />
        </Suspense>
    )
}

async function Content({ params }: { params: Promise<{ locale: string }> }) {
    const session = await getSession()
    console.log('session', session)
    const { locale } = await params
    if (!session.user_email) {
        redirect(`/${locale}/?modal=login`)
    }

    let user = await wooApi.get('customers', {
        email: session.user_email,
    })

    console.log('user', user)
    if (user?.data?.length === 0) {
        user = await wooApi.post('customers', {
            email: session.user_email,
            username: session.user_email.split('@')[0],
            password: Math.random().toString(36).substring(2, 15),
        })
    }

    const orders = await wooApi.get('orders', {
        customer_id: user.data.id,
    })
    console.log('orders', orders)

    const userData = Array.isArray(user.data) ? user.data[0] : user.data
    const ordersData = Array.isArray(orders.data) ? orders.data : []

    return (
        <PageSection className="space-y-4">
            <AccountMenu user={userData} orders={ordersData} />
        </PageSection>
    )
}
