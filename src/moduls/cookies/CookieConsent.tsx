'use client'

import React, { useState } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import { consentPluginConfig } from './consentConfig'
import './cookie-consent.css'

import { GoogleTagManager } from '@next/third-parties/google'
import { useParams } from 'next/navigation'

export const CookieConsentComponent = () => {
    const [analyticsAccepted, setAnalyticsAccepted] = useState(CookieConsent.acceptedCategory('analytics'))
    const locale = useParams()?.locale

    React.useEffect(() => {
        CookieConsent.run({
            ...consentPluginConfig,
            onConsent: () => {
                setAnalyticsAccepted(CookieConsent.acceptedCategory('analytics'))
            },
            onChange: () => {
                setAnalyticsAccepted(CookieConsent.acceptedCategory('analytics'))
            },
        })
    }, [])

    React.useEffect(() => {
        CookieConsent.setLanguage(locale as string)
    }, [locale])

    return <>{analyticsAccepted && <GoogleTagManager gtmId={process.env.GOOGLE_TAG_MANAGER_ID ?? ''} />}</>
}
