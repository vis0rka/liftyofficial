/* eslint-disable react/no-children-prop */
'use client'
import { LoadingButton } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ClientOnly } from '@/components/ui/ClientOnly'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link } from '@/i18n/routing'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React from 'react'
import ReactCountryFlag from 'react-country-flag'
import { SubmitHandler, useForm } from 'react-hook-form'
import { formatCurrencyString, useShoppingCart } from 'use-shopping-cart'
import { z } from 'zod'
import europeanCountries from './euCountries.json'

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
    const { cartDetails, formattedTotalPrice } = useShoppingCart()
    const t = useTranslations()
    const [status, setStatus] = React.useState<'idle' | 'loading' | 'error'>('idle')

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
        if (!cartDetails) return
        setStatus('loading')
        const line_items = Object.values(cartDetails).map(item => {
            return {
                product_id: item.product_id,
                quantity: item.quantity,
            }
        })

        const dataToApi = {
            payment_method: 'stripe',
            payment_method_title: 'Stripe',
            status: 'pending',
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
        // Simulate a network request
        console.log(dataToApi)
        /*  try {
            const wooResult = await wooApi.post('orders', dataToApi)

            if (wooResult.data.id) {
                const res = await fetch('/session', {
                    method: 'POST',
                    body: JSON.stringify({ cartProducts: cartDetails, orderId: wooResult.data.id }),
                })
                const data = await res.json()
                const result = await redirectToCheckout(data.sessionId)

                console.log(result)
            }
        } catch (error) {
            console.error(error)
        } */
        setStatus('idle')
    }

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
                            {Object.values(cartDetails ?? {}).map(item => {
                                return (
                                    <div key={item.id} className="w-full relative">
                                        <div className="flex flex-row justify-between items-center">
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={80}
                                                    height={80}
                                                    priority
                                                    style={{ objectFit: 'contain' }}
                                                    className="shadow-sm"
                                                />
                                            )}

                                            <Link href={`/shop/${item?.slug}`} className="ml-4 mr-auto">
                                                <p className="text-sm hover:underline">{item.name}</p>
                                            </Link>
                                            <div className="col-span-3 md:col-span-1 items-end">
                                                <span className="text-right">
                                                    {formatCurrencyString({ value: item.price, currency: 'EUR' })}
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
                            <span className="text-base font-bold">{t('Form.total')}</span>
                            <ClientOnly>
                                <span className="text-base font-bold">{formattedTotalPrice}</span>
                            </ClientOnly>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
