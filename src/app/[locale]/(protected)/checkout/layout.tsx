import { RecaptchaLayout } from '@/components/recaptcha/RecaptchaLayout'
import type * as React from 'react'

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return <RecaptchaLayout>{children}</RecaptchaLayout>
}
