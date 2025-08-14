'use client'

import { LoadingButton } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordField } from '@/components/ui/password-field'
import useSession from '@/hooks/useSession'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useModals } from '../ModalService'

interface LoginFormValues {
    email: string
    password: string
}

const LoginModal = () => {
    const { closeModals } = useModals()
    const t = useTranslations()
    const [error, setError] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(false)
    const { login } = useSession()
    const form = useForm<LoginFormValues>({
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data: LoginFormValues) => {
        setError(null)
        setLoading(true)
        try {
            const result = await login({
                email: data.email,
                password: data.password,
            })

            if (result?.error) {
                if (result?.error === 'authentication_failed') {
                    setError(t('Error.invalid_credentials'))
                } else {
                    setError(t('Error.login_error'))
                }
                return
            }
            closeModals()
        } catch (err: any) {
            console.log(err)
            setError(err?.message || t('Common.loginError'))
        } finally {
            setLoading(false)
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
                <DialogTitle>{t('Form.login')}</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
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
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Form.password')}</FormLabel>
                                    <FormControl>
                                        <PasswordField placeholder={t('Form.password')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && <div className="text-destructive text-sm font-medium">{error}</div>}
                        <DialogFooter className="flex sm:flex-col sm:space-y-4 justify-center items-center">
                            <LoadingButton type="submit" className="w-full" isLoading={loading}>
                                {t('Common.login')}
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default LoginModal
