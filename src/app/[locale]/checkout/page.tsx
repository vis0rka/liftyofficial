'use client'
import { ErrorCard } from '@/components/error/ErrorCard'
import { Button, LoadingButton } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ClientOnly } from '@/components/ui/ClientOnly'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/hooks/useGetProductPrice'
import { Link } from '@/i18n/navigation'
import { checkout, CheckoutActionResponse } from '@/lib/actions/checkout'
import { getTaxRate, GetTaxRateResults } from '@/lib/actions/tax'
import { useCartStore } from '@/lib/store/useCartStore'
import { useCountryStore } from '@/lib/store/useCountryStore'
import { euCountries } from '@/utils/euCountries'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useReCaptcha } from 'next-recaptcha-v3'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import ReactCountryFlag from 'react-country-flag'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = (t: (key: string) => string) =>
    z.object({
        email: z.string().email({ message: t('Validation.email') }),
        newsAndOffers: z.boolean(),
        country: z.string().min(1, { message: t('Validation.country') }),
        firstName: z.string().min(1, { message: t('Validation.firstname') }),
        lastName: z.string().min(1, { message: t('Validation.lastname') }),
        address: z.string().min(1, { message: t('Validation.address') }),
        apartment: z.string().optional(),
        postalCode: z.string().min(1, { message: t('Validation.postalCode') }),
        city: z.string().min(1, { message: t('Validation.city') }),
        dialCode: z.string().min(1, { message: t('Validation.dialcode') }),
        phoneNumber: z.string().min(1, { message: t('Validation.phone') }),
    })

export type CheckoutFormValues = z.infer<ReturnType<typeof schema>>

