'use client'
import { CartStoreProvider } from '@/lib/store/useCartStore'
import { CountryStoreProvider } from '@/lib/store/useCountryStore'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReCaptchaProvider } from 'next-recaptcha-v3'
import type * as React from 'react'
import { getQueryClient } from '../../lib/query-client/get-query-client'
export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient()

    return (
        <CartStoreProvider>
            <CountryStoreProvider>
                <QueryClientProvider client={queryClient}>
                    <ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE}>
                        {children}
                    </ReCaptchaProvider>
                    {/*   <ReactQueryDevtools position="left" /> */}
                </QueryClientProvider>
            </CountryStoreProvider>
        </CartStoreProvider>
    )
}
