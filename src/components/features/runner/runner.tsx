'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

export const Runner = () => {
    const t = useTranslations()
    const [showRunner, setShowRunner] = React.useState(process.env.NEXT_PUBLIC_SHOW_RUNNER === 'true')

    if (!showRunner) return null

    return (
        <div className="w-full bg-green-800 h-[var(--runner-height)] flex items-center justify-center relative">
            <Button variant="icon" size="icon" className="absolute right-0 top-0" onClick={() => setShowRunner(false)}>
                <X className="h-4 w-4 text-white" />
            </Button>
            <span className="mx-4 text-base md:text-lg font-medium text-white text-center">
                {t('Runner.free_shipping')}
            </span>
        </div>
    )
}
