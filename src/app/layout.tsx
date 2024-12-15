import { cn } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Baloo_Bhai_2, Poppins } from 'next/font/google'
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
            <body className={cn(poppins.className, baloo.variable, 'text-slate-700')}>
                {children}
                <Analytics />
            </body>
        </html>
    )
}
