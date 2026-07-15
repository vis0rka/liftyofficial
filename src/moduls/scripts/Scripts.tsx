'use client'

import dynamic from 'next/dynamic'

const CookieConsentComponent = dynamic(() => import('../cookies/CookieConsent').then(m => m.CookieConsentComponent), {
    ssr: false,
})

export const Scripts = () => {
    return (
        <>
            <CookieConsentComponent />
        </>
    )
}
