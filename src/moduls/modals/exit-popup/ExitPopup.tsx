'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useExitIntent } from '@/hooks/useExitIntent'
import { zodResolver } from '@hookform/resolvers/zod'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const ExitPopup = () => {
    const [isOpen, setOpen] = useState(false)
    const t = useTranslations('ExitPopup')

    const schema = z.object({
        name: z.string().min(1, { message: t('name_required') }),
        email: z
            .string()
            .email({ message: t('email_invalid') })
            .min(1, { message: t('email_required') }),
        consent: z.boolean().refine(val => val === true, { message: t('consent_required') }),
    })

    type CouponFormValues = z.infer<typeof schema>

    const form = useForm<CouponFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            consent: false,
        },
    })

    useExitIntent(() => {
        setOpen(false)
    })

    const onSubmit = (data: CouponFormValues) => {
        console.log('Form submitted with data:', data)
        // Close the modal after submission
        setOpen(false)
        form.reset()
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <VisuallyHidden>
                <DialogTitle>{t('title')}</DialogTitle>
            </VisuallyHidden>
            <DialogContent className="max-w-4xl p-0 gap-0">
                <div className="flex flex-col md:flex-row">
                    {/* Left Section - Form */}
                    <div className="flex-1 p-8 space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">{t('description')}</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('name_label')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('name_placeholder')} {...field} />
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
                                            <FormLabel>{t('email_label')}</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder={t('email_placeholder')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="consent"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="mt-1"
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-sm text-gray-500 font-normal cursor-pointer">
                                                    {t('consent_text')}{' '}
                                                    <a href="/privacy-policy" className="font-bold underline">
                                                        {t('privacy_policy')}
                                                    </a>
                                                    .
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full font-medium py-2 rounded-md">
                                    {t('submit_button')}
                                    <Pencil className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </Form>
                    </div>

                    <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center border-l border-gray-200">
                        <div className="border-2 border-dashed border-amber-700 rounded-lg p-12 text-center min-w-[200px]">
                            <div className="text-5xl font-bold text-amber-900 mb-2">1000 Ft</div>
                            <div className="text-xl text-amber-900">{t('coupon')}</div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
