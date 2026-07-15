'use client'

import { ReCaptchaProvider } from 'next-recaptcha-v3'
import type * as React from 'react'

export function RecaptchaLayout({ children }: { children: React.ReactNode }) {
    return <ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE}>{children}</ReCaptchaProvider>
}
