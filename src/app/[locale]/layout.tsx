import { Footer } from '@/components/footer/Footer'
import { Header } from '@/components/header/Header'
import { routing } from '@/i18n/routing'
import ModalService from '@/moduls/modals/ModalService'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

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
        <>
            <NextIntlClientProvider messages={messages}>
                <Toaster position="top-right" />
                <ModalService />
                <Header />
                <main>{children}</main>
            </NextIntlClientProvider>
            <Footer />
        </>
    )
}
