import { Footer } from '@/components/footer/Footer'
import { Header } from '@/components/header/Header'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Baloo_Bhai_2, Poppins } from 'next/font/google'
import { notFound } from 'next/navigation'
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

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound()
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages()

    return (
        <html lang="en">
            <body className={cn(poppins.className, baloo.variable, 'text-slate-700')}>
                <NextIntlClientProvider messages={messages}>
                    <div className="min-h-100vh">
                        <Header />
                        <main>{children}</main>
                        <Footer />
                    </div>
                </NextIntlClientProvider>
                <Analytics />
            </body>
        </html>
    )
}
