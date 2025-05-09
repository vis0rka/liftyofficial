'use client'

import { ErrorCard } from '@/components/error/ErrorCard'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect } from 'react'

export default function PaymentSuccessPageError({ error }: { error: Error & { digest?: string }; reset: () => void }) {
    const t = useTranslations()

    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <main className="container mx-auto flex flex-col my-10 space-y-6">
            <ErrorCard />
            <Button asChild variant="default">
                <Link href="/" className="mx-auto">
                    {t('Common.Home')}
                </Link>
            </Button>
        </main>
    )
}
