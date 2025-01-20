'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type * as React from 'react'
import { CartProvider as USCProvider } from 'use-shopping-cart'
import { getQueryClient } from './get-query-client'

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <USCProvider
                mode="payment"
                stripe={process.env.STRIPE_KEY!}
                currency={'EUR'}
                billingAddressCollection={true}
                cartMode="client-only"
                successUrl="/success"
                cancelUrl="/"
                shouldPersist={true}
            >
                {children}
            </USCProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}
