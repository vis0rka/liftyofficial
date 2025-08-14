'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ShopError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const t = useTranslations()
    const router = useRouter()

    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Shop page error:', error)
    }, [error])

    const handleGoHome = () => {
        router.push('/')
    }

    const handleTryAgain = () => {
        reset()
    }

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[60vh] px-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <svg
                            className="h-8 w-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <CardTitle className="text-xl text-red-600">
                        {t('Error.title', { defaultValue: 'Something went wrong!' })}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        {t('Error.shopMessage', {
                            defaultValue:
                                'Sorry about the error. We encountered a problem while loading the shop page.',
                        })}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                        <p className="font-mono text-xs break-all">{error.message || 'Unknown error occurred'}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={handleGoHome} className="flex-1 bg-blue-600 hover:bg-blue-700">
                            {t('Error.goHome', { defaultValue: 'Go to Homepage' })}
                        </Button>

                        <Button onClick={handleTryAgain} variant="outline" className="flex-1">
                            {t('Error.tryAgain', { defaultValue: 'Try Again' })}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
