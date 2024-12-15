import { Footer } from '@/components/footer/Footer'
import { Header } from '@/components/header/Header'
import { routing } from '@/i18n/routing'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

export default async function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound()
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages()

    return (
        <>
            <Header />
            <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
            <Footer />
        </>
    )
}
