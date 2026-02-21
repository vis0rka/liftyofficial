'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { routes } from '@/utils/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useReCaptcha } from 'next-recaptcha-v3'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const contactSchema = (t: (key: string) => string) =>
    z.object({
        name: z
            .string()
            .trim()
            .min(2, { message: t('validation.nameMin') }),
        email: z
            .string()
            .trim()
            .email({ message: t('validation.emailInvalid') }),
        message: z
            .string()
            .trim()
            .min(10, { message: t('validation.messageMin') }),
        consent: z.boolean().refine(val => val === true, { message: t('validation.consentRequired') }),
    })

type ContactFormValues = z.infer<ReturnType<typeof contactSchema>>

export default function ContantPage() {
    const t = useTranslations('ContactPage')
    const { executeRecaptcha } = useReCaptcha()
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema(t)),
        defaultValues: {
            name: '',
            email: '',
            message: '',
            consent: false,
        },
    })

    const onSubmit = async (data: ContactFormValues) => {
        setSubmitError(null)
        setSubmitSuccess(null)

        try {
            const token = await executeRecaptcha('contact')
            if (!token) {
                setSubmitError(t('messages.error'))
                return
            }

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, token }),
            })

            if (!response.ok) {
                setSubmitError(t('messages.error'))
                return
            }

            setSubmitSuccess(t('messages.success'))
            form.reset()
        } catch {
            setSubmitError(t('messages.error'))
        }
    }

    return (
        <section className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold">{t('title')}</h1>
                <p className="text-muted-foreground">{t('description')}</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('fields.name.label')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('fields.name.placeholder')} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('fields.email.label')}</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder={t('fields.email.placeholder')} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('fields.message.label')}</FormLabel>
                                <FormControl>
                                    <textarea
                                        placeholder={t('fields.message.placeholder')}
                                        rows={6}
                                        className={cn(
                                            'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                                        )}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="consent"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="mt-1"
                                        />
                                    </FormControl>
                                    <FormLabel className="text-sm text-gray-600 font-normal">
                                        {t('consent.text')}{' '}
                                        <Link href={routes.privacy} className="underline font-medium">
                                            {t('consent.linkLabel')}
                                        </Link>
                                        .
                                    </FormLabel>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {submitError && <p className="text-destructive text-sm font-medium">{submitError}</p>}
                    {submitSuccess && <p className="text-green-600 text-sm font-medium">{submitSuccess}</p>}

                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? t('buttons.sending') : t('buttons.submit')}
                    </Button>
                </form>
            </Form>
        </section>
    )
}
