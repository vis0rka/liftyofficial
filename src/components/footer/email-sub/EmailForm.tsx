'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { subscribeToEmailList } from '@/lib/mailer/mailerLiteApi'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface EmailFormValues {
    email: string
}

export const EmailForm = () => {
    const t = useTranslations()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const form = useForm<EmailFormValues>({
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (data: EmailFormValues) => {
        setError(null)
        setSuccess(null)
        try {
            const result = await subscribeToEmailList(data.email)
            if (result.success && result.data?.data?.id) {
                setSuccess(t('Form.email_subscription_success'))
                form.reset()
            } else {
                setError(t('Form.email_subscription_error'))
            }
        } catch (error) {
            setError(t('Form.email_subscription_error'))
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    rules={{
                        required: { value: true, message: t('Form.email_required') },
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: t('Form.email_invalid'),
                        },
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="email" placeholder={t('Form.email')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && <div className="text-destructive text-sm font-medium">{error}</div>}
                {success && (
                    <div className="text-green-600 text-sm font-medium bg-green-50 p-3 rounded-md">{success}</div>
                )}
                <Button type="submit">{t('Common.subscribe')}</Button>
            </form>
        </Form>
    )
}
