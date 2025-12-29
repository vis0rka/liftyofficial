'use client'

import { Button, LoadingButton } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useMagicLink } from '@/hooks/useMagicLink'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useModals } from '../ModalService'

interface LoginFormValues {
    email: string
}

const LoginModal = () => {
    const { closeModals } = useModals()
    const t = useTranslations()
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState<string | null>(null)
    const { mutateAsync: requestMagicLink, isPending: isLoading, isError } = useMagicLink()

    const form = useForm<LoginFormValues>({
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (data: LoginFormValues) => {
        setError(null)
        setSuccess(null)
        try {
            const result = await requestMagicLink({
                email: data.email,
                redirectTo: window.location.pathname,
            })

            if (result.ok) {
                setSuccess(t('Auth.magic_link_sent'))
            } else {
                setError(t('Error.login_error'))
            }
        } catch (err: any) {
            console.error(err)
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 429) {
                    setError(t('Error.too_many_requests') || 'Too many requests. Please try again later.')
                } else if (err.response.status === 400) {
                    setError(t('Error.invalid_email') || 'Please enter a valid email address.')
                } else {
                    setError(t('Error.login_error'))
                }
            } else {
                setError(t('Error.login_error'))
            }
        }
    }

    return (
        <Dialog
            open
            onOpenChange={open => {
                if (!open) {
                    closeModals()
                }
            }}
        >
            <DialogContent>
                <DialogTitle>{t('Auth.magic_link_login')}</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            rules={{
                                required: { value: true, message: t('Form.email_required') || 'Email is required' },
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: t('Form.email_invalid') || 'Please enter a valid email address.',
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Form.email')}</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder={t('Form.email')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && <div className="text-destructive text-sm font-medium">{error}</div>}
                        {success && (
                            <div className="text-green-600 text-sm font-medium bg-green-50 p-3 rounded-md">
                                {success}
                            </div>
                        )}
                        <DialogFooter className="flex sm:flex-col sm:space-y-4 justify-center items-center">
                            <LoadingButton
                                type="submit"
                                className="w-full"
                                isLoading={isLoading}
                                disabled={!!success || !form.formState.isValid}
                            >
                                {success
                                    ? t('Auth.check_email') || 'Check your email'
                                    : t('Auth.send_magic_link') || 'Send Magic Link'}
                            </LoadingButton>
                            {success && (
                                <Button type="button" onClick={closeModals} variant="outline">
                                    {t('Common.close') || 'Close'}
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default LoginModal
