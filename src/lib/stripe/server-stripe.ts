import 'server-only'

import Stripe from 'stripe'

export const serverStripe = new Stripe(process.env.STRIPE_API_SECRET!, {
    // https://github.com/stripe/stripe-node#configuration
})
