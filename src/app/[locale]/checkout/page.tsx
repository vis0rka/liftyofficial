'use client'
import { LoadingButton } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ClientOnly } from '@/components/ui/ClientOnly'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/hooks/useGetProductPrice'
import { Link } from '@/i18n/routing'
import { getTaxRate, GetTaxRateResults } from '@/lib/actions/tax'
import { wooApi } from '@/lib/api/woo/woo'
import { useCartStore } from '@/lib/store/useCartStore'
import { useCountryStore } from '@/lib/store/useCountryStore'
import { getClientStripe } from '@/lib/stripe/client-stripe'
import europeanCountries from '@/utils/euCountries.json'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useParams } from 'next/navigation'
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

type FormValues = z.infer<ReturnType<typeof schema>>

export default function CartPage() {
    const params = useParams()
    const { items, totalPrice } = useCartStore(state => state)
    const t = useTranslations()
    const [status, setStatus] = React.useState<'idle' | 'loading' | 'error'>('idle')
    const [tax, setTax] = React.useState<GetTaxRateResults>()
    const countryFromStore = useCountryStore(state => state.country)

    const form = useForm<FormValues>({
        resolver: zodResolver(schema(t)),
        defaultValues: {
            email: '',
            newsAndOffers: false,
            country: '',
            firstName: '',
            lastName: '',
            address: '',
            apartment: '',
            postalCode: '',
            city: '',
            dialCode: '',
            phoneNumber: '',
        },
    })

    const onSubmit: SubmitHandler<FormValues> = async data => {
        if (!items.length || !tax) return
        setStatus('loading')
        const line_items = items.map(item => {
            return {
                product_id: item.id,
                quantity: item.quantity,
                subtotal: (item.price / (1 + tax.tax.rate) / 100).toString(),
                total: (item.price / (1 + tax.tax.rate) / 100).toString(),
            }
        })

        const dataToApi = {
            payment_method: 'stripe',
            payment_method_title: 'Stripe',
            status: 'pending',
            currency: countryFromStore?.currency,
            billing: {
                first_name: data.firstName,
                last_name: data.lastName,
                address_1: data.address,
                address_2: data?.apartment ?? '',
                city: data.city,
                postcode: data.postalCode,
                country: data.country,
                email: data.email,
                phone: data.dialCode + data.phoneNumber,
            },
            shipping: {
                first_name: data.firstName,
                last_name: data.lastName,
                address_1: data.address,
                address_2: data.apartment ?? '',
                city: data.city,
                postcode: data.postalCode,
                country: data.country,
            },
            line_items: line_items,
            meta_data: [
                {
                    key: 'lang',
                    value: params?.locale,
                },
            ],
        }

        try {
            const wooResult = await wooApi.post('orders', dataToApi)

            if (wooResult.data.id) {
                const checkoutSession = await axios.post('/api/checkout-session', {
                    body: JSON.stringify({
                        orderId: wooResult.data.id,
                        cartProducts: items,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                console.log(checkoutSession)
                const clientStripe = await getClientStripe()
                const result = await clientStripe?.redirectToCheckout({
                    sessionId: checkoutSession.data.sessionId,
                })
                console.log(result)
            }
        } catch (error) {
            console.error(error)
        }
        setStatus('idle')
    }

    const country = form.watch('country')

    React.useEffect(() => {
        if (!country || !totalPrice) return
        const fetchTax = async () => {
            setStatus('loading')
            const tax = await getTaxRate(country, totalPrice)
            console.log(tax)
            setTax(tax)
            setStatus('idle')
        }
        fetchTax()
    }, [country, totalPrice])

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
                                                        {europeanCountries.map(country => (
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
                                                        {europeanCountries.map(country => (
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
                            <div className="flex justify-center">
                                <LoadingButton type="submit" size="xl" isLoading={status === 'loading'}>
                                    {t('Form.place_order')}
                                </LoadingButton>
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
                                        sign: tax?.tax?.currency,
                                        tax: tax.taxAmount.toFixed(2),
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
