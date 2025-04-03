'use client'
import { CartStoreProvider } from '@/lib/store/useCartStore'
import { CountryStoreProvider } from '@/lib/store/useCountryStore'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type * as React from 'react'
import { getQueryClient } from './get-query-client'

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient()

    return (
        <CartStoreProvider>
            <CountryStoreProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                    <ReactQueryDevtools />
                </QueryClientProvider>
            </CountryStoreProvider>
        </CartStoreProvider>
    )
}
