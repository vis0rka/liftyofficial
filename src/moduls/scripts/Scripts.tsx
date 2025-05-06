import { Analytics } from '@vercel/analytics/next'
import { CookieConsentComponent } from '../cookies/CookieConsent'

export const Scripts = () => {
    return (
        <>
            <Analytics />
            <CookieConsentComponent />
        </>
    )
}
