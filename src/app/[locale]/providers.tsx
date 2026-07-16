'use client'
import { CountryInitializer } from '@/lib/CountryInitializer'
import { CartStoreProvider } from '@/lib/store/useCartStore'
import { CountryStoreProvider } from '@/lib/store/useCountryStore'
import { QueryClientProvider } from '@tanstack/react-query'
import type * as React from 'react'
import { getQueryClient } from '../../lib/query-client/get-query-client'
export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient()

    return (
        <CartStoreProvider>
            <CountryStoreProvider>
                <CountryInitializer />
                <QueryClientProvider client={queryClient}>
                    {children}
                    {/*   <ReactQueryDevtools position="left" /> */}
                </QueryClientProvider>
            </CountryStoreProvider>
        </CartStoreProvider>
    )
}
