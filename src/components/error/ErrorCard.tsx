'use client'

import { useTranslations } from 'next-intl'
import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'

interface Props {
    title?: React.ReactNode
    desc?: React.ReactNode
}

export const ErrorCard: React.FC<Props> = ({ title, desc }) => {
    const t = useTranslations()

    return (
        <Card className="mx-auto w-full max-w-[500px] mt-8 bg-gradient-to-b from-red-100 to-white border-red-600">
            <CardHeader>
                <CardTitle className="font-semibold">{title ?? t('Error.something_went_wrong')}</CardTitle>
                <CardDescription>
                    {desc ?? t('Error.contact')} <a href="mailto:info@liftyofficial.com">info@liftyofficial.com</a>
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
