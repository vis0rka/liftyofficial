import { wordpressApi } from '@/lib/api/wordpress/wordpressApi'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

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

    const { locale } = await params
    if (!session.user_id || !session.token) {
        redirect(`/${locale}/?modal=login`)
    }

    const user = await wordpressApi.getUser(session.user_id, session.token)

    return <section className="container mx-auto flex flex-col my-10 space-y-4"></section>
}
