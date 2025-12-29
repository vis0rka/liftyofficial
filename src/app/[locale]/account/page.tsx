import { PageSection } from '@/components/ui/page-section'
import { Skeleton } from '@/components/ui/skeleton'
import { wooApi } from '@/lib/api/woo/woo'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { AccountMenu } from './components/AccountMenu'

const PageLoader: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Skeleton className="w-100 h-60" />
        </div>
    )
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
    return (
        <Suspense fallback={<PageLoader />}>
            <Content params={params} />
        </Suspense>
    )
}

async function Content({ params }: { params: Promise<{ locale: string }> }) {
    const session = await getSession()

    const { locale } = await params
    if (!session.user_email) {
        redirect(`/${locale}/?modal=login`)
    }

    let userArray = await wooApi.getCustomer(session.user_email)

    let userData
    if (userArray?.length === 0) {
        const newUser = await wooApi.postCustomer({
            email: session.user_email,
            username: session.user_email.split('@')[0],
            password: Math.random().toString(36).substring(2, 15),
        })
        userData = newUser
    } else {
        userData = userArray?.[0]
    }

    if (!userData) {
        redirect(`/${locale}/?modal=login`)
    }

    const orders = await wooApi.getOrders({
        customer_id: userData.id,
    })

    const ordersData = Array.isArray(orders) ? orders : []

    return (
        <PageSection className="space-y-4 items-center justify-center">
            <AccountMenu user={userData} orders={ordersData} />
        </PageSection>
    )
}
