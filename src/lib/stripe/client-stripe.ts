import { Stripe, loadStripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>
export const getClientStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.STRIPE_API_PUBLIC!)
    }
    return stripePromise
}
