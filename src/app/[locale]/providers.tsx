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
                stripe={process.env.STRIPE_API_PUBLIC!}
                currency={'EUR'}
                cartMode="checkout-session"
                shouldPersist={true}
            >
                {children}
            </USCProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}
