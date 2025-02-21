import { stripe } from '@/lib/stripe/stripe'

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
export const dynamic = 'force-dynamic'

export default async function PaymentSuccessPage({ searchParams }: Props) {
    const { session_id } = await searchParams

    const session = await stripe.checkout.sessions.retrieve(session_id)

    console.log(session)

    return (
        <section className="container mx-auto flex flex-col my-10 space-y-4">
            <div>
                <h1 className="~text-xl/4xl">Thank you for your order, {session?.customer_details?.name}!</h1>
            </div>
        </section>
    )
}
