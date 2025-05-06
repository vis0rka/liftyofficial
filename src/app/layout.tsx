import { cn } from '@/lib/utils'
import { Scripts } from '@/moduls/scripts/Scripts'

import type { Metadata } from 'next'
import { Baloo_Bhai_2, Poppins } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import Providers from './[locale]/providers'
import './globals.css'

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['sans-serif'],
})
const baloo = Baloo_Bhai_2({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['sans-serif'],
    variable: '--font-baloo',
})

export const metadata: Metadata = {
    title: 'Lifty',
    description: 'Lifty Official',
}

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={cn(poppins.className, baloo.variable, 'text-slate-700', 'bg-stone-50')}>
                <Providers>
                    <NuqsAdapter>{children}</NuqsAdapter>
                </Providers>
                <Scripts />
            </body>
        </html>
    )
}
