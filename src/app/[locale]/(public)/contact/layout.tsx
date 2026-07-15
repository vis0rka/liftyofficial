import { RecaptchaLayout } from '@/components/recaptcha/RecaptchaLayout'
import type * as React from 'react'

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <RecaptchaLayout>{children}</RecaptchaLayout>
}
