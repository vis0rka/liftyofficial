'use client'

import React, { useState } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import { consentPluginConfig } from './consentConfig'
import './cookie-consent.css'

import FacebookPixel from '@/lib/analytics/facebook/facebook'
import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import { useParams } from 'next/navigation'

export const CookieConsentComponent = () => {
    const [marketingAccepted, setMarketingAccepted] = useState(false)
    const [analyticsAccepted, setAnalyticsAccepted] = useState(false)
    const locale = useParams()?.locale

    React.useEffect(() => {
        const syncFromPlugin = () => {
            setAnalyticsAccepted(CookieConsent.acceptedCategory('analytics'))
            setMarketingAccepted(CookieConsent.acceptedCategory('marketing'))
        }
        void CookieConsent.run({
            ...consentPluginConfig,
            onFirstConsent: () => {
                if (CookieConsent.acceptedCategory('analytics')) {
                    setAnalyticsAccepted(true)
                }
                if (CookieConsent.acceptedCategory('marketing')) {
                    setMarketingAccepted(true)
                }
            },
            onConsent: () => {
                if (CookieConsent.acceptedCategory('analytics')) {
                    setAnalyticsAccepted(true)
                }
                if (CookieConsent.acceptedCategory('marketing')) {
                    setMarketingAccepted(true)
                }
            },
            onChange: ({ changedCategories }) => {
                if (changedCategories.includes('analytics')) {
                    if (CookieConsent.acceptedCategory('analytics')) {
                        setAnalyticsAccepted(true)
                    } else {
                        setAnalyticsAccepted(false)
                    }
                }
                if (changedCategories.includes('marketing')) {
                    if (CookieConsent.acceptedCategory('marketing')) {
                        setMarketingAccepted(true)
                    } else {
                        setMarketingAccepted(false)
                    }
                }
            },
        }).then(syncFromPlugin)
    }, [])

    React.useEffect(() => {
        CookieConsent.setLanguage(locale as string)
    }, [locale])

    return (
        <>
            {analyticsAccepted && (
                <>
                    <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID ?? ''} />
                    <Analytics />
                </>
            )}
            {marketingAccepted && <FacebookPixel />}
        </>
    )
}
