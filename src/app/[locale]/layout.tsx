import { Footer } from '@/components/footer/Footer'
import { Header } from '@/components/header/Header'
import { routing } from '@/i18n/routing'
import ModalService from '@/moduls/modals/ModalService'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { Runner } from '@/components/features/runner/runner'
import { ExitPopup } from '@/moduls/modals/exit-popup/ExitPopup'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale })

    return {
        title: t('Metadata.title'),
        description: t('Metadata.description'),
        keywords: t('Metadata.keywords')
            .split(',')
            .map(k => k.trim()),
        openGraph: {
            title: t('Metadata.title'),
            description: t('Metadata.description'),
            type: 'website',
        },
    }
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
    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }

    setRequestLocale(locale)

    return (
        <>
            <NextIntlClientProvider>
                <Runner />
                {/*   <Toaster position="top-right" /> */}
                <Suspense fallback={null}>
                    <ModalService />
                </Suspense>
                <Header />
                <main className="pb-8">{children}</main>
                <Footer />
                <ExitPopup />
            </NextIntlClientProvider>
        </>
    )
}
