import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_API_SECRET!, {
    // https://github.com/stripe/stripe-node#configuration
})
