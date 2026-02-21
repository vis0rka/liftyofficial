'use client'

import { ErrorCard } from '@/components/error/ErrorCard'
import { Button } from '@/components/ui/button'
import { PageSection } from '@/components/ui/page-section'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

export default function PaymentSuccessPageError({ error }: { error: Error & { digest?: string }; reset: () => void }) {
    const t = useTranslations()

    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <PageSection className="space-y-6">
            <ErrorCard />
            <Button asChild variant="default">
                <Link href="/" className="mx-auto">
                    {t('Common.Home')}
                </Link>
            </Button>
        </PageSection>
    )
}