export default function CartPage() {
    const params = useParams()
    const { items, totalPrice, clearCart } = useCartStore(state => state)
    const t = useTranslations()
    const [status, setStatus] = React.useState<'idle' | 'loading' | 'error' | 'order-success'>('idle')
    const [tax, setTax] = React.useState<GetTaxRateResults>()
    const countryFromStore = useCountryStore(state => state.country)
    const { executeRecaptcha } = useReCaptcha()
    const [stripeSession, setStripeSession] = React.useState<CheckoutActionResponse | null>(null)
    const router = useRouter()

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(schema(t)),
        defaultValues: {
            email: '',
            newsAndOffers: false,
            country: countryFromStore?.code || '',
            firstName: '',
            lastName: '',
            address: '',
            apartment: '',
            postalCode: '',
            city: '',
            dialCode: countryFromStore?.dial_code || '',
            phoneNumber: '',
        },
    })

    const onSubmit: SubmitHandler<CheckoutFormValues> = async data => {
        if (!items.length || !tax) return
        setStatus('loading')

        const token = await executeRecaptcha('checkout')

        try {
            const result = await checkout({
                formData: data,
                products: items,
                currency: countryFromStore.currency,
                lang: params.locale as string,
                taxRate: tax.tax.rate,
                token,
            })

            if (result.id) {
                setStripeSession(result)
                setStatus('order-success')

                return
            }

            console.error(result)
            setStatus('error')
        } catch (error) {
            console.error(error)
            setStatus('error')
        } finally {
            clearCart()
        }
    }

    const country = form.watch('country')

    React.useEffect(() => {
        if (!countryFromStore) return
        form.setValue('dialCode', euCountries.find(c => c.code === countryFromStore.code)?.dial_code || '')
        form.setValue('country', euCountries.find(c => c.code === countryFromStore.code)?.code || '')
    }, [countryFromStore, form])

    React.useEffect(() => {
        if (!country || !totalPrice) return
        const fetchTax = async () => {
            setStatus('loading')
            const tax = await getTaxRate(country, totalPrice)
            setTax(tax)
            setStatus('idle')
        }
        fetchTax()
    }, [country, totalPrice])

    const redirectToCheckout = React.useCallback(async () => {
        if (status === 'order-success' && stripeSession?.url) {
            window.location.href = stripeSession.url
        }
    }, [status, stripeSession]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <section className="container flex flex-col-reverse md:grid md:grid-cols-2 p-4 mx-auto gap-6">
            <div className="flex-1">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl font-bold">{t('Form.contact')}</h1>
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>{t('Form.email')}</FormLabel>
                                            <FormControl className="bg-white">
                                                <Input placeholder={t('Form.email')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={form.control}
                                    name="dialCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('Form.dial_code')}</FormLabel>
                                            <FormControl className="bg-white">
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('Form.select_dial_code')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {euCountries.map(country => (
                                                            <SelectItem key={country.code} value={country.dial_code}>
                                                                <div className="flex items-center gap-2">
                                                                    <ReactCountryFlag
                                                                        countryCode={country.flag}
                                                                        svg
                                                                        style={{ width: '1.5em', height: '1.5em' }}
                                                                    />
                                                                    <span>({country.dial_code})</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>{t('Form.phone_number')}</FormLabel>
                                            <FormControl className="bg-white">
                                                <Input placeholder={t('Form.enter_phone_number')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="newsAndOffers"
                                render={({ field }) => {
                                    return (
                                        <div className="flex flex-row space-x-2">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>{t('Form.email_news')}</FormLabel>
                                            </div>
                                        </div>
                                    )
                                }}
                            />
                        </div>
                        <h1 className="text-2xl font-bold mt-6">{t('Form.delivery')}</h1>
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>{t('Form.country')}</FormLabel>
                                            <FormControl className="bg-white">
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('Form.select_country')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {euCountries.map(country => (
                                                            <SelectItem key={country.code} value={country.code}>
                                                                <div className="flex items-center gap-2">
                                                                    <ReactCountryFlag
                                                                        countryCode={country.flag}
                                                                        svg
                                                                        style={{ width: '1.5em', height: '1.5em' }}
                                                                    />
                                                                    <span>{country.name}</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />
                            <div className="flex flex-row flex-wrap gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="flex-1">
                                                <FormLabel>{t('Form.firstname')}</FormLabel>
                                                <FormControl className="bg-white">
                                                    <Input placeholder={t('Form.firstname')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="flex-1">
                                                <FormLabel>{t('Form.lastname')}</FormLabel>
                                                <FormControl className="bg-white">
                                                    <Input placeholder={t('Form.lastname')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                            </div>
                            <div className="flex flex-row flex-wrap gap-4">
                                <FormField
                                    control={form.control}
                                    name="postalCode"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="flex-1">
                                                <FormLabel>{t('Form.postalcode')}</FormLabel>
                                                <FormControl className="bg-white">
                                                    <Input placeholder={t('Form.postalcode')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="flex-1">
                                                <FormLabel>{t('Form.city')}</FormLabel>
                                                <FormControl className="bg-white">
                                                    <Input placeholder={t('Form.city')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>{t('Form.address')}</FormLabel>
                                            <FormControl className="bg-white">
                                                <Input placeholder={t('Form.street_address')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="apartment"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>{t('Form.apartment')}</FormLabel>
                                            <FormControl className="bg-white">
                                                <Input placeholder={t('Form.apartment_details')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />
                            <div className="flex justify-center items-center flex-col gap-4">
                                {status === 'error' && <ErrorCard title={t('Error.something_went_wrong_checkout')} />}
                                {status === 'order-success' ? (
                                    <Counter redirectToCheckout={redirectToCheckout} />
                                ) : (
                                    <LoadingButton
                                        type="submit"
                                        size="xl"
                                        isLoading={status === 'loading'}
                                        disabled={status === 'error'}
                                    >
                                        {t('Form.place_order')}
                                    </LoadingButton>
                                )}
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="flex-1 ">
                <div className="space-y-8 md:sticky md:top-14">
                    <div>
                        <div className="flex flex-col justify-between items-center w-full space-y-2">
                            {items.map(item => {
                                return (
                                    <div key={item.id} className="w-full relative">
                                        <div className="flex flex-row justify-between items-center">
                                            {item.image && (
                                                <div className="relative">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={80}
                                                        height={80}
                                                        priority
                                                        style={{ objectFit: 'contain' }}
                                                        className="shadow-sm"
                                                    />
                                                    <span className="w-6 h-6 rounded-full absolute top-0 right-0 bg-gray-600 text-white flex justify-center items-center text-sm font-semibold translate-x-1/4 -translate-y-1/4">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                            )}

                                            <Link href={`/shop/${item?.slug}`} className="ml-4 mr-auto">
                                                <p className="text-sm hover:underline">{item.name}</p>
                                            </Link>
                                            <div className="col-span-3 md:col-span-1 items-end">
                                                <span className="text-right">
                                                    {formatPrice(item.price, countryFromStore.currency)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-row justify-between">
                            <span className="text-sm ">{t('Form.shipping')}</span>
                            <span className="text-sm uppercase">{t('Form.free')}</span>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="text-xl font-bold">{t('Form.total')}</span>
                            <ClientOnly>
                                <span className="text-xl font-bold">
                                    {formatPrice(totalPrice, countryFromStore.currency)}
                                </span>
                            </ClientOnly>
                        </div>
                        {tax ? (
                            <div className="flex flex-row justify-start">
                                <span className="text-sm">
                                    {t('Common.checkout_including', {
                                        sign: tax?.tax?.currency || '',
                                        tax: tax.taxAmount?.toFixed(2),
                                    })}
                                </span>
                            </div>
                        ) : null}
                        <Separator />
                    </div>
                </div>
            </div>
        </section>
    )
}

type CounterProps = { redirectToCheckout: () => void }

const Counter = ({ redirectToCheckout }: CounterProps) => {
    const [count, setCount] = React.useState(5)

    const t = useTranslations()

    React.useEffect(() => {
        if (count === 0) {
            redirectToCheckout()
            return
        }

        const timer = setTimeout(() => {
            setCount(prev => prev - 1)
        }, 1000)

        return () => clearTimeout(timer)
    }, [count, redirectToCheckout])

    return (
        <Card className="p-4 bg-green-600  flex flex-col space-y-4">
            <p className="text-white text-center">{t('Form.order_success', { count: count })}</p>
            <div className="flex flex-row justify-center">
                <Button variant="outline" onClick={redirectToCheckout}>
                    {t('Form.start_payment')}
                </Button>
            </div>
        </Card>
    )
}
